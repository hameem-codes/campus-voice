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
          title="Profile"
          depth={2}
        />
        <StudentProfileView />
      </AppShell>
    </RouteGuard>
  )
}
