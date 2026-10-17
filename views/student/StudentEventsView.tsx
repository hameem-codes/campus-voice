'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Megaphone,
  Compass,
  User,
  CalendarDays,
  Briefcase,
  GraduationCap,
  Folder,
  Bookmark,
  Flame,
  ChevronRight,
  Search,
  Bell,
  ChevronDown,
  Heart,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  X,
  MapPin,
  Calendar,
  Layers,
  Wrench,
  Users,
  Trophy,
  Check,
  ChevronLeft,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface CampusEventItem {
  id: string
  title: string
  excerpt: string
  category: 'Cultural' | 'Technical' | 'Workshops' | 'Competitions' | 'Seminars' | 'Sports' | 'Club Activities' | 'Placement'
  tag: string
  isHot?: boolean
  dateFormatted: string
  dayOfMonth: number
  location: string
  interestedCount: number
  isInterested?: boolean
  isRegistered?: boolean
  imageSrc: string
}

const initialCampusEvents: CampusEventItem[] = [
  // Row 1: 3 Cards
  {
    id: 'garba-night-event',
    title: 'Garba Night',
    excerpt: 'Dr AIT welcomes all students for the garba-26. Dress code: ethnic wear.',
    category: 'Cultural',
    tag: 'CULTURAL',
    isHot: true,
    dateFormatted: '15 Oct 2026 • 7:00 PM',
    dayOfMonth: 15,
    location: 'College Ground',
    interestedCount: 320,
    isInterested: false,
    isRegistered: true,
    imageSrc: '/images/garba_night.jpg',
  },
  {
    id: 'workshop-ai-ml-event',
    title: 'Workshop on AI & ML',
    excerpt: 'A hands-on workshop organized by the CSE department.',
    category: 'Technical',
    tag: 'TECHNICAL',
    dateFormatted: '20 Oct 2026 • 2:00 PM',
    dayOfMonth: 20,
    location: 'CSE Seminar Hall',
    interestedCount: 180,
    isInterested: true,
    imageSrc: '/images/ai_workshop.jpg',
  },
  {
    id: 'tech-talk-series-event',
    title: 'Tech Talk Series',
    excerpt: 'Industry experts sharing insights on emerging technologies.',
    category: 'Seminars',
    tag: 'SEMINAR',
    dateFormatted: '12 Oct 2026 • 4:00 PM',
    dayOfMonth: 12,
    location: 'Main Auditorium',
    interestedCount: 120,
    isInterested: true,
    imageSrc: '/images/tech_talk.jpg',
  },
  // Row 2: 3 Cards
  {
    id: 'campus-recruitment-event',
    title: 'Campus Recruitment Drive',
    excerpt: 'Final-year students can register for the upcoming recruitment drive.',
    category: 'Placement',
    tag: 'PLACEMENT',
    dateFormatted: '12 Oct 2026 • 11:00 AM',
    dayOfMonth: 12,
    location: 'Placement Cell',
    interestedCount: 280,
    isInterested: false,
    imageSrc: '/images/placement_drive.jpg',
  },
  {
    id: 'football-match-event',
    title: 'Inter-College Football Match',
    excerpt: 'Annual inter-college football tournament.',
    category: 'Sports',
    tag: 'SPORTS',
    dateFormatted: '22 Oct 2026 • 4:00 PM',
    dayOfMonth: 22,
    location: 'Sports Complex',
    interestedCount: 96,
    isInterested: false,
    imageSrc: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'photography-contest-event',
    title: 'Photography Contest',
    excerpt: 'Showcase your creativity and capture campus life.',
    category: 'Club Activities',
    tag: 'CLUB',
    dateFormatted: '25 Oct 2026 • 10:00 AM',
    dayOfMonth: 25,
    location: 'Media Club',
    interestedCount: 98,
    isInterested: false,
    isRegistered: true,
    imageSrc: '/images/photography_contest.jpg',
  },
]

export function StudentEventsView() {
  const router = useRouter()
  const {
    currentUser,
    role,
    setRole,
    savedIds,
    toggleSave,
    addToast,
    logout,
    theme,
    toggleTheme,
  } = useStore()

  // State
  const [activeCategory, setActiveCategory] = useState<string>('All Events')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<'All Dates' | 'This Week' | 'This Month' | 'Upcoming'>('All Dates')
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null)
  const [myEventsTab, setMyEventsTab] = useState<'Upcoming' | 'Registered' | 'Past'>('Upcoming')
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false)
  const [streakModalOpen, setStreakModalOpen] = useState(false)
  const [registrationModalEvent, setRegistrationModalEvent] = useState<string | null>(null)

  // Live interactive events collection
  const [eventsList, setEventsList] = useState<CampusEventItem[]>(initialCampusEvents)

  // Search input ref
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Global ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Toggle Interested
  const handleToggleInterested = (eventId: string) => {
    setEventsList((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextInterested = !ev.isInterested
          const nextCount = nextInterested ? ev.interestedCount + 1 : Math.max(0, ev.interestedCount - 1)
          addToast({
            type: nextInterested ? 'success' : 'info',
            title: nextInterested ? 'Marked as Interested' : 'Removed from Interested',
            message: nextInterested
              ? `You are now interested in "${ev.title}". Added to your calendar.`
              : `Removed interest for "${ev.title}".`,
          })
          return {
            ...ev,
            isInterested: nextInterested,
            interestedCount: nextCount,
          }
        }
        return ev
      })
    )
  }

  // Toggle Bookmark
  const handleToggleBookmark = (eventId: string, eventTitle: string) => {
    toggleSave(eventId)
    const isCurrentlySaved = savedIds.includes(eventId)
    addToast({
      type: isCurrentlySaved ? 'info' : 'success',
      title: isCurrentlySaved ? 'Removed from Bookmarks' : 'Saved to Bookmarks',
      message: isCurrentlySaved
        ? `"${eventTitle}" removed from your bookmarks.`
        : `"${eventTitle}" saved to your bookmarks.`,
    })
  }

  // Filtered Events
  const filteredEvents = useMemo(() => {
    let list = [...eventsList]

    // Category Filter
    if (activeCategory !== 'All Events') {
      list = list.filter(
        (ev) =>
          ev.category.toLowerCase() === activeCategory.toLowerCase() ||
          ev.tag.toLowerCase() === activeCategory.toLowerCase()
      )
    }

    // Selected Calendar Day Filter
    if (selectedCalendarDay !== null) {
      list = list.filter((ev) => ev.dayOfMonth === selectedCalendarDay)
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (ev) =>
          ev.title.toLowerCase().includes(q) ||
          ev.excerpt.toLowerCase().includes(q) ||
          ev.location.toLowerCase().includes(q) ||
          ev.category.toLowerCase().includes(q)
      )
    }

    return list
  }, [eventsList, activeCategory, selectedCalendarDay, searchQuery])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F7',
        color: '#111111',
        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
      }}
    >
      <ToastContainer />

      {/* Main Container */}
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '16px 20px 48px',
        }}
      >
        {/* ========================================================
            TOP HEADER BAR
           ======================================================== */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 20,
            flexWrap: 'wrap',
          }}
        >
          {/* Logo */}
          <Link
            href="/student"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              color: '#111111',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: '#111111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3.5,
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              }}
            >
              <span style={{ width: 4, height: 14, backgroundColor: '#D5FF38', borderRadius: 9999, display: 'inline-block' }} />
              <span style={{ width: 4, height: 24, backgroundColor: '#D5FF38', borderRadius: 9999, display: 'inline-block' }} />
              <span style={{ width: 4, height: 18, backgroundColor: '#D5FF38', borderRadius: 9999, display: 'inline-block' }} />
              <span style={{ width: 4, height: 12, backgroundColor: '#D5FF38', borderRadius: 9999, display: 'inline-block' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 21,
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: '#111111',
                }}
              >
                CampusVoice
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  letterSpacing: '-0.01em',
                  marginTop: 1,
                }}
              >
                Your Campus. Your Voice.
              </span>
            </div>
          </Link>

          {/* Search Bar Pill with ⌘K Badge */}
          <div
            style={{
              flex: 1,
              maxWidth: 580,
              minWidth: 260,
              backgroundColor: '#FFFFFF',
              borderRadius: 9999,
              border: '1.5px solid #E5E7EB',
              padding: '8px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <Search width={16} height={16} color="#9CA3AF" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search events, placements, announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: 13,
                fontWeight: 600,
                color: '#111111',
              }}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  padding: 2,
                }}
              >
                <X width={14} height={14} />
              </button>
            ) : (
              <div
                style={{
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>⌘</span>
                <span>K</span>
              </div>
            )}
          </div>

          {/* Top Right: Notification Bell & Profile Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Bell Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setNotificationPopoverOpen((v) => !v)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
                aria-label="Notifications"
              >
                <Bell width={18} height={18} color="#111111" />
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    fontSize: 10,
                    fontWeight: 900,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFFFFF',
                  }}
                >
                  3
                </span>
              </button>

              {/* Notification Popover */}
              {notificationPopoverOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 52,
                    width: 320,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    border: '2px solid #111111',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                    padding: 16,
                    zIndex: 100,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontWeight: 900, fontSize: 13, textTransform: 'uppercase' }}>
                      Notifications (3)
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotificationPopoverOpen(false)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <X width={14} height={14} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: '8px 10px', backgroundColor: '#F9FAFB', borderRadius: 12, border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: 12, fontWeight: 800 }}>⚡ Garba Night Registration Confirmed</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>Entry QR generated for Oct 15 • 7:00 PM</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill: "Hi, Mateen" / "Student v" */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '4px 14px 4px 5px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    border: '1.5px solid #111111',
                  }}
                >
                  <Image
                    src="/images/mateen_avatar.jpg"
                    alt="Mateen"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>
                    Hi, Mateen
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 3 }}>
                    Student <ChevronDown width={12} height={12} />
                  </span>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 52,
                    width: 220,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 18,
                    border: '2px solid #111111',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                    padding: 10,
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>
                    Switch Account Role
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('student')
                      setProfileDropdownOpen(false)
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 10,
                      backgroundColor: role === 'student' ? '#D5FF38' : 'transparent',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#111111',
                    }}
                  >
                    <User width={14} height={14} />
                    <span>Student (Mateen)</span>
                    {role === 'student' && <span style={{ marginLeft: 'auto' }}>✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('faculty')
                      setProfileDropdownOpen(false)
                      router.push('/faculty')
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 10,
                      backgroundColor: role === 'faculty' ? '#D5FF38' : 'transparent',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#111111',
                    }}
                  >
                    <GraduationCap width={14} height={14} />
                    <span>Faculty (Dr. Maya Rao)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('admin')
                      setProfileDropdownOpen(false)
                      router.push('/admin')
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 10,
                      backgroundColor: role === 'admin' ? '#D5FF38' : 'transparent',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#111111',
                    }}
                  >
                    <ShieldCheck width={14} height={14} />
                    <span>Admin (Priya Nair)</span>
                  </button>
                  <div style={{ height: 1, backgroundColor: '#E5E7EB', margin: '6px 0' }} />
                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme()
                      setProfileDropdownOpen(false)
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: 'none',
                      background: 'transparent',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#111111',
                    }}
                  >
                    {theme === 'dark' ? <Sun width={14} height={14} /> : <Moon width={14} height={14} />}
                    <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      router.push('/login')
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: 'none',
                      background: 'transparent',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#DC2626',
                    }}
                  >
                    <LogOut width={14} height={14} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ========================================================
            3-COLUMN MAIN LAYOUT
           ======================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px minmax(0, 1fr) 300px',
            gap: 20,
            alignItems: 'start',
          }}
          className="dashboard-columns"
        >
          {/* ======================================================
              LEFT COLUMN: PITCH-BLACK SIDEBAR
             ====================================================== */}
          <aside
            style={{
              backgroundColor: '#111111',
              borderRadius: 26,
              padding: '18px 14px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 820,
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* 1. Announcements */}
              <button
                type="button"
                onClick={() => router.push('/student')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Megaphone width={17} height={17} />
                <span>Announcements</span>
              </button>

              {/* 2. Explore Campus */}
              <button
                type="button"
                onClick={() => router.push('/student/explore')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Compass width={17} height={17} />
                <span>Explore Campus</span>
              </button>

              {/* 3. My Activity */}
              <button
                type="button"
                onClick={() => router.push('/student/activity')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <User width={17} height={17} />
                <span>My Activity</span>
              </button>

              <div style={{ height: 1, backgroundColor: '#222222', margin: '6px 8px' }} />

              {/* 4. Events (ACTIVE) */}
              <button
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 16px',
                  borderRadius: 16,
                  border: 'none',
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 3px 8px rgba(213,255,56,0.3)',
                }}
              >
                <CalendarDays width={17} height={17} />
                <span>Events</span>
              </button>

              {/* 5. Placements */}
              <button
                type="button"
                onClick={() => router.push('/student/placements')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Briefcase width={17} height={17} />
                <span>Placements</span>
              </button>

              {/* 6. Academic */}
              <button
                type="button"
                onClick={() => router.push('/student/academic')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <GraduationCap width={17} height={17} />
                <span>Academic</span>
              </button>

              {/* 7. General */}
              <button
                type="button"
                onClick={() => router.push('/student/general')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Folder width={17} height={17} />
                <span>General</span>
              </button>

              <div style={{ height: 1, backgroundColor: '#222222', margin: '6px 8px' }} />

              {/* 8. Bookmarked */}
              <button
                type="button"
                onClick={() => router.push('/student/saved')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Bookmark width={17} height={17} />
                <span>Bookmarked</span>
                {savedIds.length > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#282828',
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 800,
                      borderRadius: 9999,
                      padding: '1px 7px',
                    }}
                  >
                    {savedIds.length}
                  </span>
                )}
              </button>

              {/* 9. Reading Streak */}
              <button
                type="button"
                onClick={() => router.push('/student/streak')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Clock width={17} height={17} />
                <span>Reading Streak</span>
              </button>
            </nav>

            {/* Bottom 7 Day Streak Card */}
            <div
              onClick={() => router.push('/student/streak')}
              style={{
                marginTop: 'auto',
                backgroundColor: '#1C1C1E',
                border: '1px solid #28282E',
                borderRadius: 18,
                padding: '14px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>🔥</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF' }}>
                    7 Day Streak
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF' }}>
                    Keep up with campus!
                  </span>
                </div>
              </div>
              <ChevronRight width={16} height={16} color="#9CA3AF" />
            </div>
          </aside>

          {/* ======================================================
              CENTER COLUMN: CAMPUS EVENTS MAIN FEED
             ====================================================== */}
          <main style={{ minWidth: 0 }}>
            {/* Header Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                backgroundColor: '#E5E7EB',
                borderRadius: 9999,
                padding: '5px 14px',
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#111111',
                marginBottom: 8,
              }}
            >
              <GraduationCap width={13} height={13} />
              <span>EVENTS • PARTICIPATE • CONNECT • GROW</span>
            </div>

            {/* Headline + Sticker */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: 'clamp(36px, 3.8vw, 48px)',
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: '-0.04em',
                    color: '#111111',
                    margin: '4px 0 8px',
                  }}
                >
                  Campus Events
                </h1>
                <p
                  style={{
                    fontSize: 15,
                    color: '#6B7280',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Discover exciting events, workshops, competitions and more happening around campus.
                </p>
              </div>

              {/* Acid-Lime Green Sticker: GOOD EVENTS GREAT PEOPLE. */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  transform: 'rotate(5deg)',
                  userSelect: 'none',
                }}
                className="hidden-mobile"
              >
                <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', marginBottom: 2 }}>
                  \ | /
                </div>
                <div
                  style={{
                    backgroundColor: '#D5FF38',
                    border: '2px solid #111111',
                    borderRadius: 18,
                    padding: '8px 16px',
                    textAlign: 'center',
                    boxShadow: '2.5px 3px 0px #111111',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                    GOOD
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                    EVENTS
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                    GREAT PEOPLE.
                  </div>
                </div>
              </div>
            </div>

            {/* In-feed Search & Date Filter Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 14,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 260,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 9999,
                  border: '1.5px solid #E5E7EB',
                  padding: '9px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                }}
              >
                <Search width={16} height={16} color="#9CA3AF" />
                <input
                  type="text"
                  placeholder="Search events, workshops, competitions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#111111',
                  }}
                />
              </div>

              {/* Date Filter Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setDateDropdownOpen((v) => !v)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 9999,
                    padding: '8px 18px',
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <CalendarDays width={14} height={14} />
                  <span>{selectedCalendarDay ? `Oct ${selectedCalendarDay}, 2026` : dateFilter}</span>
                  <ChevronDown width={13} height={13} />
                </button>

                {dateDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 40,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 14,
                      border: '1.5px solid #111111',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      padding: 6,
                      zIndex: 30,
                      minWidth: 150,
                    }}
                  >
                    {['All Dates', 'This Week', 'This Month', 'Upcoming'].map((df) => (
                      <button
                        key={df}
                        type="button"
                        onClick={() => {
                          setDateFilter(df as any)
                          setSelectedCalendarDay(null)
                          setDateDropdownOpen(false)
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '7px 12px',
                          borderRadius: 8,
                          border: 'none',
                          background: dateFilter === df && !selectedCalendarDay ? '#F3F4F6' : 'transparent',
                          fontWeight: 800,
                          fontSize: 12,
                          color: '#111111',
                          cursor: 'pointer',
                        }}
                      >
                        {df}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter Pills: All Events, Cultural, Technical, Workshops, Competitions, Seminars, Sports, Club Activities */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                overflowX: 'auto',
                paddingBottom: 4,
                marginBottom: 20,
              }}
            >
              {[
                'All Events',
                'Cultural',
                'Technical',
                'Workshops',
                'Competitions',
                'Seminars',
                'Sports',
                'Club Activities',
              ].map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat)
                      setSelectedCalendarDay(null)
                    }}
                    style={{
                      backgroundColor: isActive ? '#111111' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#111111',
                      border: isActive ? '1.5px solid #111111' : '1.5px solid #E5E7EB',
                      borderRadius: 9999,
                      padding: '6px 18px',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.12s ease',
                      boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Featured Event Hero Banner */}
            <div
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 26,
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                marginBottom: 24,
              }}
            >
              <div style={{ flex: 1, zIndex: 2 }}>
                {/* Featured Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    borderRadius: 9999,
                    padding: '3px 12px',
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  <span>✦ FEATURED EVENT</span>
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(22px, 2.5vw, 30px)',
                    fontWeight: 900,
                    margin: '0 0 8px',
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    lineHeight: 1.15,
                  }}
                >
                  Annual Cultural Fest<br />MAITRI 2026
                </h2>

                <p
                  style={{
                    fontSize: 13,
                    color: '#D1D5DB',
                    margin: '0 0 16px',
                    maxWidth: 420,
                    lineHeight: 1.45,
                  }}
                >
                  Music, dance, food, competitions and much more! Get ready for the biggest event of the year.
                </p>

                {/* Metadata Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                    fontSize: 12,
                    color: '#9CA3AF',
                    marginBottom: 20,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar width={14} height={14} color="#D5FF38" />
                    <span style={{ color: '#FFFFFF' }}>14 Oct 2026</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock width={14} height={14} color="#D5FF38" />
                    <span style={{ color: '#FFFFFF' }}>12:00 PM</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin width={14} height={14} color="#D5FF38" />
                    <span style={{ color: '#FFFFFF' }}>Main Auditorium</span>
                  </span>
                </div>

                {/* Register Now Button */}
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationModalEvent('Annual Cultural Fest MAITRI 2026')
                    addToast({
                      type: 'success',
                      title: 'Registration Opened',
                      message: 'Confirm your pass for MAITRI 2026.',
                    })
                  }}
                  style={{
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    border: 'none',
                    borderRadius: 9999,
                    padding: '10px 24px',
                    fontWeight: 900,
                    fontSize: 13,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(213,255,56,0.3)',
                  }}
                >
                  <span>Register Now</span>
                  <ArrowRight width={14} height={14} />
                </button>
              </div>

              {/* Right Visual Graphic */}
              <div
                style={{
                  width: 260,
                  height: 180,
                  borderRadius: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  border: '2px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
                className="hidden-mobile"
              >
                <Image
                  src="/images/cultural_fest.jpg"
                  alt="MAITRI 2026"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* ====================================================
                UPCOMING EVENTS SECTION
               ==================================================== */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#111111' }}>
                  Upcoming Events
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All Events')
                    setSelectedCalendarDay(null)
                  }}
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#111111',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>View All</span>
                  <ArrowRight width={12} height={12} />
                </button>
              </div>

              {/* Grid: 3 columns matching reference */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                }}
              >
                {filteredEvents.map((item) => {
                  const isBookmarked = savedIds.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 22,
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '1.5px solid #E5E7EB',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div
                        onClick={() => router.push(`/student/events/${item.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Image Thumbnail with Overlay Badges */}
                        <div
                          style={{
                            width: '100%',
                            height: 116,
                            borderRadius: 16,
                            overflow: 'hidden',
                            position: 'relative',
                            marginBottom: 12,
                            border: '1px solid #E5E7EB',
                          }}
                        >
                          <Image
                            src={item.imageSrc}
                            alt={item.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />

                          {/* Tag */}
                          <div
                            style={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              backgroundColor: '#FFFFFF',
                              color: '#111111',
                              borderRadius: 9999,
                              padding: '2px 8px',
                              fontSize: 9,
                              fontWeight: 900,
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.tag}
                          </div>

                          {/* Hot Badge */}
                          {item.isHot && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: '#FA78B9',
                                color: '#111111',
                                borderRadius: 9999,
                                padding: '2px 8px',
                                fontSize: 9,
                                fontWeight: 900,
                              }}
                            >
                              🔥 Hot
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h4
                          style={{
                            margin: '0 0 4px',
                            fontSize: 14,
                            fontWeight: 900,
                            color: '#111111',
                            lineHeight: 1.25,
                          }}
                        >
                          {item.title}
                        </h4>
                        <p
                          style={{
                            margin: '0 0 10px',
                            fontSize: 11,
                            color: '#6B7280',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.excerpt}
                        </p>

                        {/* Meta: Time & Location */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            fontSize: 10,
                            color: '#6B7280',
                            marginBottom: 12,
                            fontWeight: 600,
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock width={11} height={11} />
                            <span>{item.dateFormatted}</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin width={11} height={11} />
                            <span>{item.location}</span>
                          </span>
                        </div>
                      </div>

                      {/* Bottom Action: Pink Interested Button + Bookmark */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: 8,
                          borderTop: '1px solid #F3F4F6',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleInterested(item.id)}
                          style={{
                            backgroundColor: '#FA78B9',
                            color: '#111111',
                            border: 'none',
                            borderRadius: 9999,
                            padding: '5px 12px',
                            fontSize: 11,
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                        >
                          <Heart width={11} height={11} fill={item.isInterested ? '#111111' : 'none'} />
                          <span>Interested {item.interestedCount}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(item.id, item.title)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: isBookmarked ? '#111111' : '#9CA3AF',
                            padding: 4,
                          }}
                          title="Bookmark"
                        >
                          <Bookmark width={14} height={14} fill={isBookmarked ? '#111111' : 'none'} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </main>

          {/* ======================================================
              RIGHT COLUMN: EVENTS CALENDAR, MY EVENTS & REMINDER
             ====================================================== */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* WIDGET 1: Events Calendar (Pitch-Black Card) */}
            <div
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 24,
                padding: '18px 16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarDays width={16} height={16} color="#D5FF38" />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>
                    Events Calendar
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCalendarDay(null)}
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#9CA3AF',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <span>View Calendar</span>
                  <ArrowRight width={11} height={11} />
                </button>
              </div>

              {/* Month Navigation Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  backgroundColor: '#1A1A1A',
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <button type="button" style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                  <ChevronLeft width={14} height={14} />
                </button>
                <span style={{ fontSize: 13, fontWeight: 900 }}>October 2026</span>
                <button type="button" style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                  <ChevronRight width={14} height={14} />
                </button>
              </div>

              {/* Calendar Days Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#6B7280',
                  marginBottom: 8,
                }}
              >
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Calendar Grid (Days 1 to 31) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 4,
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {/* Leading empty days */}
                <span style={{ color: '#4B5563' }}>27</span>
                <span style={{ color: '#4B5563' }}>28</span>
                <span style={{ color: '#4B5563' }}>29</span>
                <span style={{ color: '#4B5563' }}>30</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>

                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>

                <span>11</span>
                {/* Day 12 (Blue Interested) */}
                <button
                  type="button"
                  onClick={() => setSelectedCalendarDay(12)}
                  style={{
                    backgroundColor: '#3C5BFF',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: 26,
                    height: 26,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  12
                </button>
                <span>13</span>
                {/* Day 14 (Lime Event) */}
                <button
                  type="button"
                  onClick={() => setSelectedCalendarDay(14)}
                  style={{
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    borderRadius: '50%',
                    width: 26,
                    height: 26,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  14
                </button>
                {/* Day 15 (Pink Registered) */}
                <button
                  type="button"
                  onClick={() => setSelectedCalendarDay(15)}
                  style={{
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    borderRadius: '50%',
                    width: 26,
                    height: 26,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  15
                </button>
                <span>16</span>
                <span>17</span>

                <span>18</span>
                <span>19</span>
                {/* Day 20 (Blue Interested) */}
                <button
                  type="button"
                  onClick={() => setSelectedCalendarDay(20)}
                  style={{
                    backgroundColor: '#3C5BFF',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: 26,
                    height: 26,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  20
                </button>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>

                {/* Day 25 (Pink Registered) */}
                <button
                  type="button"
                  onClick={() => setSelectedCalendarDay(25)}
                  style={{
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    borderRadius: '50%',
                    width: 26,
                    height: 26,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  25
                </button>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
                <span>31</span>
              </div>

              {/* Legend Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 14,
                  marginTop: 12,
                  borderTop: '1px solid #222222',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#D5FF38' }} />
                  <span style={{ color: '#D5FF38' }}>Event</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FA78B9' }} />
                  <span style={{ color: '#FA78B9' }}>Registered</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3C5BFF' }} />
                  <span style={{ color: '#3C5BFF' }}>Interested</span>
                </span>
              </div>
            </div>

            {/* WIDGET 2: My Events (Pitch-Black Card) */}
            <div
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 24,
                padding: '18px 16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star width={16} height={16} color="#D5FF38" />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>
                    My Events
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => addToast({ type: 'info', title: 'My Events', message: 'Showing your registered and saved campus events.' })}
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#9CA3AF',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <span>View All</span>
                  <ArrowRight width={11} height={11} />
                </button>
              </div>

              {/* Sub-tabs: Upcoming (active lime), Registered, Past */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {(['Upcoming', 'Registered', 'Past'] as const).map((tab) => {
                  const isActive = myEventsTab === tab
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMyEventsTab(tab)}
                      style={{
                        flex: 1,
                        backgroundColor: isActive ? '#D5FF38' : '#222222',
                        color: isActive ? '#111111' : '#9CA3AF',
                        border: 'none',
                        borderRadius: 9999,
                        padding: '5px 0',
                        fontSize: 10,
                        fontWeight: 900,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {tab}
                    </button>
                  )
                })}
              </div>

              {/* 3 Event Rows in Clean White Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  {
                    day: '14',
                    month: 'OCT',
                    title: 'Annual Cultural Fest',
                    meta: '12:00 PM • Main Auditorium',
                  },
                  {
                    day: '20',
                    month: 'OCT',
                    title: 'Workshop on AI & ML',
                    meta: '02:00 PM • CSE Seminar Hall',
                  },
                  {
                    day: '25',
                    month: 'OCT',
                    title: 'Garba Night',
                    meta: '07:00 PM • College Ground',
                  },
                ].map((ev, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: ev.title,
                        message: `Event on ${ev.month} ${ev.day}: ${ev.meta}`,
                      })
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 14,
                      backgroundColor: '#FFFFFF',
                      color: '#111111',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          textAlign: 'center',
                          minWidth: 32,
                          lineHeight: 1.1,
                          paddingRight: 6,
                          borderRight: '1.5px solid #F3F4F6',
                        }}
                      >
                        <div style={{ fontSize: 9, fontWeight: 900, color: '#6B7280' }}>{ev.month}</div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>{ev.day}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: '#111111' }}>{ev.title}</div>
                        <div style={{ fontSize: 10, color: '#6B7280' }}>{ev.meta}</div>
                      </div>
                    </div>
                    <ChevronRight width={14} height={14} color="#9CA3AF" />
                  </div>
                ))}
              </div>
            </div>

            {/* WIDGET 3: Create Event Reminder (Electric Blue Card) */}
            <div
              style={{
                backgroundColor: '#3C5BFF',
                color: '#FFFFFF',
                borderRadius: 24,
                padding: '20px 18px',
                boxShadow: '0 8px 24px rgba(60,91,255,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: '#FFFFFF',
                    color: '#3C5BFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Calendar width={18} height={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>
                    Create Event Reminder
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}>
                    Never miss an event. Get notified before it starts.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Event Reminders Enabled',
                    message: 'You will receive push notifications 1 hour before scheduled events.',
                  })
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  borderRadius: 9999,
                  padding: '10px 16px',
                  fontWeight: 900,
                  fontSize: 12,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                <span>Enable Notifications</span>
                <ArrowRight width={13} height={13} />
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ========================================================
          MODAL: EVENT REGISTRATION
         ======================================================== */}
      {registrationModalEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 16,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setRegistrationModalEvent(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              border: '2px solid #111111',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: 440,
              padding: 24,
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎟️</div>
            <h3 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 6px' }}>{registrationModalEvent}</h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 20px' }}>
              Your student ID is verified for free access. Confirmation pass will be linked to your profile.
            </p>
            <button
              type="button"
              onClick={() => {
                setRegistrationModalEvent(null)
                addToast({
                  type: 'success',
                  title: 'Registration Complete',
                  message: `Your pass for ${registrationModalEvent} is confirmed!`,
                })
              }}
              style={{
                width: '100%',
                backgroundColor: '#D5FF38',
                color: '#111111',
                borderRadius: 9999,
                padding: '12px',
                fontSize: 14,
                fontWeight: 900,
                border: '1.5px solid #111111',
                cursor: 'pointer',
              }}
            >
              Confirm Registration
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: READING STREAK
         ======================================================== */}
      {streakModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 16,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setStreakModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              border: '2px solid #111111',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: 420,
              padding: 24,
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 44, marginBottom: 8 }}>🔥</div>
            <h3 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 6px' }}>7 Day Streak Active!</h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 20px' }}>
              Keep attending events and stay ahead of all campus deadlines!
            </p>
            <button
              type="button"
              onClick={() => setStreakModalOpen(false)}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#D5FF38',
                borderRadius: 9999,
                padding: '12px',
                fontSize: 14,
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
