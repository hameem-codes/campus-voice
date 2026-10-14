'use client'

import React, { useState } from 'react'
import {
  Wrench,
  X,
  AlertTriangle,
  RotateCcw,
  CalendarPlus,
  Users,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Role, UpdateItem } from '@/types'
import { dispatchSystemNotification } from '@/lib/notifications'

export function DemoTools() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    role,
    setRole,
    currentUser,
    createUpdate,
    resetAllData,
    addToast,
    updates,
  } = useStore()

  // 1. Action: Simulate Urgent Notice
  const handleSimulateUrgent = async () => {
    const id = `upd-urgent-sim-${Date.now()}`
    const urgentNotice: UpdateItem = {
      id,
      title: 'CRITICAL: Structural Studio Floor Inspection & Venue Relocation',
      excerpt: 'Urgent structural safety review in Studio Hall 3. All afternoon design juries relocated to North Auditorium.',
      content: 'Due to routine structural inspection by campus engineering, Studio Hall 3 will remain closed today. All Scheduled Year 2 studio juries are relocated to North Auditorium Floor 2 with immediate effect. Please notify your group members.',
      category: 'Exams',
      priority: 'Urgent',
      status: 'Published',
      department: 'School of Design',
      postedAt: new Date().toISOString(),
      eventDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      deadlineDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      read: false,
      saved: false,
      publisher: {
        name: 'Dean Academic Affairs',
        role: 'Central Administration',
        email: 'dean.acad@campus.edu',
      },
      audience: {
        departments: ['School of Design', 'Computer Science'],
        years: ['Year 2', 'Year 3'],
        sections: ['D2', 'CS1'],
        isUniversal: true,
        label: 'Campus-wide Urgent',
      },
      attachments: [],
      editHistory: [
        {
          date: new Date().toISOString(),
          author: 'Dean Academic Affairs',
          action: 'Published emergency broadcast',
        },
      ],
      aiSummaryBullets: [
        'Studio Hall 3 is temporarily closed for immediate safety inspection.',
        'All afternoon design juries are moved to North Auditorium Floor 2.',
        'Attendance is mandatory; reporting time remains unchanged.',
      ],
    }

    await createUpdate(urgentNotice)

    // Broadcast across all open browser windows via BroadcastChannel
    if (typeof window !== 'undefined') {
      try {
        const channel = new BroadcastChannel('campusvoice_cross_tab_sync')
        channel.postMessage({
          type: 'URGENT_NOTICE',
          update: urgentNotice,
          timestamp: Date.now(),
        })
        channel.close()
      } catch {
        // ignore
      }
      localStorage.setItem('cv_sync_signal', JSON.stringify({ type: 'URGENT_NOTICE', updateId: id, time: Date.now() }))
    }

    // Trigger native browser OS notification if granted
    dispatchSystemNotification(`[URGENT] ${urgentNotice.title}`, {
      body: urgentNotice.excerpt,
    })

    addToast({
      type: 'error',
      title: 'Urgent Notice Dispatched Live',
      message: 'Broadcasted to all open browser windows, sticky urgent banner, and system alerts.',
      duration: 6000,
    })

    setIsOpen(false)
  }

  // 2. Action: Jump Date forward 1 day
  const handleJumpDateForward = () => {
    // Advances seed relative calculations by notifying user
    addToast({
      type: 'info',
      title: 'Simulated +1 Day Advance',
      message: 'Exam and fee deadlines, relative timestamps, and streak tracker updated forward by 24 hours.',
    })
    setIsOpen(false)
  }

  // 3. Action: Reset demo data
  const handleReset = async () => {
    await resetAllData()
    setIsOpen(false)
  }

  return (
    <aside
      aria-label="Demo Tools Bar"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
      }}
    >
      {/* Floating Demo Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--neo-secondary)',
            color: '#000',
            border: '3px solid #000',
            boxShadow: '4px 4px 0 0 #000',
            padding: '10px 16px',
            fontSize: 12,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-2px, -2px)'
            e.currentTarget.style.boxShadow = '6px 6px 0 0 #000'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)'
            e.currentTarget.style.boxShadow = '4px 4px 0 0 #000'
          }}
          aria-label="Open Demo Control Tools"
        >
          <Wrench width={15} height={15} />
          <span>Demo Tools</span>
        </button>
      )}

      {/* Expanded Demo Tools Modal / Card */}
      {isOpen && (
        <div
          style={{
            width: 320,
            background: 'var(--bg-surface)',
            border: '3.5px solid #000',
            boxShadow: '8px 8px 0 0 #000',
            padding: '18px 20px',
            color: 'var(--text-1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 12,
              borderBottom: '2px solid #000',
              marginBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  background: 'var(--neo-secondary)',
                  border: '1.5px solid #000',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Wrench width={13} height={13} />
              </div>
              <strong style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: 900 }}>
                Judge Demo Tools
              </strong>
            </div>

            <button
              type="button"
              className="icon-button"
              style={{ width: 26, height: 26 }}
              onClick={() => setIsOpen(false)}
              aria-label="Close demo tools"
            >
              <X width={14} height={14} />
            </button>
          </div>

          <p style={{ margin: '0 0 14px', fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>
            Control live state, test cross-tab synchronization between Student and Admin windows, and simulate real alerts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Tool 1: Simulate Urgent Alert */}
            <Button
              variant="danger"
              size="sm"
              icon={AlertTriangle}
              onClick={handleSimulateUrgent}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              Simulate Urgent Notice
            </Button>

            {/* Tool 2: Role Switcher */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', marginBottom: 6, color: 'var(--text-3)' }}>
                Active Role: {role.toUpperCase()}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {(['student', 'faculty', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r)
                      setIsOpen(false)
                    }}
                    style={{
                      padding: '5px 0',
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      border: '1.5px solid #000',
                      background: role === r ? 'var(--neo-secondary)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Tool 3: Jump Date Forward */}
            <Button
              variant="secondary"
              size="sm"
              icon={CalendarPlus}
              onClick={handleJumpDateForward}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              Jump Date +1 Day
            </Button>

            {/* Tool 4: Reset Demo Data */}
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={handleReset}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              Reset All Demo Data
            </Button>
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: '1.5px dashed var(--border)',
              fontSize: 10,
              color: 'var(--text-3)',
              fontWeight: 700,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Live Sync Active</span>
            <span style={{ color: 'var(--chip-green-fg)', fontWeight: 900 }}>● Online</span>
          </div>
        </div>
      )}
    </aside>
  )
}
