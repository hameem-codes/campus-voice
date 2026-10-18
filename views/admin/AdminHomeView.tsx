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
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

export function AdminHomeView() {
  const router = useRouter()
  const { addToast, logout, adminMetrics, updates } = useStore()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [activityTimeRange, setActivityTimeRange] = useState('Last 30 Days')
  const [isActivityRangeOpen, setIsActivityRangeOpen] = useState(false)
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{
    date: string
    notices: number
    events: number
    placements: number
    registrations: number
    x: number
    y: number
  } | null>(null)

  // Interactive Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false)
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false)
  const [isPendingApprovalsModalOpen, setIsPendingApprovalsModalOpen] = useState(false)
  const [isSystemStatusModalOpen, setIsSystemStatusModalOpen] = useState(false)

  // Form states
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'Student',
    department: 'Computer Science',
  })

  const [newEventForm, setNewEventForm] = useState({
    title: '',
    date: '2026-10-28',
    time: '10:00 AM - 01:00 PM',
    venue: 'Main Auditorium',
    category: 'Workshop',
  })

  const [reportType, setReportType] = useState('Campus Engagement & Reach Report')
  const [reportFormat, setReportFormat] = useState('PDF')

  // Pending Approvals List State
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'pa-1',
      type: 'user',
      title: 'New User Registrations',
      subtitle: 'Awaiting approval',
      count: 28,
      items: [
        'Aarav Sharma (Student - CS Year 1)',
        'Diya Patel (Student - Design Year 2)',
        'Prof. Anand Verma (Faculty - ECE)',
      ],
    },
    {
      id: 'pa-2',
      type: 'event',
      title: 'Event Requests',
      subtitle: 'Awaiting approval',
      count: 5,
      items: ['Robotics Hackathon 2026', 'Inter-College Debate Cup'],
    },
    {
      id: 'pa-3',
      type: 'placement',
      title: 'Placement Updates',
      subtitle: 'Awaiting approval',
      count: 3,
      items: ['Microsoft Final Shortlist Notice', 'Goldman Sachs Interview Schedule'],
    },
    {
      id: 'pa-4',
      type: 'department',
      title: 'Department Requests',
      subtitle: 'Awaiting approval',
      count: 2,
      items: ['Physics Lab Equipment Allocation', 'Mechanical Workshop Schedule Change'],
    },
  ])

  // Handle Approve Shortcut
  const handleApproveItem = (id: string, name: string) => {
    setPendingApprovals((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              count: Math.max(0, item.count - 1),
              items: item.items.filter((i) => i !== name),
            }
          : item
      )
    )
    addToast({
      type: 'success',
      title: 'Approval Confirmed',
      message: `Approved: "${name}"`,
    })
  }

  // Handle Add User Form Submission
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserForm.name || !newUserForm.email) {
      addToast({ type: 'warning', title: 'Please fill in all required fields' })
      return
    }
    addToast({
      type: 'success',
      title: 'User Account Created',
      message: `Successfully registered ${newUserForm.name} (${newUserForm.role})`,
    })
    setNewUserForm({
      name: '',
      email: '',
      role: 'Student',
      department: 'Computer Science',
    })
    setIsAddUserModalOpen(false)
  }

  // Handle Create Event Submission
  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEventForm.title) {
      addToast({ type: 'warning', title: 'Please provide event title' })
      return
    }
    addToast({
      type: 'success',
      title: 'Event Scheduled',
      message: `"${newEventForm.title}" published to campus calendar.`,
    })
    setIsCreateEventModalOpen(false)
  }

  // Chart data points for Platform Activity
  const activityData = [
    { date: 'Sep 15', notices: 45, events: 15, placements: 10, registrations: 30 },
    { date: 'Sep 18', notices: 40, events: 25, placements: 20, registrations: 45 },
    { date: 'Sep 21', notices: 65, events: 35, placements: 30, registrations: 50 },
    { date: 'Sep 24', notices: 80, events: 50, placements: 25, registrations: 60 },
    { date: 'Sep 27', notices: 130, events: 65, placements: 40, registrations: 85 },
    { date: 'Sep 30', notices: 110, events: 80, placements: 45, registrations: 70 },
    { date: 'Oct 3', notices: 145, events: 60, placements: 55, registrations: 95 },
    { date: 'Oct 6', notices: 135, events: 90, placements: 65, registrations: 110 },
    { date: 'Oct 9', notices: 165, events: 75, placements: 70, registrations: 90 },
    { date: 'Oct 12', notices: 150, events: 110, placements: 60, registrations: 80 },
    { date: 'Oct 15', notices: 175, events: 95, placements: 80, registrations: 75 },
  ]

  // SVG Chart Dimensions
  const chartW = 520
  const chartH = 160
  const chartMaxY = 200

  // Generate SVG path for a line series
  const getPathD = (key: 'notices' | 'events' | 'placements' | 'registrations') => {
    return activityData
      .map((pt, i) => {
        const x = (i / (activityData.length - 1)) * (chartW - 40) + 30
        const y = chartH - (pt[key] / chartMaxY) * (chartH - 30) - 15
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
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
          gridTemplateColumns: '220px minmax(0, 1fr) 280px',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* COLUMN 1: LEFT DARK SIDEBAR (13 Items + System Healthy) */}
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
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {/* 1. Dashboard (ACTIVE: Acid-lime filled pill matching screenshot) */}
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
                <LayoutGrid width={17} height={17} strokeWidth={2.5} color="#111111" />
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
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Users width={16} height={16} />
                  <span>Users Management</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

              {/* 3. Announcements */}
              <button
                type="button"
                onClick={() => router.push('/admin/updates')}
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
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Megaphone width={16} height={16} />
                  <span>Announcements</span>
                </div>
                <ChevronRight width={14} height={14} color="#6B7280" />
              </button>

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
                  transition: 'all 0.15s ease',
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
                  transition: 'all 0.15s ease',
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
                  transition: 'all 0.15s ease',
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
                  transition: 'all 0.15s ease',
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
                  transition: 'all 0.15s ease',
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
                  transition: 'all 0.15s ease',
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
                  transition: 'all 0.15s ease',
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
                  transition: 'all 0.15s ease',
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
                  transition: 'all 0.15s ease',
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
                  transition: 'all 0.15s ease',
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

          {/* Bottom System Status Widget */}
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
            onClick={() => setIsSystemStatusModalOpen(true)}
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

        {/* COLUMN 2: CENTER MAIN DASHBOARD */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* HERO BANNER CARD */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #E5E7EB',
              display: 'flex',
              minHeight: 180,
            }}
          >
            {/* Left Content */}
            <div
              style={{
                flex: 1.2,
                padding: '24px 28px',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#6B7280',
                  marginBottom: 4,
                }}
              >
                <Megaphone width={14} height={14} color="#6B7280" />
                <span>Welcome Back,</span>
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 36,
                  fontWeight: 950,
                  letterSpacing: -1,
                  color: '#111111',
                  lineHeight: 1.1,
                }}
              >
                Admin
              </h1>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: 13,
                  color: '#4B5563',
                  fontWeight: 500,
                  maxWidth: 420,
                  lineHeight: 1.4,
                }}
              >
                Manage your campus platform, monitor activity, and keep everything running smoothly.
              </p>
            </div>

            {/* Right Campus Building Image & Tilted Sticker */}
            <div
              style={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                minHeight: 180,
              }}
            >
              <Image
                src="/images/campus_building.jpg"
                alt="Campus"
                fill
                style={{
                  objectFit: 'cover',
                  maskImage: 'linear-gradient(to right, transparent, black 30%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)',
                }}
              />

              {/* Tilted Sticker over Image */}
              <div
                style={{
                  position: 'absolute',
                  right: 28,
                  top: '50%',
                  transform: 'translateY(-50%) rotate(-4deg)',
                  zIndex: 3,
                }}
              >
                {/* Sunburst Lines */}
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
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
                    top: -12,
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
                    border: '2px solid #111111',
                    boxShadow: '3px 4px 0px #111111',
                    borderRadius: 14,
                    padding: '8px 16px',
                    textAlign: 'center',
                    lineHeight: 1.15,
                    fontWeight: 950,
                    fontSize: 12,
                    letterSpacing: -0.3,
                    color: '#111111',
                  }}
                >
                  <div>A MORE</div>
                  <div>CONNECTED</div>
                  <div>CAMPUS</div>
                  <div style={{ color: '#000000', textDecoration: 'underline' }}>FOR EVERYONE</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 KPI METRIC CARDS (Horizontal Row) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 14,
            }}
          >
            {/* KPI 1: Total Students */}
            <div
              style={{
                backgroundColor: '#ECFEFF',
                borderRadius: 20,
                padding: '16px 16px',
                border: '1px solid #CFFAFE',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users width={18} height={18} color="#FFFFFF" />
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
                  12,456
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Total Students
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +312 this month
                </div>
              </div>
            </div>

            {/* KPI 2: Faculty Members */}
            <div
              style={{
                backgroundColor: '#FDF2F8',
                borderRadius: 20,
                padding: '16px 16px',
                border: '1px solid #FCE7F3',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#DB2777',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GraduationCap width={18} height={18} color="#FFFFFF" />
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
                  <span>5%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  486
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Faculty Members
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +21 this month
                </div>
              </div>
            </div>

            {/* KPI 3: Total Notices */}
            <div
              style={{
                backgroundColor: '#FAF5FF',
                borderRadius: 20,
                padding: '16px 16px',
                border: '1px solid #F3E8FF',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText width={18} height={18} color="#FFFFFF" />
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
                  1,284
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Total Notices
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +136 this month
                </div>
              </div>
            </div>

            {/* KPI 4: Total Events */}
            <div
              style={{
                backgroundColor: '#FEFCE8',
                borderRadius: 20,
                padding: '16px 16px',
                border: '1px solid #FEF08A',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#EAB308',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CalendarDays width={18} height={18} color="#FFFFFF" />
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
              <div>
                <div style={{ fontSize: 26, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  342
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Total Events
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +52 this month
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE ROW 1: CHARTS (Platform Activity + User Distribution) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.45fr 1fr',
              gap: 16,
            }}
          >
            {/* Chart 1: Platform Activity Multi-Line Chart */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '18px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart2 width={17} height={17} color="#111111" strokeWidth={2.5} />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>
                    Platform Activity
                  </span>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 10, fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#D5FF38', border: '1px solid #111111' }} />
                    <span style={{ color: '#4B5563' }}>Notices</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F472B6' }} />
                    <span style={{ color: '#4B5563' }}>Events</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#A78BFA' }} />
                    <span style={{ color: '#4B5563' }}>Placements</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#60A5FA' }} />
                    <span style={{ color: '#4B5563' }}>User Registrations</span>
                  </div>
                </div>

                {/* Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsActivityRangeOpen(!isActivityRangeOpen)}
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
                    <span>{activityTimeRange}</span>
                    <ChevronDown width={12} height={12} />
                  </button>

                  {isActivityRangeOpen && (
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
                        minWidth: 120,
                      }}
                    >
                      {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setActivityTimeRange(r)
                            setIsActivityRangeOpen(false)
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
                            color: activityTimeRange === r ? '#111111' : '#4B5563',
                            backgroundColor: activityTimeRange === r ? '#F3F4F6' : 'transparent',
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive SVG Chart */}
              <div style={{ position: 'relative', width: '100%', height: chartH + 20 }}>
                <svg
                  viewBox={`0 0 ${chartW} ${chartH + 20}`}
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                >
                  {/* Grid Lines and Y-Axis */}
                  {[0, 50, 100, 150, 200].map((val) => {
                    const y = chartH - (val / chartMaxY) * (chartH - 30) - 15
                    return (
                      <g key={val}>
                        <text
                          x="0"
                          y={y + 3}
                          fontSize="9"
                          fill="#9CA3AF"
                          fontWeight="600"
                        >
                          {val}
                        </text>
                        <line
                          x1="26"
                          y1={y}
                          x2={chartW - 10}
                          y2={y}
                          stroke="#F3F4F6"
                          strokeDasharray={val === 0 ? 'none' : '3 3'}
                        />
                      </g>
                    )
                  })}

                  {/* Series 4: User Registrations (Blue) */}
                  <path
                    d={getPathD('registrations')}
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Series 3: Placements (Purple) */}
                  <path
                    d={getPathD('placements')}
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Series 2: Events (Pink) */}
                  <path
                    d={getPathD('events')}
                    fill="none"
                    stroke="#F472B6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Series 1: Notices (Acid Lime / Yellow) */}
                  <path
                    d={getPathD('notices')}
                    fill="none"
                    stroke="#D5FF38"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Data Points on Notices Line */}
                  {activityData.map((pt, i) => {
                    const x = (i / (activityData.length - 1)) * (chartW - 40) + 30
                    const y = chartH - (pt.notices / chartMaxY) * (chartH - 30) - 15
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="#D5FF38"
                        stroke="#111111"
                        strokeWidth="1.5"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() =>
                          setHoveredChartPoint({
                            ...pt,
                            x,
                            y,
                          })
                        }
                        onMouseLeave={() => setHoveredChartPoint(null)}
                      />
                    )
                  })}

                  {/* X-Axis Dates */}
                  {activityData.map((pt, i) => {
                    const x = (i / (activityData.length - 1)) * (chartW - 40) + 30
                    return (
                      <text
                        key={pt.date}
                        x={x}
                        y={chartH + 14}
                        fontSize="8.5"
                        fill="#9CA3AF"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {pt.date}
                      </text>
                    )
                  })}
                </svg>

                {/* Hover Tooltip */}
                {hoveredChartPoint && (
                  <div
                    style={{
                      position: 'absolute',
                      left: hoveredChartPoint.x - 50,
                      top: Math.max(0, hoveredChartPoint.y - 65),
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      borderRadius: 10,
                      padding: '6px 10px',
                      fontSize: 10,
                      pointerEvents: 'none',
                      zIndex: 10,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#D5FF38', marginBottom: 2 }}>
                      {hoveredChartPoint.date}
                    </div>
                    <div>Notices: {hoveredChartPoint.notices}</div>
                    <div>Events: {hoveredChartPoint.events}</div>
                    <div>Placements: {hoveredChartPoint.placements}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Chart 2: User Distribution Donut Chart */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '18px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Users width={17} height={17} color="#111111" strokeWidth={2.5} />
                <span style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>
                  User Distribution
                </span>
              </div>

              {/* Donut Chart & Breakdown Table */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Donut graphic */}
                <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {/* Background Circle */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F3F4F6" strokeWidth="16" />
                    {/* Students (78% = 239/239) -> Lime */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#D5FF38"
                      strokeWidth="16"
                      strokeDasharray="186 239"
                      strokeDashoffset="0"
                    />
                    {/* Faculty (12%) -> Pink */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#EC4899"
                      strokeWidth="16"
                      strokeDasharray="29 239"
                      strokeDashoffset="-186"
                    />
                    {/* Staff (6%) -> Purple */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#8B5CF6"
                      strokeWidth="16"
                      strokeDasharray="14 239"
                      strokeDashoffset="-215"
                    />
                    {/* Others (4%) -> Blue */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#3B82F6"
                      strokeWidth="16"
                      strokeDasharray="10 239"
                      strokeDashoffset="-229"
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
                      lineHeight: 1.1,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>12,456</span>
                    <span style={{ fontSize: 8.5, color: '#6B7280', fontWeight: 700 }}>
                      Total Users
                    </span>
                  </div>
                </div>

                {/* Legend List */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Students', pct: '78%', count: '9,712', color: '#D5FF38' },
                    { label: 'Faculty', pct: '12%', count: '1,486', color: '#EC4899' },
                    { label: 'Staff', pct: '6%', count: '742', color: '#8B5CF6' },
                    { label: 'Others', pct: '4%', count: '516', color: '#3B82F6' },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 11,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: row.color,
                            border: row.color === '#D5FF38' ? '1px solid #111111' : 'none',
                          }}
                        />
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>{row.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, color: '#111111' }}>{row.pct}</span>
                        <span style={{ color: '#9CA3AF', fontSize: 10 }}>{row.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE ROW 2: 3 COLUMNS (Recent Announcements + Upcoming Events + Pending Approvals) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.2fr 1fr',
              gap: 16,
            }}
          >
            {/* Card 1: Recent Announcements */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '18px 18px',
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
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Recent Announcements
                </span>
                <button
                  type="button"
                  onClick={() => router.push('/faculty/updates')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#111111',
                    cursor: 'pointer',
                  }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Item 1 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src="/images/mid_sem_exam.jpg"
                      alt="Mid Semester Exam"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#111111',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                        }}
                        onClick={() => router.push('/faculty/updates')}
                      >
                        Mid Semester Exam Schedule Released
                      </div>
                      <span
                        style={{
                          backgroundColor: '#D5FF38',
                          color: '#111111',
                          fontSize: 8,
                          fontWeight: 900,
                          padding: '2px 5px',
                          borderRadius: 4,
                        }}
                      >
                        ACADEMIC
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                      6 hours ago · 2.3K views · 💬 45 comments
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src="/images/library_books.jpg"
                      alt="Library Timings"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#111111',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                        }}
                        onClick={() => router.push('/faculty/updates')}
                      >
                        Library Timings Update
                      </div>
                      <span
                        style={{
                          backgroundColor: '#EDE9FE',
                          color: '#7C3AED',
                          fontSize: 8,
                          fontWeight: 900,
                          padding: '2px 5px',
                          borderRadius: 4,
                        }}
                      >
                        GENERAL
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                      1 day ago · 1.2K views · 💬 18 comments
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src="/images/garba_night.jpg"
                      alt="Garba Night"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#111111',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                        }}
                        onClick={() => router.push('/faculty/updates')}
                      >
                        Garba Night 2026 - Registrations Open
                      </div>
                      <span
                        style={{
                          backgroundColor: '#FCE7F3',
                          color: '#DB2777',
                          fontSize: 8,
                          fontWeight: 900,
                          padding: '2px 5px',
                          borderRadius: 4,
                        }}
                      >
                        EVENTS
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                      2 days ago · 1.8K views · 💬 32 comments
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Upcoming Events */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '18px 18px',
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
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Upcoming Events
                </span>
                <button
                  type="button"
                  onClick={() => router.push('/student/calendar')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#111111',
                    cursor: 'pointer',
                  }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Event 1 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: '#F3F4F6',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                      15
                    </span>
                    <span style={{ fontSize: 8.5, fontWeight: 800, color: '#6B7280' }}>OCT</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#111111',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                        }}
                        onClick={() => router.push('/student/calendar')}
                      >
                        Garba Night 2026
                      </div>
                      <span
                        style={{
                          backgroundColor: '#FCE7F3',
                          color: '#DB2777',
                          fontSize: 8,
                          fontWeight: 900,
                          padding: '2px 5px',
                          borderRadius: 4,
                        }}
                      >
                        EVENT
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, marginTop: 2 }}>
                      07:00 PM - 11:00 PM · College Ground
                    </div>
                    <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600 }}>
                      324 registered
                    </div>
                  </div>
                </div>

                {/* Event 2 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: '#F3F4F6',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                      22
                    </span>
                    <span style={{ fontSize: 8.5, fontWeight: 800, color: '#6B7280' }}>OCT</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#111111',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                        }}
                        onClick={() => router.push('/student/calendar')}
                      >
                        Technical Workshop
                      </div>
                      <span
                        style={{
                          backgroundColor: '#EDE9FE',
                          color: '#7C3AED',
                          fontSize: 8,
                          fontWeight: 900,
                          padding: '2px 5px',
                          borderRadius: 4,
                        }}
                      >
                        WORKSHOP
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, marginTop: 2 }}>
                      10:00 AM - 01:00 PM · Seminar Hall
                    </div>
                    <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600 }}>
                      156 registered
                    </div>
                  </div>
                </div>

                {/* Event 3 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: '#F3F4F6',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                      05
                    </span>
                    <span style={{ fontSize: 8.5, fontWeight: 800, color: '#6B7280' }}>NOV</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#111111',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                        }}
                        onClick={() => router.push('/student/calendar')}
                      >
                        AI & Future of Tech Talk
                      </div>
                      <span
                        style={{
                          backgroundColor: '#E0F2FE',
                          color: '#0284C7',
                          fontSize: 8,
                          fontWeight: 900,
                          padding: '2px 5px',
                          borderRadius: 4,
                        }}
                      >
                        TALK
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, marginTop: 2 }}>
                      11:00 AM - 12:30 PM · Main Auditorium
                    </div>
                    <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600 }}>
                      210 registered
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Pending Approvals */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '18px 18px',
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
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Pending Approvals
                </span>
                <button
                  type="button"
                  onClick={() => setIsPendingApprovalsModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#111111',
                    cursor: 'pointer',
                  }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingApprovals.map((pa) => (
                  <div
                    key={pa.id}
                    onClick={() => setIsPendingApprovalsModalOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor:
                            pa.type === 'user'
                              ? '#E0F2FE'
                              : pa.type === 'event'
                              ? '#FEF9C3'
                              : pa.type === 'placement'
                              ? '#DCFCE7'
                              : '#EDE9FE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {pa.type === 'user' && <Users width={16} height={16} color="#0284C7" />}
                        {pa.type === 'event' && <CalendarDays width={16} height={16} color="#854D0E" />}
                        {pa.type === 'placement' && <FileText width={16} height={16} color="#15803D" />}
                        {pa.type === 'department' && <Building2 width={16} height={16} color="#7C3AED" />}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                          {pa.title}
                        </div>
                        <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600 }}>
                          {pa.subtitle}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: 10,
                        fontWeight: 900,
                        borderRadius: 9999,
                        padding: '1px 7px',
                      }}
                    >
                      {pa.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: 3 COLUMNS (Top Departments + Notices Distribution + Recent System Activity) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.2fr 1fr',
              gap: 16,
            }}
          >
            {/* Column 1: Top Departments by Activity */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '18px 18px',
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
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Top Departments by Activity
                </span>
                <button
                  type="button"
                  onClick={() => router.push('/admin/setup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#111111',
                    cursor: 'pointer',
                  }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'Computer Science', count: 324, max: 350, color: '#D5FF38', icon: Building2 },
                  { name: 'Mechanical', count: 256, max: 350, color: '#F472B6', icon: Settings },
                  { name: 'Electronics', count: 198, max: 350, color: '#C084FC', icon: Activity },
                  { name: 'Civil', count: 176, max: 350, color: '#38BDF8', icon: Home },
                  { name: 'Management', count: 142, max: 350, color: '#FBBF24', icon: Briefcase },
                ].map((dept, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        backgroundColor: '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <dept.icon width={14} height={14} color="#4B5563" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: 11,
                          fontWeight: 700,
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ color: '#111111' }}>{dept.name}</span>
                        <span style={{ color: '#6B7280' }}>{dept.count}</span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: 7,
                          backgroundColor: '#F3F4F6',
                          borderRadius: 9999,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${(dept.count / dept.max) * 100}%`,
                            height: '100%',
                            backgroundColor: dept.color,
                            borderRadius: 9999,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Notices Distribution by Category */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '18px 18px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Notices Distribution by Category
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Donut graphic */}
                <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F3F4F6" strokeWidth="16" />
                    {/* Academic 32% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#D5FF38"
                      strokeWidth="16"
                      strokeDasharray="76.5 239"
                      strokeDashoffset="0"
                    />
                    {/* Events 24% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#EC4899"
                      strokeWidth="16"
                      strokeDasharray="57.3 239"
                      strokeDashoffset="-76.5"
                    />
                    {/* Placements 18% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#8B5CF6"
                      strokeWidth="16"
                      strokeDasharray="43 239"
                      strokeDashoffset="-133.8"
                    />
                    {/* General 14% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#0284C7"
                      strokeWidth="16"
                      strokeDasharray="33.4 239"
                      strokeDashoffset="-176.8"
                    />
                    {/* Others 12% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#06B6D4"
                      strokeWidth="16"
                      strokeDasharray="28.8 239"
                      strokeDashoffset="-210.2"
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1.1,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>1,284</span>
                    <span style={{ fontSize: 8.5, color: '#6B7280', fontWeight: 700 }}>
                      Total Notices
                    </span>
                  </div>
                </div>

                {/* Legend List */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {[
                    { label: 'Academic', pct: '32%', count: '412', color: '#D5FF38' },
                    { label: 'Events', pct: '24%', count: '308', color: '#EC4899' },
                    { label: 'Placements', pct: '18%', count: '231', color: '#8B5CF6' },
                    { label: 'General', pct: '14%', count: '180', color: '#0284C7' },
                    { label: 'Others', pct: '12%', count: '153', color: '#06B6D4' },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 10.5,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            backgroundColor: row.color,
                            border: row.color === '#D5FF38' ? '1px solid #111111' : 'none',
                          }}
                        />
                        <span style={{ color: '#4B5563', fontWeight: 600 }}>{row.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 800, color: '#111111' }}>{row.pct}</span>
                        <span style={{ color: '#9CA3AF', fontSize: 9.5 }}>({row.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Recent System Activity */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '18px 18px',
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
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Recent System Activity
                </span>
                <button
                  type="button"
                  onClick={() => router.push('/admin/logs')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#111111',
                    cursor: 'pointer',
                  }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {/* Item 1 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: '#E0F2FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Users width={13} height={13} color="#0284C7" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111' }}>
                      New user registered
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>
                      rahul.k@college.edu
                    </div>
                  </div>
                  <span style={{ fontSize: 9.5, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    2 mins ago
                  </span>
                </div>

                {/* Item 2 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: '#EDE9FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <FileText width={13} height={13} color="#7C3AED" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111' }}>
                      Notice published
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>
                      Mid Semester Exam Schedule
                    </div>
                  </div>
                  <span style={{ fontSize: 9.5, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    15 mins ago
                  </span>
                </div>

                {/* Item 3 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: '#FCE7F3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <CalendarDays width={13} height={13} color="#DB2777" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111' }}>
                      Event created
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>
                      Garba Night 2026
                    </div>
                  </div>
                  <span style={{ fontSize: 9.5, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    1 hour ago
                  </span>
                </div>

                {/* Item 4 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: '#DCFCE7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <CheckCircle2 width={13} height={13} color="#15803D" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111' }}>
                      User approved
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>
                      Faculty - Dr. Priya Sharma
                    </div>
                  </div>
                  <span style={{ fontSize: 9.5, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    2 hours ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* COLUMN 3: RIGHT WIDGETS COLUMN */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Widget 1: Quick Actions */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 20px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Zap width={17} height={17} color="#111111" strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                Quick Actions
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {/* Standout Button: + Add New User (Active Acid Lime pill matching screenshot) */}
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  fontWeight: 900,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 2px 8px rgba(213,255,56,0.35)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <UserPlus width={15} height={15} color="#111111" />
                  <span>Add New User</span>
                </div>
                <ArrowRight width={14} height={14} color="#111111" />
              </button>

              {/* Action 2: Create Announcement */}
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
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Megaphone width={15} height={15} color="#4B5563" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                    Create Announcement
                  </span>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </button>

              {/* Action 3: Create Event */}
              <button
                type="button"
                onClick={() => setIsCreateEventModalOpen(true)}
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
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CalendarDays width={15} height={15} color="#4B5563" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                    Create Event
                  </span>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </button>

              {/* Action 4: Manage Placements */}
              <button
                type="button"
                onClick={() => router.push('/student/placements')}
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
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Briefcase width={15} height={15} color="#4B5563" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                    Manage Placements
                  </span>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </button>

              {/* Action 5: Generate Report */}
              <button
                type="button"
                onClick={() => setIsGenerateReportModalOpen(true)}
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
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText width={15} height={15} color="#4B5563" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                    Generate Report
                  </span>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </button>

              {/* Action 6: System Settings */}
              <button
                type="button"
                onClick={() => router.push('/admin/setup')}
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
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Settings width={15} height={15} color="#4B5563" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                    System Settings
                  </span>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </button>
            </div>
          </div>

          {/* Widget 2: System Status */}
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
                <CheckCircle2 width={16} height={16} color="#111111" strokeWidth={2.5} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  System Status
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSystemStatusModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#111111',
                  cursor: 'pointer',
                }}
              >
                View All →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Website', status: 'Operational' },
                { name: 'Database', status: 'Operational' },
                { name: 'File Storage', status: 'Operational' },
                { name: 'Email Service', status: 'Operational' },
                { name: 'Push Notifications', status: 'Operational' },
              ].map((svc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11.5,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: '#16A34A',
                      }}
                    />
                    <span style={{ color: '#374151', fontWeight: 600 }}>{svc.name}</span>
                  </div>
                  <span style={{ color: '#16A34A', fontWeight: 700, fontSize: 11 }}>
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL 1: ADD NEW USER MODAL */}
      {isAddUserModalOpen && (
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
          onClick={() => setIsAddUserModalOpen(false)}
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
                <UserPlus width={20} height={20} color="#111111" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111111' }}>
                  Add New Campus User
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
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

            <form onSubmit={handleAddUserSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    placeholder="e.g., Rohan Deshmukh"
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="e.g., rohan.d@college.edu"
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
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                      Role
                    </label>
                    <select
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        border: '1px solid #D1D5DB',
                        fontSize: 13,
                        outline: 'none',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty</option>
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                      Department
                    </label>
                    <select
                      value={newUserForm.department}
                      onChange={(e) =>
                        setNewUserForm({ ...newUserForm, department: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        border: '1px solid #D1D5DB',
                        fontSize: 13,
                        outline: 'none',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="School of Design">School of Design</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
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
                    Create User
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE EVENT MODAL */}
      {isCreateEventModalOpen && (
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
          onClick={() => setIsCreateEventModalOpen(false)}
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
                <CalendarDays width={20} height={20} color="#111111" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111111' }}>
                  Create Campus Event
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateEventModalOpen(false)}
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

            <form onSubmit={handleCreateEventSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newEventForm.title}
                    onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                    placeholder="e.g., Annual Tech Symposium 2026"
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
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newEventForm.date}
                      onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                      Category
                    </label>
                    <select
                      value={newEventForm.category}
                      onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 12,
                        border: '1px solid #D1D5DB',
                        fontSize: 13,
                        outline: 'none',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                    Venue
                  </label>
                  <input
                    type="text"
                    value={newEventForm.venue}
                    onChange={(e) => setNewEventForm({ ...newEventForm, venue: e.target.value })}
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

                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsCreateEventModalOpen(false)}
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
                    Publish Event
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: GENERATE REPORT MODAL */}
      {isGenerateReportModalOpen && (
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
          onClick={() => setIsGenerateReportModalOpen(false)}
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
                <FileText width={20} height={20} color="#111111" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111111' }}>
                  Generate Campus Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGenerateReportModalOpen(false)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1px solid #D1D5DB',
                    fontSize: 13,
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="Campus Engagement & Reach Report">
                    Campus Engagement & Reach Report
                  </option>
                  <option value="Student Notice Readership Analytics">
                    Student Notice Readership Analytics
                  </option>
                  <option value="Event Registrations & Attendance Audit">
                    Event Registrations & Attendance Audit
                  </option>
                  <option value="System Operational Health & Latency Report">
                    System Operational Health & Latency Report
                  </option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                  Export Format
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['PDF', 'CSV', 'Excel'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setReportFormat(fmt)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: 12,
                        border: reportFormat === fmt ? '2px solid #111111' : '1px solid #E5E7EB',
                        backgroundColor: reportFormat === fmt ? '#F3F4F6' : '#FFFFFF',
                        fontWeight: reportFormat === fmt ? 900 : 600,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsGenerateReportModalOpen(false)}
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
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Report Downloaded',
                      message: `Downloaded ${reportType} (${reportFormat})`,
                    })
                    setIsGenerateReportModalOpen(false)
                  }}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Download width={14} height={14} />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PENDING APPROVALS DETAIL MODAL */}
      {isPendingApprovalsModalOpen && (
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
          onClick={() => setIsPendingApprovalsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 540,
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
                <ShieldCheck width={20} height={20} color="#111111" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111111' }}>
                  Pending Approvals Queue
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPendingApprovalsModalOpen(false)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {pendingApprovals.map((pa) => (
                <div
                  key={pa.id}
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: 14,
                    padding: '12px 16px',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>
                      {pa.title} ({pa.count})
                    </span>
                    <span
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        fontSize: 9.5,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 9999,
                      }}
                    >
                      Requires Action
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {pa.items.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: 11.5,
                          backgroundColor: '#FFFFFF',
                          padding: '6px 10px',
                          borderRadius: 8,
                          border: '1px solid #E5E7EB',
                        }}
                      >
                        <span style={{ color: '#374151' }}>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleApproveItem(pa.id, item)}
                          style={{
                            backgroundColor: '#DCFCE7',
                            color: '#15803D',
                            border: 'none',
                            borderRadius: 6,
                            padding: '3px 8px',
                            fontSize: 10,
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <Check width={12} height={12} />
                          <span>Approve</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setIsPendingApprovalsModalOpen(false)}
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
                  marginTop: 6,
                }}
              >
                Close Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: SYSTEM STATUS DETAILS MODAL */}
      {isSystemStatusModalOpen && (
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
          onClick={() => setIsSystemStatusModalOpen(false)}
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
                <Server width={20} height={20} color="#111111" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111111' }}>
                  Infrastructure Status
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSystemStatusModalOpen(false)}
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
                { name: 'Core Next.js Web App', uptime: '99.98%', latency: '24ms', status: 'Operational' },
                { name: 'PostgreSQL Database Cluster', uptime: '99.99%', latency: '8ms', status: 'Operational' },
                { name: 'Edge CDN & Asset Storage', uptime: '100%', latency: '12ms', status: 'Operational' },
                { name: 'Transactional Email (SMTP)', uptime: '99.95%', latency: '45ms', status: 'Operational' },
                { name: 'Push Notification Service', uptime: '99.91%', latency: '32ms', status: 'Operational' },
              ].map((svc, idx) => (
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
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>{svc.name}</div>
                    <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>
                      Uptime: {svc.uptime} · Latency: {svc.latency}
                    </div>
                  </div>
                  <span
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 9999,
                    }}
                  >
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsSystemStatusModalOpen(false)}
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
