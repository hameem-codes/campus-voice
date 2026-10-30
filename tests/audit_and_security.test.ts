import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import {
  Tenant,
  TenantMembership,
  User,
  Session,
  AuditLog,
  TenantRole,
  MembershipStatus,
  GlobalRole,
} from '@prisma/client'
import { hashSessionToken, hashPassword } from '@/lib/auth'

let mockTenants: Tenant[] = []
let mockUsers: User[] = []
let mockMemberships: TenantMembership[] = []
let mockSessions: Session[] = []
let mockAuditLogs: AuditLog[] = []

vi.mock('@/lib/db', () => ({
  prisma: {
    tenant: {
      findUnique: vi.fn(async ({ where }: { where: { id?: string; slug?: string } }) => {
        return mockTenants.find((t) => (where.id ? t.id === where.id : t.slug === where.slug)) || null
      }),
    },
    user: {
      findUnique: vi.fn(async ({ where }: { where: { id?: string; email?: string } }) => {
        const u = mockUsers.find((user) => (where.id ? user.id === where.id : user.email === where.email))
        if (!u) return null
        const memberships = mockMemberships
          .filter((m) => m.userId === u.id)
          .map((m) => ({
            ...m,
            tenant: mockTenants.find((t) => t.id === m.tenantId)!,
          }))
        return { ...u, memberships }
      }),
    },
    session: {
      findUnique: vi.fn(async ({ where }: { where: { tokenHash?: string } }) => {
        const s = mockSessions.find((sess) => sess.tokenHash === where.tokenHash)
        if (!s) return null
        const user = mockUsers.find((u) => u.id === s.userId)
        if (!user) return null
        return { ...s, user }
      }),
      create: vi.fn(async ({ data }: { data: any }) => {
        const newSession: Session = {
          id: `sess-${Date.now()}-${Math.random()}`,
          userId: data.userId,
          tokenHash: data.tokenHash,
          currentTenantId: data.currentTenantId || null,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
          expiresAt: data.expiresAt,
          revokedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        mockSessions.push(newSession)
        return newSession
      }),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: any }) => {
        const idx = mockSessions.findIndex((s) => s.id === where.id)
        if (idx >= 0) {
          Object.assign(mockSessions[idx], data)
          return mockSessions[idx]
        }
        throw new Error('Session not found')
      }),
    },
    tenantMembership: {
      findMany: vi.fn(async ({ where }: { where: { userId?: string } }) => {
        return mockMemberships
          .filter((m) => !where.userId || m.userId === where.userId)
          .map((m) => ({
            ...m,
            tenant: mockTenants.find((t) => t.id === m.tenantId)!,
            department: null,
          }))
      }),
      findUnique: vi.fn(async ({ where }: { where: { tenantId_userId?: { tenantId: string; userId: string } } }) => {
        if (where.tenantId_userId) {
          return (
            mockMemberships.find(
              (m) =>
                m.tenantId === where.tenantId_userId!.tenantId &&
                m.userId === where.tenantId_userId!.userId
            ) || null
          )
        }
        return null
      }),
    },
    auditLog: {
      create: vi.fn(async ({ data }: { data: any }) => {
        const newLog: AuditLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          tenantId: data.tenantId || null,
          actorUserId: data.actorUserId || null,
          actorRole: data.actorRole || null,
          action: data.action,
          resourceType: data.resourceType,
          resourceId: data.resourceId || null,
          details: data.details || null,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
          createdAt: new Date(),
        }
        mockAuditLogs.push(newLog)
        return newLog
      }),
      findMany: vi.fn(async ({ where }: { where: { tenantId: string } }) => {
        return mockAuditLogs.filter((l) => l.tenantId === where.tenantId)
      }),
      count: vi.fn(async ({ where }: { where: { tenantId: string } }) => {
        return mockAuditLogs.filter((l) => l.tenantId === where.tenantId).length
      }),
    },
  },
}))

import { POST as login } from '@/app/api/auth/login/route'
import { POST as logout } from '@/app/api/auth/logout/route'
import { GET as getMe } from '@/app/api/auth/me/route'
import { authenticateSession } from '@/lib/tenant'

describe('M1 Authentication Lifecycle, Column Protection & Audit Logging', () => {
  const tenant1: Tenant = {
    id: 't-100',
    name: 'National University of Technology',
    slug: 'nut-tech',
    domain: 'nut.edu',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  let testUserPasswordHash = ''

  beforeEach(async () => {
    testUserPasswordHash = await hashPassword('ValidPass1234!')

    mockTenants = [tenant1]
    mockUsers = [
      {
        id: 'u-100',
        email: 'prof.smith@nut.edu',
        passwordHash: testUserPasswordHash,
        fullName: 'Prof. John Smith',
        avatarUrl: null,
        globalRole: GlobalRole.STANDARD_USER,
        isActive: true,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'u-inactive',
        email: 'banned@nut.edu',
        passwordHash: testUserPasswordHash,
        fullName: 'Banned User',
        avatarUrl: null,
        globalRole: GlobalRole.STANDARD_USER,
        isActive: false, // Inactive account
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockMemberships = [
      {
        id: 'mem-100',
        tenantId: tenant1.id,
        userId: 'u-100',
        role: TenantRole.FACULTY,
        status: MembershipStatus.ACTIVE,
        studentId: null,
        departmentId: null,
        academicYearId: null,
        sectionId: null,
        joinedAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockSessions = []
    mockAuditLogs = []
  })

  it('rejects login for inactive user account', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'banned@nut.edu',
        password: 'ValidPass1234!',
      }),
    })

    const res = await login(req)
    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.error).toContain('deactivated')
  })

  it('authenticates valid credentials, creates session, records audit log, and sets HTTP-only cookie', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'prof.smith@nut.edu',
        password: 'ValidPass1234!',
      }),
    })

    const res = await login(req)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.user.email).toBe('prof.smith@nut.edu')
    expect(data.user).not.toHaveProperty('passwordHash') // Column-level protection
    expect(data.activeTenant.id).toBe(tenant1.id)

    // Verify Set-Cookie header was returned
    const cookieHeader = res.headers.get('set-cookie')
    expect(cookieHeader).toContain('cv_session=')
    expect(cookieHeader).toContain('HttpOnly')

    // Verify Audit log was created
    expect(mockAuditLogs.length).toBeGreaterThan(0)
    const loginLog = mockAuditLogs.find((l) => l.action === 'AUTH_LOGIN_SUCCESS')
    expect(loginLog).toBeDefined()
    expect(loginLog!.actorUserId).toBe('u-100')
    expect(loginLog!.tenantId).toBe(tenant1.id)
  })

  it('enforces session revocation on logout', async () => {
    // First create a session
    const rawToken = 'logout-test-token-12345678901234567890'
    const session: Session = {
      id: 'sess-to-revoke',
      userId: 'u-100',
      tokenHash: hashSessionToken(rawToken),
      currentTenantId: tenant1.id,
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
      expiresAt: new Date(Date.now() + 86400000),
      revokedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockSessions.push(session)

    // Call logout
    const logoutReq = new NextRequest('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      headers: { authorization: `Bearer ${rawToken}` },
    })

    const logoutRes = await logout(logoutReq)
    expect(logoutRes.status).toBe(200)

    // Verify session in database has revokedAt set
    expect(session.revokedAt).not.toBeNull()

    // Subsequent authentication with this token must be denied
    const checkReq = new NextRequest('http://localhost:3000/api/auth/me', {
      headers: { authorization: `Bearer ${rawToken}` },
    })
    const auth = await authenticateSession(checkReq)
    expect(auth).toBeNull()

    const meRes = await getMe(checkReq)
    expect(meRes.status).toBe(401)
  })

  it('rejects expired sessions automatically', async () => {
    const rawToken = 'expired-token-12345678901234567890'
    const expiredSession: Session = {
      id: 'sess-expired',
      userId: 'u-100',
      tokenHash: hashSessionToken(rawToken),
      currentTenantId: tenant1.id,
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
      expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
      revokedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockSessions.push(expiredSession)

    const req = new NextRequest('http://localhost:3000/api/auth/me', {
      headers: { authorization: `Bearer ${rawToken}` },
    })

    const auth = await authenticateSession(req)
    expect(auth).toBeNull()
  })

  it('strictly protects sensitive user columns from leaking in /api/auth/me', async () => {
    const rawToken = 'me-test-token-12345678901234567890'
    const session: Session = {
      id: 'sess-me',
      userId: 'u-100',
      tokenHash: hashSessionToken(rawToken),
      currentTenantId: tenant1.id,
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
      expiresAt: new Date(Date.now() + 86400000),
      revokedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockSessions.push(session)

    const req = new NextRequest('http://localhost:3000/api/auth/me', {
      headers: { authorization: `Bearer ${rawToken}` },
    })

    const res = await getMe(req)
    expect(res.status).toBe(200)
    const data = await res.json()

    // Assert sensitive fields are completely omitted
    expect(data.user).not.toHaveProperty('passwordHash')
    expect(data.user).not.toHaveProperty('tokenHash')
    expect(data.user.email).toBe('prof.smith@nut.edu')
    expect(data.activeTenant.name).toBe('National University of Technology')
  })
})
