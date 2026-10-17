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
  Map,
  Check,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface ExploreEventItem {
  id: string
  title: string
  excerpt: string
  category: 'Events' | 'Placements' | 'Academic' | 'Workshops' | 'Clubs' | 'Competitions' | 'Seminars' | 'General'
  tag: string
  isHot?: boolean
  dateFormatted: string
  location: string
  interestedCount: number
  isInterested?: boolean
  imageSrc?: string
  bgStyle?: 'black' | 'blue' | 'white'
  isCompact?: boolean
}

const initialExploreEvents: ExploreEventItem[] = [
  // Row 1: 4 Large Cards
  {
    id: 'garba-night-explore',
    title: 'Garba Night',
    excerpt: 'Dr AIT welcomes all students for the garba-26. Dress code: ethnic wear.',
    category: 'Events',
    tag: 'EVENT',
    isHot: true,
    dateFormatted: '15 Oct 2026 • 7:00 PM',
    location: 'College Ground',
    interestedCount: 320,
    isInterested: false,
    imageSrc: '/images/garba_night.jpg',
    bgStyle: 'white',
  },
  {
    id: 'campus-recruitment-explore',
    title: 'Campus Recruitment Drive',
    excerpt: 'Final-year students can register for the upcoming recruitment drive.',
    category: 'Placements',
    tag: 'PLACEMENT',
    dateFormatted: '12 Oct 2026 • 11:00 AM',
    location: 'Placement Cell',
    interestedCount: 280,
    isInterested: false,
    imageSrc: '/images/placement_drive.jpg',
    bgStyle: 'white',
  },
  {
    id: 'workshop-ai-ml-explore',
    title: 'Workshop on AI & ML',
    excerpt: 'A hands-on workshop organized by the CSE department.',
    category: 'Workshops',
    tag: 'WORKSHOP',
    dateFormatted: '20 Oct 2026 • 2:00 PM',
    location: 'CSE Seminar Hall',
    interestedCount: 180,
    isInterested: false,
    imageSrc: '/images/ai_workshop.jpg',
    bgStyle: 'blue',
  },
  {
    id: 'mid-sem-exam-explore',
    title: 'Mid Sem Exam Schedule',
    excerpt: 'The mid semester examination schedule has been released.',
    category: 'Academic',
    tag: 'ACADEMIC',
    dateFormatted: '12 Oct 2026 • 9:30 AM',
    location: 'Academic Block',
    interestedCount: 150,
    isInterested: false,
    imageSrc: '/images/mid_sem_exam.jpg',
    bgStyle: 'white',
  },
  // Row 2: 4 Compact Cards
  {
    id: 'tech-talk-series',
    title: 'Tech Talk Series',
    excerpt: 'Next-gen distributed systems and AI ethics presented by industry leaders.',
    category: 'Events',
    tag: 'EVENT',
    dateFormatted: '18 Oct 2026 • 4:00 PM',
    location: 'Main Auditorium',
    interestedCount: 120,
    isInterested: false,
    imageSrc: '/images/tech_talk.jpg',
    isCompact: true,
  },
  {
    id: 'photography-contest',
    title: 'Photography Contest',
    excerpt: 'Annual autumn campus photography challenge with cash prizes.',
    category: 'Clubs',
    tag: 'CLUB',
    dateFormatted: '25 Oct 2026 • 10:00 AM',
    location: 'Media Club',
    interestedCount: 98,
    isInterested: false,
    imageSrc: '/images/photography_contest.jpg',
    isCompact: true,
  },
  {
    id: 'blood-donation-drive',
    title: 'Blood Donation Drive',
    excerpt: 'Annual NSS & Red Cross voluntary blood donation camp.',
    category: 'General',
    tag: 'GENERAL',
    dateFormatted: '28 Oct 2026 • 9:00 AM',
    location: 'Health Center',
    interestedCount: 76,
    isInterested: false,
    imageSrc: '/images/blood_donation.jpg',
    isCompact: true,
  },
  {
    id: 'entrepreneurship-seminar',
    title: 'Entrepreneurship Seminar',
    excerpt: 'Founder stories and early-stage seed funding insights.',
    category: 'Seminars',
    tag: 'SEMINAR',
    dateFormatted: '30 Oct 2026 • 3:00 PM',
    location: 'Management Block',
    interestedCount: 64,
    isInterested: false,
    imageSrc: '/images/entrepreneurship_seminar.jpg',
    isCompact: true,
  },
]

export function StudentExploreView() {
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
  const [activeNav, setActiveNav] = useState('Explore Campus')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<'All Dates' | 'This Week' | 'This Month' | 'Upcoming'>('All Dates')
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false)
  const [mapDetailModal, setMapDetailModal] = useState<string | null>(null)
  const [selectedMapPin, setSelectedMapPin] = useState<string | null>(null)
  const [streakModalOpen, setStreakModalOpen] = useState(false)
  const [eventDetailItem, setEventDetailItem] = useState<ExploreEventItem | null>(null)

  // Live interactive event items
  const [eventsList, setEventsList] = useState<ExploreEventItem[]>(initialExploreEvents)

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

  // Interactive Interested Button Toggle
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
              ? `You are now interested in "${ev.title}". Added to your campus activity.`
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

  // Interactive Bookmark Toggle
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
    let result = [...eventsList]

    // Category Filter
    if (activeCategory !== 'All') {
      result = result.filter(
        (ev) =>
          ev.category.toLowerCase() === activeCategory.toLowerCase() ||
          ev.tag.toLowerCase() === activeCategory.toLowerCase()
      )
    }

    // Map Pin Venue Filter
    if (selectedMapPin) {
      result = result.filter((ev) =>
        ev.location.toLowerCase().includes(selectedMapPin.toLowerCase())
      )
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (ev) =>
          ev.title.toLowerCase().includes(q) ||
          ev.excerpt.toLowerCase().includes(q) ||
          ev.location.toLowerCase().includes(q) ||
          ev.category.toLowerCase().includes(q)
      )
    }

    return result
  }, [eventsList, activeCategory, selectedMapPin, searchQuery])

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
          {/* Logo with 4 Acid-Lime Equalizer Bars */}
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
            {/* Notification Bell with Badge "3" */}
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
                      <div style={{ fontSize: 12, fontWeight: 800 }}>⚡ Annual Cultural Fest Passes</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>Entry gates open at 12:00 PM Main Auditorium</div>
                    </div>
                    <div style={{ padding: '8px 10px', backgroundColor: '#F9FAFB', borderRadius: 12, border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: 12, fontWeight: 800 }}>📸 Photography Contest Submissions</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>Last date to submit: 25 Oct 2026</div>
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
            {/* Nav items */}
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

              {/* 2. Explore Campus (ACTIVE) */}
              <button
                type="button"
                onClick={() => {
                  setActiveNav('Explore Campus')
                  setActiveCategory('All')
                  setSelectedMapPin(null)
                }}
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

              {/* 4. Events */}
              <button
                type="button"
                onClick={() => router.push('/student/calendar')}
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
                onClick={() => setStreakModalOpen(true)}
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
              onClick={() => setStreakModalOpen(true)}
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
              CENTER COLUMN: EXPLORE CAMPUS FEED
             ====================================================== */}
          <main style={{ minWidth: 0 }}>
            {/* Tag Badge */}
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
              <span>DISCOVER • PARTICIPATE • GROW</span>
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
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <span>Explore Campus</span>
                  <span style={{ fontSize: 22, color: '#111111', fontWeight: 900, letterSpacing: -1 }}>
                    \ | /
                  </span>
                </h1>
                <p
                  style={{
                    fontSize: 15,
                    color: '#6B7280',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Discover events, opportunities, clubs and activities happening around campus.
                </p>
              </div>

              {/* Acid-Lime Green Sticker: SAME CAMPUS. MORE TO EXPLORE. */}
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
                    SAME CAMPUS.
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                    MORE TO EXPLORE.
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
                  placeholder="Search events, clubs, workshops, placements..."
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

              {/* Date Dropdown */}
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
                  <span>{dateFilter}</span>
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
                          setDateDropdownOpen(false)
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '7px 12px',
                          borderRadius: 8,
                          border: 'none',
                          background: dateFilter === df ? '#F3F4F6' : 'transparent',
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

            {/* Category Filter Pills Row: All, Events, Placements, Academic, Workshops, Clubs, Competitions, Seminars */}
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
              {['All', 'Events', 'Placements', 'Academic', 'Workshops', 'Clubs', 'Competitions', 'Seminars'].map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat)
                      setSelectedMapPin(null)
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
              {/* Left Details */}
              <div style={{ flex: 1, zIndex: 2 }}>
                {/* Featured Tag */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 9999,
                    padding: '4px 12px',
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <span>✦ FEATURED EVENT</span>
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(24px, 2.6vw, 32px)',
                    fontWeight: 900,
                    margin: '0 0 8px',
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                  }}
                >
                  Annual Cultural Fest
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
                  MAITRI 2026 is about to arrive in style. Music, dance, food, competitions and much more!
                </p>

                {/* Info Row: Date & Location */}
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
                    <span style={{ color: '#FFFFFF' }}>14 Oct 2026 12:00 PM</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin width={14} height={14} color="#D5FF38" />
                    <span style={{ color: '#FFFFFF' }}>Main Auditorium</span>
                  </span>
                </div>

                {/* View Details Button */}
                <button
                  type="button"
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Annual Cultural Fest - MAITRI 2026',
                      message: 'Schedule and artist passes are now available.',
                    })
                  }}
                  style={{
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    border: 'none',
                    borderRadius: 9999,
                    padding: '10px 22px',
                    fontWeight: 900,
                    fontSize: 13,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(213,255,56,0.3)',
                  }}
                >
                  <span>View Details</span>
                  <ArrowRight width={14} height={14} />
                </button>
              </div>

              {/* Right Image Graphic (MAITRI 2026 Concert) */}
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
                  alt="MAITRI 2026 Cultural Fest"
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
                  onClick={() => setActiveCategory('All')}
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

              {/* Row 1: 4 Large Event Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                {filteredEvents
                  .filter((ev) => !ev.isCompact)
                  .map((item) => {
                    const isBookmarked = savedIds.includes(item.id)
                    const isBlueCard = item.bgStyle === 'blue'
                    return (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: isBlueCard ? '#3C5BFF' : '#FFFFFF',
                          color: isBlueCard ? '#FFFFFF' : '#111111',
                          borderRadius: 22,
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          border: isBlueCard ? 'none' : '1.5px solid #E5E7EB',
                          boxShadow: isBlueCard
                            ? '0 8px 20px rgba(60,91,255,0.2)'
                            : '0 2px 8px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div>
                          {/* Image Thumbnail with Overlay Badges */}
                          {item.imageSrc && (
                            <div
                              style={{
                                width: '100%',
                                height: 110,
                                borderRadius: 16,
                                overflow: 'hidden',
                                position: 'relative',
                                marginBottom: 12,
                                border: isBlueCard ? '1.5px solid rgba(255,255,255,0.2)' : '1px solid #E5E7EB',
                              }}
                            >
                              <Image
                                src={item.imageSrc}
                                alt={item.title}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                              {/* Top left Tag */}
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 8,
                                  left: 8,
                                  backgroundColor: isBlueCard ? '#FFFFFF' : '#FFFFFF',
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                  }}
                                >
                                  <span>🔥 Hot</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Title & Description */}
                          <h4
                            style={{
                              margin: '0 0 4px',
                              fontSize: 14,
                              fontWeight: 900,
                              color: isBlueCard ? '#FFFFFF' : '#111111',
                              lineHeight: 1.25,
                            }}
                          >
                            {item.title}
                          </h4>
                          <p
                            style={{
                              margin: '0 0 10px',
                              fontSize: 11,
                              color: isBlueCard ? 'rgba(255,255,255,0.85)' : '#6B7280',
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
                              color: isBlueCard ? 'rgba(255,255,255,0.75)' : '#9CA3AF',
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
                            borderTop: isBlueCard ? '1px solid rgba(255,255,255,0.2)' : '1px solid #F3F4F6',
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
                              color: isBlueCard ? '#FFFFFF' : isBookmarked ? '#111111' : '#9CA3AF',
                              padding: 4,
                            }}
                            title="Bookmark"
                          >
                            <Bookmark width={14} height={14} fill={isBookmarked ? (isBlueCard ? '#FFFFFF' : '#111111') : 'none'} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Row 2: 4 Compact Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: 16,
                }}
              >
                {filteredEvents
                  .filter((ev) => ev.isCompact)
                  .map((item) => {
                    const isBookmarked = savedIds.includes(item.id)
                    return (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: 20,
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          border: '1.5px solid #E5E7EB',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        }}
                      >
                        <div>
                          {/* Image & Title row */}
                          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                            {item.imageSrc && (
                              <div
                                style={{
                                  width: 54,
                                  height: 48,
                                  borderRadius: 12,
                                  overflow: 'hidden',
                                  position: 'relative',
                                  flexShrink: 0,
                                  border: '1px solid #E5E7EB',
                                }}
                              >
                                <Image
                                  src={item.imageSrc}
                                  alt={item.title}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            )}

                            <div>
                              <span
                                style={{
                                  backgroundColor: '#F3F4F6',
                                  color: '#374151',
                                  borderRadius: 9999,
                                  padding: '2px 8px',
                                  fontSize: 9,
                                  fontWeight: 900,
                                  textTransform: 'uppercase',
                                }}
                              >
                                {item.tag}
                              </span>
                              <h4
                                style={{
                                  margin: '4px 0 0',
                                  fontSize: 13,
                                  fontWeight: 900,
                                  color: '#111111',
                                  lineHeight: 1.25,
                                }}
                              >
                                {item.title}
                              </h4>
                            </div>
                          </div>

                          {/* Meta */}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              fontSize: 10,
                              color: '#6B7280',
                              marginBottom: 10,
                              fontWeight: 600,
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Calendar width={10} height={10} />
                              <span>{item.dateFormatted}</span>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <MapPin width={10} height={10} />
                              <span>{item.location}</span>
                            </span>
                          </div>
                        </div>

                        {/* Bottom Row */}
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
                              padding: '4px 10px',
                              fontSize: 11,
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Heart width={10} height={10} fill={item.isInterested ? '#111111' : 'none'} />
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
                          >
                            <Bookmark width={13} height={13} fill={isBookmarked ? '#111111' : 'none'} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </main>

          {/* ======================================================
              RIGHT COLUMN: CAMPUS MAP, POPULAR & CATEGORIES
             ====================================================== */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* WIDGET 1: Campus Map (Acid-Lime Green Card) */}
            <div
              style={{
                backgroundColor: '#D5FF38',
                color: '#111111',
                borderRadius: 24,
                padding: '16px',
                boxShadow: '0 8px 20px rgba(213,255,56,0.22)',
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
                  <Map width={18} height={18} color="#111111" />
                  <span style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>
                    Campus Map
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMapDetailModal('Campus Map')}
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#111111',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <span>View Full Map</span>
                  <ArrowRight width={11} height={11} />
                </button>
              </div>

              {/* Map Illustration with Interactive Location Pins */}
              <div
                style={{
                  width: '100%',
                  height: 190,
                  borderRadius: 18,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1.5px solid #111111',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <Image
                  src="/images/campus_map.jpg"
                  alt="Campus Map"
                  fill
                  style={{ objectFit: 'cover' }}
                />

                {/* Pin 1: Main Auditorium (Pink) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMapPin('Main Auditorium')
                    addToast({ type: 'info', title: 'Main Auditorium', message: 'Showing events at Main Auditorium.' })
                  }}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '26%',
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    borderRadius: 9999,
                    padding: '3px 9px',
                    fontSize: 9,
                    fontWeight: 900,
                    border: '1.5px solid #111111',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <MapPin width={10} height={10} />
                  <span>Main Auditorium</span>
                </button>

                {/* Pin 2: Library (Blue) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMapPin('Library')
                    addToast({ type: 'info', title: 'Library', message: 'Showing events at Library.' })
                  }}
                  style={{
                    position: 'absolute',
                    top: '38%',
                    right: '12%',
                    backgroundColor: '#3C5BFF',
                    color: '#FFFFFF',
                    borderRadius: 9999,
                    padding: '3px 9px',
                    fontSize: 9,
                    fontWeight: 900,
                    border: '1.5px solid #111111',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <MapPin width={10} height={10} />
                  <span>Library</span>
                </button>

                {/* Pin 3: CSE Block (Blue) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMapPin('CSE')
                    addToast({ type: 'info', title: 'CSE Block', message: 'Showing events at CSE Block.' })
                  }}
                  style={{
                    position: 'absolute',
                    top: '52%',
                    left: '12%',
                    backgroundColor: '#3C5BFF',
                    color: '#FFFFFF',
                    borderRadius: 9999,
                    padding: '3px 9px',
                    fontSize: 9,
                    fontWeight: 900,
                    border: '1.5px solid #111111',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <MapPin width={10} height={10} />
                  <span>CSE Block</span>
                </button>

                {/* Pin 4: Placement Cell (Lime) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMapPin('Placement')
                    addToast({ type: 'info', title: 'Placement Cell', message: 'Showing drives at Placement Cell.' })
                  }}
                  style={{
                    position: 'absolute',
                    top: '64%',
                    right: '10%',
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    borderRadius: 9999,
                    padding: '3px 9px',
                    fontSize: 9,
                    fontWeight: 900,
                    border: '1.5px solid #111111',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <MapPin width={10} height={10} />
                  <span>Placement Cell</span>
                </button>

                {/* Pin 5: Sports Complex (Pink) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMapPin('College Ground')
                    addToast({ type: 'info', title: 'Sports Complex', message: 'Showing events at Sports Complex & College Ground.' })
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '12%',
                    right: '25%',
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    borderRadius: 9999,
                    padding: '3px 9px',
                    fontSize: 9,
                    fontWeight: 900,
                    border: '1.5px solid #111111',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <MapPin width={10} height={10} />
                  <span>Sports Complex</span>
                </button>
              </div>

              {selectedMapPin && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800 }}>Filtering venue: {selectedMapPin}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedMapPin(null)}
                    style={{ fontSize: 10, fontWeight: 900, textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* WIDGET 2: Popular This Week (Pitch-Black Card) */}
            <div
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 24,
                padding: '18px 16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp width={16} height={16} color="#D5FF38" />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>
                    Popular This Week
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => addToast({ type: 'info', title: 'Rankings', message: 'Ranked by student interest and RSVP activity this week.' })}
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

              {/* 5 Ranked Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  {
                    rank: 1,
                    color: '#D5FF38',
                    textColor: '#111111',
                    title: 'Annual Cultural Fest',
                    stat: '2.4K interested',
                  },
                  {
                    rank: 2,
                    color: '#FA78B9',
                    textColor: '#111111',
                    title: 'Campus Recruitment Drive',
                    stat: '1.8K interested',
                  },
                  {
                    rank: 3,
                    color: '#3C5BFF',
                    textColor: '#FFFFFF',
                    title: 'Workshop on AI & ML',
                    stat: '1.2K interested',
                  },
                  {
                    rank: 4,
                    color: '#FFFFFF',
                    textColor: '#111111',
                    title: 'Mid Sem Exam Schedule',
                    stat: '980 interested',
                  },
                  {
                    rank: 5,
                    color: '#FFFFFF',
                    textColor: '#111111',
                    title: 'Garba Night',
                    stat: '850 interested',
                  },
                ].map((pop) => (
                  <div
                    key={pop.rank}
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: pop.title,
                        message: `${pop.stat} this week.`,
                      })
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      padding: '4px 0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: pop.color,
                          color: pop.textColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        {pop.rank}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                          {pop.title}
                        </div>
                        <div style={{ fontSize: 10, color: '#9CA3AF' }}>{pop.stat}</div>
                      </div>
                    </div>
                    <ChevronRight width={14} height={14} color="#6B7280" />
                  </div>
                ))}
              </div>
            </div>

            {/* WIDGET 3: Browse by Category (White Card) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: '18px 16px',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Folder width={16} height={16} color="#111111" />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>
                    Browse by Category
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#6B7280',
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

              {/* 2x3 Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {/* 1. Events (Pink) */}
                <div
                  onClick={() => setActiveCategory('Events')}
                  style={{
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    borderRadius: 16,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(250,120,185,0.2)',
                  }}
                >
                  <Calendar width={18} height={18} color="#111111" style={{ marginBottom: 4 }} />
                  <span style={{ fontSize: 11, fontWeight: 900 }}>Events</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#374151' }}>120+</span>
                </div>

                {/* 2. Placements (Lime) */}
                <div
                  onClick={() => setActiveCategory('Placements')}
                  style={{
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    borderRadius: 16,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(213,255,56,0.2)',
                  }}
                >
                  <Briefcase width={18} height={18} color="#111111" style={{ marginBottom: 4 }} />
                  <span style={{ fontSize: 11, fontWeight: 900 }}>Placements</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#374151' }}>45+</span>
                </div>

                {/* 3. Academic (Electric Blue) */}
                <div
                  onClick={() => setActiveCategory('Academic')}
                  style={{
                    backgroundColor: '#3C5BFF',
                    color: '#FFFFFF',
                    borderRadius: 16,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(60,91,255,0.2)',
                  }}
                >
                  <GraduationCap width={18} height={18} color="#FFFFFF" style={{ marginBottom: 4 }} />
                  <span style={{ fontSize: 11, fontWeight: 900 }}>Academic</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>80+</span>
                </div>

                {/* 4. Workshops (White with border) */}
                <div
                  onClick={() => setActiveCategory('Workshops')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#111111',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 16,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Wrench width={18} height={18} color="#111111" style={{ marginBottom: 4 }} />
                  <span style={{ fontSize: 11, fontWeight: 900 }}>Workshops</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#6B7280' }}>35+</span>
                </div>

                {/* 5. Clubs (White with border) */}
                <div
                  onClick={() => setActiveCategory('Clubs')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#111111',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 16,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Users width={18} height={18} color="#111111" style={{ marginBottom: 4 }} />
                  <span style={{ fontSize: 11, fontWeight: 900 }}>Clubs</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#6B7280' }}>25+</span>
                </div>

                {/* 6. Competitions (White with border) */}
                <div
                  onClick={() => setActiveCategory('Competitions')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#111111',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 16,
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Trophy width={18} height={18} color="#111111" style={{ marginBottom: 4 }} />
                  <span style={{ fontSize: 11, fontWeight: 900 }}>Competitions</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#6B7280' }}>18+</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ========================================================
          MODAL: FULL CAMPUS MAP VIEW
         ======================================================== */}
      {mapDetailModal && (
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
          onClick={() => setMapDetailModal(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              border: '2px solid #111111',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: 720,
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#6B7280' }}>
                  Interactive Campus Navigation
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 900 }}>
                  Campus Grounds & Key Venues
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMapDetailModal(null)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X width={18} height={18} />
              </button>
            </div>

            <div
              style={{
                width: '100%',
                height: 380,
                borderRadius: 18,
                position: 'relative',
                overflow: 'hidden',
                border: '1.5px solid #111111',
                marginBottom: 16,
              }}
            >
              <Image
                src="/images/campus_map.jpg"
                alt="Full Campus Map"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Main Auditorium', 'Central Library', 'CSE Block', 'Placement Cell', 'College Ground', 'Health Center'].map((venue) => (
                <button
                  key={venue}
                  type="button"
                  onClick={() => {
                    setSelectedMapPin(venue)
                    setMapDetailModal(null)
                    addToast({ type: 'info', title: venue, message: `Filtered events at ${venue}.` })
                  }}
                  style={{
                    backgroundColor: '#F3F4F6',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 9999,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  📍 {venue}
                </button>
              ))}
            </div>
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
            <h3 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 6px' }}>7 Day Streak!</h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 20px' }}>
              You have explored campus updates every day this week!
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
              Keep Streak Going
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
