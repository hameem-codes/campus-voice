'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { X, Check, BellOff, ArrowUpRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatRelativeTime } from '@/lib/date'

export function NotificationPopover({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    role,
  } = useStore()

  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Urgent'>('All')

  const filtered = useMemo(() => {
    if (activeTab === 'Unread') return notifications.filter((n) => !n.read)
    if (activeTab === 'Urgent') return notifications.filter((n) => n.type === 'urgent')
    return notifications
  }, [notifications, activeTab])

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id)
    onClose()
    if (n.updateId) {
      if (role === 'student') {
        router.push(`/student/updates/${n.updateId}`)
      } else if (role === 'faculty') {
        router.push(`/faculty/updates`)
      } else {
        router.push(`/admin/updates`)
      }
    }
  }

  return (
    <div
      className="notification-popover"
      role="dialog"
      aria-label="Campus notifications"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="popover-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <strong>Notifications</strong>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            ({notifications.filter((n) => !n.read).length} unread)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            type="button"
            className="btn ghost small"
            style={{ fontSize: 11, padding: '2px 6px', height: 26 }}
            onClick={markAllNotificationsRead}
            title="Mark all notifications as read"
          >
            <Check width={12} height={12} />
            <span>Mark all read</span>
          </button>
          <button
            type="button"
            className="icon-button"
            style={{ width: 26, height: 26 }}
            aria-label="Close notifications"
            onClick={onClose}
          >
            <X width={14} height={14} />
          </button>
        </div>
      </div>

      <div className="popover-tabs">
        {(['All', 'Unread', 'Urgent'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`popover-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'Unread' && notifications.filter((n) => !n.read).length > 0 && (
              <span className="tab-pill">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
            {tab === 'Urgent' && notifications.filter((n) => n.type === 'urgent' && !n.read).length > 0 && (
              <span className="tab-pill orange">
                {notifications.filter((n) => n.type === 'urgent' && !n.read).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="popover-scroll-body">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`notification-item ${!item.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNotificationClick(item)
                }
              }}
            >
              <span
                className="notification-dot"
                style={{
                  background:
                    item.type === 'urgent'
                      ? 'var(--accent-orange)'
                      : item.type === 'reminder'
                      ? 'var(--accent-blue)'
                      : 'var(--text-3)',
                  opacity: item.read ? 0.35 : 1,
                }}
              />
              <div className="notification-copy" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                  <strong>{item.title}</strong>
                  <ArrowUpRight width={12} height={12} style={{ color: 'var(--text-3)' }} />
                </div>
                <p style={{ margin: '2px 0 0', color: 'var(--text-2)' }}>{item.message}</p>
                <div style={{ color: 'var(--text-3)', fontSize: 10, marginTop: 4 }}>
                  {formatRelativeTime(item.timestamp)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ minHeight: 140, padding: 16 }}>
            <BellOff width={20} height={20} />
            <h3 style={{ fontSize: 13 }}>No {activeTab.toLowerCase()} notifications</h3>
            <p style={{ fontSize: 11, margin: '2px 0 0' }}>
              You are all caught up with your campus alerts.
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border)',
          padding: '8px 12px',
          textAlign: 'center',
          backgroundColor: 'var(--surface-hover)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            onClose()
            router.push('/student/notifications')
          }}
          className="btn ghost small"
          style={{ width: '100%', fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}
        >
          View all notifications →
        </button>
      </div>
    </div>
  )
}
