import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {
  hashSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/auth'
import { extractSessionToken } from '@/lib/tenant'
import { createAuditLog } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    const rawToken = extractSessionToken(request)

    if (rawToken) {
      const tokenHash = hashSessionToken(rawToken)
      const session = await prisma.session.findUnique({
        where: { tokenHash },
      })

      if (session) {
        // Revoke session in database
        await prisma.session.update({
          where: { id: session.id },
          data: { revokedAt: new Date() },
        })

        await createAuditLog({
          tenantId: session.currentTenantId,
          actorUserId: session.userId,
          action: 'AUTH_LOGOUT',
          resourceType: 'SESSION',
          resourceId: session.id,
          ipAddress: request.headers.get('x-forwarded-for'),
          userAgent: request.headers.get('user-agent'),
        })
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    // Clear session cookie
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'An unexpected internal error occurred during logout' },
      { status: 500 }
    )
  }
}
