'use client'

import React from 'react'
import Link from 'next/link'
import { X, ArrowUpRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatDisplayDate } from '@/lib/date'

export function PinnedNoticeBar() {
  const { pinnedNotice, dismissPinnedNotice } = useStore()

  if (!pinnedNotice) return null

  const dateVal = pinnedNotice.eventDate || pinnedNotice.deadlineDate
  const dateStr = dateVal ? formatDisplayDate(dateVal) : null

  return (
    <div
      role="region"
      aria-label="Pinned notice reminder"
      style={{
        background: '#FFD93D', // high-contrast neo-brutalist yellow (bg-yellow-300)
        border: '2px solid #000000',
        boxShadow: '3px 3px 0px 0px #000000',
        padding: '10px 14px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
        <span style={{ fontSize: '15px' }} aria-hidden="true">📌</span>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 800,
            color: '#000000',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Pinned: </span>
          <Link
            href={`/student/updates/${pinnedNotice.id}`}
            style={{ color: '#000000', textDecoration: 'underline' }}
          >
            {pinnedNotice.title}
          </Link>
          {dateStr && (
            <span style={{ opacity: 0.85, fontWeight: 700 }}> · {dateStr}</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <Link
          href={`/student/updates/${pinnedNotice.id}`}
          className="interactive-link"
          style={{
            fontSize: '11px',
            padding: '2px 8px',
            background: '#ffffff',
            color: '#000000',
            border: '1.5px solid #000000',
            boxShadow: '2px 2px 0 0 #000',
          }}
        >
          <span>Open</span>
          <ArrowUpRight width={12} height={12} />
        </Link>
        <button
          type="button"
          onClick={dismissPinnedNotice}
          aria-label="Dismiss pinned notice reminder"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#000000',
            fontWeight: 900,
            cursor: 'pointer',
            padding: '2px 6px',
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <span>Dismiss ×</span>
        </button>
      </div>
    </div>
  )
}
