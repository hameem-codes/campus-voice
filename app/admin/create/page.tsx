'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminCreateView } from '@/views/admin/AdminCreateView'

export default function AdminCreatePage() {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <AppShell>
        <PageHeader
          title="Create Universal Notice"
          subtitle="Publish verified campus-wide notices without targeting individual named students."
        />
        <AdminCreateView />
      </AppShell>
    </RouteGuard>
  )
}
