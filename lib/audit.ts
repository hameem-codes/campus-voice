import { prisma } from './db'
import { Prisma } from '@prisma/client'

export interface LogAuditInput {
  tenantId?: string | null
  actorUserId?: string | null
  actorRole?: string | null
  action: string
  resourceType: string
  resourceId?: string | null
  details?: Record<string, unknown> | null
  ipAddress?: string | null
  userAgent?: string | null
}

/**
 * Record an immutable audit log entry.
 * Note: Database trigger `prevent_audit_log_mutation()` strictly forbids
 * any subsequent UPDATE or DELETE queries on the audit_logs table.
 */
export async function createAuditLog(entry: LogAuditInput) {
  try {
    return await prisma.auditLog.create({
      data: {
        tenantId: entry.tenantId ?? null,
        actorUserId: entry.actorUserId ?? null,
        actorRole: entry.actorRole ?? null,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId ?? null,
        details: (entry.details ?? undefined) as Prisma.InputJsonValue | undefined,
        ipAddress: entry.ipAddress ?? null,
        userAgent: entry.userAgent ?? null,
      },
    })
  } catch (error) {
    // In production, failure to log audit event must be captured
    console.error('Failed to create audit log entry:', error)
    return null
  }
}
