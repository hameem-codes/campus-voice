'use client'

import React, { useState, useMemo } from 'react'
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
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface NotificationFeedItem {
  id: string
  title: string
  excerpt: string
  category: 'Announcements' | 'Events' | 'Placements' | 'Academic' | 'General' | 'Transport' | 'Health & Safety' | 'Others'
  tag: string
  tagColor: { bg: string; text: string }
  timestamp: string
  timeGroup: 'Today' | 'Yesterday'
  isUnread: boolean
  imageSrc: string
  actionUrl?: string
}

const initialNotificationsList: NotificationFeedItem[] = [
  // Today
  {
    id: 'notif-campus-closed',
    title: 'Campus Closed on 24th Oct',
    excerpt: 'The campus will remain closed on 24th October 2026 due to maintenance and infrastructure upgradation.',
    category: 'Announcements',
    tag: 'IMPORTANT',
    tagColor: { bg: '#FA78B9', text: '#111111' },
    timestamp: '2 hours ago',
    timeGroup: 'Today',
    isUnread: true,
    imageSrc: '/images/campus_building.jpg',
    actionUrl: '/student/updates/campus-closed',
  },
  {
    id: 'notif-garba-night',
    title: 'Garba Night 2026',
    excerpt: 'Join us for a vibrant evening of music, dance and cultural celebration. Registrations are now open!',
    category: 'Events',
    tag: 'EVENT',
    tagColor: { bg: '#FA78B9', text: '#111111' },
    timestamp: '4 hours ago',
    timeGroup: 'Today',
    isUnread: true,
    imageSrc: '/images/garba_night.jpg',
    actionUrl: '/student/events/garba-night-2026',
  },
  {
    id: 'notif-google-drive',
    title: 'Google Campus Recruitment Drive',
    excerpt: 'Final year students can register for the upcoming Google placement drive.',
    category: 'Placements',
    tag: 'PLACEMENT',
    tagColor: { bg: '#DBEAFE', text: '#1D4ED8' },
    timestamp: '6 hours ago',
    timeGroup: 'Today',
    isUnread: true,
    imageSrc: '/images/recruitment_interview.jpg',
    actionUrl: '/student/placements',
  },
  {
    id: 'notif-mid-sem-exam',
    title: 'Mid Semester Exam Schedule Released',
    excerpt: 'The mid semester examination schedule for all departments has been released.',
    category: 'Academic',
    tag: 'ACADEMIC',
    tagColor: { bg: '#D5FF38', text: '#111111' },
    timestamp: '8 hours ago',
    timeGroup: 'Today',
    isUnread: false,
    imageSrc: '/images/library_books.jpg',
    actionUrl: '/student/updates/mid-sem-exam',
  },

  // Yesterday
  {
    id: 'notif-transport-routes',
    title: 'New Transport Routes Effective from 1st Nov',
    excerpt: 'New transport routes and timings will be implemented from 1st November 2026. Please check the detailed route map and schedule.',
    category: 'Transport',
    tag: 'TRANSPORT',
    tagColor: { bg: '#FEF08A', text: '#854D0E' },
    timestamp: '1 day ago',
    timeGroup: 'Yesterday',
    isUnread: true,
    imageSrc: '/images/campus_bus.jpg',
    actionUrl: '/student/general',
  },
  {
    id: 'notif-health-safety',
    title: 'Health & Safety Guidelines for Monsoon Season',
    excerpt: 'Important health and safety guidelines to be followed during the monsoon season.',
    category: 'Health & Safety',
    tag: 'HEALTH & SAFETY',
    tagColor: { bg: '#FEE2E2', text: '#DC2626' },
    timestamp: '1 day ago',
    timeGroup: 'Yesterday',
    isUnread: false,
    imageSrc: '/images/health_center.jpg',
    actionUrl: '/student/general',
  },
  {
    id: 'notif-sports-complex',
    title: 'Sports Complex Timings Updated',
    excerpt: 'The sports complex will now remain open from 6:00 AM to 10:00 PM.',
    category: 'General',
    tag: 'GENERAL',
    tagColor: { bg: '#F3F4F6', text: '#374151' },
    timestamp: '1 day ago',
    timeGroup: 'Yesterday',
    isUnread: false,
    imageSrc: '/images/sports_stadium.jpg',
    actionUrl: '/student/general',
  },
]

export function StudentNotificationsView() {
  const router = useRouter()
  const { savedIds, toggleSave, addToast } = useStore()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>('All')
  const [selectedSidebarFilter, setSelectedSidebarFilter] = useState<string>('All Notifications')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [notificationsList, setNotificationsList] = useState<NotificationFeedItem[]>(initialNotificationsList)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  // Toggle settings switches
  const [emailNotifsEnabled, setEmailNotifsEnabled] = useState(true)
  const [pushNotifsEnabled, setPushNotifsEnabled] = useState(true)

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notificationsList.filter((n) => n.isUnread).length
  }, [notificationsList])

  // Category counts for sidebar filters
  const categoryCounts = useMemo(() => {
    return {
      'All Notifications': 24,
      Announcements: 6,
      Events: 5,
      Placements: 6,
      Academic: 4,
      General: 2,
      Transport: 1,
      'Health & Safety': 0,
      Others: 0,
    }
  }, [])

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    let list = [...notificationsList]

    // Top pill tab filter
    if (activeTab === 'Unread') {
      list = list.filter((n) => n.isUnread)
    } else if (activeTab !== 'All') {
      list = list.filter((n) => n.category.toLowerCase() === activeTab.toLowerCase())
    }

    // Sidebar filter
    if (selectedSidebarFilter !== 'All Notifications') {
      list = list.filter((n) => n.category.toLowerCase() === selectedSidebarFilter.toLowerCase())
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.excerpt.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.tag.toLowerCase().includes(q)
      )
    }

    return list
  }, [notificationsList, activeTab, selectedSidebarFilter, searchQuery])

  // Group notifications by Today and Yesterday
  const todayItems = useMemo(() => {
    return filteredNotifications.filter((n) => n.timeGroup === 'Today')
  }, [filteredNotifications])

  const yesterdayItems = useMemo(() => {
    return filteredNotifications.filter((n) => n.timeGroup === 'Yesterday')
  }, [filteredNotifications])

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotificationsList((prev) => prev.map((item) => ({ ...item, isUnread: false })))
    addToast({
      type: 'success',
      title: 'All Marked as Read',
      message: 'All notifications have been marked as read.',
    })
  }

  // Mark single item as read/unread
  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setNotificationsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isUnread: !item.isUnread } : item))
    )
    setActiveMenuId(null)
  }

  // Toggle bookmark
  const handleToggleBookmark = (item: NotificationFeedItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    toggleSave(item.id)
    const isSaved = savedIds.includes(item.id)
    addToast({
      type: isSaved ? 'info' : 'success',
      title: isSaved ? 'Bookmark Removed' : 'Notification Saved',
      message: isSaved
        ? `Removed "${item.title}" from saved items.`
        : `Saved "${item.title}" to your bookmarks.`,
    })
  }

  // Delete notification
  const handleDeleteNotification = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setNotificationsList((prev) => prev.filter((item) => item.id !== id))
    setActiveMenuId(null)
    addToast({
      type: 'info',
      title: 'Notification Dismissed',
      message: 'Removed notification from your inbox.',
    })
  }

  // Top tabs list
  const tabList = [
    'All',
    'Unread',
    'Announcements',
    'Events',
    'Placements',
    'Academic',
    'General',
    'Others',
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
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
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
              {unreadCount > 0 && (
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
                  {unreadCount}
                </div>
              )}
            </button>

            {isNotificationOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 48,
                  width: 320,
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  zIndex: 50,
                  border: '1px solid #222222',
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
                  <span style={{ fontWeight: 800, fontSize: 13 }}>Notifications ({unreadCount})</span>
                  <span
                    onClick={handleMarkAllAsRead}
                    style={{ fontSize: 11, color: '#D5FF38', cursor: 'pointer' }}
                  >
                    Mark all read
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {notificationsList.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '8px 10px',
                        backgroundColor: '#1A1A1A',
                        borderRadius: 10,
                        fontSize: 12,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: item.isUnread ? '#D5FF38' : '#FFFFFF' }}>
                        {item.title}
                      </div>
                      <div style={{ color: '#9CA3AF', fontSize: 11 }}>{item.excerpt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  src="/images/mateen_avatar.jpg"
                  alt="Mateen"
                  width={32}
                  height={32}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', lineHeight: 1.1 }}>
                  Hi, Mateen
                </div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                  Student ▾
                </div>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 48,
                  width: 200,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 50,
                  padding: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <button
                  type="button"
                  onClick={() => router.push('/student/profile')}
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
                  Student Profile
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
                  onClick={() => router.push('/login')}
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

              {/* 9. Notifications (ACTIVE: Bright Acid-Lime with Red 3 Badge) */}
              <button
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Bell width={17} height={17} strokeWidth={2.5} />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <div
                    style={{
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: 10,
                      fontWeight: 900,
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadCount}
                  </div>
                )}
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

        {/* COLUMN 2: CENTER NOTIFICATIONS FEED */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Header row: Title + Tilted Sticker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              position: 'relative',
              paddingTop: 6,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 48,
                  fontWeight: 950,
                  letterSpacing: -1.2,
                  color: '#111111',
                  margin: '0 0 6px 0',
                  lineHeight: 1.05,
                }}
              >
                Notifications
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: '#6B7280',
                  fontWeight: 600,
                  margin: '4px 0 0 0',
                }}
              >
                Stay updated with the latest announcements, events, placements and more.
              </p>
            </div>

            {/* Tilted Acid-Lime Sticker Tag */}
            <div
              style={{
                transform: 'rotate(7deg)',
                position: 'relative',
                marginTop: -10,
                marginRight: 10,
              }}
            >
              {/* Two cute doodle lines above sticker */}
              <div
                style={{
                  position: 'absolute',
                  top: -14,
                  left: 20,
                  display: 'flex',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 2,
                    height: 10,
                    backgroundColor: '#111111',
                    transform: 'rotate(-25deg)',
                  }}
                />
                <div
                  style={{
                    width: 2,
                    height: 10,
                    backgroundColor: '#111111',
                    transform: 'rotate(-25deg)',
                  }}
                />
              </div>

              <div
                style={{
                  backgroundColor: '#D5FF38',
                  padding: '8px 16px',
                  borderRadius: 14,
                  border: '2px solid #111111',
                  boxShadow: '3px 3px 0px #111111',
                  textAlign: 'center',
                  cursor: 'default',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 950,
                    color: '#111111',
                    lineHeight: 1.15,
                    letterSpacing: '0.2px',
                    textTransform: 'uppercase',
                  }}
                >
                  NEVER
                  <br />
                  MISS WHAT
                  <br />
                  MATTERS.
                </div>
              </div>
            </div>
          </div>

          {/* Filter Pills Bar + Mark all as read */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            {/* Left Category Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {tabList.map((tab) => {
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      backgroundColor: isActive ? '#111111' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#111111',
                      border: '1px solid',
                      borderColor: isActive ? '#111111' : '#E5E7EB',
                      borderRadius: 9999,
                      padding: '7px 16px',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.12s ease',
                      boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    <span>{tab}</span>
                    {tab === 'Unread' && unreadCount > 0 && (
                      <span
                        style={{
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          fontSize: 9,
                          fontWeight: 900,
                          borderRadius: '50%',
                          width: 16,
                          height: 16,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right: Mark All As Read Button */}
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FFFFFF',
                color: '#111111',
                border: '1px solid #E5E7EB',
                borderRadius: 9999,
                padding: '7px 16px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <Check width={14} height={14} strokeWidth={2.5} />
              <span>Mark all as read</span>
            </button>
          </div>

          {/* DATE GROUP 1: TODAY */}
          {todayItems.length > 0 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 950,
                  letterSpacing: -0.3,
                  color: '#111111',
                  margin: '8px 0 0 0',
                }}
              >
                Today
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {todayItems.map((item) => renderNotificationCard(item))}
              </div>
            </section>
          )}

          {/* DATE GROUP 2: YESTERDAY */}
          {yesterdayItems.length > 0 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 950,
                  letterSpacing: -0.3,
                  color: '#111111',
                  margin: '8px 0 0 0',
                }}
              >
                Yesterday
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {yesterdayItems.map((item) => renderNotificationCard(item))}
              </div>
            </section>
          )}

          {filteredNotifications.length === 0 && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: '48px 24px',
                textAlign: 'center',
                border: '1px solid #E5E7EB',
              }}
            >
              <Bell width={36} height={36} color="#9CA3AF" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 16, fontWeight: 900, color: '#111111', marginBottom: 4 }}>
                No notifications found
              </div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>
                There are no notifications matching your current filters.
              </div>
            </div>
          )}
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
          {/* WIDGET 1: NOTIFICATION OVERVIEW (ACID-LIME HEADER) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              border: '1px solid #E5E7EB',
            }}
          >
            {/* Bright Acid-Lime Header */}
            <div
              style={{
                backgroundColor: '#D5FF38',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Bell width={16} height={16} color="#111111" strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                Notification Overview
              </span>
            </div>

            {/* 2x2 Metric Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                padding: 12,
              }}
            >
              {/* Stat 1: 3 Unread */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
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
                  <Mail width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    {unreadCount}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Unread</div>
                </div>
              </div>

              {/* Stat 2: 24 Total This Week */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
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
                  <Bell width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    24
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Total This Week</div>
                </div>
              </div>

              {/* Stat 3: 5 Event Updates */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: '#EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7C3AED',
                    flexShrink: 0,
                  }}
                >
                  <CalendarDays width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    5
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Event Updates</div>
                </div>
              </div>

              {/* Stat 4: 6 Placement Updates */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 14,
                  padding: '12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
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
                  <Briefcase width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    6
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Placement Updates</div>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 2: FILTERS (PITCH-BLACK NEO-BRUTALIST CARD) */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 22,
              padding: '16px 14px',
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: '1px solid #222222',
            }}
          >
            {/* Header: Title and Reset Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SlidersHorizontal width={15} height={15} color="#FFFFFF" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#FFFFFF' }}>Filters</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSidebarFilter('All Notifications')
                  setActiveTab('All')
                  setSearchQuery('')
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Reset
              </button>
            </div>

            {/* Filter Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Object.entries(categoryCounts).map(([catName, count]) => {
                const isActive = selectedSidebarFilter === catName
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setSelectedSidebarFilter(catName)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 12,
                      border: 'none',
                      backgroundColor: isActive ? '#D5FF38' : 'transparent',
                      color: isActive ? '#111111' : '#D1D5DB',
                      fontWeight: isActive ? 950 : 700,
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {getCategoryIcon(catName, isActive ? '#111111' : '#9CA3AF')}
                      <span>{catName}</span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        color: isActive ? '#111111' : '#6B7280',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* WIDGET 3: NOTIFICATION SETTINGS (WHITE CARD) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '16px 16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
                cursor: 'pointer',
              }}
              onClick={() => setIsSettingsModalOpen(true)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Settings width={16} height={16} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Notification Settings
                </span>
              </div>
              <ChevronRight width={14} height={14} color="#6B7280" />
            </div>

            {/* Toggle 1: Email Notifications */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail width={15} height={15} color="#4B5563" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Email Notifications
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>Get notified via email</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifsEnabled(!emailNotifsEnabled)}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: emailNotifsEnabled ? '#D5FF38' : '#E5E7EB',
                  border: '1.5px solid #111111',
                  position: 'relative',
                  cursor: 'pointer',
                  padding: 2,
                  transition: 'background 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#111111',
                    transform: emailNotifsEnabled ? 'translateX(16px)' : 'translateX(0)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </button>
            </div>

            {/* Toggle 2: Push Notifications */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell width={15} height={15} color="#4B5563" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Push Notifications
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>Get notified in browser/app</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPushNotifsEnabled(!pushNotifsEnabled)}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: pushNotifsEnabled ? '#D5FF38' : '#E5E7EB',
                  border: '1.5px solid #111111',
                  position: 'relative',
                  cursor: 'pointer',
                  padding: 2,
                  transition: 'background 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#111111',
                    transform: pushNotifsEnabled ? 'translateX(16px)' : 'translateX(0)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </button>
            </div>

            {/* Row 3: Notification Preferences */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0 0',
                cursor: 'pointer',
              }}
              onClick={() => setIsSettingsModalOpen(true)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal width={15} height={15} color="#4B5563" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                    Notification Preferences
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280' }}>Choose what to receive</div>
                </div>
              </div>
              <ChevronRight width={14} height={14} color="#6B7280" />
            </div>
          </div>

          {/* WIDGET 4: STAY IN THE LOOP (ELECTRIC BLUE CARD) */}
          <div
            style={{
              backgroundColor: '#2563EB',
              borderRadius: 22,
              padding: '20px 18px',
              color: '#FFFFFF',
              boxShadow: '0 6px 18px rgba(37,99,235,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Mail width={20} height={20} />
            </div>

            <div>
              <div style={{ fontSize: 16, fontWeight: 950, color: '#FFFFFF', marginBottom: 2 }}>
                Stay in the Loop
              </div>
              <div style={{ fontSize: 11, color: '#DBEAFE', lineHeight: 1.4 }}>
                Enable notifications to never miss important campus updates.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                color: '#111111',
                borderRadius: 9999,
                padding: '10px 16px',
                fontSize: 12,
                fontWeight: 950,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <span>Manage Settings</span>
              <ArrowRight width={13} height={13} strokeWidth={2.5} />
            </button>
          </div>
        </aside>
      </div>

      {/* NOTIFICATION SETTINGS MODAL */}
      {isSettingsModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setIsSettingsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 480,
              width: '100%',
              padding: 26,
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X width={15} height={15} color="#111111" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: '#D5FF38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Settings width={20} height={20} color="#111111" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 950, color: '#111111', margin: 0 }}>
                  Notification Preferences
                </h3>
                <div style={{ fontSize: 11, color: '#6B7280' }}>Customize your notification channels</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: 12, cursor: 'pointer' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>Exam Timetable & Results</span>
                <input type="checkbox" defaultChecked style={{ accentColor: '#111111', width: 16, height: 16 }} />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: 12, cursor: 'pointer' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>Campus Drives & Placement Alerts</span>
                <input type="checkbox" defaultChecked style={{ accentColor: '#111111', width: 16, height: 16 }} />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: 12, cursor: 'pointer' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>Cultural & Fest Registrations</span>
                <input type="checkbox" defaultChecked style={{ accentColor: '#111111', width: 16, height: 16 }} />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: 12, cursor: 'pointer' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>Bus Routes & Campus Transport</span>
                <input type="checkbox" defaultChecked style={{ accentColor: '#111111', width: 16, height: 16 }} />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSettingsModalOpen(false)
                addToast({
                  type: 'success',
                  title: 'Settings Saved',
                  message: 'Your notification preferences have been updated.',
                })
              }}
              style={{
                width: '100%',
                backgroundColor: '#D5FF38',
                color: '#111111',
                padding: '12px 20px',
                borderRadius: 9999,
                fontWeight: 950,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // Render a single notification card
  function renderNotificationCard(item: NotificationFeedItem) {
    const isSaved = savedIds.includes(item.id)
    return (
      <div
        key={item.id}
        onClick={() => {
          if (item.actionUrl) {
            router.push(item.actionUrl)
          } else {
            handleToggleRead(item.id)
          }
        }}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#111111'
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#E5E7EB'
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)'
        }}
      >
        {/* Unread Blue Dot Indicator */}
        <div style={{ width: 8, height: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {item.isUnread && (
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#2563EB',
                boxShadow: '0 0 6px rgba(37,99,235,0.4)',
              }}
            />
          )}
        </div>

        {/* Thumbnail Preview */}
        <div
          style={{
            width: 72,
            height: 56,
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <Image src={item.imageSrc} alt={item.title} fill style={{ objectFit: 'cover' }} />
        </div>

        {/* Center Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tag */}
          <span
            style={{
              display: 'inline-block',
              fontSize: 9,
              fontWeight: 900,
              backgroundColor: item.tagColor.bg,
              color: item.tagColor.text,
              padding: '2px 8px',
              borderRadius: 999,
              letterSpacing: '0.4px',
              marginBottom: 3,
              textTransform: 'uppercase',
            }}
          >
            {item.tag}
          </span>

          {/* Title */}
          <h3
            style={{
              fontSize: 14,
              fontWeight: 950,
              color: '#111111',
              margin: '1px 0 3px 0',
              lineHeight: 1.25,
            }}
          >
            {item.title}
          </h3>

          {/* Excerpt */}
          <p
            style={{
              fontSize: 11,
              color: '#6B7280',
              margin: '0 0 4px 0',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.excerpt}
          </p>

          {/* Timestamp */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              color: '#6B7280',
              fontWeight: 600,
            }}
          >
            <Clock width={11} height={11} />
            <span>{item.timestamp}</span>
          </div>
        </div>

        {/* Right Actions: Bookmark + More Options Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => handleToggleBookmark(item, e)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: isSaved ? '#111111' : '#F9FAFB',
              border: '1px solid',
              borderColor: isSaved ? '#111111' : '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isSaved ? '#D5FF38' : '#6B7280',
              transition: 'all 0.15s ease',
            }}
          >
            <Bookmark width={14} height={14} fill={isSaved ? '#D5FF38' : 'none'} />
          </button>

          {/* More Options Button */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6B7280',
              }}
            >
              <MoreHorizontal width={15} height={15} />
            </button>

            {/* Dropdown Menu */}
            {activeMenuId === item.id && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 36,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  zIndex: 30,
                  padding: 4,
                  width: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <button
                  type="button"
                  onClick={(e) => handleToggleRead(item.id, e)}
                  style={{
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    color: '#111111',
                  }}
                >
                  {item.isUnread ? 'Mark as read' : 'Mark as unread'}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteNotification(item.id, e)}
                  style={{
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    color: '#EF4444',
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Get Category Icon for Filters
  function getCategoryIcon(cat: string, color: string) {
    switch (cat) {
      case 'All Notifications':
        return <Bookmark width={14} height={14} color={color} />
      case 'Announcements':
        return <Megaphone width={14} height={14} color={color} />
      case 'Events':
        return <CalendarDays width={14} height={14} color={color} />
      case 'Placements':
        return <Briefcase width={14} height={14} color={color} />
      case 'Academic':
        return <GraduationCap width={14} height={14} color={color} />
      case 'General':
        return <Folder width={14} height={14} color={color} />
      case 'Transport':
        return <Bus width={14} height={14} color={color} />
      case 'Health & Safety':
        return <ShieldAlert width={14} height={14} color={color} />
      default:
        return <MoreHorizontal width={14} height={14} color={color} />
    }
  }
}
