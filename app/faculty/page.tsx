'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { FacultyHomeView } from '@/views/faculty/FacultyHomeView'

export default function FacultyHomePage() {
  return (
    <RouteGuard allowedRoles={['faculty', 'admin']}>
      <AppShell>
        <PageHeader
          title="Faculty Dashboard"
          subtitle="Your publishing and notice management workspace at a glance."
        />
        <FacultyHomeView />
      </AppShell>
    </RouteGuard>
  )
}
