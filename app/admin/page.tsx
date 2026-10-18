'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminHomeView } from '@/views/admin/AdminHomeView'

export default function AdminHomePage() {
  return (
    <RouteGuard allowedRoles={['admin', 'faculty', 'student']}>
      <AdminHomeView />
    </RouteGuard>
  )
}
