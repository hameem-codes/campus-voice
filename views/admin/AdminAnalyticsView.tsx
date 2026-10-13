'use client'

import React, { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  BarChart2,
  Users,
  Activity,
  CheckCircle,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { RealChart } from '@/components/charts/RealChart'

export function AdminAnalyticsView() {
  const { updates, categories, addToast } = useStore()
  const [range, setRange] = useState<'7' | '30' | '90'>('30')

  // Overall counts
  const totalNotices = updates.length
  const totalViews = useMemo(() => {
    return updates.reduce((acc, u) => acc + (u.viewsCount || 0), 0)
  }, [updates])

  const totalReads = useMemo(() => {
    return updates.reduce((acc, u) => acc + (u.readsCount || 0), 0)
  }, [updates])

  // Category stats
  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const match = updates.filter((u) => u.category === cat.name)
      const views = match.reduce((acc, u) => acc + (u.viewsCount || 0), 0)
      return {
        name: cat.name,
        color: cat.color,
        count: match.length,
        views,
      }
    })
  }, [categories, updates])

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Category', 'Notice Count', 'Total Views']
    const rows = categoryStats.map((c) => [c.name, c.count, c.views])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `admin_campus_analytics_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    addToast({
      type: 'success',
      title: 'Admin analytics report exported',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>
            Campus-Wide Delivery & Activity
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
            System-wide notice distribution across 2,400 enrolled accounts.
          </span>
        </div>

        <Button variant="secondary" icon={Download} onClick={handleExportCSV}>
          Export Campus Report
        </Button>
      </div>

      {/* 4 Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Notices</div>
          <div className="stat-value">{totalNotices}</div>
          <div className="stat-note positive">All categories active</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Delivery Reach</div>
          <div className="stat-value">99.4%</div>
          <div className="stat-note positive">0 delivery dropouts</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Views</div>
          <div className="stat-value">{totalViews.toLocaleString()}</div>
          <div className="stat-note positive">Active campus engagement</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Verified Reads</div>
          <div className="stat-value">{totalReads.toLocaleString()}</div>
          <div className="stat-note">Students & staff confirmed</div>
        </div>
      </div>

      {/* Real Chart */}
      <RealChart title="Campus Signals Viewed Over Time" />

      {/* Category breakdown table */}
      <section className="panel-card" style={{ padding: 24 }}>
        <h2 className="panel-title" style={{ margin: '0 0 16px' }}>
          Notice Volume by Category
        </h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Notices Published</th>
                <th>Recorded Views</th>
                <th>Engagement Share</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map((c) => {
                const share =
                  totalViews > 0 ? `${Math.round((c.views / totalViews) * 100)}%` : '0%'

                return (
                  <tr key={c.name}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{ width: 10, height: 10, borderRadius: 3, background: c.color }}
                        />
                        <strong>{c.name}</strong>
                      </div>
                    </td>
                    <td>{c.count}</td>
                    <td>{c.views.toLocaleString()}</td>
                    <td>{share}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
