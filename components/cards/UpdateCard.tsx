'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bookmark, CheckCircle, Circle, ArrowUpRight } from 'lucide-react'
import { UpdateItem, Role } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { StatusChip, toneForStatus } from '@/components/ui/StatusChip'
import { formatRelativeTime, formatDisplayDate } from '@/lib/date'
import { useStore } from '@/lib/store'

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
  const { role: storeRole, savedIds, toggleSave, markAsRead, markAsUnread } = useStore()
  const role = overrideRole || storeRole
  const isSaved = savedIds.includes(item.id)
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
      className={`update-card ${compact ? 'compact' : ''} ${isUnread ? 'unread-card' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: href ? 'pointer' : 'default' }}
      aria-labelledby={`update-title-${item.id}`}
    >
      {/* Top Bar */}
      <div className="update-top">
        <div className="publisher">
          <Avatar initials={initials} />
          <div>
            <div className="publisher-name">{item.publisher.name}</div>
            <div className="publisher-role">{item.publisher.role}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
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
          {role !== 'student' && item.audience.label && (
            <StatusChip tone="neutral">{item.audience.label}</StatusChip>
          )}

          {/* Unread dot / badge */}
          {isUnread && (
            <span
              className="unread-badge-dot"
              title="Unread notice"
              aria-label="Unread notice"
            />
          )}

          {/* Bookmark Button */}
          {showActions && (
            <button
              type="button"
              aria-label={isSaved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
              className={`bookmark ${isSaved ? 'saved' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                toggleSave(item.id)
              }}
            >
              <Bookmark fill={isSaved ? 'currentColor' : 'none'} width={16} height={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ minHeight: compact ? 'auto' : 64 }}>
        <h3 id={`update-title-${item.id}`}>
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
      <div className="card-meta-line">
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

      {/* Footer controls: Mark read/unread toggle & details link */}
      <div className="update-card-footer">
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
              <CheckCircle width={13} height={13} style={{ color: 'var(--chip-green-fg)' }} />
              <span>Read</span>
            </>
          ) : (
            <>
              <Circle width={13} height={13} style={{ color: 'var(--accent-orange)' }} />
              <span>Mark as read</span>
            </>
          )}
        </button>

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
    </article>
  )
}
