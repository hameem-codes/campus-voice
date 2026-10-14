'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminUsersView } from '@/views/admin/AdminUsersView'

export default function AdminUsersPage() {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <AppShell>
        <PageHeader
          title="People"
          depth={2}
        />
        <AdminUsersView />
      </AppShell>
    </RouteGuard>
  )
}
