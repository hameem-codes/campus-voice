'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentAcademicView } from '@/views/student/StudentAcademicView'

export default function StudentAcademicPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <StudentAcademicView />
    </RouteGuard>
  )
}
