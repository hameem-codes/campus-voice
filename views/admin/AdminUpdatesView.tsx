'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  Users,
  Megaphone,
  CalendarDays,
  Briefcase,
  GraduationCap,
  Building2,
  Home,
  Bus,
  Activity,
  Settings,
  FileText,
  HelpCircle,
  Flame,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  BarChart2,
  Zap,
  Server,
  Database,
  HardDrive,
  Mail,
  ShieldCheck,
  UserPlus,
  Check,
  Send,
  Download,
  Filter,
  Eye,
  CheckSquare,
  Edit2,
  Archive,
  Trash2,
  MoreHorizontal,
  FileSpreadsheet,
  FileCheck,
  Paperclip,
  MessageSquare,
  History as HistoryIcon,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

export interface PendingNoticeItem {
  id: string
  title: string
  category: 'Announcement' | 'Event' | 'Placement' | 'Academic' | 'General'
  categoryTag: string
  categoryColor: { bg: string; text: string }
  priority: 'High' | 'Medium' | 'Low'
  authorName: string
  authorRole: string
  authorAvatar: string
  authorDepartment: string
  submittedAt: string
  excerpt: string
  image: string
  keyInfo: {
    periodLabel: string
    periodValue: string
    timings: string
    mode: string
    applicableTo: string
  }
  attachments: {
    name: string
    size: string
    type: 'pdf' | 'excel' | 'doc'
  }[]
  commentsCount: number
  history: {
    date: string
    actor: string
    action: string
  }[]
}

export function AdminUpdatesView() {
  const router = useRouter()
  const { addToast, logout, updates, approveUpdate, rejectUpdate } = useStore()

  // State
  const [activeFilterTab, setActiveFilterTab] = useState<string>('All (28)')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedSort, setSelectedSort] = useState('Newest First')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  // Selection & Active Item for Details Panel
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>('pn-1')
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([])
  const [detailsTab, setDetailsTab] = useState<'Content' | 'Attachments' | 'Comments' | 'History'>('Content')

  // Modals state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isRequestChangesModalOpen, setIsRequestChangesModalOpen] = useState(false)
  const [changesNotes, setChangesNotes] = useState('')
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null)

  // 5 Pending Approval Notices matching Screenshot
  const [pendingList, setPendingList] = useState<PendingNoticeItem[]>([
    {
      id: 'pn-1',
      title: 'Mid Semester Exam Schedule Released',
      category: 'Announcement',
      categoryTag: 'ANNOUNCEMENT',
      categoryColor: { bg: '#E0F2FE', text: '#0284C7' },
      priority: 'High',
      authorName: 'Dr. Rahul Mehta',
      authorRole: 'Faculty',
      authorAvatar: '/images/mateen_avatar.jpg',
      authorDepartment: 'Computer Science Department',
      submittedAt: '12 Oct 2026, 10:24 AM',
      excerpt:
        'The mid semester examination schedule for all departments has been prepared. Please review and approve.',
      image: '/images/campus_building.jpg',
      keyInfo: {
        periodLabel: 'Exam Period',
        periodValue: '1 Nov 2026 - 15 Nov 2026',
        timings: '09:00 AM - 12:00 PM',
        mode: 'Offline (On Campus)',
        applicableTo: 'All Undergraduate & Postgraduate Students',
      },
      attachments: [
        { name: 'Exam_Schedule_MidSem_2026.pdf', size: '1.2 MB', type: 'pdf' },
        { name: 'Room_Allocations.xlsx', size: '452 KB', type: 'excel' },
      ],
      commentsCount: 4,
      history: [
        { date: '12 Oct 2026, 10:24 AM', actor: 'Dr. Rahul Mehta', action: 'Submitted notice for administrative review' },
        { date: '12 Oct 2026, 10:25 AM', actor: 'System Bot', action: 'Automated formatting and schedule collision check passed' },
      ],
    },
    {
      id: 'pn-2',
      title: 'Garba Night 2026 – Registrations Open',
      category: 'Event',
      categoryTag: 'EVENT',
      categoryColor: { bg: '#FCE7F3', text: '#DB2777' },
      priority: 'Medium',
      authorName: 'Prof. Sneha Iyer',
      authorRole: 'Cultural Committee Head',
      authorAvatar: '/images/mateen_avatar.jpg',
      authorDepartment: 'Cultural Affairs',
      submittedAt: '11 Oct 2026, 04:15 PM',
      excerpt:
        'Annual Garba Night event for students with registration details and guidelines. Kindly review.',
      image: '/images/garba_night.jpg',
      keyInfo: {
        periodLabel: 'Event Date',
        periodValue: '15 Oct 2026',
        timings: '07:00 PM - 11:00 PM',
        mode: 'College Ground (Outdoor)',
        applicableTo: 'All Campus Students, Faculty & Staff',
      },
      attachments: [
        { name: 'Garba_Night_Flyer.pdf', size: '2.4 MB', type: 'pdf' },
        { name: 'Security_Safety_Rules.pdf', size: '780 KB', type: 'pdf' },
      ],
      commentsCount: 2,
      history: [
        { date: '11 Oct 2026, 04:15 PM', actor: 'Prof. Sneha Iyer', action: 'Submitted event proposal' },
      ],
    },
    {
      id: 'pn-3',
      title: 'Google Campus Recruitment Drive',
      category: 'Placement',
      categoryTag: 'PLACEMENT',
      categoryColor: { bg: '#E0F2FE', text: '#0284C7' },
      priority: 'High',
      authorName: 'Placement Cell',
      authorRole: 'Training & Placement Officer',
      authorAvatar: '/images/mateen_avatar.jpg',
      authorDepartment: 'Career Services',
      submittedAt: '10 Oct 2026, 11:30 AM',
      excerpt:
        'Final year students can register for the upcoming Google placement drive. Check eligibility and registration details.',
      image: '/images/placement_drive.jpg',
      keyInfo: {
        periodLabel: 'Drive Date',
        periodValue: '28 Oct 2026 - 30 Oct 2026',
        timings: '09:00 AM onwards',
        mode: 'Hybrid (Online Test + In-person Interview)',
        applicableTo: 'Final Year B.Tech & M.Tech (CSE, IT, ECE)',
      },
      attachments: [
        { name: 'Google_JD_Software_Engineer.pdf', size: '1.8 MB', type: 'pdf' },
        { name: 'Eligibility_Shortlist_Template.xlsx', size: '320 KB', type: 'excel' },
      ],
      commentsCount: 5,
      history: [
        { date: '10 Oct 2026, 11:30 AM', actor: 'Placement Officer', action: 'Uploaded placement package & job description' },
      ],
    },
    {
      id: 'pn-4',
      title: 'Library Timings Update',
      category: 'Announcement',
      categoryTag: 'ANNOUNCEMENT',
      categoryColor: { bg: '#E0F2FE', text: '#0284C7' },
      priority: 'Low',
      authorName: 'Library Committee',
      authorRole: 'Chief Librarian',
      authorAvatar: '/images/mateen_avatar.jpg',
      authorDepartment: 'Central Library Administration',
      submittedAt: '9 Oct 2026, 09:20 AM',
      excerpt:
        'The library will now remain open from 6:00 AM to 10:00 PM from 1st November 2026.',
      image: '/images/library_books.jpg',
      keyInfo: {
        periodLabel: 'Effective Date',
        periodValue: 'From 1 Nov 2026',
        timings: '06:00 AM - 10:00 PM Daily',
        mode: 'Central Library Facility',
        applicableTo: 'All Students & Research Scholars',
      },
      attachments: [
        { name: 'Library_New_Rules_2026.pdf', size: '640 KB', type: 'pdf' },
      ],
      commentsCount: 1,
      history: [
        { date: '9 Oct 2026, 09:20 AM', actor: 'Chief Librarian', action: 'Submitted operating hours revision' },
      ],
    },
    {
      id: 'pn-5',
      title: 'AI & Future of Tech Talk',
      category: 'Event',
      categoryTag: 'EVENT',
      categoryColor: { bg: '#FCE7F3', text: '#DB2777' },
      priority: 'Medium',
      authorName: 'Dr. Priya Sharma',
      authorRole: 'Associate Professor',
      authorAvatar: '/images/mateen_avatar.jpg',
      authorDepartment: 'Computer Science Department',
      submittedAt: '8 Oct 2026, 02:45 PM',
      excerpt:
        'Technical workshop on AI and its future applications. Requesting approval for event announcement.',
      image: '/images/tech_talk.jpg',
      keyInfo: {
        periodLabel: 'Session Date',
        periodValue: '5 Nov 2026',
        timings: '11:00 AM - 12:30 PM',
        mode: 'Main Auditorium',
        applicableTo: 'All Engineering & Computer Science Cohorts',
      },
      attachments: [
        { name: 'Speaker_Profile_AI_Summit.pdf', size: '1.1 MB', type: 'pdf' },
      ],
      commentsCount: 3,
      history: [
        { date: '8 Oct 2026, 02:45 PM', actor: 'Dr. Priya Sharma', action: 'Submitted speaker invitation & seminar details' },
      ],
    },
  ])

  // Selected item reference for right details panel
  const selectedNotice = useMemo(() => {
    return pendingList.find((item) => item.id === selectedNoticeId) || pendingList[0] || null
  }, [pendingList, selectedNoticeId])

  // Filter tabs list
  const filterTabs = [
    'All (28)',
    'Announcements (12)',
    'Events (8)',
    'Placement Updates (4)',
    'Academic (3)',
    'General (1)',
  ]

  // Filtered pending notices
  const filteredList = useMemo(() => {
    return pendingList.filter((item) => {
      // 1. Filter Tab
      if (activeFilterTab === 'Announcements (12)' && item.category !== 'Announcement') return false
      if (activeFilterTab === 'Events (8)' && item.category !== 'Event') return false
      if (activeFilterTab === 'Placement Updates (4)' && item.category !== 'Placement') return false
      if (activeFilterTab === 'Academic (3)' && item.category !== 'Academic') return false
      if (activeFilterTab === 'General (1)' && item.category !== 'General') return false

      // 2. Category Dropdown
      if (selectedCategory !== 'All Categories') {
        if (selectedCategory === 'Academic' && item.category !== 'Academic') return false
        if (selectedCategory === 'Events' && item.category !== 'Event') return false
        if (selectedCategory === 'Placements' && item.category !== 'Placement') return false
      }

      // 3. Department Dropdown
      if (selectedDepartment !== 'All Departments') {
        if (!item.authorDepartment.toLowerCase().includes(selectedDepartment.toLowerCase())) {
          return false
        }
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.authorName.toLowerCase().includes(q) ||
          item.authorDepartment.toLowerCase().includes(q)
        )
      }

      return true
    }).sort((a, b) => {
      if (selectedSort === 'Oldest First') {
        return a.id.localeCompare(b.id)
      }
      if (selectedSort === 'Highest Priority') {
        const pMap = { High: 3, Medium: 2, Low: 1 }
        return pMap[b.priority] - pMap[a.priority]
      }
      return 0
    })
  }, [pendingList, activeFilterTab, selectedCategory, selectedDepartment, searchQuery, selectedSort])

  // Approve notice
  const handleApprove = (notice: PendingNoticeItem) => {
    setPendingList((prev) => prev.filter((p) => p.id !== notice.id))
    setSelectedCheckboxes((prev) => prev.filter((id) => id !== notice.id))
    addToast({
      type: 'success',
      title: 'Notice Approved',
      message: `"${notice.title}" has been published to student feeds.`,
    })
    // Auto select next notice if available
    const remaining = pendingList.filter((p) => p.id !== notice.id)
    if (remaining.length > 0) {
      setSelectedNoticeId(remaining[0].id)
    }
  }

  // Reject notice
  const handleRejectSubmit = () => {
    if (!selectedNotice) return
    setPendingList((prev) => prev.filter((p) => p.id !== selectedNotice.id))
    setSelectedCheckboxes((prev) => prev.filter((id) => id !== selectedNotice.id))
    addToast({
      type: 'info',
      title: 'Notice Rejected',
      message: `"${selectedNotice.title}" was rejected with feedback.`,
    })
    setIsRejectModalOpen(false)
    setRejectReason('')
    const remaining = pendingList.filter((p) => p.id !== selectedNotice.id)
    if (remaining.length > 0) {
      setSelectedNoticeId(remaining[0].id)
    }
  }

  // Request changes
  const handleRequestChangesSubmit = () => {
    if (!selectedNotice) return
    addToast({
      type: 'warning',
      title: 'Changes Requested',
      message: `Feedback sent to ${selectedNotice.authorName}: "${changesNotes || 'Please adjust guidelines'}"`,
    })
    setIsRequestChangesModalOpen(false)
    setChangesNotes('')
  }

  // Checkbox handling
  const toggleSelectAll = () => {
    if (selectedCheckboxes.length === filteredList.length) {
      setSelectedCheckboxes([])
    } else {
      setSelectedCheckboxes(filteredList.map((item) => item.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedCheckboxes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBulkApprove = () => {
    setPendingList((prev) => prev.filter((p) => !selectedCheckboxes.includes(p.id)))
    addToast({
      type: 'success',
      title: 'Notices Approved',
      message: `Approved ${selectedCheckboxes.length} notices to production feeds.`,
    })
    setSelectedCheckboxes([])
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
      onClick={() => setActiveCardMenuId(null)}
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
          href="/admin"
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
              placeholder="Search announcements, events, placements, users, departments..."
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
                  alt="Admin"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#111111' }}>Admin</div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                  System Administrator
                </div>
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
                  Switch to Faculty
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
          maxWidth: 1560,
          margin: '0 auto',
          padding: '24px 20px',
          display: 'grid',
          gridTemplateColumns: '220px minmax(0, 1.4fr) 420px',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* COLUMN 1: LEFT DARK SIDEBAR (SUBMENU UNDER ANNOUNCEMENTS) */}
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
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* 1. Dashboard */}
              <button
                type="button"
                onClick={() => router.push('/admin')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <LayoutGrid width={16} height={16} />
                <span>Dashboard</span>
              </button>

              {/* 2. Users Management */}
              <button
                type="button"
                onClick={() => router.push('/admin/users')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Users width={16} height={16} />
                  <span>Users Management</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 3. Announcements (EXPANDED SUBMENU IN SIDEBAR) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    color: '#9CA3AF',
                    fontSize: 12.5,
                    fontWeight: 700,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Megaphone width={16} height={16} />
                    <span>Announcements</span>
                  </div>
                  <ChevronDown width={14} height={14} color="#9CA3AF" />
                </div>

                {/* Submenu Item 1: All Notices */}
                <button
                  type="button"
                  onClick={() => router.push('/faculty/updates')}
                  style={{
                    padding: '8px 16px 8px 38px',
                    borderRadius: 12,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#9CA3AF',
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <FileText width={13} height={13} />
                  <span>All Notices</span>
                </button>

                {/* Submenu Item 2: Approval Queue (ACTIVE: Highlighted in bright Acid-Lime) */}
                <button
                  type="button"
                  style={{
                    padding: '10px 16px 10px 38px',
                    borderRadius: 14,
                    border: 'none',
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    fontWeight: 950,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 2px 10px rgba(213,255,56,0.3)',
                  }}
                >
                  <Megaphone width={14} height={14} strokeWidth={2.5} color="#111111" />
                  <span>Approval Queue</span>
                </button>

                {/* Submenu Item 3: Published */}
                <button
                  type="button"
                  onClick={() => router.push('/faculty/updates')}
                  style={{
                    padding: '8px 16px 8px 38px',
                    borderRadius: 12,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#9CA3AF',
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <CheckSquare width={13} height={13} />
                  <span>Published</span>
                </button>

                {/* Submenu Item 4: Drafts */}
                <button
                  type="button"
                  onClick={() => router.push('/faculty/updates')}
                  style={{
                    padding: '8px 16px 8px 38px',
                    borderRadius: 12,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#9CA3AF',
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Edit2 width={13} height={13} />
                  <span>Drafts</span>
                </button>

                {/* Submenu Item 5: Expired */}
                <button
                  type="button"
                  onClick={() => router.push('/faculty/updates')}
                  style={{
                    padding: '8px 16px 8px 38px',
                    borderRadius: 12,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#9CA3AF',
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Clock width={13} height={13} />
                  <span>Expired</span>
                </button>
              </div>

              {/* 4. Events */}
              <button
                type="button"
                onClick={() => router.push('/student/calendar')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CalendarDays width={16} height={16} />
                  <span>Events</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 5. Placements */}
              <button
                type="button"
                onClick={() => router.push('/student/placements')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Briefcase width={16} height={16} />
                  <span>Placements</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 6. Academic */}
              <button
                type="button"
                onClick={() => router.push('/student/academic')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <GraduationCap width={16} height={16} />
                  <span>Academic</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 7. Departments */}
              <button
                type="button"
                onClick={() => router.push('/admin/setup')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Building2 width={16} height={16} />
                  <span>Departments</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 8. Hostel & Facilities */}
              <button
                type="button"
                onClick={() => router.push('/student/general')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Home width={16} height={16} />
                  <span>Hostel & Facilities</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 9. Transport */}
              <button
                type="button"
                onClick={() => router.push('/student/general')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Bus width={16} height={16} />
                  <span>Transport</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 10. Reports & Analytics */}
              <button
                type="button"
                onClick={() => router.push('/admin/analytics')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Activity width={16} height={16} />
                  <span>Reports & Analytics</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 11. System Settings */}
              <button
                type="button"
                onClick={() => router.push('/admin/setup')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Settings width={16} height={16} />
                  <span>System Settings</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 12. Audit Logs */}
              <button
                type="button"
                onClick={() => router.push('/admin/logs')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FileText width={16} height={16} />
                  <span>Audit Logs</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 13. Help & Support */}
              <button
                type="button"
                onClick={() => router.push('/student/general')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <HelpCircle width={16} height={16} />
                  <span>Help & Support</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>
            </nav>
          </div>

          {/* Bottom Streak / Health Widget */}
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
            onClick={() => router.push('/admin')}
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
                  System Healthy
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 600 }}>
                  All services running
                </div>
              </div>
            </div>
            <ChevronRight width={16} height={16} color="#9CA3AF" />
          </div>
        </aside>

        {/* COLUMN 2: CENTER APPROVAL QUEUE LIST */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Header Row: Title + Tilted Sticker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {/* Title & Subtitle */}
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
                <ShieldCheck width={26} height={26} color="#111111" strokeWidth={2.2} />
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
                  Approval Queue
                </h1>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 13,
                    color: '#6B7280',
                    fontWeight: 500,
                  }}
                >
                  Review and approve announcements, events, and updates from faculty and departments.
                </p>
              </div>
            </div>

            {/* Tilted Sticker matching Screenshot */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  left: -12,
                  fontSize: 12,
                  fontWeight: 900,
                  color: '#111111',
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
                  userSelect: 'none',
                }}
              >
                / /
              </div>

              <div
                style={{
                  backgroundColor: '#D5FF38',
                  transform: 'rotate(-4deg)',
                  padding: '8px 18px',
                  borderRadius: 14,
                  border: '2px solid #111111',
                  boxShadow: '3px 4px 0px #111111',
                  textAlign: 'center',
                  lineHeight: 1.15,
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
                <span>ENSURE</span>
                <span>ACCURATE</span>
                <span>AND RELEVANT</span>
                <span style={{ color: '#000000', textDecoration: 'underline' }}>INFORMATION</span>
              </div>
            </div>
          </div>

          {/* 4 Summary Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 14,
            }}
          >
            {/* Card 1: Pending Approvals */}
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
                  <FileText width={17} height={17} color="#FFFFFF" />
                </div>
                <div
                  style={{
                    backgroundColor: '#FCE7F3',
                    color: '#DB2777',
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
                  28
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Pending Approvals
                </div>
                <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  Needs your review
                </div>
              </div>
            </div>

            {/* Card 2: Approved This Month */}
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
                  <ShieldCheck width={17} height={17} color="#FFFFFF" />
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
                  <span>8%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  156
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Approved This Month
                </div>
                <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +12 from last month
                </div>
              </div>
            </div>

            {/* Card 3: Avg. Review Time */}
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
                  <ArrowDown width={10} height={10} strokeWidth={3} />
                  <span>25%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  12
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Avg. Review Time
                </div>
                <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  Currently 2.5 hours
                </div>
              </div>
            </div>

            {/* Card 4: Rejected This Month */}
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
                  <AlertCircle width={17} height={17} color="#FFFFFF" />
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
                  <span>20%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  6
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Rejected This Month
                </div>
                <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +2 from last month
                </div>
              </div>
            </div>
          </div>

          {/* Filter Pills Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
            }}
          >
            {filterTabs.map((tab) => {
              const isActive = activeFilterTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveFilterTab(tab)
                    setSelectedCheckboxes([])
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
          </div>

          {/* Search & Filter Dropdowns Bar */}
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
                minWidth: 240,
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
                placeholder="Search pending approvals..."
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

            {/* Dropdowns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              </select>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
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
                <option value="All Departments">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Cultural">Cultural Committee</option>
                <option value="Placement">Training & Placement</option>
                <option value="Library">Library Committee</option>
              </select>

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
                <option value="Highest Priority">Highest Priority</option>
              </select>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedCheckboxes.length > 0 && (
            <div
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 16,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="checkbox"
                  checked={selectedCheckboxes.length === filteredList.length}
                  onChange={toggleSelectAll}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 12, fontWeight: 700 }}>
                  {selectedCheckboxes.length} notices selected
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleBulkApprove}
                  style={{
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontSize: 11,
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Check width={13} height={13} strokeWidth={3} />
                  <span>Approve Selected</span>
                </button>
              </div>
            </div>
          )}

          {/* Pending Notices Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredList.map((item) => {
              const isSelected = selectedNoticeId === item.id
              const isChecked = selectedCheckboxes.includes(item.id)
              const isMenuOpen = activeCardMenuId === item.id

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedNoticeId(item.id)}
                  style={{
                    backgroundColor: isSelected ? '#FEFCE8' : '#FFFFFF',
                    borderRadius: 18,
                    padding: '14px 18px',
                    border: isSelected ? '1.5px solid #FACC15' : '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSelect(item.id)}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 6,
                      accentColor: '#111111',
                      cursor: 'pointer',
                    }}
                  />

                  {/* Thumbnail */}
                  <div
                    style={{
                      width: 76,
                      height: 56,
                      borderRadius: 12,
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                      backgroundColor: '#F3F4F6',
                    }}
                  >
                    <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span
                        style={{
                          backgroundColor: item.categoryColor.bg,
                          color: item.categoryColor.text,
                          fontSize: 8.5,
                          fontWeight: 900,
                          padding: '2px 7px',
                          borderRadius: 5,
                        }}
                      >
                        {item.categoryTag}
                      </span>

                      {/* Priority Badge */}
                      <span
                        style={{
                          backgroundColor:
                            item.priority === 'High'
                              ? '#FEE2E2'
                              : item.priority === 'Medium'
                              ? '#FEF3C7'
                              : '#DCFCE7',
                          color:
                            item.priority === 'High'
                              ? '#DC2626'
                              : item.priority === 'Medium'
                              ? '#D97706'
                              : '#15803D',
                          fontSize: 8.5,
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: 9999,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            backgroundColor:
                              item.priority === 'High'
                                ? '#DC2626'
                                : item.priority === 'Medium'
                                ? '#D97706'
                                : '#15803D',
                          }}
                        />
                        <span>{item.priority === 'High' ? 'High Priority' : item.priority}</span>
                      </span>
                    </div>

                    <h3
                      style={{
                        margin: '0 0 2px',
                        fontSize: 13.5,
                        fontWeight: 900,
                        color: '#111111',
                        letterSpacing: -0.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </h3>

                    <div style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 600 }}>
                      {item.authorName} · {item.authorDepartment}
                    </div>
                    <div style={{ fontSize: 9.5, color: '#9CA3AF', marginTop: 1 }}>
                      Submitted {item.submittedAt}
                    </div>

                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: 11,
                        color: '#4B5563',
                        lineHeight: 1.35,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.excerpt}
                    </p>
                  </div>

                  {/* Actions Column matching screenshot */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexShrink: 0,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedNoticeId(item.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 10,
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#FFFFFF',
                        color: '#374151',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Eye width={12} height={12} />
                      <span>Preview</span>
                    </button>

                    {/* Approve Button (Acid-Lime) */}
                    <button
                      type="button"
                      onClick={() => handleApprove(item)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 10,
                        border: 'none',
                        backgroundColor: '#D5FF38',
                        color: '#111111',
                        fontSize: 11,
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        boxShadow: '0 2px 6px rgba(213,255,56,0.3)',
                      }}
                    >
                      <Check width={12} height={12} strokeWidth={3} />
                      <span>Approve</span>
                    </button>

                    {/* Reject Button (Soft Red) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNoticeId(item.id)
                        setIsRejectModalOpen(true)
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 10,
                        border: 'none',
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <X width={12} height={12} strokeWidth={3} />
                      <span>Reject</span>
                    </button>

                    {/* More Menu */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveCardMenuId(isMenuOpen ? null : item.id)
                      }}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        padding: 2,
                      }}
                    >
                      <MoreHorizontal width={15} height={15} />
                    </button>

                    {/* Menu Dropdown */}
                    {isMenuOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          right: 18,
                          top: 48,
                          backgroundColor: '#FFFFFF',
                          borderRadius: 12,
                          padding: 6,
                          boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                          border: '1px solid #E5E7EB',
                          zIndex: 30,
                          minWidth: 150,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedNoticeId(item.id)
                            setIsRequestChangesModalOpen(true)
                            setActiveCardMenuId(null)
                          }}
                          style={{
                            padding: '6px 10px',
                            fontSize: 11,
                            fontWeight: 700,
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          Request Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            router.push(`/faculty/create?edit=${item.id}`)
                            setActiveCardMenuId(null)
                          }}
                          style={{
                            padding: '6px 10px',
                            fontSize: 11,
                            fontWeight: 700,
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          Edit Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </main>

        {/* COLUMN 3: RIGHT SELECTED NOTICE DETAILS PANEL */}
        {selectedNotice && (
          <aside
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: '20px 22px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              position: 'sticky',
              top: 84,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              maxHeight: 'calc(100vh - 108px)',
              overflowY: 'auto',
            }}
          >
            {/* Header: Notice Details + Close button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText width={17} height={17} color="#111111" strokeWidth={2.5} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Notice Details
                </span>
              </div>
              <button
                type="button"
                onClick={() => addToast({ type: 'info', title: 'Panel active' })}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#6B7280',
                }}
              >
                <X width={16} height={16} />
              </button>
            </div>

            {/* Tag + Priority Pill */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  backgroundColor: selectedNotice.categoryColor.bg,
                  color: selectedNotice.categoryColor.text,
                  fontSize: 9,
                  fontWeight: 900,
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                {selectedNotice.categoryTag}
              </span>
              <span
                style={{
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  fontSize: 9,
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#DC2626' }} />
                <span>{selectedNotice.priority === 'High' ? 'High Priority' : selectedNotice.priority}</span>
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 950,
                color: '#111111',
                lineHeight: 1.25,
              }}
            >
              {selectedNotice.title}
            </h2>

            {/* Author Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 10,
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Image
                    src={selectedNotice.authorAvatar}
                    alt={selectedNotice.authorName}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111' }}>
                    By {selectedNotice.authorName}
                  </div>
                  <div style={{ fontSize: 9.5, color: '#6B7280' }}>
                    {selectedNotice.authorDepartment}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 9, color: '#9CA3AF' }}>
                <div>Submitted</div>
                <div style={{ fontWeight: 600 }}>{selectedNotice.submittedAt}</div>
              </div>
            </div>

            {/* Content Tabs (Content, Attachments, Comments, History) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#F3F4F6',
                padding: 3,
                borderRadius: 9999,
              }}
            >
              {(['Content', 'Attachments', 'Comments', 'History'] as const).map((tab) => {
                const isActive = detailsTab === tab
                const countBadge =
                  tab === 'Attachments'
                    ? ` (${selectedNotice.attachments.length})`
                    : tab === 'Comments'
                    ? ` (${selectedNotice.commentsCount})`
                    : ''

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDetailsTab(tab)}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: 9999,
                      border: 'none',
                      backgroundColor: isActive ? '#111111' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#4B5563',
                      fontSize: 10.5,
                      fontWeight: isActive ? 800 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tab}
                    {countBadge}
                  </button>
                )
              })}
            </div>

            {/* TAB CONTENT 1: CONTENT */}
            {detailsTab === 'Content' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Hero Preview Image */}
                <div
                  style={{
                    height: 140,
                    borderRadius: 14,
                    overflow: 'hidden',
                    position: 'relative',
                    width: '100%',
                    backgroundColor: '#F3F4F6',
                  }}
                >
                  <Image
                    src={selectedNotice.image}
                    alt={selectedNotice.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Excerpt Body */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 11.5,
                    lineHeight: 1.55,
                    color: '#4B5563',
                  }}
                >
                  The mid semester examination schedule for all departments has been prepared and is
                  now available for students. Please check the detailed timetable, room allocations,
                  and important guidelines.
                </p>

                {/* Key Information Box */}
                <div
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: 14,
                    padding: '12px 14px',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#111111', marginBottom: 2 }}>
                    Key Information
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5 }}>
                    <CalendarDays width={13} height={13} color="#6B7280" />
                    <span style={{ color: '#6B7280', width: 90 }}>
                      {selectedNotice.keyInfo.periodLabel}:
                    </span>
                    <span style={{ fontWeight: 800, color: '#111111' }}>
                      {selectedNotice.keyInfo.periodValue}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5 }}>
                    <Clock width={13} height={13} color="#6B7280" />
                    <span style={{ color: '#6B7280', width: 90 }}>Timings:</span>
                    <span style={{ fontWeight: 800, color: '#111111' }}>
                      {selectedNotice.keyInfo.timings}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5 }}>
                    <MapPin width={13} height={13} color="#6B7280" />
                    <span style={{ color: '#6B7280', width: 90 }}>Mode:</span>
                    <span style={{ fontWeight: 800, color: '#111111' }}>
                      {selectedNotice.keyInfo.mode}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5 }}>
                    <Users width={13} height={13} color="#6B7280" />
                    <span style={{ color: '#6B7280', width: 90 }}>Applicable To:</span>
                    <span style={{ fontWeight: 800, color: '#111111' }}>
                      {selectedNotice.keyInfo.applicableTo}
                    </span>
                  </div>
                </div>

                {/* Attachments Section */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Paperclip width={14} height={14} color="#111111" />
                      <span style={{ fontSize: 11, fontWeight: 900, color: '#111111' }}>
                        Attachments ({selectedNotice.attachments.length})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addToast({
                          type: 'success',
                          title: 'Downloaded All',
                          message: `Downloaded ${selectedNotice.attachments.length} files.`,
                        })
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 10,
                        fontWeight: 800,
                        color: '#0284C7',
                        cursor: 'pointer',
                      }}
                    >
                      Download All
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedNotice.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 10,
                          backgroundColor: '#F9FAFB',
                          border: '1px solid #E5E7EB',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 6,
                              backgroundColor: att.type === 'pdf' ? '#FEE2E2' : '#DCFCE7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 9,
                              fontWeight: 900,
                              color: att.type === 'pdf' ? '#DC2626' : '#15803D',
                            }}
                          >
                            {att.type === 'pdf' ? 'PDF' : 'XLS'}
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#111111' }}>
                              {att.name}
                            </div>
                            <div style={{ fontSize: 9.5, color: '#9CA3AF' }}>{att.size}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            addToast({
                              type: 'success',
                              title: 'Download Started',
                              message: att.name,
                            })
                          }
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#6B7280',
                          }}
                        >
                          <Download width={13} height={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: ATTACHMENTS */}
            {detailsTab === 'Attachments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedNotice.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                        {att.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                        Size: {att.size} · Format: {att.type.toUpperCase()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addToast({ type: 'success', title: 'File Downloaded', message: att.name })
                      }
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        backgroundColor: '#111111',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: 10.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Download width={12} height={12} />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT 3: COMMENTS */}
            {detailsTab === 'Comments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { user: 'Academic Dean', role: 'Reviewer', text: 'Please verify room allocations for morning slots.', time: '2 hours ago' },
                  { user: 'Registrar Office', role: 'Staff', text: 'Exam dates confirmed against the academic calendar.', time: '3 hours ago' },
                ].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 800 }}>
                      <span style={{ color: '#111111' }}>{c.user} ({c.role})</span>
                      <span style={{ color: '#9CA3AF', fontWeight: 500 }}>{c.time}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#4B5563', marginTop: 4 }}>{c.text}</div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT 4: HISTORY */}
            {detailsTab === 'History' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedNotice.history.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      borderLeft: '3px solid #D5FF38',
                      backgroundColor: '#F9FAFB',
                      fontSize: 10.5,
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#111111' }}>{h.action}</div>
                    <div style={{ fontSize: 9.5, color: '#6B7280', marginTop: 2 }}>
                      By {h.actor} · {h.date}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Actions Row (Sticky Buttons) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1.2fr',
                gap: 8,
                marginTop: 'auto',
                paddingTop: 10,
                borderTop: '1px solid #F3F4F6',
              }}
            >
              <button
                type="button"
                onClick={() => setIsRequestChangesModalOpen(true)}
                style={{
                  padding: '9px 8px',
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Request Changes
              </button>

              <button
                type="button"
                onClick={() => setIsRejectModalOpen(true)}
                style={{
                  padding: '9px 8px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  fontSize: 11,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <X width={13} height={13} strokeWidth={3} />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedNotice)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  fontSize: 11.5,
                  fontWeight: 950,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  boxShadow: '0 2px 8px rgba(213,255,56,0.3)',
                }}
              >
                <Check width={14} height={14} strokeWidth={3} />
                <span>Approve</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* MODAL 1: REJECT CONFIRMATION MODAL */}
      {isRejectModalOpen && selectedNotice && (
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
          onClick={() => setIsRejectModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 460,
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
                marginBottom: 14,
              }}
            >
              <AlertCircle width={22} height={22} color="#DC2626" />
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 900, color: '#111111' }}>
              Reject Announcement
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#6B7280', lineHeight: 1.5 }}>
              Provide the publisher ({selectedNotice.authorName}) with a specific reason for rejection
              so they can make required revisions.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Missing venue confirmation from facility administration..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid #D1D5DB',
                fontSize: 12,
                outline: 'none',
                resize: 'none',
                marginBottom: 16,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  backgroundColor: '#F3F4F6',
                  color: '#4B5563',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REQUEST CHANGES MODAL */}
      {isRequestChangesModalOpen && selectedNotice && (
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
          onClick={() => setIsRequestChangesModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 460,
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 900, color: '#111111' }}>
              Request Changes
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#6B7280', lineHeight: 1.5 }}>
              Send revision instructions to {selectedNotice.authorName}. The notice remains in draft
              mode for the author until resubmitted.
            </p>

            <textarea
              rows={4}
              value={changesNotes}
              onChange={(e) => setChangesNotes(e.target.value)}
              placeholder="e.g., Please update the room allocation timetable attachment to reflect recent lab maintenance..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid #D1D5DB',
                fontSize: 12,
                outline: 'none',
                resize: 'none',
                marginBottom: 16,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsRequestChangesModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  backgroundColor: '#F3F4F6',
                  color: '#4B5563',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestChangesSubmit}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Send Instructions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
