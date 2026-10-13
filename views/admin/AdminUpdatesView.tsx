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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Status Tabs */}
      <div className="tabs">
        {(['Approval queue', 'Published', 'Scheduled', 'Archived', 'Rejected'] as const).map(
          (tab) => (
            <button
              key={tab}
              type="button"
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab)
                setSelectedIds([])
              }}
            >
              {tab}
              <span className={`tab-pill ${tab === 'Approval queue' && counts[tab] > 0 ? 'orange' : ''}`}>
                {counts[tab]}
              </span>
            </button>
          )
        )}
      </div>

      {/* 2. Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="toolbar-search">
            <Search />
            <input
              className="search-input"
              aria-label="Search notices"
              placeholder="Search by title, publisher, or department"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-control)',
              padding: '6px 10px',
              fontSize: 12,
              background: 'var(--bg-surface)',
            }}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Bulk Action Buttons if rows selected */}
          {selectedIds.length > 0 && activeTab === 'Approval queue' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Button variant="primary" size="sm" icon={Check} onClick={handleBulkApprove}>
                Approve ({selectedIds.length})
              </Button>
              <Button variant="danger" size="sm" icon={X} onClick={handleBulkReject}>
                Reject
              </Button>
            </div>
          )}
        </div>

        <div className="toolbar-right">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => router.push('/admin/create')}
          >
            Create universal update
          </Button>
        </div>
      </div>

      {/* 3. Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={
                    filteredList.length > 0 && selectedIds.length === filteredList.length
                  }
                  onChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th>Notice Title</th>
              <th>Category</th>
              <th>Audience</th>
              <th>Status</th>
              <th>Author / Dept</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((item) => {
                const isSelected = selectedIds.includes(item.id)

                return (
                  <tr key={item.id} style={{ background: isSelected ? 'var(--bg-muted)' : undefined }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        aria-label={`Select ${item.title}`}
                      />
                    </td>
                    <td>
                      <strong>{item.title}</strong>
                      <div style={{ color: 'var(--text-3)', fontSize: 11, marginTop: 2 }}>
                        Priority: {item.priority}
                      </div>
                      {item.rejectionReason && (
                        <div style={{ color: 'var(--accent-red)', fontSize: 11, marginTop: 2 }}>
                          Reason: "{item.rejectionReason}"
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="chip neutral">{item.category}</span>
                    </td>
                    <td style={{ fontSize: 11 }}>
                      {item.audience.isUniversal ? 'Campus-wide' : item.audience.label || 'Targeted'}
                    </td>
                    <td>
                      <StatusChip tone={toneForStatus(item.status)}>{item.status}</StatusChip>
                    </td>
                    <td style={{ fontSize: 11 }}>
                      <div>{item.publisher.name}</div>
                      <div style={{ color: 'var(--text-3)' }}>{item.department}</div>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text-2)' }}>
                      {formatDisplayDate(item.postedAt)}
                    </td>
                    <td>
                      <div className="table-actions">
                        {/* Approval buttons if Pending */}
                        {item.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              className="icon-button"
                              style={{ color: 'var(--chip-green-fg)' }}
                              aria-label={`Approve ${item.title}`}
                              onClick={() => approveUpdate(item.id)}
                              title="Approve and Publish"
                            >
                              <Check width={15} height={15} />
                            </button>
                            <button
                              type="button"
                              className="icon-button"
                              style={{ color: 'var(--accent-red)' }}
                              aria-label={`Reject ${item.title}`}
                              onClick={() => {
                                setRejectionTarget(item)
                                setRejectionReason('')
                                setRejectionError('')
                              }}
                              title="Reject notice"
                            >
                              <X width={15} height={15} />
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
