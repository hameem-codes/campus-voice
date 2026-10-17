'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Inbox,
  ArrowUpRight,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { UpdateCard } from '@/components/cards/UpdateCard'
import { AdminUpdateCard } from '@/components/cards/AdminUpdateCard'
import { RealChart } from '@/components/charts/RealChart'

export function AdminHomeView() {
  const router = useRouter()
  const { updates, adminMetrics } = useStore()

  // Real store pending approvals
  const pendingQueue = useMemo(() => {
    return updates.filter((u) => u.status === 'Pending')
  }, [updates])

  const publishedUpdates = useMemo(() => {
    return updates.filter((u) => u.status === 'Published')
  }, [updates])

  const publishedCount = adminMetrics.publishedCount
  const pendingCount = adminMetrics.pendingCount
  const totalUsers = adminMetrics.totalEnrolledAccounts
  const deliveryReach = adminMetrics.averageReach > 0 ? `${adminMetrics.averageReach}%` : '94%'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Editorial Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: '0 0 6px',
              color: 'var(--text-1)',
            }}
          >
            Admin Dashboard
          </h1>
          <p style={{ margin: 0, color: 'var(--text-2)', fontSize: 15 }}>
            Review campus operations, manage notices, and coordinate student approvals.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            className="action-btn-secondary"
            style={{ fontSize: 13, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => router.push('/admin/updates')}
          >
            <Inbox width={16} height={16} />
            <span>Review Queue</span>
          </button>
          <button
            type="button"
            className="action-btn-primary"
            style={{ fontSize: 13, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => router.push('/admin/create')}
          >
            <Plus width={16} height={16} />
            <span>Create Notice</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Grid - Matching Style Guide */}
      <div className="kpi-bento-grid">
        <Link
          href="/admin/updates?status=Published"
          className="kpi-card lime"
          style={{ textDecoration: 'none', color: '#111111' }}
        >
          <div className="kpi-label">Published Notices</div>
          <div className="kpi-value">{publishedCount}</div>
        </Link>

        <Link
          href="/admin/users"
          className="kpi-card white"
          style={{ textDecoration: 'none', color: '#111111' }}
        >
          <div className="kpi-label">Enrolled Users</div>
          <div className="kpi-value">{totalUsers.toLocaleString()}</div>
        </Link>

        <Link
          href="/admin/updates?status=Pending"
          className="kpi-card pink"
          style={{ textDecoration: 'none', color: '#111111' }}
        >
          <div className="kpi-label">Pending Approval</div>
          <div className="kpi-value">{pendingCount}</div>
        </Link>

        <Link
          href="/admin/analytics"
          className="kpi-card blue"
          style={{ textDecoration: 'none', color: '#ffffff' }}
        >
          <div className="kpi-label">Delivery Reach</div>
          <div className="kpi-value">{deliveryReach}</div>
        </Link>
      </div>

      {/* Needs your attention: Amber left border & tinted bg */}
      <section className="admin-attention-card">
        <div className="section-heading" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--neo-accent)',
                border: '1.5px solid #000',
                display: 'inline-block',
              }}
            />
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, textTransform: 'uppercase' }}>
              Needs your attention
            </h2>
          </div>
          <Link
            href="/admin/updates"
            className="details-link"
          >
            <span>Queue ({pendingCount})</span>
            <ArrowUpRight width={12} height={12} />
          </Link>
        </div>

        {pendingQueue.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
            {pendingQueue.map((item) => (
              <AdminUpdateCard
                key={item.id}
                item={item}
                onOpenDetails={() => router.push('/admin/updates')}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: '12px 0', color: 'var(--text-3)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
            No notices awaiting review. All submissions are current.
          </div>
        )}
      </section>

      {/* Compact Engagement Chart (Phase 4.7) */}
      <RealChart compact title="Campus Engagement Velocity" />

      {/* Recent Published Notices */}
      <section>
        <div className="section-heading">
          <h2>Active notices in circulation</h2>
          <Link
            href="/admin/updates"
            className="details-link"
          >
            <span>All notices ({publishedCount})</span>
            <ArrowUpRight width={12} height={12} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
          {publishedUpdates.slice(0, 3).map((item) => (
            <AdminUpdateCard
              key={item.id}
              item={item}
              onOpenDetails={() => router.push('/admin/updates')}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
