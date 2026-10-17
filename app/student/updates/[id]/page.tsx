'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentDetailView } from '@/views/student/StudentDetailView'
import { PinnedNoticeBar } from '@/components/cards/PinnedNoticeBar'

import { useStore } from '@/lib/store'

export default function UpdateDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id || ''
  const { updates } = useStore()
  const item = updates.find((u) => u.id === id)

  return (
    <RouteGuard allowedRoles={['student', 'faculty', 'admin']}>
      <AppShell>
        <PageHeader
          title={item?.title || 'Notice'}
          breadcrumb="Dashboard / Updates"
          depth={3}
        />
        <PinnedNoticeBar />
        <StudentDetailView updateId={id} />
      </AppShell>
    </RouteGuard>
  )
}
