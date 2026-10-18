'use client'

import React, { useState } from 'react'
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
  Sliders,
  SlidersHorizontal,
  Palette,
  Link2,
  CheckCircle,
  Info,
  Wrench,
  Building,
  School,
  FileCode,
  Archive,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

export function AdminSetupView() {
  const router = useRouter()
  const {
    currentUser,
    logout,
    addToast,
    categories,
    departments,
    addCategory,
    updateCategory,
    deleteCategory,
    addDepartment,
    deleteDepartment,
  } = useStore()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<
    | 'General'
    | 'Notifications'
    | 'Email & Communication'
    | 'Integrations'
    | 'Security'
    | 'Appearance'
    | 'Features'
    | 'Data Management'
  >('General')

  // General Settings state
  const [platformName, setPlatformName] = useState('CampusVoice')
  const [tagline, setTagline] = useState('Your Campus, Your Voice.')
  const [institutionName, setInstitutionName] = useState('ABC Engineering College')
  const [platformUrl, setPlatformUrl] = useState('https://campusvoice.edu')
  const [supportEmail, setSupportEmail] = useState('support@campusvoice.edu')
  const [contactNumber, setContactNumber] = useState('+91 98765 43210')
  const [address, setAddress] = useState(
    'ABC Engineering College,\nAnna University, Chennai - 600025,\nTamil Nadu, India'
  )

  // Platform Preferences state
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [requireVerification, setRequireVerification] = useState(true)
  const [allowComments, setAllowComments] = useState(true)
  const [autoApproveEvents, setAutoApproveEvents] = useState(false)
  const [enablePlacements, setEnablePlacements] = useState(true)
  const [enableTransport, setEnableTransport] = useState(true)

  // Content Settings state
  const [defaultVisibility, setDefaultVisibility] = useState('All Students')
  const [commentModeration, setCommentModeration] = useState('Auto-approve (Low Risk)')
  const [maxAttachmentSize, setMaxAttachmentSize] = useState('10 MB')
  const [allowedFileTypes, setAllowedFileTypes] = useState('PDF, DOC, DOCX, JPG, PNG')
  const [retentionPeriod, setRetentionPeriod] = useState('2 Years')

  // Date & Time Settings state
  const [timezone, setTimezone] = useState('(GMT+05:30) India Standard Time')
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY (15 Oct 2026)')
  const [timeFormat, setTimeFormat] = useState('12 Hour (10:30 AM)')

  // Maintenance Mode state
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'CampusVoice is under maintenance. Please check back later.'
  )

  // Quick Action Modals
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatColor, setNewCatColor] = useState('#0284C7')

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false)
  const [newDeptName, setNewDeptName] = useState('')
  const [newDeptCode, setNewDeptCode] = useState('')

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false)
  const [isEmailTplModalOpen, setIsEmailTplModalOpen] = useState(false)
  const [isReleaseNotesModalOpen, setIsReleaseNotesModalOpen] = useState(false)
  const [isCampusInfoModalOpen, setIsCampusInfoModalOpen] = useState(false)

  // Save handlers
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault()
    addToast({
      type: 'success',
      title: 'General Settings Saved',
      message: 'Institution profile and platform URLs updated successfully.',
    })
  }

  const handleSavePreferences = () => {
    addToast({
      type: 'success',
      title: 'Platform Preferences Saved',
      message: 'Registration, verification, and module toggles updated.',
    })
  }

  const handleSaveContent = () => {
    addToast({
      type: 'success',
      title: 'Content Settings Saved',
      message: 'Moderation, visibility rules, and file constraints updated.',
    })
  }

  const handleSaveDateTime = () => {
    addToast({
      type: 'success',
      title: 'Date & Time Settings Saved',
      message: 'Timezone and formatting updated successfully.',
    })
  }

  const handleSaveMaintenance = () => {
    addToast({
      type: isMaintenanceMode ? 'warning' : 'info',
      title: isMaintenanceMode ? 'Maintenance Mode Activated' : 'Maintenance Mode Saved',
      message: isMaintenanceMode
        ? 'Only administrators can access the system now.'
        : 'Maintenance configuration saved.',
    })
  }

  // Add Category Handler
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    await addCategory(newCatName.trim(), newCatColor)
    addToast({
      type: 'success',
      title: 'Category Added',
      message: `Created announcement category "${newCatName}".`,
    })
    setNewCatName('')
    setIsCatModalOpen(false)
  }

  // Add Department Handler
  const handleAddDeptSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeptName.trim()) return
    await addDepartment(newDeptName.trim(), newDeptCode.trim() || 'DEPT')
    addToast({
      type: 'success',
      title: 'Department Added',
      message: `Created department "${newDeptName}".`,
    })
    setNewDeptName('')
    setNewDeptCode('')
    setIsDeptModalOpen(false)
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
      onClick={() => setIsProfileMenuOpen(false)}
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

              {/* 11. System Settings - ACTIVE */}
              <button
                type="button"
                onClick={() => router.push('/admin/setup')}
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
                <Settings width={16} height={16} />
                <span>System Settings</span>
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
                <ChevronRight width={14} height={14} />
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
          {/* HEADER ROW: Title + Tilted Sticker */}
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
                <Settings width={24} height={24} />
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
                  System Settings
                </h1>
                <p
                  style={{
                    fontSize: 12.5,
                    color: '#6B7280',
                    margin: '3px 0 0 0',
                    fontWeight: 500,
                  }}
                >
                  Configure platform settings, preferences, and integrations for CampusVoice.
                </p>
              </div>
            </div>

            {/* Tilted Sticker: CUSTOMIZE CONFIGURE CONTROL YOUR CAMPUS PLATFORM */}
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
                CUSTOMIZE
              </span>
              <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, color: '#111111' }}>
                CONFIGURE
              </span>
              <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, color: '#111111' }}>
                CONTROL
              </span>
              <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, color: '#111111' }}>
                YOUR CAMPUS
              </span>
              <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.8, color: '#111111' }}>
                PLATFORM
              </span>
            </div>
          </div>

          {/* SETTINGS TABS (PILLS ROW) */}
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
              { id: 'General', label: 'General', icon: Settings },
              { id: 'Notifications', label: 'Notifications', icon: Bell },
              { id: 'Email & Communication', label: 'Email & Communication', icon: Mail },
              { id: 'Integrations', label: 'Integrations', icon: Link2 },
              { id: 'Security', label: 'Security', icon: Shield },
              { id: 'Appearance', label: 'Appearance', icon: Palette },
              { id: 'Features', label: 'Features', icon: LayoutGrid },
              { id: 'Data Management', label: 'Data Management', icon: Database },
            ].map((tab) => {
              const isActive = activeTab === tab.id
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
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
                  <TabIcon width={14} height={14} color={isActive ? '#D5FF38' : '#6B7280'} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* ===================== TAB CONTENT: GENERAL ===================== */}
          {activeTab === 'General' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* CARD 1: GENERAL SETTINGS (TOP FULL WIDTH) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 20,
                  padding: '22px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#111111',
                      }}
                    >
                      <Building width={18} height={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 900 }}>General Settings</div>
                      <div style={{ fontSize: 11.5, color: '#6B7280' }}>
                        Basic platform configuration and campus information
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveGeneral}
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#16A34A',
                      border: 'none',
                      borderRadius: 9999,
                      padding: '7px 16px',
                      fontSize: 12,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer',
                    }}
                  >
                    <span>✓</span>
                    <span>Save Changes</span>
                  </button>
                </div>

                <form
                  onSubmit={handleSaveGeneral}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 24,
                  }}
                >
                  {/* Left Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 14px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 14px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Institution Name
                      </label>
                      <input
                        type="text"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 14px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 6 }}>
                        Institution Logo
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: '50%',
                            backgroundColor: '#0284C7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            boxShadow: '0 2px 8px rgba(2,132,199,0.25)',
                          }}
                        >
                          <Building width={26} height={26} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                              type="button"
                              onClick={() => {
                                addToast({
                                  type: 'info',
                                  title: 'Logo Upload',
                                  message: 'Logo selector dialog opened.',
                                })
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 12px',
                                borderRadius: 8,
                                border: '1px solid #E5E7EB',
                                backgroundColor: '#FFFFFF',
                                fontSize: 11.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <Upload width={13} height={13} />
                              <span>Change Logo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                addToast({
                                  type: 'warning',
                                  title: 'Logo Removed',
                                  message: 'Default institution emblem restored.',
                                })
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#6B7280',
                                fontSize: 11.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Remove
                            </button>
                          </div>
                          <span style={{ fontSize: 10.5, color: '#9CA3AF' }}>
                            Recommended size: 512 × 512 px (PNG, JPG)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Platform URL
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #E5E7EB',
                          borderRadius: 10,
                          padding: '9px 14px',
                        }}
                      >
                        <Link2 width={14} height={14} color="#6B7280" style={{ marginRight: 8 }} />
                        <input
                          type="text"
                          value={platformUrl}
                          onChange={(e) => setPlatformUrl(e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: 12.5,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Support Email
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #E5E7EB',
                          borderRadius: 10,
                          padding: '9px 14px',
                        }}
                      >
                        <Mail width={14} height={14} color="#6B7280" style={{ marginRight: 8 }} />
                        <input
                          type="email"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: 12.5,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Contact Number
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #E5E7EB',
                          borderRadius: 10,
                          padding: '9px 14px',
                        }}
                      >
                        <Phone width={14} height={14} color="#6B7280" style={{ marginRight: 8 }} />
                        <input
                          type="text"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: 12.5,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Address
                      </label>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 14px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12,
                          outline: 'none',
                          resize: 'none',
                          lineHeight: 1.4,
                        }}
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* ROW 2: PLATFORM PREFERENCES (LEFT) & CONTENT SETTINGS (RIGHT) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 20,
                }}
              >
                {/* CARD 2: PLATFORM PREFERENCES */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '22px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  }}
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
                      <Clock width={18} height={18} color="#111111" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900 }}>Platform Preferences</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>
                          Configure platform behavior and preferences
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      style={{
                        backgroundColor: '#DCFCE7',
                        color: '#16A34A',
                        border: 'none',
                        borderRadius: 9999,
                        padding: '5px 14px',
                        fontSize: 11.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Save
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      {
                        title: 'Allow User Registration',
                        desc: 'Allow students to register on the platform',
                        state: allowRegistration,
                        setter: setAllowRegistration,
                        icon: Users,
                      },
                      {
                        title: 'Require Email Verification',
                        desc: 'Users must verify email before accessing',
                        state: requireVerification,
                        setter: setRequireVerification,
                        icon: Mail,
                      },
                      {
                        title: 'Allow Comments',
                        desc: 'Enable comments on announcements',
                        state: allowComments,
                        setter: setAllowComments,
                        icon: MessageSquare,
                      },
                      {
                        title: 'Auto-approve Events (Faculty)',
                        desc: 'Faculty events are published automatically',
                        state: autoApproveEvents,
                        setter: setAutoApproveEvents,
                        icon: CalendarDays,
                      },
                      {
                        title: 'Enable Placement Module',
                        desc: 'Show placement section to students',
                        state: enablePlacements,
                        setter: setEnablePlacements,
                        icon: Briefcase,
                      },
                      {
                        title: 'Enable Transport Module',
                        desc: 'Show transport updates and schedules',
                        state: enableTransport,
                        setter: setEnableTransport,
                        icon: Bus,
                      },
                    ].map((item, idx) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '3px 0',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon width={16} height={16} color="#6B7280" />
                            <div>
                              <div style={{ fontSize: 12.5, fontWeight: 800, color: '#111111' }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: 10.5, color: '#6B7280' }}>{item.desc}</div>
                            </div>
                          </div>

                          {/* Toggle switch */}
                          <div
                            onClick={() => item.setter(!item.state)}
                            style={{
                              width: 38,
                              height: 22,
                              borderRadius: 9999,
                              backgroundColor: item.state ? '#D5FF38' : '#E5E7EB',
                              position: 'relative',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease',
                              boxShadow: item.state ? 'inset 0 1px 2px rgba(0,0,0,0.1)' : 'none',
                            }}
                          >
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                backgroundColor: '#FFFFFF',
                                position: 'absolute',
                                top: 2,
                                left: item.state ? 18 : 2,
                                transition: 'left 0.2s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* CARD 3: CONTENT SETTINGS */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '22px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  }}
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
                      <FileText width={18} height={18} color="#111111" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900 }}>Content Settings</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>
                          Configure content and moderation settings
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveContent}
                      style={{
                        backgroundColor: '#DCFCE7',
                        color: '#16A34A',
                        border: 'none',
                        borderRadius: 9999,
                        padding: '5px 14px',
                        fontSize: 11.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Save
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Default Announcement Visibility
                      </label>
                      <select
                        value={defaultVisibility}
                        onChange={(e) => setDefaultVisibility(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <option value="All Students">All Students</option>
                        <option value="Department Only">Department Only</option>
                        <option value="Faculty & Staff Only">Faculty & Staff Only</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Comments Moderation
                      </label>
                      <select
                        value={commentModeration}
                        onChange={(e) => setCommentModeration(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <option value="Auto-approve (Low Risk)">Auto-approve (Low Risk)</option>
                        <option value="Manual Review Required">Manual Review Required</option>
                        <option value="Strict AI Filter Enabled">Strict AI Filter Enabled</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Maximum Attachment Size
                      </label>
                      <select
                        value={maxAttachmentSize}
                        onChange={(e) => setMaxAttachmentSize(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <option value="5 MB">5 MB</option>
                        <option value="10 MB">10 MB</option>
                        <option value="25 MB">25 MB</option>
                        <option value="50 MB">50 MB</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Allowed File Types
                      </label>
                      <input
                        type="text"
                        value={allowedFileTypes}
                        onChange={(e) => setAllowedFileTypes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 3, display: 'block' }}>
                        Comma separated file types
                      </span>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Content Retention Period
                      </label>
                      <select
                        value={retentionPeriod}
                        onChange={(e) => setRetentionPeriod(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                        <option value="5 Years">5 Years</option>
                        <option value="Indefinite">Indefinite</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 3: DATE & TIME SETTINGS (LEFT) & MAINTENANCE MODE (RIGHT) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 20,
                }}
              >
                {/* CARD 4: DATE & TIME SETTINGS */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '22px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  }}
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
                      <Calendar width={18} height={18} color="#111111" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900 }}>Date & Time Settings</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>
                          Configure timezone and date format
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveDateTime}
                      style={{
                        backgroundColor: '#DCFCE7',
                        color: '#16A34A',
                        border: 'none',
                        borderRadius: 9999,
                        padding: '5px 14px',
                        fontSize: 11.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Save
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <option value="(GMT+05:30) India Standard Time">(GMT+05:30) India Standard Time</option>
                        <option value="(GMT+00:00) UTC / London">(GMT+00:00) UTC / London</option>
                        <option value="(GMT-05:00) Eastern Time (US)">(GMT-05:00) Eastern Time (US)</option>
                        <option value="(GMT+08:00) Singapore / Perth">(GMT+08:00) Singapore / Perth</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Date Format
                      </label>
                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <option value="DD MMM YYYY (15 Oct 2026)">DD MMM YYYY (15 Oct 2026)</option>
                        <option value="YYYY-MM-DD (2026-10-15)">YYYY-MM-DD (2026-10-15)</option>
                        <option value="MM/DD/YYYY (10/15/2026)">MM/DD/YYYY (10/15/2026)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Time Format
                      </label>
                      <select
                        value={timeFormat}
                        onChange={(e) => setTimeFormat(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12.5,
                          outline: 'none',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <option value="12 Hour (10:30 AM)">12 Hour (10:30 AM)</option>
                        <option value="24 Hour (22:30)">24 Hour (22:30)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* CARD 5: MAINTENANCE MODE */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '22px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Wrench width={18} height={18} color="#111111" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900 }}>Maintenance Mode</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>
                          Temporarily restrict platform access for maintenance
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveMaintenance}
                      style={{
                        backgroundColor: '#DCFCE7',
                        color: '#16A34A',
                        border: 'none',
                        borderRadius: 9999,
                        padding: '5px 14px',
                        fontSize: 11.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Save
                    </button>
                  </div>

                  {/* Warning banner */}
                  <div
                    style={{
                      backgroundColor: '#FEF9C3',
                      border: '1px solid #FDE047',
                      borderRadius: 12,
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    <AlertTriangle width={16} height={16} color="#CA8A04" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 11.5, color: '#854D0E', lineHeight: 1.4, fontWeight: 600 }}>
                      When maintenance mode is enabled, only administrators can access the platform.
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: '#111111' }}>
                        Enable Maintenance Mode
                      </span>
                      <div
                        onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                        style={{
                          width: 38,
                          height: 22,
                          borderRadius: 9999,
                          backgroundColor: isMaintenanceMode ? '#D5FF38' : '#E5E7EB',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            position: 'absolute',
                            top: 2,
                            left: isMaintenanceMode ? 18 : 2,
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Maintenance Message
                      </label>
                      <input
                        type="text"
                        value={maintenanceMessage}
                        onChange={(e) => setMaintenanceMessage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 10,
                          border: '1px solid #E5E7EB',
                          fontSize: 12,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== OTHER TABS CONTENT ===================== */}
          {activeTab !== 'General' && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '32px 24px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                textAlign: 'center',
              }}
            >
              <Sliders width={36} height={36} color="#0284C7" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>
                {activeTab} Settings Panel
              </h3>
              <p style={{ fontSize: 13, color: '#6B7280', maxWidth: 440, margin: '8px auto 20px' }}>
                Advanced configuration options for {activeTab.toLowerCase()}. All settings are currently synchronized with the cloud environment.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('General')}
                style={{
                  backgroundColor: '#111111',
                  color: '#D5FF38',
                  padding: '9px 20px',
                  borderRadius: 9999,
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Back to General Settings
              </button>
            </div>
          )}
        </main>

        {/* COLUMN 3: RIGHT SIDEBAR */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* CARD 1: CAMPUS INFORMATION */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <School width={17} height={17} color="#111111" />
                <span style={{ fontSize: 13.5, fontWeight: 800 }}>Campus Information</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCampusInfoModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                <Edit3 width={12} height={12} />
                <span>Edit</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 900, color: '#111111', lineHeight: 1.2 }}>
                  ABC Engineering College
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', margin: '3px 0 8px' }}>
                  Chennai, Tamil Nadu
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, color: '#4B5563' }}>
                  <div>Established: 2001</div>
                  <div>Students: 12,456</div>
                  <div>Faculty: 486</div>
                  <div>Departments: 12</div>
                </div>
              </div>

              {/* Campus Building Thumbnail */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 14,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#E5E7EB',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=256&q=80"
                  alt="ABC Engineering College Campus"
                  fill
                  sizes="80px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* CARD 2: QUICK ACTIONS (6 List Items) */}
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
              <CheckCircle width={16} height={16} color="#111111" />
              <span>Quick Actions</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                {
                  title: 'Manage Announcement Categories',
                  icon: Megaphone,
                  bg: '#FCE7F3',
                  color: '#DB2777',
                  action: () => setIsCatModalOpen(true),
                },
                {
                  title: 'Manage Event Categories',
                  icon: CalendarDays,
                  bg: '#DCFCE7',
                  color: '#16A34A',
                  action: () => setIsCatModalOpen(true),
                },
                {
                  title: 'Manage Department List',
                  icon: Building2,
                  bg: '#F3E8FF',
                  color: '#9333EA',
                  action: () => setIsDeptModalOpen(true),
                },
                {
                  title: 'Configure User Roles',
                  icon: Users,
                  bg: '#E0F2FE',
                  color: '#0284C7',
                  action: () => router.push('/admin/users'),
                },
                {
                  title: 'Manage Email Templates',
                  icon: Mail,
                  bg: '#FEF3C7',
                  color: '#D97706',
                  action: () => setIsEmailTplModalOpen(true),
                },
                {
                  title: 'Backup Now',
                  icon: Database,
                  bg: '#FCE7F3',
                  color: '#E11D48',
                  action: () => setIsBackupModalOpen(true),
                },
              ].map((item, idx) => {
                const ItemIcon = item.icon
                return (
                  <div
                    key={idx}
                    onClick={item.action}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 12,
                      cursor: 'pointer',
                      transition: 'background-color 0.1s ease',
                      backgroundColor: '#FFFFFF',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          backgroundColor: item.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.color,
                          flexShrink: 0,
                        }}
                      >
                        <ItemIcon width={14} height={14} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                        {item.title}
                      </span>
                    </div>
                    <ChevronRight width={14} height={14} color="#9CA3AF" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* CARD 3: SYSTEM STATUS */}
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
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 900 }}>
                <Zap width={16} height={16} color="#111111" />
                <span>System Status</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'System Health Check',
                    message: 'All 6 microservices reporting nominal latency < 24ms.',
                  })
                }}
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
                View Details →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11.5 }}>
              {[
                'Website',
                'Database',
                'File Storage',
                'Email Service',
                'Push Notifications',
                'API Services',
              ].map((svc) => (
                <div key={svc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#16A34A' }} />
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>{svc}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#16A34A' }}>Operational</span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 4: VERSION INFORMATION */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '18px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle width={16} height={16} color="#111111" />
              <span>Version Information</span>
            </div>

            <div
              onClick={() => setIsReleaseNotesModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                  }}
                >
                  <ShieldCheck width={18} height={18} />
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 900, color: '#111111' }}>
                    CampusVoice v1.2.0
                  </div>
                  <div style={{ fontSize: 10.5, color: '#9CA3AF' }}>
                    Last Updated: 15 Oct 2026, 10:30 AM
                  </div>
                  <div style={{ fontSize: 10.5, color: '#0284C7', fontWeight: 700, marginTop: 2 }}>
                    Release Notes
                  </div>
                </div>
              </div>
              <ChevronRight width={14} height={14} color="#9CA3AF" />
            </div>
          </div>
        </aside>
      </div>

      {/* ===================== QUICK ACTION MODALS ===================== */}

      {/* MODAL 1: MANAGE CATEGORIES */}
      {isCatModalOpen && (
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
          onClick={() => setIsCatModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 26,
              width: '100%',
              maxWidth: 500,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 17, fontWeight: 900 }}>Manage Announcement Categories</div>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={18} height={18} />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="New Category Name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  fontSize: 12.5,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#111111',
                  color: '#D5FF38',
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Add Category
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
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
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111111' }}>{cat.name}</span>
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat.id)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                  >
                    <Trash2 width={14} height={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 9999,
                  border: 'none',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE DEPARTMENTS */}
      {isDeptModalOpen && (
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
          onClick={() => setIsDeptModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 26,
              width: '100%',
              maxWidth: 520,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 17, fontWeight: 900 }}>Manage Department List</div>
              <button
                type="button"
                onClick={() => setIsDeptModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={18} height={18} />
              </button>
            </div>

            <form onSubmit={handleAddDeptSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Department Name..."
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                style={{
                  flex: 2,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  fontSize: 12.5,
                  outline: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Code (e.g. MECH)"
                value={newDeptCode}
                onChange={(e) => setNewDeptCode(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  fontSize: 12.5,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#111111',
                  color: '#D5FF38',
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
              {departments.map((dept) => (
                <div
                  key={dept.id}
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
                  <div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111111' }}>{dept.name}</span>
                    <span style={{ fontSize: 10.5, color: '#9CA3AF', marginLeft: 8, fontFamily: 'monospace' }}>
                      ({dept.code})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteDepartment(dept.id)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                  >
                    <Trash2 width={14} height={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button
                type="button"
                onClick={() => setIsDeptModalOpen(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 9999,
                  border: 'none',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BACKUP NOW */}
      {isBackupModalOpen && (
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
          onClick={() => setIsBackupModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 26,
              width: '100%',
              maxWidth: 420,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Database width={22} height={22} color="#0284C7" />
              <div style={{ fontSize: 16, fontWeight: 900 }}>Create Instant Backup</div>
            </div>
            <p style={{ fontSize: 12.5, color: '#4B5563', lineHeight: 1.45, margin: '0 0 16px' }}>
              Generates an encrypted snapshot of the entire database, user rosters, announcement feeds, and audit logs.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsBackupModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 9999,
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  fontSize: 12,
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
                    title: 'Snapshot Created',
                    message: `Backup archive campusvoice_bk_${Date.now()}.enc created.`,
                  })
                  setIsBackupModalOpen(false)
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 9999,
                  border: 'none',
                  backgroundColor: '#111111',
                  color: '#D5FF38',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Initiate Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EMAIL TEMPLATES */}
      {isEmailTplModalOpen && (
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
          onClick={() => setIsEmailTplModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 26,
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>Email Notification Templates</div>
              <button
                type="button"
                onClick={() => setIsEmailTplModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={18} height={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Welcome & Verification Email', 'Urgent Announcement Broadcast', 'Password Reset Request', 'Weekly Campus Digest'].map((tpl, i) => (
                <div key={i} style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{tpl}</span>
                  <span style={{ fontSize: 11, color: '#0284C7', fontWeight: 700, cursor: 'pointer' }}>Edit HTML</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: RELEASE NOTES */}
      {isReleaseNotesModalOpen && (
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
          onClick={() => setIsReleaseNotesModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 26,
              width: '100%',
              maxWidth: 460,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>CampusVoice v1.2.0 Release Notes</div>
              <button
                type="button"
                onClick={() => setIsReleaseNotesModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={18} height={18} />
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.5 }}>
              <div>• Added full Audit Log search, filtering, and multi-format export</div>
              <div>• Enhanced User & Role Management with batch activation controls</div>
              <div>• Upgraded Analytics dashboard with SVG interactive charts</div>
              <div>• Performance boosts and 0-latency live notification popovers</div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: EDIT CAMPUS INFORMATION */}
      {isCampusInfoModalOpen && (
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
          onClick={() => setIsCampusInfoModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 26,
              width: '100%',
              maxWidth: 460,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>Edit Campus Information</div>
              <button
                type="button"
                onClick={() => setIsCampusInfoModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={18} height={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 4 }}>
                  Institution Name
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    addToast({ type: 'success', title: 'Campus Info Saved' })
                    setIsCampusInfoModalOpen(false)
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 9999,
                    border: 'none',
                    backgroundColor: '#111111',
                    color: '#D5FF38',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
