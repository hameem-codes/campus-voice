'use client'

import React, { useState, useMemo } from 'react'
import {
  Bookmark,
  FileText,
  Search,
  Download,
  Trash2,
  Eye,
  ArrowUpRight,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { UpdateCard } from '@/components/cards/UpdateCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Attachment } from '@/types'
import { formatDisplayDate } from '@/lib/date'
import Link from 'next/link'

export function StudentSavedView() {
  const { updates, savedIds, toggleSave, addToast } = useStore()
  const [activeTab, setActiveTab] = useState<'Updates' | 'Documents'>('Updates')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewAttachment, setPreviewAttachment] = useState<{
    att: Attachment
    updateTitle: string
    updateDept: string
    updateContent: string
  } | null>(null)

  // All bookmarked updates
  const savedUpdates = useMemo(() => {
    return updates.filter((u) => savedIds.includes(u.id))
  }, [updates, savedIds])

  // Filtered updates by search
  const filteredUpdates = useMemo(() => {
    if (!searchQuery.trim()) return savedUpdates
    const q = searchQuery.toLowerCase()
    return savedUpdates.filter(
      (u) =>
        u.title.toLowerCase().includes(q) ||
        u.excerpt.toLowerCase().includes(q) ||
        u.category.toLowerCase().includes(q)
    )
  }, [savedUpdates, searchQuery])

  // All bookmarked documents from saved updates
  const savedDocuments = useMemo(() => {
    const list: Array<{
      att: Attachment
      updateId: string
      updateTitle: string
      updateDept: string
      updateContent: string
      date: string
    }> = []

    savedUpdates.forEach((u) => {
      u.attachments.forEach((att) => {
        list.push({
          att,
          updateId: u.id,
          updateTitle: u.title,
          updateDept: u.department,
          updateContent: u.content,
          date: u.postedAt,
        })
      })
    })

    if (!searchQuery.trim()) return list
    const q = searchQuery.toLowerCase()
    return list.filter(
      (item) =>
        item.att.name.toLowerCase().includes(q) ||
        item.updateTitle.toLowerCase().includes(q)
    )
  }, [savedUpdates, searchQuery])

  const handleDownload = (att: Attachment, title: string, content: string) => {
    const fileContent = `CAMPUS VOICE VERIFIED ATTACHMENT\n\nTitle: ${title}\nFile: ${att.name}\n\n${content}`
    const blob = new Blob([fileContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = att.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    addToast({
      type: 'info',
      title: `Downloaded ${att.name}`,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
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
          Saved Shelf
        </h1>
        <p style={{ margin: 0, color: 'var(--text-2)', fontSize: 14 }}>
          Access your bookmarked circulars, examination timetables, and download attachments.
        </p>
      </div>

      {/* Pill Navigation Tabs */}
      <div className="pill-nav-container" style={{ alignSelf: 'flex-start', margin: 0 }}>
        <button
          type="button"
          className={`pill-nav-btn ${activeTab === 'Updates' ? 'active' : ''}`}
          onClick={() => setActiveTab('Updates')}
        >
          <Bookmark width={14} height={14} />
          <span>Saved Updates</span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 900,
              background: activeTab === 'Updates' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
              color: activeTab === 'Updates' ? '#111111' : '#ffffff',
            }}
          >
            {savedUpdates.length}
          </span>
        </button>
        <button
          type="button"
          className={`pill-nav-btn ${activeTab === 'Documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('Documents')}
        >
          <FileText width={14} height={14} />
          <span>Saved Documents</span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 900,
              background: activeTab === 'Documents' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
              color: activeTab === 'Documents' ? '#111111' : '#ffffff',
            }}
          >
            {savedDocuments.length}
          </span>
        </button>
      </div>

      {/* Pill Search Input */}
      <div style={{ position: 'relative', maxWidth: 480 }}>
        <Search
          width={16}
          height={16}
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}
        />
        <input
          className="pill-search-input"
          aria-label="Search within saved"
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: 42, background: 'var(--bg-surface)' }}
        />
      </div>

      {/* Tab 1: Updates */}
      {activeTab === 'Updates' && (
        <>
          {filteredUpdates.length > 0 ? (
            <div className="card-grid">
              {filteredUpdates.map((item) => (
                <UpdateCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={searchQuery ? 'No matches' : 'Nothing saved yet'}
              description={
                searchQuery
                  ? 'Try a different search term.'
                  : 'Bookmark notices you want to come back to.'
              }
              icon={Bookmark}
              actionLabel={searchQuery ? 'Clear search' : 'Browse updates'}
              onAction={() => {
                if (searchQuery) setSearchQuery('')
                else window.location.href = '/student/updates'
              }}
            />
          )}
        </>
      )}

      {/* Tab 2: Documents */}
      {activeTab === 'Documents' && (
        <>
          {savedDocuments.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {savedDocuments.map((doc, idx) => (
                <div
                  key={`${doc.updateId}-${doc.att.id}-${idx}`}
                  className="panel-card"
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: 'var(--chip-blue-bg)',
                        color: 'var(--accent-blue)',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileText width={18} height={18} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong
                        style={{
                          fontSize: 13,
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {doc.att.name}
                      </strong>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                        {doc.att.size} · {doc.att.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                    From:{' '}
                    <Link
                      href={`/student/updates/${doc.updateId}`}
                      style={{ color: 'var(--text-1)', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {doc.updateTitle}
                    </Link>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto',
                      paddingTop: 8,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
                      {formatDisplayDate(doc.date)}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="btn secondary small"
                        onClick={() =>
                          setPreviewAttachment({
                            att: doc.att,
                            updateTitle: doc.updateTitle,
                            updateDept: doc.updateDept,
                            updateContent: doc.updateContent,
                          })
                        }
                      >
                        <Eye width={12} height={12} />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        className="btn primary small"
                        onClick={() =>
                          handleDownload(doc.att, doc.updateTitle, doc.updateContent)
                        }
                      >
                        <Download width={12} height={12} />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={searchQuery ? 'No matching documents' : 'No saved documents'}
              description="Notices with PDF or image attachments that you bookmark will show their files here."
              icon={FileText}
            />
          )}
        </>
      )}

      {/* Document Preview Modal */}
      <Modal
        isOpen={Boolean(previewAttachment)}
        onClose={() => setPreviewAttachment(null)}
        title={previewAttachment?.att.name || 'Document'}
        description={`Attached to "${previewAttachment?.updateTitle}"`}
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              height: 340,
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-control)',
              padding: 24,
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: 12,
              lineHeight: '20px',
            }}
          >
            {`[CAMPUS VOICE ATTACHMENT PREVIEW]\n\nDocument: ${previewAttachment?.att.name}\nDepartment: ${previewAttachment?.updateDept}\n\n${previewAttachment?.updateContent}`}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setPreviewAttachment(null)}>
              Close
            </Button>
            {previewAttachment && (
              <Button
                variant="primary"
                icon={Download}
                onClick={() =>
                  handleDownload(
                    previewAttachment.att,
                    previewAttachment.updateTitle,
                    previewAttachment.updateContent
                  )
                }
              >
                Download File
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
