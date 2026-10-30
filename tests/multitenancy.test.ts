import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import {
  Tenant,
  TenantMembership,
  User,
  Session,
  Department,
  Section,
  TenantRole,
  MembershipStatus,
  GlobalRole,
} from '@prisma/client'
import { hashSessionToken } from '@/lib/auth'

// In-memory multi-tenant database for integration testing
let mockTenants: Tenant[] = []
let mockUsers: User[] = []
let mockMemberships: TenantMembership[] = []
let mockSessions: Session[] = []
let mockDepartments: Department[] = []
let mockSections: Section[] = []

vi.mock('@/lib/db', () => ({
  prisma: {
    tenant: {
      findUnique: vi.fn(async ({ where }: { where: { id?: string; slug?: string } }) => {
        return mockTenants.find((t) => (where.id ? t.id === where.id : t.slug === where.slug)) || null
      }),
      findFirst: vi.fn(async ({ where }: { where: { id?: string; slug?: string } }) => {
        return mockTenants.find((t) => (where.id ? t.id === where.id : t.slug === where.slug)) || null
      }),
      findMany: vi.fn(async () => mockTenants),
    },
    user: {
      findUnique: vi.fn(async ({ where }: { where: { id?: string; email?: string } }) => {
        const user = mockUsers.find((u) => (where.id ? u.id === where.id : u.email === where.email))
        if (!user) return null
        const memberships = mockMemberships
          .filter((m) => m.userId === user.id)
          .map((m) => ({
            ...m,
            tenant: mockTenants.find((t) => t.id === m.tenantId)!,
          }))
        return { ...user, memberships }
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
          mockSessions[idx] = { ...mockSessions[idx], ...data }
          return mockSessions[idx]
        }
        throw new Error('Session not found')
      }),
      updateMany: vi.fn(async ({ where, data }: { where: { userId: string; currentTenantId?: string }; data: any }) => {
        let count = 0
        mockSessions.forEach((s) => {
          if (s.userId === where.userId && (!where.currentTenantId || s.currentTenantId === where.currentTenantId)) {
            Object.assign(s, data)
            count++
          }
        })
        return { count }
      }),
    },
    tenantMembership: {
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
      findFirst: vi.fn(async ({ where }: { where: { id?: string; tenantId?: string } }) => {
        return (
          mockMemberships.find((m) => {
            if (where.id && m.id !== where.id) return false
            if (where.tenantId && m.tenantId !== where.tenantId) return false
            return true
          }) || null
        )
      }),
      findMany: vi.fn(async ({ where }: { where: { tenantId?: string; userId?: string } }) => {
        return mockMemberships
          .filter((m) => {
            if (where.tenantId && m.tenantId !== where.tenantId) return false
            if (where.userId && m.userId !== where.userId) return false
            return true
          })
          .map((m) => ({
            ...m,
            tenant: mockTenants.find((t) => t.id === m.tenantId)!,
            user: mockUsers.find((u) => u.id === m.userId)!,
          }))
      }),
      count: vi.fn(async ({ where }: { where: { tenantId?: string; role?: TenantRole; status?: MembershipStatus } }) => {
        return mockMemberships.filter((m) => {
          if (where.tenantId && m.tenantId !== where.tenantId) return false
          if (where.role && m.role !== where.role) return false
          if (where.status && m.status !== where.status) return false
          return true
        }).length
      }),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: any }) => {
        const idx = mockMemberships.findIndex((m) => m.id === where.id)
        if (idx >= 0) {
          mockMemberships[idx] = { ...mockMemberships[idx], ...data }
          const user = mockUsers.find((u) => u.id === mockMemberships[idx].userId)!
          return { ...mockMemberships[idx], user }
        }
        throw new Error('Membership not found')
      }),
    },
    department: {
      findMany: vi.fn(async ({ where }: { where: { tenantId: string; isActive?: boolean } }) => {
        return mockDepartments.filter(
          (d) => d.tenantId === where.tenantId && (where.isActive === undefined || d.isActive === where.isActive)
        )
      }),
      findFirst: vi.fn(async ({ where }: { where: { id?: string; tenantId: string } }) => {
        return (
          mockDepartments.find((d) => {
            if (where.id && d.id !== where.id) return false
            if (d.tenantId !== where.tenantId) return false
            return true
          }) || null
        )
      }),
      findUnique: vi.fn(async ({ where }: { where: { tenantId_code?: { tenantId: string; code: string } } }) => {
        if (where.tenantId_code) {
          return (
            mockDepartments.find(
              (d) =>
                d.tenantId === where.tenantId_code!.tenantId &&
                d.code === where.tenantId_code!.code
            ) || null
          )
        }
        return null
      }),
      create: vi.fn(async ({ data }: { data: any }) => {
        const newDept: Department = {
          id: `dept-${Date.now()}-${Math.random()}`,
          tenantId: data.tenantId,
          name: data.name,
          code: data.code,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        mockDepartments.push(newDept)
        return newDept
      }),
    },
    section: {
      findUnique: vi.fn(async ({ where }: { where: { tenantId_departmentId_name?: { tenantId: string; departmentId: string; name: string } } }) => {
        if (where.tenantId_departmentId_name) {
          return (
            mockSections.find(
              (s) =>
                s.tenantId === where.tenantId_departmentId_name!.tenantId &&
                s.departmentId === where.tenantId_departmentId_name!.departmentId &&
                s.name === where.tenantId_departmentId_name!.name
            ) || null
          )
        }
        return null
      }),
      create: vi.fn(async ({ data }: { data: any }) => {
        const newSec: Section = {
          id: `sec-${Date.now()}-${Math.random()}`,
          tenantId: data.tenantId,
          departmentId: data.departmentId,
          name: data.name,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        mockSections.push(newSec)
        return newSec
      }),
    },
    auditLog: {
      create: vi.fn(async () => ({ id: `audit-${Date.now()}` })),
    },
  },
}))

// Import route handlers and tenant security functions
import { GET as getDepartments, POST as createDepartment } from '@/app/api/tenant/departments/route'
import { POST as createSection } from '@/app/api/tenant/sections/route'
import { PATCH as updateMember } from '@/app/api/tenant/members/route'
import { POST as switchTenant } from '@/app/api/auth/switch-tenant/route'
import { GET as getPlatformTenants } from '@/app/api/platform/tenants/route'
import { requireTenantContext } from '@/lib/tenant'

describe('M1 Multi-Tenant Isolation & Security Suite', () => {
  // Test Fixtures
  const tenantA: Tenant = {
    id: 'tenant-aaa-111',
    name: 'College of Engineering',
    slug: 'engineering-college',
    domain: 'eng.edu',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const tenantB: Tenant = {
    id: 'tenant-bbb-222',
    name: 'School of Management',
    slug: 'business-school',
    domain: 'biz.edu',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const userAlice: User = {
    id: 'user-alice-001',
    email: 'alice@eng.edu',
    passwordHash: 'hash',
    fullName: 'Alice Walker',
    avatarUrl: null,
    globalRole: GlobalRole.STANDARD_USER,
    isActive: true,
    emailVerifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const userBob: User = {
    id: 'user-bob-002',
    email: 'bob@biz.edu',
    passwordHash: 'hash',
    fullName: 'Bob Roberts',
    avatarUrl: null,
    globalRole: GlobalRole.STANDARD_USER,
    isActive: true,
    emailVerifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Multi-tenant user: Charlie belongs to both institutions
  const userCharlieMulti: User = {
    id: 'user-charlie-003',
    email: 'charlie@joint.edu',
    passwordHash: 'hash',
    fullName: 'Dr. Charlie Joint',
    avatarUrl: null,
    globalRole: GlobalRole.STANDARD_USER,
    isActive: true,
    emailVerifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const rawTokenAlice = 'token-alice-123456789012345678901234567890'
  const rawTokenBob = 'token-bob-123456789012345678901234567890'
  const rawTokenCharlie = 'token-charlie-123456789012345678901234567890'

  beforeEach(() => {
    mockTenants = [tenantA, tenantB]
    mockUsers = [userAlice, userBob, userCharlieMulti]

    mockMemberships = [
      // Alice is Tenant Admin in College A
      {
        id: 'mem-alice-a',
        tenantId: tenantA.id,
        userId: userAlice.id,
        role: TenantRole.TENANT_ADMIN,
        status: MembershipStatus.ACTIVE,
        studentId: null,
        departmentId: null,
        academicYearId: null,
        sectionId: null,
        joinedAt: new Date(),
        updatedAt: new Date(),
      },
      // Bob is Faculty in School B
      {
        id: 'mem-bob-b',
        tenantId: tenantB.id,
        userId: userBob.id,
        role: TenantRole.FACULTY,
        status: MembershipStatus.ACTIVE,
        studentId: null,
        departmentId: null,
        academicYearId: null,
        sectionId: null,
        joinedAt: new Date(),
        updatedAt: new Date(),
      },
      // Charlie is Faculty in College A and Student in School B
      {
        id: 'mem-charlie-a',
        tenantId: tenantA.id,
        userId: userCharlieMulti.id,
        role: TenantRole.FACULTY,
        status: MembershipStatus.ACTIVE,
        studentId: null,
        departmentId: null,
        academicYearId: null,
        sectionId: null,
        joinedAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mem-charlie-b',
        tenantId: tenantB.id,
        userId: userCharlieMulti.id,
        role: TenantRole.STUDENT,
        status: MembershipStatus.ACTIVE,
        studentId: 'STU-B-999',
        departmentId: null,
        academicYearId: null,
        sectionId: null,
        joinedAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockSessions = [
      {
        id: 'sess-alice',
        userId: userAlice.id,
        tokenHash: hashSessionToken(rawTokenAlice),
        currentTenantId: tenantA.id,
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        expiresAt: new Date(Date.now() + 86400000),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'sess-bob',
        userId: userBob.id,
        tokenHash: hashSessionToken(rawTokenBob),
        currentTenantId: tenantB.id,
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        expiresAt: new Date(Date.now() + 86400000),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'sess-charlie',
        userId: userCharlieMulti.id,
        tokenHash: hashSessionToken(rawTokenCharlie),
        currentTenantId: tenantA.id, // currently operating in Tenant A
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        expiresAt: new Date(Date.now() + 86400000),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockDepartments = [
      {
        id: 'dept-cse-a',
        tenantId: tenantA.id,
        name: 'Computer Science',
        code: 'CSE',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'dept-mba-b',
        tenantId: tenantB.id,
        name: 'Business Administration',
        code: 'MBA',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockSections = []
  })

  // 1. Cross-Tenant Read Denial
  it('denies cross-tenant read access: Alice in Tenant A sees only Tenant A departments', async () => {
    const req = new NextRequest('http://localhost:3000/api/tenant/departments', {
      headers: {
        authorization: `Bearer ${rawTokenAlice}`,
      },
    })

    const res = await getDepartments(req)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.departments).toHaveLength(1)
    expect(data.departments[0].code).toBe('CSE')
    expect(data.departments[0].tenantId).toBe(tenantA.id)

    // Verify School B's department is NEVER present in Tenant A's response
    const hasTenantBDept = data.departments.some((d: any) => d.tenantId === tenantB.id)
    expect(hasTenantBDept).toBe(false)
  })

  // 2. Cross-Tenant Write & Foreign Key Denial
  it('denies cross-tenant write tampering: Alice in Tenant A cannot attach a section to Tenant B department', async () => {
    const req = new NextRequest('http://localhost:3000/api/tenant/sections', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${rawTokenAlice}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Malicious Section',
        departmentId: 'dept-mba-b', // Department belonging to Tenant B!
      }),
    })

    const res = await createSection(req)
    expect(res.status).toBe(404) // Rejected because department does not exist within Tenant A
    const body = await res.json()
    expect(body.error).toContain('Department does not exist within your institution')
  })

  // 3. Tenant Administrator Isolation
  it('enforces tenant admin isolation: Admin of Tenant A cannot administer Tenant B members', async () => {
    const req = new NextRequest('http://localhost:3000/api/tenant/members', {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${rawTokenAlice}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        membershipId: 'mem-bob-b', // Bob belongs to Tenant B
        role: TenantRole.STUDENT,
      }),
    })

    const res = await updateMember(req)
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toContain('Membership not found within your institution')
  })

  // 4. Multi-Tenant Membership Handling & Context Switching
  it('allows multi-tenant user Charlie to operate in Tenant A, then switch securely to Tenant B', async () => {
    // Charlie operating in Tenant A
    const reqA = new NextRequest('http://localhost:3000/api/tenant/departments', {
      headers: { authorization: `Bearer ${rawTokenCharlie}` },
    })
    const contextA = await requireTenantContext(reqA)
    expect((contextA as any).tenant.id).toBe(tenantA.id)
    expect((contextA as any).membership.role).toBe(TenantRole.FACULTY)

    // Charlie switches to Tenant B
    const switchReq = new NextRequest('http://localhost:3000/api/auth/switch-tenant', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${rawTokenCharlie}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ tenantId: tenantB.id }),
    })

    const switchRes = await switchTenant(switchReq)
    expect(switchRes.status).toBe(200)
    const switchData = await switchRes.json()
    expect(switchData.activeTenant.id).toBe(tenantB.id)
    expect(switchData.activeMembership.role).toBe(TenantRole.STUDENT)

    // Now Charlie's session operates in Tenant B
    const reqB = new NextRequest('http://localhost:3000/api/tenant/departments', {
      headers: { authorization: `Bearer ${rawTokenCharlie}` },
    })
    const contextB = await requireTenantContext(reqB)
    expect((contextB as any).tenant.id).toBe(tenantB.id)
    expect((contextB as any).membership.role).toBe(TenantRole.STUDENT)
  })

  // 5. Revoked Membership Behavior
  it('enforces immediate revocation: revoked membership is denied on subsequent requests', async () => {
    // Revoke Bob's membership in Tenant B
    const bobMem = mockMemberships.find((m) => m.id === 'mem-bob-b')!
    bobMem.status = MembershipStatus.REVOKED

    const req = new NextRequest('http://localhost:3000/api/tenant/departments', {
      headers: { authorization: `Bearer ${rawTokenBob}` },
    })

    const res = await getDepartments(req)
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toContain('No active membership')
  })

  // 6. Tenant ID Manipulation via Headers/Query
  it('rejects tenant ID manipulation: Alice cannot access Tenant B by passing x-tenant-id header', async () => {
    const req = new NextRequest('http://localhost:3000/api/tenant/departments', {
      headers: {
        authorization: `Bearer ${rawTokenAlice}`,
        'x-tenant-id': tenantB.id, // Alice attempts to impersonate Tenant B context
      },
    })

    const res = await getDepartments(req)
    // Server rejects because Alice does not possess an active membership in Tenant B
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toContain('No active membership in the requested institution')
  })

  // 7. Platform Admin Privilege Separation
  it('enforces platform-admin privilege separation: Tenant Admin Alice cannot access platform admin APIs', async () => {
    const req = new NextRequest('http://localhost:3000/api/platform/tenants', {
      headers: {
        authorization: `Bearer ${rawTokenAlice}`,
      },
    })

    const res = await getPlatformTenants(req)
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toContain('Platform administrator privileges required')
  })

  // 8. Sole Administrator Self-Deactivation Prevention
  it('prevents sole administrator from deactivating themselves and orphaning the tenant', async () => {
    const req = new NextRequest('http://localhost:3000/api/tenant/members', {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${rawTokenAlice}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        membershipId: 'mem-alice-a',
        status: MembershipStatus.REVOKED,
      }),
    })

    const res = await updateMember(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('Cannot deactivate the sole remaining administrator')
  })
})
