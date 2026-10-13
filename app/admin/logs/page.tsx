'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminLogsView } from '@/views/admin/AdminLogsView'

export default function AdminLogsPage() {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <AppShell>
        <PageHeader
          title="Audit Log & Operations"
          subtitle="Real-time compliance log of every action, notice modification, and delivery channel rule."
        />
        <AdminLogsView />
      </AppShell>
    </RouteGuard>
  )
}
