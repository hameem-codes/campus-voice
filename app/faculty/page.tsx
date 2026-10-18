'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { FacultyHomeView } from '@/views/faculty/FacultyHomeView'

export default function FacultyHomePage() {
  return (
    <RouteGuard allowedRoles={['faculty', 'admin', 'student']}>
      <FacultyHomeView />
    </RouteGuard>
  )
}
