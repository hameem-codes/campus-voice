'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { FacultyCreateView } from '@/views/faculty/FacultyCreateView'

export default function FacultyCreatePage() {
  return (
    <RouteGuard allowedRoles={['faculty', 'admin', 'student']}>
      <FacultyCreateView />
    </RouteGuard>
  )
}
