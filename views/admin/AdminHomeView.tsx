'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Inbox,
  ShieldCheck,
  Check,
  ArrowUpRight,
  SlidersHorizontal,
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

  const publishedCount = useMemo(() => {
    return updates.filter((u) => u.status === 'Published').length
  }, [updates])

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
            <div className="eyebrow">Admin Workspace · {todayStr}</div>
            <h2>Publish one clear signal for the whole campus.</h2>
            <p>
              Admins broadcast universal notices. Individual student issues stay inside private account workflows.
            </p>
          </div>
          <div className="hero-actions">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => router.push('/admin/create')}
            >
              Create universal update
            </Button>
            <Button
              variant="secondary"
              icon={Inbox}
              onClick={() => router.push('/admin/updates')}
            >
              Review approval queue
            </Button>
          </div>
        </section>

        <section className="urgent-card">
          <div className="urgent-icon">
            <ShieldCheck />
          </div>
          <div>
            <h3>Universal by default.</h3>
            <p>
              Every published notice reaches an approved campus audience, never one named individual.
            </p>
          </div>
          <Button
            variant="ghost"
            icon={ArrowUpRight}
            onClick={() => router.push('/admin/setup')}
          >
            Manage audiences
          </Button>
        </section>
      </div>

      {/* 4 Stats Cards from real store */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Pending Approvals</div>
          <div className="stat-value">{pendingQueue.length}</div>
          <div className="stat-note">Waiting in approval queue</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Users</div>
          <div className="stat-value">2,412</div>
          <div className="stat-note positive">+12% this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Published Notices</div>
          <div className="stat-value">{publishedCount}</div>
          <div className="stat-note positive">Live in circulation</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Delivery Health</div>
          <div className="stat-value">99.4%</div>
          <div className="stat-note positive">All channels healthy</div>
        </div>
      </div>

      {/* Needs your attention: Approval Queue */}
      <section>
        <div className="section-heading">
          <h2>Needs your attention</h2>
          <Link
            href="/admin/updates"
            style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'none' }}
          >
            Approval queue ({pendingQueue.length}) <ArrowUpRight width={13} height={13} style={{ verticalAlign: 'middle' }} />
          </Link>
        </div>

        {pendingQueue.length > 0 ? (
          <div className="card-grid">
            {pendingQueue.slice(0, 3).map((item) => (
              <UpdateCard key={item.id} item={item} overrideRole="admin" />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ minHeight: 140 }}>
            <p>No notices currently pending approval.</p>
          </div>
        )}
      </section>
    </div>
  )
}
