'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentProfileView } from '@/views/student/StudentProfileView'

export default function StudentProfilePage() {
  return (
    <RouteGuard allowedRoles={['student', 'faculty', 'admin']}>
      <StudentProfileView />
    </RouteGuard>
  )
}
