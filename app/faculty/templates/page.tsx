'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { FacultyTemplatesView } from '@/views/faculty/FacultyTemplatesView'

export default function FacultyTemplatesPage() {
  return (
    <RouteGuard allowedRoles={['faculty', 'admin', 'student']}>
      <FacultyTemplatesView />
    </RouteGuard>
  )
}
