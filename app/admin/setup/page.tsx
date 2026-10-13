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
          title="Campus Setup & Taxonomies"
          subtitle="Configure notice categories, academic structure, and audience groups."
        />
        <AdminSetupView />
      </AppShell>
    </RouteGuard>
  )
}
