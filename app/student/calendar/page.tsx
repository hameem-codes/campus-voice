'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentCalendarView } from '@/views/student/StudentCalendarView'

export default function StudentCalendarPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <AppShell>
        <PageHeader
          title="Calendar"
          depth={2}
        />
        <StudentCalendarView />
      </AppShell>
    </RouteGuard>
  )
}
