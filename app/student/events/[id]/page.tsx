'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentEventDetailView } from '@/views/student/StudentEventDetailView'

export default function StudentEventDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id || ''

  return (
    <RouteGuard allowedRoles={['student', 'faculty', 'admin']}>
      <StudentEventDetailView eventId={id} />
    </RouteGuard>
  )
}
