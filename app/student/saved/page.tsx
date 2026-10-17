'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentBookmarksView } from '@/views/student/StudentBookmarksView'

export default function StudentSavedPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <StudentBookmarksView />
    </RouteGuard>
  )
}
