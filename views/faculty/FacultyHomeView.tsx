'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Inbox,
  Clock3,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { RealChart } from '@/components/charts/RealChart'

export function FacultyHomeView() {
  const router = useRouter()
  const { updates, currentUser } = useStore()

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

  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Grid */}
      <div className="hero-grid">
        <section className="hero-card">
          <div>
            <div className="eyebrow">Faculty Workspace · {todayStr}</div>
            <h2>Make the next campus signal clear.</h2>
            <p>
              {draftsCount} draft{draftsCount === 1 ? '' : 's'} ready for editing and{' '}
              {scheduledCount} notice{scheduledCount === 1 ? '' : 's'} scheduled for dispatch.
            </p>
          </div>
          <div className="hero-actions">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => router.push('/faculty/create')}
            >
              Create update
            </Button>
            <Button
              variant="secondary"
              icon={Inbox}
              onClick={() => router.push('/faculty/updates')}
            >
              Review my updates
            </Button>
          </div>
        </section>

        <section className="urgent-card">
          <div className="urgent-icon">
            <Clock3 />
          </div>
          <div>
            <h3>
              {pendingCount === 0
                ? 'Approval queue is clear.'
                : `${pendingCount} update${pendingCount === 1 ? '' : 's'} awaiting review.`}
            </h3>
            <p>
              Notices submitted from your department will go live once confirmed by administration.
            </p>
          </div>
          <Button
            variant="ghost"
            icon={ArrowUpRight}
            onClick={() => router.push('/faculty/updates')}
          >
            Open updates
          </Button>
        </section>
      </div>

      {/* Stats Grid from real store */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Published Notices</div>
          <div className="stat-value">{publishedCount}</div>
          <div className="stat-note positive">Live in student feeds</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Reach</div>
          <div className="stat-value">78%</div>
          <div className="stat-note positive">+8% this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Approval</div>
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-note">In admin review</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Scheduled</div>
          <div className="stat-value">{scheduledCount}</div>
          <div className="stat-note">Upcoming dispatches</div>
        </div>
      </div>

      {/* Analytics Chart & Read Status section */}
      <section>
        <div className="section-heading">
          <h2>Recent performance</h2>
          <Link
            href="/faculty/analytics"
            style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'none' }}
          >
            View full analytics <ArrowUpRight width={13} height={13} style={{ verticalAlign: 'middle' }} />
          </Link>
        </div>

        <div className="analytics-layout">
          <RealChart title="Department Views Across Updates" />

          {/* Read Status breakdown */}
          <section className="panel-card">
            <h2 className="panel-title">Cohort Completion Rate</h2>
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
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid var(--border)',
                color: 'var(--text-2)',
                fontSize: 12,
              }}
            >
              Best performing notice:{' '}
              <strong style={{ color: 'var(--text-1)', fontWeight: 500 }}>
                {facultyUpdates[0]?.title || 'Mid-semester examination schedule'}
              </strong>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
