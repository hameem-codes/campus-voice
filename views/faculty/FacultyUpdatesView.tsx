'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  Edit2,
  Copy,
  Archive,
  Trash2,
  Eye,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { StatusChip, toneForStatus } from '@/components/ui/StatusChip'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { UpdateItem, UpdateStatus } from '@/types'
import { formatDisplayDate } from '@/lib/date'

export function FacultyUpdatesView() {
  const router = useRouter()
  const {
    updates,
    currentUser,
    deleteUpdate,
    archiveUpdate,
    duplicateUpdate,
    addToast,
  } = useStore()

  // Tab filter
  const [activeTab, setActiveTab] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modal / Dialog states
  const [deleteTarget, setDeleteTarget] = useState<UpdateItem | null>(null)
  const [detailTarget, setDetailTarget] = useState<UpdateItem | null>(null)
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null)

  // Filter updates published by faculty or department
  const facultyList = useMemo(() => {
    return updates.filter(
      (u) =>
        u.publisher.name === currentUser.name ||
        u.department === currentUser.department
    )
  }, [updates, currentUser])

  // Status counts for tabs
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: facultyList.length,
      Draft: 0,
      Pending: 0,
      Published: 0,
      Rejected: 0,
      Scheduled: 0,
      Archived: 0,
    }
    facultyList.forEach((u) => {
      if (counts[u.status] !== undefined) {
        counts[u.status]++
      }
    })
    return counts
  }, [facultyList])

  // Filtered and searched items
  const filteredList = useMemo(() => {
    return facultyList.filter((item) => {
      if (activeTab !== 'All' && item.status !== activeTab) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [facultyList, activeTab, searchQuery])

  // Bulk actions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredList.map((item) => item.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBulkArchive = async () => {
    for (const id of selectedIds) {
      await archiveUpdate(id)
    }
    setSelectedIds([])
    addToast({
      type: 'info',
      title: `Archived ${selectedIds.length} notices`,
    })
  }

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteUpdate(id)
    }
    setSelectedIds([])
    addToast({
      type: 'info',
      title: `Deleted ${selectedIds.length} notices`,
    })
  }

  const handleDuplicate = async (id: string) => {
    try {
      const dup = await duplicateUpdate(id)
      addToast({
        type: 'success',
        title: 'Notice duplicated',
        message: `Saved as "${dup.title}" in Drafts.`,
      })
      setActiveActionMenuId(null)
    } catch {
      addToast({ type: 'error', title: 'Failed to duplicate' })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Status Tabs with accurate live counts */}
      {/* 1. Status Tabs (only show tabs with counts > 0) */}
      <div className="tabs">
        {['All', 'Draft', 'Pending', 'Published', 'Rejected', 'Scheduled', 'Archived']
          .filter((status) => status === 'All' || (tabCounts[status] || 0) > 0)
          .map((status) => (
            <button
              key={status}
              type="button"
              className={`tab ${activeTab === status ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(status)
                setSelectedIds([])
              }}
            >
              {status}
              <span className={`tab-pill ${status === 'Pending' && tabCounts[status] > 0 ? 'orange' : ''}`}>
                {tabCounts[status] || 0}
              </span>
            </button>
          ))}
      </div>

      {/* 2. Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="toolbar-search">
            <Search />
            <input
              className="search-input"
              aria-label="Search my updates"
              placeholder="Search by title, keyword, or category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500 }}>
                {selectedIds.length} selected
              </span>
              <Button variant="secondary" size="sm" icon={Archive} onClick={handleBulkArchive}>
                Archive
              </Button>
              <Button variant="danger" size="sm" icon={Trash2} onClick={handleBulkDelete}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="toolbar-right">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => router.push('/faculty/create')}
          >
            New notice
          </Button>
        </div>
      </div>

      {/* 3. Table Wrap */}
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
                  aria-label="Select all rows"
                />
              </th>
              <th>Notice</th>
              <th>Status</th>
              <th>Category</th>
              <th>Audience</th>
              <th>Date</th>
              <th>Reach</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((item) => {
                const isSelected = selectedIds.includes(item.id)
                const isMenuOpen = activeActionMenuId === item.id

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
                        {item.department} · {item.priority}
                      </div>
                      {item.rejectionReason && (
                        <div style={{ color: 'var(--accent-red)', fontSize: 11, marginTop: 4 }}>
                          Rejected: "{item.rejectionReason}"
                        </div>
                      )}
                    </td>
                    <td>
                      <StatusChip tone={toneForStatus(item.status)}>{item.status}</StatusChip>
                    </td>
                    <td>
                      <span className="chip neutral">{item.category}</span>
                    </td>
                    <td style={{ fontSize: 11 }}>
                      {item.audience.label || (item.audience.isUniversal ? 'Campus-wide' : 'Targeted')}
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text-2)' }}>
                      {formatDisplayDate(item.postedAt)}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {item.reachPercentage !== undefined ? `${item.reachPercentage}%` : '—'}
                    </td>
                    <td>
                      <div className="table-actions" style={{ position: 'relative' }}>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`Quick view ${item.title}`}
                          onClick={() => setDetailTarget(item)}
                          title="Quick preview"
                        >
                          <Eye width={14} height={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label="More actions"
                          onClick={() =>
                            setActiveActionMenuId((prev) => (prev === item.id ? null : item.id))
                          }
                          title="Actions menu"
                        >
                          <MoreHorizontal width={14} height={14} />
                        </button>

                        {/* Row Action Menu Dropdown */}
                        {isMenuOpen && (
                          <div
                            className="role-dropdown-menu"
                            style={{ right: 0, left: 'auto', bottom: 'auto', top: 36, width: 160 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="role-dropdown-item"
                              onClick={() => {
                                setActiveActionMenuId(null)
                                router.push(`/faculty/create?edit=${item.id}`)
                              }}
                            >
                              <Edit2 width={13} height={13} />
                              <span>Edit notice</span>
                            </button>
                            <button
                              type="button"
                              className="role-dropdown-item"
                              onClick={() => handleDuplicate(item.id)}
                            >
                              <Copy width={13} height={13} />
                              <span>Duplicate</span>
                            </button>
                            <button
                              type="button"
                              className="role-dropdown-item"
                              onClick={async () => {
                                await archiveUpdate(item.id)
                                setActiveActionMenuId(null)
                              }}
                            >
                              <Archive width={13} height={13} />
                              <span>Archive</span>
                            </button>
                            <div className="dropdown-divider" />
                            <button
                              type="button"
                              className="role-dropdown-item"
                              style={{ color: 'var(--accent-red)' }}
                              onClick={() => {
                                setActiveActionMenuId(null)
                                setDeleteTarget(item)
                              }}
                            >
                              <Trash2 width={13} height={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteUpdate(deleteTarget.id)
            setDeleteTarget(null)
          }
        }}
        title="Delete Notice?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete notice"
        danger
      />

      {/* Detail Quick View Modal */}
      <Modal
        isOpen={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        title={detailTarget?.title || 'Notice Details'}
        description={`Status: ${detailTarget?.status} · Category: ${detailTarget?.category}`}
      >
        {detailTarget && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)' }}>
              {detailTarget.excerpt}
            </p>
            <div
              style={{
                background: 'var(--bg-muted)',
                padding: 14,
                borderRadius: 'var(--radius-control)',
                fontSize: 12,
                lineHeight: '20px',
                whiteSpace: 'pre-line',
              }}
            >
              {detailTarget.content}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text-3)' }}>
              <div>Department: {detailTarget.department}</div>
              <div>Published: {formatDisplayDate(detailTarget.postedAt)}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <Button variant="secondary" onClick={() => setDetailTarget(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={Edit2}
                onClick={() => {
                  const id = detailTarget.id
                  setDetailTarget(null)
                  router.push(`/faculty/create?edit=${id}`)
                }}
              >
                Edit in form
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
