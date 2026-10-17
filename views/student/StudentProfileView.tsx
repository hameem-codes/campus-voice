'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Megaphone,
  Compass,
  User,
  CalendarDays,
  Briefcase,
  GraduationCap,
  Folder,
  Bookmark,
  Timer,
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  Clock,
  X,
  Check,
  CheckCheck,
  Settings,
  Mail,
  SlidersHorizontal,
  Flame,
  ChevronRight,
  MoreHorizontal,
  Share2,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Bus,
  Activity,
  Trophy,
  Edit2,
  Camera,
  MapPin,
  Phone,
  Building2,
  Calendar,
  Lock,
  Link as LinkIcon,
  LogOut,
  HelpCircle,
  Headphones,
  Award,
  BookOpen,
  Sparkles,
  FileText,
  Eye,
  CheckCircle2,
  Circle,
  Plus,
  TrendingUp,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface RecentActivityItem {
  id: string
  action: string
  title: string
  category: 'Academic' | 'Event' | 'Placement' | 'General'
  tag: string
  tagColor: { bg: string; text: string }
  timeAgo: string
  icon: 'file' | 'bookmark' | 'eye' | 'calendar'
}

interface AchievementBadge {
  id: string
  title: string
  description: string
  icon: string
  bgColor: string
  iconColor: string
}

interface BookmarkedItem {
  id: string
  title: string
  tag: string
  tagColor: { bg: string; text: string }
  dateFormatted: string
  imageSrc: string
  category: string
}

export function StudentProfileView() {
  const router = useRouter()
  const {
    currentUser,
    updateProfile,
    savedIds,
    toggleSave,
    unreadNotificationsCount,
    addToast,
    logout,
  } = useStore()

  // User details state (initialized with Mateen Hameem from reference design)
  const [profileData, setProfileData] = useState({
    name: 'Mateen Hameem',
    roleTitle: 'Computer Science Engineering (3rd Year)',
    college: 'ABC College of Engineering',
    email: 'mateen.hameem@college.edu',
    phone: '+91 98765 43210',
    location: 'Chennai, Tamil Nadu',
    joinedDate: 'Joined Aug 2024',
    avatar: '/images/mateen_avatar.jpg',
  })

  // Navigation & tabs state
  const [activeTab, setActiveTab] = useState<string>('Overview')
  const [timeRange, setTimeRange] = useState<string>('Last 30 Days')
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false)

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddInterestModalOpen, setIsAddInterestModalOpen] = useState(false)
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: profileData.name,
    roleTitle: profileData.roleTitle,
    college: profileData.college,
    email: profileData.email,
    phone: profileData.phone,
    location: profileData.location,
  })

  // Interests state
  const [interests, setInterests] = useState<string[]>([
    'Technology',
    'Placements',
    'AI/ML',
    'Web Development',
    'Sports',
    'Cultural Events',
  ])
  const [newInterestInput, setNewInterestInput] = useState('')

  // Completion checklist items
  const [completionTasks, setCompletionTasks] = useState([
    { id: 'task-1', title: 'Basic Information', completed: true },
    { id: 'task-2', title: 'Academic Details', completed: true },
    { id: 'task-3', title: 'Contact Information', completed: true },
    { id: 'task-4', title: 'Add Profile Picture', completed: false },
    { id: 'task-5', title: 'Add Interests', completed: false },
  ])

  // Recent Activity Items matching screenshot
  const recentActivities: RecentActivityItem[] = [
    {
      id: 'act-1',
      action: 'Read',
      title: 'Mid Semester Exam Schedule',
      category: 'Academic',
      tag: 'ACADEMIC',
      tagColor: { bg: '#D5FF38', text: '#111111' },
      timeAgo: '2 hours ago',
      icon: 'file',
    },
    {
      id: 'act-2',
      action: 'Bookmarked',
      title: 'Garba Night 2026',
      category: 'Event',
      tag: 'EVENT',
      tagColor: { bg: '#FA78B9', text: '#111111' },
      timeAgo: '4 hours ago',
      icon: 'bookmark',
    },
    {
      id: 'act-3',
      action: 'Viewed',
      title: 'Google Campus Recruitment Drive',
      category: 'Placement',
      tag: 'PLACEMENT',
      tagColor: { bg: '#DBEAFE', text: '#1D4ED8' },
      timeAgo: '6 hours ago',
      icon: 'eye',
    },
    {
      id: 'act-4',
      action: 'Read',
      title: 'Library Timings Update',
      category: 'General',
      tag: 'GENERAL',
      tagColor: { bg: '#F3F4F6', text: '#374151' },
      timeAgo: '1 day ago',
      icon: 'file',
    },
    {
      id: 'act-5',
      action: 'Registered for',
      title: 'Tech Fest 2026',
      category: 'Event',
      tag: 'EVENT',
      tagColor: { bg: '#FA78B9', text: '#111111' },
      timeAgo: '2 days ago',
      icon: 'calendar',
    },
  ]

  // Achievements matching screenshot
  const achievementBadges: AchievementBadge[] = [
    {
      id: 'ach-1',
      title: '7 Day Streak',
      description: 'Keep reading!',
      icon: '🔥',
      bgColor: '#FFEDD5',
      iconColor: '#EA580C',
    },
    {
      id: 'ach-2',
      title: 'Event Explorer',
      description: 'Attended 5 events',
      icon: '📅',
      bgColor: '#FCE7F3',
      iconColor: '#DB2777',
    },
    {
      id: 'ach-3',
      title: 'Knowledge Seeker',
      description: 'Read 50 notices',
      icon: '📖',
      bgColor: '#DBEAFE',
      iconColor: '#2563EB',
    },
    {
      id: 'ach-4',
      title: 'Early Bird',
      description: 'Active before 8 AM',
      icon: '☀️',
      bgColor: '#FEF9C3',
      iconColor: '#CA8A04',
    },
    {
      id: 'ach-5',
      title: 'Placement Ready',
      description: 'Followed 5 drives',
      icon: '💼',
      bgColor: '#F3F4F6',
      iconColor: '#4B5563',
    },
    {
      id: 'ach-6',
      title: 'Campus Star',
      description: 'Contributed 3 posts',
      icon: '⭐',
      bgColor: '#FEF3C7',
      iconColor: '#D97706',
    },
  ]

  // Bookmarked Items matching screenshot
  const [bookmarkedList, setBookmarkedList] = useState<BookmarkedItem[]>([
    {
      id: 'bm-1',
      title: 'Mid Semester Exam Schedule',
      tag: 'ACADEMIC',
      tagColor: { bg: '#D5FF38', text: '#111111' },
      dateFormatted: '12 Oct 2026',
      imageSrc: '/images/campus_building.jpg',
      category: 'Academic',
    },
    {
      id: 'bm-2',
      title: 'Garba Night 2026',
      tag: 'EVENT',
      tagColor: { bg: '#FA78B9', text: '#111111' },
      dateFormatted: '15 Oct 2026',
      imageSrc: '/images/garba_night.jpg',
      category: 'Event',
    },
    {
      id: 'bm-3',
      title: 'Google Recruitment Drive',
      tag: 'PLACEMENT',
      tagColor: { bg: '#DBEAFE', text: '#1D4ED8' },
      dateFormatted: '20 Oct 2026',
      imageSrc: '/images/recruitment_interview.jpg',
      category: 'Placement',
    },
    {
      id: 'bm-4',
      title: 'Library Timings Update',
      tag: 'GENERAL',
      tagColor: { bg: '#F3F4F6', text: '#374151' },
      dateFormatted: '11 Oct 2026',
      imageSrc: '/images/library_books.jpg',
      category: 'General',
    },
  ])

  // Handle Edit Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileData((prev) => ({
      ...prev,
      name: editForm.name,
      roleTitle: editForm.roleTitle,
      college: editForm.college,
      email: editForm.email,
      phone: editForm.phone,
      location: editForm.location,
    }))
    updateProfile({
      name: editForm.name,
    })
    setIsEditModalOpen(false)
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile details have been saved successfully.',
    })
  }

  // Handle Add Interest
  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault()
    if (newInterestInput.trim() && !interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()])
      setNewInterestInput('')
      setIsAddInterestModalOpen(false)
      addToast({
        type: 'success',
        title: 'Interest Added',
        message: `Added "${newInterestInput.trim()}" to your personal interests.`,
      })
    }
  }

  // Remove Interest
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
    addToast({
      type: 'info',
      title: 'Interest Removed',
      message: `Removed "${interest}" from your personal interests.`,
    })
  }

  // Remove Bookmark
  const handleRemoveBookmark = (id: string, title: string) => {
    setBookmarkedList(bookmarkedList.filter((item) => item.id !== id))
    toggleSave(id)
    addToast({
      type: 'info',
      title: 'Bookmark Removed',
      message: `Removed "${title}" from your bookmarked items.`,
    })
  }

  // Tabs list
  const tabList = [
    'Overview',
    'My Activity',
    'Bookmarks',
    'Reading Stats',
    'Achievements',
    'Settings',
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
                }}
              >
                <Image
                  src={profileData.avatar}
                  alt={profileData.name}
                  fill
                  sizes="32px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#111111' }}>
                  Hi, Mateen
                </div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Student</div>
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
                  onClick={() => setIsEditModalOpen(true)}
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
                  Edit Profile
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
        {/* COLUMN 1: LEFT DARK SIDEBAR */}
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
              {/* 1. Announcements */}
              <button
                type="button"
                onClick={() => router.push('/student')}
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

              {/* 2. Explore Campus */}
              <button
                type="button"
                onClick={() => router.push('/student/explore')}
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
                <Compass width={17} height={17} />
                <span>Explore Campus</span>
              </button>

              {/* 3. My Activity */}
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
                <User width={17} height={17} />
                <span>My Activity</span>
              </button>

              <div style={{ height: 1, backgroundColor: '#222222', margin: '6px 8px' }} />

              {/* 4. Events */}
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

              {/* 5. Placements */}
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

              {/* 6. Academic */}
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

              {/* 7. General */}
              <button
                type="button"
                onClick={() => router.push('/student/general')}
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
                <Folder width={17} height={17} />
                <span>General</span>
              </button>

              <div style={{ height: 1, backgroundColor: '#222222', margin: '6px 8px' }} />

              {/* 8. Bookmarked */}
              <button
                type="button"
                onClick={() => router.push('/student/saved')}
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
                <Bookmark width={17} height={17} />
                <span>Bookmarked</span>
              </button>

              {/* 9. Notifications */}
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
                <Bell width={17} height={17} />
                <span>Notifications</span>
              </button>

              {/* 10. Reading Streak */}
              <button
                type="button"
                onClick={() => router.push('/student/streak')}
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
                <Timer width={17} height={17} />
                <span>Reading Streak</span>
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
                  Keep up with campus!
                </div>
              </div>
            </div>
            <ChevronRight width={16} height={16} color="#6B7280" />
          </div>
        </aside>

        {/* COLUMN 2: CENTER PROFILE MAIN CONTENT */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* 1. HERO BANNER CARD */}
          <div
            style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              border: '1px solid #222222',
            }}
          >
            {/* Background Image with Dark Vignette Gradient */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.18,
                zIndex: 0,
              }}
            >
              <Image
                src="/images/campus_building.jpg"
                alt="Campus background"
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'radial-gradient(circle at 80% 20%, rgba(213,255,56,0.06), transparent 50%), linear-gradient(180deg, rgba(17,17,17,0.85) 0%, #111111 100%)',
                zIndex: 1,
              }}
            />

            {/* Content Container */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                padding: '28px 28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {/* Top Row: Avatar + Info + Sticker + Edit Profile Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                {/* Left: Avatar & Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {/* Avatar with Camera Overlay */}
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                        position: 'relative',
                        backgroundColor: '#222222',
                      }}
                    >
                      <Image
                        src={profileData.avatar}
                        alt={profileData.name}
                        fill
                        sizes="96px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(true)}
                      title="Update Profile Photo"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: '#111111',
                        border: '2px solid #FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#FFFFFF',
                      }}
                    >
                      <Camera width={13} height={13} />
                    </button>
                  </div>

                  {/* Name and Department */}
                  <div>
                    <h1
                      style={{
                        fontSize: 30,
                        fontWeight: 950,
                        letterSpacing: -0.6,
                        color: '#FFFFFF',
                        margin: '0 0 4px 0',
                        lineHeight: 1.1,
                      }}
                    >
                      {profileData.name}
                    </h1>
                    <div
                      style={{
                        fontSize: 14,
                        color: '#E5E7EB',
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      {profileData.roleTitle}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        color: '#9CA3AF',
                        fontWeight: 600,
                      }}
                    >
                      <Building2 width={14} height={14} color="#9CA3AF" />
                      <span>{profileData.college}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Tilted Neo-Brutalist Sticker & Edit Button */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  {/* Tilted Sticker */}
                  <div
                    style={{
                      transform: 'rotate(7deg)',
                      position: 'relative',
                      marginTop: -4,
                    }}
                  >
                    {/* Doodle tick marks */}
                    <div
                      style={{
                        position: 'absolute',
                        top: -12,
                        left: 16,
                        display: 'flex',
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          width: 2,
                          height: 8,
                          backgroundColor: '#FFFFFF',
                          transform: 'rotate(-25deg)',
                        }}
                      />
                      <div
                        style={{
                          width: 2,
                          height: 8,
                          backgroundColor: '#FFFFFF',
                          transform: 'rotate(-25deg)',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        backgroundColor: '#D5FF38',
                        padding: '6px 14px',
                        borderRadius: 12,
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
                        SAME
                        <br />
                        CAMPUS
                        <br />
                        BIGGER
                        <br />
                        OPPORTUNITIES.
                      </div>
                    </div>
                  </div>

                  {/* Edit Profile Button */}
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: 9999,
                      padding: '7px 16px',
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')
                    }
                  >
                    <Edit2 width={13} height={13} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Bottom Row: Contact & Joined Pills */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                  paddingTop: 6,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 9999,
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#E5E7EB',
                  }}
                >
                  <Mail width={12} height={12} color="#D1D5DB" />
                  <span>{profileData.email}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 9999,
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#E5E7EB',
                  }}
                >
                  <Phone width={12} height={12} color="#D1D5DB" />
                  <span>{profileData.phone}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 9999,
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#E5E7EB',
                  }}
                >
                  <MapPin width={12} height={12} color="#D1D5DB" />
                  <span>{profileData.location}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 9999,
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#E5E7EB',
                  }}
                >
                  <Calendar width={12} height={12} color="#D1D5DB" />
                  <span>{profileData.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CATEGORY TABS BAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {tabList.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab)
                    if (tab === 'My Activity') router.push('/student/activity')
                    if (tab === 'Bookmarks') router.push('/student/saved')
                    if (tab === 'Reading Stats') router.push('/student/streak')
                  }}
                  style={{
                    backgroundColor: isActive ? '#111111' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#111111',
                    border: '1px solid',
                    borderColor: isActive ? '#111111' : '#E5E7EB',
                    borderRadius: 9999,
                    padding: '7px 18px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* 3. MY STATS SECTION */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 950,
                  letterSpacing: -0.3,
                  color: '#111111',
                  margin: 0,
                }}
              >
                My Stats
              </h2>

              {/* Time Range Dropdown */}
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
                    padding: '5px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#4B5563',
                    cursor: 'pointer',
                  }}
                >
                  <span>{timeRange}</span>
                  <ChevronDown width={13} height={13} color="#6B7280" />
                </button>

                {isTimeRangeOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 36,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 12,
                      padding: 4,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      zIndex: 30,
                      width: 140,
                    }}
                  >
                    {['Last 7 Days', 'Last 30 Days', 'This Semester', 'All Time'].map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => {
                          setTimeRange(range)
                          setIsTimeRangeOpen(false)
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '6px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: timeRange === range ? '#F3F4F6' : 'transparent',
                          color: '#111111',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4 Stat Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 14,
              }}
            >
              {/* Stat 1: Notices Read */}
              <div
                style={{
                  backgroundColor: '#E0F2FE',
                  borderRadius: 18,
                  padding: '16px 14px',
                  border: '1px solid #BAE6FD',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
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
                  <FileText width={18} height={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                      48
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
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>
                    Notices Read
                  </div>
                </div>
              </div>

              {/* Stat 2: Events Attended */}
              <div
                style={{
                  backgroundColor: '#FCE7F3',
                  borderRadius: 18,
                  padding: '16px 14px',
                  border: '1px solid #FBCFE8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
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
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>
                    Events Attended
                  </div>
                </div>
              </div>

              {/* Stat 3: Placement Updates */}
              <div
                style={{
                  backgroundColor: '#EDE9FE',
                  borderRadius: 18,
                  padding: '16px 14px',
                  border: '1px solid #DDD6FE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
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
                  <Briefcase width={18} height={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                      5
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
                      ↑ 25%
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>
                    Placement Updates
                  </div>
                </div>
              </div>

              {/* Stat 4: Day Reading Streak */}
              <div
                style={{
                  backgroundColor: '#FEF9C3',
                  borderRadius: 18,
                  padding: '16px 14px',
                  border: '1px solid #FEF08A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
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
                  <BookOpen width={18} height={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 24, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                      7
                    </span>
                    <span style={{ fontSize: 14 }}>🔥</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>
                    Day Reading Streak
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. TWO-COLUMN MIDDLE SECTION: RECENT ACTIVITY & ACHIEVEMENTS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}
          >
            {/* Left Box: Recent Activity */}
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
              {/* Header */}
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

              {/* Activity Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentActivities.map((act) => (
                  <div
                    key={act.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 14,
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #F3F4F6',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          backgroundColor:
                            act.icon === 'bookmark'
                              ? '#FCE7F3'
                              : act.icon === 'calendar'
                              ? '#FEF3C7'
                              : act.icon === 'eye'
                              ? '#EDE9FE'
                              : '#E0F2FE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color:
                            act.icon === 'bookmark'
                              ? '#DB2777'
                              : act.icon === 'calendar'
                              ? '#D97706'
                              : act.icon === 'eye'
                              ? '#7C3AED'
                              : '#0284C7',
                          flexShrink: 0,
                        }}
                      >
                        {act.icon === 'bookmark' ? (
                          <Bookmark width={13} height={13} />
                        ) : act.icon === 'calendar' ? (
                          <CalendarDays width={13} height={13} />
                        ) : act.icon === 'eye' ? (
                          <Eye width={13} height={13} />
                        ) : (
                          <FileText width={13} height={13} />
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#111111',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <span style={{ fontWeight: 800 }}>{act.action}: </span>
                          <span>{act.title}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span
                        style={{
                          backgroundColor: act.tagColor.bg,
                          color: act.tagColor.text,
                          fontSize: 9,
                          fontWeight: 900,
                          padding: '2px 6px',
                          borderRadius: 9999,
                          letterSpacing: '0.2px',
                        }}
                      >
                        {act.tag}
                      </span>
                      <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                        {act.timeAgo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Box: Achievements */}
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
              {/* Header */}
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
                  Achievements
                </h3>
                <button
                  type="button"
                  onClick={() => router.push('/student/streak')}
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

              {/* 3x2 Grid of Achievement Badges */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                }}
              >
                {achievementBadges.map((badge) => (
                  <div
                    key={badge.id}
                    style={{
                      backgroundColor: '#F9FAFB',
                      borderRadius: 16,
                      padding: '14px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      border: '1px solid #F3F4F6',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: badge.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        marginBottom: 8,
                      }}
                    >
                      {badge.icon}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: '#111111',
                        marginBottom: 2,
                      }}
                    >
                      {badge.title}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: '#6B7280',
                        fontWeight: 600,
                      }}
                    >
                      {badge.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. BOTTOM SECTION: MY BOOKMARKED ITEMS */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 950,
                  letterSpacing: -0.3,
                  color: '#111111',
                  margin: 0,
                }}
              >
                My Bookmarked Items
              </h2>

              <button
                type="button"
                onClick={() => router.push('/student/saved')}
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

            {/* 4 Bookmarked Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 14,
              }}
            >
              {bookmarkedList.map((bm) => (
                <div
                  key={bm.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 18,
                    overflow: 'hidden',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Image Thumbnail */}
                  <div
                    style={{
                      position: 'relative',
                      height: 110,
                      width: '100%',
                      backgroundColor: '#111111',
                    }}
                  >
                    <Image
                      src={bm.imageSrc}
                      alt={bm.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Card Content */}
                  <div
                    style={{
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      flex: 1,
                      gap: 8,
                    }}
                  >
                    {/* Top Row: Tag + Menu */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: bm.tagColor.bg,
                          color: bm.tagColor.text,
                          fontSize: 9,
                          fontWeight: 900,
                          padding: '2px 6px',
                          borderRadius: 9999,
                          letterSpacing: '0.2px',
                        }}
                      >
                        {bm.tag}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBookmark(bm.id, bm.title)}
                        title="Remove Bookmark"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 2,
                          cursor: 'pointer',
                          color: '#9CA3AF',
                        }}
                      >
                        <MoreHorizontal width={14} height={14} />
                      </button>
                    </div>

                    {/* Title */}
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: '#111111',
                        lineHeight: 1.25,
                        minHeight: 32,
                      }}
                    >
                      {bm.title}
                    </div>

                    {/* Bottom Row: Date + Bookmark Icon */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: 4,
                        borderTop: '1px solid #F3F4F6',
                      }}
                    >
                      <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                        {bm.dateFormatted}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBookmark(bm.id, bm.title)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          color: '#111111',
                        }}
                      >
                        <Bookmark width={13} height={13} fill="#111111" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
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
          {/* WIDGET 1: PROFILE COMPLETION (ACID-LIME HEADER) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              border: '1px solid #E5E7EB',
            }}
          >
            {/* Bright Acid-Lime Header */}
            <div
              style={{
                backgroundColor: '#D5FF38',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Profile Completion
                </span>
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>80%</span>
              </div>

              {/* Progress Bar Container */}
              <div
                style={{
                  width: '100%',
                  height: 6,
                  backgroundColor: 'rgba(17,17,17,0.15)',
                  borderRadius: 9999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '80%',
                    height: '100%',
                    backgroundColor: '#15803D',
                    borderRadius: 9999,
                  }}
                />
              </div>
            </div>

            {/* Checklist items */}
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column' }}>
              {completionTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setIsEditModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 4px',
                    borderBottom: '1px solid #F3F4F6',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {task.completed ? (
                      <CheckCircle2 width={15} height={15} color="#16A34A" />
                    ) : (
                      <Circle width={15} height={15} color="#9CA3AF" />
                    )}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: task.completed ? '#111111' : '#6B7280',
                      }}
                    >
                      {task.title}
                    </span>
                  </div>
                  <ChevronRight width={13} height={13} color="#9CA3AF" />
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 2: QUICK ACTIONS (WHITE CARD) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '16px 14px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  backgroundColor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                }}
              >
                🗃️
              </div>
              <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>Quick Actions</span>
            </div>

            {/* Action rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Row 1: Edit Profile */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 8px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: '#CFFAFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0891B2',
                    }}
                  >
                    <Edit2 width={13} height={13} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Edit Profile
                  </span>
                </div>
                <ChevronRight width={13} height={13} color="#9CA3AF" />
              </button>

              {/* Row 2: Manage Notifications */}
              <button
                type="button"
                onClick={() => router.push('/student/notifications')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 8px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: '#DBEAFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563EB',
                    }}
                  >
                    <Bell width={13} height={13} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Manage Notifications
                  </span>
                </div>
                <ChevronRight width={13} height={13} color="#9CA3AF" />
              </button>

              {/* Row 3: Privacy Settings */}
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 8px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: '#CCFBF1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0D9488',
                    }}
                  >
                    <Lock width={13} height={13} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Privacy Settings
                  </span>
                </div>
                <ChevronRight width={13} height={13} color="#9CA3AF" />
              </button>

              {/* Row 4: Connected Accounts */}
              <button
                type="button"
                onClick={() => setIsAccountsModalOpen(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 8px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: '#FCE7F3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#DB2777',
                    }}
                  >
                    <LinkIcon width={13} height={13} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Connected Accounts
                  </span>
                </div>
                <ChevronRight width={13} height={13} color="#9CA3AF" />
              </button>

              {/* Row 5: Log Out */}
              <button
                type="button"
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 8px',
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: '#FEE2E2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#DC2626',
                    }}
                  >
                    <LogOut width={13} height={13} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626' }}>
                    Log Out
                  </span>
                </div>
                <ChevronRight width={13} height={13} color="#DC2626" />
              </button>
            </div>
          </div>

          {/* WIDGET 3: MY INTERESTS (WHITE CARD) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '16px 14px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>🏷️</span>
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>My Interests</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddInterestModalOpen(true)}
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
                <span>Manage</span>
                <ArrowRight width={12} height={12} />
              </button>
            </div>

            {/* Interest Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {interests.map((interest, idx) => {
                const colors = [
                  { bg: '#E0F2FE', text: '#0284C7' },
                  { bg: '#DBEAFE', text: '#1D4ED8' },
                  { bg: '#EDE9FE', text: '#6D28D9' },
                  { bg: '#CFFAFE', text: '#0E7490' },
                  { bg: '#DBEAFE', text: '#2563EB' },
                  { bg: '#FCE7F3', text: '#BE185D' },
                ]
                const col = colors[idx % colors.length]
                return (
                  <span
                    key={interest}
                    style={{
                      backgroundColor: col.bg,
                      color: col.text,
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '5px 12px',
                      borderRadius: 9999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{interest}</span>
                  </span>
                )
              })}

              <button
                type="button"
                onClick={() => setIsAddInterestModalOpen(true)}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#4B5563',
                  border: '1px solid #D1D5DB',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 9999,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>+ Add Interest</span>
              </button>
            </div>
          </div>

          {/* WIDGET 4: NEED HELP? (LAVENDER CARD) */}
          <div
            style={{
              backgroundColor: '#EDE9FE',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #DDD6FE',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 10,
              boxShadow: '0 4px 14px rgba(124,58,237,0.08)',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
              }}
            >
              <Headphones width={18} height={18} />
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 950, color: '#111111', marginBottom: 2 }}>
                Need Help?
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, lineHeight: 1.3 }}>
                Have questions or need support with your account?
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 9999,
                padding: '9px 16px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginTop: 4,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#222222')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
            >
              <span>Contact Support</span>
              <ArrowRight width={13} height={13} />
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL 1: EDIT PROFILE MODAL */}
      {isEditModalOpen && (
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
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 500,
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
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
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

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                  Major / Year
                </label>
                <input
                  type="text"
                  value={editForm.roleTitle}
                  onChange={(e) => setEditForm({ ...editForm, roleTitle: e.target.value })}
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

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                  Institution / College
                </label>
                <input
                  type="text"
                  value={editForm.college}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
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
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD INTEREST MODAL */}
      {isAddInterestModalOpen && (
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
          onClick={() => setIsAddInterestModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 420,
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
                Manage Interests
              </h3>
              <button
                type="button"
                onClick={() => setIsAddInterestModalOpen(false)}
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

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 8 }}>
                Current Interests
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {interests.map((interest) => (
                  <span
                    key={interest}
                    style={{
                      backgroundColor: '#F3F4F6',
                      color: '#111111',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: 9999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        color: '#9CA3AF',
                      }}
                    >
                      <X width={12} height={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddInterest}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                Add New Tag
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  placeholder="e.g. Robotics, Hackathons"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid #D1D5DB',
                    fontSize: 13,
                    fontWeight: 600,
                    outline: 'none',
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: '#111111',
                    color: '#D5FF38',
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CONTACT SUPPORT */}
      {isSupportModalOpen && (
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
          onClick={() => setIsSupportModalOpen(false)}
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
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#EDE9FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
                margin: '0 auto 12px',
              }}
            >
              <Headphones width={24} height={24} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 950, color: '#111111', marginBottom: 6 }}>
              Campus Support Desk
            </h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
              Reach out to our student support team for account queries, enrollment verification, or technical help.
            </p>

            <div
              style={{
                backgroundColor: '#F9FAFB',
                padding: '12px 14px',
                borderRadius: 14,
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                📧 support@campusvoice.college.edu
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>
                📞 Campus Helpdesk: Ext 4022 (9 AM - 5 PM)
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSupportModalOpen(false)
                addToast({
                  type: 'success',
                  title: 'Support Ticket Initiated',
                  message: 'A campus support representative will reach out to your college email.',
                })
              }}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#D5FF38',
                border: 'none',
                borderRadius: 9999,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              Send Request to Support
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: PRIVACY SETTINGS */}
      {isPrivacyModalOpen && (
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
          onClick={() => setIsPrivacyModalOpen(false)}
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
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 950, margin: 0, color: '#111111' }}>
                Privacy Settings
              </h3>
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Show Profile to Recruiters
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>
                    Allow campus placement drives to view your profile
                  </div>
                </div>
                <input type="checkbox" defaultChecked style={{ accentColor: '#D5FF38', width: 16, height: 16 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Public Reading Activity
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>
                    Show your streak on campus leaderboards
                  </div>
                </div>
                <input type="checkbox" defaultChecked style={{ accentColor: '#D5FF38', width: 16, height: 16 }} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsPrivacyModalOpen(false)
                addToast({
                  type: 'success',
                  title: 'Privacy Settings Updated',
                  message: 'Your privacy preferences have been updated.',
                })
              }}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#D5FF38',
                border: 'none',
                borderRadius: 9999,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: CONNECTED ACCOUNTS */}
      {isAccountsModalOpen && (
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
          onClick={() => setIsAccountsModalOpen(false)}
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
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 950, margin: 0, color: '#111111' }}>
                Connected Accounts
              </h3>
              <button
                type="button"
                onClick={() => setIsAccountsModalOpen(false)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 12,
                  backgroundColor: '#F9FAFB',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 16 }}>🎓</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>College SSO</div>
                    <div style={{ fontSize: 10, color: '#16A34A', fontWeight: 700 }}>Connected</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: '#6B7280' }}>mateen.hameem@college.edu</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 12,
                  backgroundColor: '#F9FAFB',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 16 }}>🐙</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>GitHub</div>
                    <div style={{ fontSize: 10, color: '#16A34A', fontWeight: 700 }}>Connected</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: '#6B7280' }}>@hameem-codes</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAccountsModalOpen(false)}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#D5FF38',
                border: 'none',
                borderRadius: 9999,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 900,
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
