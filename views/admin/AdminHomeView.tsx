'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Inbox,
  ArrowUpRight,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { UpdateCard } from '@/components/cards/UpdateCard'

export function AdminHomeView() {
  const router = useRouter()
  const { updates } = useStore()

  // Real store pending approvals
  const pendingQueue = useMemo(() => {
    return updates.filter((u) => u.status === 'Pending')
  }, [updates])

  const publishedUpdates = useMemo(() => {
    return updates.filter((u) => u.status === 'Published')
  }, [updates])

  const publishedCount = publishedUpdates.length

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
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--text-1)' }}>
            {publishedCount} published, {pendingQueue.length} pending review
          </h2>
          <div style={{ marginTop: 4 }}>
            <Link
              href="/admin/setup"
              className="details-link"
              style={{ fontSize: 12 }}
            >
              <span>Manage audiences →</span>
            </Link>
          </div>
        </div>

        {/* Inline KPI stats */}
        <div className="admin-header-kpis">
          <div className="admin-kpi-item">
            <span>Published:</span>
            <strong>{publishedCount}</strong>
          </div>
          <div className="admin-kpi-item">
            <span>Pending:</span>
            <strong>{pendingQueue.length}</strong>
          </div>
          <div className="admin-kpi-item">
            <span>Users:</span>
            <strong>2,412</strong>
          </div>
          <div className="admin-kpi-item">
            <span>Delivery:</span>
            <strong>99.4%</strong>
          </div>
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
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--accent-orange)',
                display: 'inline-block',
              }}
            />
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, textTransform: 'uppercase' }}>Needs your attention</h2>
          </div>
          <Link
            href="/admin/updates"
            className="details-link"
          >
            <span>Queue ({pendingQueue.length})</span>
            <ArrowUpRight width={12} height={12} />
          </Link>
        </div>

        {pendingQueue.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
            {pendingQueue.map((item) => (
              <UpdateCard key={item.id} item={item} overrideRole="admin" />
            ))}
          </div>
        ) : (
          <div style={{ padding: '12px 0', color: 'var(--text-3)', fontSize: 13 }}>
            No notices awaiting review. All submissions are current.
          </div>
        )}
      </section>

      {/* Recent Published Notices */}
      <section>
        <div className="section-heading">
          <h2>Active notices in circulation</h2>
          <Link
            href="/admin/updates"
            className="details-link"
          >
            <span>All notices</span>
            <ArrowUpRight width={12} height={12} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
          {publishedUpdates.slice(0, 3).map((item) => (
            <UpdateCard key={item.id} item={item} overrideRole="admin" />
          ))}
        </div>
      </section>
    </div>
  )
}
