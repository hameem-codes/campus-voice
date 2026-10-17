'use client'

import React, { useState, useMemo, useEffect } from 'react'
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
  Flame,
  ChevronRight,
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  Clock,
  X,
  MapPin,
  Calendar,
  Building2,
  FileText,
  Download,
  Share2,
  Mail,
  Send,
  ShieldAlert,
  HeartPulse,
  Bus,
  Home,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface GeneralAnnouncementItem {
  id: string
  title: string
  excerpt: string
  content: string
  category: 'Campus Updates' | 'Facilities' | 'Policy & Administration' | 'Hostel' | 'Transport' | 'Health & Safety' | 'Others'
  tag: string
  postedDate: string
  postedTime: string
  department: string
  imageSrc: string
  isImportant?: boolean
  isNew?: boolean
  isPinned?: boolean
}

const initialGeneralAnnouncements: GeneralAnnouncementItem[] = [
  {
    id: 'announcement-campus-closed-24-oct',
    title: 'Campus Closed on 24th Oct',
    excerpt: 'The campus will remain closed on 24th October 2026 due to maintenance and infrastructure upgradation work across multiple blocks.',
    content: 'Please be advised that all academic blocks, laboratories, central administrative offices, and library facilities will remain closed on Saturday, 24th October 2026 to facilitate scheduled high-voltage power grid maintenance and campus-wide optical fiber network upgradation. Essential hostel mess and clinic facilities will function as normal. Normal campus operations will resume on Monday, 26th October at 8:30 AM.',
    category: 'Campus Updates',
    tag: 'CAMPUS UPDATE',
    postedDate: '20 Oct 2026',
    postedTime: '10:00 AM',
    department: 'Administration',
    imageSrc: '/images/campus_building.jpg',
    isImportant: true,
    isNew: true,
    isPinned: true,
  },
  {
    id: 'announcement-new-transport-routes',
    title: 'New Transport Routes Effective from 1st Nov',
    excerpt: 'New transport routes and timings will be implemented from 1st November 2026. Please check the detailed route map and schedule.',
    content: 'The campus transport cell has revised bus routes, pickup points, and morning schedules to improve transit times for day scholar students coming from North and South Bengaluru corridors. Two new feeder shuttles connecting Vijayanagar Metro Station and Dr. AIT main gate will run every 15 minutes during peak hours (7:45 AM - 9:00 AM and 4:30 PM - 5:45 PM). Updated bus pass validation is mandatory.',
    category: 'Transport',
    tag: 'TRANSPORT',
    postedDate: '18 Oct 2026',
    postedTime: '04:30 PM',
    department: 'Transport Cell',
    imageSrc: '/images/campus_bus.jpg',
    isPinned: true,
  },
  {
    id: 'announcement-health-safety-monsoon',
    title: 'Health & Safety Guidelines for Monsoon Season',
    excerpt: 'Important health and safety guidelines to be followed during the monsoon season. Please read and adhere to the instructions.',
    content: 'With active monsoon showers, the Student Health Center advises all campus residents and day students to exercise precautionary care against vector-borne and seasonal illnesses. Drink only filtered RO water available at designated campus dispensing stations. Medical consultation is available 24/7 at the campus dispensary in Hostel Block C.',
    category: 'Health & Safety',
    tag: 'HEALTH & SAFETY',
    postedDate: '15 Oct 2026',
    postedTime: '11:20 AM',
    department: 'Health Center',
    imageSrc: '/images/health_center.jpg',
    isPinned: true,
  },
  {
    id: 'announcement-sports-complex-timings',
    title: 'Sports Complex Timings Updated',
    excerpt: 'The sports complex will now remain open from 6:00 AM to 10:00 PM. Students are requested to follow the new timings.',
    content: 'In response to representations from the Student Council, the Physical Education and Athletics Board has extended operating hours for the Indoor Badminton Arena, Gymnasium, Basketball Courts, and Running Track. Evening sessions will now run under floodlights until 10:00 PM. Appropriate sports footwear and college ID cards are required for entry.',
    category: 'Facilities',
    tag: 'FACILITIES',
    postedDate: '14 Oct 2026',
    postedTime: '09:15 AM',
    department: 'Sports Committee',
    imageSrc: '/images/sports_stadium.jpg',
  },
]

export function StudentGeneralView() {
  const router = useRouter()
  const { savedIds, toggleSave, addToast } = useStore()

  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDateFilter, setSelectedDateFilter] = useState('All Dates')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'Latest' | 'Important'>('Latest')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  // Interactive notices & modals
  const [announcementsList, setAnnouncementsList] = useState<GeneralAnnouncementItem[]>(initialGeneralAnnouncements)
  const [selectedNotice, setSelectedNotice] = useState<GeneralAnnouncementItem | null>(null)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [submitTitle, setSubmitTitle] = useState('')
  const [submitDepartment, setSubmitDepartment] = useState('Campus Life')
  const [submitContent, setSubmitContent] = useState('')
  const [activeCarouselSlide, setActiveCarouselSlide] = useState(0)

  // Carousel timer for featured banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCarouselSlide((prev) => (prev + 1) % 4)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // Filtered Announcements
  const filteredAnnouncements = useMemo(() => {
    let list = [...announcementsList]

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter((a) => a.category === activeCategory)
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tag.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'Important') {
      list.sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0))
    }

    return list
  }, [announcementsList, activeCategory, searchQuery, sortBy])

  // Handle Bookmark Toggle
  const handleToggleBookmark = (notice: GeneralAnnouncementItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    toggleSave(notice.id)
    const isNowSaved = !savedIds.includes(notice.id)
    addToast({
      type: isNowSaved ? 'success' : 'info',
      title: isNowSaved ? 'Notice Bookmarked' : 'Bookmark Removed',
      message: isNowSaved
        ? `Saved "${notice.title}" to your bookmarked announcements.`
        : `Removed "${notice.title}" from bookmarks.`,
    })
  }

  // Handle Submit Announcement
  const handleSubmitAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!submitTitle.trim() || !submitContent.trim()) {
      addToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please provide both title and description for your announcement.',
      })
      return
    }

    addToast({
      type: 'success',
      title: 'Announcement Submitted for Review',
      message: `Your notice "${submitTitle}" has been submitted to the ${submitDepartment} coordinator.`,
    })
    setIsSubmitModalOpen(false)
    setSubmitTitle('')
    setSubmitContent('')
  }

  // Category Pills
  const categoryPills = [
    'All',
    'Campus Updates',
    'Facilities',
    'Policy & Administration',
    'Hostel',
    'Transport',
    'Health & Safety',
    'Others',
  ]

  // Pinned Items
  const pinnedItems = announcementsList.filter((a) => a.isPinned)

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
                fontWeight: 900,
                letterSpacing: -0.5,
                lineHeight: 1,
                color: '#111111',
              }}
            >
              CampusVoice
            </div>
            <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, marginTop: 2 }}>
              Your Campus. Your Voice.
            </div>
          </div>
        </Link>

        {/* Center: Omni Search Bar with ⌘ K */}
        <div
          style={{
            flex: 1,
            maxWidth: 620,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: 9999,
              padding: '8px 16px',
              gap: 10,
              transition: 'all 0.15s ease',
            }}
          >
            <Search width={16} height={16} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search announcements, events, placements, clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  <span style={{ fontSize: 13, fontWeight: 900 }}>General Campus Alerts</span>
                  <span
                    style={{
                      fontSize: 11,
                      backgroundColor: '#D5FF38',
                      color: '#111111',
                      padding: '2px 6px',
                      borderRadius: 999,
                      fontWeight: 900,
                    }}
                  >
                    Important
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                  <div
                    style={{
                      padding: '8px 10px',
                      backgroundColor: '#1A1A1A',
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setIsNotificationOpen(false)
                      setSelectedNotice(initialGeneralAnnouncements[0])
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#D5FF38' }}>Campus Closed on 24th Oct</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
                      Maintenance and infrastructure upgradation. All academic blocks closed.
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '8px 10px',
                      backgroundColor: '#1A1A1A',
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setIsNotificationOpen(false)
                      setSelectedNotice(initialGeneralAnnouncements[1])
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#FA78B9' }}>New Transport Routes</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
                      Revised timings and feeder shuttles from Vijayanagar Metro.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Pill */}
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
          gridTemplateColumns: '220px minmax(0, 1fr) 300px',
          gap: 20,
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

              {/* 7. General (ACTIVE) */}
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
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 3px 8px rgba(213,255,56,0.3)',
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

              {/* 9. Reading Streak */}
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
                <Clock width={17} height={17} />
                <span>Reading Streak</span>
              </button>
            </nav>
          </div>

          {/* Bottom Streak Widget */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 20,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
            }}
            onClick={() => router.push('/student/activity')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: '#1F2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flame width={18} height={18} color="#F97316" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#FFFFFF' }}>
                  7 Day Streak
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                  Keep up with campus!
                </div>
              </div>
            </div>
            <ChevronRight width={16} height={16} color="#9CA3AF" />
          </div>
        </aside>

        {/* COLUMN 2: CENTER GENERAL ANNOUNCEMENTS HUB */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header Title & Tagline with Sticker */}
          <div style={{ position: 'relative', paddingTop: 6 }}>
            {/* Tag Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 9999,
                padding: '4px 12px',
                fontSize: 10,
                fontWeight: 900,
                color: '#374151',
                letterSpacing: 0.8,
                marginBottom: 8,
              }}
            >
              <span>🎓</span>
              <span>GENERAL • UPDATES • FACILITIES • POLICIES • CAMPUS LIFE</span>
            </div>

            {/* Oversized Headline with doodle rays & tilted sticker */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <h1
                    style={{
                      fontSize: 48,
                      fontWeight: 950,
                      letterSpacing: -1.5,
                      lineHeight: 1,
                      margin: 0,
                      color: '#111111',
                    }}
                  >
                    General Announcements
                  </h1>
                  {/* Doodle rays \ | / */}
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" style={{ marginTop: -14 }}>
                    <path d="M12 2V7" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M5 5L8.5 8.5" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M19 5L15.5 8.5" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: '#4B5563',
                    fontWeight: 600,
                    margin: '8px 0 0 0',
                  }}
                >
                  Stay informed with the latest updates, policy changes, campus facilities, and important information.
                </p>
              </div>

              {/* Tilted Sticker: SAME CAMPUS. MORE UPDATES. */}
              <div
                style={{
                  position: 'relative',
                  transform: 'rotate(-4deg)',
                  backgroundColor: '#D5FF38',
                  padding: '8px 16px',
                  borderRadius: 14,
                  boxShadow: '0 4px 16px rgba(213,255,56,0.3)',
                  border: '2px solid #111111',
                }}
              >
                {/* Doodles above sticker */}
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    right: 12,
                    display: 'flex',
                    gap: 4,
                  }}
                >
                  <div style={{ width: 2, height: 10, backgroundColor: '#111111', transform: 'rotate(25deg)' }} />
                  <div style={{ width: 2, height: 10, backgroundColor: '#111111', transform: 'rotate(-25deg)' }} />
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 950,
                    lineHeight: 1.15,
                    color: '#111111',
                    letterSpacing: -0.2,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}
                >
                  <div>SAME CAMPUS.</div>
                  <div>MORE UPDATES.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Search input */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '10px 18px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <Search width={16} height={16} color="#6B7280" />
                <input
                  type="text"
                  placeholder="Search general announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
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
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <X width={14} height={14} color="#9CA3AF" />
                  </button>
                )}
              </div>

              {/* All Dates Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 9999,
                    padding: '10px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#111111',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  <Calendar width={16} height={16} color="#111111" />
                  <span>{selectedDateFilter}</span>
                  <ChevronDown width={14} height={14} color="#6B7280" />
                </button>

                {isDateDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 46,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 14,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      zIndex: 30,
                      padding: 6,
                      minWidth: 160,
                    }}
                  >
                    {['All Dates', 'Today', 'This Week', 'This Month'].map((df) => (
                      <button
                        key={df}
                        type="button"
                        onClick={() => {
                          setSelectedDateFilter(df)
                          setIsDateDropdownOpen(false)
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: 12,
                          fontWeight: selectedDateFilter === df ? 900 : 600,
                          backgroundColor: selectedDateFilter === df ? '#F3F4F6' : 'transparent',
                          color: '#111111',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                      >
                        {df}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category Pills Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 4,
              }}
            >
              {categoryPills.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                      border: isActive ? 'none' : '1px solid #E5E7EB',
                      backgroundColor: isActive ? '#111111' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* FEATURED NOTICE HERO BANNER */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 24,
              padding: '28px 32px',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: 24,
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Left Column: Featured Notice Details */}
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    fontSize: 10,
                    fontWeight: 950,
                    padding: '4px 10px',
                    borderRadius: 9999,
                    letterSpacing: 0.5,
                    marginBottom: 12,
                  }}
                >
                  <Megaphone width={12} height={12} />
                  <span>IMPORTANT</span>
                </div>

                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 950,
                    lineHeight: 1.15,
                    letterSpacing: -0.8,
                    margin: 0,
                    color: '#FFFFFF',
                  }}
                >
                  Campus Closed on 24th Oct
                </h2>

                <p
                  style={{
                    fontSize: 13,
                    color: '#D1D5DB',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    margin: '10px 0 18px 0',
                    maxWidth: 440,
                  }}
                >
                  The campus will remain closed on 24th October 2026 due to Maintenance and Infrastructure Upgradation.
                </p>

                {/* Metadata row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 16,
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#D1D5DB',
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar width={15} height={15} color="#D5FF38" />
                    <span>20 Oct 2026</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock width={15} height={15} color="#FA78B9" />
                    <span>10:00 AM</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Building2 width={15} height={15} color="#3C5BFF" />
                    <span>Administration</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => setSelectedNotice(initialGeneralAnnouncements[0])}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    fontSize: 13,
                    fontWeight: 900,
                    padding: '10px 22px',
                    borderRadius: 9999,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(213,255,56,0.4)',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <span>Read Full Notice</span>
                  <ArrowRight width={16} height={16} />
                </button>
              </div>

              {/* Right Column: Campus Photo with Tilted Pink Sticker */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 160,
                  borderRadius: 18,
                  overflow: 'hidden',
                  border: '1px solid #333333',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <Image
                  src="/images/campus_building.jpg"
                  alt="Campus Administration Building"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                {/* Tilted Sticker: CAMPUS UPDATE */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    fontWeight: 950,
                    fontSize: 12,
                    padding: '6px 14px',
                    borderRadius: 10,
                    transform: 'rotate(-6deg)',
                    boxShadow: '0 4px 12px rgba(250,120,185,0.4)',
                    border: '2px solid #111111',
                    letterSpacing: -0.3,
                  }}
                >
                  CAMPUS UPDATE
                </div>
              </div>
            </div>

            {/* Carousel Dots */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginTop: 20,
              }}
            >
              {[0, 1, 2, 3].map((dot) => (
                <button
                  key={dot}
                  type="button"
                  onClick={() => setActiveCarouselSlide(dot)}
                  style={{
                    width: activeCarouselSlide === dot ? 20 : 6,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: activeCarouselSlide === dot ? '#D5FF38' : '#374151',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ALL ANNOUNCEMENTS FEED SECTION */}
          <div>
            {/* Header: All Announcements + Sort Dropdown */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#111111',
                  margin: 0,
                }}
              >
                All Announcements
              </h3>

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 9999,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                >
                  <span>Sort by: {sortBy}</span>
                  <ChevronDown width={14} height={14} color="#6B7280" />
                </button>

                {isSortDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 36,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 12,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                      zIndex: 30,
                      padding: 4,
                      minWidth: 140,
                    }}
                  >
                    {(['Latest', 'Important'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSortBy(s)
                          setIsSortDropdownOpen(false)
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '6px 10px',
                          fontSize: 12,
                          fontWeight: sortBy === s ? 900 : 600,
                          backgroundColor: sortBy === s ? '#F3F4F6' : 'transparent',
                          color: '#111111',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* List of 4 Announcement Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredAnnouncements.map((announcement) => {
                const isBookmarked = savedIds.includes(announcement.id)
                return (
                  <div
                    key={announcement.id}
                    onClick={() => setSelectedNotice(announcement)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 18,
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                      {/* Thumbnail Image */}
                      <div
                        style={{
                          width: 100,
                          height: 72,
                          borderRadius: 12,
                          overflow: 'hidden',
                          position: 'relative',
                          flexShrink: 0,
                          backgroundColor: '#F3F4F6',
                        }}
                      >
                        <Image
                          src={announcement.imageSrc}
                          alt={announcement.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          {/* Category Tag */}
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: 999,
                              backgroundColor:
                                announcement.category === 'Health & Safety'
                                  ? '#FA78B9'
                                  : '#EFF6FF',
                              color:
                                announcement.category === 'Health & Safety'
                                  ? '#111111'
                                  : '#2563EB',
                            }}
                          >
                            {announcement.tag}
                          </span>
                        </div>

                        <h4
                          style={{
                            fontSize: 15,
                            fontWeight: 950,
                            color: '#111111',
                            margin: '0 0 4px 0',
                            lineHeight: 1.25,
                          }}
                        >
                          {announcement.title}
                        </h4>

                        <p
                          style={{
                            fontSize: 12,
                            color: '#6B7280',
                            lineHeight: 1.4,
                            margin: '0 0 6px 0',
                          }}
                        >
                          {announcement.excerpt}
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#4B5563',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar width={12} height={12} color="#9CA3AF" />
                            <span>{announcement.postedDate} • {announcement.postedTime}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Building2 width={12} height={12} color="#9CA3AF" />
                            <span>{announcement.department}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Icons: New Badge + Bookmark + Chevron */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {announcement.isNew && (
                        <span
                          style={{
                            backgroundColor: '#FA78B9',
                            color: '#111111',
                            fontSize: 11,
                            fontWeight: 900,
                            padding: '3px 8px',
                            borderRadius: 999,
                          }}
                        >
                          New
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(announcement, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 4,
                        }}
                      >
                        <Bookmark
                          width={18}
                          height={18}
                          color={isBookmarked ? '#111111' : '#9CA3AF'}
                          fill={isBookmarked ? '#111111' : 'none'}
                        />
                      </button>

                      <ChevronRight width={18} height={18} color="#9CA3AF" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>

        {/* COLUMN 3: RIGHT WIDGETS (Pinned, Categories, Submit, Newsletter) */}
        <aside
          style={{
            position: 'sticky',
            top: 84,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* 1. PINNED ANNOUNCEMENTS WIDGET */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
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
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>📌</span>
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Pinned Announcements
                </span>
              </div>
              <button
                type="button"
                onClick={() => addToast({ type: 'info', title: 'Pinned Notices', message: 'Showing high-priority campus announcements.' })}
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#111111',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            {/* List of 3 Pinned Announcements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12 }}>
              {pinnedItems.map((item) => (
                <div
                  key={`pinned-${item.id}`}
                  onClick={() => setSelectedNotice(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 12,
                    backgroundColor: '#F9FAFB',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 44,
                        height: 38,
                        borderRadius: 8,
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, marginTop: 2 }}>
                        {item.postedDate} • {item.department}
                      </div>
                    </div>
                  </div>

                  <ChevronRight width={14} height={14} color="#9CA3AF" />
                </div>
              ))}
            </div>
          </div>

          {/* 2. CATEGORIES GRID WIDGET */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 20,
              padding: '16px 14px',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
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
                <Folder width={16} height={16} color="#D5FF38" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#FFFFFF' }}>
                  Categories
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#9CA3AF',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                View All →
              </button>
            </div>

            {/* 6 Categories in 2x3 Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}
            >
              {[
                { name: 'Campus Updates', count: '24', icon: '🏛️', bg: '#FA78B9', text: '#111111' },
                { name: 'Facilities', count: '18', icon: '⚙️', bg: '#D5FF38', text: '#111111' },
                { name: 'Policy & Administration', count: '12', icon: '🛡️', bg: '#3C5BFF', text: '#FFFFFF' },
                { name: 'Hostel', count: '16', icon: '🏠', bg: '#FFFFFF', text: '#111111' },
                { name: 'Transport', count: '14', icon: '🚌', bg: '#BAE6FD', text: '#111111' },
                { name: 'Health & Safety', count: '10', icon: '❤️', bg: '#FBCFE8', text: '#111111' },
              ].map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    setActiveCategory(c.name)
                    addToast({
                      type: 'info',
                      title: `${c.name} Filter`,
                      message: `Filtering notices by ${c.name}.`,
                    })
                  }}
                  style={{
                    backgroundColor: c.bg,
                    color: c.text,
                    borderRadius: 12,
                    padding: '10px 6px',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    textAlign: 'center',
                    gap: 2,
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  <span style={{ fontSize: 9, fontWeight: 900, lineHeight: 1.1, marginTop: 2 }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 950, opacity: 0.85 }}>
                    {c.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. SUBMIT A GENERAL ANNOUNCEMENT CARD */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '16px 16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>📢</span>
              <h4 style={{ fontSize: 13, fontWeight: 950, color: '#111111', margin: 0 }}>
                Submit a General Announcement
              </h4>
            </div>

            <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4, margin: '0 0 12px 0' }}>
              Have an important update to share? Send it to the relevant department for review.
            </p>

            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 9999,
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <span>Submit Announcement</span>
              <span>→</span>
            </button>
          </div>

          {/* 4. STAY IN THE LOOP (EMAIL NEWSLETTER) CARD */}
          <div
            style={{
              backgroundColor: '#3C5BFF',
              borderRadius: 20,
              padding: '18px 16px',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(60,91,255,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mail width={16} height={16} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 950, color: '#FFFFFF' }}>
                Stay in the Loop
              </span>
            </div>

            <p style={{ fontSize: 11, color: '#E0E7FF', lineHeight: 1.45, margin: '0 0 14px 0' }}>
              Get notified about important campus announcements directly in your inbox.
            </p>

            <button
              type="button"
              onClick={() =>
                addToast({
                  type: 'success',
                  title: 'Email Notifications Enabled',
                  message: 'You will receive digest updates for all critical campus announcements.',
                })
              }
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 9999,
                backgroundColor: '#FFFFFF',
                color: '#111111',
                fontSize: 12,
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <span>Enable Email Notifications</span>
              <span>→</span>
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL 1: ANNOUNCEMENT DETAIL MODAL */}
      {selectedNotice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setSelectedNotice(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 580,
              width: '100%',
              padding: 28,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedNotice(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X width={16} height={16} color="#111111" />
            </button>

            {/* Header: Category Badge + Title */}
            <div style={{ marginBottom: 14 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  padding: '3px 10px',
                  borderRadius: 999,
                  textTransform: 'uppercase',
                }}
              >
                {selectedNotice.category}
              </span>
              <h3 style={{ fontSize: 22, fontWeight: 950, margin: '10px 0 6px 0', color: '#111111' }}>
                {selectedNotice.title}
              </h3>
              <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
                {selectedNotice.postedDate} • {selectedNotice.postedTime} • Issued by {selectedNotice.department}
              </div>
            </div>

            {/* Image Preview */}
            <div
              style={{
                width: '100%',
                height: 180,
                borderRadius: 16,
                overflow: 'hidden',
                position: 'relative',
                marginBottom: 16,
              }}
            >
              <Image
                src={selectedNotice.imageSrc}
                alt={selectedNotice.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Content Body */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', marginBottom: 6 }}>
                Official Campus Notification
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                {selectedNotice.content}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={(e) => handleToggleBookmark(selectedNotice, e)}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: 9999,
                  backgroundColor: savedIds.includes(selectedNotice.id) ? '#111111' : '#F3F4F6',
                  color: savedIds.includes(selectedNotice.id) ? '#D5FF38' : '#111111',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Bookmark width={15} height={15} />
                <span>{savedIds.includes(selectedNotice.id) ? 'Bookmarked' : 'Save Notice'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Notice Acknowledged',
                    message: 'You have acknowledged this general campus announcement.',
                  })
                  setSelectedNotice(null)
                }}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: 9999,
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(213,255,56,0.3)',
                }}
              >
                <span>Acknowledge Notice</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SUBMIT ANNOUNCEMENT MODAL */}
      {isSubmitModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 520,
              width: '100%',
              padding: 26,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
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
              <X width={14} height={14} color="#111111" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>📢</span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 950, margin: 0, color: '#111111' }}>
                  Submit General Announcement
                </h3>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                  Submission will be routed to campus coordinators for approval
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 4 }}>
                  Announcement Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lost & Found in Block C, Hostel Water Tank Cleaning"
                  value={submitTitle}
                  onChange={(e) => setSubmitTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 4 }}>
                  Relevant Department
                </label>
                <select
                  value={submitDepartment}
                  onChange={(e) => setSubmitDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    fontWeight: 600,
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="Campus Life">Campus Life & Student Affairs</option>
                  <option value="Facilities">Facilities & Estate Maintenance</option>
                  <option value="Hostel Office">Hostel & Mess Committee</option>
                  <option value="Transport Cell">Campus Transport Cell</option>
                  <option value="Health Center">Student Health & Wellness</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#374151', display: 'block', marginBottom: 4 }}>
                  Details & Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide context, dates, contact persons, or specific guidelines..."
                  value={submitContent}
                  onChange={(e) => setSubmitContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1px solid #E5E7EB',
                    fontSize: 13,
                    fontWeight: 600,
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 9999,
                  backgroundColor: '#111111',
                  color: '#D5FF38',
                  fontSize: 13,
                  fontWeight: 900,
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: 6,
                }}
              >
                Submit for Verification
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
