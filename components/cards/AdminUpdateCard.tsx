'use client'

import React, { useState } from 'react'
import { Check, X, ArrowUpRight, Clock, Users } from 'lucide-react'
import { UpdateItem } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { StatusChip, toneForStatus } from '@/components/ui/StatusChip'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatRelativeTime, formatDisplayDate } from '@/lib/date'
import { useStore } from '@/lib/store'

interface AdminUpdateCardProps {
  item: UpdateItem
  onOpenDetails?: (item: UpdateItem) => void
}

export function AdminUpdateCard({ item, onOpenDetails }: AdminUpdateCardProps) {
  const { approveUpdate, rejectUpdate, addToast } = useStore()
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initials = item.publisher.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSubmitting(true)
    try {
      await approveUpdate(item.id)
      addToast({
        type: 'success',
        title: `Approved: ${item.title}`,
        message: 'Notice is now published to enrolled cohorts and synchronized live.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rejectReason.trim()) {
      setRejectError('Please provide a specific rejection reason for the audit log.')
      return
    }

    setIsSubmitting(true)
    try {
      await rejectUpdate(item.id, rejectReason.trim())
      setRejectModalOpen(false)
      setRejectReason('')
      setRejectError('')
      addToast({
        type: 'info',
        title: `Rejected: ${item.title}`,
        message: 'Notice status updated to Rejected with reason recorded in audit log.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <article
        className="update-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 220,
        }}
        aria-labelledby={`admin-card-title-${item.id}`}
      >
        <div>
          {/* Header with Publisher & Prominent Status Chip */}
          <div className="update-top" style={{ alignItems: 'flex-start' }}>
            <div className="publisher">
              <Avatar initials={initials} />
              <div className="publisher-info">
                <div className="publisher-name" title={item.publisher.name}>
                  {item.publisher.name}
                </div>
                <div className="publisher-role">{item.publisher.role}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <StatusChip tone={toneForStatus(item.status)}>{item.status}</StatusChip>
            </div>
          </div>

          {/* Tags Row */}
          <div className="card-tags-row" style={{ marginTop: 8, marginBottom: 8 }}>
            <StatusChip tone="neutral">{item.category}</StatusChip>
            {item.priority === 'Urgent' && <StatusChip tone="orange">Urgent</StatusChip>}
            {item.audience?.label && (
              <StatusChip tone="neutral">
                <Users width={11} height={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                {item.audience.label}
              </StatusChip>
            )}
          </div>

          {/* Main Title & Excerpt */}
          <h3 id={`admin-card-title-${item.id}`} style={{ margin: '6px 0 4px', fontSize: 16 }}>
            {item.title}
          </h3>
          <p className="update-excerpt" style={{ margin: 0, fontSize: 13, lineHeight: '18px' }}>
            {item.excerpt}
          </p>
        </div>

        {/* Footer with Metadata & Actions */}
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1.5px dashed var(--border)' }}>
          <div className="card-meta-line" style={{ marginBottom: 10, fontSize: 11 }}>
            <span>{item.department}</span>
            <span className="dot">·</span>
            <span>{formatRelativeTime(item.postedAt)}</span>
            {item.eventDate && (
              <>
                <span className="dot">·</span>
                <span style={{ fontWeight: 700 }}>
                  <Clock width={11} height={11} style={{ verticalAlign: 'middle', marginRight: 2 }} />
                  {formatDisplayDate(item.eventDate)}
                </span>
              </>
            )}
          </div>

          {item.status === 'Pending' ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Button
                variant="danger"
                size="sm"
                icon={X}
                loading={isSubmitting}
                onClick={(e) => {
                  e.stopPropagation()
                  setRejectModalOpen(true)
                }}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                loading={isSubmitting}
                onClick={handleApprove}
              >
                Approve
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {onOpenDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconRight={ArrowUpRight}
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenDetails(item)
                  }}
                >
                  Inspect details
                </Button>
              )}
            </div>
          )}
        </div>
      </article>

      {/* Reject Modal with Required Reason */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false)
          setRejectError('')
        }}
        title="Reject Notice Submission"
        description={`Record the administrative justification for returning "${item.title}".`}
      >
        <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label htmlFor={`reject-reason-${item.id}`} style={{ fontWeight: 700 }}>
              Required Reason / Revision Notes
            </label>
            <textarea
              id={`reject-reason-${item.id}`}
              rows={3}
              className="textarea"
              placeholder="e.g. Please clarify exam room allocation and reschedule according to academic calendar guidelines."
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value)
                if (rejectError) setRejectError('')
              }}
              required
              autoFocus
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '2px solid var(--border)',
                background: 'var(--bg-surface)',
                fontFamily: 'inherit',
                fontSize: 13,
              }}
            />
            {rejectError && (
              <span style={{ color: 'var(--accent-red)', fontSize: 12, fontWeight: 700, marginTop: 4 }}>
                {rejectError}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setRejectModalOpen(false)
                setRejectError('')
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" icon={X} loading={isSubmitting}>
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
