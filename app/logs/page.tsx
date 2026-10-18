'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminLogsView } from '@/views/admin/AdminLogsView'

export default function LogsPage() {
  return (
    <RouteGuard allowedRoles={['admin', 'faculty', 'student']}>
      <AdminLogsView />
    </RouteGuard>
  )
}
