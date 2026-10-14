'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { FacultyAnalyticsView } from '@/views/faculty/FacultyAnalyticsView'

export default function FacultyAnalyticsPage() {
  return (
    <RouteGuard allowedRoles={['faculty', 'admin']}>
      <AppShell>
        <PageHeader
          title="Analytics"
          depth={2}
        />
        <FacultyAnalyticsView />
      </AppShell>
    </RouteGuard>
  )
}
