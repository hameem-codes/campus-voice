import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext, requireTenantRole } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { TenantRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  const tenantAuth = await requireTenantContext(request)
  if (tenantAuth instanceof NextResponse) return tenantAuth

  const departments = await prisma.department.findMany({
    where: {
      tenantId: tenantAuth.tenant.id,
      isActive: true,
    },
    include: {
      _count: {
        select: {
          sections: true,
          courses: true,
          memberships: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ departments })
}

export async function POST(request: NextRequest) {
  // Only Tenant Admin can create departments
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  try {
    const body = await request.json()
    const { name, code } = body

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Department name and code are required' },
        { status: 400 }
      )
    }

    const cleanCode = code.toUpperCase().trim()

    // Enforce uniqueness within the current tenant
    const existing = await prisma.department.findUnique({
      where: {
        tenantId_code: {
          tenantId: tenantAuth.tenant.id,
          code: cleanCode,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A department with this code already exists in your institution' },
        { status: 409 }
      )
    }

    const department = await prisma.department.create({
      data: {
        tenantId: tenantAuth.tenant.id, // Strictly derived from authorized context
        name: name.trim(),
        code: cleanCode,
      },
    })

    await createAuditLog({
      tenantId: tenantAuth.tenant.id,
      actorUserId: tenantAuth.user.id,
      actorRole: tenantAuth.membership.role,
      action: 'DEPARTMENT_CREATED',
      resourceType: 'DEPARTMENT',
      resourceId: department.id,
      details: { name: department.name, code: department.code },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true, department }, { status: 201 })
  } catch (error) {
    console.error('Create department error:', error)
    return NextResponse.json(
      { error: 'Internal server error creating department' },
      { status: 500 }
    )
  }
}
