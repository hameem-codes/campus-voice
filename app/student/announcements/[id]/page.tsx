'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentAnnouncementDetailView } from '@/views/student/StudentAnnouncementDetailView'

export default function StudentAnnouncementDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id || ''

  return (
    <RouteGuard allowedRoles={['student', 'faculty', 'admin']}>
      <StudentAnnouncementDetailView noticeId={id} />
    </RouteGuard>
  )
}
