'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminUsersView } from '@/views/admin/AdminUsersView'

export default function AdminUsersPage() {
  return (
    <RouteGuard allowedRoles={['admin', 'faculty', 'student']}>
      <AdminUsersView />
    </RouteGuard>
  )
}
