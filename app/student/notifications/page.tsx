'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentNotificationsView } from '@/views/student/StudentNotificationsView'

export default function StudentNotificationsPage() {
  return (
    <RouteGuard allowedRoles={['student', 'faculty', 'admin']}>
      <StudentNotificationsView />
    </RouteGuard>
  )
}
