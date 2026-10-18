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
  Calendar,
  X,
  Check,
  Building2,
  Sparkles,
  HelpCircle,
  Home,
  Bus,
  ShieldAlert,
  MoreHorizontal,
  Eye,
  Send,
  Plus,
  Flame,
  ChevronRight,
  Presentation,
  BookOpen,
  CalendarX,
  FilePlus,
  Lightbulb,
  Edit2,
  Copy,
  BarChart2,
  Share2,
  Zap,
  CheckCircle2,
  AlertCircle,
  Archive,
  Trash2,
  Filter,
  CheckSquare,
  Layers,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  MessageCircle,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

export interface FacultyNoticeItem {
  id: string
  title: string
  category: string
  categoryTag: string
  categoryColor: { bg: string; text: string }
  excerpt: string
  image: string
  date: string
  views: string
  comments: number
  status: 'Published' | 'Scheduled' | 'Draft' | 'Expired'
  statusTimeLabel: string
  statusSubLabel?: string
  priority: 'Normal' | 'Important' | 'Urgent'
  department: string
}

export function FacultyUpdatesView() {
  const router = useRouter()
  const { addToast, logout } = useStore()

  // State
  const [activeTab, setActiveTab] = useState<string>('All Notices')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedSort, setSelectedSort] = useState('Newest First')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isPerformanceMenuOpen, setIsPerformanceMenuOpen] = useState(false)
  const [selectedPerformanceRange, setSelectedPerformanceRange] = useState('Last 30 Days')
  const [isMoreTabsOpen, setIsMoreTabsOpen] = useState(false)

  // Selection state
  const [selectedNoticeIds, setSelectedNoticeIds] = useState<string[]>([])

  // Active Dropdown menus for card actions
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  // Modals state
  const [analyticsTarget, setAnalyticsTarget] = useState<FacultyNoticeItem | null>(null)
  const [previewTarget, setPreviewTarget] = useState<FacultyNoticeItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FacultyNoticeItem | null>(null)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false)

  // Schedule modal form state
  const [scheduleNoticeTitle, setScheduleNoticeTitle] = useState('')
  const [scheduleDate, setScheduleDate] = useState('2026-10-25')
  const [scheduleTime, setScheduleTime] = useState('10:00')

  // Notices list matching reference screenshot exactly
  const [notices, setNotices] = useState<FacultyNoticeItem[]>([
    {
      id: 'notice-1',
      title: 'Mid Semester Exam Schedule Released',
      category: 'Academic',
      categoryTag: 'ACADEMIC',
      categoryColor: { bg: '#D5FF38', text: '#111111' },
      excerpt:
        'The mid semester examination schedule for all departments has been released. Please check the detailed timetable.',
      image: '/images/mid_sem_exam.jpg',
      date: '12 Oct 2026',
      views: '2.3K',
      comments: 45,
      status: 'Published',
      statusTimeLabel: '5 days ago',
      priority: 'Urgent',
      department: 'Academic Office',
    },
    {
      id: 'notice-2',
      title: 'Garba Night 2026 - Registrations Open',
      category: 'Events',
      categoryTag: 'EVENTS',
      categoryColor: { bg: '#FCE7F3', text: '#DB2777' },
      excerpt:
        'Join us for a vibrant evening of music, dance and cultural celebration. Registrations are now open!',
      image: '/images/garba_night.jpg',
      date: '10 Oct 2026',
      views: '1.8K',
      comments: 32,
      status: 'Published',
      statusTimeLabel: '1 week ago',
      priority: 'Normal',
      department: 'Cultural Affairs',
    },
    {
      id: 'notice-3',
      title: 'Google Campus Recruitment Drive',
      category: 'Placements',
      categoryTag: 'PLACEMENTS',
      categoryColor: { bg: '#E0F2FE', text: '#0284C7' },
      excerpt:
        'Final year students can register for the upcoming Google placement drive. Check eligibility and registration details.',
      image: '/images/placement_drive.jpg',
      date: '8 Oct 2026',
      views: '3.1K',
      comments: 56,
      status: 'Published',
      statusTimeLabel: '1 week ago',
      priority: 'Important',
      department: 'Career & Placement Cell',
    },
    {
      id: 'notice-4',
      title: 'Library Timings Update',
      category: 'General',
      categoryTag: 'GENERAL',
      categoryColor: { bg: '#EDE9FE', text: '#7C3AED' },
      excerpt:
        'The library will now remain open from 6:00 AM to 10:00 PM from 1st November 2026.',
      image: '/images/library_books.jpg',
      date: '5 Oct 2026',
      views: '1.2K',
      comments: 18,
      status: 'Scheduled',
      statusTimeLabel: '20 Oct 2026',
      statusSubLabel: '10:00 AM',
      priority: 'Normal',
      department: 'Central Library',
    },
    {
      id: 'notice-5',
      title: 'New Transport Routes Effective from 1st Nov',
      category: 'Transport',
      categoryTag: 'TRANSPORT',
      categoryColor: { bg: '#D5FF38', text: '#111111' },
      excerpt:
        'New transport routes and timings will be implemented from 1st November 2026. Please check the detailed route map.',
      image: '/images/campus_bus.jpg',
      date: '3 Oct 2026',
      views: '980',
      comments: 12,
      status: 'Draft',
      statusTimeLabel: 'Last edited',
      statusSubLabel: '2 days ago',
      priority: 'Normal',
      department: 'Transport Department',
    },
    {
      id: 'notice-6',
      title: 'Health & Safety Guidelines for Monsoon',
      category: 'Health & Safety',
      categoryTag: 'HEALTH & SAFETY',
      categoryColor: { bg: '#FCE7F3', text: '#E11D48' },
      excerpt:
        'Important health and safety guidelines to be followed during the monsoon season.',
      image: '/images/health_center.jpg',
      date: '1 Oct 2026',
      views: '2.1K',
      comments: 24,
      status: 'Expired',
      statusTimeLabel: 'Expired on',
      statusSubLabel: '15 Oct 2026',
      priority: 'Important',
      department: 'Campus Health Center',
    },
  ])

  // Drafts widget list
  const [draftsList, setDraftsList] = useState([
    { id: 'd-1', title: 'Project Submission Reminder', lastEdited: 'Last edited 2 days ago' },
    { id: 'd-2', title: 'Workshop Registration', lastEdited: 'Last edited 5 days ago' },
  ])

  // Scheduled widget list
  const [scheduledList, setScheduledList] = useState([
    { id: 's-1', title: 'Hostel Maintenance Notice', scheduledAt: '20 Oct 2026, 10:00 AM' },
    { id: 's-2', title: 'Alumni Meet 2026', scheduledAt: '25 Oct 2026, 09:00 AM' },
    { id: 's-3', title: 'Sports Trials Announcement', scheduledAt: '28 Oct 2026, 11:00 AM' },
  ])

  // Summary Metrics calculations
  const totalCount = 24
  const publishedCount = 18
  const scheduledCount = 3
  const draftsCount = 2
  const expiredCount = 1

  // Filter tabs definition
  const filterTabs = [
    'All Notices',
    'Published',
    'Drafts',
    'Scheduled',
    'Expired',
    'Academic',
    'Events',
    'Placements',
    'General',
  ]

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return notices.filter((item) => {
      // 1. Tab filter
      if (activeTab === 'Published' && item.status !== 'Published') return false
      if (activeTab === 'Drafts' && item.status !== 'Draft') return false
      if (activeTab === 'Scheduled' && item.status !== 'Scheduled') return false
      if (activeTab === 'Expired' && item.status !== 'Expired') return false
      if (activeTab === 'Academic' && item.category !== 'Academic') return false
      if (activeTab === 'Events' && item.category !== 'Events') return false
      if (activeTab === 'Placements' && item.category !== 'Placements') return false
      if (activeTab === 'General' && item.category !== 'General') return false
      if (activeTab === 'Transport' && item.category !== 'Transport') return false
      if (activeTab === 'Health & Safety' && item.category !== 'Health & Safety') return false

      // 2. Dropdown Category
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
        return false
      }

      // 3. Dropdown Status
      if (selectedStatus !== 'All Status' && item.status !== selectedStatus) {
        return false
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        )
      }

      return true
    }).sort((a, b) => {
      if (selectedSort === 'Oldest First') {
        return a.id.localeCompare(b.id)
      }
      if (selectedSort === 'Most Views') {
        const vA = parseFloat(a.views.replace('K', '')) * (a.views.includes('K') ? 1000 : 1)
        const vB = parseFloat(b.views.replace('K', '')) * (b.views.includes('K') ? 1000 : 1)
        return vB - vA
      }
      if (selectedSort === 'Most Comments') {
        return b.comments - a.comments
      }
      return 0 // Newest first default
    })
  }, [notices, activeTab, selectedCategory, selectedStatus, searchQuery, selectedSort])

  // Bulk actions
  const toggleSelectAll = () => {
    if (selectedNoticeIds.length === filteredNotices.length) {
      setSelectedNoticeIds([])
    } else {
      setSelectedNoticeIds(filteredNotices.map((n) => n.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedNoticeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleDuplicate = (notice: FacultyNoticeItem) => {
    const newNotice: FacultyNoticeItem = {
      ...notice,
      id: `notice-${Date.now()}`,
      title: `${notice.title} (Copy)`,
      status: 'Draft',
      statusTimeLabel: 'Last edited',
      statusSubLabel: 'Just now',
    }
    setNotices((prev) => [newNotice, ...prev])
    setActiveMenuId(null)
    addToast({
      type: 'success',
      title: 'Notice Duplicated',
      message: `Created duplicate draft "${newNotice.title}"`,
    })
  }

  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return
    setNotices((prev) => prev.filter((n) => n.id !== deleteTarget.id))
    setSelectedNoticeIds((prev) => prev.filter((id) => id !== deleteTarget.id))
    addToast({
      type: 'info',
      title: 'Notice Deleted',
      message: `"${deleteTarget.title}" was permanently removed.`,
    })
    setDeleteTarget(null)
    setActiveMenuId(null)
  }

  const handleBulkDelete = () => {
    setNotices((prev) => prev.filter((n) => !selectedNoticeIds.includes(n.id)))
    addToast({
      type: 'info',
      title: 'Notices Deleted',
      message: `Removed ${selectedNoticeIds.length} notices.`,
    })
    setSelectedNoticeIds([])
  }

  const handleBulkArchive = () => {
    setNotices((prev) =>
      prev.map((n) =>
        selectedNoticeIds.includes(n.id)
          ? { ...n, status: 'Expired', statusTimeLabel: 'Archived', statusSubLabel: 'Today' }
          : n
      )
    )
    addToast({
      type: 'success',
      title: 'Notices Archived',
      message: `Archived ${selectedNoticeIds.length} notices.`,
    })
    setSelectedNoticeIds([])
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduleNoticeTitle.trim()) {
      addToast({ type: 'warning', title: 'Please provide a notice title' })
      return
    }
    const newScheduled = {
      id: `s-${Date.now()}`,
      title: scheduleNoticeTitle,
      scheduledAt: `${scheduleDate}, ${scheduleTime}`,
    }
    setScheduledList((prev) => [newScheduled, ...prev])
    addToast({
      type: 'success',
      title: 'Notice Scheduled',
      message: `"${scheduleNoticeTitle}" scheduled for ${scheduleDate} at ${scheduleTime}.`,
    })
    setScheduleNoticeTitle('')
    setIsScheduleModalOpen(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F7',
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#111111',
      }}
      onClick={() => {
        setActiveMenuId(null)
      }}
    >
      <ToastContainer />

      {/* TOP BAR / APP HEADER */}
      <header
        style={{
          height: 68,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Brand Left */}
        <Link
          href="/faculty"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
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
                  backgroundColor: '#111111',
                }}
              >
                <Image
                  src="/images/mateen_avatar.jpg"
                  alt="Dr. Rahul Mehta"
                  fill
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
                  Faculty Dashboard
                </button>
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
          gridTemplateColumns: '220px minmax(0, 1fr) 300px',
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
              {/* 1. Dashboard */}
              <button
                type="button"
                onClick={() => router.push('/faculty')}
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
                <LayoutGrid width={17} height={17} />
                <span>Dashboard</span>
              </button>

              {/* 2. Create Announcement */}
              <button
                type="button"
                onClick={() => router.push('/faculty/create')}
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
                <span>Create Announcement</span>
              </button>

              {/* 3. Notice Templates */}
              <button
                type="button"
                onClick={() => router.push('/faculty/templates')}
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
                <span>Notice Templates</span>
              </button>

              {/* 4. My Notices (ACTIVE: Bright Acid-Lime filled pill matching Screen 18) */}
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
                  boxShadow: '0 2px 10px rgba(213,255,56,0.3)',
                }}
              >
                <FileText width={17} height={17} strokeWidth={2.5} color="#111111" />
                <span>My Notices</span>
              </button>

              {/* 5. Events */}
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

              {/* 6. Placements */}
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

              {/* 7. Academic */}
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

              {/* 8. Students */}
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

              {/* 9. Notices Management */}
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

              {/* 10. My Activity */}
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

              {/* 11. Messages */}
              <button
                type="button"
                onClick={() => router.push('/student/notifications')}
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

              {/* 12. Settings */}
              <button
                type="button"
                onClick={() => router.push('/admin/setup')}
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

          {/* Bottom Streak Widget */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 20,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            }}
            onClick={() => router.push('/student/streak')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: 'rgba(249,115,22,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flame width={18} height={18} color="#F97316" />
              </div>
              <div>
                <div style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 900 }}>
                  7 Day Streak
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 600 }}>
                  Keep engaging!
                </div>
              </div>
            </div>
            <ChevronRight width={16} height={16} color="#9CA3AF" />
          </div>
        </aside>

        {/* COLUMN 2: CENTER MAIN CONTENT */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header Row: Title + Tilted Sticker + Create Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {/* Title and Subtitle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <FileText width={26} height={26} color="#111111" strokeWidth={2.2} />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 950,
                    letterSpacing: -0.8,
                    margin: 0,
                    color: '#111111',
                    lineHeight: 1.1,
                  }}
                >
                  My Notices
                </h1>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 13,
                    color: '#6B7280',
                    fontWeight: 500,
                  }}
                >
                  Manage, edit and track all the announcements you have published.
                </p>
              </div>
            </div>

            {/* Middle Neo-Brutalist Sticker Banner */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Radiating action lines */}
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  left: -12,
                  fontSize: 12,
                  fontWeight: 900,
                  color: '#111111',
                  letterSpacing: 2,
                  userSelect: 'none',
                }}
              >
                \ \
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  right: -12,
                  fontSize: 12,
                  fontWeight: 900,
                  color: '#111111',
                  letterSpacing: 2,
                  userSelect: 'none',
                }}
              >
                / /
              </div>

              {/* Tilted Sticker */}
              <div
                style={{
                  backgroundColor: '#D5FF38',
                  transform: 'rotate(-4deg)',
                  padding: '8px 18px',
                  borderRadius: 14,
                  border: '2px solid #111111',
                  boxShadow: '3px 4px 0px #111111',
                  textAlign: 'center',
                  lineHeight: 1.1,
                  fontWeight: 950,
                  fontSize: 12,
                  letterSpacing: -0.3,
                  color: '#111111',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  userSelect: 'none',
                }}
              >
                <span>CREATE</span>
                <span>MANAGE</span>
                <span>TRACK</span>
                <span style={{ color: '#000000', textDecoration: 'underline' }}>IMPACT</span>
              </div>
            </div>

            {/* Top Right: Create New Notice Button */}
            <div>
              <button
                type="button"
                onClick={() => router.push('/faculty/create')}
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  borderRadius: 9999,
                  padding: '11px 22px',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Plus width={16} height={16} strokeWidth={3} />
                <span>Create New Notice</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              position: 'relative',
            }}
          >
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab)
                    setSelectedNoticeIds([])
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 9999,
                    border: isActive ? 'none' : '1px solid #E5E7EB',
                    backgroundColor: isActive ? '#111111' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#4B5563',
                    fontSize: 12,
                    fontWeight: isActive ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {tab}
                </button>
              )
            })}

            {/* More Tabs Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMoreTabsOpen(!isMoreTabsOpen)
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 9999,
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: '#4B5563',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>More</span>
                <ChevronDown width={13} height={13} />
              </button>

              {isMoreTabsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 40,
                    left: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    padding: 6,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid #E5E7EB',
                    zIndex: 20,
                    minWidth: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {['Transport', 'Health & Safety', 'Hostels'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setActiveTab(t)
                        setIsMoreTabsOpen(false)
                        setSelectedNoticeIds([])
                      }}
                      style={{
                        padding: '8px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: activeTab === t ? '#111111' : '#4B5563',
                        backgroundColor: activeTab === t ? '#F3F4F6' : 'transparent',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 5 Summary Metric Cards (Matching reference layout and colors) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 14,
            }}
          >
            {/* Card 1: Total Notices */}
            <div
              style={{
                backgroundColor: '#ECFEFF',
                borderRadius: 18,
                padding: '16px 14px',
                border: '1px solid #CFFAFE',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText width={17} height={17} color="#FFFFFF" />
                </div>
                <div
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <ArrowUp width={10} height={10} strokeWidth={3} />
                  <span>20%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  {totalCount}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Total Notices
                </div>
              </div>
            </div>

            {/* Card 2: Published */}
            <div
              style={{
                backgroundColor: '#F0FDF4',
                borderRadius: 18,
                padding: '16px 14px',
                border: '1px solid #DCFCE7',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckSquare width={17} height={17} color="#FFFFFF" />
                </div>
                <div
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <ArrowUp width={10} height={10} strokeWidth={3} />
                  <span>12%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  {publishedCount}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Published
                </div>
              </div>
            </div>

            {/* Card 3: Scheduled */}
            <div
              style={{
                backgroundColor: '#FEFCE8',
                borderRadius: 18,
                padding: '16px 14px',
                border: '1px solid #FEF08A',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#EAB308',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock width={17} height={17} color="#FFFFFF" />
                </div>
                <div
                  style={{
                    backgroundColor: '#FEF9C3',
                    color: '#854D0E',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <span>→ 0%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  {scheduledCount}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Scheduled
                </div>
              </div>
            </div>

            {/* Card 4: Drafts */}
            <div
              style={{
                backgroundColor: '#FDF2F8',
                borderRadius: 18,
                padding: '16px 14px',
                border: '1px solid #FBCFE8',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#DB2777',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Edit2 width={17} height={17} color="#FFFFFF" />
                </div>
                <div
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <ArrowUp width={10} height={10} strokeWidth={3} />
                  <span>100%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  {draftsCount}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Drafts
                </div>
              </div>
            </div>

            {/* Card 5: Expired */}
            <div
              style={{
                backgroundColor: '#FAF5FF',
                borderRadius: 18,
                padding: '16px 14px',
                border: '1px solid #F3E8FF',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Archive width={17} height={17} color="#FFFFFF" />
                </div>
                <div
                  style={{
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <ArrowDown width={10} height={10} strokeWidth={3} />
                  <span>50%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  {expiredCount}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Expired
                </div>
              </div>
            </div>
          </div>

          {/* Search & Sorting Controls Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                flex: 1,
                minWidth: 260,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 9999,
                padding: '8px 16px',
                border: '1px solid #E5E7EB',
                gap: 10,
              }}
            >
              <Search width={16} height={16} color="#9CA3AF" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your notices..."
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#111111',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  <X width={13} height={13} color="#9CA3AF" />
                </button>
              )}
            </div>

            {/* Dropdown Filters on Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#374151',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="All Categories">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Events">Events</option>
                <option value="Placements">Placements</option>
                <option value="General">General</option>
                <option value="Transport">Transport</option>
                <option value="Health & Safety">Health & Safety</option>
              </select>

              {/* Status Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#374151',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="All Status">All Status</option>
                <option value="Published">Published</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
                <option value="Expired">Expired</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#374151',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Most Views">Most Views</option>
                <option value="Most Comments">Most Comments</option>
              </select>
            </div>
          </div>

          {/* Bulk Selection Action Bar (when any notices are selected) */}
          {selectedNoticeIds.length > 0 && (
            <div
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 16,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="checkbox"
                  checked={selectedNoticeIds.length === filteredNotices.length}
                  onChange={toggleSelectAll}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 12, fontWeight: 700 }}>
                  {selectedNoticeIds.length} {selectedNoticeIds.length === 1 ? 'notice' : 'notices'}{' '}
                  selected
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleBulkArchive}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Archive width={13} height={13} />
                  <span>Archive Selected</span>
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Trash2 width={13} height={13} />
                  <span>Delete Selected</span>
                </button>
              </div>
            </div>
          )}

          {/* Notices Cards List (6 Cards matching Screenshot) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredNotices.length > 0 ? (
              filteredNotices.map((item) => {
                const isSelected = selectedNoticeIds.includes(item.id)
                const isMenuOpen = activeMenuId === item.id

                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 18,
                      padding: '14px 18px',
                      border: isSelected ? '1.5px solid #111111' : '1px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 6,
                        accentColor: '#111111',
                        cursor: 'pointer',
                      }}
                    />

                    {/* Thumbnail Image */}
                    <div
                      style={{
                        width: 90,
                        height: 60,
                        borderRadius: 12,
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                        backgroundColor: '#F3F4F6',
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Notice Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          flexWrap: 'wrap',
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 14,
                            fontWeight: 900,
                            color: '#111111',
                            letterSpacing: -0.3,
                            cursor: 'pointer',
                          }}
                          onClick={() => setPreviewTarget(item)}
                        >
                          {item.title}
                        </h3>
                        <span
                          style={{
                            backgroundColor: item.categoryColor.bg,
                            color: item.categoryColor.text,
                            fontSize: 9,
                            fontWeight: 900,
                            letterSpacing: 0.5,
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}
                        >
                          {item.categoryTag}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: '4px 0 6px',
                          fontSize: 12,
                          color: '#6B7280',
                          lineHeight: 1.4,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.excerpt}
                      </p>

                      {/* Meta: Date, Views, Comments */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          fontSize: 11,
                          color: '#6B7280',
                          fontWeight: 600,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar width={12} height={12} />
                          <span>{item.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Eye width={12} height={12} />
                          <span>{item.views} views</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MessageCircle width={12} height={12} />
                          <span>{item.comments} comments</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill & Time subtext */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 100,
                        textAlign: 'center',
                      }}
                    >
                      {item.status === 'Published' && (
                        <div
                          style={{
                            backgroundColor: '#DCFCE7',
                            color: '#15803D',
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: '#16A34A',
                            }}
                          />
                          <span>Published</span>
                        </div>
                      )}
                      {item.status === 'Scheduled' && (
                        <div
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: '#B45309',
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: '#D97706',
                            }}
                          />
                          <span>Scheduled</span>
                        </div>
                      )}
                      {item.status === 'Draft' && (
                        <div
                          style={{
                            backgroundColor: '#F3F4F6',
                            color: '#4B5563',
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: '#9CA3AF',
                            }}
                          />
                          <span>Draft</span>
                        </div>
                      )}
                      {item.status === 'Expired' && (
                        <div
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#B91C1C',
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: '#EF4444',
                            }}
                          />
                          <span>Expired</span>
                        </div>
                      )}

                      <div
                        style={{
                          fontSize: 10,
                          color: '#9CA3AF',
                          fontWeight: 600,
                          marginTop: 4,
                          lineHeight: 1.2,
                        }}
                      >
                        <div>{item.statusTimeLabel}</div>
                        {item.statusSubLabel && <div>{item.statusSubLabel}</div>}
                      </div>
                    </div>

                    {/* Action Buttons: Edit, Duplicate, Analytics, More */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        position: 'relative',
                      }}
                    >
                      <button
                        type="button"
                        title="Edit Notice"
                        onClick={() => router.push(`/faculty/create?edit=${item.id}`)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#4B5563',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = 'transparent')
                        }
                      >
                        <Edit2 width={15} height={15} />
                      </button>

                      <button
                        type="button"
                        title="Duplicate Notice"
                        onClick={() => handleDuplicate(item)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#4B5563',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = 'transparent')
                        }
                      >
                        <Copy width={15} height={15} />
                      </button>

                      <button
                        type="button"
                        title="View Analytics"
                        onClick={() => setAnalyticsTarget(item)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#4B5563',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = 'transparent')
                        }
                      >
                        <BarChart2 width={15} height={15} />
                      </button>

                      <button
                        type="button"
                        title="More Options"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenuId(isMenuOpen ? null : item.id)
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: 'none',
                          backgroundColor: isMenuOpen ? '#F3F4F6' : 'transparent',
                          color: '#4B5563',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <MoreHorizontal width={15} height={15} />
                      </button>

                      {/* Dropdown Menu for card */}
                      {isMenuOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 36,
                            width: 170,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 14,
                            padding: 6,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                            border: '1px solid #E5E7EB',
                            zIndex: 30,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewTarget(item)
                              setActiveMenuId(null)
                            }}
                            style={{
                              padding: '8px 10px',
                              fontSize: 12,
                              fontWeight: 600,
                              textAlign: 'left',
                              background: 'none',
                              border: 'none',
                              borderRadius: 8,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <Eye width={14} height={14} color="#6B7280" />
                            <span>Quick Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              router.push(`/faculty/create?edit=${item.id}`)
                              setActiveMenuId(null)
                            }}
                            style={{
                              padding: '8px 10px',
                              fontSize: 12,
                              fontWeight: 600,
                              textAlign: 'left',
                              background: 'none',
                              border: 'none',
                              borderRadius: 8,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <Edit2 width={14} height={14} color="#6B7280" />
                            <span>Edit Notice</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleDuplicate(item)
                              setActiveMenuId(null)
                            }}
                            style={{
                              padding: '8px 10px',
                              fontSize: 12,
                              fontWeight: 600,
                              textAlign: 'left',
                              background: 'none',
                              border: 'none',
                              borderRadius: 8,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <Copy width={14} height={14} color="#6B7280" />
                            <span>Duplicate Draft</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNotices((prev) =>
                                prev.map((n) =>
                                  n.id === item.id
                                    ? {
                                        ...n,
                                        status: 'Expired',
                                        statusTimeLabel: 'Archived',
                                        statusSubLabel: 'Just now',
                                      }
                                    : n
                                )
                              )
                              addToast({
                                type: 'info',
                                title: 'Notice Archived',
                                message: `"${item.title}" moved to archive.`,
                              })
                              setActiveMenuId(null)
                            }}
                            style={{
                              padding: '8px 10px',
                              fontSize: 12,
                              fontWeight: 600,
                              textAlign: 'left',
                              background: 'none',
                              border: 'none',
                              borderRadius: 8,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <Archive width={14} height={14} color="#6B7280" />
                            <span>Archive Notice</span>
                          </button>
                          <div style={{ height: 1, backgroundColor: '#E5E7EB', margin: '4px 0' }} />
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteTarget(item)
                              setActiveMenuId(null)
                            }}
                            style={{
                              padding: '8px 10px',
                              fontSize: 12,
                              fontWeight: 700,
                              textAlign: 'left',
                              background: 'none',
                              border: 'none',
                              borderRadius: 8,
                              color: '#EF4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <Trash2 width={14} height={14} color="#EF4444" />
                            <span>Delete Notice</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  padding: '48px 24px',
                  textAlign: 'center',
                  border: '1px solid #E5E7EB',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <Search width={22} height={22} color="#9CA3AF" />
                </div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111111' }}>
                  No notices found
                </h4>
                <p style={{ margin: '6px 0 16px', fontSize: 13, color: '#6B7280' }}>
                  No announcements matched your search or active filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('All Notices')
                    setSelectedCategory('All Categories')
                    setSelectedStatus('All Status')
                    setSearchQuery('')
                  }}
                  style={{
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 9999,
                    padding: '8px 18px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </main>

        {/* COLUMN 3: RIGHT WIDGETS COLUMN */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Widget 1: Notice Performance */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 20px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            {/* Header with Performance Dropdown */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart2 width={17} height={17} color="#111111" strokeWidth={2.5} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Notice Performance
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPerformanceMenuOpen(!isPerformanceMenuOpen)
                  }}
                  style={{
                    backgroundColor: '#F3F4F6',
                    border: 'none',
                    borderRadius: 9999,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#4B5563',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                  }}
                >
                  <span>{selectedPerformanceRange}</span>
                  <ChevronDown width={12} height={12} />
                </button>

                {isPerformanceMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 28,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 12,
                      padding: 6,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      border: '1px solid #E5E7EB',
                      zIndex: 30,
                      minWidth: 130,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All Time'].map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => {
                          setSelectedPerformanceRange(range)
                          setIsPerformanceMenuOpen(false)
                        }}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          fontSize: 11,
                          fontWeight: 600,
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          color: selectedPerformanceRange === range ? '#111111' : '#4B5563',
                          backgroundColor:
                            selectedPerformanceRange === range ? '#F3F4F6' : 'transparent',
                        }}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Metric 1: Total Views */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Eye width={17} height={17} color="#7C3AED" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111' }}>12.4K</div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Total Views</div>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <ArrowUp width={10} height={10} strokeWidth={3} />
                <span>18%</span>
              </div>
            </div>

            {/* Metric 2: Total Comments */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#FEF9C3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MessageSquare width={17} height={17} color="#854D0E" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111' }}>256</div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                    Total Comments
                  </div>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <ArrowUp width={10} height={10} strokeWidth={3} />
                <span>25%</span>
              </div>
            </div>

            {/* Metric 3: Total Shares */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0 2px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#FCE7F3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Share2 width={17} height={17} color="#DB2777" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111' }}>892</div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                    Total Shares
                  </div>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <ArrowUp width={10} height={10} strokeWidth={3} />
                <span>32%</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Quick Actions */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 20px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14,
              }}
            >
              <Zap width={17} height={17} color="#111111" strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>Quick Actions</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Action 1: Create New Notice */}
              <button
                type="button"
                onClick={() => router.push('/faculty/create')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Edit2 width={15} height={15} color="#4B5563" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                    Create New Notice
                  </span>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </button>

              {/* Action 2: Use a Template */}
              <button
                type="button"
                onClick={() => router.push('/faculty/templates')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText width={15} height={15} color="#4B5563" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                    Use a Template
                  </span>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </button>

              {/* Action 3: Schedule Notice */}
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Clock width={15} height={15} color="#4B5563" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                    Schedule Notice
                  </span>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </button>

              {/* Action 4: View Analytics */}
              <button
                type="button"
                onClick={() => setAnalyticsTarget(notices[0])}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BarChart2 width={15} height={15} color="#4B5563" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                    View Analytics
                  </span>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </button>

              {/* Action 5: Manage Categories */}
              <button
                type="button"
                onClick={() => setIsCategoriesModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Building2 width={15} height={15} color="#4B5563" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                    Manage Categories
                  </span>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </button>
            </div>
          </div>

          {/* Widget 3: Drafts (2) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 20px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
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
                <CheckSquare width={16} height={16} color="#111111" strokeWidth={2.5} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Drafts ({draftsList.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Drafts')
                  setSelectedNoticeIds([])
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#111111',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {draftsList.map((draft) => (
                <div
                  key={draft.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: '#FEF9C3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileText width={16} height={16} color="#854D0E" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#111111',
                          lineHeight: 1.2,
                          cursor: 'pointer',
                        }}
                        onClick={() => router.push('/faculty/create')}
                      >
                        {draft.title}
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                        {draft.lastEdited}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push('/faculty/create')}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#9CA3AF',
                    }}
                  >
                    <MoreHorizontal width={14} height={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: Scheduled (3) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 20px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
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
                <CalendarDays width={16} height={16} color="#111111" strokeWidth={2.5} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Scheduled ({scheduledList.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('Scheduled')
                  setSelectedNoticeIds([])
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#111111',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {scheduledList.map((sched) => (
                <div
                  key={sched.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: '#FCE7F3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Calendar width={16} height={16} color="#DB2777" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#111111',
                          lineHeight: 1.2,
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          addToast({
                            type: 'info',
                            title: sched.title,
                            message: `Scheduled release: ${sched.scheduledAt}`,
                          })
                        }}
                      >
                        {sched.title}
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                        {sched.scheduledAt}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: 'Notice Options',
                        message: `Scheduled notice: ${sched.title}`,
                      })
                    }}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#9CA3AF',
                    }}
                  >
                    <MoreHorizontal width={14} height={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL 1: ANALYTICS MODAL */}
      {analyticsTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setAnalyticsTarget(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 580,
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BarChart2 width={20} height={20} color="#D5FF38" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111111' }}>
                    Notice Analytics
                  </h3>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                    {analyticsTarget.title}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsTarget(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X width={16} height={16} color="#6B7280" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  padding: '14px 12px',
                  borderRadius: 14,
                  border: '1px solid #E5E7EB',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 950, color: '#111111' }}>
                  {analyticsTarget.views}
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, marginTop: 2 }}>
                  Total Impressions
                </div>
              </div>
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  padding: '14px 12px',
                  borderRadius: 14,
                  border: '1px solid #E5E7EB',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 950, color: '#111111' }}>
                  {analyticsTarget.comments}
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, marginTop: 2 }}>
                  Student Replies
                </div>
              </div>
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  padding: '14px 12px',
                  borderRadius: 14,
                  border: '1px solid #E5E7EB',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 950, color: '#16A34A' }}>94.2%</div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, marginTop: 2 }}>
                  Audience Reach
                </div>
              </div>
            </div>

            {/* Visual Engagement Bar Graph Simulation */}
            <div
              style={{
                backgroundColor: '#111111',
                borderRadius: 18,
                padding: '18px 20px',
                color: '#FFFFFF',
                marginBottom: 20,
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
                <span style={{ fontSize: 12, fontWeight: 800 }}>Readership Activity</span>
                <span style={{ fontSize: 10, color: '#D5FF38', fontWeight: 800 }}>
                  Peak: Day 2 (1,120 reads)
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  height: 80,
                  gap: 10,
                  padding: '6px 0',
                }}
              >
                {[
                  { day: 'Mon', h: '30%' },
                  { day: 'Tue', h: '95%' },
                  { day: 'Wed', h: '65%' },
                  { day: 'Thu', h: '80%' },
                  { day: 'Fri', h: '50%' },
                  { day: 'Sat', h: '25%' },
                  { day: 'Sun', h: '40%' },
                ].map((bar, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        backgroundColor: idx === 1 ? '#D5FF38' : 'rgba(255,255,255,0.2)',
                        height: bar.h,
                        borderRadius: 6,
                        transition: 'height 0.3s ease',
                      }}
                    />
                    <span style={{ fontSize: 9, color: '#9CA3AF' }}>{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Breakdown */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#111111', marginBottom: 8 }}>
                Audience Demographics
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { dept: 'Computer Science & Engineering', pct: '48%' },
                  { dept: 'Information Technology', pct: '26%' },
                  { dept: 'Electronics & Communication', pct: '18%' },
                  { dept: 'Other Departments', pct: '8%' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 11,
                      color: '#4B5563',
                    }}
                  >
                    <span>{item.dept}</span>
                    <span style={{ fontWeight: 800, color: '#111111' }}>{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setAnalyticsTarget(null)}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 12,
                padding: '10px 0',
                border: 'none',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK PREVIEW MODAL */}
      {previewTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setPreviewTarget(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 540,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Banner Image */}
            <div style={{ height: 160, position: 'relative', width: '100%' }}>
              <Image
                src={previewTarget.image}
                alt={previewTarget.title}
                fill
                style={{ objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => setPreviewTarget(null)}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X width={16} height={16} />
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    backgroundColor: previewTarget.categoryColor.bg,
                    color: previewTarget.categoryColor.text,
                    fontSize: 9,
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  {previewTarget.categoryTag}
                </span>
                <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                  Published by {previewTarget.department}
                </span>
              </div>

              <h2
                style={{
                  margin: '0 0 10px',
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#111111',
                  lineHeight: 1.3,
                }}
              >
                {previewTarget.title}
              </h2>

              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: '#4B5563',
                  margin: '0 0 20px',
                }}
              >
                {previewTarget.excerpt}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: 14,
                  marginBottom: 20,
                  fontSize: 11,
                  color: '#6B7280',
                  fontWeight: 700,
                }}
              >
                <div>Posted: {previewTarget.date}</div>
                <div>Status: {previewTarget.status}</div>
                <div>{previewTarget.views} views</div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    const id = previewTarget.id
                    setPreviewTarget(null)
                    router.push(`/faculty/create?edit=${id}`)
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    borderRadius: 12,
                    padding: '10px 0',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Edit2 width={14} height={14} />
                  <span>Edit in Composer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTarget(null)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#F3F4F6',
                    color: '#4B5563',
                    borderRadius: 12,
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 440,
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Trash2 width={22} height={22} color="#DC2626" />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 900, color: '#111111' }}>
              Delete Notice?
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete "{deleteTarget.title}"? Students will no
              longer see this announcement on their dashboards.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  backgroundColor: '#F3F4F6',
                  color: '#4B5563',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SCHEDULE NOTICE MODAL */}
      {isScheduleModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setIsScheduleModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 480,
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock width={20} height={20} color="#111111" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111111' }}>
                  Schedule Announcement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X width={15} height={15} color="#6B7280" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#111111',
                      marginBottom: 6,
                    }}
                  >
                    Announcement Title
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduleNoticeTitle}
                    onChange={(e) => setScheduleNoticeTitle(e.target.value)}
                    placeholder="e.g., Campus Placement Orientation Session"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '1px solid #D1D5DB',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#111111',
                        marginBottom: 6,
                      }}
                    >
                      Publish Date
                    </label>
                    <input
                      type="date"
                      required
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        border: '1px solid #D1D5DB',
                        fontSize: 13,
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#111111',
                        marginBottom: 6,
                      }}
                    >
                      Publish Time
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        border: '1px solid #D1D5DB',
                        fontSize: 13,
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#FEF9C3',
                    padding: '10px 14px',
                    borderRadius: 12,
                    fontSize: 11,
                    color: '#854D0E',
                    lineHeight: 1.4,
                  }}
                >
                  Notice will automatically be published to students' feeds on the specified date and
                  time.
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      backgroundColor: '#F3F4F6',
                      color: '#4B5563',
                      borderRadius: 12,
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      borderRadius: 12,
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Confirm Schedule
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: MANAGE CATEGORIES MODAL */}
      {isCategoriesModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setIsCategoriesModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 480,
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building2 width={20} height={20} color="#111111" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111111' }}>
                  Manage Notice Categories
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoriesModalOpen(false)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X width={15} height={15} color="#6B7280" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { name: 'Academic Notices', color: '#D5FF38', count: 8 },
                { name: 'Campus Events', color: '#FCE7F3', count: 5 },
                { name: 'Placement & Internships', color: '#E0F2FE', count: 6 },
                { name: 'General Announcements', color: '#EDE9FE', count: 3 },
                { name: 'Hostel & Transit', color: '#DCFCE7', count: 2 },
              ].map((cat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 12,
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: cat.color === '#D5FF38' ? '#111111' : cat.color,
                        border: '2px solid #111111',
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111111' }}>
                      {cat.name}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                    {cat.count} published
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsCategoriesModalOpen(false)}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 12,
                padding: '10px 0',
                border: 'none',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
