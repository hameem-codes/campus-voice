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
  Calendar,
  Layers,
  FileSpreadsheet,
  FileCheck,
  Sparkles,
  PieChart,
  MessageSquare,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

export function AdminAnalyticsView() {
  const router = useRouter()
  const { addToast, logout, adminMetrics, categories, updates } = useStore()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('Overview')
  const [activityGrouping, setActivityGrouping] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily')
  const [isGroupingDropdownOpen, setIsGroupingDropdownOpen] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState('1 Oct 2026 - 31 Oct 2026')
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false)

  // Report Form state
  const [reportType, setReportType] = useState('Monthly Platform Summary')
  const [reportDepartment, setReportDepartment] = useState('All Departments')
  const [reportFormat, setReportFormat] = useState<'PDF' | 'Excel' | 'CSV'>('PDF')

  // Scheduled Reports Toggle State
  const [scheduledReports, setScheduledReports] = useState([
    { id: 'sr-1', title: 'Monthly Platform Report', freq: '1st of every month', active: true },
    { id: 'sr-2', title: 'Weekly Activity Report', freq: 'Every Monday', active: true },
    { id: 'sr-3', title: 'Placement Report', freq: 'Every Friday', active: false },
  ])
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false)
  const [newScheduleTitle, setNewScheduleTitle] = useState('')
  const [newScheduleFreq, setNewScheduleFreq] = useState('Weekly on Monday')

  // Interactive Chart Tooltip
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string
    notices: number
    events: number
    placements: number
    logins: number
    x: number
    y: number
  } | null>(null)

  // Platform Activity Trend Data
  const activityData = [
    { date: 'Oct 1', notices: 110, events: 50, placements: 30, logins: 280 },
    { date: 'Oct 5', notices: 130, events: 70, placements: 45, logins: 310 },
    { date: 'Oct 10', notices: 180, events: 95, placements: 60, logins: 350 },
    { date: 'Oct 15', notices: 230, events: 140, placements: 80, logins: 380 },
    { date: 'Oct 20', notices: 290, events: 165, placements: 110, logins: 340 },
    { date: 'Oct 25', notices: 250, events: 190, placements: 130, logins: 370 },
    { date: 'Oct 31', notices: 340, events: 210, placements: 140, logins: 395 },
  ]

  const chartW = 560
  const chartH = 170
  const chartMaxY = 400

  const getPathD = (key: 'notices' | 'events' | 'placements' | 'logins') => {
    return activityData
      .map((pt, i) => {
        const x = (i / (activityData.length - 1)) * (chartW - 40) + 30
        const y = chartH - (pt[key] / chartMaxY) * (chartH - 30) - 15
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
  }

  // User Growth Grouped Bar Data
  const userGrowthData = [
    { month: 'Sep', students: 1100, faculty: 380, staff: 220 },
    { month: 'Oct', students: 1450, faculty: 410, staff: 280 },
    { month: 'Nov', students: 1620, faculty: 440, staff: 310 },
    { month: 'Dec', students: 1750, faculty: 460, staff: 330 },
    { month: 'Jan', students: 1840, faculty: 475, staff: 340 },
    { month: 'Feb', students: 1980, faculty: 486, staff: 350 },
  ]

  // Event Attendance Data
  const eventAttendanceData = [
    { month: 'Sep', registered: 420, attended: 350 },
    { month: 'Oct', registered: 1450, attended: 1180 },
    { month: 'Nov', registered: 980, attended: 810 },
    { month: 'Dec', registered: 860, attended: 720 },
    { month: 'Jan', registered: 1240, attended: 1040 },
    { month: 'Feb', registered: 1120, attended: 930 },
  ]

  // Toggle Schedule Switch
  const toggleSchedule = (id: string) => {
    setScheduledReports((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    )
    addToast({
      type: 'info',
      title: 'Schedule Updated',
      message: 'Automated report delivery settings saved.',
    })
  }

  // Handle Generate Report
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault()
    addToast({
      type: 'success',
      title: 'Report Generated',
      message: `Downloaded ${reportType} (${reportFormat}) for ${selectedDateRange}.`,
    })
  }

  // Quick report generator
  const handleQuickReport = (name: string) => {
    addToast({
      type: 'success',
      title: `${name} Downloaded`,
      message: `Generated instant analytics report (${reportFormat}).`,
    })
  }

  // Handle Add Schedule Submit
  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newScheduleTitle.trim()) return
    const newSch = {
      id: `sr-${Date.now()}`,
      title: newScheduleTitle,
      freq: newScheduleFreq,
      active: true,
    }
    setScheduledReports((prev) => [...prev, newSch])
    addToast({
      type: 'success',
      title: 'Scheduled Report Created',
      message: `"${newScheduleTitle}" will run ${newScheduleFreq}.`,
    })
    setNewScheduleTitle('')
    setIsNewScheduleModalOpen(false)
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
        setIsGroupingDropdownOpen(false)
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
        {/* COLUMN 1: LEFT DARK SIDEBAR (12 Items) */}
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

              {/* 10. Reports & Analytics (ACTIVE: Bright Acid-Lime filled pill) */}
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
                <BarChart2 width={17} height={17} strokeWidth={2.5} color="#111111" />
                <span>Reports & Analytics</span>
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

        {/* COLUMN 2: CENTER MAIN CONTENT */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header Row: Title + Tilted Sticker + Date Range Dropdown */}
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
                <BarChart2 width={26} height={26} color="#111111" strokeWidth={2.2} />
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
                  Analytics & Reports
                </h1>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 13,
                    color: '#6B7280',
                    fontWeight: 500,
                  }}
                >
                  Get detailed insights about platform usage, engagement, and campus activities.
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
                  padding: '8px 16px',
                  borderRadius: 14,
                  border: '2px solid #111111',
                  boxShadow: '3px 4px 0px #111111',
                  textAlign: 'center',
                  lineHeight: 1.15,
                  fontWeight: 950,
                  fontSize: 11.5,
                  letterSpacing: -0.3,
                  color: '#111111',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  userSelect: 'none',
                }}
              >
                <span>DATA</span>
                <span>DRIVEN</span>
                <span>DECISIONS</span>
                <span style={{ color: '#000000', textDecoration: 'underline' }}>
                  FOR A BETTER CAMPUS
                </span>
              </div>
            </div>

            {/* Date-Range Selector Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsDateRangeModalOpen(!isDateRangeModalOpen)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '9px 18px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#111111',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <Calendar width={15} height={15} color="#4B5563" />
                <span>{selectedDateRange}</span>
                <ChevronDown width={13} height={13} color="#6B7280" />
              </button>

              {isDateRangeModalOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 44,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 14,
                    padding: 8,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                    border: '1px solid #E5E7EB',
                    zIndex: 30,
                    minWidth: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  {[
                    '1 Oct 2026 - 31 Oct 2026',
                    'Last 30 Days',
                    'Q3 2026 (Jul - Sep)',
                    'Current Semester',
                    'Academic Year 2026-2027',
                  ].map((dr) => (
                    <button
                      key={dr}
                      type="button"
                      onClick={() => {
                        setSelectedDateRange(dr)
                        setIsDateRangeModalOpen(false)
                        addToast({
                          type: 'info',
                          title: 'Date Range Applied',
                          message: `Analytics updated for ${dr}.`,
                        })
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
                        color: selectedDateRange === dr ? '#111111' : '#4B5563',
                        backgroundColor: selectedDateRange === dr ? '#F3F4F6' : 'transparent',
                      }}
                    >
                      {dr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
            }}
          >
            {[
              'Overview',
              'Announcements',
              'Events',
              'Placements',
              'Users',
              'Departments',
              'Engagement',
              'System Usage',
              'Custom Reports',
            ].map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
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

          {/* 5 KPI METRIC CARDS (Horizontal Row) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 12,
            }}
          >
            {/* KPI 1: Total Users */}
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
                  <Users width={17} height={17} color="#FFFFFF" />
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
                <div style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  12,456
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Total Users
                </div>
                <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +912 from last month
                </div>
              </div>
            </div>

            {/* KPI 2: Total Notices */}
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
                <div style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  1,284
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Total Notices
                </div>
                <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +136 from last month
                </div>
              </div>
            </div>

            {/* KPI 3: Total Events */}
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
                  <CalendarDays width={17} height={17} color="#FFFFFF" />
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
                <div style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  342
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Total Events
                </div>
                <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +52 from last month
                </div>
              </div>
            </div>

            {/* KPI 4: Placement Drives */}
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
                  <Briefcase width={17} height={17} color="#FFFFFF" />
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
                  <span>34%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  86
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Placement Drives
                </div>
                <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +22 from last month
                </div>
              </div>
            </div>

            {/* KPI 5: Total Engagements */}
            <div
              style={{
                backgroundColor: '#FFF1F2',
                borderRadius: 18,
                padding: '16px 14px',
                border: '1px solid #FFE4E6',
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
                    backgroundColor: '#E11D48',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MessageSquare width={17} height={17} color="#FFFFFF" />
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
                  <span>28%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                  24,892
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', marginTop: 4 }}>
                  Total Engagements
                </div>
                <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  +5.4K from last month
                </div>
              </div>
            </div>
          </div>

          {/* ROW 1: CHARTS (Platform Activity Overview + User Growth) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.45fr 1fr',
              gap: 16,
            }}
          >
            {/* Chart 1: Platform Activity Overview */}
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
                  marginBottom: 12,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart2 width={17} height={17} color="#111111" strokeWidth={2.5} />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>
                    Platform Activity Overview
                  </span>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, fontWeight: 700 }}>
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
                    <span style={{ color: '#4B5563' }}>User Logins</span>
                  </div>
                </div>

                {/* Dropdown: Daily */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsGroupingDropdownOpen(!isGroupingDropdownOpen)
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
                    <span>{activityGrouping}</span>
                    <ChevronDown width={12} height={12} />
                  </button>

                  {isGroupingDropdownOpen && (
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
                        minWidth: 100,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {(['Daily', 'Weekly', 'Monthly'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setActivityGrouping(g)
                            setIsGroupingDropdownOpen(false)
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
                            color: activityGrouping === g ? '#111111' : '#4B5563',
                            backgroundColor: activityGrouping === g ? '#F3F4F6' : 'transparent',
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Chart SVG */}
              <div style={{ position: 'relative', width: '100%', height: chartH + 20 }}>
                <svg
                  viewBox={`0 0 ${chartW} ${chartH + 20}`}
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                >
                  {[0, 100, 200, 300, 400].map((val) => {
                    const y = chartH - (val / chartMaxY) * (chartH - 30) - 15
                    return (
                      <g key={val}>
                        <text x="0" y={y + 3} fontSize="9" fill="#9CA3AF" fontWeight="600">
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

                  {/* Logins Line */}
                  <path d={getPathD('logins')} fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Placements Line */}
                  <path d={getPathD('placements')} fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Events Line */}
                  <path d={getPathD('events')} fill="none" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Notices Line */}
                  <path d={getPathD('notices')} fill="none" stroke="#D5FF38" strokeWidth="3" strokeLinecap="round" />

                  {/* Circles */}
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
                        onMouseEnter={() => setHoveredPoint({ ...pt, x, y })}
                        onMouseLeave={() => setHoveredPoint(null)}
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

                {/* Tooltip */}
                {hoveredPoint && (
                  <div
                    style={{
                      position: 'absolute',
                      left: hoveredPoint.x - 50,
                      top: Math.max(0, hoveredPoint.y - 70),
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
                      {hoveredPoint.date}
                    </div>
                    <div>Notices: {hoveredPoint.notices}</div>
                    <div>Events: {hoveredPoint.events}</div>
                    <div>Logins: {hoveredPoint.logins}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Chart 2: User Growth Grouped Bars */}
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users width={17} height={17} color="#111111" strokeWidth={2.5} />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>User Growth</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#38BDF8' }} />
                    <span style={{ color: '#4B5563' }}>Students</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#8B5CF6' }} />
                    <span style={{ color: '#4B5563' }}>Faculty</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#F472B6' }} />
                    <span style={{ color: '#4B5563' }}>Staff</span>
                  </div>
                </div>
              </div>

              {/* Grouped Bar Chart SVG */}
              <div style={{ width: '100%', height: chartH + 10 }}>
                <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  {[0, 500, 1000, 1500, 2000].map((val) => {
                    const y = 150 - (val / 2000) * 125
                    return (
                      <g key={val}>
                        <text x="0" y={y + 3} fontSize="8" fill="#9CA3AF" fontWeight="600">
                          {val === 0 ? '0' : val === 1000 ? '1K' : val === 2000 ? '2K' : `${val}`}
                        </text>
                        <line x1="20" y1={y} x2="310" y2={y} stroke="#F3F4F6" strokeDasharray={val === 0 ? 'none' : '3 3'} />
                      </g>
                    )
                  })}

                  {/* Bars */}
                  {userGrowthData.map((d, i) => {
                    const groupX = 35 + i * 46
                    const sH = (d.students / 2000) * 125
                    const fH = (d.faculty / 2000) * 125
                    const stH = (d.staff / 2000) * 125

                    return (
                      <g key={d.month}>
                        {/* Students Bar */}
                        <rect x={groupX} y={150 - sH} width="8" height={sH} rx="2" fill="#38BDF8" />
                        {/* Faculty Bar */}
                        <rect x={groupX + 10} y={150 - fH} width="8" height={fH} rx="2" fill="#8B5CF6" />
                        {/* Staff Bar */}
                        <rect x={groupX + 20} y={150 - stH} width="8" height={stH} rx="2" fill="#F472B6" />

                        {/* Month Label */}
                        <text x={groupX + 14} y="165" fontSize="8.5" fill="#9CA3AF" fontWeight="600" textAnchor="middle">
                          {d.month}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* ROW 2: 3 COLUMNS (Categories Donut + Event Attendance + Placement Stats) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.2fr 1fr',
              gap: 16,
            }}
          >
            {/* Card 1: Notice Categories Distribution */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '18px 18px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', marginBottom: 12 }}>
                Notice Categories Distribution
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ position: 'relative', width: 116, height: 116, flexShrink: 0 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F3F4F6" strokeWidth="16" />
                    {/* Academic 32% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#D5FF38" strokeWidth="16" strokeDasharray="76.5 239" strokeDashoffset="0" />
                    {/* Events 24% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#EC4899" strokeWidth="16" strokeDasharray="57.3 239" strokeDashoffset="-76.5" />
                    {/* Placements 18% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8B5CF6" strokeWidth="16" strokeDasharray="43 239" strokeDashoffset="-133.8" />
                    {/* General 14% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0284C7" strokeWidth="16" strokeDasharray="33.4 239" strokeDashoffset="-176.8" />
                    {/* Hostel 8% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06B6D4" strokeWidth="16" strokeDasharray="19.1 239" strokeDashoffset="-210.2" />
                    {/* Transport 4% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="16" strokeDasharray="9.6 239" strokeDashoffset="-229.3" />
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
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { label: 'Academic', pct: '32%', count: '412', color: '#D5FF38' },
                    { label: 'Events', pct: '24%', count: '308', color: '#EC4899' },
                    { label: 'Placements', pct: '18%', count: '231', color: '#8B5CF6' },
                    { label: 'General', pct: '14%', count: '180', color: '#0284C7' },
                    { label: 'Hostel', pct: '8%', count: '102', color: '#06B6D4' },
                    { label: 'Transport', pct: '4%', count: '51', color: '#F59E0B' },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 10,
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
                        <span style={{ color: '#9CA3AF', fontSize: 9 }}>({row.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Event Attendance Analytics */}
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
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Event Attendance Analytics
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9.5, fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: '#E9D5FF' }} />
                    <span style={{ color: '#4B5563' }}>Registered</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: '#8B5CF6' }} />
                    <span style={{ color: '#4B5563' }}>Attended</span>
                  </div>
                </div>
              </div>

              {/* Attendance Bar Chart */}
              <div style={{ width: '100%', height: 120 }}>
                <svg viewBox="0 0 280 130" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {[0, 500, 1000, 1500, 2000].map((val) => {
                    const y = 110 - (val / 2000) * 90
                    return (
                      <g key={val}>
                        <text x="0" y={y + 3} fontSize="7" fill="#9CA3AF" fontWeight="600">
                          {val === 0 ? '0' : val === 1000 ? '1K' : val === 2000 ? '2K' : `${val}`}
                        </text>
                        <line x1="16" y1={y} x2="270" y2={y} stroke="#F3F4F6" strokeDasharray="3 3" />
                      </g>
                    )
                  })}

                  {eventAttendanceData.map((d, i) => {
                    const gx = 28 + i * 42
                    const rH = (d.registered / 2000) * 90
                    const aH = (d.attended / 2000) * 90

                    return (
                      <g key={d.month}>
                        <rect x={gx} y={110 - rH} width="11" height={rH} rx="2" fill="#E9D5FF" />
                        <rect x={gx + 12} y={110 - aH} width="11" height={aH} rx="2" fill="#8B5CF6" />
                        <text x={gx + 11} y="122" fontSize="7.5" fill="#9CA3AF" fontWeight="600" textAnchor="middle">
                          {d.month}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Card 3: Placement Drive Stats */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Briefcase width={16} height={16} color="#111111" strokeWidth={2.5} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Placement Drive Stats
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Stat 1 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase width={12} height={12} color="#0284C7" />
                    </div>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Total Drives</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 950, color: '#111111' }}>86</span>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>
                      ↑ 34%
                    </span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users width={12} height={12} color="#7C3AED" />
                    </div>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Total Registrations</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 950, color: '#111111' }}>4,892</span>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>
                      ↑ 28%
                    </span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 width={12} height={12} color="#854D0E" />
                    </div>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Total Selections</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 950, color: '#111111' }}>1,124</span>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>
                      ↑ 42%
                    </span>
                  </div>
                </div>

                {/* Stat 4 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp width={12} height={12} color="#C2410C" />
                    </div>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Average Package</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 950, color: '#111111' }}>₹6.8 LPA</span>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>
                      ↑ 16%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: 3 COLUMNS (Top Departments + Heatmap + Top Performing Content) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1.35fr 1.15fr',
              gap: 16,
            }}
          >
            {/* Column 1: Top Departments by Engagement */}
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
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Top Departments by Engagement
                </span>
                <button
                  type="button"
                  onClick={() => router.push('/admin/setup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: '#111111',
                    cursor: 'pointer',
                  }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  { rank: 1, name: 'Computer Science', pct: '92%', color: '#D5FF38' },
                  { rank: 2, name: 'Mechanical', pct: '78%', color: '#F472B6' },
                  { rank: 3, name: 'Electronics', pct: '65%', color: '#C084FC' },
                  { rank: 4, name: 'Civil', pct: '52%', color: '#38BDF8' },
                  { rank: 5, name: 'Management', pct: '48%', color: '#FBBF24' },
                ].map((row) => (
                  <div key={row.rank} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        backgroundColor: '#FEF9C3',
                        color: '#854D0E',
                        fontSize: 9,
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {row.rank}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: 10.5,
                          fontWeight: 700,
                          marginBottom: 3,
                        }}
                      >
                        <span style={{ color: '#111111' }}>{row.name}</span>
                        <span style={{ color: '#6B7280' }}>{row.pct}</span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: 6,
                          backgroundColor: '#F3F4F6',
                          borderRadius: 9999,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: row.pct,
                            height: '100%',
                            backgroundColor: row.color,
                            borderRadius: 9999,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: User Activity Heatmap */}
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
              <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', marginBottom: 8 }}>
                User Activity Heatmap
              </div>

              {/* Heatmap Grid */}
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: 260 }}>
                  {/* Hours Header */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '30px repeat(24, 1fr)',
                      gap: 2,
                      fontSize: 7.5,
                      color: '#9CA3AF',
                      fontWeight: 700,
                      marginBottom: 4,
                      textAlign: 'center',
                    }}
                  >
                    <span />
                    <span>12A</span>
                    <span />
                    <span />
                    <span />
                    <span>4A</span>
                    <span />
                    <span />
                    <span />
                    <span>8A</span>
                    <span />
                    <span />
                    <span />
                    <span>12P</span>
                    <span />
                    <span />
                    <span />
                    <span>4P</span>
                    <span />
                    <span />
                    <span />
                    <span>8P</span>
                    <span />
                    <span />
                  </div>

                  {/* 7 Days Rows */}
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dIdx) => (
                    <div
                      key={day}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '30px repeat(24, 1fr)',
                        gap: 2,
                        alignItems: 'center',
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ fontSize: 8, fontWeight: 700, color: '#6B7280' }}>{day}</span>
                      {Array.from({ length: 24 }).map((_, hIdx) => {
                        // Intensity distribution
                        let level = 0
                        if (hIdx >= 8 && hIdx <= 18) {
                          level = dIdx < 5 ? (hIdx >= 10 && hIdx <= 16 ? 4 : 3) : 2
                        } else if (hIdx >= 19 && hIdx <= 22) {
                          level = 2
                        } else if (hIdx >= 6 && hIdx <= 7) {
                          level = 1
                        }

                        const colorLevels = [
                          '#F3F4F6',
                          '#BAE6FD',
                          '#60A5FA',
                          '#2563EB',
                          '#1E40AF',
                        ]

                        return (
                          <div
                            key={hIdx}
                            style={{
                              aspectRatio: '1/1',
                              borderRadius: 2,
                              backgroundColor: colorLevels[level],
                              cursor: 'pointer',
                            }}
                            title={`${day} at ${hIdx}:00 - Activity Index: ${level * 25}%`}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Legend */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 4,
                  fontSize: 8.5,
                  color: '#6B7280',
                  marginTop: 6,
                }}
              >
                <span>Less Activity</span>
                <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#F3F4F6' }} />
                <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#BAE6FD' }} />
                <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#60A5FA' }} />
                <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#2563EB' }} />
                <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#1E40AF' }} />
                <span>More Activity</span>
              </div>
            </div>

            {/* Column 3: Top Performing Content */}
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
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Top Performing Content
                </span>
                <button
                  type="button"
                  onClick={() => router.push('/faculty/updates')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: '#111111',
                    cursor: 'pointer',
                  }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  {
                    title: 'Mid Sem Exam Schedule',
                    tag: 'ACADEMIC',
                    tagColor: { bg: '#D5FF38', text: '#111111' },
                    views: '12.4K',
                    shares: '456',
                    img: '/images/mid_sem_exam.jpg',
                  },
                  {
                    title: 'Garba Night 2026',
                    tag: 'EVENT',
                    tagColor: { bg: '#FCE7F3', text: '#DB2777' },
                    views: '8.9K',
                    shares: '324',
                    img: '/images/garba_night.jpg',
                  },
                  {
                    title: 'Google Placement Drive',
                    tag: 'PLACEMENT',
                    tagColor: { bg: '#E0F2FE', text: '#0284C7' },
                    views: '6.2K',
                    shares: '210',
                    img: '/images/placement_drive.jpg',
                  },
                  {
                    title: 'Library Timings Update',
                    tag: 'GENERAL',
                    tagColor: { bg: '#EDE9FE', text: '#7C3AED' },
                    views: '5.1K',
                    shares: '180',
                    img: '/images/library_books.jpg',
                  },
                  {
                    title: 'Hostel Room Allotment',
                    tag: 'HOSTEL',
                    tagColor: { bg: '#FEF9C3', text: '#854D0E' },
                    views: '4.8K',
                    shares: '142',
                    img: '/images/campus_building.jpg',
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 7,
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      <Image src={item.img} alt={item.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: '#111111',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.title}
                        </span>
                        <span
                          style={{
                            backgroundColor: item.tagColor.bg,
                            color: item.tagColor.text,
                            fontSize: 7.5,
                            fontWeight: 900,
                            padding: '1px 4px',
                            borderRadius: 3,
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600 }}>
                        {item.views} views · {item.shares} shares
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* COLUMN 3: RIGHT WIDGETS COLUMN */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Widget 1: Generate Report Form */}
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
              <FileText width={17} height={17} color="#111111" strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                Generate Report
              </span>
            </div>

            <form onSubmit={handleGenerateReport}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Report Type */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4 }}>
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid #D1D5DB',
                      fontSize: 11.5,
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="Select Report Type">Select Report Type</option>
                    <option value="Platform Engagement Audit">Platform Engagement Audit</option>
                    <option value="Monthly Platform Summary">Monthly Platform Summary</option>
                    <option value="Department Reach & Attendance">Department Reach & Attendance</option>
                    <option value="Placement & Internship Analytics">Placement & Internship Analytics</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4 }}>
                    Date Range
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid #D1D5DB',
                      fontSize: 11.5,
                      color: '#4B5563',
                      backgroundColor: '#F9FAFB',
                    }}
                  >
                    <Calendar width={13} height={13} color="#6B7280" />
                    <span>{selectedDateRange}</span>
                  </div>
                </div>

                {/* Department (Optional) */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4 }}>
                    Department (Optional)
                  </label>
                  <select
                    value={reportDepartment}
                    onChange={(e) => setReportDepartment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid #D1D5DB',
                      fontSize: 11.5,
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="School of Design">School of Design</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                {/* Format selection */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4 }}>
                    Format
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['PDF', 'Excel', 'CSV'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setReportFormat(fmt)}
                        style={{
                          flex: 1,
                          padding: '7px 4px',
                          borderRadius: 8,
                          border: reportFormat === fmt ? '1.5px solid #111111' : '1px solid #E5E7EB',
                          backgroundColor: reportFormat === fmt ? '#111111' : '#FFFFFF',
                          color: reportFormat === fmt ? '#FFFFFF' : '#4B5563',
                          fontSize: 10.5,
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                        }}
                      >
                        {reportFormat === fmt && <Check width={11} height={11} strokeWidth={3} />}
                        <span>{fmt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    borderRadius: 9999,
                    padding: '10px 0',
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  <span>Generate Report</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>

          {/* Widget 2: Quick Reports */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 20px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Zap width={16} height={16} color="#111111" strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                Quick Reports
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { name: 'Monthly Activity Report', icon: FileText, color: '#D5FF38' },
                { name: 'Department Wise Summary', icon: Building2, color: '#FCE7F3' },
                { name: 'Event Attendance Report', icon: CalendarDays, color: '#E0F2FE' },
                { name: 'Placement Statistics', icon: Briefcase, color: '#EDE9FE' },
                { name: 'User Growth Report', icon: Users, color: '#DCFCE7' },
              ].map((qr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickReport(qr.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        backgroundColor: qr.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <qr.icon width={12} height={12} color="#111111" />
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#111111' }}>
                      {qr.name}
                    </span>
                  </div>
                  <ChevronRight width={13} height={13} color="#9CA3AF" />
                </button>
              ))}
            </div>
          </div>

          {/* Widget 3: Scheduled Reports */}
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
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock width={16} height={16} color="#111111" strokeWidth={2.5} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Scheduled Reports
                </span>
              </div>
              <button
                type="button"
                onClick={() => addToast({ type: 'info', title: '3 recurring reports active' })}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: '#111111',
                  cursor: 'pointer',
                }}
              >
                View All →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scheduledReports.map((sr) => (
                <div
                  key={sr.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        backgroundColor: '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FileText width={12} height={12} color="#4B5563" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#111111' }}>
                        {sr.title}
                      </div>
                      <div style={{ fontSize: 9.5, color: '#9CA3AF' }}>{sr.freq}</div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => toggleSchedule(sr.id)}
                    style={{
                      width: 32,
                      height: 18,
                      borderRadius: 9999,
                      backgroundColor: sr.active ? '#D5FF38' : '#E5E7EB',
                      border: '1px solid #111111',
                      position: 'relative',
                      cursor: 'pointer',
                      padding: 1,
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 1,
                        left: sr.active ? 15 : 1,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: '#111111',
                        transition: 'left 0.15s ease',
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Create Scheduled Report Button */}
            <button
              type="button"
              onClick={() => setIsNewScheduleModalOpen(true)}
              style={{
                width: '100%',
                marginTop: 14,
                padding: '8px 0',
                borderRadius: 12,
                border: '1.5px dashed #D1D5DB',
                backgroundColor: 'transparent',
                color: '#111111',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <Plus width={13} height={13} />
              <span>Create Scheduled Report</span>
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL: CREATE SCHEDULED REPORT */}
      {isNewScheduleModalOpen && (
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
          onClick={() => setIsNewScheduleModalOpen(false)}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock width={20} height={20} color="#111111" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#111111' }}>
                  Create Automated Report Schedule
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewScheduleModalOpen(false)}
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

            <form onSubmit={handleAddScheduleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                    Report Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newScheduleTitle}
                    onChange={(e) => setNewScheduleTitle(e.target.value)}
                    placeholder="e.g., Weekly Department Engagement Digest"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '1px solid #D1D5DB',
                      fontSize: 12.5,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
                    Frequency
                  </label>
                  <select
                    value={newScheduleFreq}
                    onChange={(e) => setNewScheduleFreq(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '1px solid #D1D5DB',
                      fontSize: 12.5,
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="Daily at 08:00 AM">Daily at 08:00 AM</option>
                    <option value="Weekly on Monday">Weekly on Monday</option>
                    <option value="Bi-Weekly on Friday">Bi-Weekly on Friday</option>
                    <option value="Monthly on the 1st">Monthly on the 1st</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsNewScheduleModalOpen(false)}
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
                    type="submit"
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
                    Save Schedule
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
