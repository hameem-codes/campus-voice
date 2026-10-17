'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentGeneralView } from '@/views/student/StudentGeneralView'

export default function StudentGeneralPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <StudentGeneralView />
    </RouteGuard>
  )
}
