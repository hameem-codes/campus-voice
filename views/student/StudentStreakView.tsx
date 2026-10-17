'use client'

import React, { useState, useMemo } from 'react'
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
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  Clock,
  X,
  Trophy,
  Check,
  Calendar,
  Share2,
  BookOpen,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart2,
  Gift,
  Layers,
  Timer,
  CheckCircle2,
  FileText,
  TrendingUp,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface RecentReadItem {
  id: string
  title: string
  excerpt: string
  content: string
  category: 'Academic' | 'Events' | 'Placements' | 'General'
  tag: string
  tagColor: { bg: string; text: string }
  dateFormatted: string
  readTime: string
  department: string
  imageSrc: string
}

const initialRecentReads: RecentReadItem[] = [
  {
    id: 'streak-read-mid-sem',
    title: 'Mid Semester Exam Schedule',
    excerpt: 'The mid semester examination schedule for all departments has been released.',
    content:
      'All undergraduate and postgraduate students are hereby notified that the Mid-Semester Examinations for the Odd Semester 2026 will commence from October 14, 2026. Detailed department timetables and seating plans have been published on the student portal. Hall tickets must be downloaded and verified prior to entering examination halls.',
    category: 'Academic',
    tag: 'ACADEMIC',
    tagColor: { bg: '#D5FF38', text: '#111111' },
    dateFormatted: '12 Oct 2026',
    readTime: '5 min read',
    department: 'Examination Cell',
    imageSrc: '/images/campus_building.jpg',
  },
  {
    id: 'streak-read-garba-night',
    title: 'Garba Night',
    excerpt: 'Join us for a vibrant evening of music, dance and cultural celebration.',
    content:
      'The Cultural Committee invites all campus students, staff, and faculty to Garba Night 2026 at the Main College Grounds. Enjoy traditional dandiya beats, live musical performance by alumni bands, food trucks, and folk dance awards. Traditional attire is warmly encouraged. Gates open at 6:30 PM.',
    category: 'Events',
    tag: 'EVENT',
    tagColor: { bg: '#FA78B9', text: '#111111' },
    dateFormatted: '15 Oct 2026',
    readTime: '3 min read',
    department: 'Cultural Committee',
    imageSrc: '/images/garba_night.jpg',
  },
  {
    id: 'streak-read-google-drive',
    title: 'Google Campus Recruitment Drive',
    excerpt: 'Final year students can register for the upcoming Google placement drive.',
    content:
      'Google is conducting an on-campus hiring drive for Associate Software Engineer and Technical Solutions Engineer roles. Eligible branches: CSE, ISE, ECE with CGPA 7.5+. Online coding assessments will take place on Saturday, followed by technical interviews at the Placement Cell Auditorium.',
    category: 'Placements',
    tag: 'PLACEMENT',
    tagColor: { bg: '#DBEAFE', text: '#1D4ED8' },
    dateFormatted: '20 Oct 2026',
    readTime: '4 min read',
    department: 'Placement Cell',
    imageSrc: '/images/recruitment_interview.jpg',
  },
  {
    id: 'streak-read-library-timings',
    title: 'Library Timings Update',
    excerpt: 'The library will remain open till 10 PM during exam week.',
    content:
      'In view of mid-semester exams, the Central Library reading halls, digital knowledge resources, and quiet study zones will extend opening hours until 10:00 PM on all weekdays and Saturdays. Reserve books and digital repositories will remain accessible to all registered students.',
    category: 'General',
    tag: 'GENERAL',
    tagColor: { bg: '#F3F4F6', text: '#374151' },
    dateFormatted: '11 Oct 2026',
    readTime: '2 min read',
    department: 'Library Committee',
    imageSrc: '/images/library_books.jpg',
  },
]

export function StudentStreakView() {
  const router = useRouter()
  const { savedIds, toggleSave, addToast, markAsRead } = useStore()

  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState<RecentReadItem | null>(null)
  const [readsList, setReadsList] = useState<RecentReadItem[]>(initialRecentReads)
  const [currentStreak, setCurrentStreak] = useState(7)
  const [noticesReadCount, setNoticesReadCount] = useState(48)
  const [totalReadingMinutes, setTotalReadingMinutes] = useState(24)

  // Calendar month state
  const [calendarMonth, setCalendarMonth] = useState('October 2026')

  // Weekdays status (Monday to Sunday)
  const weekDays = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: true },
    { day: 'Sun', completed: false },
  ]

  // Filtered recent reads by search query
  const filteredReads = useMemo(() => {
    if (!searchQuery.trim()) return readsList
    const q = searchQuery.toLowerCase()
    return readsList.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }, [readsList, searchQuery])

  // Handle read again
  const handleReadAgain = (item: RecentReadItem) => {
    setSelectedNotice(item)
    markAsRead(item.id)
    setNoticesReadCount((prev) => prev + 1)
    setTotalReadingMinutes((prev) => prev + 2)
    addToast({
      type: 'info',
      title: 'Reading Notice',
      message: `Opened "${item.title}". Streak updated!`,
    })
  }

  // Handle toggle bookmark
  const handleToggleBookmark = (item: RecentReadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    toggleSave(item.id)
    const isCurrentlySaved = savedIds.includes(item.id)
    addToast({
      type: isCurrentlySaved ? 'info' : 'success',
      title: isCurrentlySaved ? 'Bookmark Removed' : 'Notice Bookmarked',
      message: isCurrentlySaved
        ? `Removed "${item.title}" from saved items.`
        : `Saved "${item.title}" to your reading bookmarks.`,
    })
  }

  // Handle share
  const handleShare = (item: RecentReadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(
        typeof window !== 'undefined'
          ? `${window.location.origin}/student?notice=${item.id}`
          : item.title
      )
    }
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: `Shareable link for "${item.title}" copied to clipboard.`,
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F7',
        color: '#111111',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      <ToastContainer />

      {/* TOP BAR / NAVIGATION */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Left: Brand Logo & Tagline */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              backgroundColor: '#111111',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D5FF38',
              fontWeight: 900,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 18 }}>
              <div style={{ width: 3, height: 14, backgroundColor: '#D5FF38', borderRadius: 2 }} />
              <div style={{ width: 3, height: 18, backgroundColor: '#D5FF38', borderRadius: 2 }} />
              <div style={{ width: 3, height: 10, backgroundColor: '#D5FF38', borderRadius: 2 }} />
              <div style={{ width: 3, height: 16, backgroundColor: '#D5FF38', borderRadius: 2 }} />
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 950,
                letterSpacing: -0.5,
                color: '#111111',
                lineHeight: 1.1,
              }}
            >
              CampusVoice
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#6B7280',
                fontWeight: 600,
                letterSpacing: -0.2,
              }}
            >
              Your Campus. Your Voice.
            </div>
          </div>
        </Link>

        {/* Center: Search Pill with Keyboard Shortcut */}
        <div
          style={{
            flex: 1,
            maxWidth: 620,
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F3F4F6',
              borderRadius: 9999,
              padding: '8px 18px',
              border: '1px solid transparent',
              transition: 'all 0.2s ease',
              gap: 10,
            }}
          >
            <Search width={16} height={16} color="#6B7280" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements, events, placements, academic notices..."
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
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X width={14} height={14} color="#6B7280" />
              </button>
            )}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                padding: '2px 6px',
                fontSize: 10,
                fontWeight: 800,
                color: '#6B7280',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Notification Bell & Profile Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Notification Button */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Bell width={18} height={18} color="#111111" />
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 900,
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                }}
              >
                3
              </div>
            </button>

            {isNotificationOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 48,
                  width: 320,
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  zIndex: 50,
                  border: '1px solid #222222',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: 13 }}>Notifications (3)</span>
                  <span style={{ fontSize: 11, color: '#D5FF38', cursor: 'pointer' }}>
                    Mark all read
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div
                    style={{
                      padding: '8px 10px',
                      backgroundColor: '#1A1A1A',
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#D5FF38' }}>🔥 Streak Goal Reached!</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11 }}>
                      You kept a 7-day reading streak! Claim your reward.
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '8px 10px',
                      backgroundColor: '#1A1A1A',
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>Mid-Semester Timetable</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11 }}>
                      Examination Cell updated room schedules.
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '8px 10px',
                      backgroundColor: '#1A1A1A',
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>Google Drive Registration</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11 }}>
                      Registration closes tomorrow at 5 PM.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 9999,
                padding: '4px 12px 4px 6px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Image
                  src="/images/mateen_avatar.jpg"
                  alt="Mateen"
                  width={32}
                  height={32}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', lineHeight: 1.1 }}>
                  Hi, Mateen
                </div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                  Student ▾
                </div>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 48,
                  width: 200,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 50,
                  padding: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <button
                  type="button"
                  onClick={() => router.push('/student/profile')}
                  style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  Student Profile
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/faculty')}
                  style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  Switch to Faculty
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  Switch to Admin
                </button>
                <div style={{ height: 1, backgroundColor: '#E5E7EB', margin: '4px 0' }} />
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    borderRadius: 8,
                    color: '#EF4444',
                    cursor: 'pointer',
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3-COLUMN MAIN LAYOUT */}
      <div
        style={{
          maxWidth: 1540,
          margin: '0 auto',
          padding: '24px 20px',
          display: 'grid',
          gridTemplateColumns: '220px minmax(0, 1fr) 320px',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* COLUMN 1: LEFT DARK SIDEBAR */}
        <aside
          style={{
            position: 'sticky',
            top: 84,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Main Navigation Card */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 24,
              padding: '16px 10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
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
              </button>

              {/* 9. Reading Streak (ACTIVE: Bright Acid-Lime Pill) */}
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
                  fontWeight: 950,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 3px 10px rgba(213,255,56,0.35)',
                }}
              >
                <Timer width={17} height={17} strokeWidth={2.5} />
                <span>Reading Streak</span>
              </button>
            </nav>
          </div>

          {/* Bottom Streak Widget */}
          <div
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              addToast({
                type: 'info',
                title: 'Streak Active',
                message: 'You have a 7-day reading streak! Keep going!',
              })
            }}
            style={{
              backgroundColor: '#111111',
              borderRadius: 20,
              padding: '14px 16px',
              border: '1px solid #222222',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                🔥
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF' }}>
                  7 Day Streak
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                  Keep up with campus!
                </div>
              </div>
            </div>
            <ChevronRight width={16} height={16} color="#6B7280" />
          </div>
        </aside>

        {/* COLUMN 2: CENTER MAIN STREAK CONTENT */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          {/* Top Tag Pill + Hero Title + Sticker Badge */}
          <div style={{ position: 'relative', paddingTop: 6 }}>
            {/* Tag Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 9999,
                padding: '4px 12px',
                marginBottom: 14,
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <GraduationCap width={14} height={14} color="#111111" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: '#111111',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                }}
              >
                READ • LEARN • STAY UPDATED • BUILD HABITS
              </span>
            </div>

            {/* Title with Doodle Rays & Tilted Acid-Lime Sticker */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  {/* Radiating Doodle Rays above Streak */}
                  <svg
                    width="42"
                    height="28"
                    viewBox="0 0 42 28"
                    fill="none"
                    style={{
                      position: 'absolute',
                      top: -18,
                      right: 18,
                    }}
                  >
                    <path
                      d="M6 22L1 12"
                      stroke="#111111"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M21 18L21 4"
                      stroke="#111111"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M36 22L41 12"
                      stroke="#111111"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  <h1
                    style={{
                      fontSize: 48,
                      fontWeight: 950,
                      letterSpacing: -1.2,
                      color: '#111111',
                      margin: '0 0 6px 0',
                      lineHeight: 1.05,
                    }}
                  >
                    Reading Streak
                  </h1>
                </div>

                <p
                  style={{
                    fontSize: 14,
                    color: '#6B7280',
                    fontWeight: 600,
                    margin: '4px 0 0 0',
                  }}
                >
                  Stay consistent, be informed, and never miss what matters on campus.
                </p>
              </div>

              {/* Tilted Neo-Brutalist Acid-Lime Sticker Tag */}
              <div
                style={{
                  transform: 'rotate(7deg)',
                  position: 'relative',
                  marginTop: -10,
                  marginRight: 8,
                }}
              >
                {/* Two cute doodle lines above sticker */}
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: 20,
                    display: 'flex',
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 2,
                      height: 10,
                      backgroundColor: '#111111',
                      transform: 'rotate(-25deg)',
                    }}
                  />
                  <div
                    style={{
                      width: 2,
                      height: 10,
                      backgroundColor: '#111111',
                      transform: 'rotate(-25deg)',
                    }}
                  />
                </div>

                <div
                  style={{
                    backgroundColor: '#D5FF38',
                    padding: '8px 14px',
                    borderRadius: 14,
                    border: '2px solid #111111',
                    boxShadow: '3px 3px 0px #111111',
                    textAlign: 'center',
                    cursor: 'default',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 950,
                      color: '#111111',
                      lineHeight: 1.15,
                      letterSpacing: '0.2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    SMALL
                    <br />
                    READS
                    <br />
                    BIGGER
                    <br />
                    OPPORTUNITIES.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HERO STREAK BANNER (PITCH-BLACK NEO-BRUTALIST CARD) */}
          <section
            style={{
              backgroundColor: '#111111',
              borderRadius: 28,
              padding: '30px 32px',
              color: '#FFFFFF',
              boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #222222',
            }}
          >
            {/* Subtle background glow */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '25%',
                transform: 'translate(50%, -50%)',
                width: 320,
                height: 320,
                background:
                  'radial-gradient(circle, rgba(251, 146, 60, 0.22) 0%, rgba(239, 68, 68, 0.08) 50%, transparent 75%)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 0.9fr',
                gap: 20,
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Left Column: Badge, Streak Title, Description, Keep Reading Button, Weekly Tracker */}
              <div>
                {/* Hot Pink "You're On a Streak" Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    padding: '4px 12px',
                    borderRadius: 9999,
                    fontSize: 11,
                    fontWeight: 950,
                    letterSpacing: '0.4px',
                    marginBottom: 14,
                  }}
                >
                  <span>🔥</span>
                  <span>YOU'RE ON A STREAK</span>
                </div>

                {/* Big Streak Number Heading */}
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 950,
                    letterSpacing: -1,
                    lineHeight: 1.05,
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 4,
                  }}
                >
                  <span style={{ color: '#D5FF38', fontSize: 48 }}>7'</span>
                  <span>Day Streak!</span>
                </div>

                {/* Subtext description */}
                <p
                  style={{
                    fontSize: 13,
                    color: '#9CA3AF',
                    lineHeight: 1.5,
                    maxWidth: 320,
                    margin: '0 0 20px 0',
                    fontWeight: 500,
                  }}
                >
                  Amazing! You've been keeping up with campus updates for 7 days in a row. Keep going!
                </p>

                {/* Keep Reading CTA button */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('recent-reads-section')
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' })
                    } else if (readsList[0]) {
                      handleReadAgain(readsList[0])
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    padding: '10px 22px',
                    borderRadius: 9999,
                    fontWeight: 950,
                    fontSize: 13,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(213,255,56,0.35)',
                    transition: 'transform 0.15s ease',
                    marginBottom: 24,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <span>Keep Reading</span>
                  <ArrowRight width={15} height={15} strokeWidth={2.8} />
                </button>

                {/* Weekly Progress Tracker (Mon - Sun) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {weekDays.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          backgroundColor: item.completed ? '#D5FF38' : '#222222',
                          color: '#111111',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 900,
                          border: item.completed ? 'none' : '1px solid #333333',
                        }}
                      >
                        {item.completed && <Check width={14} height={14} strokeWidth={3} />}
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: item.completed ? '#D1D5DB' : '#6B7280',
                        }}
                      >
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Column: 3D Glowing Fire Flame with sparkle rays */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '10px 0',
                }}
              >
                {/* Decorative Spark Lines around Flame */}
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 2.5,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 2,
                      transform: 'rotate(-30deg)',
                    }}
                  />
                  <div
                    style={{
                      width: 10,
                      height: 2.5,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 2,
                      transform: 'rotate(20deg)',
                      marginLeft: 6,
                    }}
                  />
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: 24,
                    left: 20,
                    width: 12,
                    height: 2.5,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 2,
                    transform: 'rotate(25deg)',
                  }}
                />

                {/* 3D Glossy Flame SVG with layered radial gradients & smooth clay finish */}
                <div
                  style={{
                    position: 'relative',
                    width: 180,
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter: 'drop-shadow(0 14px 28px rgba(249, 115, 22, 0.45))',
                  }}
                >
                  <svg
                    width="170"
                    height="190"
                    viewBox="0 0 170 190"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Outer flame gradient (warm crimson to deep fiery orange) */}
                      <linearGradient id="flameOuter" x1="85" y1="10" x2="85" y2="185" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FF7A00" />
                        <stop offset="45%" stopColor="#FF3D00" />
                        <stop offset="100%" stopColor="#DD1144" />
                      </linearGradient>

                      {/* Middle flame gradient (vibrant orange-yellow) */}
                      <linearGradient id="flameMid" x1="85" y1="40" x2="85" y2="175" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFD000" />
                        <stop offset="55%" stopColor="#FF8800" />
                        <stop offset="100%" stopColor="#FF4400" />
                      </linearGradient>

                      {/* Inner heart gradient (bright sunburst yellow) */}
                      <linearGradient id="flameCore" x1="85" y1="80" x2="85" y2="165" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFF7B2" />
                        <stop offset="60%" stopColor="#FFC800" />
                        <stop offset="100%" stopColor="#FF7A00" />
                      </linearGradient>

                      {/* Specular 3D rim highlight */}
                      <linearGradient id="specularGlow" x1="40" y1="20" x2="90" y2="120" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#FFAA00" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#FF4400" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Outer stylized 3D flame body */}
                    <path
                      d="M85 8C88 38 108 52 120 70C134 91 144 114 141 138C137 165 114 186 85 186C56 186 33 165 29 138C26 112 36 88 52 68C65 52 82 35 85 8Z"
                      fill="url(#flameOuter)"
                    />

                    {/* Right side 3D volume curve */}
                    <path
                      d="M110 50C125 70 148 98 140 134C134 162 112 184 85 186C105 183 125 165 129 140C134 112 122 88 110 50Z"
                      fill="#C8102E"
                      opacity="0.45"
                    />

                    {/* Middle layered tongue of fire */}
                    <path
                      d="M85 36C89 58 102 72 112 88C123 105 128 122 125 142C121 165 105 178 85 178C65 178 49 165 45 142C42 122 47 105 58 88C68 72 81 58 85 36Z"
                      fill="url(#flameMid)"
                    />

                    {/* Inner glowing bright yellow core */}
                    <path
                      d="M85 70C88 88 98 98 104 112C110 125 112 138 108 152C104 166 94 172 85 172C76 172 66 166 62 152C58 138 60 125 66 112C72 98 82 88 85 70Z"
                      fill="url(#flameCore)"
                    />

                    {/* 3D clay glossy highlight on upper left curve */}
                    <path
                      d="M62 65C52 82 45 104 47 126C48 110 54 94 66 80C74 71 80 58 83 45C76 52 68 58 62 65Z"
                      fill="url(#specularGlow)"
                    />

                    {/* Hot glossy droplet reflection */}
                    <ellipse cx="68" cy="98" rx="7" ry="14" transform="rotate(-18 68 98)" fill="#FFFFFF" opacity="0.35" />
                  </svg>
                </div>
              </div>

              {/* Right Column inside Hero: Current Streak Pill & Longest Streak Pill */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Current Streak Box */}
                <div
                  style={{
                    backgroundColor: '#1C1C1E',
                    borderRadius: 20,
                    border: '1px solid #2C2C2E',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: '#9CA3AF',
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    Current Streak
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 40,
                          fontWeight: 950,
                          color: '#FFFFFF',
                          lineHeight: 1,
                          letterSpacing: -1,
                        }}
                      >
                        {currentStreak}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: '#E5E7EB',
                          fontWeight: 800,
                          marginTop: 2,
                        }}
                      >
                        Days
                      </div>
                    </div>
                    <div style={{ fontSize: 32 }}>🔥</div>
                  </div>
                </div>

                {/* Longest Streak Box */}
                <div
                  style={{
                    backgroundColor: '#1C1C1E',
                    borderRadius: 20,
                    border: '1px solid #2C2C2E',
                    padding: '14px 20px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: '#9CA3AF',
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    Longest Streak
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 16,
                      fontWeight: 950,
                      color: '#FFFFFF',
                    }}
                  >
                    <span>🏆</span>
                    <span>21 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RECENT READS SECTION */}
          <section id="recent-reads-section">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 950,
                  letterSpacing: -0.4,
                  color: '#111111',
                  margin: 0,
                }}
              >
                Recent Reads
              </h2>
              <button
                type="button"
                onClick={() => router.push('/student')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#111111',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>View All</span>
                <ArrowRight width={14} height={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* List of Recent Read Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filteredReads.map((item) => {
                const isSaved = savedIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => handleReadAgain(item)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 20,
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#111111'
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Thumbnail Image */}
                    <div
                      style={{
                        width: 90,
                        height: 70,
                        borderRadius: 14,
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Center Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Category Tag */}
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 10,
                          fontWeight: 900,
                          backgroundColor: item.tagColor.bg,
                          color: item.tagColor.text,
                          padding: '2px 8px',
                          borderRadius: 999,
                          letterSpacing: '0.4px',
                          marginBottom: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.tag}
                      </span>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 950,
                          color: '#111111',
                          margin: '2px 0 4px 0',
                          lineHeight: 1.25,
                        }}
                      >
                        {item.title}
                      </h3>

                      {/* Excerpt */}
                      <p
                        style={{
                          fontSize: 12,
                          color: '#6B7280',
                          margin: '0 0 6px 0',
                          lineHeight: 1.4,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.excerpt}
                      </p>

                      {/* Metadata Row */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          fontSize: 11,
                          color: '#6B7280',
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar width={12} height={12} />
                          <span>{item.dateFormatted}</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock width={12} height={12} />
                          <span>{item.readTime}</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Folder width={12} height={12} />
                          <span>{item.department}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        flexShrink: 0,
                      }}
                    >
                      {/* Read Again Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReadAgain(item)
                        }}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          padding: '7px 16px',
                          borderRadius: 9999,
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#111111',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#111111'
                          e.currentTarget.style.color = '#FFFFFF'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF'
                          e.currentTarget.style.color = '#111111'
                        }}
                      >
                        Read Again
                      </button>

                      {/* Bookmark Icon Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(item, e)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          backgroundColor: isSaved ? '#111111' : '#F9FAFB',
                          border: '1px solid',
                          borderColor: isSaved ? '#111111' : '#E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: isSaved ? '#D5FF38' : '#6B7280',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Bookmark
                          width={15}
                          height={15}
                          fill={isSaved ? '#D5FF38' : 'none'}
                          strokeWidth={2.2}
                        />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </main>

        {/* COLUMN 3: RIGHT SIDEBAR WIDGETS */}
        <aside
          style={{
            position: 'sticky',
            top: 84,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* WIDGET 1: YOUR READING STATS (ACID-LIME HEADER) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              border: '1px solid #E5E7EB',
            }}
          >
            {/* Bright Acid-Lime Header Bar */}
            <div
              style={{
                backgroundColor: '#D5FF38',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart2 width={17} height={17} color="#111111" strokeWidth={2.5} />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Your Reading Stats
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push('/student/activity')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 11,
                  fontWeight: 900,
                  color: '#111111',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>View All</span>
                <ArrowRight width={12} height={12} strokeWidth={2.5} />
              </button>
            </div>

            {/* 2x2 Metric Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                padding: 12,
              }}
            >
              {/* Stat 1: 48 Notices Read */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#E0F2FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0284C7',
                    flexShrink: 0,
                  }}
                >
                  <BookOpen width={16} height={16} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 950,
                        color: '#111111',
                        lineHeight: 1.1,
                      }}
                    >
                      {noticesReadCount}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 900,
                        color: '#16A34A',
                        backgroundColor: '#DCFCE7',
                        padding: '1px 5px',
                        borderRadius: 4,
                      }}
                    >
                      ↑ 12%
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Notices Read
                  </div>
                </div>
              </div>

              {/* Stat 2: 7 Current Streak */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#FCE7F3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DB2777',
                    flexShrink: 0,
                  }}
                >
                  <CalendarDays width={16} height={16} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 950,
                        color: '#111111',
                        lineHeight: 1.1,
                      }}
                    >
                      {currentStreak}
                    </span>
                    <span style={{ fontSize: 13 }}>🔥</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Current Streak
                  </div>
                </div>
              </div>

              {/* Stat 3: 24 min Total Reading Time */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7C3AED',
                    flexShrink: 0,
                  }}
                >
                  <Clock width={16} height={16} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 950,
                        color: '#111111',
                        lineHeight: 1.1,
                      }}
                    >
                      {totalReadingMinutes} min
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Total Reading Time
                  </div>
                </div>
              </div>

              {/* Stat 4: 21 Longest Streak */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D97706',
                    flexShrink: 0,
                  }}
                >
                  <Target width={16} height={16} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 950,
                      color: '#111111',
                      lineHeight: 1.1,
                    }}
                  >
                    21
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Longest Streak
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 2: STREAK CALENDAR (PITCH-BLACK NEO-BRUTALIST CARD) */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 22,
              padding: '16px 14px',
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: '1px solid #222222',
            }}
          >
            {/* Header: Title and Month Selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarDays width={15} height={15} color="#FFFFFF" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#FFFFFF' }}>
                  Streak Calendar
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#D1D5DB' }}>
                  {calendarMonth}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth('September 2026')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9CA3AF',
                      cursor: 'pointer',
                      padding: 2,
                    }}
                  >
                    <ChevronLeft width={14} height={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth('October 2026')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      padding: 2,
                    }}
                  >
                    <ChevronRight width={14} height={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Days of Week Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 4,
                textAlign: 'center',
                fontSize: 10,
                color: '#6B7280',
                fontWeight: 800,
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

            {/* Calendar Days Matrix matching reference exactly */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 4,
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {/* Row 1 */}
              <div style={{ padding: '6px 0', color: '#4B5563' }}>27</div>
              <div style={{ padding: '6px 0', color: '#4B5563' }}>28</div>
              <div style={{ padding: '6px 0', color: '#4B5563' }}>29</div>
              <div style={{ padding: '6px 0', color: '#4B5563' }}>30</div>
              {/* Day 1 (Lime) */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 950,
                  }}
                >
                  1
                </div>
              </div>
              {/* Day 2 (Lime) */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 950,
                  }}
                >
                  2
                </div>
              </div>
              {/* Day 3 (Lime) */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 950,
                  }}
                >
                  3
                </div>
              </div>

              {/* Row 2 (Days 4 - 10, all Lime) */}
              {[4, 5, 6, 7, 8, 9].map((day) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: '#D5FF38',
                      color: '#111111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 950,
                    }}
                  >
                    {day}
                  </div>
                </div>
              ))}
              <div style={{ padding: '6px 0', color: '#9CA3AF' }}>10</div>

              {/* Row 3 (Day 11 Lime, Day 12 Today Pink, Day 13 gray, Day 14 Milestone Cyan Ring, 15-17 gray) */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 950,
                  }}
                >
                  11
                </div>
              </div>
              {/* Day 12 (Today: Pink Circle) */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 950,
                  }}
                >
                  12
                </div>
              </div>
              <div style={{ padding: '6px 0', color: '#9CA3AF' }}>13</div>
              {/* Day 14 (Milestone: Cyan Ring) */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '2px solid #06B6D4',
                    color: '#06B6D4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 950,
                  }}
                >
                  14
                </div>
              </div>
              <div style={{ padding: '6px 0', color: '#6B7280' }}>15</div>
              <div style={{ padding: '6px 0', color: '#6B7280' }}>16</div>
              <div style={{ padding: '6px 0', color: '#6B7280' }}>17</div>

              {/* Row 4 (Days 18 - 24) */}
              {[18, 19, 20, 21, 22, 23, 24].map((day) => (
                <div key={day} style={{ padding: '6px 0', color: '#6B7280' }}>
                  {day}
                </div>
              ))}

              {/* Row 5 (Days 25 - 31) */}
              {[25, 26, 27, 28, 29, 30, 31].map((day) => (
                <div key={day} style={{ padding: '6px 0', color: '#6B7280' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Legend */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 14,
                paddingTop: 12,
                borderTop: '1px solid #222222',
                fontSize: 9,
                fontWeight: 700,
                color: '#9CA3AF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#D5FF38',
                  }}
                />
                <span>Read Notice</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#FA78B9',
                  }}
                />
                <span>Today</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    border: '1.5px solid #06B6D4',
                  }}
                />
                <span>Streak Milestone</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#374151',
                  }}
                />
                <span>No Activity</span>
              </div>
            </div>
          </div>

          {/* WIDGET 3: STREAK REWARDS */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '16px 16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Gift width={16} height={16} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Streak Rewards
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  addToast({
                    type: 'info',
                    title: 'Rewards Claimed',
                    message: 'Your Day 7 certificate has been added to your profile!',
                  })
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 11,
                  fontWeight: 900,
                  color: '#111111',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>View All</span>
                <ArrowRight width={12} height={12} strokeWidth={2.5} />
              </button>
            </div>

            {/* Horizontal Milestone Progression Track */}
            <div style={{ position: 'relative', padding: '0 4px' }}>
              {/* Connecting Line */}
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 20,
                  right: 20,
                  height: 2,
                  backgroundColor: '#E5E7EB',
                  zIndex: 0,
                }}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Node 1: 3 Days Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#FED7AA',
                      color: '#EA580C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      boxShadow: '0 2px 6px rgba(234, 88, 12, 0.2)',
                    }}
                  >
                    🔥
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#111111', marginTop: 6 }}>
                    3 Days
                  </div>
                  <div style={{ fontSize: 9, color: '#6B7280', fontWeight: 600 }}>Badge</div>
                </div>

                {/* Node 2: 7 Days Certificate */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#D5FF38',
                      color: '#111111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      boxShadow: '0 2px 6px rgba(213,255,56,0.3)',
                    }}
                  >
                    🎁
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#111111', marginTop: 6 }}>
                    7 Days
                  </div>
                  <div style={{ fontSize: 9, color: '#6B7280', fontWeight: 600 }}>Certificate</div>
                </div>

                {/* Node 3: 14 Days Special Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#FCE7F3',
                      color: '#DB2777',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                    }}
                  >
                    🎁
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#111111', marginTop: 6 }}>
                    14 Days
                  </div>
                  <div style={{ fontSize: 9, color: '#6B7280', fontWeight: 600 }}>Special Badge</div>
                </div>

                {/* Node 4: 21 Days Surprise Reward */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#EDE9FE',
                      color: '#7C3AED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                    }}
                  >
                    🎁
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#111111', marginTop: 6 }}>
                    21 Days
                  </div>
                  <div style={{ fontSize: 9, color: '#6B7280', fontWeight: 600 }}>Surprise Reward</div>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 4: READING GOALS (PITCH-BLACK NEO-BRUTALIST CARD) */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 22,
              padding: '18px 16px',
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: '1px solid #222222',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Target width={16} height={16} color="#FFFFFF" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#FFFFFF' }}>
                  Reading Goals
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  addToast({
                    type: 'info',
                    title: 'Edit Reading Goals',
                    message: 'Goal customization will open in your preferences.',
                  })
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#9CA3AF',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>Edit Goals</span>
                <ArrowRight width={12} height={12} />
              </button>
            </div>

            {/* Goals List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Goal 1: Read at least 5 notices per week */}
              <div
                style={{
                  backgroundColor: '#18181B',
                  borderRadius: 14,
                  padding: '10px 12px',
                  border: '1px solid #27272A',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        backgroundColor: '#D5FF38',
                        color: '#111111',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BookOpen width={13} height={13} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#FFFFFF' }}>
                      Read at least 5 notices per week
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#9CA3AF' }}>4/5</span>
                </div>
                {/* Progress Bar */}
                <div
                  style={{
                    height: 5,
                    backgroundColor: '#27272A',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: '80%',
                      backgroundColor: '#D5FF38',
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>

              {/* Goal 2: Maintain a 7 day streak */}
              <div
                style={{
                  backgroundColor: '#18181B',
                  borderRadius: 14,
                  padding: '10px 12px',
                  border: '1px solid #27272A',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        backgroundColor: '#06B6D4',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Flame width={13} height={13} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#FFFFFF' }}>
                      Maintain a 7 day streak
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#06B6D4' }}>7/7</span>
                    <CheckCircle2 width={13} height={13} color="#06B6D4" strokeWidth={2.5} />
                  </div>
                </div>
                {/* Progress Bar */}
                <div
                  style={{
                    height: 5,
                    backgroundColor: '#27272A',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: '#06B6D4',
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>

              {/* Goal 3: Explore all categories */}
              <div
                style={{
                  backgroundColor: '#18181B',
                  borderRadius: 14,
                  padding: '10px 12px',
                  border: '1px solid #27272A',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        backgroundColor: '#FA78B9',
                        color: '#111111',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Layers width={13} height={13} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#FFFFFF' }}>
                      Explore all categories
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#9CA3AF' }}>3/6</span>
                </div>
                {/* Progress Bar */}
                <div
                  style={{
                    height: 5,
                    backgroundColor: '#27272A',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: '50%',
                      backgroundColor: '#FA78B9',
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* NOTICE READING / DETAIL MODAL */}
      {selectedNotice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setSelectedNotice(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 580,
              width: '100%',
              padding: 28,
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedNotice(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X width={16} height={16} color="#111111" />
            </button>

            {/* Header: Category Badge + Title */}
            <div style={{ marginBottom: 14 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  backgroundColor: selectedNotice.tagColor.bg,
                  color: selectedNotice.tagColor.text,
                  padding: '3px 10px',
                  borderRadius: 999,
                  textTransform: 'uppercase',
                }}
              >
                {selectedNotice.tag}
              </span>
              <h3 style={{ fontSize: 22, fontWeight: 950, margin: '10px 0 6px 0', color: '#111111' }}>
                {selectedNotice.title}
              </h3>
              <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
                {selectedNotice.dateFormatted} • {selectedNotice.readTime} • {selectedNotice.department}
              </div>
            </div>

            {/* Image Preview */}
            <div
              style={{
                width: '100%',
                height: 200,
                borderRadius: 16,
                overflow: 'hidden',
                position: 'relative',
                marginBottom: 16,
              }}
            >
              <Image
                src={selectedNotice.imageSrc}
                alt={selectedNotice.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Content Body */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', marginBottom: 6 }}>
                Notice Content
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                {selectedNotice.content}
              </p>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  handleToggleBookmark(selectedNotice)
                }}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: 9999,
                  backgroundColor: savedIds.includes(selectedNotice.id) ? '#111111' : '#F3F4F6',
                  color: savedIds.includes(selectedNotice.id) ? '#D5FF38' : '#111111',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Bookmark
                  width={15}
                  height={15}
                  fill={savedIds.includes(selectedNotice.id) ? '#D5FF38' : 'none'}
                />
                <span>{savedIds.includes(selectedNotice.id) ? 'Saved' : 'Bookmark'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleShare(selectedNotice)
                }}
                style={{
                  padding: '12px 18px',
                  borderRadius: 9999,
                  backgroundColor: '#F3F4F6',
                  color: '#111111',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Share2 width={15} height={15} />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedNotice(null)
                  addToast({
                    type: 'success',
                    title: 'Notice Completed',
                    message: `Completed reading "${selectedNotice.title}". Great habit!`,
                  })
                }}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: 9999,
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Check width={15} height={15} strokeWidth={2.5} />
                <span>Done Reading</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
