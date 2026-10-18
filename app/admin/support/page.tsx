'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminSupportView } from '@/views/admin/AdminSupportView'

export default function AdminSupportPage() {
  return (
    <RouteGuard allowedRoles={['admin', 'faculty', 'student']}>
      <AdminSupportView />
    </RouteGuard>
  )
}
