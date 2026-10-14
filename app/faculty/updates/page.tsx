'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { FacultyUpdatesView } from '@/views/faculty/FacultyUpdatesView'

export default function FacultyUpdatesPage() {
  return (
    <RouteGuard allowedRoles={['faculty', 'admin']}>
      <AppShell>
        <PageHeader
          title="My notices"
          depth={2}
        />
        <FacultyUpdatesView />
      </AppShell>
    </RouteGuard>
  )
}
