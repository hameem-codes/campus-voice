'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentDashboardFeedView } from '@/views/student/StudentDashboardFeedView'

export default function StudentHomePage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <StudentDashboardFeedView initialActiveNav="Announcements" />
    </RouteGuard>
  )
}

