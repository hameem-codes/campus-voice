'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Plus, Settings2, Sparkles } from 'lucide-react'
import { Role } from '@/types'
import { Button } from '@/components/ui/Button'
import { NotificationPopover } from './NotificationPopover'
import { useStore } from '@/lib/store'

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: string
  action?: React.ReactNode
}

export function PageHeader({ title, subtitle, breadcrumb, action }: PageHeaderProps) {
  const router = useRouter()
  const { role, unreadNotificationsCount, hasUrgentNotification, simulateNewUrgentUpdate } = useStore()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const defaultBreadcrumb =
    breadcrumb ||
    (role === 'student'
      ? 'Student workspace'
      : role === 'faculty'
      ? 'Faculty workspace'
      : 'Admin workspace')

  return (
    <header className="page-header">
      <div>
        <div className="breadcrumb">
          {defaultBreadcrumb} <span aria-hidden="true">/</span> {title}
        </div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      <div className="header-actions">
        {/* Quick simulate alert for verification */}
        <button
          type="button"
          className="icon-button"
          aria-label="Simulate urgent alert"
          title="Simulate incoming urgent alert (Dev)"
          onClick={simulateNewUrgentUpdate}
        >
          <Sparkles width={15} height={15} style={{ color: 'var(--accent-orange)' }} />
        </button>

        {/* Notifications Bell */}
        <div className="bell-wrap">
          <button
            type="button"
            className="icon-button"
            aria-label={`Open notifications (${unreadNotificationsCount} unread)`}
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((v) => !v)}
          >
            <Bell />
            {unreadNotificationsCount > 0 && (
              <span
                className={`bell-dot ${hasUrgentNotification ? 'urgent-shake' : ''}`}
                title={`${unreadNotificationsCount} unread notifications`}
              />
            )}
          </button>

          {notificationsOpen && (
            <NotificationPopover onClose={() => setNotificationsOpen(false)} />
          )}
        </div>

        {/* Custom page action or standard role action */}
        {action ? (
          action
        ) : role === 'faculty' ? (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => router.push('/faculty/create')}
          >
            Create update
          </Button>
        ) : role === 'admin' ? (
          <Button
            variant="secondary"
            icon={Settings2}
            className="secondary-action"
            onClick={() => router.push('/admin/setup')}
          >
            Setup
          </Button>
        ) : (
          <Button
            variant="primary"
            icon={Search}
            onClick={() => router.push('/search')}
          >
            Find an update
          </Button>
        )}
      </div>
    </header>
  )
}
