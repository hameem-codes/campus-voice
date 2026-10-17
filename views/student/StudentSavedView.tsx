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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tabs: Updates and Documents */}
      <div className="tabs">
        <button
          type="button"
          className={`tab ${activeTab === 'Updates' ? 'active' : ''}`}
          onClick={() => setActiveTab('Updates')}
        >
          <Bookmark width={16} height={16} />
          <span>Saved Updates</span>
          <span className="tab-pill">{savedUpdates.length}</span>
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'Documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('Documents')}
        >
          <FileText width={16} height={16} />
          <span>Saved Documents</span>
          <span className="tab-pill">{savedDocuments.length}</span>
        </button>
      </div>

      {/* Toolbar: Search within saved */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="toolbar-search">
            <Search />
            <input
              className="search-input"
              aria-label="Search within saved"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="toolbar-right">
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {activeTab === 'Updates'
              ? `${filteredUpdates.length} saved notice${filteredUpdates.length === 1 ? '' : 's'}`
              : `${savedDocuments.length} attached file${savedDocuments.length === 1 ? '' : 's'}`}
          </span>
        </div>
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
