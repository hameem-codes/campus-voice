'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bookmark, CheckCircle, Circle, ArrowUpRight, Share2 } from 'lucide-react'
import { UpdateItem, Role } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { StatusChip, toneForStatus } from '@/components/ui/StatusChip'
import { formatRelativeTime, formatDisplayDate } from '@/lib/date'
import { useStore } from '@/lib/store'
import { copyWhatsAppSummary } from '@/lib/share'

interface UpdateCardProps {
  item: UpdateItem
  compact?: boolean
  showActions?: boolean
  detailHref?: string
  overrideRole?: Role
}

export function UpdateCard({
  item,
  compact = false,
  showActions = true,
  detailHref,
  overrideRole,
}: UpdateCardProps) {
  const router = useRouter()
  const {
    role: storeRole,
    savedIds,
    toggleSave,
    markAsRead,
    markAsUnread,
    pinnedNoticeId,
    togglePinNotice,
    currentUser,
    addToast,
  } = useStore()
  const role = overrideRole || storeRole
  const isSaved = savedIds.includes(item.id)
  const isPinned = pinnedNoticeId === item.id
  const isUnread = !item.read
  const href = detailHref || (role === 'student' ? `/student/updates/${item.id}` : undefined)

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking on bookmark or read toggle buttons, do not navigate
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) return
    if (href) {
      router.push(href)
    }
  }

  const initials = item.publisher.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <article
      className={`notice-card update-card ${compact ? 'compact' : ''} ${isUnread ? 'unread-card' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: href ? 'pointer' : 'default' }}
      aria-labelledby={`update-title-${item.id}`}
    >
      {/* Top Bar: Publisher info on left, Bookmark & Unread on right */}
      <div className="update-top">
        <div className="publisher">
          <Avatar initials={initials} />
          <div className="publisher-info">
            <div className="publisher-name" title={item.publisher.name}>{item.publisher.name}</div>
            <div className="publisher-role">{item.publisher.role}</div>
          </div>
        </div>

        <div className="update-top-actions">
          {/* Unread dot / badge - Student only (Coral Red) */}
          {role === 'student' && isUnread && (
            <span
              className="unread-badge-dot"
              title="Unread notice"
              aria-label="Unread notice"
            />
          )}

          {/* Pin Button - Student only */}
          {role === 'student' && showActions && (
            <button
              type="button"
              aria-label={isPinned ? `Unpin ${item.title}` : `Pin ${item.title} to top of dashboard`}
              className={`bookmark ${isPinned ? 'saved' : ''}`}
              title={isPinned ? 'Pinned to top (click to unpin)' : 'Pin to top of dashboard'}
              onClick={(e) => {
                e.stopPropagation()
                togglePinNotice(item.id)
              }}
              style={{
                background: isPinned ? 'var(--neo-secondary)' : undefined,
              }}
            >
              <span style={{ fontSize: 13, lineHeight: 1 }} aria-hidden="true">📌</span>
            </button>
          )}

          {/* Copy for WhatsApp Button */}
          {showActions && (
            <button
              type="button"
              aria-label={`Copy WhatsApp summary for ${item.title}`}
              className="bookmark"
              title="Copy for WhatsApp / Group chat"
              onClick={(e) => {
                e.stopPropagation()
                copyWhatsAppSummary(item, () => {
                  addToast({
                    type: 'success',
                    title: 'Copied group chat summary!',
                    message: 'Formatted summary is now ready to paste into WhatsApp.',
                  })
                })
              }}
            >
              <Share2 width={13} height={13} strokeWidth={2.4} />
            </button>
          )}

          {/* Bookmark Button - Student only */}
          {role === 'student' && showActions && (
            <button
              type="button"
              aria-label={isSaved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
              className={`bookmark ${isSaved ? 'saved' : ''}`}
              title={isSaved ? 'Saved notice' : 'Save notice'}
              onClick={(e) => {
                e.stopPropagation()
                toggleSave(item.id)
              }}
            >
              <Bookmark fill={isSaved ? '#000000' : 'none'} width={15} height={15} strokeWidth={2.4} />
            </button>
          )}
        </div>
      </div>

      {/* Dedicated Tags Bar: Clean horizontal alignment for Category, Priority, and Status */}
      <div className="card-tags-row">
        {/* Category Chip */}
        <StatusChip tone="neutral">{item.category}</StatusChip>

        {/* Priority Chip if Urgent */}
        {item.priority === 'Urgent' && (
          <StatusChip tone="orange">Urgent</StatusChip>
        )}

        {/* Publishing Status ONLY for faculty and admin */}
        {role !== 'student' && (
          <StatusChip tone={toneForStatus(item.status)}>{item.status}</StatusChip>
        )}

        {/* Audience chip only for faculty/admin */}
        {role !== 'student' && item.audience?.label && (
          <StatusChip tone="neutral">{item.audience.label}</StatusChip>
        )}
      </div>

      {/* Main Content Area */}
      <div className="update-card-body" style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 id={`update-title-${item.id}`} style={{ margin: 0 }}>
          {href ? (
            <Link
              href={href}
              className="update-card-title-link"
              onClick={(e) => e.stopPropagation()}
            >
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </h3>
        <p className="update-excerpt">{item.excerpt}</p>
      </div>

      {/* Single inline metadata line */}
      <div className="card-meta-line" style={{ marginTop: 'auto' }}>
        <span>{item.department}</span>
        <span className="dot">·</span>
        <span>{formatRelativeTime(item.postedAt)}</span>
        {item.eventDate && (
          <>
            <span className="dot">·</span>
            <span style={{ color: '#000', fontWeight: 700 }}>
              {formatDisplayDate(item.eventDate)}
            </span>
          </>
        )}
      </div>

      {/* Footer controls: Only show student read toggle if role is student */}
      <div className="update-card-footer" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {role === 'student' ? (
            <button
              type="button"
              className="card-read-toggle-btn"
              aria-label={item.read ? 'Mark as unread' : 'Mark as read'}
              onClick={(e) => {
                e.stopPropagation()
                if (item.read) {
                  markAsUnread(item.id)
                } else {
                  markAsRead(item.id)
                }
              }}
            >
              {item.read ? (
                <>
                  <CheckCircle width={13} height={13} style={{ color: '#000000' }} />
                  <span style={{ fontWeight: 800 }}>Read</span>
                </>
              ) : (
                <>
                  <Circle width={13} height={13} style={{ color: '#000000' }} />
                  <span>Mark as read</span>
                </>
              )}
            </button>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700 }}>
              {item.priority} priority
            </span>
          )}

          {href && (
            <Link
              href={href}
              className="card-open-link"
              aria-label={`View details for ${item.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span>Details</span>
              <ArrowUpRight width={13} height={13} />
            </Link>
          )}
        </div>

        {/* Cohort Acknowledgment Counter - When student marked as read */}
        {role === 'student' && item.read && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 10,
              fontWeight: 800,
              color: '#000000',
              background: '#ffffff',
              border: '1.5px solid #000000',
              boxShadow: '1.5px 1.5px 0 0 #000000',
              padding: '2px 6px',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              alignSelf: 'flex-start',
            }}
          >
            <span style={{ fontWeight: 900 }}>✓</span>
            <span>84 / 120 students in Section {currentUser.section || 'D2'} acknowledged</span>
          </div>
        )}
      </div>
    </article>
  )
}

