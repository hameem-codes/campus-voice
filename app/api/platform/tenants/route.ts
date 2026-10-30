import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

export async function GET(request: NextRequest) {
  const auth = await requirePlatformAdmin(request)
  if (auth instanceof NextResponse) return auth

  const tenants = await prisma.tenant.findMany({
    include: {
      settings: true,
      _count: {
        select: {
          memberships: true,
          departments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ tenants })
}

export async function POST(request: NextRequest) {
  const auth = await requirePlatformAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { name, slug, domain, themePrimaryColor } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Tenant name and slug are required' },
        { status: 400 }
      )
    }

    const cleanSlug = slug.toLowerCase().trim()

    const existing = await prisma.tenant.findUnique({
      where: { slug: cleanSlug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'An institution with this slug already exists' },
        { status: 409 }
      )
    }

    const newTenant = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name,
          slug: cleanSlug,
          domain: domain || null,
          settings: {
            create: {
              themePrimaryColor: themePrimaryColor || '#3F7CE0',
            },
          },
        },
        include: { settings: true },
      })

      // Seed foundational system categories for the new institution
      const defaultCategories = [
        { name: 'Exams', slug: 'exams', color: '#E05A47', displayOrder: 1 },
        { name: 'Fee Deadlines', slug: 'fees', color: '#E07A2F', displayOrder: 2 },
        { name: 'Timetable', slug: 'timetable', color: '#3F7CE0', displayOrder: 3 },
        { name: 'Placements', slug: 'placements', color: '#2B8A3E', displayOrder: 4 },
        { name: 'Events', slug: 'events', color: '#845EC2', displayOrder: 5 },
        { name: 'Holidays', slug: 'holidays', color: '#6C757D', displayOrder: 6 },
        { name: 'Scholarships', slug: 'scholarships', color: '#008F7A', displayOrder: 7 },
        { name: 'Results', slug: 'results', color: '#D65DB1', displayOrder: 8 },
      ]

      await tx.category.createMany({
        data: defaultCategories.map((c) => ({
          tenantId: tenant.id,
          name: c.name,
          slug: c.slug,
          color: c.color,
          displayOrder: c.displayOrder,
          isSystem: true,
        })),
      })

      return tenant
    })

    await createAuditLog({
      tenantId: newTenant.id,
      actorUserId: auth.user.id,
      actorRole: auth.user.globalRole,
      action: 'PLATFORM_TENANT_PROVISIONED',
      resourceType: 'TENANT',
      resourceId: newTenant.id,
      details: { name: newTenant.name, slug: newTenant.slug },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true, tenant: newTenant }, { status: 201 })
  } catch (error) {
    console.error('Create tenant error:', error)
    return NextResponse.json(
      { error: 'Internal server error creating tenant' },
      { status: 500 }
    )
  }
}
