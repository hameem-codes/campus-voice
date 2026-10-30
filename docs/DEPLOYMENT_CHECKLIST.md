# Campus Voice — Milestone 1 Deployment & Cloud Readiness Checklist

## 1. Zero-Cost Pre-Deployment Safeguards
- [x] Zero cloud resources provisioned prior to owner authorization.
- [x] Spend authorized: ₹0. Zero credit cards or payment credentials entered.
- [x] Hosted services audited for zero-cost free allowance compliance (Supabase, Vercel, GitHub Actions).
- [x] Hard-quota enforcement verified: Services fail-closed on quota exhaustion without billing traps.
- [x] Portable database architecture: ANSI standard PostgreSQL, portable to Neon or self-hosted Docker.

---

## 2. Multi-Tenant Architecture & Schema Verification
- [x] Exactly 12 foundational tables implemented (tenants, tenant_settings, users, tenant_memberships, sessions, departments, academic_years, sections, courses, categories, invitations, audit_logs).
- [x] Notice and notification worker feature tables strictly deferred to M2–M5.
- [x] Clear separation between SaaS Platform Administrator (`global_role = 'PLATFORM_ADMIN'`) and Institution Tenant Administrator (`role = 'TENANT_ADMIN'`).
- [x] Multi-tenant user support verified: Users can belong to multiple educational institutions with distinct roles.
- [x] Database-enforced immutable audit logs via trigger `prevent_audit_log_mutation()`.
- [x] Row Level Security (RLS) policies configured for all tenant-owned tables.

---

## 3. Security & Authentication Verification
- [x] Argon2id password hashing implemented with OWASP parameters (memoryCost: 19456 KiB, timeCost: 2, parallelism: 1).
- [x] Session tokens generated using 32 bytes of cryptographic randomness.
- [x] Session tokens hashed with SHA-256 before database storage.
- [x] HTTP-only, SameSite=Lax, Secure cookies configured (`cv_session`).
- [x] Column-level protection: `password_hash` and `token_hash` strictly stripped from all public/user responses.
- [x] Tenant context derived exclusively from verified session memberships (never trusting raw client input).
- [x] Cross-tenant read and write denial verified by automated test suite.
- [x] Immediate membership revocation takes effect on subsequent requests.
- [x] Sole administrator self-deactivation prevented.

---

## 4. Local Build & Code Quality Evidence
| Verification Step | Command | Result | Exit Code |
| :--- | :--- | :--- | :--- |
| **ESLint** | `npm run lint` | Pass (0 errors, 0 warnings) | 0 |
| **TypeScript Typecheck** | `npm run typecheck` | Pass (0 errors) | 0 |
| **Vitest Unit & Integration Tests** | `npm run test` | Pass (27/27 tests passed across 4 files) | 0 |
| **Prisma Schema Validation** | `npx prisma validate` | Pass (Schema valid) | 0 |
| **Next.js Production Build** | `npm run build` | Pass (39/39 routes compiled successfully) | 0 |

---

## 5. Mandatory Stop Condition
> [!IMPORTANT]
> **MILESTONE 1 IS COMPLETE.**
> In strict compliance with owner decisions:
> - No public deployments have been executed.
> - No cloud resources or databases have been created.
> - No production data has been modified.
> - Milestone 2 (Notice Publishing, Feeds, Attachments) will NOT begin until the owner reviews this evidence and explicitly authorizes the next phase.
