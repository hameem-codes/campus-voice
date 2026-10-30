import { NextRequest, NextResponse } from 'next/server'
import { requireTenantContext, requireTenantRole } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { TenantRole, Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const tenantAuth = await requireTenantContext(request)
  if (tenantAuth instanceof NextResponse) return tenantAuth

  const settings = await prisma.tenantSettings.findUnique({
    where: { tenantId: tenantAuth.tenant.id },
  })

  return NextResponse.json({ settings })
}

export async function PATCH(request: NextRequest) {
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  try {
    const body = await request.json()
    const {
      allowStudentComments,
      requireAdminApprovalForUrgent,
      retentionMonths,
      themePrimaryColor,
      logoUrl,
      notificationChannels,
    } = body

    const updated = await prisma.tenantSettings.upsert({
      where: { tenantId: tenantAuth.tenant.id },
      create: {
        tenantId: tenantAuth.tenant.id,
        allowStudentComments: Boolean(allowStudentComments),
        requireAdminApprovalForUrgent: Boolean(requireAdminApprovalForUrgent),
        retentionMonths: retentionMonths ? Number(retentionMonths) : 36,
        themePrimaryColor: themePrimaryColor || '#3F7CE0',
        logoUrl: logoUrl || null,
        notificationChannels: (notificationChannels ?? {
          email: true,
          push: true,
          sms: false,
        }) as Prisma.InputJsonValue,
      },
      update: {
        ...(allowStudentComments !== undefined ? { allowStudentComments: Boolean(allowStudentComments) } : {}),
        ...(requireAdminApprovalForUrgent !== undefined
          ? { requireAdminApprovalForUrgent: Boolean(requireAdminApprovalForUrgent) }
          : {}),
        ...(retentionMonths !== undefined ? { retentionMonths: Number(retentionMonths) } : {}),
        ...(themePrimaryColor ? { themePrimaryColor } : {}),
        ...(logoUrl !== undefined ? { logoUrl } : {}),
        ...(notificationChannels !== undefined
          ? { notificationChannels: notificationChannels as Prisma.InputJsonValue }
          : {}),
      },
    })

    await createAuditLog({
      tenantId: tenantAuth.tenant.id,
      actorUserId: tenantAuth.user.id,
      actorRole: tenantAuth.membership.role,
      action: 'TENANT_SETTINGS_UPDATED',
      resourceType: 'TENANT_SETTINGS',
      resourceId: updated.id,
      details: {
        allowStudentComments: updated.allowStudentComments,
        requireAdminApprovalForUrgent: updated.requireAdminApprovalForUrgent,
      },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true, settings: updated })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error updating settings' },
      { status: 500 }
    )
  }
}
