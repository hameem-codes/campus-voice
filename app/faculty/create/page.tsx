'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { FacultyCreateView } from '@/views/faculty/FacultyCreateView'

export default function FacultyCreatePage() {
  return (
    <RouteGuard allowedRoles={['faculty', 'admin']}>
      <AppShell>
        <PageHeader
          title="New notice"
          depth={2}
        />
        <FacultyCreateView />
      </AppShell>
    </RouteGuard>
  )
}
