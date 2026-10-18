'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminUpdatesView } from '@/views/admin/AdminUpdatesView'

export default function AdminUpdatesPage() {
  return (
    <RouteGuard allowedRoles={['admin', 'faculty', 'student']}>
      <AdminUpdatesView />
    </RouteGuard>
  )
}
