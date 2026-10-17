'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentAnnouncementDetailView } from '@/views/student/StudentAnnouncementDetailView'

export default function StudentAnnouncementStaticPage() {
  return (
    <RouteGuard allowedRoles={['student', 'faculty', 'admin']}>
      <StudentAnnouncementDetailView />
    </RouteGuard>
  )
}
