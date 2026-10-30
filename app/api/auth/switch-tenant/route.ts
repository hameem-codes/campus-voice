import { NextRequest, NextResponse } from 'next/server'
import { authenticateSession } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { MembershipStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const authContext = await authenticateSession(request)
    if (!authContext) {
      return NextResponse.json(
        { error: 'Unauthorized: Session invalid or expired' },
        { status: 401 }
      )
    }

    const { user, session } = authContext
    const body = await request.json()
    const { tenantId, tenantSlug } = body

    if (!tenantId && !tenantSlug) {
      return NextResponse.json(
        { error: 'Either tenantId or tenantSlug must be provided' },
        { status: 400 }
      )
    }

    const targetTenant = await prisma.tenant.findFirst({
      where: tenantId ? { id: tenantId } : { slug: tenantSlug },
    })

    if (!targetTenant || targetTenant.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Target institution not found or inactive' },
        { status: 404 }
      )
    }

    // MANDATORY SECURITY VERIFICATION:
    // User must hold an ACTIVE membership in the requested target tenant
    const membership = await prisma.tenantMembership.findUnique({
      where: {
        tenantId_userId: {
          tenantId: targetTenant.id,
          userId: user.id,
        },
      },
    })

    if (!membership || membership.status !== MembershipStatus.ACTIVE) {
      return NextResponse.json(
        { error: 'Forbidden: You do not possess an active membership in this institution' },
        { status: 403 }
      )
    }

    // Update active tenant context for the session
    await prisma.session.update({
      where: { id: session.id },
      data: { currentTenantId: targetTenant.id },
    })

    await createAuditLog({
      tenantId: targetTenant.id,
      actorUserId: user.id,
      actorRole: membership.role,
      action: 'TENANT_SWITCH_SUCCESS',
      resourceType: 'SESSION',
      resourceId: session.id,
      details: { previousTenantId: session.currentTenantId, newTenantId: targetTenant.id },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({
      success: true,
      activeTenant: targetTenant,
      activeMembership: {
        role: membership.role,
        status: membership.status,
      },
    })
  } catch (error) {
    console.error('Tenant switch error:', error)
    return NextResponse.json(
      { error: 'Internal server error during tenant switch' },
      { status: 500 }
    )
  }
}
