'use client'

import React, { useState, useEffect } from 'react'
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
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Paperclip,
  UploadCloud,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  X,
  Flame,
  ChevronRight,
  Info,
  ShieldAlert,
  Bus,
  Home,
  MoreHorizontal,
  Eye,
  Send,
  Pin,
  MessageCircle,
  Mail,
  AlertTriangle,
  AlignLeft,
  Sparkles,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface AttachedFile {
  name: string
  size: string
}

export function FacultyCreateView() {
  const router = useRouter()
  const { createUpdate, addToast, logout } = useStore()

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Academic')
  const [targetAudience, setTargetAudience] = useState<string>('All Students')
  const [priorityLevel, setPriorityLevel] = useState<'Normal' | 'Important' | 'Urgent'>('Important')
  const [publishDate, setPublishDate] = useState<string>('2026-10-20')
  const [publishTime, setPublishTime] = useState<string>('10:00 AM')

  // Additional Settings Toggles
  const [sendEmail, setSendEmail] = useState(true)
  const [pushNotification, setPushNotification] = useState(true)
  const [allowComments, setAllowComments] = useState(false)
  const [pinAnnouncement, setPinAnnouncement] = useState(true)

  // Attachments State
  const [attachments, setAttachments] = useState<AttachedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Preview Mode: Desktop vs Mobile
  const [previewMode, setPreviewMode] = useState<'Desktop' | 'Mobile'>('Desktop')

  // Top bar search and menus
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  // Pre-fill from URL query parameters (e.g. from Notice Templates)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const paramTitle = params.get('title')
      const paramCat = params.get('category')
      if (paramTitle) setTitle(paramTitle)
      if (paramCat) setSelectedCategory(paramCat)
    }
  }, [])

  // Formatting helpers for rich text description
  const handleFormatText = (prefix: string, suffix: string = '') => {
    setDescription((prev) => `${prev}${prefix}sample text${suffix}`)
  }

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles: AttachedFile[] = Array.from(files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      }))
      setAttachments([...attachments, ...newFiles])
      addToast({
        type: 'info',
        title: 'File Attached',
        message: `Attached ${files.length} document(s).`,
      })
    }
  }

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx))
  }

  // Handle Form Submission
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      addToast({
        type: 'error',
        title: 'Title Required',
        message: 'Please provide an announcement title before publishing.',
      })
      return
    }

    if (!description.trim()) {
      addToast({
        type: 'error',
        title: 'Description Required',
        message: 'Please enter the announcement details.',
      })
      return
    }

    try {
      await createUpdate({
        title: title.trim(),
        category: selectedCategory === 'Academic' ? 'Academic' : selectedCategory === 'Event' ? 'Events' : selectedCategory === 'Placement' ? 'Placements' : 'General',
        priority: priorityLevel === 'Normal' ? 'Normal' : 'Urgent',
        status: 'Published',
        excerpt: description.trim().slice(0, 140),
        content: description.trim(),
        department: 'Computer Science & Engineering',
        eventDate: `${publishDate}T10:00:00Z`,
        deadlineDate: `${publishDate}T10:00:00Z`,
        publisher: {
          name: 'Dr. Rahul Mehta',
          role: 'Faculty Member',
          email: 'rahul.mehta@college.edu',
        },
        attachments: attachments.map((a, i) => ({
          id: `att-${i}`,
          name: a.name,
          size: a.size,
          type: (a.name.endsWith('.pdf') ? 'pdf' : a.name.match(/\.(jpg|jpeg|png)$/i) ? 'image' : 'doc') as 'pdf' | 'image' | 'doc',
          url: '#',
        })),
        audience: {
          departments: ['Computer Science & Engineering'],
          years: [],
          sections: [],
          isUniversal: targetAudience === 'All Students',
          label: targetAudience,
        },
      })

      addToast({
        type: 'success',
        title: 'Announcement Published!',
        message: 'Your announcement has been broadcast to targeted students.',
      })

      router.push('/faculty')
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Publish Failed',
        message: 'Could not publish announcement. Please try again.',
      })
    }
  }

  // Handle Save as Draft
  const handleSaveDraft = () => {
    addToast({
      type: 'info',
      title: 'Draft Saved',
      message: 'Your announcement draft has been saved to your workspace.',
    })
  }

  // Categories list matching screenshot
  const categoriesList = [
    { name: 'Academic', icon: GraduationCap, bg: '#FEF9C3', text: '#854D0E' },
    { name: 'General', icon: FileText, bg: '#E0F2FE', text: '#0369A1' },
    { name: 'Placement', icon: Briefcase, bg: '#EDE9FE', text: '#6D28D9' },
    { name: 'Event', icon: CalendarDays, bg: '#FCE7F3', text: '#BE185D' },
    { name: 'Hostel', icon: Home, bg: '#DCFCE7', text: '#15803D' },
    { name: 'Transport', icon: Bus, bg: '#FEF3C7', text: '#B45309' },
    { name: 'Health & Safety', icon: ShieldAlert, bg: '#FEE2E2', text: '#B91C1C' },
    { name: 'Other', icon: MoreHorizontal, bg: '#F3F4F6', text: '#4B5563' },
  ]

  // Target audiences
  const audienceOptions = [
    'All Students',
    'Specific Departments',
    'Specific Year',
    'Custom Selection',
  ]

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
          gridTemplateColumns: '220px minmax(0, 1fr) 340px',
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

              {/* 2. Create Announcement (ACTIVE: Bright Acid-Lime #D5FF38) */}
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
                <Megaphone width={17} height={17} strokeWidth={2.5} />
                <span>Create Announcement</span>
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

          {/* Bottom Streak Widget */}
          <div
            onClick={() => router.push('/student/streak')}
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
                  Keep engaging!
                </div>
              </div>
            </div>
            <ChevronRight width={16} height={16} color="#6B7280" />
          </div>
        </aside>

        {/* COLUMN 2: CENTER CREATE ANNOUNCEMENT FORM */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Back to Dashboard Navigation Link */}
          <Link
            href="/faculty"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 800,
              color: '#111111',
              textDecoration: 'none',
              width: 'fit-content',
            }}
          >
            <ArrowLeft width={14} height={14} />
            <span>Back to Dashboard</span>
          </Link>

          {/* Header Row: Title & Tilted Sticker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: '#111111',
                  color: '#D5FF38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Megaphone width={22} height={22} />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 36,
                    fontWeight: 950,
                    letterSpacing: -0.8,
                    color: '#111111',
                    margin: '0 0 4px 0',
                    lineHeight: 1.1,
                  }}
                >
                  Create Announcement
                </h1>
                <p
                  style={{
                    fontSize: 14,
                    color: '#6B7280',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Share important updates, notices and information with students.
                </p>
              </div>
            </div>

            {/* Tilted Sticker Tag */}
            <div
              style={{
                transform: 'rotate(7deg)',
                position: 'relative',
                marginTop: -8,
                marginRight: 6,
              }}
            >
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
                    lineHeight: 1.15,
                    letterSpacing: '0.2px',
                    textTransform: 'uppercase',
                  }}
                >
                  KEEP
                  <br />
                  STUDENTS
                  <br />
                  INFORMED
                </div>
              </div>
            </div>
          </div>

          {/* MAIN FORM CARD */}
          <form
            onSubmit={handlePublish}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* SECTION 1: BASIC INFORMATION */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '22px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {/* Section Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>📋</span>
                <h2 style={{ fontSize: 16, fontWeight: 950, color: '#111111', margin: 0 }}>
                  Basic Information
                </h2>
              </div>

              {/* Title Field */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Title <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                    {title.length}/150
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={150}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a clear and concise title for your announcement..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#111111',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#111111')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                  required
                />
              </div>

              {/* Description Field with Toolbar */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Description <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                </div>

                {/* Editor Container with Border */}
                <div
                  style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                >
                  {/* Toolbar Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '8px 10px',
                      backgroundColor: '#F9FAFB',
                      borderBottom: '1px solid #E5E7EB',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        padding: '4px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>Paragraph</span>
                      <ChevronDown width={11} height={11} />
                    </button>

                    <div style={{ width: 1, height: 16, backgroundColor: '#E5E7EB', margin: '0 4px' }} />

                    <button
                      type="button"
                      onClick={() => handleFormatText('**', '**')}
                      title="Bold"
                      style={{
                        padding: 4,
                        border: 'none',
                        background: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <Bold width={14} height={14} color="#4B5563" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFormatText('*', '*')}
                      title="Italic"
                      style={{
                        padding: 4,
                        border: 'none',
                        background: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <Italic width={14} height={14} color="#4B5563" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFormatText('_', '_')}
                      title="Underline"
                      style={{
                        padding: 4,
                        border: 'none',
                        background: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <Underline width={14} height={14} color="#4B5563" />
                    </button>

                    <div style={{ width: 1, height: 16, backgroundColor: '#E5E7EB', margin: '0 4px' }} />

                    <button
                      type="button"
                      onClick={() => handleFormatText('\n- ')}
                      title="Bullet list"
                      style={{
                        padding: 4,
                        border: 'none',
                        background: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <List width={14} height={14} color="#4B5563" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFormatText('\n1. ')}
                      title="Numbered list"
                      style={{
                        padding: 4,
                        border: 'none',
                        background: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <ListOrdered width={14} height={14} color="#4B5563" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFormatText('\n> ')}
                      title="Quote"
                      style={{
                        padding: 4,
                        border: 'none',
                        background: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <AlignLeft width={14} height={14} color="#4B5563" />
                    </button>

                    <div style={{ width: 1, height: 16, backgroundColor: '#E5E7EB', margin: '0 4px' }} />

                    <button
                      type="button"
                      onClick={() => handleFormatText('[Link title](https://')}
                      title="Insert Link"
                      style={{
                        padding: 4,
                        border: 'none',
                        background: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <Link2 width={14} height={14} color="#4B5563" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFormatText('![Image caption](/images/')}
                      title="Insert Image"
                      style={{
                        padding: 4,
                        border: 'none',
                        background: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      <ImageIcon width={14} height={14} color="#4B5563" />
                    </button>
                  </div>

                  {/* Textarea */}
                  <textarea
                    rows={6}
                    maxLength={2000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write the full details of your announcement..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: 'none',
                      outline: 'none',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#111111',
                      resize: 'vertical',
                      minHeight: 120,
                    }}
                    required
                  />

                  {/* Character count footer */}
                  <div
                    style={{
                      padding: '4px 10px 8px',
                      textAlign: 'right',
                      fontSize: 10,
                      color: '#9CA3AF',
                      fontWeight: 600,
                    }}
                  >
                    {description.length}/2000
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: CATEGORY & VISIBILITY */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '22px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}
            >
              {/* Section Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>🏷️</span>
                <h2 style={{ fontSize: 16, fontWeight: 950, color: '#111111', margin: 0 }}>
                  Category & Visibility
                </h2>
              </div>

              {/* Category Selector */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#111111', marginBottom: 8 }}>
                  Category <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: 8,
                  }}
                >
                  {categoriesList.map((cat) => {
                    const Icon = cat.icon
                    const isSelected = selectedCategory === cat.name
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setSelectedCategory(cat.name)}
                        style={{
                          backgroundColor: cat.bg,
                          border: isSelected ? '2px solid #111111' : '1px solid transparent',
                          borderRadius: 12,
                          padding: '12px 6px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                          transition: 'all 0.12s ease',
                          transform: isSelected ? 'translateY(-2px)' : 'none',
                          boxShadow: isSelected ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
                        }}
                      >
                        <Icon width={18} height={18} color={cat.text} strokeWidth={2.2} />
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: isSelected ? 950 : 700,
                            color: cat.text,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {cat.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Target Audience Filter Pills */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#111111', marginBottom: 8 }}>
                  Target Audience <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {audienceOptions.map((opt) => {
                    const isSelected = targetAudience === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTargetAudience(opt)}
                        style={{
                          backgroundColor: isSelected ? '#111111' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#111111',
                          border: '1px solid',
                          borderColor: isSelected ? '#111111' : '#E5E7EB',
                          borderRadius: 9999,
                          padding: '7px 18px',
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Priority Level & Publish Date/Time Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  alignItems: 'start',
                }}
              >
                {/* Left: Priority Level */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#111111', marginBottom: 8 }}>
                    Priority Level <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {/* Normal */}
                    <button
                      type="button"
                      onClick={() => setPriorityLevel('Normal')}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: 12,
                        border: priorityLevel === 'Normal' ? '2px solid #111111' : '1px solid #E5E7EB',
                        backgroundColor: priorityLevel === 'Normal' ? '#F3F4F6' : '#FFFFFF',
                        color: '#111111',
                        fontSize: 11,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        cursor: 'pointer',
                      }}
                    >
                      <Megaphone width={13} height={13} />
                      <span>Normal</span>
                    </button>

                    {/* Important */}
                    <button
                      type="button"
                      onClick={() => setPriorityLevel('Important')}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: 12,
                        border: priorityLevel === 'Important' ? '2px solid #DC2626' : '1px solid #E5E7EB',
                        backgroundColor: '#FCE7F3',
                        color: '#DC2626',
                        fontSize: 11,
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: 12 }}>⬇</span>
                      <span>Important</span>
                    </button>

                    {/* Urgent */}
                    <button
                      type="button"
                      onClick={() => setPriorityLevel('Urgent')}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: 12,
                        border: priorityLevel === 'Urgent' ? '2px solid #DC2626' : '1px solid #E5E7EB',
                        backgroundColor: priorityLevel === 'Urgent' ? '#FEE2E2' : '#FFFFFF',
                        color: '#DC2626',
                        fontSize: 11,
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        cursor: 'pointer',
                      }}
                    >
                      <AlertTriangle width={13} height={13} />
                      <span>Urgent</span>
                    </button>
                  </div>
                </div>

                {/* Right: Publish Date & Time */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#111111', marginBottom: 8 }}>
                    Publish Date & Time <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {/* Date input */}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 12px',
                        borderRadius: 12,
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <Calendar width={14} height={14} color="#6B7280" />
                      <input
                        type="date"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#111111',
                          width: '100%',
                          background: 'transparent',
                        }}
                      />
                    </div>

                    {/* Time input */}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 12px',
                        borderRadius: 12,
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <Clock width={14} height={14} color="#6B7280" />
                      <input
                        type="text"
                        value={publishTime}
                        onChange={(e) => setPublishTime(e.target.value)}
                        placeholder="10:00 AM"
                        style={{
                          border: 'none',
                          outline: 'none',
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#111111',
                          width: '100%',
                          background: 'transparent',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: ATTACHMENTS (OPTIONAL) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '22px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {/* Section Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Paperclip width={16} height={16} color="#111111" />
                <h2 style={{ fontSize: 16, fontWeight: 950, color: '#111111', margin: 0 }}>
                  Attachments (Optional)
                </h2>
              </div>

              {/* Upload Dropzone */}
              <label
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  if (e.dataTransfer.files) {
                    const newFiles: AttachedFile[] = Array.from(e.dataTransfer.files).map((f) => ({
                      name: f.name,
                      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                    }))
                    setAttachments([...attachments, ...newFiles])
                  }
                }}
                style={{
                  border: isDragging ? '2px dashed #111111' : '1.5px dashed #D1D5DB',
                  borderRadius: 16,
                  padding: '24px 16px',
                  textAlign: 'center',
                  backgroundColor: isDragging ? '#F3F4F6' : '#FAFAFA',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.15s ease',
                }}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <UploadCloud width={32} height={32} color="#6B7280" />
                <div style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>
                  Drag and drop files here, or click to browse
                </div>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>
                  Supports PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (Max 10MB per file)
                </div>
              </label>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: 10,
                        backgroundColor: '#F3F4F6',
                        fontSize: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText width={14} height={14} color="#4B5563" />
                        <span style={{ fontWeight: 700, color: '#111111' }}>{file.name}</span>
                        <span style={{ fontSize: 10, color: '#6B7280' }}>({file.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#EF4444',
                        }}
                      >
                        <X width={14} height={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FORM ACTIONS ROW */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 4,
              }}
            >
              {/* Save as Draft */}
              <button
                type="button"
                onClick={handleSaveDraft}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  border: '1px solid #D1D5DB',
                  borderRadius: 9999,
                  padding: '9px 20px',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                Save as Draft
              </button>

              {/* Cancel & Publish */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => router.push('/faculty')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6B7280',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '8px 12px',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    border: 'none',
                    borderRadius: 9999,
                    padding: '11px 24px',
                    fontSize: 13,
                    fontWeight: 950,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(213,255,56,0.35)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <span>Publish Announcement</span>
                  <ArrowRight width={15} height={15} />
                </button>
              </div>
            </div>
          </form>
        </main>

        {/* COLUMN 3: RIGHT SIDEBAR (PREVIEW, SETTINGS, GUIDELINES) */}
        <aside
          style={{
            position: 'sticky',
            top: 84,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* WIDGET 1: LIVE PREVIEW */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {/* Header + Mode Switcher */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye width={15} height={15} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>Preview</span>
              </div>

              {/* Desktop / Mobile Switch */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#F3F4F6',
                  borderRadius: 9999,
                  padding: 2,
                }}
              >
                <button
                  type="button"
                  onClick={() => setPreviewMode('Desktop')}
                  style={{
                    backgroundColor: previewMode === 'Desktop' ? '#111111' : 'transparent',
                    color: previewMode === 'Desktop' ? '#FFFFFF' : '#6B7280',
                    border: 'none',
                    borderRadius: 9999,
                    padding: '3px 10px',
                    fontSize: 10,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('Mobile')}
                  style={{
                    backgroundColor: previewMode === 'Mobile' ? '#111111' : 'transparent',
                    color: previewMode === 'Mobile' ? '#FFFFFF' : '#6B7280',
                    border: 'none',
                    borderRadius: 9999,
                    padding: '3px 10px',
                    fontSize: 10,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Preview Card Box */}
            <div
              style={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 16,
                padding: previewMode === 'Mobile' ? 12 : 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                maxWidth: previewMode === 'Mobile' ? 260 : '100%',
                margin: '0 auto',
              }}
            >
              {/* Priority Tag */}
              <span
                style={{
                  backgroundColor:
                    priorityLevel === 'Urgent'
                      ? '#FEE2E2'
                      : priorityLevel === 'Important'
                      ? '#FCE7F3'
                      : '#FEF9C3',
                  color:
                    priorityLevel === 'Urgent'
                      ? '#B91C1C'
                      : priorityLevel === 'Important'
                      ? '#BE185D'
                      : '#854D0E',
                  fontSize: 9,
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  width: 'fit-content',
                  letterSpacing: '0.2px',
                }}
              >
                {priorityLevel.toUpperCase()}
              </span>

              {/* Title */}
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 950,
                  color: '#111111',
                  lineHeight: 1.25,
                }}
              >
                {title.trim() || 'Your Announcement Title Will Appear Here'}
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: 11,
                  color: '#4B5563',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {description.trim() ||
                  'Your announcement description will appear here. This is how it will look to students on the platform.'}
              </div>

              {/* Publisher Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  paddingTop: 8,
                  borderTop: '1px solid #E5E7EB',
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    backgroundColor: '#111111',
                  }}
                >
                  <Image
                    src="/images/mateen_avatar.jpg"
                    alt="Dr. Rahul Mehta"
                    fill
                    sizes="26px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#111111' }}>
                    Dr. Rahul Mehta
                  </div>
                  <div style={{ fontSize: 9, color: '#6B7280', fontWeight: 600 }}>
                    Computer Science & Engineering
                  </div>
                </div>
                <span style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600 }}>
                  Just now
                </span>
              </div>

              {/* 4 Meta Badge Pills */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 4,
                  marginTop: 2,
                }}
              >
                {/* 1. Category */}
                <div
                  style={{
                    backgroundColor: '#FEF9C3',
                    borderRadius: 8,
                    padding: '6px 2px',
                    textAlign: 'center',
                  }}
                >
                  <GraduationCap width={12} height={12} color="#854D0E" style={{ margin: '0 auto 2px' }} />
                  <div style={{ fontSize: 8, fontWeight: 800, color: '#854D0E' }}>
                    {selectedCategory}
                  </div>
                  <div style={{ fontSize: 7, color: '#A16207' }}>Category</div>
                </div>

                {/* 2. Audience */}
                <div
                  style={{
                    backgroundColor: '#EDE9FE',
                    borderRadius: 8,
                    padding: '6px 2px',
                    textAlign: 'center',
                  }}
                >
                  <Users width={12} height={12} color="#6D28D9" style={{ margin: '0 auto 2px' }} />
                  <div style={{ fontSize: 8, fontWeight: 800, color: '#6D28D9', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {targetAudience.slice(0, 11)}
                  </div>
                  <div style={{ fontSize: 7, color: '#7C3AED' }}>Audience</div>
                </div>

                {/* 3. Priority */}
                <div
                  style={{
                    backgroundColor: '#FCE7F3',
                    borderRadius: 8,
                    padding: '6px 2px',
                    textAlign: 'center',
                  }}
                >
                  <AlertTriangle width={12} height={12} color="#BE185D" style={{ margin: '0 auto 2px' }} />
                  <div style={{ fontSize: 8, fontWeight: 800, color: '#BE185D' }}>
                    {priorityLevel}
                  </div>
                  <div style={{ fontSize: 7, color: '#DB2777' }}>Priority</div>
                </div>

                {/* 4. Scheduled Date */}
                <div
                  style={{
                    backgroundColor: '#E0F2FE',
                    borderRadius: 8,
                    padding: '6px 2px',
                    textAlign: 'center',
                  }}
                >
                  <Calendar width={12} height={12} color="#0369A1" style={{ margin: '0 auto 2px' }} />
                  <div style={{ fontSize: 8, fontWeight: 800, color: '#0369A1' }}>
                    20 Oct 2026
                  </div>
                  <div style={{ fontSize: 7, color: '#0284C7' }}>{publishTime}</div>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 2: ADDITIONAL SETTINGS */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Settings width={15} height={15} color="#111111" />
              <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                Additional Settings
              </span>
            </div>

            {/* Toggle 1: Send Email Notification */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Mail width={15} height={15} color="#4B5563" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Send Email Notification
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>
                    Send an email to all targeted students
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSendEmail(!sendEmail)}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: sendEmail ? '#D5FF38' : '#E5E7EB',
                  border: '1.5px solid #111111',
                  position: 'relative',
                  cursor: 'pointer',
                  padding: 2,
                  transition: 'background 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#111111',
                    transform: sendEmail ? 'translateX(16px)' : 'translateX(0)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </button>
            </div>

            {/* Toggle 2: Push Notification */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Bell width={15} height={15} color="#4B5563" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Push Notification
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>
                    Send push notification to mobile app
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPushNotification(!pushNotification)}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: pushNotification ? '#D5FF38' : '#E5E7EB',
                  border: '1.5px solid #111111',
                  position: 'relative',
                  cursor: 'pointer',
                  padding: 2,
                  transition: 'background 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#111111',
                    transform: pushNotification ? 'translateX(16px)' : 'translateX(0)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </button>
            </div>

            {/* Toggle 3: Allow Comments */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <MessageCircle width={15} height={15} color="#4B5563" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Allow Comments
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>
                    Students can comment on this announcement
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAllowComments(!allowComments)}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: allowComments ? '#D5FF38' : '#E5E7EB',
                  border: '1.5px solid #111111',
                  position: 'relative',
                  cursor: 'pointer',
                  padding: 2,
                  transition: 'background 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#111111',
                    transform: allowComments ? 'translateX(16px)' : 'translateX(0)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </button>
            </div>

            {/* Toggle 4: Pin Announcement */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Pin width={15} height={15} color="#4B5563" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Pin Announcement
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>
                    Show at the top of announcements list
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPinAnnouncement(!pinAnnouncement)}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: pinAnnouncement ? '#D5FF38' : '#E5E7EB',
                  border: '1.5px solid #111111',
                  position: 'relative',
                  cursor: 'pointer',
                  padding: 2,
                  transition: 'background 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#111111',
                    transform: pinAnnouncement ? 'translateX(16px)' : 'translateX(0)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </button>
            </div>
          </div>

          {/* WIDGET 3: GUIDELINES */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #BFDBFE',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Info width={15} height={15} color="#1E40AF" />
              <span style={{ fontSize: 13, fontWeight: 950, color: '#1E40AF' }}>Guidelines</span>
            </div>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Use a clear and descriptive title',
                'Provide all necessary details and instructions',
                'Choose the correct category and audience',
                'Attach relevant documents if needed',
                'Review before publishing',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#1E40AF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      marginTop: 1,
                      flexShrink: 0,
                    }}
                  >
                    <Check width={10} height={10} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#1E3A8A', lineHeight: 1.3 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
