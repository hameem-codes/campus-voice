'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminSetupView } from '@/views/admin/AdminSetupView'

export default function AdminSetupPage() {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <AppShell>
        <PageHeader
          title="Settings"
          depth={2}
        />
        <AdminSetupView />
      </AppShell>
    </RouteGuard>
  )
}
