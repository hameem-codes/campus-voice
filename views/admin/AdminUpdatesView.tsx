'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  X,
  Search,
  Plus,
  ArrowUpRight,
  History,
  Archive,
  Trash2,
  AlertTriangle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { StatusChip, toneForStatus } from '@/components/ui/StatusChip'
import { Modal } from '@/components/ui/Modal'
import { Drawer } from '@/components/ui/Drawer'
import { formatDisplayDate, formatRelativeTime } from '@/lib/date'
import { UpdateItem } from '@/types'

export function AdminUpdatesView() {
  const router = useRouter()
  const {
    updates,
    approveUpdate,
    rejectUpdate,
    archiveUpdate,
    deleteUpdate,
    categories,
    addToast,
  } = useStore()

  // Tab filter: Approval queue, Published, Scheduled, Archived, Rejected
  const [activeTab, setActiveTab] = useState<string>('Approval queue')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modal / Drawer states
  const [rejectionTarget, setRejectionTarget] = useState<UpdateItem | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionError, setRejectionError] = useState('')
  const [drawerTarget, setDrawerTarget] = useState<UpdateItem | null>(null)

  // Map tabs to data statuses
  const filteredList = useMemo(() => {
    return updates.filter((item) => {
      // Tab matching
      if (activeTab === 'Approval queue' && item.status !== 'Pending') return false
      if (activeTab === 'Published' && item.status !== 'Published') return false
      if (activeTab === 'Scheduled' && item.status !== 'Scheduled') return false
      if (activeTab === 'Archived' && item.status !== 'Archived') return false
      if (activeTab === 'Rejected' && item.status !== 'Rejected') return false

      // Category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.publisher.name.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [updates, activeTab, selectedCategory, searchQuery])

  // Status counts
  const counts = useMemo(() => {
    return {
      'Approval queue': updates.filter((u) => u.status === 'Pending').length,
      Published: updates.filter((u) => u.status === 'Published').length,
      Scheduled: updates.filter((u) => u.status === 'Scheduled').length,
      Archived: updates.filter((u) => u.status === 'Archived').length,
      Rejected: updates.filter((u) => u.status === 'Rejected').length,
    }
  }, [updates])

  // Bulk actions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) setSelectedIds([])
    else setSelectedIds(filteredList.map((u) => u.id))
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleBulkApprove = async () => {
    for (const id of selectedIds) {
      await approveUpdate(id)
    }
    setSelectedIds([])
    addToast({
      type: 'success',
      title: `Approved ${selectedIds.length} notices`,
    })
  }

  const handleBulkReject = () => {
    if (selectedIds.length > 0) {
      const first = updates.find((u) => u.id === selectedIds[0])
      if (first) {
        setRejectionTarget(first)
      }
    }
  }

  const handleConfirmRejection = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError('A rejection reason is required for administrative auditing.')
      return
    }
    if (!rejectionTarget) return

    await rejectUpdate(rejectionTarget.id, rejectionReason.trim())
    setRejectionTarget(null)
    setRejectionReason('')
    setRejectionError('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Editorial Header - Panel 4 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(26px, 3.2vw, 36px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: '0 0 4px',
              color: 'var(--text-1)',
            }}
          >
            Approval Queue
          </h1>
          <p style={{ margin: 0, color: 'var(--text-2)', fontSize: 14 }}>
            Review and approve pending notices across all campus departments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            className="action-btn-primary"
            style={{ fontSize: 13, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => router.push('/admin/create')}
          >
            <Plus width={16} height={16} />
            <span>Create Notice</span>
          </button>
        </div>
      </div>

      {/* Pill Navigation Tabs */}
      <div className="pill-nav-container" style={{ alignSelf: 'flex-start', margin: 0 }}>
        {(['Approval queue', 'Published', 'Scheduled', 'Archived', 'Rejected'] as const)
          .filter((tab) => tab === 'Approval queue' || tab === 'Published' || counts[tab] > 0)
          .map((tab) => (
            <button
              key={tab}
              type="button"
              className={`pill-nav-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab)
                setSelectedIds([])
              }}
            >
              <span>{tab}</span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 9999,
                  fontSize: 11,
                  fontWeight: 900,
                  background: activeTab === tab ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
                  color: activeTab === tab ? '#111111' : '#ffffff',
                }}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
      </div>

      {/* Filter and Search Bar - Pill Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 320px', maxWidth: 640 }}>
          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              width={16}
              height={16}
              style={{ position: 'absolute', left: 16, color: 'var(--text-3)', pointerEvents: 'none' }}
            />
            <input
              className="pill-search-input"
              aria-label="Search notices"
              placeholder="Search by title, author, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 42, background: 'var(--bg-surface)' }}
            />
          </div>

          <select
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              border: '2px solid var(--border)',
              borderRadius: '9999px',
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 700,
              background: 'var(--bg-surface)',
              color: 'var(--text-1)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && activeTab === 'Approval queue' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={handleBulkApprove}
              style={{
                background: 'var(--accent-lime)',
                color: '#111111',
                border: '2px solid var(--border)',
                borderRadius: '9999px',
                padding: '8px 16px',
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Check width={14} height={14} />
              <span>Approve ({selectedIds.length})</span>
            </button>
            <button
              type="button"
              onClick={handleBulkReject}
              style={{
                background: '#ffffff',
                color: 'var(--accent-pink)',
                border: '2px solid var(--border)',
                borderRadius: '9999px',
                padding: '8px 16px',
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <X width={14} height={14} />
              <span>Reject Selected</span>
            </button>
          </div>
        )}
      </div>

      {/* Styled Neo-Brutalist Rounded Data Table */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 24,
          border: '2px solid var(--border)',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        <table className="data-table" style={{ margin: 0 }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ width: 44, paddingLeft: 18 }}>
                <input
                  type="checkbox"
                  checked={filteredList.length > 0 && selectedIds.length === filteredList.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all"
                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#111111' }}
                />
              </th>
              <th>Title</th>
              <th>Author / Dept</th>
              <th>Category</th>
              <th>Audience</th>
              <th>Submitted</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: 18 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((item) => {
                const isSelected = selectedIds.includes(item.id)

                return (
                  <tr key={item.id} style={{ background: isSelected ? 'rgba(213,255,56,0.1)' : undefined }}>
                    <td style={{ paddingLeft: 18 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        aria-label={`Select ${item.title}`}
                        style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#111111' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-1)' }}>{item.title}</div>
                      {item.rejectionReason && (
                        <div style={{ color: 'var(--accent-pink)', fontSize: 11, marginTop: 2, fontWeight: 700 }}>
                          Reason: "{item.rejectionReason}"
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      <div style={{ fontWeight: 700 }}>{item.publisher.name}</div>
                      <div style={{ color: 'var(--text-3)', fontSize: 11 }}>{item.department}</div>
                    </td>
                    <td>
                      <span className="chip neutral" style={{ borderRadius: '9999px', fontSize: 11, fontWeight: 700 }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      {item.audience.isUniversal ? 'All Students' : item.audience.label || 'Targeted'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)' }}>
                      {formatDisplayDate(item.postedAt)}
                    </td>
                    <td>
                      <StatusChip tone={toneForStatus(item.status)}>{item.status}</StatusChip>
                    </td>
                    <td style={{ paddingRight: 18 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        {item.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => approveUpdate(item.id)}
                              style={{
                                background: 'var(--accent-lime)',
                                color: '#111111',
                                border: '1.5px solid var(--border)',
                                borderRadius: '9999px',
                                padding: '4px 14px',
                                fontWeight: 800,
                                fontSize: 11,
                                cursor: 'pointer',
                              }}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRejectionTarget(item)
                                setRejectionReason('')
                                setRejectionError('')
                              }}
                              style={{
                                background: '#ffffff',
                                color: 'var(--accent-pink)',
                                border: '1.5px solid var(--border)',
                                borderRadius: '9999px',
                                padding: '4px 14px',
                                fontWeight: 800,
                                fontSize: 11,
                                cursor: 'pointer',
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`Open details for ${item.title}`}
                          onClick={() => setDrawerTarget(item)}
                          title="Open details & history"
                        >
                          <ArrowUpRight width={14} height={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px' }}>
                  <div style={{ color: 'var(--text-3)' }}>No updates found in {activeTab}.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rejection Modal with Required Reason */}
      <Modal
        isOpen={Boolean(rejectionTarget)}
        onClose={() => setRejectionTarget(null)}
        title="Reject Notice for Revision"
        description="Provide a clear explanation so the author can amend and resubmit."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="field">
            <label htmlFor="reject-reason">Mandatory Rejection Reason *</label>
            <textarea
              id="reject-reason"
              rows={4}
              placeholder="e.g. Please clarify seating arrangements and attach the updated hall map..."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value)
                setRejectionError('')
              }}
              required
            />
            {rejectionError && (
              <span style={{ color: 'var(--accent-red)', fontSize: 11 }}>{rejectionError}</span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setRejectionTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmRejection}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Drawer with Edit & Audit History */}
      <Drawer
        isOpen={Boolean(drawerTarget)}
        onClose={() => setDrawerTarget(null)}
        title={drawerTarget?.title || 'Notice Details'}
        subtitle={`Status: ${drawerTarget?.status} · Department: ${drawerTarget?.department}`}
        width="540px"
      >
        {drawerTarget && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Action Bar inside Drawer */}
            <div style={{ display: 'flex', gap: 8, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              {drawerTarget.status === 'Pending' && (
                <>
                  <Button
                    variant="primary"
                    icon={Check}
                    onClick={async () => {
                      await approveUpdate(drawerTarget.id)
                      setDrawerTarget(null)
                    }}
                  >
                    Approve Notice
                  </Button>
                  <Button
                    variant="danger"
                    icon={X}
                    onClick={() => {
                      const t = drawerTarget
                      setDrawerTarget(null)
                      setRejectionTarget(t)
                    }}
                  >
                    Reject...
                  </Button>
                </>
              )}

              {drawerTarget.status !== 'Archived' && (
                <Button
                  variant="secondary"
                  icon={Archive}
                  onClick={async () => {
                    await archiveUpdate(drawerTarget.id)
                    setDrawerTarget(null)
                  }}
                >
                  Archive
                </Button>
              )}

              <Button
                variant="danger"
                icon={Trash2}
                onClick={async () => {
                  await deleteUpdate(drawerTarget.id)
                  setDrawerTarget(null)
                }}
              >
                Delete
              </Button>
            </div>

            {/* Excerpt & Content */}
            <div>
              <div className="meta-label" style={{ marginBottom: 4 }}>
                Summary
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)' }}>
                {drawerTarget.excerpt}
              </p>
            </div>

            <div>
              <div className="meta-label" style={{ marginBottom: 4 }}>
                Full Message
              </div>
              <div
                style={{
                  background: 'var(--bg-muted)',
                  padding: 14,
                  borderRadius: 'var(--radius-control)',
                  fontSize: 13,
                  lineHeight: '22px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {drawerTarget.content}
              </div>
            </div>

            {/* Audit & Edit History */}
            <div>
              <div className="meta-label" style={{ marginBottom: 8 }}>
                Edit & Approval History
              </div>
              <div className="audit-list">
                {drawerTarget.editHistory.map((h, idx) => (
                  <div key={idx} className="audit-row">
                    <div className="audit-copy">
                      <strong>{h.author}</strong>: {h.action}
                    </div>
                    <span className="audit-time">{formatRelativeTime(h.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
