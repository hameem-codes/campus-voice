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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Dense Header: factual summary + inline KPIs + actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          padding: '16px 20px',
          background: 'var(--bg-surface)',
          border: '3px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-1)' }}>
            {publishedCount} published, {pendingCount} pending review
          </h2>
          <div style={{ marginTop: 4 }}>
            <Link
              href="/admin/setup"
              className="details-link"
              style={{ fontSize: 11 }}
            >
              <span>Manage audiences →</span>
            </Link>
          </div>
        </div>

        {/* Inline KPI stats linked to filtered views (Phase 4.7) */}
        <div className="admin-header-kpis">
          <Link
            href="/admin/updates?status=Published"
            className="admin-kpi-item"
            style={{ textDecoration: 'none', color: 'inherit' }}
            title="View published notices"
          >
            <span>Published:</span>
            <strong>{publishedCount}</strong>
          </Link>
          <Link
            href="/admin/updates?status=Pending"
            className="admin-kpi-item"
            style={{ textDecoration: 'none', color: 'inherit' }}
            title="Review pending submissions"
          >
            <span>Pending:</span>
            <strong style={{ color: pendingCount > 0 ? 'var(--neo-accent)' : 'inherit' }}>
              {pendingCount}
            </strong>
          </Link>
          <Link
            href="/admin/users"
            className="admin-kpi-item"
            style={{ textDecoration: 'none', color: 'inherit' }}
            title="View enrolled campus users"
          >
            <span>Users:</span>
            <strong>{totalUsers.toLocaleString()}</strong>
          </Link>
          <Link
            href="/admin/analytics"
            className="admin-kpi-item"
            style={{ textDecoration: 'none', color: 'inherit' }}
            title="View delivery reach analytics"
          >
            <span>Delivery:</span>
            <strong>{deliveryReach}</strong>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={Inbox}
            onClick={() => router.push('/admin/updates')}
          >
            Review queue
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => router.push('/admin/create')}
          >
            New notice
          </Button>
        </div>
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
