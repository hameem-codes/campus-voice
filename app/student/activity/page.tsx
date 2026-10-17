'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentActivityView } from '@/views/student/StudentActivityView'

export default function StudentActivityPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <StudentActivityView />
    </RouteGuard>
  )
}
