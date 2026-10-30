import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext, requireTenantRole } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { TenantRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  const tenantAuth = await requireTenantContext(request)
  if (tenantAuth instanceof NextResponse) return tenantAuth

  const academicYears = await prisma.academicYear.findMany({
    where: {
      tenantId: tenantAuth.tenant.id,
      isActive: true,
    },
    orderBy: { code: 'desc' },
  })

  return NextResponse.json({ academicYears })
}

export async function POST(request: NextRequest) {
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  try {
    const body = await request.json()
    const { name, code, startDate, endDate } = body

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Academic year name and code are required' },
        { status: 400 }
      )
    }

    const cleanCode = code.toUpperCase().trim()

    const existing = await prisma.academicYear.findUnique({
      where: {
        tenantId_code: {
          tenantId: tenantAuth.tenant.id,
          code: cleanCode,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'An academic year with this code already exists in your institution' },
        { status: 409 }
      )
    }

    const academicYear = await prisma.academicYear.create({
      data: {
        tenantId: tenantAuth.tenant.id,
        name: name.trim(),
        code: cleanCode,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    })

    await createAuditLog({
      tenantId: tenantAuth.tenant.id,
      actorUserId: tenantAuth.user.id,
      actorRole: tenantAuth.membership.role,
      action: 'ACADEMIC_YEAR_CREATED',
      resourceType: 'ACADEMIC_YEAR',
      resourceId: academicYear.id,
      details: { name: academicYear.name, code: academicYear.code },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true, academicYear }, { status: 201 })
  } catch (error) {
    console.error('Create academic year error:', error)
    return NextResponse.json(
      { error: 'Internal server error creating academic year' },
      { status: 500 }
    )
  }
}
