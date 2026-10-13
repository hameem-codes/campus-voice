'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentUpdatesView } from '@/views/student/StudentUpdatesView'

export default function StudentUpdatesPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <AppShell>
        <PageHeader
          title="Campus Updates"
          subtitle="All notices, examination schedules, and community alerts."
        />
        <StudentUpdatesView />
      </AppShell>
    </RouteGuard>
  )
}
