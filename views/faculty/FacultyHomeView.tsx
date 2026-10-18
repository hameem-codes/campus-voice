'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  Megaphone,
  CalendarDays,
  Briefcase,
  GraduationCap,
  Users,
  FileText,
  Activity,
  MessageSquare,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  Clock,
  Eye,
  MoreHorizontal,
  Plus,
  Send,
  X,
  Check,
  Building2,
  Calendar,
  Sparkles,
  BarChart2,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface NoticeActivityItem {
  id: string
  title: string
  category: 'Academic' | 'Event' | 'Placement' | 'General'
  tag: string
  tagColor: { bg: string; text: string }
  dateFormatted: string
  views: string
  extraMetric: string
  imageSrc: string
}

interface UpcomingEventItem {
  id: string
  day: string
  month: string
  title: string
  time: string
  venue: string
  tag: string
  tagColor: { bg: string; text: string }
}

interface FacultyMessageItem {
  id: string
  sender: string
  avatar?: string
  time: string
  preview: string
  isUnread: boolean
  isSpecial?: boolean
}

interface StudentFeedbackItem {
  id: string
  student: string
  timeAgo: string
  comment: string
  avatar: string
}

export function FacultyHomeView() {
  const router = useRouter()
  const { updates, addToast, logout } = useStore()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [timeRange, setTimeRange] = useState('Last 30 Days')
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [activeBarHover, setActiveBarHover] = useState<number | null>(4) // Default Oct 5

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false)
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false)
  const [activeReplyMessage, setActiveReplyMessage] = useState<FacultyMessageItem | null>(null)

  // Quick Create Form State
  const [createForm, setCreateForm] = useState({
    title: '',
    department: 'Computer Science & Engineering',
    category: 'Academic',
    body: '',
    targetAudience: 'All Cohorts',
  })

  // Quick Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '2026-10-25',
    time: '10:00 AM - 01:00 PM',
    venue: 'Seminar Hall B',
    description: '',
  })

  // Recent Notices Activity matching screenshot
  const [recentNotices, setRecentNotices] = useState<NoticeActivityItem[]>([
    {
      id: 'fn-1',
      title: 'Mid Semester Exam Schedule Released',
      category: 'Academic',
      tag: 'ACADEMIC',
      tagColor: { bg: '#E0F2FE', text: '#0284C7' },
      dateFormatted: '12 Oct 2026',
      views: '2.3K views',
      extraMetric: '45 comments',
      imageSrc: '/images/campus_building.jpg',
    },
    {
      id: 'fn-2',
      title: 'Garba Night 2026 Event Published',
      category: 'Event',
      tag: 'EVENT',
      tagColor: { bg: '#FCE7F3', text: '#DB2777' },
      dateFormatted: '10 Oct 2026',
      views: '1.8K views',
      extraMetric: '32 registrations',
      imageSrc: '/images/garba_night.jpg',
    },
    {
      id: 'fn-3',
      title: 'Google Campus Recruitment Drive Shared',
      category: 'Placement',
      tag: 'PLACEMENT',
      tagColor: { bg: '#DBEAFE', text: '#1D4ED8' },
      dateFormatted: '8 Oct 2026',
      views: '3.1K views',
      extraMetric: '56 interests',
      imageSrc: '/images/recruitment_interview.jpg',
    },
    {
      id: 'fn-4',
      title: 'Library Timings Update',
      category: 'General',
      tag: 'GENERAL',
      tagColor: { bg: '#EDE9FE', text: '#7C3AED' },
      dateFormatted: '5 Oct 2026',
      views: '1.2K views',
      extraMetric: '18 comments',
      imageSrc: '/images/library_books.jpg',
    },
  ])

  // Upcoming Events matching screenshot
  const upcomingEvents: UpcomingEventItem[] = [
    {
      id: 'ue-1',
      day: '15',
      month: 'OCT',
      title: 'Garba Night 2026',
      time: '07:00 PM - 11:00 PM',
      venue: 'College Ground',
      tag: 'EVENT',
      tagColor: { bg: '#FCE7F3', text: '#DB2777' },
    },
    {
      id: 'ue-2',
      day: '22',
      month: 'OCT',
      title: 'Technical Workshop',
      time: '10:00 AM - 01:00 PM',
      venue: 'Seminar Hall',
      tag: 'WORKSHOP',
      tagColor: { bg: '#EDE9FE', text: '#7C3AED' },
    },
    {
      id: 'ue-3',
      day: '05',
      month: 'NOV',
      title: 'AI & Future of Tech Talk',
      time: '11:00 AM - 12:30 PM',
      venue: 'Main Auditorium',
      tag: 'TALK',
      tagColor: { bg: '#E0F2FE', text: '#0284C7' },
    },
  ]

  // Messages matching screenshot
  const [messagesList, setMessagesList] = useState<FacultyMessageItem[]>([
    {
      id: 'msg-1',
      sender: 'Aarav Sharma',
      avatar: '/images/mateen_avatar.jpg',
      time: '10:24 AM',
      preview: 'Will the notes be shared for Unit 3?',
      isUnread: true,
    },
    {
      id: 'msg-2',
      sender: 'Sneha Iyer',
      avatar: '/images/mateen_avatar.jpg',
      time: 'Yesterday',
      preview: 'Thank you for the session!',
      isUnread: true,
    },
    {
      id: 'msg-3',
      sender: 'Placement Cell',
      time: '12 Oct',
      preview: 'Google drive details updated.',
      isUnread: true,
      isSpecial: true,
    },
  ])

  // Student Feedback matching screenshot
  const studentFeedback: StudentFeedbackItem[] = [
    {
      id: 'fb-1',
      student: 'Aarav Sharma',
      timeAgo: '3 days ago',
      comment: 'The exam schedule was very helpful. Thank you for the timely update!',
      avatar: '/images/mateen_avatar.jpg',
    },
    {
      id: 'fb-2',
      student: 'Sneha Iyer',
      timeAgo: '5 days ago',
      comment: 'Looking forward to more technical workshops. The last one was amazing!',
      avatar: '/images/mateen_avatar.jpg',
    },
  ]

  // Bar Chart Data (Announcement Reach)
  const chartBars = [
    { label: 'Sep 15', value: 850, views: '850', height: 42 },
    { label: 'Sep 20', value: 1200, views: '1,200', height: 60 },
    { label: 'Sep 25', value: 920, views: '920', height: 46 },
    { label: 'Sep 30', value: 1350, views: '1,350', height: 68 },
    { label: 'Oct 5', value: 1482, views: '1,482', height: 75, highlight: true },
    { label: 'Oct 10', value: 1100, views: '1,100', height: 55 },
    { label: 'Oct 15', value: 1280, views: '1,280', height: 64 },
  ]

  // Submit Quick Create Announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.title.trim()) return

    const newId = `faculty-notice-${Date.now()}`

    setRecentNotices([
      {
        id: newId,
        title: createForm.title.trim(),
        category: createForm.category as any,
        tag: createForm.category.toUpperCase(),
        tagColor: { bg: '#E0F2FE', text: '#0284C7' },
        dateFormatted: 'Today',
        views: '1 view',
        extraMetric: '0 comments',
        imageSrc: '/images/campus_building.jpg',
      },
      ...recentNotices,
    ])

    setIsCreateModalOpen(false)
    setCreateForm({
      title: '',
      department: 'Computer Science & Engineering',
      category: 'Academic',
      body: '',
      targetAudience: 'All Cohorts',
    })

    addToast({
      type: 'success',
      title: 'Announcement Published',
      message: 'Your notice has been shared with students across the department.',
    })
  }

  // Submit Quick Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEventModalOpen(false)
    addToast({
      type: 'success',
      title: 'Event Scheduled',
      message: `"${eventForm.title}" has been added to the campus events calendar.`,
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
        <div style={{ flex: 1, maxWidth: 620, position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F3F4F6',
              borderRadius: 9999,
              padding: '8px 18px',
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
              onClick={() => router.push('/student/notifications')}
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
          </div>

          {/* User Profile Pill (Dr. Rahul Mehta) */}
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
                  backgroundColor: '#111111',
                }}
              >
                <Image
                  src="/images/mateen_avatar.jpg"
                  alt="Dr. Rahul Mehta"
                  fill
                  sizes="32px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#111111' }}>
                  Dr. Rahul Mehta
                </div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Faculty</div>
              </div>
              <ChevronDown width={14} height={14} color="#6B7280" />
            </button>

            {isProfileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 48,
                  width: 200,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  padding: 8,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 50,
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <button
                  type="button"
                  onClick={() => router.push('/student')}
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
                  Switch to Student
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
                  onClick={() => {
                    logout()
                    router.push('/login')
                  }}
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
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* COLUMN 1: LEFT DARK SIDEBAR (FACULTY) */}
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
              {/* 1. Dashboard (ACTIVE: Acid-Lime #D5FF38 with black bold text) */}
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
                <LayoutGrid width={17} height={17} strokeWidth={2.5} />
                <span>Dashboard</span>
              </button>

              {/* 2. Announcements */}
              <button
                type="button"
                onClick={() => router.push('/faculty/updates')}
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

              {/* 3. Events */}
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

              {/* 4. Placements */}
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

              {/* 5. Academic */}
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

              {/* 6. Students */}
              <button
                type="button"
                onClick={() => router.push('/admin/users')}
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
                <Users width={17} height={17} />
                <span>Students</span>
              </button>

              {/* 7. Notices Management */}
              <button
                type="button"
                onClick={() => router.push('/faculty/updates')}
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
                <FileText width={17} height={17} />
                <span>Notices Management</span>
              </button>

              {/* 8. My Activity */}
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
                <Activity width={17} height={17} />
                <span>My Activity</span>
              </button>

              {/* 9. Messages */}
              <button
                type="button"
                onClick={() => {
                  const firstMsg = messagesList[0]
                  setActiveReplyMessage(firstMsg)
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
                <MessageSquare width={17} height={17} />
                <span>Messages</span>
              </button>

              {/* 10. Settings */}
              <button
                type="button"
                onClick={() => router.push('/student/profile')}
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
                <Settings width={17} height={17} />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* COLUMN 2: CENTER FACULTY DASHBOARD FEED */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* 1. HERO GREETING BANNER */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: '24px 28px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Left Greeting Text */}
            <div style={{ flex: 1, minWidth: 260, zIndex: 2 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#6B7280',
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 16 }}>👋</span>
                <span>Welcome Back,</span>
              </div>
              <h1
                style={{
                  fontSize: 34,
                  fontWeight: 950,
                  letterSpacing: -0.8,
                  color: '#111111',
                  margin: '0 0 6px 0',
                  lineHeight: 1.1,
                }}
              >
                Dr. Rahul Mehta
              </h1>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#111111',
                  marginBottom: 4,
                }}
              >
                Computer Science & Engineering Department
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: '#6B7280',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Manage announcements, events, and stay connected with your students.
              </p>
            </div>

            {/* Right Campus Building Photo + Tilted Sticker */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Campus Building Thumbnail */}
              <div
                style={{
                  width: 140,
                  height: 96,
                  borderRadius: 16,
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid #E5E7EB',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                }}
              >
                <Image
                  src="/images/campus_building.jpg"
                  alt="Campus Building"
                  fill
                  sizes="140px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Tilted Neo-Brutalist Acid-Lime Sticker */}
              <div
                style={{
                  transform: 'rotate(7deg)',
                  position: 'relative',
                }}
              >
                {/* Two doodle marks above sticker */}
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: 18,
                    display: 'flex',
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 2,
                      height: 8,
                      backgroundColor: '#111111',
                      transform: 'rotate(-25deg)',
                    }}
                  />
                  <div
                    style={{
                      width: 2,
                      height: 8,
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
                      fontSize: 10,
                      fontWeight: 950,
                      color: '#111111',
                      lineHeight: 1.2,
                      letterSpacing: '0.2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    INSPIRE
                    <br />
                    GUIDE
                    <br />
                    SUPPORT
                    <br />
                    EMPOWER
                    <br />
                    STUDENTS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 4 STAT CARDS ROW */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 14,
            }}
          >
            {/* Stat 1: Announcements */}
            <div
              style={{
                backgroundColor: '#E0F2FE',
                borderRadius: 20,
                padding: '16px 14px',
                border: '1px solid #BAE6FD',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284C7',
                  boxShadow: '0 2px 6px rgba(2,132,199,0.12)',
                  flexShrink: 0,
                }}
              >
                <Megaphone width={18} height={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                    24
                  </span>
                  <span
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      fontSize: 10,
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: 9999,
                    }}
                  >
                    ↑ 12%
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#111111', fontWeight: 800 }}>Announcements</div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>12 this month</div>
              </div>
            </div>

            {/* Stat 2: Events Organized */}
            <div
              style={{
                backgroundColor: '#FCE7F3',
                borderRadius: 20,
                padding: '16px 14px',
                border: '1px solid #FBCFE8',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DB2777',
                  boxShadow: '0 2px 6px rgba(219,39,119,0.12)',
                  flexShrink: 0,
                }}
              >
                <CalendarDays width={18} height={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                    8
                  </span>
                  <span
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      fontSize: 10,
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: 9999,
                    }}
                  >
                    ↑ 33%
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#111111', fontWeight: 800 }}>
                  Events Organized
                </div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>5 upcoming</div>
              </div>
            </div>

            {/* Stat 3: Students Reached */}
            <div
              style={{
                backgroundColor: '#EDE9FE',
                borderRadius: 20,
                padding: '16px 14px',
                border: '1px solid #DDD6FE',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                  boxShadow: '0 2px 6px rgba(124,58,237,0.12)',
                  flexShrink: 0,
                }}
              >
                <Users width={18} height={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                    256
                  </span>
                  <span
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      fontSize: 10,
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: 9999,
                    }}
                  >
                    ↑ 18%
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#111111', fontWeight: 800 }}>
                  Students Reached
                </div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                  across all announcements
                </div>
              </div>
            </div>

            {/* Stat 4: Department Notices */}
            <div
              style={{
                backgroundColor: '#FEF9C3',
                borderRadius: 20,
                padding: '16px 14px',
                border: '1px solid #FEF08A',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CA8A04',
                  boxShadow: '0 2px 6px rgba(202,138,4,0.12)',
                  flexShrink: 0,
                }}
              >
                <FileText width={18} height={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                    12
                  </span>
                  <span
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      fontSize: 10,
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: 9999,
                    }}
                  >
                    ↑ 20%
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#111111', fontWeight: 800 }}>
                  Department Notices
                </div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                  active this semester
                </div>
              </div>
            </div>
          </div>

          {/* 3. MIDDLE SECTION 1: RECENT ACTIVITY & ANNOUNCEMENT REACH */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}
          >
            {/* Left: Recent Activity */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '20px 18px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 950,
                    letterSpacing: -0.3,
                    color: '#111111',
                    margin: 0,
                  }}
                >
                  Recent Activity
                </h3>
                <button
                  type="button"
                  onClick={() => router.push('/faculty/updates')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#111111',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span>View All</span>
                  <ArrowRight width={13} height={13} />
                </button>
              </div>

              {/* Activity rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '8px 10px',
                      borderRadius: 14,
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #F3F4F6',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10,
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={notice.imageSrc}
                        alt={notice.title}
                        fill
                        sizes="50px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 900,
                            color: '#111111',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {notice.title}
                        </span>
                        <span
                          style={{
                            backgroundColor: notice.tagColor.bg,
                            color: notice.tagColor.text,
                            fontSize: 9,
                            fontWeight: 900,
                            padding: '1px 6px',
                            borderRadius: 9999,
                            flexShrink: 0,
                          }}
                        >
                          {notice.tag}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: '#6B7280',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span>🕒 {notice.dateFormatted}</span>
                        <span>·</span>
                        <span>👁 {notice.views}</span>
                        <span>·</span>
                        <span>💬 {notice.extraMetric}</span>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                    >
                      <MoreHorizontal width={14} height={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Announcement Reach (Bar Chart) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '20px 18px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 950,
                    letterSpacing: -0.3,
                    color: '#111111',
                    margin: 0,
                  }}
                >
                  Announcement Reach
                </h3>

                {/* Range Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 9999,
                      padding: '4px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#4B5563',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{timeRange}</span>
                    <ChevronDown width={12} height={12} />
                  </button>

                  {isTimeRangeOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 32,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: 12,
                        padding: 4,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                        zIndex: 20,
                        width: 130,
                      }}
                    >
                      {['Last 7 Days', 'Last 30 Days', 'This Semester'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setTimeRange(opt)
                            setIsTimeRangeOpen(false)
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '6px 8px',
                            fontSize: 11,
                            fontWeight: 700,
                            background: timeRange === opt ? '#F3F4F6' : 'none',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Bar Chart Canvas */}
              <div
                style={{
                  position: 'relative',
                  height: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  paddingTop: 30,
                }}
              >
                {/* Y-axis Labels and Gridlines */}
                <div
                  style={{
                    position: 'absolute',
                    top: 20,
                    bottom: 24,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    pointerEvents: 'none',
                  }}
                >
                  {['2K', '1.5K', '1K', '500', '0'].map((label) => (
                    <div
                      key={label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 10,
                        color: '#9CA3AF',
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ width: 24, textAlign: 'right' }}>{label}</span>
                      <div style={{ flex: 1, height: 1, backgroundColor: '#F3F4F6' }} />
                    </div>
                  ))}
                </div>

                {/* Bars Container */}
                <div
                  style={{
                    marginLeft: 32,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    height: 160,
                    zIndex: 2,
                    paddingBottom: 4,
                  }}
                >
                  {chartBars.map((bar, idx) => {
                    const isHovered = activeBarHover === idx
                    return (
                      <div
                        key={bar.label}
                        onMouseEnter={() => setActiveBarHover(idx)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                          flex: 1,
                          position: 'relative',
                          cursor: 'pointer',
                        }}
                      >
                        {/* Tooltip on Highlighted Bar */}
                        {isHovered && (
                          <div
                            style={{
                              position: 'absolute',
                              top: -48,
                              backgroundColor: '#111111',
                              color: '#FFFFFF',
                              padding: '4px 8px',
                              borderRadius: 8,
                              fontSize: 10,
                              textAlign: 'center',
                              lineHeight: 1.2,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                              whiteSpace: 'nowrap',
                              zIndex: 10,
                            }}
                          >
                            <div style={{ fontWeight: 900, color: '#D5FF38' }}>{bar.views}</div>
                            <div style={{ fontSize: 9, color: '#9CA3AF' }}>Views</div>
                            <div style={{ fontSize: 8, color: '#D1D5DB' }}>{bar.label} 2026</div>
                          </div>
                        )}

                        {/* Bar */}
                        <div
                          style={{
                            width: 14,
                            height: `${bar.height}%`,
                            backgroundColor: '#D5FF38',
                            borderRadius: '6px 6px 0 0',
                            border: '1px solid #111111',
                            transition: 'height 0.2s ease, transform 0.15s ease',
                            transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                            transformOrigin: 'bottom',
                          }}
                        />

                        {/* Label */}
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: isHovered ? '#111111' : '#6B7280',
                          }}
                        >
                          {bar.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 4. MIDDLE SECTION 2: STUDENT ENGAGEMENT & NOTICE CATEGORIES */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}
          >
            {/* Left: Student Engagement (Donut Chart) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '20px 18px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 950,
                    letterSpacing: -0.3,
                    color: '#111111',
                    margin: 0,
                  }}
                >
                  Student Engagement
                </h3>
                <button
                  type="button"
                  onClick={() => router.push('/faculty/analytics')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#111111',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span>View Details</span>
                  <ArrowRight width={13} height={13} />
                </button>
              </div>

              {/* Donut Chart & Legend Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  gap: 16,
                  padding: '10px 0',
                }}
              >
                {/* SVG Donut */}
                <div style={{ position: 'relative', width: 140, height: 140 }}>
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle
                      cx="70"
                      cy="70"
                      r="50"
                      fill="transparent"
                      stroke="#F3F4F6"
                      strokeWidth="16"
                    />
                    {/* Segment 1: Undergraduate 62% (#D5FF38) */}
                    <circle
                      cx="70"
                      cy="70"
                      r="50"
                      fill="transparent"
                      stroke="#D5FF38"
                      strokeWidth="16"
                      strokeDasharray="194.7 314.15"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    {/* Segment 2: Postgraduate 24% (#FA78B9) */}
                    <circle
                      cx="70"
                      cy="70"
                      r="50"
                      fill="transparent"
                      stroke="#FA78B9"
                      strokeWidth="16"
                      strokeDasharray="75.4 314.15"
                      strokeDashoffset="-194.7"
                      strokeLinecap="round"
                    />
                    {/* Segment 3: Research Scholars 10% (#A855F7) */}
                    <circle
                      cx="70"
                      cy="70"
                      r="50"
                      fill="transparent"
                      stroke="#A855F7"
                      strokeWidth="16"
                      strokeDasharray="31.4 314.15"
                      strokeDashoffset="-270.1"
                      strokeLinecap="round"
                    />
                    {/* Segment 4: Others 4% (#38BDF8) */}
                    <circle
                      cx="70"
                      cy="70"
                      r="50"
                      fill="transparent"
                      stroke="#38BDF8"
                      strokeWidth="16"
                      strokeDasharray="12.5 314.15"
                      strokeDashoffset="-301.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Center Text */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 20, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                      256
                    </span>
                    <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Students</span>
                  </div>
                </div>

                {/* Legend List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#D5FF38' }} />
                    <span style={{ color: '#4B5563', fontWeight: 600, minWidth: 90 }}>Undergraduate</span>
                    <span style={{ fontWeight: 900, color: '#111111' }}>62%</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FA78B9' }} />
                    <span style={{ color: '#4B5563', fontWeight: 600, minWidth: 90 }}>Postgraduate</span>
                    <span style={{ fontWeight: 900, color: '#111111' }}>24%</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#A855F7' }} />
                    <span style={{ color: '#4B5563', fontWeight: 600, minWidth: 90 }}>Research Scholars</span>
                    <span style={{ fontWeight: 900, color: '#111111' }}>10%</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                    <span style={{ color: '#4B5563', fontWeight: 600, minWidth: 90 }}>Others</span>
                    <span style={{ fontWeight: 900, color: '#111111' }}>4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Notice Categories (Horizontal Progress Bars) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '20px 18px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 950,
                    letterSpacing: -0.3,
                    color: '#111111',
                    margin: 0,
                  }}
                >
                  Notice Categories
                </h3>
                <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>
                  Last 30 Days ▾
                </span>
              </div>

              {/* Category Progress Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '4px 0' }}>
                {/* 1. Academic */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: '#FEF9C3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#CA8A04',
                      fontSize: 11,
                    }}
                  >
                    📄
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111', width: 70 }}>
                    Academic
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      backgroundColor: '#F3F4F6',
                      borderRadius: 9999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '75%',
                        height: '100%',
                        backgroundColor: '#D5FF38',
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 900, color: '#111111', width: 16, textAlign: 'right' }}>
                    12
                  </span>
                </div>

                {/* 2. Events */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: '#FCE7F3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#DB2777',
                      fontSize: 11,
                    }}
                  >
                    📅
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111', width: 70 }}>
                    Events
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      backgroundColor: '#F3F4F6',
                      borderRadius: 9999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '50%',
                        height: '100%',
                        backgroundColor: '#FA78B9',
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 900, color: '#111111', width: 16, textAlign: 'right' }}>
                    8
                  </span>
                </div>

                {/* 3. Placements */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: '#EDE9FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#7C3AED',
                      fontSize: 11,
                    }}
                  >
                    💼
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111', width: 70 }}>
                    Placements
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      backgroundColor: '#F3F4F6',
                      borderRadius: 9999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '38%',
                        height: '100%',
                        backgroundColor: '#C084FC',
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 900, color: '#111111', width: 16, textAlign: 'right' }}>
                    6
                  </span>
                </div>

                {/* 4. General */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: '#E0F2FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0284C7',
                      fontSize: 11,
                    }}
                  >
                    📁
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111', width: 70 }}>
                    General
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      backgroundColor: '#F3F4F6',
                      borderRadius: 9999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '32%',
                        height: '100%',
                        backgroundColor: '#38BDF8',
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 900, color: '#111111', width: 16, textAlign: 'right' }}>
                    5
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. BOTTOM SECTION: RECENT STUDENT FEEDBACK & DEPARTMENT TOOLS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}
          >
            {/* Left: Recent Student Feedback */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '20px 18px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 950,
                    letterSpacing: -0.3,
                    color: '#111111',
                    margin: 0,
                  }}
                >
                  Recent Student Feedback
                </h3>
                <button
                  type="button"
                  onClick={() => router.push('/student/activity')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#111111',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span>View All</span>
                  <ArrowRight width={13} height={13} />
                </button>
              </div>

              {/* Feedback rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {studentFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 14,
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #F3F4F6',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                        backgroundColor: '#111111',
                      }}
                    >
                      <Image
                        src={fb.avatar}
                        alt={fb.student}
                        fill
                        sizes="32px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 2,
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 900, color: '#111111' }}>
                          {fb.student}
                        </span>
                        <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                          {fb.timeAgo}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#4B5563',
                          fontWeight: 600,
                          lineHeight: 1.35,
                        }}
                      >
                        &quot;{fb.comment}&quot;
                      </div>
                    </div>

                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <MoreHorizontal width={14} height={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Department Tools */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '20px 18px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 950,
                  letterSpacing: -0.3,
                  color: '#111111',
                  margin: 0,
                }}
              >
                Department Tools
              </h3>

              {/* 4 Tool Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 10,
                }}
              >
                {/* Tool 1 */}
                <div
                  onClick={() => router.push('/faculty/updates')}
                  style={{
                    backgroundColor: '#EDE9FE',
                    borderRadius: 14,
                    padding: '14px 8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    border: '1px solid #DDD6FE',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <FileText width={18} height={18} color="#7C3AED" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#111111', lineHeight: 1.2 }}>
                    Manage Department Noticeboard
                  </span>
                </div>

                {/* Tool 2 */}
                <div
                  onClick={() => {
                    const firstMsg = messagesList[0]
                    setActiveReplyMessage(firstMsg)
                  }}
                  style={{
                    backgroundColor: '#FCE7F3',
                    borderRadius: 14,
                    padding: '14px 8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    border: '1px solid #FBCFE8',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <MessageCircle width={18} height={18} color="#DB2777" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#111111', lineHeight: 1.2 }}>
                    View Student Queries
                  </span>
                </div>

                {/* Tool 3 */}
                <div
                  onClick={() => router.push('/faculty/analytics')}
                  style={{
                    backgroundColor: '#E0F2FE',
                    borderRadius: 14,
                    padding: '14px 8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    border: '1px solid #BAE6FD',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <BarChart2 width={18} height={18} color="#0284C7" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#111111', lineHeight: 1.2 }}>
                    Generate Reports
                  </span>
                </div>

                {/* Tool 4 */}
                <div
                  onClick={() => router.push('/admin/setup')}
                  style={{
                    backgroundColor: '#FEF9C3',
                    borderRadius: 14,
                    padding: '14px 8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    border: '1px solid #FEF08A',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <Settings width={18} height={18} color="#CA8A04" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#111111', lineHeight: 1.2 }}>
                    Department Settings
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* COLUMN 3: RIGHT SIDEBAR WIDGETS */}
        <aside
          style={{
            position: 'sticky',
            top: 84,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* WIDGET 1: QUICK ACTIONS (PITCH-BLACK NEO-BRUTALIST CARD) */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #222222',
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>⚡</span>
              <span style={{ fontSize: 13, fontWeight: 950, color: '#FFFFFF' }}>Quick Actions</span>
            </div>

            {/* Primary Action Button: Create Announcement */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#D5FF38',
                color: '#111111',
                borderRadius: 14,
                padding: '12px 14px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 950,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(213,255,56,0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Megaphone width={16} height={16} strokeWidth={2.5} />
                <span>Create Announcement</span>
              </div>
              <ArrowRight width={16} height={16} />
            </button>

            {/* Secondary Action 1: Create Event */}
            <button
              type="button"
              onClick={() => setIsEventModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#E5E7EB',
                borderRadius: 12,
                padding: '10px 14px',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarDays width={15} height={15} />
                <span>Create Event →</span>
              </div>
            </button>

            {/* Secondary Action 2: Post Placement Update */}
            <button
              type="button"
              onClick={() => setIsPlacementModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#E5E7EB',
                borderRadius: 12,
                padding: '10px 14px',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Briefcase width={15} height={15} />
                <span>Post Placement Update →</span>
              </div>
            </button>

            {/* Secondary Action 3: Share Academic Notice */}
            <button
              type="button"
              onClick={() => setIsAcademicModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#E5E7EB',
                borderRadius: 12,
                padding: '10px 14px',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText width={15} height={15} />
                <span>Share Academic Notice →</span>
              </div>
            </button>
          </div>

          {/* WIDGET 2: UPCOMING EVENTS (WHITE CARD) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarDays width={15} height={15} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Upcoming Events
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push('/student/calendar')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>View All</span>
                <ArrowRight width={12} height={12} />
              </button>
            </div>

            {/* Event Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 14,
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #F3F4F6',
                  }}
                >
                  {/* Date Box */}
                  <div
                    style={{
                      width: 36,
                      height: 42,
                      borderRadius: 10,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 950, color: '#111111' }}>{evt.day}</span>
                    <span style={{ fontSize: 8, fontWeight: 800, color: '#6B7280' }}>{evt.month}</span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', marginBottom: 2 }}>
                      {evt.title}
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                      🕒 {evt.time}
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                      📍 {evt.venue}
                    </div>
                  </div>

                  {/* Tag */}
                  <span
                    style={{
                      backgroundColor: evt.tagColor.bg,
                      color: evt.tagColor.text,
                      fontSize: 9,
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: 9999,
                      flexShrink: 0,
                    }}
                  >
                    {evt.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 3: MESSAGES (WHITE CARD) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MessageSquare width={15} height={15} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>Messages</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const firstMsg = messagesList[0]
                  setActiveReplyMessage(firstMsg)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>View All</span>
                <ArrowRight width={12} height={12} />
              </button>
            </div>

            {/* Message Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messagesList.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setActiveReplyMessage(msg)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 14,
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #F3F4F6',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                      backgroundColor: msg.isSpecial ? '#EDE9FE' : '#111111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#7C3AED',
                    }}
                  >
                    {msg.avatar ? (
                      <Image
                        src={msg.avatar}
                        alt={msg.sender}
                        fill
                        sizes="32px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <CalendarDays width={16} height={16} />
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 900, color: '#111111' }}>
                        {msg.sender}
                      </span>
                      <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                        {msg.time}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#6B7280',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {msg.preview}
                    </div>
                  </div>

                  {/* Blue Unread Dot */}
                  {msg.isUnread && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#2563EB',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL 1: CREATE ANNOUNCEMENT */}
      {isCreateModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 520,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '2px solid #111111',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 950, margin: 0, color: '#111111' }}>
                Create Faculty Announcement
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X width={18} height={18} color="#6B7280" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                  Notice Title
                </label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="e.g. Schedule of Practical Laboratory Viva"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid #D1D5DB',
                    fontSize: 13,
                    fontWeight: 600,
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                    Category
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid #D1D5DB',
                      fontSize: 12,
                      fontWeight: 600,
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                    <option value="Placement">Placement</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                    Target Audience
                  </label>
                  <select
                    value={createForm.targetAudience}
                    onChange={(e) => setCreateForm({ ...createForm, targetAudience: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid #D1D5DB',
                      fontSize: 12,
                      fontWeight: 600,
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="All Cohorts">All Students</option>
                    <option value="3rd Year CSE">3rd Year CSE</option>
                    <option value="4th Year CSE">Final Year Students</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                  Announcement Content
                </label>
                <textarea
                  rows={4}
                  value={createForm.body}
                  onChange={(e) => setCreateForm({ ...createForm, body: e.target.value })}
                  placeholder="Provide instructions, key dates, or room allocations..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid #D1D5DB',
                    fontSize: 13,
                    fontWeight: 500,
                    outline: 'none',
                    resize: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: '#111111',
                    color: '#D5FF38',
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE EVENT */}
      {isEventModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setIsEventModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '2px solid #111111',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 950, margin: 0, color: '#111111' }}>
                Create Campus Event
              </h3>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X width={18} height={18} color="#6B7280" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Cloud Computing & DevOps Hands-on Workshop"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid #D1D5DB',
                    fontSize: 13,
                    fontWeight: 600,
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid #D1D5DB',
                      fontSize: 12,
                      fontWeight: 600,
                      outline: 'none',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                    Venue
                  </label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid #D1D5DB',
                      fontSize: 12,
                      fontWeight: 600,
                      outline: 'none',
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: '#111111',
                    color: '#D5FF38',
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REPLY TO MESSAGE */}
      {activeReplyMessage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setActiveReplyMessage(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 440,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '2px solid #111111',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 950, margin: 0, color: '#111111' }}>
                Conversation with {activeReplyMessage.sender}
              </h3>
              <button
                type="button"
                onClick={() => setActiveReplyMessage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X width={18} height={18} color="#6B7280" />
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#F3F4F6',
                padding: '12px 14px',
                borderRadius: 14,
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>
                {activeReplyMessage.sender} · {activeReplyMessage.time}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111111' }}>
                &quot;{activeReplyMessage.preview}&quot;
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Type your reply..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1px solid #D1D5DB',
                  fontSize: 12,
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setActiveReplyMessage(null)
                  addToast({
                    type: 'success',
                    title: 'Message Sent',
                    message: `Replied to ${activeReplyMessage.sender}.`,
                  })
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  border: 'none',
                  backgroundColor: '#111111',
                  color: '#D5FF38',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
