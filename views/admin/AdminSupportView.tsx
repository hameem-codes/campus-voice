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
  Box,
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
  LifeBuoy,
  BookOpen,
  Headphones,
  Ticket,
  PlayCircle,
  Video,
  FileQuestion,
  ExternalLink,
  MessageCircle,
  Paperclip,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface SupportTicket {
  id: string
  title: string
  date: string
  status: 'Resolved' | 'In Progress' | 'Open' | 'Closed'
  category?: string
  priority?: 'Low' | 'Medium' | 'High'
  description?: string
  response?: string
}

export function AdminSupportView() {
  const router = useRouter()
  const { currentUser, logout, addToast } = useStore()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // FAQ Accordion State (open FAQ ID - all collapsed by default to match reference image)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Tickets List State
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '#CV-1024',
      title: 'Issue with event registration',
      date: '12 Oct 2026, 10:24 AM',
      status: 'Resolved',
      category: 'Events',
      priority: 'Medium',
      description: 'Unable to select section D2 during Hackathon 2026 registration.',
      response: 'Resolved: Database seat quota was updated and registration confirmed.',
    },
    {
      id: '#CV-1023',
      title: 'Unable to upload document',
      date: '10 Oct 2026, 03:15 PM',
      status: 'In Progress',
      category: 'Technical',
      priority: 'High',
      description: 'PDF attachment fails to upload when size exceeds 8MB in notice editor.',
      response: 'Our engineering team is expanding the gateway payload limit.',
    },
    {
      id: '#CV-1022',
      title: 'Announcement not visible',
      date: '8 Oct 2026, 11:40 AM',
      status: 'Open',
      category: 'Announcements',
      priority: 'Medium',
      description: 'Scheduled notice for tomorrow morning is not appearing in draft queues.',
    },
    {
      id: '#CV-1021',
      title: 'Profile update issue',
      date: '5 Oct 2026, 09:20 AM',
      status: 'Closed',
      category: 'Account',
      priority: 'Low',
      description: 'Phone number field was reverting after page refresh.',
      response: 'Fix deployed: Local storage session synchronization verified.',
    },
  ])

  // Modals
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<{ title: string; desc: string; content?: string } | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; duration: string; views: string } | null>(null)

  // New ticket form state
  const [ticketCategory, setTicketCategory] = useState('General Query')
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketDescription, setTicketDescription] = useState('')
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')

  // Live Chat messages state
  const [chatMessages, setChatMessages] = useState([
    { from: 'agent', text: 'Hello! Welcome to CampusVoice Support. How can we assist you today?', time: 'Just now' },
  ])
  const [newChatInput, setNewChatInput] = useState('')

  // Handle Search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    addToast({
      type: 'info',
      title: 'Search Results',
      message: `Showing help guides matching "${searchQuery}".`,
    })
  }

  // Handle Ticket Submit
  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide both a subject and issue description.',
      })
      return
    }

    const newTicket: SupportTicket = {
      id: `#CV-${Math.floor(1000 + Math.random() * 9000)}`,
      title: ticketSubject.trim(),
      date: 'Just now',
      status: 'Open',
      category: ticketCategory,
      priority: ticketPriority,
      description: ticketDescription.trim(),
    }

    setTickets([newTicket, ...tickets])
    addToast({
      type: 'success',
      title: 'Ticket Submitted',
      message: `Ticket ${newTicket.id} created successfully. A support specialist will respond within 4 hours.`,
    })

    setTicketSubject('')
    setTicketDescription('')
    setIsCreateTicketOpen(false)
  }

  // Handle Chat message send
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChatInput.trim()) return

    const userMsg = { from: 'user', text: newChatInput.trim(), time: 'Just now' }
    setChatMessages((prev) => [...prev, userMsg])
    const promptText = newChatInput.trim()
    setNewChatInput('')

    // Auto agent reply after 1s
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          from: 'agent',
          text: `Thanks for reaching out regarding "${promptText.slice(0, 30)}...". Let me connect you with our campus administrator.`,
          time: 'Just now',
        },
      ])
    }, 1000)
  }

  // FAQs data
  const faqs = [
    {
      q: 'How do I register for a campus event?',
      a: 'Navigate to the Events tab in the sidebar, select your desired event card, and click "Register Now". You will receive an instant confirmation email and calendar invite with venue instructions.',
    },
    {
      q: 'Can I edit my announcement after publishing?',
      a: 'Yes, authorized faculty publishers and administrators can edit announcements. Changes are automatically logged with timestamped edit history in the system audit trail.',
    },
    {
      q: 'How do I apply for a placement drive?',
      a: 'Go to the Placements section, review the eligibility criteria and minimum CGPA for the company drive, and submit your verified student resume directly through the platform.',
    },
    {
      q: 'Who can create announcements?',
      a: 'Verified Faculty members, Department Heads, and Administrators have publishing privileges. Urgent broadcasts undergo 2-step administrative review if configured in system settings.',
    },
    {
      q: 'How do I reset my password?',
      a: 'Click "Reset Password" on the login screen or request your department administrator to dispatch a secure one-time password reset link to your registered campus email.',
    },
    {
      q: 'How do I contact the placement cell?',
      a: 'You can reach the placement department directly at placement@college.edu, call +91 98765 43210 (Ext. 204), or visit Room 104 in the Academic Office building during working hours.',
    },
    {
      q: 'Where can I find hostel and transport updates?',
      a: 'Check the General Announcements category or filter by Hostel & Transport in the left navigation sidebar for real-time bus schedules, shuttle routes, and facility alerts.',
    },
    {
      q: 'How do I report inappropriate content?',
      a: 'Click the "..." action menu on any notice, comment, or event and select "Report Content". High-priority safety reports are investigated by administrators within 2 hours.',
    },
  ]

  // Filtered FAQs if searching
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs
    const q = searchQuery.toLowerCase()
    return faqs.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    )
  }, [searchQuery, faqs])

  // Status Badge styling helper
  const getTicketStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'Resolved':
        return { bg: '#DCFCE7', color: '#16A34A', label: 'Resolved' }
      case 'In Progress':
        return { bg: '#E0F2FE', color: '#0284C7', label: 'In Progress' }
      case 'Open':
        return { bg: '#FEF3C7', color: '#D97706', label: 'Open' }
      case 'Closed':
      default:
        return { bg: '#F3F4F6', color: '#4B5563', label: 'Closed' }
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
                  src="/images/mateen_avatar.jpg"
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
                  <Box width={16} height={16} />
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
                  <BarChart2 width={16} height={16} />
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

              {/* 13. Help & Support - ACTIVE */}
              <button
                type="button"
                onClick={() => router.push('/support')}
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
                <HelpCircle width={16} height={16} />
                <span>Help & Support</span>
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
          {/* HEADER ROW: Title + Tilted Sticker + 3D Support Illustration */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              position: 'relative',
              background: 'radial-gradient(ellipse at 88% 40%, rgba(224, 231, 255, 0.7) 0%, rgba(237, 233, 254, 0.45) 45%, transparent 75%)',
              borderRadius: 20,
              padding: '6px 8px 6px 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, zIndex: 2 }}>
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
                <LifeBuoy width={24} height={24} />
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
                  Help & Support
                </h1>
                <p
                  style={{
                    fontSize: 12.5,
                    color: '#6B7280',
                    margin: '3px 0 0 0',
                    fontWeight: 500,
                  }}
                >
                  Get help, find answers, and raise support requests for any issues or queries.
                </p>
              </div>
            </div>

            {/* Sticker + 3D Support Agent Visual */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 2 }}>
              {/* Tilted Sticker: QUICK EASY SUPPORT FOR A SMOOTHER CAMPUS EXPERIENCE */}
              <div
                style={{
                  position: 'relative',
                  transform: 'rotate(-5deg)',
                  backgroundColor: '#D5FF38',
                  borderRadius: 12,
                  padding: '7px 14px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
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
                    top: -6,
                    left: -10,
                    fontSize: 14,
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
                    top: -4,
                    right: -8,
                    fontSize: 14,
                    fontWeight: 900,
                    color: '#111111',
                    transform: 'rotate(25deg)',
                  }}
                >
                  //
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.5, color: '#111111' }}>
                  QUICK
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.5, color: '#111111' }}>
                  EASY SUPPORT
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.5, color: '#111111' }}>
                  FOR A SMOOTHER
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.5, color: '#111111' }}>
                  CAMPUS EXPERIENCE
                </span>
              </div>

              {/* 3D Character Illustration Avatar */}
              <div
                style={{
                  width: 165,
                  height: 125,
                  borderRadius: 24,
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  marginRight: -4,
                }}
              >
                <Image
                  src="/images/support_agent_3d.jpg"
                  alt="Campus Support Agent"
                  fill
                  sizes="165px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* STANDALONE PILL SEARCH BAR & POPULAR SEARCHES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 16,
                padding: '6px 6px 6px 18px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <Search width={17} height={17} color="#9CA3AF" style={{ marginRight: 10, flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search for help articles, guides, or support topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 13,
                  color: '#111111',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '0 8px' }}
                >
                  <X width={15} height={15} />
                </button>
              )}
              <button
                type="submit"
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  padding: '9px 24px',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Search
              </button>
            </form>

            {/* Popular Searches Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#6B7280' }}>Popular searches:</span>
              {[
                'Create announcement',
                'Event registration',
                'Placement drive',
                'Reset password',
                'Upload documents',
              ].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 9999,
                    padding: '4px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6'
                    e.currentTarget.style.borderColor = '#D1D5DB'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF'
                    e.currentTarget.style.borderColor = '#E5E7EB'
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* 5 CATEGORY ACTION CARDS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 14,
            }}
          >
            {[
              {
                title: 'Knowledge Base',
                desc: 'Browse guides, FAQs and tutorials',
                icon: BookOpen,
                cardBg: '#FAF5FF',
                iconBg: '#7C3AED',
                iconColor: '#FFFFFF',
                chevronBg: '#EDE9FE',
                chevronColor: '#6D28D9',
                action: () => addToast({ type: 'info', title: 'Knowledge Base', message: 'Opening documentation library.' }),
              },
              {
                title: 'FAQs',
                desc: 'Find answers to common questions',
                icon: MessageSquare,
                cardBg: '#F0F9FF',
                iconBg: '#38BDF8',
                iconColor: '#FFFFFF',
                chevronBg: '#BAE6FD',
                chevronColor: '#0284C7',
                action: () => addToast({ type: 'info', title: 'FAQs', message: 'Showing common questions and answers.' }),
              },
              {
                title: 'Contact Support',
                desc: 'Get in touch with our support team',
                icon: Headphones,
                cardBg: '#FEFCE8',
                iconBg: '#FACC15',
                iconColor: '#111111',
                chevronBg: '#FEF08A',
                chevronColor: '#854D0E',
                action: () => setIsLiveChatOpen(true),
              },
              {
                title: 'Raise a Ticket',
                desc: 'Report an issue or request assistance',
                icon: Ticket,
                cardBg: '#FFF1F5',
                iconBg: '#F43F5E',
                iconColor: '#FFFFFF',
                chevronBg: '#FCE7F3',
                chevronColor: '#BE185D',
                action: () => setIsCreateTicketOpen(true),
              },
              {
                title: 'User Guides',
                desc: 'Step-by-step guides for all features',
                icon: FileText,
                cardBg: '#F0FDF4',
                iconBg: '#22C55E',
                iconColor: '#FFFFFF',
                chevronBg: '#DCFCE7',
                chevronColor: '#15803D',
                action: () => addToast({ type: 'info', title: 'User Guides', message: 'Loaded 12 interactive user guides.' }),
              },
            ].map((cat, idx) => {
              const Icon = cat.icon
              return (
                <div
                  key={idx}
                  onClick={cat.action}
                  style={{
                    backgroundColor: cat.cardBg,
                    borderRadius: 18,
                    padding: '16px 14px',
                    border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease',
                    minHeight: 140,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: cat.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cat.iconColor,
                      marginBottom: 10,
                    }}
                  >
                    <Icon width={18} height={18} />
                  </div>

                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', lineHeight: 1.2 }}>
                      {cat.title}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#6B7280', marginTop: 3, lineHeight: 1.35 }}>
                      {cat.desc}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        backgroundColor: cat.chevronBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: cat.chevronColor,
                      }}
                    >
                      <ChevronRight width={13} height={13} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* MIDDLE ROW: POPULAR ARTICLES (LEFT) & FREQUENTLY ASKED QUESTIONS (RIGHT) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}
          >
            {/* LEFT: POPULAR HELP ARTICLES */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BookOpen width={17} height={17} color="#111111" />
                    <span style={{ fontSize: 13.5, fontWeight: 900 }}>Popular Help Articles</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToast({ type: 'info', title: 'Article Index', message: 'Displaying all 42 help articles.' })}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    {
                      title: 'How to create and publish an announcement',
                      desc: 'Step-by-step guide to create, schedule and publish announcements.',
                    },
                    {
                      title: 'How to register for an event',
                      desc: 'Learn how to browse and register for campus events.',
                    },
                    {
                      title: 'How to apply for a placement drive',
                      desc: 'Complete guide to apply for placement opportunities.',
                    },
                    {
                      title: 'How to reset your password',
                      desc: 'Reset your account password in a few simple steps.',
                    },
                    {
                      title: 'How to update your profile',
                      desc: 'Keep your profile information up to date.',
                    },
                  ].map((art, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedArticle(art)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 12,
                        padding: '8px 10px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            backgroundColor: '#E0F2FE',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0284C7',
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          <FileText width={14} height={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 800, color: '#111111' }}>
                            {art.title}
                          </div>
                          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                            {art.desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight width={14} height={14} color="#9CA3AF" style={{ marginTop: 6, flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '20px',
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
                  <HelpCircle width={17} height={17} color="#111111" />
                  <span style={{ fontSize: 13.5, fontWeight: 900 }}>Frequently Asked Questions</span>
                </div>
                <button
                  type="button"
                  onClick={() => addToast({ type: 'info', title: 'FAQs', message: 'Showing expanded FAQ directory.' })}
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

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = expandedFaq === idx
                  return (
                    <div
                      key={idx}
                      style={{
                        borderBottom: idx === filteredFaqs.length - 1 ? 'none' : '1px solid #F3F4F6',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        style={{
                          width: '100%',
                          padding: '8px 2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: '#111111',
                        }}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          width={14}
                          height={14}
                          color="#6B7280"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s ease',
                            flexShrink: 0,
                          }}
                        />
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            padding: '4px 2px 10px',
                            fontSize: 11.5,
                            color: '#4B5563',
                            lineHeight: 1.45,
                          }}
                        >
                          {faq.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: VIDEO TUTORIALS (LEFT) & NEED MORE HELP? (RIGHT) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: 20,
            }}
          >
            {/* VIDEO TUTORIALS */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '20px',
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
                  <PlayCircle width={17} height={17} color="#111111" />
                  <span style={{ fontSize: 13.5, fontWeight: 900 }}>Video Tutorials</span>
                </div>
                <button
                  type="button"
                  onClick={() => addToast({ type: 'info', title: 'Video Library', message: 'Opening CampusVoice YouTube Playlist.' })}
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

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 12,
                }}
              >
                {[
                  {
                    title: 'Getting Started with CampusVoice',
                    duration: '2:45',
                    views: '5.2K views',
                    bg: 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)',
                  },
                  {
                    title: 'Creating an Announcement',
                    duration: '3:12',
                    views: '3.8K views',
                    bg: 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)',
                  },
                  {
                    title: 'Registering for Events',
                    duration: '2:18',
                    views: '4.1K views',
                    bg: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  },
                ].map((vid, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedVideo(vid)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        height: 90,
                        borderRadius: 12,
                        background: vid.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Decorative Mini UI Mockup */}
                      {idx === 0 && (
                        <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 4, opacity: 0.35 }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                          <div style={{ width: 34, height: 4, borderRadius: 2, backgroundColor: '#FFFFFF' }} />
                        </div>
                      )}
                      {idx === 1 && (
                        <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 3, opacity: 0.35 }}>
                          <div style={{ width: 28, height: 20, borderRadius: 4, border: '1.5px solid #FFFFFF', padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div style={{ width: '80%', height: 2, backgroundColor: '#FFFFFF', borderRadius: 1 }} />
                            <div style={{ width: '60%', height: 2, backgroundColor: '#FFFFFF', borderRadius: 1 }} />
                          </div>
                        </div>
                      )}
                      {idx === 2 && (
                        <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 3, opacity: 0.35 }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                          <div style={{ width: 30, height: 3, borderRadius: 1.5, backgroundColor: '#FFFFFF' }} />
                        </div>
                      )}

                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#111111',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          zIndex: 2,
                        }}
                      >
                        <PlayCircle width={18} height={18} />
                      </div>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 6,
                          right: 6,
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: '#FFFFFF',
                          fontSize: 9.5,
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: 4,
                          zIndex: 2,
                        }}
                      >
                        {vid.duration}
                      </span>
                    </div>

                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#111111', lineHeight: 1.25 }}>
                      {vid.title}
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{vid.views}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* NEED MORE HELP? CALLOUT BOX */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MessageCircle width={17} height={17} color="#111111" />
                  <span style={{ fontSize: 13.5, fontWeight: 900 }}>Need More Help?</span>
                </div>
                <p style={{ fontSize: 11.5, color: '#6B7280', lineHeight: 1.45, margin: 0, maxWidth: 220 }}>
                  Can&apos;t find what you&apos;re looking for? Reach out to our support team and we&apos;ll get back to you as soon as possible.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setIsLiveChatOpen(true)}
                  style={{
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 9999,
                    padding: '9px 18px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    zIndex: 2,
                  }}
                >
                  Contact Support →
                </button>

                {/* Paper plane illustration with dashed flight loop and clouds */}
                <div style={{ position: 'relative', width: 105, height: 75, flexShrink: 0, marginBottom: -10, marginRight: -8 }}>
                  <svg width="105" height="75" viewBox="0 0 105 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Clouds at bottom */}
                    <path
                      d="M32 72C32 67 37 63 42 63C43.5 63 45 63.4 46 64C48 61 51.5 59 56 59C61.5 59 66 62 67 66.5C68.5 65.8 70 65.5 72 65.5C76 65.5 79 68.5 79 72.5H32V72Z"
                      fill="#EFF6FF"
                    />
                    <path
                      d="M55 74C55 70 58.5 67 63 67C64.5 67 65.8 67.4 67 68C68.5 66 71.5 64 75 64C79.5 64 83 66.5 84 70.5C85 70 86.5 69.5 88 69.5C91.5 69.5 94.5 72 94.5 75H55V74Z"
                      fill="#DBEAFE"
                    />
                    {/* Dashed flight loop trail */}
                    <path
                      d="M12 66C18 58 26 50 34 52C42 54 40 64 32 64C24 64 25 45 42 36C52 30 64 22 76 12"
                      stroke="#60A5FA"
                      strokeWidth="1.6"
                      strokeDasharray="3.5 3.5"
                      strokeLinecap="round"
                    />
                    {/* Blue Paper Airplane */}
                    <g transform="translate(68, 6) rotate(15)">
                      <path
                        d="M24 0L0 10L9 15L24 0Z"
                        fill="#2563EB"
                      />
                      <path
                        d="M24 0L9 15L10 22L15 17L24 0Z"
                        fill="#3B82F6"
                      />
                      <path
                        d="M10 22L12.5 17L9 15L10 22Z"
                        fill="#1D4ED8"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* COLUMN 3: RIGHT SIDEBAR */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* CARD 1: CONTACT SUPPORT */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '18px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Headphones width={17} height={17} color="#111111" />
              <span style={{ fontSize: 13.5, fontWeight: 900 }}>Contact Support</span>
            </div>
            <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 14px' }}>
              Need personalized help? Our support team is here for you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Channel 1: Email */}
              <div
                onClick={() => {
                  window.location.href = 'mailto:support@campusvoice.edu'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 14,
                  backgroundColor: '#F9FAFB',
                  cursor: 'pointer',
                  border: '1px solid #F3F4F6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: '#F3E8FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9333EA',
                    }}
                  >
                    <Mail width={15} height={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>Email Support</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>support@campusvoice.edu</div>
                  </div>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </div>

              {/* Channel 2: Phone */}
              <div
                onClick={() => {
                  window.location.href = 'tel:+919876543210'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 14,
                  backgroundColor: '#F9FAFB',
                  cursor: 'pointer',
                  border: '1px solid #F3F4F6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: '#F3E8FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9333EA',
                    }}
                  >
                    <Phone width={15} height={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>Phone Support</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>+91 98765 43210</div>
                    <div style={{ fontSize: 9.5, color: '#9CA3AF' }}>Mon - Fri, 9:00 AM - 6:00 PM</div>
                  </div>
                </div>
                <ChevronRight width={14} height={14} color="#9CA3AF" />
              </div>

              {/* Channel 3: Live Chat */}
              <div
                onClick={() => setIsLiveChatOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 14,
                  backgroundColor: '#F9FAFB',
                  cursor: 'pointer',
                  border: '1px solid #F3F4F6',
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
                    <MessageSquare width={15} height={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>Live Chat</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>Chat with our support team</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 800,
                      backgroundColor: '#DCFCE7',
                      color: '#16A34A',
                      padding: '2px 6px',
                      borderRadius: 9999,
                    }}
                  >
                    Online
                  </span>
                  <ChevronRight width={14} height={14} color="#9CA3AF" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: RAISE A SUPPORT TICKET */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '18px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Ticket width={17} height={17} color="#111111" />
              <span style={{ fontSize: 13.5, fontWeight: 900 }}>Raise a Support Ticket</span>
            </div>
            <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 14px' }}>
              Report an issue, request a feature, or get help from our support team.
            </p>

            <button
              type="button"
              onClick={() => setIsCreateTicketOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 9999,
                padding: '10px 16px',
                fontSize: 12.5,
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Plus width={15} height={15} />
              <span>Create New Ticket</span>
            </button>
          </div>

          {/* CARD 3: SUPPORT TICKET STATUS */}
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
                <Ticket width={16} height={16} color="#111111" />
                <span>Support Ticket Status</span>
              </div>
              <button
                type="button"
                onClick={() => addToast({ type: 'info', title: 'Tickets', message: 'Loaded complete ticket history.' })}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tickets.map((t) => {
                const badge = getTicketStatusBadge(t.status)
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 12,
                      backgroundColor: '#F9FAFB',
                      cursor: 'pointer',
                      border: '1px solid #F3F4F6',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#6B7280', fontFamily: 'monospace' }}>
                          {t.id}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#111111',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: 1,
                        }}
                      >
                        {t.title}
                      </div>
                      <div style={{ fontSize: 9.5, color: '#9CA3AF' }}>{t.date}</div>
                    </div>

                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        backgroundColor: badge.bg,
                        color: badge.color,
                        padding: '2px 7px',
                        borderRadius: 9999,
                        flexShrink: 0,
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* ===================== MODALS ===================== */}

      {/* MODAL 1: CREATE NEW TICKET */}
      {isCreateTicketOpen && (
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
          onClick={() => setIsCreateTicketOpen(false)}
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
                    backgroundColor: '#D5FF38',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111111',
                  }}
                >
                  <Ticket width={20} height={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Create Support Ticket</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                    Our team answers questions within 4 working hours
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateTicketOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                    Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
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
                    <option value="General Query">General Query</option>
                    <option value="Events">Events & RSVPs</option>
                    <option value="Announcements">Announcements</option>
                    <option value="Technical">Technical Bug</option>
                    <option value="Account">Account Access</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                    Priority
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
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
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Issue Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cannot view uploaded attachments on iOS"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    fontSize: 12.5,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 5 }}>
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what occurred, browser used, and error messages shown..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    fontSize: 12,
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 11.5 }}>
                <Paperclip width={14} height={14} />
                <span>Attach screenshot or log files (Max 10 MB)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsCreateTicketOpen(false)}
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
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LIVE CHAT DRAWER */}
      {isLiveChatOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 360,
            height: 480,
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #E5E7EB',
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#D5FF38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111111',
                  fontWeight: 900,
                }}
              >
                <Headphones width={16} height={16} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900 }}>CampusVoice Support</div>
                <div style={{ fontSize: 10, color: '#A3A3A3', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22C55E' }} />
                  Live Agent Online
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close Live Chat"
              onClick={() => setIsLiveChatOpen(false)}
              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
            >
              <X width={18} height={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '14px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              backgroundColor: '#F9FAFB',
            }}
          >
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  backgroundColor: msg.from === 'user' ? '#111111' : '#FFFFFF',
                  color: msg.from === 'user' ? '#FFFFFF' : '#111111',
                  padding: '8px 12px',
                  borderRadius: 14,
                  fontSize: 12,
                  lineHeight: 1.4,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                <div>{msg.text}</div>
                <div
                  style={{
                    fontSize: 9,
                    color: msg.from === 'user' ? '#9CA3AF' : '#A3A3A3',
                    textAlign: 'right',
                    marginTop: 3,
                  }}
                >
                  {msg.time}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendChatMessage}
            style={{
              padding: '10px 14px',
              borderTop: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              gap: 8,
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={newChatInput}
              onChange={(e) => setNewChatInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 9999,
                border: '1px solid #E5E7EB',
                fontSize: 12,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                backgroundColor: '#111111',
                color: '#D5FF38',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Send width={14} height={14} />
            </button>
          </form>
        </div>
      )}

      {/* MODAL 3: ARTICLE DETAIL */}
      {selectedArticle && (
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
          onClick={() => setSelectedArticle(null)}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>{selectedArticle.title}</div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={18} height={18} />
              </button>
            </div>
            <p style={{ fontSize: 12.5, color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
              {selectedArticle.desc}
            </p>
            <div style={{ marginTop: 14, padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: 12, fontSize: 11.5, color: '#374151', lineHeight: 1.5 }}>
              <strong>Step 1:</strong> Access your profile or creation toolbar from the left sidebar.<br />
              <strong>Step 2:</strong> Fill in all mandatory fields, select your intended target department or batch, and verify attached media.<br />
              <strong>Step 3:</strong> Click &quot;Publish&quot; or &quot;Schedule&quot;. Notifications are instantly pushed to all subscribed students.
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: VIDEO TUTORIAL VIEWER */}
      {selectedVideo && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: 16,
          }}
          onClick={() => setSelectedVideo(null)}
        >
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 580,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              color: '#FFFFFF',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>{selectedVideo.title}</div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={20} height={20} />
              </button>
            </div>
            {/* Mock Player */}
            <div
              style={{
                height: 260,
                borderRadius: 16,
                backgroundColor: '#1E1E1E',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <PlayCircle width={48} height={48} color="#D5FF38" />
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 10 }}>Playing Tutorial ({selectedVideo.duration})</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{selectedVideo.views}</div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: TICKET DETAIL VIEWER */}
      {selectedTicket && (
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
          onClick={() => setSelectedTicket(null)}
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
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#0284C7', fontFamily: 'monospace' }}>
                  {selectedTicket.id}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 900, margin: '2px 0 0' }}>{selectedTicket.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X width={18} height={18} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#F3F4F6', color: '#374151', padding: '3px 8px', borderRadius: 6 }}>
                Category: {selectedTicket.category || 'General'}
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#F3F4F6', color: '#374151', padding: '3px 8px', borderRadius: 6 }}>
                Priority: {selectedTicket.priority || 'Medium'}
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '3px 8px', borderRadius: 6 }}>
                Status: {selectedTicket.status}
              </span>
            </div>

            <div style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.45, marginBottom: 14 }}>
              <strong>Issue Reported:</strong><br />
              {selectedTicket.description}
            </div>

            {selectedTicket.response && (
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', padding: '10px 14px', borderRadius: 12, fontSize: 11.5, color: '#166534', lineHeight: 1.45 }}>
                <strong>Support Resolution:</strong><br />
                {selectedTicket.response}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
