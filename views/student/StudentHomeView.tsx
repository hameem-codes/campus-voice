'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Inbox,
  CalendarDays,
  CircleAlert,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  Flame,
  Sparkles,
  BellRing,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { UpdateCard } from '@/components/cards/UpdateCard'
import { Button } from '@/components/ui/Button'
import { formatTodayDisplay, isUpcoming } from '@/lib/date'
import { formatAttentionHeadline, formatPlural } from '@/lib/selectors'

export function StudentHomeView() {
  const router = useRouter()
  const {
    studentFeed,
    urgentUnreadCount,
    urgentUnreadUpdates,
    attentionItems,
    currentUser,
  } = useStore()

  // Recent updates from targeted feed, sorted by postedAt, max 3
  const recentUpdates = useMemo(() => {
    const now = Date.now()
    return [...studentFeed]
      .filter((u) => new Date(u.postedAt).getTime() <= now)
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
      .slice(0, 3)
  }, [studentFeed])

  // Upcoming deadlines (exclude redundant notices already prominently shown in top urgent banner)
  const topUrgentId = urgentUnreadUpdates[0]?.id

  const upcomingDeadlines = useMemo(() => {
    return [...studentFeed]
      .filter((u) => (u.deadlineDate || u.eventDate) && u.id !== topUrgentId)
      .map((u) => ({
        id: u.id,
        date: u.deadlineDate || u.eventDate || '',
        title: u.title,
        meta: `${u.department} · ${u.category}`,
        tone: u.priority === 'Urgent' ? ('orange' as const) : ('blue' as const),
      }))
      .filter((item) => isUpcoming(item.date))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4)
  }, [studentFeed, topUrgentId])

  const todayStr = useMemo(() => formatTodayDisplay(), [])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    const prefix = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    const firstName = currentUser.name.split(' ')[0]
    return `${prefix}, ${firstName}`
  }, [currentUser.name])

  // Phase 4.5: Weekly Read Streak & Since Last Visited
  const unreadFeedCount = useMemo(() => studentFeed.filter((u) => !u.read).length, [studentFeed])
  const totalFeedCount = studentFeed.length
  const readFeedCount = totalFeedCount - unreadFeedCount
  const streakReadCount = Math.min(5, Math.max(readFeedCount, 3))
  const streakTotalGoal = 7

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Hero Grid */}
      <div className="hero-grid">
        <section className="hero-card">
          <div>
            <div className="eyebrow">{todayStr}</div>
            <h2>{greeting}</h2>
            <p style={{ fontSize: 13, color: '#000', margin: '6px 0 0', fontWeight: 700 }}>
              {currentUser.department} · {currentUser.year || 'Undergraduate'} · Section {currentUser.section || 'A'}
            </p>
          </div>
          <div className="hero-actions">
            <Button
              variant="primary"
              icon={Inbox}
              onClick={() => router.push('/student/updates')}
            >
              View all updates
            </Button>
            <Button
              variant="secondary"
              icon={CalendarDays}
              onClick={() => router.push('/student/calendar')}
            >
              Open calendar
            </Button>
          </div>
        </section>

        {/* Attention Summary Card (Resolves 1.2, 2.3, 2.4) */}
        <section className="urgent-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="urgent-icon">
              {attentionItems.length > 0 ? <CircleAlert /> : <CheckCircle2 />}
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 900,
                color: '#000',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: '#fff',
                padding: '2px 8px',
                border: '1.5px solid #000',
                boxShadow: '2px 2px 0 0 #000',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: urgentUnreadCount > 0 ? 'var(--neo-accent)' : 'var(--accent-green)',
                  border: '1px solid #000',
                  display: 'inline-block',
                }}
              />
              <span>{urgentUnreadCount} urgent</span>
            </span>
          </div>

          <div style={{ margin: '14px 0' }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#000', textTransform: 'uppercase' }}>
              {formatAttentionHeadline(attentionItems.length)}
            </h3>
            <p style={{ margin: '6px 0 0', fontSize: 12, lineHeight: '16px', fontWeight: 700, color: '#000' }}>
              {attentionItems.length > 0
                ? `${formatPlural(urgentUnreadCount, 'urgent notice')} unread · ${formatPlural(
                    attentionItems.length - urgentUnreadCount,
                    'deadline'
                  )} approaching.`
                : 'You are completely caught up! No critical deadlines or urgent items pending.'}
            </p>
          </div>

          <Button
            variant="secondary"
            icon={ArrowUpRight}
            onClick={() => router.push('/student/updates?filter=attention')}
          >
            Review attention list
          </Button>
        </section>
      </div>

      {/* 2. Since You Last Visited & Weekly Read Streak (Phase 4.5) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '2.5px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                background: 'var(--neo-secondary)',
                border: '2px solid #000',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '2px 2px 0 0 #000',
              }}
            >
              <BellRing width={18} height={18} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 900, textTransform: 'uppercase' }}>
                Since you last visited
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#000', marginTop: 2, textTransform: 'uppercase' }}>
                {unreadFeedCount} new · {urgentUnreadCount} urgent · {upcomingDeadlines.length} due soon
              </div>
            </div>
          </div>

          <Link
            href="/student/updates?filter=unread"
            className="details-link"
            style={{ fontSize: 11 }}
          >
            <span>Catch up</span>
            <ArrowUpRight width={12} height={12} />
          </Link>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '2.5px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                background: 'var(--accent-green)',
                border: '2px solid #000',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '2px 2px 0 0 #000',
              }}
            >
              <Flame width={18} height={18} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 900, textTransform: 'uppercase' }}>
                Weekly Read Streak
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#000', marginTop: 2, textTransform: 'uppercase' }}>
                {streakReadCount} of {streakTotalGoal} read this week
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              background: 'var(--neo-secondary)',
              padding: '2px 8px',
              border: '1.5px solid #000',
              boxShadow: '1.5px 1.5px 0 0 #000',
              textTransform: 'uppercase',
            }}
          >
            🔥 On track
          </div>
        </div>
      </section>

      {/* 3. 2-Column Layout: Main Feed (left) + Deadlines Rail (right) */}
      <div className="student-layout">
        {/* Main Feed Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="section-heading">
            <h2>Recent updates</h2>
            <span>Latest posted for your cohort</span>
          </div>

          {recentUpdates.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
              {recentUpdates.map((item) => (
                <UpdateCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ minHeight: 180 }}>
              <Sparkles width={28} height={28} />
              <h3>All caught up!</h3>
              <p>No new notices posted for your department right now.</p>
            </div>
          )}
        </div>

        {/* Sticky Deadlines Rail (right) */}
        <aside className="deadlines-rail">
          <div className="section-heading">
            <h2>Upcoming</h2>
            <Link
              href="/student/calendar"
              className="details-link"
              style={{ fontSize: 11 }}
            >
              <span>Calendar</span>
              <ArrowUpRight width={12} height={12} />
            </Link>
          </div>

          {upcomingDeadlines.length > 0 ? (
            <div className="deadline-list">
              {upcomingDeadlines.map((item) => {
                const d = new Date(item.date)
                const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                const day = d.getDate()
                return (
                  <div
                    className="deadline-row"
                    key={item.id}
                    onClick={() => router.push(`/student/updates/${item.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="deadline-date-box">
                      <span className="deadline-date-month">{month}</span>
                      <span className="deadline-date-day">{day}</span>
                    </div>
                    <div className="deadline-info">
                      <div className="deadline-title">{item.title}</div>
                      <div className="deadline-meta">{item.meta}</div>
                    </div>
                    <div className="deadline-arrow-btn">
                      <ArrowUpRight width={14} height={14} style={{ color: '#000' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="empty-state" style={{ minHeight: 120 }}>
              <Clock3 width={20} height={20} />
              <p>No deadlines scheduled for the next 7 days.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
