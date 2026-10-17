'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentEventDetailView } from '@/views/student/StudentEventDetailView'

export default function StudentEventStaticPage() {
  return (
    <RouteGuard allowedRoles={['student', 'faculty', 'admin']}>
      <StudentEventDetailView />
    </RouteGuard>
  )
}
