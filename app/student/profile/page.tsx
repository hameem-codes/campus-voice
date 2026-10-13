'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentProfileView } from '@/views/student/StudentProfileView'

export default function StudentProfilePage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <AppShell>
        <PageHeader
          title="Student Profile"
          subtitle="Manage your academic credentials, cohort targeting, and notification delivery."
        />
        <StudentProfileView />
      </AppShell>
    </RouteGuard>
  )
}
