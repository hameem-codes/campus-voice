import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  hashSessionToken,
  sanitizeUser,
  getSessionCookieOptions,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { MembershipStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, tenantSlug } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        memberships: {
          include: { tenant: true },
        },
      },
    })

    if (!user) {
      // Mitigate timing attacks by executing dummy hash comparison
      await hashPassword('dummy-timing-protection')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account has been deactivated. Please contact your administrator.' },
        { status: 403 }
      )
    }

    const isValid = await verifyPassword(user.passwordHash, password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Determine initial tenant context
    let targetTenantId: string | null = null

    if (tenantSlug) {
      const targetMembership = user.memberships.find(
        (m) =>
          m.tenant.slug === tenantSlug &&
          m.status === MembershipStatus.ACTIVE &&
          m.tenant.status === 'ACTIVE'
      )

      if (!targetMembership) {
        return NextResponse.json(
          { error: 'User does not possess an active membership in the specified institution' },
          { status: 403 }
        )
      }
      targetTenantId = targetMembership.tenantId
    } else {
      // Pick first active membership if available
      const firstActive = user.memberships.find(
        (m) => m.status === MembershipStatus.ACTIVE && m.tenant.status === 'ACTIVE'
      )
      if (firstActive) {
        targetTenantId = firstActive.tenantId
      }
    }

    // Create secure server-side session
    const rawToken = generateSessionToken()
    const tokenHash = hashSessionToken(rawToken)
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000)

    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        currentTenantId: targetTenantId,
        ipAddress,
        userAgent,
        expiresAt,
      },
    })

    // Record audit event
    await createAuditLog({
      tenantId: targetTenantId,
      actorUserId: user.id,
      actorRole: user.globalRole,
      action: 'AUTH_LOGIN_SUCCESS',
      resourceType: 'SESSION',
      details: { email: user.email, tenantId: targetTenantId },
      ipAddress,
      userAgent,
    })

    const safeUser = sanitizeUser(user)
    const activeMembership = user.memberships.find((m) => m.tenantId === targetTenantId)

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      activeTenant: activeMembership?.tenant ?? null,
      activeRole: activeMembership?.role ?? null,
      memberships: user.memberships.map((m) => ({
        tenantId: m.tenantId,
        tenantName: m.tenant.name,
        tenantSlug: m.tenant.slug,
        role: m.role,
        status: m.status,
      })),
    })

    const cookieOptions = getSessionCookieOptions()
    response.cookies.set(cookieOptions.name, rawToken, cookieOptions)

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected internal error occurred' },
      { status: 500 }
    )
  }
}
