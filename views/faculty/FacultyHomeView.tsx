'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Inbox,
  ArrowUpRight,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { RealChart } from '@/components/charts/RealChart'

export function FacultyHomeView() {
  const router = useRouter()
  const { updates, currentUser } = useStore()
  const [analyticsTab, setAnalyticsTab] = useState<'Views' | 'Completion'>('Views')

  const facultyUpdates = useMemo(() => {
    return updates.filter(
      (u) =>
        u.publisher.name === currentUser.name ||
        u.department === currentUser.department
    )
  }, [updates, currentUser])

  const draftsCount = facultyUpdates.filter((u) => u.status === 'Draft').length
  const pendingCount = facultyUpdates.filter((u) => u.status === 'Pending').length
  const publishedCount = facultyUpdates.filter((u) => u.status === 'Published').length
  const scheduledCount = facultyUpdates.filter((u) => u.status === 'Scheduled').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Compact inline status bar */}
      <div className="faculty-status-bar">
        <div className="faculty-status-counts">
          <span>{draftsCount} draft{draftsCount === 1 ? '' : 's'}</span>
          <span className="faculty-status-sep">·</span>
          <span>{scheduledCount} scheduled</span>
          <span className="faculty-status-sep">·</span>
          <Link
            href="/faculty/updates"
            className="details-link"
            style={{ fontWeight: 500 }}
          >
            <span>{pendingCount} pending review</span>
            <ArrowUpRight width={12} height={12} />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={Inbox}
            onClick={() => router.push('/faculty/updates')}
          >
            My notices
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => router.push('/faculty/create')}
          >
            New notice
          </Button>
        </div>
      </div>

      {/* Stats Grid with alternating sizes, no redundant descriptors */}
      <div className="stats-grid-alternating">
        <div className="stat-card">
          <div className="stat-label">Published Notices</div>
          <div className="stat-value">{publishedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Reach</div>
          <div className="stat-value">78%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Approval</div>
          <div className="stat-value">{pendingCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Scheduled</div>
          <div className="stat-value">{scheduledCount}</div>
        </div>
      </div>

      {/* Analytics Card with Views / Completion Tabs */}
      <section className="panel-card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              type="button"
              className={`chip filter ${analyticsTab === 'Views' ? 'active' : ''}`}
              onClick={() => setAnalyticsTab('Views')}
            >
              Views
            </button>
            <button
              type="button"
              className={`chip filter ${analyticsTab === 'Completion' ? 'active' : ''}`}
              onClick={() => setAnalyticsTab('Completion')}
            >
              Completion
            </button>
          </div>

          <Link
            href="/faculty/analytics"
            className="details-link"
          >
            <span>Analytics</span>
            <ArrowUpRight width={12} height={12} />
          </Link>
        </div>

        {analyticsTab === 'Views' ? (
          <div>
            <RealChart title="Notice Views" />
          </div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            <div className="progress-row">
              <span>Students</span>
              <div className="progress-track">
                <div className="progress-fill blue" style={{ width: '84%' }} />
              </div>
              <span>84%</span>
            </div>
            <div className="progress-row">
              <span>Faculty</span>
              <div className="progress-track">
                <div className="progress-fill green" style={{ width: '66%' }} />
              </div>
              <span>66%</span>
            </div>
            <div className="progress-row">
              <span>Staff</span>
              <div className="progress-track">
                <div className="progress-fill orange" style={{ width: '48%' }} />
              </div>
              <span>48%</span>
            </div>

            <div
              style={{
                marginTop: 18,
                paddingTop: 14,
                borderTop: '1px solid var(--border)',
                color: 'var(--text-2)',
                fontSize: 12,
              }}
            >
              Top performing notice:{' '}
              <strong style={{ color: 'var(--text-1)', fontWeight: 500 }}>
                {facultyUpdates[0]?.title || 'Mid-semester examination schedule'}
              </strong>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
