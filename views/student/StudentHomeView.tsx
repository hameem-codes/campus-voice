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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Grid */}
      <div className="hero-grid">
        <section className="hero-card">
          <div>
            <div className="eyebrow">{todayStr}</div>
            <h2>Your campus, in one clear view.</h2>
            <p>
              Good day, {currentUser.name.split(' ')[0]}. You are viewing notices for{' '}
              <strong>{currentUser.department}</strong> ({currentUser.year || 'General'},{' '}
              {currentUser.section || 'All'}).
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

        {/* Needs attention banner */}
        <section className="urgent-card">
          <div className="urgent-icon">
            <CircleAlert />
          </div>
          <div>
            <h3>
              {attentionItems.length === 0
                ? 'No immediate alerts.'
                : `${attentionItems.length} update${attentionItems.length === 1 ? '' : 's'} need your attention.`}
            </h3>
            <p>
              {attentionItems.length === 0
                ? 'You are up to date on all urgent notices and approaching deadlines.'
                : 'Urgent notices and approaching course milestones.'}
            </p>
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

      {/* Recent Updates section */}
      <section>
        <div className="section-heading">
          <h2>Recent updates</h2>
          <span>Sorted by latest posted date</span>
        </div>
        {recentUpdates.length > 0 ? (
          <div className="card-grid">
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
      </section>

      {/* Upcoming Deadlines section */}
      <section>
        <div className="section-heading">
          <h2>Upcoming deadlines & events</h2>
          <Link
            href="/student/calendar"
            style={{
              fontSize: 12,
              color: 'var(--text-3)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>Calendar view</span>
            <ArrowUpRight width={14} height={14} />
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
      </section>
    </div>
  )
}
