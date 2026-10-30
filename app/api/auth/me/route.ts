import { NextRequest, NextResponse } from 'next/server'
import { authenticateSession, resolveTenantContext } from '@/lib/tenant'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const authContext = await authenticateSession(request)
    if (!authContext) {
      return NextResponse.json(
        { error: 'Unauthorized: Session invalid or expired' },
        { status: 401 }
      )
    }

    const { user, session } = authContext

    // Fetch all memberships of the user
    const memberships = await prisma.tenantMembership.findMany({
      where: { userId: user.id },
      include: {
        tenant: true,
        department: true,
      },
    })

    const tenantAuth = await resolveTenantContext(request, authContext)

    return NextResponse.json({
      user,
      session: {
        id: session.id,
        currentTenantId: session.currentTenantId,
        expiresAt: session.expiresAt,
      },
      activeTenant: tenantAuth ? tenantAuth.tenant : null,
      activeMembership: tenantAuth
        ? {
            role: tenantAuth.membership.role,
            status: tenantAuth.membership.status,
            studentId: tenantAuth.membership.studentId,
            departmentId: tenantAuth.membership.departmentId,
          }
        : null,
      memberships: memberships.map((m) => ({
        id: m.id,
        tenantId: m.tenantId,
        tenantName: m.tenant.name,
        tenantSlug: m.tenant.slug,
        role: m.role,
        status: m.status,
        department: m.department ? { id: m.department.id, name: m.department.name, code: m.department.code } : null,
      })),
    })
  } catch (error) {
    console.error('Auth/me error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
