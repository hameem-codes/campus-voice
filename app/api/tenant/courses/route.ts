import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext, requireTenantRole } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { TenantRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  const tenantAuth = await requireTenantContext(request)
  if (tenantAuth instanceof NextResponse) return tenantAuth

  const courses = await prisma.course.findMany({
    where: {
      tenantId: tenantAuth.tenant.id,
      isActive: true,
    },
    include: {
      department: true,
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ courses })
}

export async function POST(request: NextRequest) {
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  try {
    const body = await request.json()
    const { name, code, departmentId } = body

    if (!name || !code || !departmentId) {
      return NextResponse.json(
        { error: 'Course name, code, and departmentId are required' },
        { status: 400 }
      )
    }

    // Verify department belongs to the authorized tenant
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

    const cleanCode = code.toUpperCase().trim()

    const existing = await prisma.course.findUnique({
      where: {
        tenantId_code: {
          tenantId: tenantAuth.tenant.id,
          code: cleanCode,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A course with this code already exists in your institution' },
        { status: 409 }
      )
    }

    const course = await prisma.course.create({
      data: {
        tenantId: tenantAuth.tenant.id,
        departmentId: department.id,
        name: name.trim(),
        code: cleanCode,
      },
      include: { department: true },
    })

    await createAuditLog({
      tenantId: tenantAuth.tenant.id,
      actorUserId: tenantAuth.user.id,
      actorRole: tenantAuth.membership.role,
      action: 'COURSE_CREATED',
      resourceType: 'COURSE',
      resourceId: course.id,
      details: { name: course.name, code: course.code, departmentId: department.id },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true, course }, { status: 201 })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: 'Internal server error creating course' },
      { status: 500 }
    )
  }
}
