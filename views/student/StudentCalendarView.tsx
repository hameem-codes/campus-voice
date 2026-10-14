'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Download,
  ArrowUpRight,
  X,
  Clock,
  MapPin,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import { Modal } from '@/components/ui/Modal'
import { downloadICS, formatDisplayDate } from '@/lib/date'
import { UpdateItem } from '@/types'

export function StudentCalendarView() {
  const { updates, categories } = useStore()

  // Calendar View Mode: Month, Week, Agenda
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Agenda'>('Month')
  // Current anchor date (default: Oct 13, 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-10-13T10:00:00Z'))
  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  // Selected event for popover modal
  const [selectedEvent, setSelectedEvent] = useState<UpdateItem | null>(null)

  // Extract all calendar-enabled updates
  const calendarEvents = useMemo(() => {
    return updates.filter((u) => {
      if (!u.eventDate && !u.deadlineDate) return false
      if (selectedCategory !== 'All' && u.category !== selectedCategory) return false
      return true
    })
  }, [updates, selectedCategory])

  // Navigation handlers
  const handlePrev = () => {
    const next = new Date(currentDate)
    if (viewMode === 'Month') {
      next.setMonth(next.getMonth() - 1)
    } else if (viewMode === 'Week') {
      next.setDate(next.getDate() - 7)
    } else {
      next.setMonth(next.getMonth() - 1)
    }
    setCurrentDate(next)
  }

  const handleNext = () => {
    const next = new Date(currentDate)
    if (viewMode === 'Month') {
      next.setMonth(next.getMonth() + 1)
    } else if (viewMode === 'Week') {
      next.setDate(next.getDate() + 7)
    } else {
      next.setMonth(next.getMonth() + 1)
    }
    setCurrentDate(next)
  }

  const handleToday = () => {
    setCurrentDate(new Date('2026-10-13T10:00:00Z'))
  }

  // Header display string
  const dateRangeDisplay = useMemo(() => {
    if (viewMode === 'Month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
    if (viewMode === 'Week') {
      // Find start of week (Monday)
      const day = currentDate.getDay()
      const diffToMonday = (day === 0 ? -6 : 1) - day
      const monday = new Date(currentDate)
      monday.setDate(monday.getDate() + diffToMonday)
      const sunday = new Date(monday)
      sunday.setDate(sunday.getDate() + 6)
      return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [currentDate, viewMode])

  // Month grid calculation
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Monday as first day of week: (0 is Sunday, so Monday is 0 index)
    let startDayOfWeek = firstDay.getDay() - 1
    if (startDayOfWeek === -1) startDayOfWeek = 6

    const days: { date: Date; isCurrentMonth: boolean; events: UpdateItem[] }[] = []

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i)
      days.push({ date: d, isCurrentMonth: false, events: [] })
    }

    // Current month days
    for (let dayNum = 1; dayNum <= lastDay.getDate(); dayNum++) {
      const d = new Date(year, month, dayNum)
      // Find events matching this date
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
      const evs = calendarEvents.filter((e) => {
        const evDateStr = (e.eventDate || e.deadlineDate || '').slice(0, 10)
        return evDateStr === dStr
      })
      days.push({ date: d, isCurrentMonth: true, events: evs })
    }

    // Next month padding to fill complete grid of 35 or 42
    const totalSlots = days.length <= 35 ? 35 : 42
    let nextMonthDay = 1
    while (days.length < totalSlots) {
      const d = new Date(year, month + 1, nextMonthDay++)
      days.push({ date: d, isCurrentMonth: false, events: [] })
    }

    return days
  }, [currentDate, calendarEvents])

  // Week days calculation
  const weekDays = useMemo(() => {
    const day = currentDate.getDay()
    const diffToMonday = (day === 0 ? -6 : 1) - day
    const monday = new Date(currentDate)
    monday.setDate(monday.getDate() + diffToMonday)

    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(d.getDate() + i)
      const dStr = d.toISOString().slice(0, 10)
      const evs = calendarEvents.filter((e) => {
        const evDateStr = (e.eventDate || e.deadlineDate || '').slice(0, 10)
        return evDateStr === dStr
      })
      days.push({ date: d, events: evs })
    }
    return days
  }, [currentDate, calendarEvents])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Calendar Toolbar */}
      <div className="calendar-toolbar">
        <div className="calendar-date">
          <button
            type="button"
            className="icon-button"
            aria-label="Previous date range"
            onClick={handlePrev}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="btn ghost small"
            onClick={handleToday}
            style={{ fontWeight: 500 }}
          >
            Today
          </button>
          <strong>{dateRangeDisplay}</strong>
          <button
            type="button"
            className="icon-button"
            aria-label="Next date range"
            onClick={handleNext}
          >
            <ChevronRight />
          </button>
        </div>

        <div className="segmented">
          {(['Month', 'Week', 'Agenda'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={viewMode === mode ? 'active' : ''}
              onClick={() => setViewMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter chips */}
      <div className="filter-row">
        <button
          type="button"
          className={`chip filter ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          All {calendarEvents.length}
        </button>
        {categories.map((c) => {
          const count = updates.filter(
            (u) => (u.eventDate || u.deadlineDate) && u.category === c.name
          ).length
          if (count === 0) return null
          return (
            <button
              key={c.id}
              type="button"
              className={`chip filter ${selectedCategory === c.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(c.name)}
            >
              {c.name} {count}
            </button>
          )
        })}
      </div>

      {/* View Mode 1: Month True Grid */}
      {viewMode === 'Month' && (
        <div className="month-calendar-wrap">
          <div className="month-grid-header">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="month-grid-header-cell">
                {d}
              </div>
            ))}
          </div>

          <div className="month-grid-body">
            {monthDays.map((cell, idx) => {
              const isToday =
                cell.date.toDateString() === new Date('2026-10-13T10:00:00Z').toDateString()

              return (
                <div
                  key={idx}
                  className={`month-cell ${!cell.isCurrentMonth ? 'month-cell-outside' : ''} ${isToday ? 'month-cell-today' : ''}`}
                >
                  <div className="month-cell-date">
                    <span className={`date-badge ${isToday ? 'active' : ''}`}>
                      {cell.date.getDate()}
                    </span>
                  </div>

                  <div className="month-cell-events">
                    {cell.events.map((ev) => (
                      <button
                        key={ev.id}
                        type="button"
                        className={`month-event-pill ${ev.priority === 'Urgent' ? 'orange' : 'blue'}`}
                        onClick={() => setSelectedEvent(ev)}
                        title={ev.title}
                      >
                        <span className="event-pill-text">{ev.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* View Mode 2: Week View */}
      {viewMode === 'Week' && (
        <div className="timeline">
          <div className="timeline-head">
            <div>Category</div>
            {weekDays.map((w, i) => (
              <div key={i}>
                {w.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
              </div>
            ))}
          </div>

          {['Academic & Exams', 'Finances & Fees', 'Events & Workshops'].map((track, trackIdx) => (
            <div className="timeline-row" key={track}>
              <div className="timeline-label">{track}</div>
              <div className="timeline-track">
                {calendarEvents
                  .filter((e) => {
                    if (trackIdx === 0) return e.category === 'Exams' || e.category === 'Results'
                    if (trackIdx === 1) return e.category === 'Fees' || e.category === 'Scholarships'
                    return e.category === 'Events' || e.category === 'Placements'
                  })
                  .slice(0, 2)
                  .map((ev, evIdx) => (
                    <div
                      key={ev.id}
                      className={`timeline-bar ${ev.priority === 'Urgent' ? 'orange' : 'blue'}`}
                      style={{
                        gridColumn: `${(evIdx * 3 + 2) % 6 + 1} / span 2`,
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedEvent(ev)}
                    >
                      <span>{ev.title}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Mode 3: Agenda View */}
      {viewMode === 'Agenda' && (
        <div className="deadline-list">
          {calendarEvents.length > 0 ? (
            calendarEvents
              .sort(
                (a, b) =>
                  new Date(a.eventDate || a.deadlineDate || a.postedAt).getTime() -
                  new Date(b.eventDate || b.deadlineDate || b.postedAt).getTime()
              )
              .map((ev) => {
                const dateObj = new Date(ev.eventDate || ev.deadlineDate || ev.postedAt)
                const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                const day = dateObj.getDate()

                return (
                  <div
                    key={ev.id}
                    className="deadline-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <div className="deadline-date">
                      {month} {day}
                    </div>
                    <div>
                      <div className="deadline-title">{ev.title}</div>
                      <div className="deadline-meta">
                        {ev.department} · {ev.category}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StatusChip tone={ev.priority === 'Urgent' ? 'orange' : 'blue'}>
                        {formatDisplayDate(ev.eventDate || ev.deadlineDate)}
                      </StatusChip>
                      <ArrowUpRight width={14} height={14} style={{ color: 'var(--text-3)' }} />
                    </div>
                  </div>
                )
              })
          ) : (
            <div className="empty-state" style={{ minHeight: 140 }}>
              <p>No calendar events matching the selected filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Event Details Popover Modal */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Details'}
        description={`${selectedEvent?.category} · Verified Campus Notice`}
      >
        {selectedEvent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                background: 'var(--bg-muted)',
                borderRadius: 'var(--radius-control)',
              }}
            >
              <Clock width={16} height={16} style={{ color: 'var(--accent-blue)' }} />
              <div>
                <strong style={{ fontSize: 13 }}>
                  {formatDisplayDate(selectedEvent.eventDate || selectedEvent.deadlineDate)}
                </strong>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  Posted by {selectedEvent.publisher.name} ({selectedEvent.department})
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)', lineHeight: '20px' }}>
              {selectedEvent.excerpt}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <Button
                variant="secondary"
                icon={Download}
                onClick={() => {
                  downloadICS({
                    title: selectedEvent.title,
                    description: selectedEvent.excerpt,
                    location: selectedEvent.department,
                    startDate: selectedEvent.eventDate || selectedEvent.deadlineDate || selectedEvent.postedAt,
                  })
                }}
              >
                Download .ics
              </Button>
              <Link href={`/student/updates/${selectedEvent.id}`}>
                <Button variant="primary" icon={ArrowUpRight}>
                  Open Full Notice
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
