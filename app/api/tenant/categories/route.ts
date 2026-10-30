import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext, requireTenantRole } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { TenantRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  const tenantAuth = await requireTenantContext(request)
  if (tenantAuth instanceof NextResponse) return tenantAuth

  const categories = await prisma.category.findMany({
    where: {
      tenantId: tenantAuth.tenant.id,
    },
    orderBy: { displayOrder: 'asc' },
  })

  return NextResponse.json({ categories })
}

export async function POST(request: NextRequest) {
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  try {
    const body = await request.json()
    const { name, slug, color, displayOrder } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Category name and slug are required' },
        { status: 400 }
      )
    }

    const cleanSlug = slug.toLowerCase().trim()

    const existing = await prisma.category.findFirst({
      where: {
        tenantId: tenantAuth.tenant.id,
        OR: [{ name: name.trim() }, { slug: cleanSlug }],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A category with this name or slug already exists in your institution' },
        { status: 409 }
      )
    }

    const category = await prisma.category.create({
      data: {
        tenantId: tenantAuth.tenant.id, // Strictly derived
        name: name.trim(),
        slug: cleanSlug,
        color: color || '#3F7CE0',
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        isSystem: false,
      },
    })

    await createAuditLog({
      tenantId: tenantAuth.tenant.id,
      actorUserId: tenantAuth.user.id,
      actorRole: tenantAuth.membership.role,
      action: 'CATEGORY_CREATED',
      resourceType: 'CATEGORY',
      resourceId: category.id,
      details: { name: category.name, slug: category.slug },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true, category }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Internal server error creating category' },
      { status: 500 }
    )
  }
}
