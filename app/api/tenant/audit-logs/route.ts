import { NextRequest, NextResponse } from 'next/server'
import { requireTenantRole } from '@/lib/tenant'
import { prisma } from '@/lib/db'
import { TenantRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  const tenantAuth = await requireTenantRole(request, [TenantRole.TENANT_ADMIN])
  if (tenantAuth instanceof NextResponse) return tenantAuth

  const searchParams = request.nextUrl.searchParams
  const limit = Math.min(Number(searchParams.get('limit') || '50'), 100)
  const offset = Number(searchParams.get('offset') || '0')

  const logs = await prisma.auditLog.findMany({
    where: {
      tenantId: tenantAuth.tenant.id,
    },
    include: {
      actorUser: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })

  const total = await prisma.auditLog.count({
    where: {
      tenantId: tenantAuth.tenant.id,
    },
  })

  return NextResponse.json({ logs, total, limit, offset })
}
