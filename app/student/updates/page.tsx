'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentUpdatesView } from '@/views/student/StudentUpdatesView'
import { PinnedNoticeBar } from '@/components/cards/PinnedNoticeBar'

export default function StudentUpdatesPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <AppShell>
        <PageHeader
          title="Updates"
          depth={2}
        />
        <PinnedNoticeBar />
        <StudentUpdatesView />
      </AppShell>
    </RouteGuard>
  )
}
