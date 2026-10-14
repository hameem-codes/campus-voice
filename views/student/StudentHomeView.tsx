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
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { UpdateCard } from '@/components/cards/UpdateCard'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import { formatDisplayDate, isUpcoming } from '@/lib/date'
import { UpdateItem, UserProfile } from '@/types'

export function matchesStudentAudience(update: UpdateItem, user: UserProfile): boolean {
  if (update.status !== 'Published') return false
  if (update.audience.isUniversal) return true
  const { departments, years, sections } = update.audience
  const matchesDept = departments.length === 0 || departments.includes(user.department)
  const matchesYear = years.length === 0 || (user.year && years.includes(user.year))
  const matchesSec = sections.length === 0 || (user.section && sections.includes(user.section))
  return Boolean(matchesDept && matchesYear && matchesSec)
}

export function StudentHomeView() {
  const router = useRouter()
  const { updates, currentUser } = useStore()

  // Filter updates targeted to this student's department, year, and section
  const studentFeed = useMemo(() => {
    return updates.filter((u) => matchesStudentAudience(u, currentUser))
  }, [updates, currentUser])

  // Recent updates: sorted by postedAt (never future dates in Recent!), max 3
  const recentUpdates = useMemo(() => {
    const now = new Date().getTime()
    return [...studentFeed]
      .filter((u) => new Date(u.postedAt).getTime() <= now)
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
      .slice(0, 3)
  }, [studentFeed])

  // Real upcoming deadlines / events
  const upcomingDeadlines = useMemo(() => {
    return [...studentFeed]
      .filter((u) => u.deadlineDate || u.eventDate)
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
  }, [studentFeed])

  // Attention banner items: unread urgent OR due within 3 days
  const attentionItems = useMemo(() => {
    const now = new Date().getTime()
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000
    return studentFeed.filter((u) => {
      const isUnreadUrgent = u.priority === 'Urgent' && !u.read
      const isDueSoon =
        (u.deadlineDate && new Date(u.deadlineDate).getTime() - now <= threeDaysMs && new Date(u.deadlineDate).getTime() >= now) ||
        (u.eventDate && new Date(u.eventDate).getTime() - now <= threeDaysMs && new Date(u.eventDate).getTime() >= now)
      return isUnreadUrgent || isDueSoon
    })
  }, [studentFeed])

  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    const prefix = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    const name = currentUser.name.split(' ')[0]
    return `${prefix}, ${name}`
  }, [currentUser.name])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Grid */}
      <div className="hero-grid">
        <section className="hero-card">
          <div>
            <div className="eyebrow">{todayStr}</div>
            <h2>{greeting}</h2>
            <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '4px 0 0' }}>
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

        {/* Needs attention card */}
        <section className="urgent-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="urgent-icon">
              <CircleAlert />
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--accent-orange)',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--accent-orange)',
                  display: 'inline-block',
                }}
              />
              <span>{attentionItems.length} urgent</span>
            </span>
          </div>

          <div style={{ margin: '14px 0' }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: 'var(--text-1)' }}>
              {attentionItems.length > 0 ? `${attentionItems.length} urgent` : '0 urgent'}
            </h3>
          </div>

          <Button
            variant="ghost"
            icon={ArrowUpRight}
            onClick={() => router.push('/student/updates?filter=attention')}
          >
            Review now
          </Button>
        </section>
      </div>

      {/* 2-Column Layout: Main Feed (left) + Deadlines Rail (right) */}
      <div className="student-layout">
        {/* Main Feed Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="section-heading">
            <h2>Recent updates</h2>
            <span>Latest posted</span>
          </div>

          {recentUpdates.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
              {recentUpdates.map((item) => (
                <UpdateCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ minHeight: 160 }}>
              <h3>No recent updates</h3>
              <p>New notices posted for your department will appear here.</p>
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
                    <div className="deadline-date">
                      {month} {day}
                    </div>
                    <div>
                      <div className="deadline-title">{item.title}</div>
                      <div className="deadline-meta">{item.meta}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <StatusChip tone={item.tone}>
                        {formatDisplayDate(item.date)}
                      </StatusChip>
                      <ArrowUpRight width={14} height={14} style={{ color: 'var(--text-3)' }} />
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
