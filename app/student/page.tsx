'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentHomeView } from '@/views/student/StudentHomeView'
import { PinnedNoticeBar } from '@/components/cards/PinnedNoticeBar'

export default function StudentHomePage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <AppShell>
        <PageHeader
          title="Dashboard"
          depth={1}
        />
        <PinnedNoticeBar />
        <StudentHomeView />
      </AppShell>
    </RouteGuard>
  )
}
