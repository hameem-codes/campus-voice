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
          title="Campus Analytics"
          subtitle="System-wide metrics on notice delivery, category volume, and audience reach."
        />
        <AdminAnalyticsView />
      </AppShell>
    </RouteGuard>
  )
}
