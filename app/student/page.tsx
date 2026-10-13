'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentHomeView } from '@/views/student/StudentHomeView'

export default function StudentHomePage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <AppShell>
        <PageHeader
          title="Student Dashboard"
          subtitle="The latest verified notices and updates from your campus."
        />
        <StudentHomeView />
      </AppShell>
    </RouteGuard>
  )
}
