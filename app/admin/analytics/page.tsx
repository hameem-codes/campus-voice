'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/Header'
import { RouteGuard } from '@/components/layout/RouteGuard'
import { AdminAnalyticsView } from '@/views/admin/AdminAnalyticsView'

export default function AdminAnalyticsPage() {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <AppShell>
        <PageHeader
          title="Analytics"
          depth={2}
        />
        <AdminAnalyticsView />
      </AppShell>
    </RouteGuard>
  )
}
