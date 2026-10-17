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
  MessageSquare,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  X,
  FileText,
  Eye,
  Calendar,
  Check,
  Star,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface RecentActivityItem {
  id: string
  type: 'comment' | 'bookmark' | 'read' | 'like' | 'register'
  title: string
  subtitle?: string
  timeAgo: string
  category: 'general' | 'placement' | 'academic' | 'events' | 'comments'
}

interface SavedBookmarkItem {
  id: string
  title: string
  tag: string
  category: string
  dateFormatted: string
  imageSrc: string
}

const initialRecentActivity: RecentActivityItem[] = [
  {
    id: 'act-1',
    type: 'comment',
    title: 'You commented on Garba Night',
    subtitle: '"Can’t wait for this! 🎉"',
    timeAgo: '2 hours ago',
    category: 'comments',
  },
  {
    id: 'act-2',
    type: 'bookmark',
    title: 'You bookmarked Placement Drive',
    timeAgo: '3 hours ago',
    category: 'placement',
  },
  {
    id: 'act-3',
    type: 'read',
    title: 'You read Library Timings Update',
    timeAgo: '4 hours ago',
    category: 'general',
  },
  {
    id: 'act-4',
    type: 'like',
    title: 'You liked Annual Cultural Fest',
    timeAgo: '5 hours ago',
    category: 'events',
  },
  {
    id: 'act-5',
    type: 'register',
    title: 'You registered for Workshop on AI & ML',
    timeAgo: '1 day ago',
    category: 'events',
  },
  {
    id: 'act-6',
    type: 'read',
    title: 'You read Mid Sem Exam Schedule',
    timeAgo: '1 day ago',
    category: 'academic',
  },
  {
    id: 'act-7',
    type: 'like',
    title: 'You liked Campus Recruitment Drive',
    timeAgo: '2 days ago',
    category: 'placement',
  },
  {
    id: 'act-8',
    type: 'comment',
    title: 'You commented on Tech Talk Series',
    subtitle: '"Very helpful session!"',
    timeAgo: '2 days ago',
    category: 'comments',
  },
  {
    id: 'act-9',
    type: 'bookmark',
    title: 'You bookmarked Entrepreneurship Seminar',
    timeAgo: '3 days ago',
    category: 'placement',
  },
  {
    id: 'act-10',
    type: 'read',
    title: 'You read Hostels Maintenance Update',
    timeAgo: '3 days ago',
    category: 'general',
  },
]

const initialBookmarks: SavedBookmarkItem[] = [
  {
    id: 'bm-1',
    title: 'Garba Night',
    tag: 'EVENT',
    category: 'Events',
    dateFormatted: '15 Oct 2026 • 7:00 PM',
    imageSrc: '/images/garba_night.jpg',
  },
  {
    id: 'bm-2',
    title: 'Campus Recruitment Drive',
    tag: 'PLACEMENT',
    category: 'Placements',
    dateFormatted: '12 Oct 2026 • 11:00 AM',
    imageSrc: '/images/placement_drive.jpg',
  },
  {
    id: 'bm-3',
    title: 'Mid Sem Exam Schedule',
    tag: 'ACADEMIC',
    category: 'Academic',
    dateFormatted: '12 Oct 2026 • 9:30 AM',
    imageSrc: '/images/mid_sem_exam.jpg',
  },
  {
    id: 'bm-4',
    title: 'Workshop on AI & ML',
    tag: 'WORKSHOP',
    category: 'Workshops',
    dateFormatted: '20 Oct 2026 • 2:00 PM',
    imageSrc: '/images/ai_workshop.jpg',
  },
  {
    id: 'bm-5',
    title: 'Library Timings Update',
    tag: 'GENERAL',
    category: 'General',
    dateFormatted: '11 Oct 2026 • 4:20 PM',
    imageSrc: '/images/library_books.jpg',
  },
]

export function StudentActivityView() {
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
  const [activeTab, setActiveTab] = useState('Overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false)
  const [eventsSubTab, setEventsSubTab] = useState<'Upcoming' | 'Attended' | 'Interested'>('Upcoming')
  const [streakModalOpen, setStreakModalOpen] = useState(false)

  // Live bookmarks collection
  const [bookmarks, setBookmarks] = useState<SavedBookmarkItem[]>(initialBookmarks)

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

  // Toggle bookmark in list
  const handleRemoveBookmark = (bmId: string, bmTitle: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== bmId))
    toggleSave(bmId)
    addToast({
      type: 'info',
      title: 'Removed from Bookmarks',
      message: `"${bmTitle}" removed from your saved bookmarks.`,
    })
  }

  // Filtered Activity List based on active pill
  const filteredActivity = useMemo(() => {
    let list = [...initialRecentActivity]
    if (activeTab === 'My Interactions') {
      list = list.filter((a) => a.type === 'like' || a.type === 'comment' || a.type === 'register')
    } else if (activeTab === 'Bookmarks') {
      list = list.filter((a) => a.type === 'bookmark')
    } else if (activeTab === 'Events') {
      list = list.filter((a) => a.category === 'events' || a.type === 'register')
    } else if (activeTab === 'Placements') {
      list = list.filter((a) => a.category === 'placement')
    } else if (activeTab === 'Academic') {
      list = list.filter((a) => a.category === 'academic')
    } else if (activeTab === 'Comments') {
      list = list.filter((a) => a.type === 'comment')
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter((a) => a.title.toLowerCase().includes(q) || (a.subtitle && a.subtitle.toLowerCase().includes(q)))
    }

    return list
  }, [activeTab, searchQuery])

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
          {/* Brand Logo */}
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
                      <div style={{ fontSize: 12, fontWeight: 800 }}>⚡ Reading Streak Milestone</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>You completed 7 consecutive days on campus!</div>
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

              {/* 3. My Activity (ACTIVE) */}
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
                <User width={17} height={17} />
                <span>My Activity</span>
              </button>

              <div style={{ height: 1, backgroundColor: '#222222', margin: '6px 8px' }} />

              {/* 4. Events */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Events')
                  addToast({ type: 'info', title: 'Events Filter', message: 'Showing your event interactions.' })
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeTab === 'Events' ? '#D5FF38' : 'transparent',
                  color: activeTab === 'Events' ? '#111111' : '#9CA3AF',
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
                onClick={() => {
                  setActiveTab('Academic')
                  addToast({ type: 'info', title: 'Academic Filter', message: 'Showing your academic updates history.' })
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeTab === 'Academic' ? '#D5FF38' : 'transparent',
                  color: activeTab === 'Academic' ? '#111111' : '#9CA3AF',
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
                onClick={() => {
                  setActiveTab('Overview')
                }}
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
                onClick={() => setActiveTab('Bookmarks')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeTab === 'Bookmarks' ? '#D5FF38' : 'transparent',
                  color: activeTab === 'Bookmarks' ? '#111111' : '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Bookmark width={17} height={17} />
                <span>Bookmarked</span>
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
                  {bookmarks.length}
                </span>
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
              CENTER COLUMN: MY ACTIVITY MAIN FEED
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
              <span>YOUR JOURNEY • ENGAGEMENT • IMPACT</span>
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
                  My Activity
                </h1>
                <p
                  style={{
                    fontSize: 15,
                    color: '#6B7280',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Your personalised space to track everything you&apos;ve been up to on CampusVoice.
                </p>
              </div>

              {/* Acid-Lime Green Sticker: STAY UPDATED STAY AHEAD */}
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
                    STAY
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                    UPDATED
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                    STAY AHEAD
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Pills Row: Overview, My Interactions, Bookmarks, Events, Placements, Academic, Comments */}
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
                'Overview',
                'My Interactions',
                'Bookmarks',
                'Events',
                'Placements',
                'Academic',
                'Comments',
              ].map((pill) => {
                const isActive = activeTab === pill
                return (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => setActiveTab(pill)}
                    style={{
                      backgroundColor: isActive ? '#111111' : '#FFFFFF',
                      color: isActive ? '#D5FF38' : '#111111',
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
                    {pill}
                  </button>
                )
              })}
            </div>

            {/* ====================================================
                4 STAT SUMMARY METRIC CARDS (Horizontal Row)
               ==================================================== */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 14,
                marginBottom: 24,
              }}
            >
              {/* Card 1: Notices Read (Acid-Lime Green) */}
              <div
                style={{
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  borderRadius: 20,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(213,255,56,0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: '#111111',
                      color: '#D5FF38',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileText width={16} height={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>42</div>
                    <div style={{ fontSize: 11, fontWeight: 800, marginTop: 2 }}>Notices Read</div>
                  </div>
                </div>

                {/* Trend Wave */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 800 }}>
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                    <path d="M1 9C6 9 8 3 13 3C18 3 20 8 26 8C32 8 34 2 39 2" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>+12% this month</span>
                </div>
              </div>

              {/* Card 2: Likes Given (Pink) */}
              <div
                style={{
                  backgroundColor: '#FA78B9',
                  color: '#111111',
                  borderRadius: 20,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(250,120,185,0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: '#111111',
                      color: '#FA78B9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Heart width={16} height={16} fill="#FA78B9" />
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>18</div>
                    <div style={{ fontSize: 11, fontWeight: 800, marginTop: 2 }}>Likes Given</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 800 }}>
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                    <path d="M1 10C6 10 9 4 14 4C19 4 21 8 27 8C33 8 35 3 39 3" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>+8% this month</span>
                </div>
              </div>

              {/* Card 3: Comments (Electric Blue) */}
              <div
                style={{
                  backgroundColor: '#3C5BFF',
                  color: '#FFFFFF',
                  borderRadius: 20,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(60,91,255,0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MessageSquare width={16} height={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>7</div>
                    <div style={{ fontSize: 11, fontWeight: 800, marginTop: 2 }}>Comments</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 800 }}>
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                    <path d="M1 11C6 11 10 2 15 2C20 2 22 7 28 7C34 7 35 1 39 1" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>+75% this month</span>
                </div>
              </div>

              {/* Card 4: Bookmarked (Pitch Black) */}
              <div
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  borderRadius: 20,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: '#D5FF38',
                      color: '#111111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Bookmark width={16} height={16} fill="#111111" />
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{bookmarks.length + 7}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, marginTop: 2 }}>Bookmarked</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 800 }}>
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                    <path d="M1 9C6 9 8 4 13 4C18 4 20 8 26 8C32 8 34 2 39 2" stroke="#D5FF38" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span style={{ color: '#D5FF38' }}>+20% this month</span>
                </div>
              </div>
            </div>

            {/* ====================================================
                2-COLUMN ACTIVITY BREAKDOWN
                Left: Recent Activity | Right: Your Bookmarks
               ==================================================== */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 20,
              }}
            >
              {/* Left Column: Recent Activity */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  padding: '20px',
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
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText width={17} height={17} color="#111111" />
                    <span style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>
                      Recent Activity
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Overview')}
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

                {/* Timeline Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {filteredActivity.map((act) => {
                    // Decide icon and color
                    let iconBg = '#F3F4F6'
                    let iconColor = '#111111'
                    let IconComponent = Eye

                    if (act.type === 'comment') {
                      iconBg = '#FCE7F3'
                      iconColor = '#FA78B9'
                      IconComponent = MessageSquare
                    } else if (act.type === 'bookmark') {
                      iconBg = '#ECFCCB'
                      iconColor = '#84CC16'
                      IconComponent = Bookmark
                    } else if (act.type === 'like') {
                      iconBg = '#FCE7F3'
                      iconColor = '#EC4899'
                      IconComponent = Heart
                    } else if (act.type === 'register') {
                      iconBg = '#111111'
                      iconColor = '#FFFFFF'
                      IconComponent = Calendar
                    } else if (act.type === 'read') {
                      iconBg = '#DBEAFE'
                      iconColor = '#3B82F6'
                      IconComponent = Eye
                    }

                    return (
                      <div
                        key={act.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 12,
                          paddingBottom: 10,
                          borderBottom: '1px solid #F3F4F6',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: iconBg,
                              color: iconColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          >
                            <IconComponent width={14} height={14} />
                          </div>

                          <div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#111111', lineHeight: 1.3 }}>
                              {act.title}
                            </div>
                            {act.subtitle && (
                              <div style={{ fontSize: 11, color: '#6B7280', fontStyle: 'italic', marginTop: 2 }}>
                                {act.subtitle}
                              </div>
                            )}
                          </div>
                        </div>

                        <span style={{ fontSize: 10, color: '#9CA3AF', whiteSpace: 'nowrap', fontWeight: 600 }}>
                          {act.timeAgo}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Your Bookmarks */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  padding: '20px',
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
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Bookmark width={17} height={17} color="#111111" />
                    <span style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>
                      Your Bookmarks
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Bookmarks')}
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

                {/* Bookmark Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        padding: '8px 10px',
                        borderRadius: 16,
                        backgroundColor: '#F9FAFB',
                        border: '1px solid #F3F4F6',
                        transition: 'transform 0.12s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Thumbnail */}
                        <div
                          style={{
                            width: 50,
                            height: 44,
                            borderRadius: 12,
                            overflow: 'hidden',
                            position: 'relative',
                            flexShrink: 0,
                            border: '1px solid #E5E7EB',
                          }}
                        >
                          <Image
                            src={bm.imageSrc}
                            alt={bm.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>

                        <div>
                          <span
                            style={{
                              backgroundColor: '#E5E7EB',
                              color: '#374151',
                              borderRadius: 9999,
                              padding: '2px 8px',
                              fontSize: 9,
                              fontWeight: 900,
                              textTransform: 'uppercase',
                            }}
                          >
                            {bm.tag}
                          </span>
                          <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', marginTop: 2 }}>
                            {bm.title}
                          </div>
                          <div style={{ fontSize: 10, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                            <Clock width={10} height={10} />
                            <span>{bm.dateFormatted}</span>
                          </div>
                        </div>
                      </div>

                      {/* Blue Bookmark Ribbon Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveBookmark(bm.id, bm.title)}
                        style={{
                          backgroundColor: '#3C5BFF',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 8,
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(60,91,255,0.3)',
                        }}
                        title="Remove bookmark"
                      >
                        <Bookmark width={13} height={13} fill="#FFFFFF" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* ======================================================
              RIGHT COLUMN: READING STREAK, ENGAGEMENT & EVENTS
             ====================================================== */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* WIDGET 1: Reading Streak (Pitch-Black Card) */}
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
                  <span style={{ fontSize: 20 }}>🔥</span>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', display: 'block' }}>
                      Reading Streak
                    </span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                      7 Days
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStreakModalOpen(true)}
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

              <p style={{ margin: '0 0 14px', fontSize: 11, color: '#9CA3AF' }}>
                Keep up the great habit!
              </p>

              {/* Day Circles Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                {[
                  { day: 'Mon', done: true },
                  { day: 'Tue', done: true },
                  { day: 'Wed', done: true },
                  { day: 'Thu', done: true },
                  { day: 'Fri', done: true },
                  { day: 'Sat', done: true },
                  { day: 'Sun', done: false },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: d.done ? '#D5FF38' : '#282828',
                        color: d.done ? '#111111' : '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 900,
                      }}
                    >
                      {d.done ? '✓' : ''}
                    </div>
                    <span style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 700 }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WIDGET 2: Your Engagement (Bar Chart Card) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: '18px 16px',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock width={16} height={16} color="#111111" />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>
                    Your Engagement
                  </span>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  This Month <ChevronDown width={12} height={12} />
                </span>
              </div>

              {/* Engagement Bar Chart */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  height: 120,
                  padding: '0 10px',
                  borderBottom: '1px solid #E5E7EB',
                  paddingBottom: 10,
                }}
              >
                {/* Bar 1: Read 42 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 900 }}>42</span>
                  <div
                    style={{
                      width: 24,
                      height: 84,
                      backgroundColor: '#D5FF38',
                      borderRadius: 6,
                    }}
                  />
                </div>

                {/* Bar 2: Likes 18 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 900 }}>18</span>
                  <div
                    style={{
                      width: 24,
                      height: 48,
                      backgroundColor: '#FA78B9',
                      borderRadius: 6,
                    }}
                  />
                </div>

                {/* Bar 3: Comments 7 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 900 }}>7</span>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#3C5BFF',
                      borderRadius: 6,
                    }}
                  />
                </div>

                {/* Bar 4: Bookmarks 12 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 900 }}>12</span>
                  <div
                    style={{
                      width: 24,
                      height: 36,
                      backgroundColor: '#111111',
                      borderRadius: 6,
                    }}
                  />
                </div>

                {/* Bar 5: Events 5 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 900 }}>5</span>
                  <div
                    style={{
                      width: 24,
                      height: 18,
                      backgroundColor: '#D1D5DB',
                      borderRadius: 6,
                    }}
                  />
                </div>
              </div>

              {/* Chart Labels */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 4px 0',
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#6B7280',
                }}
              >
                <span>Read</span>
                <span>Likes</span>
                <span>Comments</span>
                <span>Bookmarks</span>
                <span>Events</span>
              </div>
            </div>

            {/* WIDGET 3: Your Events Card */}
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
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star width={16} height={16} color="#111111" />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>
                    Your Events
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/student/calendar')}
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

              {/* Tabs: Upcoming (active lime), Attended, Interested */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {(['Upcoming', 'Attended', 'Interested'] as const).map((tab) => {
                  const isActive = eventsSubTab === tab
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setEventsSubTab(tab)}
                      style={{
                        flex: 1,
                        backgroundColor: isActive ? '#D5FF38' : '#F3F4F6',
                        color: '#111111',
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

              {/* 3 Event Rows */}
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
                      padding: '6px 8px',
                      borderRadius: 12,
                      backgroundColor: '#F9FAFB',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          textAlign: 'center',
                          minWidth: 30,
                          lineHeight: 1.1,
                          paddingRight: 6,
                          borderRight: '1px solid #E5E7EB',
                        }}
                      >
                        <div style={{ fontSize: 8, fontWeight: 900, color: '#6B7280' }}>{ev.month}</div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>{ev.day}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#111111' }}>{ev.title}</div>
                        <div style={{ fontSize: 9, color: '#6B7280' }}>{ev.meta}</div>
                      </div>
                    </div>
                    <ChevronRight width={12} height={12} color="#9CA3AF" />
                  </div>
                ))}
              </div>
            </div>

            {/* WIDGET 4: Quick Actions (Pitch-Black Card) */}
            <div
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 24,
                padding: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Sparkles width={16} height={16} color="#D5FF38" />
                <span style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>
                  Quick Actions
                </span>
              </div>

              {/* 2x2 Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => router.push('/student/explore')}
                  style={{
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    borderRadius: 14,
                    padding: '10px 8px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    fontWeight: 900,
                    fontSize: 10,
                  }}
                >
                  <Calendar width={14} height={14} />
                  <span>Browse Events</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/student/placements')}
                  style={{
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    borderRadius: 14,
                    padding: '10px 8px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    fontWeight: 900,
                    fontSize: 10,
                  }}
                >
                  <Briefcase width={14} height={14} />
                  <span>View Placements</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/student')}
                  style={{
                    backgroundColor: '#3C5BFF',
                    color: '#FFFFFF',
                    borderRadius: 14,
                    padding: '10px 8px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    fontWeight: 900,
                    fontSize: 10,
                  }}
                >
                  <GraduationCap width={14} height={14} />
                  <span>Academic Notices</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('Bookmarks')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#111111',
                    borderRadius: 14,
                    padding: '10px 8px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    fontWeight: 900,
                    fontSize: 10,
                  }}
                >
                  <Bookmark width={14} height={14} />
                  <span>My Bookmarks</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ========================================================
          MODAL: READING STREAK DETAILS
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
              You have read campus announcements and engaged with verified events 7 days in a row!
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
