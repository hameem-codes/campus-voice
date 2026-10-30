# Campus Voice — Zero-Cost Cloud Architecture Specification

## 1. Owner Decisions & Financial Constraint
- **Spend Authorization**: ₹0 (Zero rupees).
- **Hard Rule**: No paid plans, billing accounts, credit card entries, paid add-ons, or usage-based cloud charges are permitted without prior explicit owner approval.
- **Milestone Boundary**: This document applies to Milestone 1 (Foundation & Multi-Tenant Architecture). Milestone 2 (Notice Publishing & Feeds) will not begin until explicit authorization is granted.

---

## 2. Infrastructure Provider Audit & Free Allowance Analysis

| Provider & Service | Free Allowance Tier | Inactivity / Retention Rules | Credit Card Required? | Hard Cap vs Overcharge Risk | Fallback / Migration Path |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Supabase PostgreSQL** | 500 MB database storage, 2 active projects, 60 direct / 200 pooler connections | Paused after 7 days of complete inactivity (resumable via dashboard / ping) | **No** (Email only) | **Hard Cap**: Requests rejected if limit reached; no automatic charges | Standard PostgreSQL (`pg_dump`/`pg_restore`), Neon, ElephantSQL, self-hosted Docker |
| **Supabase Object Storage** | 1 GB storage, 2 GB egress/month | Inactive files preserved within 1 GB quota | **No** | **Hard Cap**: Uploads rejected at 1 GB; zero billing | Cloudflare R2 (10 GB free), AWS S3 free tier, local disk storage |
| **Cloud Hosting (Vercel)** | 100 GB bandwidth, serverless compute, Next.js optimization | Project active as long as deployed | **No** | **Hard Cap**: Execution throttled; no unexpected invoices on Hobby tier | Cloudflare Pages, Netlify, Render, Docker on Railway/Fly free tiers |
| **GitHub Actions CI** | 2,000 Linux build minutes/month for private repos (Unlimited for public) | Workflow logs retained for 90 days | **No** | **Hard Cap**: Workflow runs fail/queue if quota exhausted; zero billing | Local npm runner, GitLab CI free tier |

---

## 3. Zero-Cost Enforcement & Billing Trap Prevention

1. **No Payment Method Policy**:
   - Accounts must be registered strictly without entering credit card, debit card, or billing details.
   - Without billing credentials on file, service providers cannot convert free tier accounts into paid accounts.
2. **Quota Monitoring**:
   - Database storage must be monitored via the `/api/health` endpoint and Supabase telemetry.
   - M1 schema footprint: The entire initial 12-table multi-tenant foundation requires < 15 MB of storage, well below the 500 MB limit.
3. **Inactivity Handling**:
   - Supabase pauses free-tier databases after 7 days without queries.
   - A health check ping or CI pipeline test run queries the database periodically to maintain active status during development cycles.
4. **Provider Independence**:
   - The application relies on standard ANSI SQL, PostgreSQL enums, standard UUIDs, and Prisma ORM.
   - Zero vendor-locked proprietary APIs are used in M1.
   - If Supabase alters its free tier terms, the entire backend can be pointed to Neon, Tembo, or self-hosted PostgreSQL simply by changing `DATABASE_URL` and `DIRECT_URL`.
