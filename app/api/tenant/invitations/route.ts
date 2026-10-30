import { NextRequest, NextResponse } from 'next/server'
import { requireTenantRole } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { hashSessionToken, generateSessionToken } from '@/lib/auth'
import { TenantRole, InvitationStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  const invitations = await prisma.invitation.findMany({
    where: {
      tenantId: tenantAuth.tenant.id,
    },
    include: {
      department: true,
      invitedByUser: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Do not expose tokenHash in list responses
  const safeInvitations = invitations.map((inv) => {
    const { tokenHash: _tokenHash, ...safe } = inv
    return safe
  })

  return NextResponse.json({ invitations: safeInvitations })
}

export async function POST(request: NextRequest) {
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  try {
    const body = await request.json()
    const { email, role, departmentId } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()

    // Validate role is a valid TenantRole
    if (!Object.values(TenantRole).includes(role as TenantRole)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${Object.values(TenantRole).join(', ')}` },
        { status: 400 }
      )
    }

    // Verify department if provided
    if (departmentId) {
      const dept = await prisma.department.findFirst({
        where: {
          id: departmentId,
          tenantId: tenantAuth.tenant.id,
        },
      })
      if (!dept) {
        return NextResponse.json(
          { error: 'Invalid department: Department does not belong to your institution' },
          { status: 404 }
        )
      }
    }

    // Generate secure invitation token
    const rawToken = generateSessionToken()
    const tokenHash = hashSessionToken(rawToken)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const invitation = await prisma.invitation.create({
      data: {
        tenantId: tenantAuth.tenant.id,
        email: cleanEmail,
        role: role as TenantRole,
        departmentId: departmentId || null,
        tokenHash,
        expiresAt,
        status: InvitationStatus.PENDING,
        invitedByUserId: tenantAuth.user.id,
      },
    })

    await createAuditLog({
      tenantId: tenantAuth.tenant.id,
      actorUserId: tenantAuth.user.id,
      actorRole: tenantAuth.membership.role,
      action: 'INVITATION_ISSUED',
      resourceType: 'INVITATION',
      resourceId: invitation.id,
      details: { email: cleanEmail, role, departmentId },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json(
      {
        success: true,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
        },
        invitationToken: rawToken, // Returned only once upon creation for dispatch
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create invitation error:', error)
    return NextResponse.json(
      { error: 'Internal server error creating invitation' },
      { status: 500 }
    )
  }
}
