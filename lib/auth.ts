import { hash, verify } from '@node-rs/argon2'
import crypto from 'crypto'
import { User } from '@prisma/client'

// OWASP Recommended Argon2id parameters
const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
}

export const SESSION_COOKIE_NAME = 'cv_session'
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60 // 7 days

/**
 * Hash a plain password using Argon2id
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS)
}

/**
 * Verify a plain password against an Argon2id hash
 */
export async function verifyPassword(hashVal: string, password: string): Promise<boolean> {
  try {
    return await verify(hashVal, password)
  } catch {
    return false
  }
}

/**
 * Generate a cryptographically secure random session token (32 bytes hex)
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Hash a session token using SHA-256 before storing or querying the database.
 * This guarantees that database exposure does not reveal usable session cookies.
 */
export function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export type SafeUser = Omit<User, 'passwordHash'>

/**
 * Enforce column-level security: strip passwordHash and any sensitive fields
 */
export function sanitizeUser(user: User): SafeUser {
  const { passwordHash: _passwordHash, ...safe } = user
  return safe
}

/**
 * Generate secure Set-Cookie header options
 */
export function getSessionCookieOptions(maxAgeSeconds = SESSION_MAX_AGE_SECONDS) {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}
