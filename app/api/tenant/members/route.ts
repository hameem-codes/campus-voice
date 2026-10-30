import { NextRequest, NextResponse } from 'next/server'
import { requireTenantRole } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { TenantRole, MembershipStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  const members = await prisma.tenantMembership.findMany({
    where: {
      tenantId: tenantAuth.tenant.id,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
          isActive: true,
        },
      },
      department: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
    },
    orderBy: { joinedAt: 'desc' },
  })

  return NextResponse.json({ members })
}

export async function PATCH(request: NextRequest) {
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  try {
    const body = await request.json()
    const { membershipId, role, status } = body

    if (!membershipId) {
      return NextResponse.json(
        { error: 'membershipId is required' },
        { status: 400 }
      )
    }

    // CROSS-TENANT MANIPULATION PREVENTION:
    // Verify membership belongs strictly to the current tenant
    const targetMembership = await prisma.tenantMembership.findFirst({
      where: {
        id: membershipId,
        tenantId: tenantAuth.tenant.id,
      },
      include: { user: true },
    })

    if (!targetMembership) {
      return NextResponse.json(
        { error: 'Membership not found within your institution' },
        { status: 404 }
      )
    }

    // Validate role if provided
    if (role && !Object.values(TenantRole).includes(role as TenantRole)) {
      return NextResponse.json(
        { error: `Invalid role: Must be one of: ${Object.values(TenantRole).join(', ')}` },
        { status: 400 }
      )
    }

    // Validate status if provided
    if (status && !Object.values(MembershipStatus).includes(status as MembershipStatus)) {
      return NextResponse.json(
        { error: `Invalid status: Must be one of: ${Object.values(MembershipStatus).join(', ')}` },
        { status: 400 }
      )
    }

    // Prevent tenant admin from revoking their own admin access if they are the only active admin
    if (
      targetMembership.userId === tenantAuth.user.id &&
      (status === MembershipStatus.REVOKED || status === MembershipStatus.SUSPENDED)
    ) {
      const activeAdminCount = await prisma.tenantMembership.count({
        where: {
          tenantId: tenantAuth.tenant.id,
          role: TenantRole.TENANT_ADMIN,
          status: MembershipStatus.ACTIVE,
        },
      })
      if (activeAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot deactivate the sole remaining administrator for this institution' },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.tenantMembership.update({
      where: { id: targetMembership.id },
      data: {
        ...(role ? { role: role as TenantRole } : {}),
        ...(status ? { status: status as MembershipStatus } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            isActive: true,
          },
        },
      },
    })

    // If membership was revoked or suspended, revoke all active sessions of this user for this tenant
    if (status === MembershipStatus.REVOKED || status === MembershipStatus.SUSPENDED) {
      await prisma.session.updateMany({
        where: {
          userId: targetMembership.userId,
          currentTenantId: tenantAuth.tenant.id,
        },
        data: {
          currentTenantId: null, // Clear active tenant context
        },
      })
    }

    await createAuditLog({
      tenantId: tenantAuth.tenant.id,
      actorUserId: tenantAuth.user.id,
      actorRole: tenantAuth.membership.role,
      action: 'MEMBERSHIP_UPDATED',
      resourceType: 'MEMBERSHIP',
      resourceId: updated.id,
      details: {
        targetUserId: updated.userId,
        targetEmail: updated.user.email,
        newRole: updated.role,
        newStatus: updated.status,
      },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true, membership: updated })
  } catch (error) {
    console.error('Update member error:', error)
    return NextResponse.json(
      { error: 'Internal server error updating member' },
      { status: 500 }
    )
  }
}
