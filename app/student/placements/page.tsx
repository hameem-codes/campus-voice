'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentPlacementsView } from '@/views/student/StudentPlacementsView'

export default function StudentPlacementsPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <StudentPlacementsView />
    </RouteGuard>
  )
}
