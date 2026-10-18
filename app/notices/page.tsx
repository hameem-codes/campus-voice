'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { FacultyUpdatesView } from '@/views/faculty/FacultyUpdatesView'

export default function NoticesPage() {
  return (
    <RouteGuard allowedRoles={['faculty', 'admin', 'student']}>
      <FacultyUpdatesView />
    </RouteGuard>
  )
}
