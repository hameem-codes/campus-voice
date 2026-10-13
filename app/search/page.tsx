'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { GlobalSearchView } from '@/views/shared/GlobalSearchView'

export default function SearchPage() {
  return (
    <RouteGuard allowedRoles={['student', 'faculty', 'admin']}>
      <AppShell>
        <PageHeader
          title="Global Search"
          subtitle="Real-time search across all verified campus signals, files, and notices."
        />
        <GlobalSearchView />
      </AppShell>
    </RouteGuard>
  )
}
