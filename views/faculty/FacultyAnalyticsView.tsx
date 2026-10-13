'use client'

import React, { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  Eye,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowUpRight,
  Filter,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { RealChart } from '@/components/charts/RealChart'
import { Modal } from '@/components/ui/Modal'
import { UpdateItem } from '@/types'

export function FacultyAnalyticsView() {
  const { updates, currentUser, addToast } = useStore()
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateItem | null>(null)
  const [drilldownOpen, setDrilldownOpen] = useState(false)

  // Faculty specific updates
  const facultyUpdates = useMemo(() => {
    return updates.filter(
      (u) =>
        u.publisher.name === currentUser.name ||
        u.department === currentUser.department
    )
  }, [updates, currentUser])

  // Computed metrics from real store
  const totalViews = useMemo(() => {
    return facultyUpdates.reduce((acc, u) => acc + (u.viewsCount || 0), 0)
  }, [facultyUpdates])

  const totalReads = useMemo(() => {
    return facultyUpdates.reduce((acc, u) => acc + (u.readsCount || 0), 0)
  }, [facultyUpdates])

  const averageReadRate = useMemo(() => {
    if (totalViews === 0) return '0%'
    return `${Math.round((totalReads / totalViews) * 100)}%`
  }, [totalViews, totalReads])

  const averageReach = useMemo(() => {
    const published = facultyUpdates.filter((u) => u.status === 'Published')
    if (published.length === 0) return '0%'
    const sum = published.reduce((acc, u) => acc + (u.reachPercentage || 0), 0)
    return `${Math.round(sum / published.length)}%`
  }, [facultyUpdates])

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Title', 'Category', 'Status', 'Department', 'Published Date', 'Views', 'Reads', 'Reach %']
    const rows = facultyUpdates.map((u) => [
      `"${u.title.replace(/"/g, '""')}"`,
      u.category,
      u.status,
      `"${u.department}"`,
      u.postedAt,
      u.viewsCount || 0,
      u.readsCount || 0,
      u.reachPercentage || 0,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `faculty_analytics_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    addToast({
      type: 'success',
      title: 'Analytics CSV exported',
      message: 'Download ready with cohort engagement data.',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header & Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>
            Engagement Metrics Overview
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
            Aggregated across {facultyUpdates.length} departmental announcements
          </span>
        </div>

        <Button variant="secondary" icon={Download} onClick={handleExportCSV}>
          Export CSV Report
        </Button>
      </div>

      {/* 4 Computed Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Views</div>
          <div className="stat-value">{totalViews.toLocaleString()}</div>
          <div className="stat-note positive">+14% vs previous 30 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Read Rate</div>
          <div className="stat-value">{averageReadRate}</div>
          <div className="stat-note positive">+6% student completion</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Reach</div>
          <div className="stat-value">{averageReach}</div>
          <div className="stat-note">Across targeted cohorts</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Notices Published</div>
          <div className="stat-value">
            {facultyUpdates.filter((u) => u.status === 'Published').length}
          </div>
          <div className="stat-note positive">Healthy signal volume</div>
        </div>
      </div>

      {/* Real Chart (Recharts) */}
      <RealChart title="Notice Views & Read Engagement" />

      {/* Per-Update Drilldown List */}
      <section className="panel-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="panel-title" style={{ margin: 0 }}>
            Per-Notice Performance Drilldown
          </h2>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            Click any notice to view audience breakdown
          </span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Notice Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Read Rate</th>
                <th>Reach %</th>
                <th style={{ textAlign: 'right' }}>Drilldown</th>
              </tr>
            </thead>
            <tbody>
              {facultyUpdates.map((item) => {
                const readRate =
                  item.viewsCount && item.viewsCount > 0
                    ? `${Math.round(((item.readsCount || 0) / item.viewsCount) * 100)}%`
                    : '—'

                return (
                  <tr
                    key={item.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedUpdate(item)
                      setDrilldownOpen(true)
                    }}
                  >
                    <td>
                      <strong>{item.title}</strong>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                        {item.department}
                      </div>
                    </td>
                    <td>
                      <span className="chip neutral">{item.category}</span>
                    </td>
                    <td>
                      <span className="chip neutral">{item.status}</span>
                    </td>
                    <td>{(item.viewsCount || 0).toLocaleString()}</td>
                    <td>{readRate}</td>
                    <td>{item.reachPercentage || 0}%</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn ghost small"
                        aria-label={`Drilldown ${item.title}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedUpdate(item)
                          setDrilldownOpen(true)
                        }}
                      >
                        <ArrowUpRight width={14} height={14} />
                        <span>Breakdown</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Per-Update Drilldown Modal */}
      <Modal
        isOpen={drilldownOpen}
        onClose={() => setDrilldownOpen(false)}
        title={selectedUpdate?.title || 'Notice Drilldown'}
        description={`Category: ${selectedUpdate?.category} · Department: ${selectedUpdate?.department}`}
        maxWidth="600px"
      >
        {selectedUpdate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-label">Views</div>
                <div className="stat-value" style={{ fontSize: 20 }}>
                  {selectedUpdate.viewsCount || 0}
                </div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-label">Reads</div>
                <div className="stat-value" style={{ fontSize: 20 }}>
                  {selectedUpdate.readsCount || 0}
                </div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-label">Reach</div>
                <div className="stat-value" style={{ fontSize: 20 }}>
                  {selectedUpdate.reachPercentage || 0}%
                </div>
              </div>
            </div>

            {/* Audience cohort breakdown */}
            <div>
              <div className="nav-section-label" style={{ padding: 0, marginBottom: 8 }}>
                Target Cohort Delivery Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="progress-row">
                  <span>Year 2 Students</span>
                  <div className="progress-track">
                    <div className="progress-fill blue" style={{ width: '92%' }} />
                  </div>
                  <span>92%</span>
                </div>
                <div className="progress-row">
                  <span>Year 3 Students</span>
                  <div className="progress-track">
                    <div className="progress-fill green" style={{ width: '84%' }} />
                  </div>
                  <span>84%</span>
                </div>
                <div className="progress-row">
                  <span>Studio D2 Section</span>
                  <div className="progress-track">
                    <div className="progress-fill orange" style={{ width: '100%' }} />
                  </div>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="secondary" onClick={() => setDrilldownOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
