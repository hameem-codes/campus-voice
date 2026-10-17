'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentEventsView } from '@/views/student/StudentEventsView'

export default function StudentCalendarPage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <StudentEventsView />
    </RouteGuard>
  )
}
