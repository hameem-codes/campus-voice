'use client'

import React from 'react'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminAnalyticsView } from '@/views/admin/AdminAnalyticsView'

export default function AdminAnalyticsPage() {
  return (
    <RouteGuard allowedRoles={['admin', 'faculty', 'student']}>
      <AdminAnalyticsView />
    </RouteGuard>
  )
}
