'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentDetailView } from '@/views/student/StudentDetailView'

export default function UpdateDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id || ''

  return (
    <RouteGuard allowedRoles={['student', 'faculty', 'admin']}>
      <AppShell>
        <PageHeader
          title="Notice Details"
          subtitle="Complete official message and verified attachments."
          breadcrumb="Student workspace / Updates"
        />
        <StudentDetailView updateId={id} />
      </AppShell>
    </RouteGuard>
  )
}
