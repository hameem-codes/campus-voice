'use client'

import React, { useState, useMemo, useRef } from 'react'
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
  BookOpen,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { UserProfile, Role } from '@/types'
import { ToastContainer } from '@/components/ui/ToastContainer'

export function AdminUsersView() {
  const router = useRouter()
  const {
    users: storeUsers,
    currentUser,
    departments,
    addUser,
    editUser,
    toggleUserActive,
    bulkImportUsers,
    addToast,
    logout,
  } = useStore()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'All' | 'student' | 'faculty' | 'staff' | 'admin' | 'deactivated'
  >('All')
  const [roleDropdown, setRoleDropdown] = useState<'All' | 'student' | 'faculty' | 'staff' | 'admin'>('All')
  const [deptDropdown, setDeptDropdown] = useState<string>('All Departments')
  const [statusDropdown, setStatusDropdown] = useState<'All' | 'active' | 'inactive'>('All')
  const [sortDropdown, setSortDropdown] = useState<'Newest' | 'Oldest' | 'NameAsc' | 'NameDesc'>('Newest')

  // Dropdown toggles
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Right sidebar selected user
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(() => {
    // Default to Arjun Mehta if present, else first user
    return (
      storeUsers.find((u) => u.name === 'Arjun Mehta') ||
      storeUsers[0] ||
      currentUser
    )
  })

  // Selected user detail tab
  const [detailTab, setDetailTab] = useState<'Overview' | 'Activity' | 'Permissions' | 'History'>('Overview')

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 8

  // Action menu on rows
  const [actionMenuUserId, setActionMenuUserId] = useState<string | null>(null)

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [editingTarget, setEditingTarget] = useState<UserProfile | null>(null)
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [resetTargetUser, setResetTargetUser] = useState<UserProfile | null>(null)
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [deactivateConfirmTarget, setDeactivateConfirmTarget] = useState<UserProfile | null>(null)

  // Form states for Add User
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formRole, setFormRole] = useState<Role>('student')
  const [formDept, setFormDept] = useState('Computer Science')
  const [formId, setFormId] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formYear, setFormYear] = useState('1st Year')
  const [formSendInvite, setFormSendInvite] = useState(true)

  // Notification Modal State
  const [notifRecipientRole, setNotifRecipientRole] = useState<string>('All')
  const [notifSubject, setNotifSubject] = useState('')
  const [notifMessage, setNotifMessage] = useState('')

  // CSV file ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate live counts
  const stats = useMemo(() => {
    const total = 12456 // matching reference total display
    const students = 9842
    const faculty = 486
    const staff = 128
    const admins = 12
    const deactivated = 34

    return { total, students, faculty, staff, admins, deactivated }
  }, [])

  // Filter & Search logic
  const filteredUsers = useMemo(() => {
    return storeUsers.filter((u) => {
      // Tab filter
      if (activeTab === 'student' && u.role !== 'student') return false
      if (activeTab === 'faculty' && u.role !== 'faculty') return false
      if (activeTab === 'staff' && u.role !== 'staff') return false
      if (activeTab === 'admin' && u.role !== 'admin') return false
      if (activeTab === 'deactivated' && u.active !== false) return false

      // Role dropdown filter
      if (roleDropdown !== 'All' && u.role !== roleDropdown) return false

      // Dept dropdown filter
      if (deptDropdown !== 'All Departments' && u.department !== deptDropdown) return false

      // Status dropdown filter
      if (statusDropdown === 'active' && !u.active) return false
      if (statusDropdown === 'inactive' && u.active) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = u.name.toLowerCase().includes(q)
        const matchEmail = u.email.toLowerCase().includes(q)
        const matchId = (u.studentId || '').toLowerCase().includes(q)
        const matchDept = u.department.toLowerCase().includes(q)
        if (!matchName && !matchEmail && !matchId && !matchDept) return false
      }

      return true
    }).sort((a, b) => {
      if (sortDropdown === 'NameAsc') return a.name.localeCompare(b.name)
      if (sortDropdown === 'NameDesc') return b.name.localeCompare(a.name)
      return 0
    })
  }, [storeUsers, activeTab, roleDropdown, deptDropdown, statusDropdown, searchQuery, sortDropdown])

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage, pageSize])

  // Select all toggle
  const isAllSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((u) => selectedIds.includes(u.id))

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedUsers.map((u) => u.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Handle Add User Submit
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formEmail.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Name and email are required.',
      })
      return
    }

    await addUser({
      name: formName.trim(),
      email: formEmail.trim(),
      role: formRole,
      department: formDept,
      studentId: formId.trim() || undefined,
      phone: formPhone.trim() || undefined,
      year: formRole === 'student' ? formYear : undefined,
      active: true,
      notificationPreferences: {
        urgentNotices: true,
        deadlines: true,
        communityEvents: true,
        emailChannel: true,
        pushChannel: true,
        smsChannel: false,
      },
    })

    addToast({
      type: 'success',
      title: 'User Added',
      message: `${formName} has been invited as ${formRole}.`,
    })

    setFormName('')
    setFormEmail('')
    setFormId('')
    setFormPhone('')
    setIsAddUserModalOpen(false)
  }

  // Handle Edit User Submit
  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTarget) return

    await editUser(editingTarget)
    if (selectedUser?.id === editingTarget.id) {
      setSelectedUser(editingTarget)
    }

    addToast({
      type: 'success',
      title: 'User Updated',
      message: `Updated profile for ${editingTarget.name}.`,
    })
    setIsEditUserModalOpen(false)
    setEditingTarget(null)
  }

  // Handle Toggle Active
  const handleToggleActive = async (user: UserProfile) => {
    await toggleUserActive(user.id)
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...user, active: !user.active })
    }
  }

  // Handle CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'Joined On', 'Last Active']
    const rows = filteredUsers.map((u) => [
      u.studentId || u.id,
      u.name,
      u.email,
      u.role,
      u.department,
      u.active ? 'Active' : 'Inactive',
      u.joinedOn || '12 Aug 2023',
      u.lastSeen || 'Recently',
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((x) => `"${x}"`).join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `campusvoice_users_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    addToast({
      type: 'success',
      title: 'Users Exported',
      message: `Exported ${filteredUsers.length} users to CSV.`,
    })
  }

  // Handle CSV File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter((l) => l.trim())
      if (lines.length <= 1) {
        addToast({
          type: 'error',
          title: 'Empty File',
          message: 'CSV file contains no user records.',
        })
        return
      }

      const importedList = lines.slice(1).map((line, idx) => {
        const parts = line.split(',').map((p) => p.trim().replace(/^"|"$/g, ''))
        return {
          name: parts[0] || `Imported User ${idx + 1}`,
          email: parts[1] || `user${idx + 1}@college.edu`,
          role: (parts[2]?.toLowerCase() === 'faculty'
            ? 'faculty'
            : parts[2]?.toLowerCase() === 'staff'
            ? 'staff'
            : 'student') as Role,
          department: parts[3] || 'Computer Science',
          active: true,
          notificationPreferences: {
            urgentNotices: true,
            deadlines: true,
            communityEvents: false,
            emailChannel: true,
            pushChannel: true,
            smsChannel: false,
          },
        }
      })

      await bulkImportUsers(importedList)
      addToast({
        type: 'success',
        title: 'Bulk Import Completed',
        message: `Successfully imported ${importedList.length} users from CSV.`,
      })
      setIsBulkUploadModalOpen(false)
    }
    reader.readAsText(file)
  }

  // Handle Send Broadcast Notification
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault()
    if (!notifSubject.trim() || !notifMessage.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide subject and message text.',
      })
      return
    }

    addToast({
      type: 'success',
      title: 'Broadcast Sent',
      message: `Notification sent to ${notifRecipientRole} users: "${notifSubject}"`,
    })
    setNotifSubject('')
    setNotifMessage('')
    setIsNotificationModalOpen(false)
  }

  // Helper for role badge styling
  const getRoleBadge = (role: Role | 'staff' | string) => {
    switch (role) {
      case 'student':
        return {
          bg: '#E0F2FE',
          text: '#0284C7',
          icon: GraduationCap,
          label: 'Student',
        }
      case 'faculty':
        return {
          bg: '#FCE7F3',
          text: '#DB2777',
          icon: Users,
          label: 'Faculty',
        }
      case 'staff':
        return {
          bg: '#F3E8FF',
          text: '#9333EA',
          icon: Briefcase,
          label: 'Staff',
        }
      case 'admin':
        return {
          bg: '#F7FEE7',
          text: '#4D7C0F',
          icon: Shield,
          label: 'Admin',
        }
      default:
        return {
          bg: '#F3F4F6',
          text: '#4B5563',
          icon: Users,
          label: role,
        }
    }
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
        setActionMenuUserId(null)
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

              {/* 2. Users Management - ACTIVE */}
              <button
                type="button"
                onClick={() => router.push('/admin/users')}
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
                <Users width={16} height={16} />
                <span>Users Management</span>
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
                <CalendarDays width={16} height={16} />
                <span>Events</span>
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
                <Activity width={16} height={16} />
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
                <ChevronRight width={14} height={14} />
              </button>

              {/* 12. Audit Logs */}
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
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  fontWeight: 700,
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
          {/* HEADER ROW: Title + Tilted Sticker + Add New User Button */}
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
                <Users width={24} height={24} />
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
                  User & Role Management
                </h1>
                <p
                  style={{
                    fontSize: 12.5,
                    color: '#6B7280',
                    margin: '3px 0 0 0',
                    fontWeight: 500,
                  }}
                >
                  Manage users, roles, permissions and access across the campus platform.
                </p>
              </div>
            </div>

            {/* Sticker & Add New User Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {/* Tilted Sticker: RIGHT PEOPLE RIGHT ACCESS A SAFER CAMPUS */}
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
                  RIGHT PEOPLE
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, color: '#111111' }}>
                  RIGHT ACCESS
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, color: '#111111' }}>
                  A SAFER CAMPUS
                </span>
              </div>

              {/* + Add New User Button */}
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  padding: '11px 20px',
                  borderRadius: 9999,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <Plus width={16} height={16} strokeWidth={2.5} />
                <span>Add New User</span>
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
            {/* Card 1: Total Users */}
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
                    <span>8%</span>
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', marginTop: 1 }}>
                  Total Users
                </div>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
                  +912 this month
                </div>
              </div>
            </div>

            {/* Card 2: Students */}
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
                  color: '#DB2777',
                  flexShrink: 0,
                }}
              >
                <GraduationCap width={24} height={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
                    9,842
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
                    <span>7%</span>
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', marginTop: 1 }}>
                  Students
                </div>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
                  +642 this month
                </div>
              </div>
            </div>

            {/* Card 3: Faculty */}
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
                <Users width={24} height={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
                    486
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
                    <span>5%</span>
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', marginTop: 1 }}>
                  Faculty
                </div>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
                  +21 this month
                </div>
              </div>
            </div>

            {/* Card 4: Staff */}
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
                  backgroundColor: '#FEF9C3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CA8A04',
                  flexShrink: 0,
                }}
              >
                <Settings width={24} height={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
                    128
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
                  Staff
                </div>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
                  +14 this month
                </div>
              </div>
            </div>
          </div>

          {/* FILTER TABS (PILLS) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 2,
            }}
          >
            {[
              { id: 'All', label: 'All Users', count: stats.total.toLocaleString() },
              { id: 'student', label: 'Students', count: stats.students.toLocaleString() },
              { id: 'faculty', label: 'Faculty', count: stats.faculty.toString() },
              { id: 'staff', label: 'Staff', count: stats.staff.toString() },
              { id: 'admin', label: 'Admins', count: stats.admins.toString() },
              { id: 'deactivated', label: 'Deactivated', count: stats.deactivated.toString() },
            ].map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    setCurrentPage(1)
                  }}
                  style={{
                    backgroundColor: isActive ? '#111111' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#4B5563',
                    border: '1px solid',
                    borderColor: isActive ? '#111111' : '#E5E7EB',
                    borderRadius: 9999,
                    padding: '8px 16px',
                    fontSize: 12.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      color: isActive ? '#D5FF38' : '#9CA3AF',
                      fontWeight: 700,
                    }}
                  >
                    ({tab.count})
                  </span>
                </button>
              )
            })}
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                flex: '1 1 260px',
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
                placeholder="Search users by name, email, roll number..."
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

            {/* Dropdown 1: All Roles */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'role' ? null : 'role')
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '9px 14px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  minWidth: 120,
                  justifyContent: 'space-between',
                }}
              >
                <span>
                  {roleDropdown === 'All'
                    ? 'All Roles'
                    : roleDropdown.charAt(0).toUpperCase() + roleDropdown.slice(1)}
                </span>
                <ChevronDown width={14} height={14} color="#6B7280" />
              </button>

              {openDropdown === 'role' && (
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
                    { id: 'All', label: 'All Roles' },
                    { id: 'student', label: 'Student' },
                    { id: 'faculty', label: 'Faculty' },
                    { id: 'staff', label: 'Staff' },
                    { id: 'admin', label: 'Admin' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setRoleDropdown(r.id as any)
                        setOpenDropdown(null)
                        setCurrentPage(1)
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: 'left',
                        background: roleDropdown === r.id ? '#F3F4F6' : 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: roleDropdown === r.id ? '#111111' : '#4B5563',
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 2: All Departments */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'dept' ? null : 'dept')
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '9px 14px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  minWidth: 140,
                  justifyContent: 'space-between',
                }}
              >
                <span>{deptDropdown}</span>
                <ChevronDown width={14} height={14} color="#6B7280" />
              </button>

              {openDropdown === 'dept' && (
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
                    minWidth: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxHeight: 220,
                    overflowY: 'auto',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    'All Departments',
                    'Computer Science',
                    'Mechanical',
                    'Electronics',
                    'Civil',
                    'Mathematics',
                    'Administration',
                    'Hostel Management',
                    'School of Design',
                  ].map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        setDeptDropdown(dept)
                        setOpenDropdown(null)
                        setCurrentPage(1)
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: 'left',
                        background: deptDropdown === dept ? '#F3F4F6' : 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: deptDropdown === dept ? '#111111' : '#4B5563',
                      }}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 3: All Status */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'status' ? null : 'status')
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '9px 14px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  minWidth: 110,
                  justifyContent: 'space-between',
                }}
              >
                <span>
                  {statusDropdown === 'All'
                    ? 'All Status'
                    : statusDropdown.charAt(0).toUpperCase() + statusDropdown.slice(1)}
                </span>
                <ChevronDown width={14} height={14} color="#6B7280" />
              </button>

              {openDropdown === 'status' && (
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
                    minWidth: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { id: 'All', label: 'All Status' },
                    { id: 'active', label: 'Active' },
                    { id: 'inactive', label: 'Inactive' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setStatusDropdown(s.id as any)
                        setOpenDropdown(null)
                        setCurrentPage(1)
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: 'left',
                        background: statusDropdown === s.id ? '#F3F4F6' : 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: statusDropdown === s.id ? '#111111' : '#4B5563',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 4: Newest First */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenDropdown(openDropdown === 'sort' ? null : 'sort')
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '9px 14px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  minWidth: 130,
                  justifyContent: 'space-between',
                }}
              >
                <span>
                  {sortDropdown === 'Newest'
                    ? 'Newest First'
                    : sortDropdown === 'Oldest'
                    ? 'Oldest First'
                    : sortDropdown === 'NameAsc'
                    ? 'Name (A-Z)'
                    : 'Name (Z-A)'}
                </span>
                <ChevronDown width={14} height={14} color="#6B7280" />
              </button>

              {openDropdown === 'sort' && (
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
                    minWidth: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { id: 'Newest', label: 'Newest First' },
                    { id: 'Oldest', label: 'Oldest First' },
                    { id: 'NameAsc', label: 'Name (A-Z)' },
                    { id: 'NameDesc', label: 'Name (Z-A)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSortDropdown(s.id as any)
                        setOpenDropdown(null)
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: 'left',
                        background: sortDropdown === s.id ? '#F3F4F6' : 'none',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: sortDropdown === s.id ? '#111111' : '#4B5563',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BULK ACTION FLOATING BAR (If any selected) */}
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
                  {selectedIds.length} {selectedIds.length === 1 ? 'user' : 'users'} selected
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    selectedIds.forEach((id) => toggleUserActive(id))
                    addToast({
                      type: 'info',
                      title: 'Bulk Status Updated',
                      message: `Updated status for ${selectedIds.length} users.`,
                    })
                    setSelectedIds([])
                  }}
                  style={{
                    backgroundColor: '#262626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Toggle Status
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
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

          {/* MAIN USER TABLE CONTAINER */}
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
                      textTransform: 'none',
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
                    <th style={{ padding: '12px 16px' }}>User</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px' }}>Department</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Joined On</th>
                    <th style={{ padding: '12px 16px' }}>Last Active</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
                        <Users width={32} height={32} color="#D1D5DB" style={{ margin: '0 auto 10px' }} />
                        <div style={{ fontSize: 14, fontWeight: 700 }}>No users found</div>
                        <div style={{ fontSize: 12, marginTop: 4 }}>
                          Try adjusting your search query or role filter.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => {
                      const isSelected = selectedIds.includes(user.id)
                      const isDetailActive = selectedUser?.id === user.id
                      const roleBadge = getRoleBadge(user.role)
                      const RoleIcon = roleBadge.icon

                      return (
                        <tr
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
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
                              onChange={() => toggleSelect(user.id)}
                              style={{
                                width: 15,
                                height: 15,
                                borderRadius: 4,
                                cursor: 'pointer',
                                accentColor: '#111111',
                              }}
                            />
                          </td>

                          {/* User: Avatar + Name + Email + ID */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  overflow: 'hidden',
                                  position: 'relative',
                                  backgroundColor: '#E5E7EB',
                                  flexShrink: 0,
                                }}
                              >
                                {user.avatarUrl ? (
                                  <Image
                                    src={user.avatarUrl}
                                    alt={user.name}
                                    fill
                                    sizes="36px"
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
                                      fontSize: 12,
                                      color: '#4B5563',
                                    }}
                                  >
                                    {user.avatarInitials || user.name.slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 800, color: '#111111', fontSize: 13 }}>
                                  {user.name}
                                </span>
                                <span style={{ fontSize: 11, color: '#6B7280' }}>{user.email}</span>
                                {user.studentId && (
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: '#9CA3AF',
                                      fontFamily: 'monospace',
                                      fontWeight: 700,
                                      marginTop: 1,
                                    }}
                                  >
                                    {user.studentId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td style={{ padding: '12px 16px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 5,
                                backgroundColor: roleBadge.bg,
                                color: roleBadge.text,
                                padding: '4px 10px',
                                borderRadius: 9999,
                                fontSize: 11.5,
                                fontWeight: 800,
                              }}
                            >
                              <RoleIcon width={13} height={13} />
                              <span>{roleBadge.label}</span>
                            </span>
                          </td>

                          {/* Department */}
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#374151' }}>
                            {user.department}
                          </td>

                          {/* Status */}
                          <td style={{ padding: '12px 16px' }}>
                            {user.active ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  backgroundColor: '#DCFCE7',
                                  color: '#16A34A',
                                  padding: '4px 10px',
                                  borderRadius: 9999,
                                  fontSize: 11,
                                  fontWeight: 800,
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
                                <span>Active</span>
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  backgroundColor: '#FEE2E2',
                                  color: '#DC2626',
                                  padding: '4px 10px',
                                  borderRadius: 9999,
                                  fontSize: 11,
                                  fontWeight: 800,
                                }}
                              >
                                <span
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    backgroundColor: '#DC2626',
                                  }}
                                />
                                <span>Inactive</span>
                              </span>
                            )}
                          </td>

                          {/* Joined On */}
                          <td style={{ padding: '12px 16px', color: '#4B5563', fontWeight: 600 }}>
                            {user.joinedOn || '12 Aug 2023'}
                          </td>

                          {/* Last Active */}
                          <td style={{ padding: '12px 16px', color: '#6B7280' }}>
                            {user.lastSeen || '2 hours ago'}
                          </td>

                          {/* Actions (...) */}
                          <td
                            style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setActionMenuUserId(
                                  actionMenuUserId === user.id ? null : user.id
                                )
                              }}
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

                            {/* Dropdown menu */}
                            {actionMenuUserId === user.id && (
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
                                    setSelectedUser(user)
                                    setActionMenuUserId(null)
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
                                    setEditingTarget(user)
                                    setIsEditUserModalOpen(true)
                                    setActionMenuUserId(null)
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
                                  <Edit3 width={14} height={14} />
                                  <span>Edit User</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setResetTargetUser(user)
                                    setIsResetPasswordModalOpen(true)
                                    setActionMenuUserId(null)
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
                                  <KeyRound width={14} height={14} />
                                  <span>Reset Password</span>
                                </button>
                                <div style={{ height: 1, backgroundColor: '#E5E7EB', margin: '4px 0' }} />
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleToggleActive(user)
                                    setActionMenuUserId(null)
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
                                    color: user.active ? '#DC2626' : '#16A34A',
                                  }}
                                >
                                  {user.active ? (
                                    <>
                                      <UserX width={14} height={14} />
                                      <span>Deactivate</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck width={14} height={14} />
                                      <span>Activate</span>
                                    </>
                                  )}
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

            {/* TABLE FOOTER: Total Count + Pagination */}
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
                  {filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, filteredUsers.length)}
                </span>{' '}
                of <span style={{ fontWeight: 800, color: '#111111' }}>12,456</span> users
              </div>

              {/* Pagination Controls */}
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
                  onClick={() => setCurrentPage(1557)}
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
                  1557
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
          {/* CARD 1: USER DETAILS (Selected User Preview Panel) */}
          {selectedUser && (
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
                  <ShieldCheck width={17} height={17} color="#111111" />
                  <span style={{ fontSize: 13.5, fontWeight: 800 }}>User Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
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

              {/* Selected User Hero */}
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
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#E5E7EB',
                    flexShrink: 0,
                  }}
                >
                  {selectedUser.avatarUrl ? (
                    <Image
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.name}
                      fill
                      sizes="50px"
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
                        fontSize: 16,
                        color: '#4B5563',
                      }}
                    >
                      {selectedUser.avatarInitials}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 900,
                        color: '#111111',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {selectedUser.name}
                    </span>
                    {selectedUser.active ? (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          backgroundColor: '#DCFCE7',
                          color: '#16A34A',
                          padding: '2px 6px',
                          borderRadius: 9999,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#16A34A' }} />
                        Active
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          padding: '2px 6px',
                          borderRadius: 9999,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#DC2626' }} />
                        Inactive
                      </span>
                    )}
                  </div>
                  {selectedUser.studentId && (
                    <div style={{ fontSize: 10.5, color: '#9CA3AF', fontFamily: 'monospace', marginTop: 1 }}>
                      {selectedUser.studentId}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: '#6B7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {selectedUser.email}
                  </div>
                  <div style={{ fontSize: 11, color: '#374151', fontWeight: 600, marginTop: 1 }}>
                    {selectedUser.department}
                  </div>
                </div>
              </div>

              {/* Detail Tabs */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  margin: '12px 0',
                }}
              >
                {(['Overview', 'Activity', 'Permissions', 'History'] as const).map((t) => {
                  const isActive = detailTab === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDetailTab(t)}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 11,
                        fontWeight: 800,
                        backgroundColor: isActive ? '#111111' : '#F3F4F6',
                        color: isActive ? '#FFFFFF' : '#4B5563',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>

              {/* Tab Content: Overview */}
              {detailTab === 'Overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 11.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                    <span>Full Name</span>
                    <span style={{ fontWeight: 700, color: '#111111' }}>{selectedUser.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                    <span>Role</span>
                    <span style={{ fontWeight: 700, color: '#111111', textTransform: 'capitalize' }}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                    <span>Department</span>
                    <span style={{ fontWeight: 700, color: '#111111' }}>{selectedUser.department}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                    <span>Year</span>
                    <span style={{ fontWeight: 700, color: '#111111' }}>
                      {selectedUser.year || (selectedUser.role === 'student' ? '3rd Year' : 'Faculty')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                    <span>Phone</span>
                    <span style={{ fontWeight: 700, color: '#111111' }}>
                      {selectedUser.phone || '+91 98765 43210'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                    <span>Joined On</span>
                    <span style={{ fontWeight: 700, color: '#111111' }}>
                      {selectedUser.joinedOn || '12 Aug 2023'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                    <span>Last Active</span>
                    <span style={{ fontWeight: 700, color: '#111111' }}>
                      {selectedUser.lastSeen || '2 hours ago'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
                    <span>Account Status</span>
                    <span
                      style={{
                        fontWeight: 800,
                        color: selectedUser.active ? '#16A34A' : '#DC2626',
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
                          backgroundColor: selectedUser.active ? '#16A34A' : '#DC2626',
                        }}
                      />
                      {selectedUser.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab Content: Activity */}
              {detailTab === 'Activity' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
                  <div style={{ padding: '6px 8px', backgroundColor: '#F9FAFB', borderRadius: 8 }}>
                    <div style={{ fontWeight: 700, color: '#111111' }}>Viewed Mid-Sem Exam Notice</div>
                    <div style={{ color: '#9CA3AF', fontSize: 10 }}>2 hours ago</div>
                  </div>
                  <div style={{ padding: '6px 8px', backgroundColor: '#F9FAFB', borderRadius: 8 }}>
                    <div style={{ fontWeight: 700, color: '#111111' }}>Registered for Hackathon 2026</div>
                    <div style={{ color: '#9CA3AF', fontSize: 10 }}>Yesterday at 4:15 PM</div>
                  </div>
                  <div style={{ padding: '6px 8px', backgroundColor: '#F9FAFB', borderRadius: 8 }}>
                    <div style={{ fontWeight: 700, color: '#111111' }}>Logged into Mobile App</div>
                    <div style={{ color: '#9CA3AF', fontSize: 10 }}>3 days ago</div>
                  </div>
                </div>
              )}

              {/* Tab Content: Permissions */}
              {detailTab === 'Permissions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
                  {[
                    { label: 'Read Notices & Updates', granted: true },
                    { label: 'Submit Event RSVPs', granted: true },
                    { label: 'Publish Announcements', granted: selectedUser.role !== 'student' },
                    { label: 'Moderate Department Content', granted: selectedUser.role === 'admin' || selectedUser.role === 'faculty' },
                    { label: 'Access System Settings', granted: selectedUser.role === 'admin' },
                  ].map((perm, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                      <span style={{ color: '#4B5563' }}>{perm.label}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: perm.granted ? '#16A34A' : '#9CA3AF',
                        }}
                      >
                        {perm.granted ? '✓ Allowed' : '✗ Denied'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab Content: History */}
              {detailTab === 'History' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10.5, color: '#6B7280' }}>
                  <div>• Account created on {selectedUser.joinedOn || '12 Aug 2023'}</div>
                  <div>• Password reset on 14 Sep 2024</div>
                  <div>• Role assigned: {selectedUser.role}</div>
                  <div>• Verified campus email</div>
                </div>
              )}

              {/* Action Buttons Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: '1px solid #F3F4F6',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setResetTargetUser(selectedUser)
                    setIsResetPasswordModalOpen(true)
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 9999,
                    padding: '8px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                    cursor: 'pointer',
                  }}
                >
                  <Lock width={13} height={13} />
                  <span>Reset Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingTarget(selectedUser)
                    setIsEditUserModalOpen(true)
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 9999,
                    padding: '8px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                    cursor: 'pointer',
                  }}
                >
                  <Edit3 width={13} height={13} />
                  <span>Edit User</span>
                </button>
              </div>

              {/* Deactivate / Reactivate User Full Button */}
              <button
                type="button"
                onClick={() => handleToggleActive(selectedUser)}
                style={{
                  width: '100%',
                  marginTop: 8,
                  backgroundColor: selectedUser.active ? '#FEE2E2' : '#DCFCE7',
                  border: 'none',
                  borderRadius: 9999,
                  padding: '9px 12px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: selectedUser.active ? '#DC2626' : '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                {selectedUser.active ? (
                  <>
                    <UserX width={14} height={14} />
                    <span>Deactivate User</span>
                  </>
                ) : (
                  <>
                    <UserCheck width={14} height={14} />
                    <span>Activate User</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* CARD 2: ROLE MANAGEMENT SHORTCUT */}
          <div
            onClick={() => setIsRoleModalOpen(true)}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '16px 18px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9333EA',
                }}
              >
                <Settings width={20} height={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#111111' }}>
                  Role Management
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>
                  Manage roles and permissions
                </div>
              </div>
            </div>
            <ChevronRight width={16} height={16} color="#9CA3AF" />
          </div>

          {/* CARD 3: USER REGISTRATION ANALYTICS CHART */}
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
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 800 }}>User Registration Analytics</span>
              <span
                onClick={() => router.push('/admin/analytics')}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                Last 30 Days →
              </span>
            </div>

            {/* Legend */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 10.5,
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#0284C7' }} />
                <span style={{ color: '#4B5563' }}>Students</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#F472B6' }} />
                <span style={{ color: '#4B5563' }}>Faculty</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#A855F7' }} />
                <span style={{ color: '#4B5563' }}>Staff</span>
              </div>
            </div>

            {/* Registration SVG Line Chart */}
            <div style={{ width: '100%', height: 130, position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 240 110" preserveAspectRatio="none">
                {/* Horizontal Guide Grid lines */}
                <line x1="24" y1="10" x2="236" y2="10" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="24" y1="35" x2="236" y2="35" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="24" y1="60" x2="236" y2="60" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="24" y1="85" x2="236" y2="85" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="24" y1="100" x2="236" y2="100" stroke="#E5E7EB" strokeWidth="1" />

                {/* Y-Axis Labels */}
                <text x="0" y="14" fontSize="8" fill="#9CA3AF" fontWeight="600">200</text>
                <text x="0" y="39" fontSize="8" fill="#9CA3AF" fontWeight="600">150</text>
                <text x="0" y="64" fontSize="8" fill="#9CA3AF" fontWeight="600">100</text>
                <text x="5" y="89" fontSize="8" fill="#9CA3AF" fontWeight="600">50</text>
                <text x="10" y="103" fontSize="8" fill="#9CA3AF" fontWeight="600">0</text>

                {/* Series 1: Students (Cyan) */}
                <path
                  d="M 30 75 Q 65 60, 95 68 T 150 40 T 195 48 T 235 25"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="30" cy="75" r="2.5" fill="#0284C7" />
                <circle cx="95" cy="68" r="2.5" fill="#0284C7" />
                <circle cx="150" cy="40" r="2.5" fill="#0284C7" />
                <circle cx="195" cy="48" r="2.5" fill="#0284C7" />
                <circle cx="235" cy="25" r="2.5" fill="#0284C7" />

                {/* Series 2: Faculty (Pink) */}
                <path
                  d="M 30 88 Q 65 80, 95 85 T 150 72 T 195 66 T 235 55"
                  fill="none"
                  stroke="#F472B6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="30" cy="88" r="2" fill="#F472B6" />
                <circle cx="95" cy="85" r="2" fill="#F472B6" />
                <circle cx="150" cy="72" r="2" fill="#F472B6" />
                <circle cx="195" cy="66" r="2" fill="#F472B6" />
                <circle cx="235" cy="55" r="2" fill="#F472B6" />

                {/* Series 3: Staff (Purple) */}
                <path
                  d="M 30 96 Q 65 92, 95 90 T 150 86 T 195 82 T 235 78"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="30" cy="96" r="2" fill="#A855F7" />
                <circle cx="95" cy="90" r="2" fill="#A855F7" />
                <circle cx="150" cy="86" r="2" fill="#A855F7" />
                <circle cx="195" cy="82" r="2" fill="#A855F7" />
                <circle cx="235" cy="78" r="2" fill="#A855F7" />
              </svg>

              {/* X-Axis dates */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingLeft: 22,
                  fontSize: 8.5,
                  color: '#9CA3AF',
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                <span>Oct 1</span>
                <span>Oct 8</span>
                <span>Oct 15</span>
                <span>Oct 22</span>
                <span>Oct 31</span>
              </div>
            </div>
          </div>

          {/* CARD 4: ⚡ QUICK ACTIONS (2x2 Grid) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '18px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>⚡</span>
              <span>Quick Actions</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              {/* 1. Bulk Upload */}
              <button
                type="button"
                onClick={() => setIsBulkUploadModalOpen(true)}
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
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
                  <Upload width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111' }}>
                    Bulk Upload
                  </div>
                  <div style={{ fontSize: 9.5, color: '#6B7280' }}>Add multiple users</div>
                </div>
              </button>

              {/* 2. Export Users */}
              <button
                type="button"
                onClick={handleExportCSV}
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
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
                  <Download width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111' }}>
                    Export Users
                  </div>
                  <div style={{ fontSize: 9.5, color: '#6B7280' }}>Download user list</div>
                </div>
              </button>

              {/* 3. Manage Roles */}
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
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
                  <Shield width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111' }}>
                    Manage Roles
                  </div>
                  <div style={{ fontSize: 9.5, color: '#6B7280' }}>Configure permissions</div>
                </div>
              </button>

              {/* 4. Send Notification */}
              <button
                type="button"
                onClick={() => setIsNotificationModalOpen(true)}
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16A34A',
                    flexShrink: 0,
                  }}
                >
                  <Mail width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111' }}>
                    Send Notification
                  </div>
                  <div style={{ fontSize: 9.5, color: '#6B7280' }}>Email users</div>
                </div>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ===================== MODALS ===================== */}

      {/* MODAL 1: ADD NEW USER */}
      {isAddUserModalOpen && (
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
          onClick={() => setIsAddUserModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 520,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#D5FF38',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111111',
                  }}
                >
                  <UserPlus width={20} height={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Add New User</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                    Create a new account and assign role access
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini Sen"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Campus Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rohini.sen@college.edu"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                    Role *
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as Role)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      fontSize: 13,
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                    Department *
                  </label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      fontSize: 13,
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Civil">Civil</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Administration">Administration</option>
                    <option value="Hostel Management">Hostel Management</option>
                    <option value="School of Design">School of Design</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                    Roll / Employee ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. STU2026101"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {formRole === 'student' && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                    Academic Year
                  </label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      fontSize: 13,
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="sendInvite"
                  checked={formSendInvite}
                  onChange={(e) => setFormSendInvite(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#111111', cursor: 'pointer' }}
                />
                <label htmlFor="sendInvite" style={{ fontSize: 12, color: '#4B5563', fontWeight: 600, cursor: 'pointer' }}>
                  Send welcome email with account activation link
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 9999,
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
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
                    padding: '10px 22px',
                    borderRadius: 9999,
                    border: 'none',
                    backgroundColor: '#111111',
                    color: '#D5FF38',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER */}
      {isEditUserModalOpen && editingTarget && (
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
          onClick={() => setIsEditUserModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 500,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111111',
                  }}
                >
                  <Edit3 width={18} height={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Edit User</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                    Update credentials and platform attributes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditUserModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingTarget.name}
                  onChange={(e) => setEditingTarget({ ...editingTarget, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editingTarget.email}
                  onChange={(e) => setEditingTarget({ ...editingTarget, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                    Role
                  </label>
                  <select
                    value={editingTarget.role}
                    onChange={(e) => setEditingTarget({ ...editingTarget, role: e.target.value as Role })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      fontSize: 13,
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={editingTarget.department}
                    onChange={(e) => setEditingTarget({ ...editingTarget, department: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #E5E7EB',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Roll / Employee ID
                </label>
                <input
                  type="text"
                  value={editingTarget.studentId || ''}
                  onChange={(e) => setEditingTarget({ ...editingTarget, studentId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 9999,
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
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
                    padding: '10px 22px',
                    borderRadius: 9999,
                    border: 'none',
                    backgroundColor: '#111111',
                    color: '#D5FF38',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RESET PASSWORD */}
      {isResetPasswordModalOpen && resetTargetUser && (
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
          onClick={() => setIsResetPasswordModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 440,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                }}
              >
                <KeyRound width={22} height={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0 }}>Reset Password</h3>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                  For {resetTargetUser.name} ({resetTargetUser.email})
                </p>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, margin: '12px 0 20px' }}>
              A secure password reset link will be sent to the user&apos;s registered email address.
              Their current sessions will remain active until the new password is set.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsResetPasswordModalOpen(false)}
                style={{
                  padding: '9px 16px',
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
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Reset Link Dispatched',
                    message: `Password reset email sent to ${resetTargetUser.email}.`,
                  })
                  setIsResetPasswordModalOpen(false)
                }}
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
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: BULK CSV UPLOAD */}
      {isBulkUploadModalOpen && (
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
          onClick={() => setIsBulkUploadModalOpen(false)}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: '#E0F2FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0284C7',
                  }}
                >
                  <Upload width={20} height={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0 }}>Bulk Upload Users</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Import students, faculty & staff via CSV</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkUploadModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={20} height={20} />
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #D1D5DB',
                borderRadius: 16,
                padding: '32px 20px',
                textAlign: 'center',
                backgroundColor: '#F9FAFB',
                cursor: 'pointer',
                marginBottom: 16,
              }}
            >
              <FileSpreadsheet width={36} height={36} color="#0284C7" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>
                Click to browse or drop your CSV file here
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
                Columns: Name, Email, Role (student/faculty/staff), Department
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div
              style={{
                backgroundColor: '#F3F4F6',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: 11.5,
                color: '#4B5563',
                lineHeight: 1.4,
                marginBottom: 16,
              }}
            >
              <div style={{ fontWeight: 800, color: '#111111', marginBottom: 2 }}>Sample CSV Format:</div>
              <code>Name,Email,Role,Department</code>
              <br />
              <code>Riya Roy,riya.roy@college.edu,student,Computer Science</code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsBulkUploadModalOpen(false)}
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
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '9px 20px',
                  borderRadius: 9999,
                  border: 'none',
                  backgroundColor: '#111111',
                  color: '#D5FF38',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Select File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ROLE MANAGEMENT MATRIX */}
      {isRoleModalOpen && (
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
          onClick={() => setIsRoleModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 620,
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
                    backgroundColor: '#F3E8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9333EA',
                  }}
                >
                  <Shield width={20} height={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Role & Permissions Matrix</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Configure platform capability tiers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={20} height={20} />
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB', textAlign: 'left', color: '#4B5563' }}>
                    <th style={{ padding: '8px 10px' }}>Permission</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Student</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Faculty</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Staff</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'View Announcements & Feeds', stu: true, fac: true, stf: true, adm: true },
                    { name: 'Post Department Announcements', stu: false, fac: true, stf: false, adm: true },
                    { name: 'Approve Pending Notices', stu: false, fac: false, stf: false, adm: true },
                    { name: 'Manage Users & Reset Access', stu: false, fac: false, stf: false, adm: true },
                    { name: 'Host & Publish Campus Events', stu: false, fac: true, stf: true, adm: true },
                    { name: 'Export Analytics Reports', stu: false, fac: true, stf: false, adm: true },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '10px 10px', fontWeight: 600 }}>{row.name}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>{row.stu ? '✓' : '—'}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>{row.fac ? '✓' : '—'}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>{row.stf ? '✓' : '—'}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 800, color: '#16A34A' }}>
                        {row.adm ? '✓' : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
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
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Permissions Synchronized',
                    message: 'Role permissions matrix updated successfully.',
                  })
                  setIsRoleModalOpen(false)
                }}
                style={{
                  padding: '9px 20px',
                  borderRadius: 9999,
                  border: 'none',
                  backgroundColor: '#111111',
                  color: '#D5FF38',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: BROADCAST NOTIFICATION */}
      {isNotificationModalOpen && (
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
          onClick={() => setIsNotificationModalOpen(false)}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16A34A',
                  }}
                >
                  <Send width={20} height={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0 }}>Send Notification</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Direct broadcast to student/faculty groups</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Recipient Group
                </label>
                <select
                  value={notifRecipientRole}
                  onChange={(e) => setNotifRecipientRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="All">All Users (12,456)</option>
                  <option value="Students">All Students (9,842)</option>
                  <option value="Faculty">All Faculty (486)</option>
                  <option value="Staff">All Staff (128)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus Wi-Fi Scheduled Maintenance"
                  value={notifSubject}
                  onChange={(e) => setNotifSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Message Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type message to broadcast..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsNotificationModalOpen(false)}
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
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: 9999,
                    border: 'none',
                    backgroundColor: '#111111',
                    color: '#D5FF38',
                    fontSize: 12.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
