import { describe, it, expect } from 'vitest'
import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  hashSessionToken,
  sanitizeUser,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth'
import { User, GlobalRole } from '@prisma/client'

describe('M1 Authentication & Security Foundation', () => {
  it('hashes passwords using Argon2id with OWASP parameters', async () => {
    const password = 'SuperSecureCampusPassword2026!'
    const hashedPassword = await hashPassword(password)

    // Verify it is an Argon2id formatted string
    expect(hashedPassword).toMatch(/^\$argon2id\$/)
    expect(hashedPassword).toContain('m=19456,t=2,p=1')

    // Verify correct password matches
    const isValid = await verifyPassword(hashedPassword, password)
    expect(isValid).toBe(true)

    // Verify incorrect password fails
    const isInvalid = await verifyPassword(hashedPassword, 'WrongPassword123')
    expect(isInvalid).toBe(false)
  })

  it('generates high-entropy 32-byte hexadecimal session tokens', () => {
    const token1 = generateSessionToken()
    const token2 = generateSessionToken()

    expect(token1).toHaveLength(64) // 32 bytes in hex = 64 characters
    expect(token2).toHaveLength(64)
    expect(token1).not.toBe(token2)
  })

  it('hashes session tokens with SHA-256 before database storage', () => {
    const token = 'a'.repeat(64)
    const hash1 = hashSessionToken(token)
    const hash2 = hashSessionToken(token)

    expect(hash1).toHaveLength(64)
    expect(hash1).toBe(hash2)
    expect(hash1).not.toBe(token)
  })

  it('enforces column-level security by stripping password_hash from safe user objects', () => {
    const mockUser: User = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'dean@apex.edu',
      passwordHash: '$argon2id$v=19$m=19456,t=2,p=1$secretHashValue',
      fullName: 'Dean Armstrong',
      avatarUrl: null,
      globalRole: GlobalRole.STANDARD_USER,
      isActive: true,
      emailVerifiedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const safeUser = sanitizeUser(mockUser)

    expect(safeUser).not.toHaveProperty('passwordHash')
    expect(safeUser.email).toBe('dean@apex.edu')
    expect(safeUser.fullName).toBe('Dean Armstrong')
    expect(safeUser.globalRole).toBe(GlobalRole.STANDARD_USER)
  })

  it('configures secure, HTTP-only session cookie options', () => {
    const cookieOptions = getSessionCookieOptions()

    expect(cookieOptions.name).toBe(SESSION_COOKIE_NAME)
    expect(cookieOptions.httpOnly).toBe(true)
    expect(cookieOptions.sameSite).toBe('lax')
    expect(cookieOptions.path).toBe('/')
    expect(cookieOptions.maxAge).toBe(SESSION_MAX_AGE_SECONDS)
  })
})
