'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentStreakView } from '@/views/student/StudentStreakView'

export default function StudentStreakPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <StudentStreakView />
    </RouteGuard>
  )
}
