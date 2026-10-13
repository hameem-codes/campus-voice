'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentSavedView } from '@/views/student/StudentSavedView'

export default function StudentSavedPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <AppShell>
        <PageHeader
          title="Saved Shelf"
          subtitle="Notices and official documentation pinned for quick retrieval."
        />
        <StudentSavedView />
      </AppShell>
    </RouteGuard>
  )
}
