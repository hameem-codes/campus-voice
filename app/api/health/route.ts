import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const startTime = Date.now()
  let dbStatus = 'healthy'
  let dbLatencyMs = 0

  try {
    await prisma.$queryRaw`SELECT 1`
    dbLatencyMs = Date.now() - startTime
  } catch {
    dbStatus = 'unreachable'
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    uptimeSeconds: Math.floor(process.uptime()),
  })
}
