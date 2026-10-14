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
          title="Dashboard"
          depth={1}
        />
        <StudentHomeView />
      </AppShell>
    </RouteGuard>
  )
}
