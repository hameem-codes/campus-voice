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
  depth?: 1 | 2 | 3
}

export function PageHeader({ title, subtitle, breadcrumb, action, depth }: PageHeaderProps) {
  const router = useRouter()
  const { role, unreadNotificationsCount, hasUrgentNotification } = useStore()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const renderBreadcrumb = () => {
    if (breadcrumb) {
      return (
        <div className="breadcrumb">
          {breadcrumb} <span aria-hidden="true">/</span> {title}
        </div>
      )
    }
    if (title === 'Dashboard' || title === 'Home') {
      return <div className="breadcrumb">Dashboard</div>
    }
    return (
      <div className="breadcrumb">
        Dashboard <span aria-hidden="true">/</span> {title}
      </div>
    )
  }

  return (
    <header className="page-header">
      <div>
        {renderBreadcrumb()}
        <h1 className={`page-title ${depth ? `depth-${depth}` : ''}`}>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      <div className="header-actions">

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
            New notice
          </Button>
        ) : role === 'admin' ? (
          <Button
            variant="secondary"
            icon={Settings2}
            className="secondary-action"
            onClick={() => router.push('/admin/setup')}
          >
            Settings
          </Button>
        ) : (
          <Button
            variant="secondary"
            icon={Search}
            className="outline-indigo"
            onClick={() => router.push('/search')}
          >
            Find an update
          </Button>
        )}
      </div>
    </header>
  )
}
