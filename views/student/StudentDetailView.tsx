'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Share2,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  Eye,
  History,
  Clock,
  Building,
  User,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { formatRelativeTime, formatDisplayDate, downloadICS } from '@/lib/date'
import { Attachment } from '@/types'

export function StudentDetailView({ updateId }: { updateId: string }) {
  const router = useRouter()
  const {
    updates,
    savedIds,
    toggleSave,
    markAsRead,
    markAsUnread,
    addToast,
  } = useStore()

  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [summaryData, setSummaryData] = useState<{ bullets: string[]; generatedAt: string } | null>(null)

  const handleSummarize = async () => {
    if (summaryData) {
      setSummaryData(null)
      return
    }
    setLoadingSummary(true)
    try {
      const res = await api.getAiSummary(updateId)
      setSummaryData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSummary(false)
    }
  }

  const item = updates.find((u) => u.id === updateId)
  const isSaved = item ? savedIds.includes(item.id) : false

  if (!item) {
    return (
      <div className="empty-state">
        <AlertCircle width={32} height={32} />
        <h3>Notice not found</h3>
        <p>The notice you are trying to view does not exist or has been removed.</p>
        <Button variant="primary" icon={ArrowLeft} onClick={() => router.push('/student/updates')}>
          Back to updates
        </Button>
      </div>
    )
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      addToast({
        type: 'success',
        title: 'Link copied to clipboard',
        message: 'Share this verified notice with your peers.',
      })
    }
  }

  const handleAddToCalendar = () => {
    downloadICS({
      title: item.title,
      description: item.excerpt,
      location: item.department,
      startDate: item.eventDate || item.deadlineDate || item.postedAt,
    })
    addToast({
      type: 'success',
      title: 'Calendar event downloaded',
      message: 'Add the .ics file to your Google Calendar or Apple Calendar.',
    })
  }

  const handleDownloadAttachment = (att: Attachment) => {
    // Generate text/blob file download
    const content = `CAMPUS VOICE OFFICIAL DOCUMENT\n\nTitle: ${item.title}\nAttachment: ${att.name}\nDepartment: ${item.department}\nPublished: ${item.postedAt}\n\n${item.content}`
    const blob = new Blob([content], { type: 'text/plain' })
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960 }}>
      {/* Top action row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => router.push('/student/updates')}
        >
          Back to updates
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Read Toggle */}
          <Button
            variant="secondary"
            icon={item.read ? CheckCircle2 : Circle}
            onClick={() => (item.read ? markAsUnread(item.id) : markAsRead(item.id))}
          >
            {item.read ? 'Mark unread' : 'Mark as read'}
          </Button>

          {/* Bookmark */}
          <Button
            variant={isSaved ? 'primary' : 'secondary'}
            icon={Bookmark}
            onClick={() => toggleSave(item.id)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>

          {/* Calendar export if there is an event/deadline */}
          {(item.eventDate || item.deadlineDate) && (
            <Button
              variant="secondary"
              icon={Calendar}
              onClick={handleAddToCalendar}
              title="Download calendar event (.ics)"
            >
              Add to calendar
            </Button>
          )}

          {/* AI Summarize */}
          <Button
            variant="secondary"
            icon={Sparkles}
            onClick={handleSummarize}
            disabled={loadingSummary}
            style={{
              background: summaryData ? 'var(--neo-accent)' : undefined,
              color: summaryData ? '#000' : undefined,
              fontWeight: 800,
            }}
          >
            {loadingSummary ? 'Summarizing...' : summaryData ? 'Hide AI summary' : 'Summarize'}
          </Button>

          {/* Share */}
          <Button variant="secondary" icon={Share2} onClick={handleShare}>
            Share
          </Button>
        </div>
      </div>

      {/* Main Notice Card */}
      <article className="panel-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header tags */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <StatusChip tone="neutral">{item.category}</StatusChip>
            {item.priority === 'Urgent' && <StatusChip tone="orange">Urgent</StatusChip>}
            {item.editHistory.length > 1 && (
              <button
                type="button"
                className="chip filter"
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                onClick={() => setHistoryOpen(true)}
              >
                <History width={11} height={11} />
                <span>Updated ({item.editHistory.length - 1})</span>
              </button>
            )}
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            Posted {formatRelativeTime(item.postedAt)}
          </div>
        </div>

        {/* Title */}
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: '36px', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
          {item.title}
        </h1>

        {/* Publisher Info Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            background: 'var(--bg-muted)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-sm)',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar initials={item.publisher.name.split(' ').map((w) => w[0]).slice(0, 2).join('')} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>
                {item.publisher.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>
                {item.publisher.role} · {item.department}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 12, color: 'var(--text-2)' }}>
            <div>
              <span style={{ color: 'var(--text-3)', fontSize: 10, textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.04em' }}>
                Published on
              </span>
              <strong style={{ fontWeight: 600, color: 'var(--text-1)' }}>{formatDisplayDate(item.postedAt)}</strong>
            </div>

            {item.eventDate && (
              <div>
                <span style={{ color: 'var(--text-3)', fontSize: 10, textTransform: 'uppercase', display: 'block', fontWeight: 600, letterSpacing: '0.04em' }}>
                  Event / Due Date
                </span>
                <strong style={{ color: 'var(--text-1)', fontWeight: 600 }}>
                  {formatDisplayDate(item.eventDate)}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* AI Executive Summary Box (Phase 4.8) */}
        {summaryData && (
          <div
            style={{
              background: 'var(--chip-accent-bg)',
              border: '1px solid var(--chip-accent-border)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-sm)',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles width={18} height={18} style={{ color: 'var(--chip-accent-fg)' }} />
                <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '-0.01em', color: 'var(--chip-accent-fg)' }}>
                  Executive Takeaways
                </span>
              </div>
              <span
                style={{
                  background: 'var(--chip-accent-fg)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-chip)',
                  letterSpacing: '0.02em',
                }}
              >
                AI summary (demo)
              </span>
            </div>

            <ul
              style={{
                margin: 0,
                paddingLeft: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                color: 'var(--text-2)',
                fontSize: 13,
                fontWeight: 400,
                lineHeight: '20px',
              }}
            >
              {summaryData.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <div
              style={{
                fontSize: 11,
                color: 'var(--text-3)',
                fontWeight: 400,
                borderTop: '1px solid var(--chip-accent-border)',
                paddingTop: 8,
              }}
            >
              Synthesized from official notice content · Local deterministic demo model
            </div>
          </div>
        )}

        {/* Body Content */}
        <div
          style={{
            fontSize: 15,
            lineHeight: '26px',
            color: 'var(--text-1)',
            whiteSpace: 'pre-line',
            padding: '8px 0',
          }}
        >
          {item.content}
        </div>

        {/* Attachments Section with in-page viewer */}
        {item.attachments.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, margin: '0 0 12px' }}>
              Attachments ({item.attachments.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {item.attachments.map((att) => (
                <div
                  key={att.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-control)',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    background: 'var(--bg-muted)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <FileText width={20} height={20} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {att.name}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
                        {att.size} · {att.type.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      className="icon-button"
                      style={{ width: 28, height: 28 }}
                      title="Preview document"
                      aria-label={`Preview ${att.name}`}
                      onClick={() => setPreviewAttachment(att)}
                    >
                      <Eye width={14} height={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-button"
                      style={{ width: 28, height: 28 }}
                      title="Download file"
                      aria-label={`Download ${att.name}`}
                      onClick={() => handleDownloadAttachment(att)}
                    >
                      <Download width={14} height={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* In-Page Attachment Viewer Modal */}
      <Modal
        isOpen={Boolean(previewAttachment)}
        onClose={() => setPreviewAttachment(null)}
        title={previewAttachment?.name || 'Document Preview'}
        description={`${previewAttachment?.type.toUpperCase()} · ${previewAttachment?.size} · Verified Campus Attachment`}
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Simulated In-Page PDF / Image Viewer Canvas */}
          <div
            style={{
              height: 380,
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-control)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              overflowY: 'auto',
            }}
          >
            {previewAttachment?.type === 'image' ? (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 240,
                    height: 180,
                    margin: '0 auto 12px',
                    borderRadius: 8,
                    background: 'var(--chip-blue-bg)',
                    border: '1px dashed var(--accent-blue)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--chip-blue-fg)',
                    fontSize: 12,
                  }}
                >
                  [Image Graphic: {previewAttachment.name}]
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                  Published by {item.publisher.name}
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--bg-surface)',
                  padding: 24,
                  borderRadius: 6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  lineHeight: '20px',
                  whiteSpace: 'pre-wrap',
                  overflowY: 'auto',
                }}
              >
                {`=== OFFICIAL VERIFIED DOCUMENT ===\nFILE: ${previewAttachment?.name}\nISSUER: ${item.department} (${item.publisher.name})\nDATE: ${formatDisplayDate(item.postedAt)}\n\n--- DOCUMENT CONTENT ---\n${item.content}\n\n[End of Document Page 1 of 1]`}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button
              variant="secondary"
              onClick={() => setPreviewAttachment(null)}
            >
              Close
            </Button>
            {previewAttachment && (
              <Button
                variant="primary"
                icon={Download}
                onClick={() => handleDownloadAttachment(previewAttachment)}
              >
                Download Document
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Edit History Modal */}
      <Modal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Notice Edit History"
        description={`Audit record of modifications for "${item.title}"`}
      >
        <div className="audit-list">
          {item.editHistory.map((h, i) => (
            <div key={i} className="audit-row">
              <div className="audit-copy">
                <strong>{h.author}</strong>: {h.action}
              </div>
              <span className="audit-time">{formatRelativeTime(h.date)}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
