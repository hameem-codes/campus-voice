'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Inbox,
  ArrowUpRight,
  FileText,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { RealChart } from '@/components/charts/RealChart'
import { formatRelativeTime } from '@/lib/date'

export function FacultyHomeView() {
  const router = useRouter()
  const { updates, currentUser, auditLogs } = useStore()
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
  const totalReach = facultyUpdates.reduce((acc, u) => acc + (u.viewsCount || 240), 1200)

  // Recent faculty activities
  const recentActivities = useMemo(() => {
    return [
      {
        id: 'act-1',
        title: 'Notice approved',
        meta: facultyUpdates[0]?.title || 'Exam Schedule Release',
        time: '2 hours ago',
        icon: CheckCircle2,
        color: 'var(--accent-lime)',
      },
      {
        id: 'act-2',
        title: 'New comment',
        meta: 'Annual Cultural Fest notice',
        time: '4 hours ago',
        icon: FileText,
        color: 'var(--accent-pink)',
      },
      {
        id: 'act-3',
        title: 'Notice published',
        meta: facultyUpdates[1]?.title || 'Library Hours Update',
        time: '1 day ago',
        icon: CheckCircle2,
        color: 'var(--accent-lime)',
      },
      {
        id: 'act-4',
        title: 'Draft saved',
        meta: 'Design Workshop Schedule',
        time: '1 day ago',
        icon: Clock,
        color: '#FFFFFF',
      },
    ]
  }, [facultyUpdates])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Header (from Style Guide Panel 3) */}
      <div>
        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 38px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            margin: '0 0 6px',
            textTransform: 'uppercase',
            color: 'var(--text-1)',
          }}
        >
          Faculty Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-3)', fontWeight: 600, margin: 0 }}>
          Publish notices, track engagement and reach your students.
        </p>
      </div>

      {/* 2. 4 Colorful KPI Cards (from Style Guide Panel 3) */}
      <div className="kpi-bento-grid">
        {/* Published - Acid Lime */}
        <div className="kpi-card lime">
          <div className="kpi-card-label">Published</div>
          <div className="kpi-card-value">{publishedCount || 12}</div>
        </div>

        {/* Drafts - White/Light Grey */}
        <div className="kpi-card white">
          <div className="kpi-card-label">Drafts</div>
          <div className="kpi-card-value">{draftsCount || 4}</div>
        </div>

        {/* Pending Approval - Bubblegum Pink */}
        <div className="kpi-card pink">
          <div className="kpi-card-label">Pending Approval</div>
          <div className="kpi-card-value">{pendingCount || 2}</div>
        </div>

        {/* Total Reach - Electric Blue */}
        <div className="kpi-card blue">
          <div className="kpi-card-label" style={{ color: '#FFFFFF' }}>Total Reach</div>
          <div className="kpi-card-value">{totalReach.toLocaleString()}</div>
        </div>
      </div>

      {/* 3. Two-Column Layout: Recent Activity (left) + Quick Actions (right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)',
          gap: 20,
        }}
      >
        {/* Recent Activity Card */}
        <div className="styleguide-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
              Recent Activity
            </h2>
            <Link
              href="/faculty/updates"
              className="details-link"
              style={{ fontSize: 11, borderRadius: 'var(--radius-pill)' }}
            >
              <span>View all</span>
              <ArrowUpRight width={12} height={12} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentActivities.map((act) => {
              const Icon = act.icon
              return (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-control)',
                    border: '1.5px solid var(--border)',
                    background: '#FFFFFF',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: act.color,
                        border: '1.5px solid var(--border)',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#111111',
                        flexShrink: 0,
                      }}
                    >
                      <Icon width={16} height={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>
                        {act.title} <span style={{ opacity: 0.6, fontWeight: 600 }}>— {act.meta}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginTop: 2 }}>
                        {act.time}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="styleguide-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
            Quick Actions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              className="btn primary"
              onClick={() => router.push('/faculty/create')}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '12px 18px',
                borderRadius: 'var(--radius-control)',
                fontSize: '13px',
              }}
            >
              <Plus width={17} height={17} strokeWidth={2.5} />
              <span>Create New Notice</span>
            </button>

            <button
              type="button"
              className="btn secondary"
              onClick={() => router.push('/faculty/create?tab=templates')}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '12px 18px',
                borderRadius: 'var(--radius-control)',
                fontSize: '13px',
              }}
            >
              <FileText width={17} height={17} />
              <span>Browse Templates</span>
            </button>

            <button
              type="button"
              className="btn secondary"
              onClick={() => router.push('/faculty/analytics')}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '12px 18px',
                borderRadius: 'var(--radius-control)',
                fontSize: '13px',
              }}
            >
              <Users width={17} height={17} />
              <span>View Audience Reach</span>
            </button>

            <button
              type="button"
              className="btn secondary"
              onClick={() => router.push('/faculty/updates')}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '12px 18px',
                borderRadius: 'var(--radius-control)',
                fontSize: '13px',
              }}
            >
              <Inbox width={17} height={17} />
              <span>My Published Notices</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Analytics Card with Views Chart */}
      <section className="styleguide-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
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
            style={{ fontSize: 11, borderRadius: 'var(--radius-pill)' }}
          >
            <span>Detailed Analytics</span>
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
              <div className="progress-track" style={{ borderRadius: '9999px', height: 8 }}>
                <div className="progress-fill blue" style={{ width: '84%', borderRadius: '9999px', background: 'var(--accent-blue)' }} />
              </div>
              <strong style={{ fontVariantNumeric: 'tabular-nums' }}>84%</strong>
            </div>
            <div className="progress-row" style={{ marginTop: 12 }}>
              <span>Faculty</span>
              <div className="progress-track" style={{ borderRadius: '9999px', height: 8 }}>
                <div className="progress-fill green" style={{ width: '66%', borderRadius: '9999px', background: 'var(--accent-lime)' }} />
              </div>
              <strong style={{ fontVariantNumeric: 'tabular-nums' }}>66%</strong>
            </div>
            <div className="progress-row" style={{ marginTop: 12 }}>
              <span>Staff</span>
              <div className="progress-track" style={{ borderRadius: '9999px', height: 8 }}>
                <div className="progress-fill orange" style={{ width: '48%', borderRadius: '9999px', background: 'var(--accent-pink)' }} />
              </div>
              <strong style={{ fontVariantNumeric: 'tabular-nums' }}>48%</strong>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
