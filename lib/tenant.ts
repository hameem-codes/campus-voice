import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './db'
import { hashSessionToken, sanitizeUser, SafeUser, SESSION_COOKIE_NAME } from './auth'
import {
  Tenant,
  TenantMembership,
  TenantRole,
  MembershipStatus,
  GlobalRole,
  Session,
} from '@prisma/client'

export interface AuthContext {
  user: SafeUser
  session: Session
}

export interface TenantAuthContext extends AuthContext {
  tenant: Tenant
  membership: TenantMembership
}

/**
 * Extract raw session token from request cookies or Authorization header
 */
export function extractSessionToken(request: NextRequest): string | null {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (cookie) return cookie

  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim()
  }

  return null
}

/**
 * Authenticate session from request and verify user status
 */
export async function authenticateSession(request: NextRequest): Promise<AuthContext | null> {
  const token = extractSessionToken(request)
  if (!token) return null

  const tokenHash = hashSessionToken(token)

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: true,
    },
  })

  if (!session) return null

  // Enforce session expiration and revocation
  if (session.revokedAt !== null || session.expiresAt <= new Date()) {
    return null
  }

  // Enforce user active status
  if (!session.user.isActive) {
    return null
  }

  return {
    user: sanitizeUser(session.user),
    session,
  }
}

/**
 * Resolve tenant context strictly through verified membership.
 * NEVER trust client-supplied tenant ID on its own.
 */
export async function resolveTenantContext(
  request: NextRequest,
  authContext: AuthContext
): Promise<TenantAuthContext | null> {
  const { user, session } = authContext

  // Client may request a specific tenant context via header or query
  const requestedTenantSlug = request.headers.get('x-tenant-slug')
  const requestedTenantId = request.headers.get('x-tenant-id')

  let targetTenant: Tenant | null = null

  if (requestedTenantId) {
    targetTenant = await prisma.tenant.findUnique({
      where: { id: requestedTenantId },
    })
  } else if (requestedTenantSlug) {
    targetTenant = await prisma.tenant.findUnique({
      where: { slug: requestedTenantSlug },
    })
  } else if (session.currentTenantId) {
    targetTenant = await prisma.tenant.findUnique({
      where: { id: session.currentTenantId },
    })
  }

  if (!targetTenant) {
    // If no explicit tenant was requested, check if user has exactly one active membership
    const memberships = await prisma.tenantMembership.findMany({
      where: {
        userId: user.id,
        status: MembershipStatus.ACTIVE,
      },
      include: { tenant: true },
      take: 2,
    })

    if (memberships.length === 1 && memberships[0].tenant) {
      return {
        user,
        session,
        tenant: memberships[0].tenant,
        membership: memberships[0],
      }
    }

    return null
  }

  // Ensure tenant is active
  if (targetTenant.status !== 'ACTIVE') {
    return null
  }

  // MANDATORY SECURITY VERIFICATION:
  // User MUST have an ACTIVE membership in the target tenant
  const membership = await prisma.tenantMembership.findUnique({
    where: {
      tenantId_userId: {
        tenantId: targetTenant.id,
        userId: user.id,
      },
    },
  })

  if (!membership || membership.status !== MembershipStatus.ACTIVE) {
    // Access Denied: User has no active membership in this tenant
    return null
  }

  return {
    user,
    session,
    tenant: targetTenant,
    membership,
  }
}

/**
 * Server guard: Require authenticated session
 */
export async function requireAuth(
  request: NextRequest
): Promise<AuthContext | NextResponse> {
  const auth = await authenticateSession(request)
  if (!auth) {
    return NextResponse.json(
      { error: 'Unauthorized: Valid session required' },
      { status: 401 }
    )
  }
  return auth
}

/**
 * Server guard: Require authenticated session AND verified tenant membership
 */
export async function requireTenantContext(
  request: NextRequest
): Promise<TenantAuthContext | NextResponse> {
  const auth = await authenticateSession(request)
  if (!auth) {
    return NextResponse.json(
      { error: 'Unauthorized: Valid session required' },
      { status: 401 }
    )
  }

  const tenantAuth = await resolveTenantContext(request, auth)
  if (!tenantAuth) {
    return NextResponse.json(
      { error: 'Forbidden: No active membership in the requested institution' },
      { status: 403 }
    )
  }

  return tenantAuth
}

/**
 * Server guard: Require tenant role (e.g. TENANT_ADMIN, FACULTY)
 */
export async function requireTenantRole(
  request: NextRequest,
  allowedRoles: TenantRole[]
): Promise<TenantAuthContext | NextResponse> {
  const tenantAuth = await requireTenantContext(request)
  if (tenantAuth instanceof NextResponse) {
    return tenantAuth
  }

  if (!allowedRoles.includes(tenantAuth.membership.role)) {
    return NextResponse.json(
      {
        error: `Forbidden: Action requires one of the following roles: ${allowedRoles.join(
          ', '
        )}`,
      },
      { status: 403 }
    )
  }

  return tenantAuth
}

/**
 * Server guard: Require platform-level administrator.
 * A tenant administrator CANNOT access platform administrator endpoints.
 */
export async function requirePlatformAdmin(
  request: NextRequest
): Promise<AuthContext | NextResponse> {
  const auth = await authenticateSession(request)
  if (!auth) {
    return NextResponse.json(
      { error: 'Unauthorized: Valid session required' },
      { status: 401 }
    )
  }

  if (auth.user.globalRole !== GlobalRole.PLATFORM_ADMIN) {
    return NextResponse.json(
      { error: 'Forbidden: Platform administrator privileges required' },
      { status: 403 }
    )
  }

  return auth
}
