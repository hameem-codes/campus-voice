# Campus Voice — Database Migration & Multi-Tenant Security Strategy

## 1. Connection Architecture (Supabase / Cloud PostgreSQL)

When operating with serverless cloud hosts (Vercel) and cloud PostgreSQL (Supabase), two distinct connection URLs are required:

1. **Transaction Pooler URL (`DATABASE_URL`)**:
   - Port: `6543` (Supavisor / PgBouncer)
   - Mode: Transaction pooling
   - Usage: Used by Next.js API route handlers and server runtime. Supports thousands of concurrent serverless lambdas without exhausting the PostgreSQL connection ceiling.
   - Example format: `postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=15`

2. **Direct Connection URL (`DIRECT_URL`)**:
   - Port: `5432` (Direct PostgreSQL connection)
   - Mode: Session connection
   - Usage: Used exclusively by Prisma CLI (`prisma migrate deploy`, `prisma db push`) for schema changes, DDL modifications, triggers, and lock management that are incompatible with transaction poolers.
   - Example format: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

---

## 2. Migration Execution Instructions

### A. Applying Migrations to Cloud PostgreSQL (Zero-Cost Free Tier)
Once cloud resources are authorized and provisioned, execute:
```bash
# Set production environment variables
export DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@...:6543/postgres?pgbouncer=true"
export DIRECT_URL="postgresql://postgres:[PASSWORD]@...:5432/postgres"

# Execute reproducible migrations
npx prisma migrate deploy
```

### B. Validating Migration Integrity
```bash
npx prisma validate
npx prisma migrate status
```

---

## 3. Database Security & Row-Level Security (RLS) Trust Boundary

### A. Row-Level Security (RLS) Policies
PostgreSQL RLS is enabled on all tenant-owned tables (`departments`, `sections`, `courses`, `academic_years`, `categories`, `tenant_memberships`, `tenant_settings`, `invitations`, `audit_logs`).

Each tenant table enforces isolation based on the session variable:
```sql
CREATE POLICY tenant_isolation_departments ON departments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
```

### B. Trust Boundary Between Application and Database
1. **Application Layer (Primary Defense)**:
   - Every API handler and query in `lib/tenant.ts` resolves the tenant context strictly from verified session tokens.
   - All Prisma queries explicitly inject the predicate `where: { tenantId: authorizedTenantId }`.
   - Client-provided tenant IDs or IDs from other tenants are rejected with `403 Forbidden` or `404 Not Found`.
2. **Database Layer (Defense-in-Depth)**:
   - When connecting with a dedicated application role (`cv_app_user`), the database denies any rows that do not match `app.current_tenant_id`.
   - Superuser accounts (`postgres`) bypass RLS; hence, application-level scoping provides the primary boundary, preventing leakage regardless of connection role.
3. **Database-Enforced Immutability on Audit Logs**:
   - A PostgreSQL trigger forbids any `UPDATE` or `DELETE` statement on the `audit_logs` table:
   ```sql
   CREATE TRIGGER audit_logs_immutable_trigger
   BEFORE UPDATE OR DELETE ON audit_logs
   FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_mutation();
   ```
   - Any attempt to tamper with or erase an audit record causes PostgreSQL to throw an uncatchable transaction error.

---

## 4. Rollback and Disaster Recovery Procedure

1. **Down Migration Script**:
   - If a rollback is required, execute the down-migration script:
   ```sql
   DROP TRIGGER IF EXISTS audit_logs_immutable_trigger ON audit_logs;
   DROP FUNCTION IF EXISTS prevent_audit_log_mutation();
   DROP TABLE IF EXISTS audit_logs CASCADE;
   DROP TABLE IF EXISTS invitations CASCADE;
   DROP TABLE IF EXISTS sessions CASCADE;
   DROP TABLE IF EXISTS tenant_memberships CASCADE;
   DROP TABLE IF EXISTS categories CASCADE;
   DROP TABLE IF EXISTS courses CASCADE;
   DROP TABLE IF EXISTS sections CASCADE;
   DROP TABLE IF EXISTS academic_years CASCADE;
   DROP TABLE IF EXISTS departments CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   DROP TABLE IF EXISTS tenant_settings CASCADE;
   DROP TABLE IF EXISTS tenants CASCADE;
   DROP TYPE IF EXISTS "InvitationStatus";
   DROP TYPE IF EXISTS "MembershipStatus";
   DROP TYPE IF EXISTS "TenantRole";
   DROP TYPE IF EXISTS "TenantStatus";
   DROP TYPE IF EXISTS "GlobalRole";
   ```
2. **Backup & Restore Strategy**:
   - Before deploying any future schema migrations, execute:
   ```bash
   pg_dump --clean --if-exists --no-owner -h db.[REF].supabase.co -U postgres postgres > backup_m1_baseline.sql
   ```
   - Restore command:
   ```bash
   psql -h db.[REF].supabase.co -U postgres -d postgres < backup_m1_baseline.sql
   ```
