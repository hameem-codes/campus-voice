'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bookmark,
  CheckCircle,
  Circle,
  ArrowUpRight,
  Share2,
  Heart,
  MessageSquare,
  Check,
} from 'lucide-react'
import { UpdateItem, Role } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTime, formatDisplayDate } from '@/lib/date'
import { useStore } from '@/lib/store'
import { copyWhatsAppSummary } from '@/lib/share'

interface UpdateCardProps {
  item: UpdateItem
  compact?: boolean
  showActions?: boolean
  detailHref?: string
  overrideRole?: Role
  variant?: 'black' | 'blue' | 'lime' | 'white'
}

export function UpdateCard({
  item,
  compact = false,
  showActions = true,
  detailHref,
  overrideRole,
  variant,
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

  // Local interactive like & RSVP states
  const [liked, setLiked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`cv_liked_${item.id}`) === 'true'
    }
    return false
  })

  const [likeCount, setLikeCount] = useState(() => {
    if (item.id === 'critique') return 0
    if (item.id === 'placement') return 1
    if (item.id === 'fest') return 2
    return 2
  })

  const [going, setGoing] = useState(false)
  const [goingCount, setGoingCount] = useState(1)

  // Compute card color variant matching the Style Guide
  const resolvedVariant: 'black' | 'blue' | 'lime' | 'white' =
    variant ||
    (item.id === 'fest' || (item.category === 'Events' && item.priority !== 'Urgent')
      ? 'blue'
      : item.id === 'placement' || item.category === 'Placements'
      ? 'lime'
      : item.id === 'fee'
      ? 'white'
      : 'black')

  const isDarkCard = resolvedVariant === 'black' || resolvedVariant === 'blue'
  const isLimeCard = resolvedVariant === 'lime'

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) return
    if (href) {
      router.push(href)
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !liked
    setLiked(next)
    setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)))
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cv_liked_${item.id}`, String(next))
    }
    addToast({
      type: 'info',
      title: next ? 'Liked announcement' : 'Unliked announcement',
      message: item.title,
    })
  }

  const handleGoing = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !going
    setGoing(next)
    setGoingCount((c) => (next ? c + 1 : Math.max(0, c - 1)))
    addToast({
      type: 'success',
      title: next ? 'Marked as attending!' : 'Removed from attendance',
      message: item.title,
    })
  }

  const initials = item.publisher.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const commentCount = item.id === 'placement' ? 0 : 2

  return (
    <article
      className={`notice-card update-card variant-${resolvedVariant} ${compact ? 'compact' : ''} ${
        isUnread ? 'unread-card' : ''
      }`}
      onClick={handleCardClick}
      style={{ cursor: href ? 'pointer' : 'default' }}
      aria-labelledby={`update-title-${item.id}`}
    >
      {/* Top row: Badges on left, utility buttons on right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Category Badge */}
          <span
            className="cat-badge"
            style={{
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '10px',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: '1.5px solid currentColor',
              background: isDarkCard
                ? 'rgba(255, 255, 255, 0.15)'
                : isLimeCard
                ? 'rgba(0, 0, 0, 0.1)'
                : '#E7E7EC',
              color: isDarkCard ? '#FFFFFF' : '#111111',
            }}
          >
            {item.category}
          </span>

          {/* Pinned Indicator */}
          {(isPinned || item.id === 'critique' || item.id === 'placement' || item.priority === 'Urgent') && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 900,
                color: isDarkCard ? 'var(--accent-lime)' : '#111111',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <span>📌</span>
              <span>PINNED</span>
            </span>
          )}

          {/* Urgent Badge if applicable */}
          {item.priority === 'Urgent' && (
            <span
              style={{
                background: 'var(--accent-pink)',
                color: '#111111',
                fontSize: '10px',
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1.5px solid var(--border)',
                textTransform: 'uppercase',
              }}
            >
              Urgent
            </span>
          )}
        </div>

        {/* Right utility buttons: Pin, Share, Bookmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Unread indicator dot */}
          {role === 'student' && isUnread && (
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: 'var(--accent-pink)',
                border: '1.5px solid var(--border)',
                display: 'inline-block',
              }}
              title="Unread notice"
              aria-label="Unread notice"
            />
          )}

          {/* Pin toggle */}
          {role === 'student' && showActions && (
            <button
              type="button"
              aria-label={isPinned ? `Unpin ${item.title}` : `Pin ${item.title} to top of dashboard`}
              className="engagement-pill"
              title={isPinned ? 'Pinned to top (click to unpin)' : 'Pin to top of dashboard'}
              onClick={(e) => {
                e.stopPropagation()
                togglePinNotice(item.id)
              }}
              style={{
                padding: '4px 8px',
                background: isPinned ? 'var(--accent-lime)' : isDarkCard ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
                color: isPinned ? '#111111' : isDarkCard ? '#FFFFFF' : '#111111',
                borderColor: isDarkCard && !isPinned ? 'rgba(255,255,255,0.3)' : 'var(--border)',
              }}
            >
              <span style={{ fontSize: 12, lineHeight: 1 }} aria-hidden="true">📌</span>
            </button>
          )}

          {/* Copy for WhatsApp */}
          {showActions && (
            <button
              type="button"
              aria-label={`Copy WhatsApp summary for ${item.title}`}
              className="engagement-pill"
              title="Copy for WhatsApp / Group chat"
              onClick={(e) => {
                e.stopPropagation()
                copyWhatsAppSummary(item, () => {
                  addToast({
                    type: 'success',
                    title: 'Copied group chat summary!',
                    message: 'Formatted summary ready to paste into WhatsApp.',
                  })
                })
              }}
              style={{
                padding: '4px 8px',
                background: isDarkCard ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
                color: isDarkCard ? '#FFFFFF' : '#111111',
                borderColor: isDarkCard ? 'rgba(255,255,255,0.3)' : 'var(--border)',
              }}
            >
              <Share2 width={12} height={12} strokeWidth={2.4} />
            </button>
          )}

          {/* Bookmark */}
          {role === 'student' && showActions && (
            <button
              type="button"
              aria-label={isSaved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
              className="engagement-pill"
              title={isSaved ? 'Saved notice' : 'Save notice'}
              onClick={(e) => {
                e.stopPropagation()
                toggleSave(item.id)
              }}
              style={{
                padding: '4px 8px',
                background: isSaved ? 'var(--accent-lime)' : isDarkCard ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
                color: isSaved ? '#111111' : isDarkCard ? '#FFFFFF' : '#111111',
                borderColor: isDarkCard && !isSaved ? 'rgba(255,255,255,0.3)' : 'var(--border)',
              }}
            >
              <Bookmark fill={isSaved ? '#111111' : 'none'} width={13} height={13} strokeWidth={2.4} />
            </button>
          )}
        </div>
      </div>

      {/* Title & Body */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3
          id={`update-title-${item.id}`}
          style={{
            margin: 0,
            fontSize: '20px',
            lineHeight: '26px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          {href ? (
            <Link
              href={href}
              style={{ color: 'inherit', textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: '13px',
            lineHeight: '19px',
            fontWeight: 500,
            opacity: isDarkCard ? 0.9 : 0.85,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.excerpt}
        </p>

        {/* Attachment link if exists */}
        {item.attachments.length > 0 && (
          <div style={{ marginTop: 2 }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'underline',
                color: isDarkCard ? '#FFFFFF' : '#111111',
                cursor: 'pointer',
              }}
            >
              Open attached link
            </span>
          </div>
        )}
      </div>

      {/* Date & Department Metadata Line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '11px',
          fontWeight: 700,
          opacity: isDarkCard ? 0.8 : 0.75,
          marginTop: 'auto',
          paddingTop: 4,
        }}
      >
        <span>📅 {formatRelativeTime(item.postedAt)}</span>
        {item.eventDate && (
          <>
            <span>•</span>
            <span style={{ fontWeight: 800 }}>{formatDisplayDate(item.eventDate)}</span>
          </>
        )}
        <span>•</span>
        <span>{item.department}</span>
      </div>

      {/* Engagement Buttons Row (Pink Like Pill, White Comments Pill, Lime Going Pill) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          paddingTop: 10,
          borderTop: isDarkCard ? '1px solid rgba(255,255,255,0.15)' : '1.5px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Bubblegum Pink Like Button */}
          <button
            type="button"
            className="engagement-pill pink"
            onClick={handleLike}
            aria-label={`Like ${item.title}`}
          >
            <Heart
              width={13}
              height={13}
              fill={liked ? '#111111' : 'none'}
              strokeWidth={2.4}
              style={{ color: '#111111' }}
            />
            <span>{liked ? `Liked ${likeCount}` : `Like ${likeCount}`}</span>
          </button>

          {/* White Comments Button */}
          <button
            type="button"
            className="engagement-pill white"
            onClick={(e) => {
              e.stopPropagation()
              if (href) router.push(href)
            }}
            aria-label="View comments"
          >
            <MessageSquare width={13} height={13} strokeWidth={2.4} style={{ color: '#111111' }} />
            <span>Comments {commentCount}</span>
          </button>

          {/* Going / RSVP Pill if event/deadline */}
          {(item.eventDate || item.category === 'Events' || item.id === 'placement') && (
            <button
              type="button"
              className="engagement-pill lime"
              onClick={handleGoing}
              aria-label="Mark RSVP / Going"
            >
              <Check width={13} height={13} strokeWidth={3} style={{ color: '#111111' }} />
              <span>{going ? `Going ${goingCount}` : item.category === 'Events' ? 'RSVP' : `Going ${goingCount}`}</span>
            </button>
          )}
        </div>

        {/* Read Toggle (Student Only) */}
        {role === 'student' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (item.read) markAsUnread(item.id)
              else markAsRead(item.id)
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: isDarkCard ? '#FFFFFF' : '#111111',
            }}
          >
            {item.read ? (
              <>
                <CheckCircle width={14} height={14} style={{ color: 'var(--accent-lime)' }} />
                <span>Read</span>
              </>
            ) : (
              <>
                <Circle width={14} height={14} />
                <span>Mark as read</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Cohort Acknowledgment Counter when read */}
      {role === 'student' && item.read && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: '10px',
            fontWeight: 800,
            color: '#111111',
            background: 'var(--accent-lime)',
            border: '1.5px solid var(--border)',
            borderRadius: '9999px',
            padding: '3px 8px',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            alignSelf: 'flex-start',
            marginTop: 2,
          }}
        >
          <span style={{ fontWeight: 900 }}>✓</span>
          <span>84 / 120 students in Section {currentUser.section || 'D2'} acknowledged</span>
        </div>
      )}
    </article>
  )
}
