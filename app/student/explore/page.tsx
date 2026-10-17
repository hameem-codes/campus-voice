'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { StudentExploreView } from '@/views/student/StudentExploreView'

export default function StudentExplorePage() {
  return (
    <RouteGuard allowedRoles={['student']}>
      <StudentExploreView />
    </RouteGuard>
  )
}
