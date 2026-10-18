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
  MoreHorizontal,
  KeyRound,
  Edit3,
  UserX,
  UserCheck,
  Upload,
  Lock,
  Phone,
  Trash2,
  CheckSquare,
  Square,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Radio,
  FileDown,
  Laptop,
  Globe,
  RefreshCw,
  FolderArchive,
  Compass,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { AuditLogItem } from '@/types'
import { ToastContainer } from '@/components/ui/ToastContainer'

export function AdminLogsView() {
  const router = useRouter()
  const { auditLogs: storeLogs, currentUser, logout, addToast } = useStore()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [moduleFilter, setModuleFilter] = useState('All Modules')
  const [actionFilter, setActionFilter] = useState('All Actions')
  const [userFilter, setUserFilter] = useState('All Users')
  const [severityFilter, setSeverityFilter] = useState('All Severity')
  const [dateRange, setDateRange] = useState('1 Oct 2026 - 31 Oct 2026')
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false)

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Right sidebar selected log (default to log 2: Dr. Priya Sharma)
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(() => {
    return (
      storeLogs.find((l) => l.user.includes('Priya Sharma')) ||
      storeLogs[1] ||
      storeLogs[0] ||
      null
    )
  })

  // Action Menu on row
  const [actionMenuLogId, setActionMenuLogId] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 10

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<'CSV' | 'JSON' | 'PDF'>('CSV')
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false)

  // Activity distribution filter
  const [activityTimeframe, setActivityTimeframe] = useState<'Last 7 Days' | 'Last 30 Days' | 'All Time'>('Last 7 Days')
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false)

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return storeLogs.filter((log) => {
      // Module filter
      if (moduleFilter !== 'All Modules' && log.module !== moduleFilter) return false

      // Action filter
      if (actionFilter !== 'All Actions' && log.action !== actionFilter) return false

      // User filter
      if (userFilter !== 'All Users' && !log.user.toLowerCase().includes(userFilter.toLowerCase())) return false

      // Severity filter
      if (severityFilter !== 'All Severity' && log.severity !== severityFilter) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchUser = log.user.toLowerCase().includes(q)
        const matchAction = log.action.toLowerCase().includes(q)
        const matchModule = (log.module || '').toLowerCase().includes(q)
        const matchDetails = log.details.toLowerCase().includes(q)
        const matchIp = (log.ipAddress || '').toLowerCase().includes(q)
        if (!matchUser && !matchAction && !matchModule && !matchDetails && !matchIp) return false
      }

      return true
    })
  }, [storeLogs, moduleFilter, actionFilter, userFilter, severityFilter, searchQuery])

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize))
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredLogs.slice(start, start + pageSize)
  }, [filteredLogs, currentPage, pageSize])

  // Checkbox bulk selection
  const isAllSelected =
    paginatedLogs.length > 0 && paginatedLogs.every((l) => selectedIds.includes(l.id))

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedLogs.map((l) => l.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Handle Export submit
  const handleExportSubmit = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Module', 'Details', 'IP Address', 'Severity']
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.user,
      l.role,
      l.action,
      l.module || 'System',
      l.details,
      l.ipAddress || '127.0.0.1',
      l.severity || 'Low',
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((x) => `"${x}"`).join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `campusvoice_audit_logs_${Date.now()}.${exportFormat.toLowerCase()}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    addToast({
      type: 'success',
      title: 'Logs Exported',
      message: `Exported ${filteredLogs.length} audit log entries (${exportFormat}).`,
    })
    setIsExportModalOpen(false)
  }

  // Action badge helpers
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'Login':
        return {
          bg: '#DCFCE7',
          color: '#16A34A',
          icon: '●',
          label: 'Login',
        }
      case 'Create':
        return {
          bg: '#E0F2FE',
          color: '#0284C7',
          icon: '●',
          label: 'Create',
        }
      case 'Update':
        return {
          bg: '#F3E8FF',
          color: '#9333EA',
          icon: '◇',
          label: 'Update',
        }
      case 'Delete':
        return {
          bg: '#FEE2E2',
          color: '#DC2626',
          icon: '🗑',
          label: 'Delete',
        }
      case 'Login Failed':
        return {
          bg: '#FEE2E2',
          color: '#DC2626',
          icon: '●',
          label: 'Login Failed',
        }
      case 'Register':
        return {
          bg: '#DCFCE7',
          color: '#16A34A',
          icon: '●',
          label: 'Register',
        }
      case 'Backup':
        return {
          bg: '#F3F4F6',
          color: '#374151',
          icon: '📁',
          label: 'Backup',
        }
      default:
        return {
          bg: '#F3F4F6',
          color: '#4B5563',
          icon: '●',
          label: action,
        }
    }
  }

  // Severity badge helpers
  const getSeverityBadge = (severity?: 'Low' | 'Medium' | 'High') => {
    switch (severity) {
      case 'High':
        return {
          bg: '#FEE2E2',
          color: '#DC2626',
          label: 'High',
        }
      case 'Medium':
        return {
          bg: '#FEF3C7',
          color: '#D97706',
          label: 'Medium',
        }
      case 'Low':
      default:
        return {
          bg: '#DCFCE7',
          color: '#16A34A',
          label: 'Low',
        }
    }
  }

  // Format timestamp helper
  const formatTimeParts = (iso: string) => {
    const d = new Date(iso)
    if (isNaN(d.getTime())) {
      return { time: '12:00 PM', date: '31 Oct 2026' }
    }
    const hours = d.getHours()
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0')
    const time = `${formattedHours}:${minutes} ${ampm}`

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const date = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    return { time, date }
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
        setOpenDropdown(null)
        setActionMenuLogId(null)
        setIsActivityDropdownOpen(false)
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
              <span
                style={{
                  width: 3.5,
                  height: 16,
                  backgroundColor: '#D5FF38',
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  width: 3.5,
                  height: 22,
                  backgroundColor: '#D5FF38',
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  width: 3.5,
                  height: 12,
                  backgroundColor: '#D5FF38',
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.1 }}>
              CampusVoice
            </div>
            <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
              Your Campus, Your Voice.
            </div>
          </div>
        </Link>

        {/* Global Search Center */}
        <div
          style={{
            flex: '0 1 540px',
            position: 'relative',
            margin: '0 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F3F4F6',
              borderRadius: 9999,
              padding: '9px 18px',
              border: '1px solid #E5E7EB',
            }}
          >
            <Search width={16} height={16} color="#9CA3AF" style={{ marginRight: 10 }} />
            <input
              type="text"
              placeholder="Search announcements, events, placements, users, departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 13,
                color: '#111111',
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 6,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                fontSize: 11,
                fontWeight: 700,
                color: '#6B7280',
              }}
            >
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* User / Actions Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Notification Bell */}
          <Link
            href="/notifications"
            style={{
              position: 'relative',
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#374151',
              textDecoration: 'none',
            }}
          >
            <Bell width={18} height={18} />
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 16,
                height: 16,
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 800,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              3
            </span>
          </Link>

          {/* User Profile Pill */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={(e) => {
                e.stopPropagation()
                setIsProfileMenuOpen(!isProfileMenuOpen)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 9999,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#111111',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                  alt="Admin"
                  fill
                  sizes="36px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.1 }}>Admin</span>
                <span style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 600 }}>
                  System Administrator
                </span>
              </div>
            </div>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  width: 200,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: '1px solid #E5E7EB',
                  padding: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  zIndex: 50,
                }}
              >
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
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
                  My Profile
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
                <ChevronRight width={14} height={14} />
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
                <ChevronRight width={14} height={14} />
              </button>

              {/* 4. Events */}
              <button
                type="button"
                onClick={() => router.push('/events')}
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
                <ChevronRight width={14} height={14} />
              </button>

              {/* 5. Placements */}
              <button
                type="button"
                onClick={() => router.push('/placements')}
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
                <ChevronRight width={14} height={14} />
              </button>

              {/* 6. Academic */}
              <button
                type="button"
                onClick={() => router.push('/academic')}
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
                <ChevronRight width={14} height={14} />
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
                <ChevronRight width={14} height={14} />
              </button>

              {/* 8. Hostel & Facilities */}
              <button
                type="button"
                onClick={() => router.push('/general')}
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
                <ChevronRight width={14} height={14} />
              </button>

              {/* 9. Transport */}
              <button
                type="button"
                onClick={() => router.push('/general')}
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
                <ChevronRight width={14} height={14} />
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
                <ChevronRight width={14} height={14} />
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
                <ChevronRight width={14} height={14} />
              </button>

              {/* 12. Audit Logs - ACTIVE */}
              <button
                type="button"
                onClick={() => router.push('/admin/logs')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  fontWeight: 800,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <FileText width={16} height={16} />
                <span>Audit Logs</span>
              </button>

              {/* 13. Help & Support */}
              <button
                type="button"
                onClick={() => router.push('/activity')}
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
                <ChevronRight width={14} height={14} />
              </button>
            </nav>
          </div>

          {/* Bottom Card: System Healthy */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 18,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/admin/setup')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: '#EA580C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Flame width={18} height={18} />
              </div>
              <div>
                <div style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 800 }}>
                  System Healthy
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 10.5, fontWeight: 500 }}>
                  All services running
                </div>
              </div>
            </div>
            <ChevronRight width={16} height={16} color="#9CA3AF" />
          </div>
        </aside>

        {/* COLUMN 2: CENTER WORKSPACE */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* HEADER ROW: Title + Tilted Sticker + Export Logs Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111111',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <FileText width={24} height={24} />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    letterSpacing: -0.6,
                    lineHeight: 1.15,
                    margin: 0,
                  }}
                >
                  Audit Logs
                </h1>
                <p
                  style={{
                    fontSize: 12.5,
                    color: '#6B7280',
                    margin: '3px 0 0 0',
                    fontWeight: 500,
                  }}
                >
                  Track all system activities, user actions, and administrative changes for transparency and security.
                </p>
              </div>
            </div>

            {/* Sticker & Export Logs Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {/* Tilted Sticker: COMPLETE VISIBILITY FOR A SECURE CAMPUS */}
              <div
                style={{
                  position: 'relative',
                  transform: 'rotate(-3deg)',
                  backgroundColor: '#D5FF38',
                  border: '2px solid #111111',
                  borderRadius: 12,
                  padding: '6px 14px',
                  boxShadow: '3px 3px 0px #111111',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1.15,
                }}
              >
                {/* Decorative accent lines */}
                <div
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: -10,
                    fontSize: 13,
                    fontWeight: 900,
                    color: '#111111',
                    transform: 'rotate(-25deg)',
                  }}
                >
                  \\
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -8,
                    fontSize: 13,
                    fontWeight: 900,
                    color: '#111111',
                    transform: 'rotate(25deg)',
                  }}
                >
                  //
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, color: '#111111' }}>
                  COMPLETE
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, color: '#111111' }}>
                  VISIBILITY
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, color: '#111111' }}>
                  FOR A SECURE
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, color: '#111111' }}>
                  CAMPUS
                </span>
              </div>

              {/* Export Logs Button */}
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  border: '1px solid #E5E7EB',
                  padding: '10px 18px',
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <Download width={16} height={16} />
                <span>Export Logs</span>
              </button>
            </div>
          </div>

          {/* 4 SUMMARY STAT CARDS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
            }}
          >
            {/* Card 1: Total Activities */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '18px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284C7',
                  flexShrink: 0,
                }}
              >
                <FileText width={24} height={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
                    12,456
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      backgroundColor: '#DCFCE7',
                      color: '#16A34A',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <span>↑</span>
                    <span>18%</span>
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', marginTop: 1 }}>
                  Total Activities
                </div>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
                  +1,892 this month
                </div>
              </div>
            </div>

            {/* Card 2: User Actions */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '18px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284C7',
                  flexShrink: 0,
                }}
              >
                <Users width={24} height={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
                    3,842
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      backgroundColor: '#DCFCE7',
                      color: '#16A34A',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <span>↑</span>
                    <span>12%</span>
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', marginTop: 1 }}>
                  User Actions
                </div>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
                  +412 this month
                </div>
              </div>
            </div>

            {/* Card 3: System Changes */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '18px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9333EA',
                  flexShrink: 0,
                }}
              >
                <Settings width={24} height={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
                    1,256
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      backgroundColor: '#DCFCE7',
                      color: '#16A34A',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <span>↑</span>
                    <span>28%</span>
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', marginTop: 1 }}>
                  System Changes
                </div>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
                  +276 this month
                </div>
              </div>
            </div>

            {/* Card 4: Security Events */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '18px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: '#FCE7F3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E11D48',
                  flexShrink: 0,
                }}
              >
                <Shield width={24} height={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
                    286
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <span>↓</span>
                    <span>6%</span>
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', marginTop: 1 }}>
                  Security Events
                </div>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
                  -18 this month
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH & MULTI-FILTER TOOLBAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                flex: '1 1 240px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                border: '1px solid #E5E7EB',
                padding: '9px 14px',
              }}
            >
              <Search width={16} height={16} color="#9CA3AF" style={{ marginRight: 10 }} />
              <input
                type="text"
                placeholder="Search logs (user name, action, module, IP address...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 12.5,
                  color: '#111111',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    padding: 0,
                  }}
                >
                  <X width={14} height={14} />
                </button>
              )}
            </div>

            {/* Dropdown 1: All Modules */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'module' ? null : 'module')
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '9px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  minWidth: 115,
                  justifyContent: 'space-between',
                }}
              >
                <span>{moduleFilter}</span>
                <ChevronDown width={14} height={14} color="#6B7280" />
              </button>

              {openDropdown === 'module' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 6,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    border: '1px solid #E5E7EB',
                    padding: 6,
                    zIndex: 20,
                    minWidth: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxHeight: 220,
                    overflowY: 'auto',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    'All Modules',
                    'Authentication',
                    'Announcements',
                    'User Management',
                    'Comments',
                    'Events',
                    'Users',
                    'Placements',
                    'Academic',
                    'System',
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setModuleFilter(m)
                        setOpenDropdown(null)
                        setCurrentPage(1)
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: 'left',
                        background: moduleFilter === m ? '#F3F4F6' : 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: moduleFilter === m ? '#111111' : '#4B5563',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 2: All Actions */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'action' ? null : 'action')
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '9px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  minWidth: 110,
                  justifyContent: 'space-between',
                }}
              >
                <span>{actionFilter}</span>
                <ChevronDown width={14} height={14} color="#6B7280" />
              </button>

              {openDropdown === 'action' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 6,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    border: '1px solid #E5E7EB',
                    padding: 6,
                    zIndex: 20,
                    minWidth: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    'All Actions',
                    'Login',
                    'Create',
                    'Update',
                    'Delete',
                    'Login Failed',
                    'Register',
                    'Backup',
                  ].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setActionFilter(a)
                        setOpenDropdown(null)
                        setCurrentPage(1)
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: 'left',
                        background: actionFilter === a ? '#F3F4F6' : 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: actionFilter === a ? '#111111' : '#4B5563',
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 3: All Users */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'user' ? null : 'user')
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '9px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  minWidth: 105,
                  justifyContent: 'space-between',
                }}
              >
                <span>{userFilter}</span>
                <ChevronDown width={14} height={14} color="#6B7280" />
              </button>

              {openDropdown === 'user' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 6,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    border: '1px solid #E5E7EB',
                    padding: 6,
                    zIndex: 20,
                    minWidth: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxHeight: 220,
                    overflowY: 'auto',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    'All Users',
                    'Arjun Mehta',
                    'Dr. Priya Sharma',
                    'Admin',
                    'Sneha Iyer',
                    'Rahul Verma',
                    'Vikram Singh',
                    'Ananya Reddy',
                    'Dr. Amit Kumar',
                    'Neha Kapoor',
                    'System',
                  ].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        setUserFilter(u)
                        setOpenDropdown(null)
                        setCurrentPage(1)
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: 'left',
                        background: userFilter === u ? '#F3F4F6' : 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: userFilter === u ? '#111111' : '#4B5563',
                      }}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 4: All Severity */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'severity' ? null : 'severity')
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '9px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  minWidth: 110,
                  justifyContent: 'space-between',
                }}
              >
                <span>{severityFilter}</span>
                <ChevronDown width={14} height={14} color="#6B7280" />
              </button>

              {openDropdown === 'severity' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 6,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    border: '1px solid #E5E7EB',
                    padding: 6,
                    zIndex: 20,
                    minWidth: 130,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {['All Severity', 'Low', 'Medium', 'High'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSeverityFilter(s)
                        setOpenDropdown(null)
                        setCurrentPage(1)
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: 'left',
                        background: severityFilter === s ? '#F3F4F6' : 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: severityFilter === s ? '#111111' : '#4B5563',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Selector Button */}
            <button
              type="button"
              onClick={() => setIsDateRangeModalOpen(true)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 14,
                padding: '9px 14px',
                fontSize: 12,
                fontWeight: 700,
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
              }}
            >
              <Calendar width={14} height={14} color="#6B7280" />
              <span>{dateRange}</span>
            </button>
          </div>

          {/* BULK ACTION BAR */}
          {selectedIds.length > 0 && (
            <div
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 14,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700 }}>
                <CheckSquare width={16} height={16} color="#D5FF38" />
                <span>
                  {selectedIds.length} {selectedIds.length === 1 ? 'log' : 'logs'} selected
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleExportSubmit}
                  style={{
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Export Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginLeft: 6,
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* MAIN AUDIT LOGS TABLE */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: 12.5,
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid #E5E7EB',
                      backgroundColor: '#FAFAFA',
                      color: '#4B5563',
                      fontSize: 11.5,
                      fontWeight: 800,
                    }}
                  >
                    <th style={{ width: 44, padding: '12px 16px' }}>
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: 4,
                          cursor: 'pointer',
                          accentColor: '#111111',
                        }}
                      />
                    </th>
                    <th style={{ padding: '12px 16px', minWidth: 100 }}>Timestamp</th>
                    <th style={{ padding: '12px 16px', minWidth: 140 }}>User</th>
                    <th style={{ padding: '12px 16px', minWidth: 100 }}>Action</th>
                    <th style={{ padding: '12px 16px', minWidth: 120 }}>Module</th>
                    <th style={{ padding: '12px 16px', minWidth: 220 }}>Details</th>
                    <th style={{ padding: '12px 16px', minWidth: 110 }}>IP Address</th>
                    <th style={{ padding: '12px 16px', minWidth: 80 }}>Severity</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', width: 50 }}>...</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
                        <FileText width={32} height={32} color="#D1D5DB" style={{ margin: '0 auto 10px' }} />
                        <div style={{ fontSize: 14, fontWeight: 700 }}>No audit logs found</div>
                        <div style={{ fontSize: 12, marginTop: 4 }}>
                          Try adjusting your filter options or search term.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => {
                      const isSelected = selectedIds.includes(log.id)
                      const isDetailActive = selectedLog?.id === log.id
                      const timeParts = formatTimeParts(log.timestamp)
                      const actionBadge = getActionBadge(log.action)
                      const severityBadge = getSeverityBadge(log.severity)

                      return (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedLog(log)}
                          style={{
                            borderBottom: '1px solid #F3F4F6',
                            backgroundColor: isDetailActive
                              ? '#F9FAFB'
                              : isSelected
                              ? '#F8FAFC'
                              : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'background-color 0.1s ease',
                          }}
                        >
                          {/* Checkbox */}
                          <td
                            style={{ padding: '12px 16px' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(log.id)}
                              style={{
                                width: 15,
                                height: 15,
                                borderRadius: 4,
                                cursor: 'pointer',
                                accentColor: '#111111',
                              }}
                            />
                          </td>

                          {/* Timestamp */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#111111', fontSize: 12 }}>
                              {timeParts.time}
                            </div>
                            <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 1 }}>
                              {timeParts.date}
                            </div>
                          </td>

                          {/* User */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  overflow: 'hidden',
                                  position: 'relative',
                                  backgroundColor: '#E5E7EB',
                                  flexShrink: 0,
                                }}
                              >
                                {log.userAvatar ? (
                                  <Image
                                    src={log.userAvatar}
                                    alt={log.user}
                                    fill
                                    sizes="32px"
                                    style={{ objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 800,
                                      fontSize: 11,
                                      color: '#4B5563',
                                    }}
                                  >
                                    {log.user === 'System' ? (
                                      <Settings width={16} height={16} />
                                    ) : (
                                      log.user.slice(0, 2).toUpperCase()
                                    )}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: '#111111', fontSize: 12.5 }}>
                                  {log.user}
                                </div>
                                <div style={{ fontSize: 10.5, color: '#6B7280' }}>
                                  ({log.role})
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Action Badge */}
                          <td style={{ padding: '12px 16px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: actionBadge.bg,
                                color: actionBadge.color,
                                padding: '3px 9px',
                                borderRadius: 9999,
                                fontSize: 11,
                                fontWeight: 800,
                              }}
                            >
                              <span>{actionBadge.icon}</span>
                              <span>{actionBadge.label}</span>
                            </span>
                          </td>

                          {/* Module */}
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#374151' }}>
                            {log.module || 'System'}
                          </td>

                          {/* Details */}
                          <td
                            style={{
                              padding: '12px 16px',
                              color: '#4B5563',
                              fontSize: 12,
                              maxWidth: 240,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {log.details}
                          </td>

                          {/* IP Address */}
                          <td
                            style={{
                              padding: '12px 16px',
                              color: '#6B7280',
                              fontFamily: 'monospace',
                              fontSize: 11.5,
                            }}
                          >
                            {log.ipAddress || '192.168.1.1'}
                          </td>

                          {/* Severity */}
                          <td style={{ padding: '12px 16px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: severityBadge.bg,
                                color: severityBadge.color,
                                padding: '3px 8px',
                                borderRadius: 9999,
                                fontSize: 10.5,
                                fontWeight: 800,
                              }}
                            >
                              <span
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: '50%',
                                  backgroundColor: severityBadge.color,
                                }}
                              />
                              <span>{severityBadge.label}</span>
                            </span>
                          </td>

                          {/* Actions Menu */}
                          <td
                            style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setActionMenuLogId(
                                  actionMenuLogId === log.id ? null : log.id
                                )
                              }
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#6B7280',
                                padding: '4px 8px',
                                borderRadius: 6,
                                cursor: 'pointer',
                              }}
                            >
                              <MoreHorizontal width={16} height={16} />
                            </button>

                            {actionMenuLogId === log.id && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '80%',
                                  right: 16,
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: 12,
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                  border: '1px solid #E5E7EB',
                                  padding: 6,
                                  zIndex: 30,
                                  minWidth: 160,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 2,
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLog(log)
                                    setActionMenuLogId(null)
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '7px 10px',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    textAlign: 'left',
                                    background: 'none',
                                    border: 'none',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    color: '#111111',
                                  }}
                                >
                                  <Eye width={14} height={14} />
                                  <span>View Details</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUserFilter(log.user)
                                    setActionMenuLogId(null)
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '7px 10px',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    textAlign: 'left',
                                    background: 'none',
                                    border: 'none',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    color: '#111111',
                                  }}
                                >
                                  <Users width={14} height={14} />
                                  <span>Filter User Logs</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchQuery(log.ipAddress || '')
                                    setActionMenuLogId(null)
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '7px 10px',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    textAlign: 'left',
                                    background: 'none',
                                    border: 'none',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    color: '#111111',
                                  }}
                                >
                                  <Globe width={14} height={14} />
                                  <span>Filter IP Address</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderTop: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 12.5, color: '#6B7280', fontWeight: 600 }}>
                Showing{' '}
                <span style={{ fontWeight: 800, color: '#111111' }}>
                  {filteredLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, filteredLogs.length)}
                </span>{' '}
                of <span style={{ fontWeight: 800, color: '#111111' }}>12,456</span> logs
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: currentPage === 1 ? '#D1D5DB' : '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  ‹
                </button>

                {[1, 2, 3, 4, 5].map((pageNum) => {
                  const isActive = currentPage === pageNum
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        border: '1px solid',
                        borderColor: isActive ? '#111111' : '#E5E7EB',
                        backgroundColor: isActive ? '#111111' : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <span style={{ color: '#9CA3AF', fontSize: 12, padding: '0 4px' }}>...</span>

                <button
                  type="button"
                  onClick={() => setCurrentPage(1246)}
                  style={{
                    padding: '0 8px',
                    height: 30,
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  1246
                </button>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: currentPage >= totalPages ? '#D1D5DB' : '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* COLUMN 3: RIGHT SIDEBAR */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* CARD 1: LOG DETAILS */}
          {selectedLog && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '18px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
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
                  <FileText width={17} height={17} color="#111111" />
                  <span style={{ fontSize: 13.5, fontWeight: 800 }}>Log Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <X width={16} height={16} />
                </button>
              </div>

              {/* User Hero Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  paddingBottom: 14,
                  borderBottom: '1px solid #F3F4F6',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#E5E7EB',
                    flexShrink: 0,
                  }}
                >
                  {selectedLog.userAvatar ? (
                    <Image
                      src={selectedLog.userAvatar}
                      alt={selectedLog.user}
                      fill
                      sizes="48px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: 15,
                        color: '#4B5563',
                      }}
                    >
                      {selectedLog.user.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: 900,
                        color: '#111111',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {selectedLog.user}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        backgroundColor: '#F3E8FF',
                        color: '#9333EA',
                        padding: '2px 8px',
                        borderRadius: 9999,
                      }}
                    >
                      {selectedLog.role}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#6B7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: 2,
                    }}
                  >
                    {selectedLog.userEmail || `${selectedLog.user.toLowerCase().replace(/[\s.]+/g, '')}@college.edu`}
                  </div>
                  {selectedLog.userId && (
                    <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace', marginTop: 1 }}>
                      ID: {selectedLog.userId}
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata Attribute List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '14px 0', fontSize: 11.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6B7280' }}>Action</span>
                  <span
                    style={{
                      fontWeight: 800,
                      backgroundColor: '#DCFCE7',
                      color: '#16A34A',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontSize: 11,
                    }}
                  >
                    {selectedLog.action === 'Create' ? 'Create Announcement' : selectedLog.action}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Module</span>
                  <span style={{ fontWeight: 700, color: '#111111' }}>{selectedLog.module || 'Announcements'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Timestamp</span>
                  <span style={{ fontWeight: 700, color: '#111111' }}>
                    {formatTimeParts(selectedLog.timestamp).date}, {formatTimeParts(selectedLog.timestamp).time}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>IP Address</span>
                  <span style={{ fontWeight: 700, color: '#111111', fontFamily: 'monospace' }}>
                    {selectedLog.ipAddress || '192.168.1.56'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Device</span>
                  <span style={{ fontWeight: 700, color: '#111111' }}>
                    {selectedLog.device || 'Chrome (Windows)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Location</span>
                  <span style={{ fontWeight: 700, color: '#111111' }}>
                    {selectedLog.location || 'College Campus (On-site)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6B7280' }}>Status</span>
                  <span
                    style={{
                      fontWeight: 800,
                      backgroundColor: selectedLog.status === 'Failed' ? '#FEE2E2' : '#DCFCE7',
                      color: selectedLog.status === 'Failed' ? '#DC2626' : '#16A34A',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontSize: 11,
                    }}
                  >
                    {selectedLog.status || 'Success'}
                  </span>
                </div>
              </div>

              {/* Description Block */}
              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 12 }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111', marginBottom: 4 }}>
                  Description
                </div>
                <p style={{ fontSize: 11, color: '#6B7280', margin: 0, lineHeight: 1.45 }}>
                  {selectedLog.details}
                </p>
              </div>
            </div>
          )}

          {/* CARD 2: ACTIVITY DISTRIBUTION (DONUT CHART) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '18px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
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
              <span style={{ fontSize: 13, fontWeight: 800 }}>Activity Distribution</span>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsActivityDropdownOpen(!isActivityDropdownOpen)
                  }}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#6B7280',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <span>{activityTimeframe}</span>
                  <ChevronDown width={12} height={12} />
                </button>

                {isActivityDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 4,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 10,
                      boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                      border: '1px solid #E5E7EB',
                      padding: 4,
                      zIndex: 20,
                      minWidth: 110,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {(['Last 7 Days', 'Last 30 Days', 'All Time'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setActivityTimeframe(t)
                          setIsActivityDropdownOpen(false)
                        }}
                        style={{
                          padding: '5px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          textAlign: 'left',
                          background: activityTimeframe === t ? '#F3F4F6' : 'none',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Donut Chart Visual */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* SVG Donut */}
              <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Total Circ = 2 * PI * 38 = 238.76 */}
                  {/* Segment 1: User Actions 42% (99.8) -> green */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#86EFAC"
                    strokeWidth="14"
                    strokeDasharray="99.8 138.9"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Content Actions 24% (57.3) -> purple */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#C084FC"
                    strokeWidth="14"
                    strokeDasharray="57.3 181.4"
                    strokeDashoffset="-99.8"
                  />
                  {/* Segment 3: System Changes 18% (42.9) -> cyan */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="14"
                    strokeDasharray="42.9 195.8"
                    strokeDashoffset="-157.1"
                  />
                  {/* Segment 4: Security Events 9% (21.5) -> pink */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#F472B6"
                    strokeWidth="14"
                    strokeDasharray="21.5 217.2"
                    strokeDashoffset="-200.0"
                  />
                  {/* Segment 5: Other 7% (16.7) -> yellow */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#FDE047"
                    strokeWidth="14"
                    strokeDasharray="16.7 222.0"
                    strokeDashoffset="-221.5"
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
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>3,842</span>
                  <span style={{ fontSize: 7.5, color: '#6B7280', fontWeight: 600 }}>Total Actions</span>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#86EFAC' }} />
                    <span style={{ color: '#4B5563' }}>User Actions</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#111111' }}>42%</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#C084FC' }} />
                    <span style={{ color: '#4B5563' }}>Content Actions</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#111111' }}>24%</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                    <span style={{ color: '#4B5563' }}>System Changes</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#111111' }}>18%</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#F472B6' }} />
                    <span style={{ color: '#4B5563' }}>Security Events</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#111111' }}>9%</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#FDE047' }} />
                    <span style={{ color: '#4B5563' }}>Other</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#111111' }}>7%</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: RECENT SECURITY EVENTS */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '18px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
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
              <span style={{ fontSize: 13, fontWeight: 800 }}>Recent Security Events</span>
              <button
                type="button"
                onClick={() => setIsSecurityModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                View All →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                {
                  title: 'Multiple failed login attempts',
                  time: '2 hours ago',
                  severity: 'High',
                  badgeBg: '#FEE2E2',
                  badgeColor: '#DC2626',
                  iconColor: '#DC2626',
                },
                {
                  title: 'Suspicious IP access detected',
                  time: '5 hours ago',
                  severity: 'High',
                  badgeBg: '#FEE2E2',
                  badgeColor: '#DC2626',
                  iconColor: '#DC2626',
                },
                {
                  title: 'Unauthorized file access attempt',
                  time: '1 day ago',
                  severity: 'Medium',
                  badgeBg: '#FEF3C7',
                  badgeColor: '#D97706',
                  iconColor: '#D97706',
                },
                {
                  title: 'Admin role change',
                  time: '2 days ago',
                  severity: 'Medium',
                  badgeBg: '#FEF3C7',
                  badgeColor: '#D97706',
                  iconColor: '#D97706',
                },
                {
                  title: 'Bulk data export',
                  time: '3 days ago',
                  severity: 'High',
                  badgeBg: '#FEE2E2',
                  badgeColor: '#DC2626',
                  iconColor: '#DC2626',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <Shield width={16} height={16} color={item.iconColor} style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#111111',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>{item.time}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      backgroundColor: item.badgeBg,
                      color: item.badgeColor,
                      padding: '2px 7px',
                      borderRadius: 9999,
                      flexShrink: 0,
                    }}
                  >
                    {item.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ===================== MODALS ===================== */}

      {/* MODAL 1: EXPORT LOGS */}
      {isExportModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: 16,
          }}
          onClick={() => setIsExportModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: '#D5FF38',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111111',
                  }}
                >
                  <Download width={20} height={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0 }}>Export Audit Logs</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                    Download filtered activity records for compliance
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={20} height={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Export Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {(['CSV', 'JSON', 'PDF'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setExportFormat(fmt)}
                      style={{
                        padding: '10px 0',
                        borderRadius: 12,
                        border: '1px solid',
                        borderColor: exportFormat === fmt ? '#111111' : '#E5E7EB',
                        backgroundColor: exportFormat === fmt ? '#111111' : '#FFFFFF',
                        color: exportFormat === fmt ? '#D5FF38' : '#374151',
                        fontSize: 12.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Date Range
                </label>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#F9FAFB',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#111111',
                  }}
                >
                  📅 {dateRange} ({filteredLogs.length} matching records)
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: 9999,
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExportSubmit}
                  style={{
                    padding: '9px 22px',
                    borderRadius: 9999,
                    border: 'none',
                    backgroundColor: '#111111',
                    color: '#D5FF38',
                    fontSize: 12.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Download {exportFormat}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DATE RANGE PICKER */}
      {isDateRangeModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: 16,
          }}
          onClick={() => setIsDateRangeModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 400,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>Select Date Range</div>
              <button
                type="button"
                onClick={() => setIsDateRangeModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={18} height={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                '1 Oct 2026 - 31 Oct 2026',
                'Last 7 Days',
                'Last 30 Days',
                'Last 90 Days',
                'Academic Year 2026',
              ].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setDateRange(range)
                    setIsDateRangeModalOpen(false)
                    addToast({
                      type: 'info',
                      title: 'Date Filter Applied',
                      message: `Showing audit activity for: ${range}`,
                    })
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1px solid',
                    borderColor: dateRange === range ? '#111111' : '#E5E7EB',
                    backgroundColor: dateRange === range ? '#F9FAFB' : '#FFFFFF',
                    fontSize: 12.5,
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#111111',
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SECURITY EVENTS DEEP DIVE */}
      {isSecurityModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: 16,
          }}
          onClick={() => setIsSecurityModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 580,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DC2626',
                  }}
                >
                  <ShieldAlert width={20} height={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Security Incident Feed</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Real-time anomalous access alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSecurityModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={20} height={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 340, overflowY: 'auto' }}>
              {[
                {
                  event: 'Multiple failed login attempts',
                  detail: '4 incorrect passwords from IP 192.168.1.201 (Account: vikram.singh@college.edu)',
                  time: '30 Oct 2026, 11:20 PM',
                  action: 'Account temporarily locked for 15 mins',
                },
                {
                  event: 'Suspicious IP access detected',
                  detail: 'Login from unusual subnet 198.51.100.24 outside campus geofence',
                  time: '30 Oct 2026, 06:14 PM',
                  action: '2FA challenge prompted and passed',
                },
                {
                  event: 'Unauthorized file access attempt',
                  detail: 'Attempted to fetch internal faculty ledger /api/v1/ledger/staff-payroll',
                  time: '29 Oct 2026, 02:40 PM',
                  action: 'HTTP 403 Forbidden emitted & IP logged',
                },
              ].map((ev, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: 14,
                    padding: '12px 14px',
                    backgroundColor: '#F9FAFB',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>{ev.event}</span>
                    <span style={{ fontSize: 10.5, color: '#9CA3AF' }}>{ev.time}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#4B5563', marginTop: 4 }}>{ev.detail}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', marginTop: 4 }}>
                    Automated Defense: {ev.action}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button
                type="button"
                onClick={() => setIsSecurityModalOpen(false)}
                style={{
                  padding: '9px 20px',
                  borderRadius: 9999,
                  border: 'none',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
