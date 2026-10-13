'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminHomeView } from '@/views/admin/AdminHomeView'

export default function AdminHomePage() {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <AppShell>
        <PageHeader
          title="Admin Operations"
          subtitle="One clear signal and centralized governance for the whole campus."
        />
        <AdminHomeView />
      </AppShell>
    </RouteGuard>
  )
}
