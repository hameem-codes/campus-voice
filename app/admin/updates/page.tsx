'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminUpdatesView } from '@/views/admin/AdminUpdatesView'

export default function AdminUpdatesPage() {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <AppShell>
        <PageHeader
          title="Campus Notices & Approvals"
          subtitle="Review, approve, and audit announcements across all departments."
        />
        <AdminUpdatesView />
      </AppShell>
    </RouteGuard>
  )
}
