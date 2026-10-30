import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext, requireTenantRole } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { TenantRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  const tenantAuth = await requireTenantContext(request)
  if (tenantAuth instanceof NextResponse) return tenantAuth

  const searchParams = request.nextUrl.searchParams
  const departmentId = searchParams.get('departmentId')

  const sections = await prisma.section.findMany({
    where: {
      tenantId: tenantAuth.tenant.id,
      isActive: true,
      ...(departmentId ? { departmentId } : {}),
    },
    include: {
      department: true,
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ sections })
}

export async function POST(request: NextRequest) {
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  try {
    const body = await request.json()
    const { name, departmentId } = body

    if (!name || !departmentId) {
      return NextResponse.json(
        { error: 'Section name and departmentId are required' },
        { status: 400 }
      )
    }

    // CROSS-TENANT MANIPULATION PREVENTION:
    // Verify that the referenced department belongs to the authorized tenant
    const department = await prisma.department.findFirst({
      where: {
        id: departmentId,
        tenantId: tenantAuth.tenant.id,
      },
    })

    if (!department) {
      return NextResponse.json(
        { error: 'Invalid department: Department does not exist within your institution' },
        { status: 404 }
      )
    }

    const cleanName = name.trim()

    const existing = await prisma.section.findUnique({
      where: {
        tenantId_departmentId_name: {
          tenantId: tenantAuth.tenant.id,
          departmentId: department.id,
          name: cleanName,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A section with this name already exists in this department' },
        { status: 409 }
      )
    }

    const section = await prisma.section.create({
      data: {
        tenantId: tenantAuth.tenant.id,
        departmentId: department.id,
        name: cleanName,
      },
      include: { department: true },
    })

    await createAuditLog({
      tenantId: tenantAuth.tenant.id,
      actorUserId: tenantAuth.user.id,
      actorRole: tenantAuth.membership.role,
      action: 'SECTION_CREATED',
      resourceType: 'SECTION',
      resourceId: section.id,
      details: { name: section.name, departmentId: department.id },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true, section }, { status: 201 })
  } catch (error) {
    console.error('Create section error:', error)
    return NextResponse.json(
      { error: 'Internal server error creating section' },
      { status: 500 }
    )
  }
}
