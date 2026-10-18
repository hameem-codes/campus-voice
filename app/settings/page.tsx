'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminSetupView } from '@/views/admin/AdminSetupView'

export default function SettingsPage() {
  return (
    <RouteGuard allowedRoles={['admin', 'faculty', 'student']}>
      <AdminSetupView />
    </RouteGuard>
  )
}
