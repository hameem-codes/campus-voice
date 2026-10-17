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
  MoreHorizontal,
  Lightbulb,
  Share2,
  Trash2,
  FolderPlus,
  Copy,
  ExternalLink,
  Layers,
  Sparkles,
  Star,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface SavedNoticeItem {
  id: string
  title: string
  excerpt: string
  content: string
  category: 'Announcements' | 'Events' | 'Placements' | 'Academic' | 'General' | 'Others'
  tag: string
  tagColor: { bg: string; text: string }
  dateFormatted: string
  timeFormatted: string
  locationOrDept: string
  imageSrc: string
  folder?: string
}

const initialSavedNotices: SavedNoticeItem[] = [
  {
    id: 'bookmark-mid-sem-exam',
    title: 'Mid Semester Exam Schedule',
    excerpt: 'The mid semester examination schedule for all departments has been released.',
    content: 'All undergraduate and postgraduate students are hereby informed that the Mid-Semester Examinations for the Odd Semester 2026 will commence from October 14, 2026. Hall tickets will be issued through the student portal.',
    category: 'Academic',
    tag: 'ACADEMIC',
    tagColor: { bg: '#D5FF38', text: '#111111' },
    dateFormatted: '12 Oct 2026',
    timeFormatted: '09:30 AM',
    locationOrDept: 'Examination Cell',
    imageSrc: '/images/campus_building.jpg',
    folder: 'Exams',
  },
  {
    id: 'bookmark-garba-night',
    title: 'Garba Night',
    excerpt: 'Join us for a vibrant evening of music, dance and cultural celebration.',
    content: 'Dr AIT welcomes all students for the garba-26 cultural festival. Dress code: ethnic wear. Entry by valid student ID card only. Refreshment coupons will be distributed at entry gate.',
    category: 'Events',
    tag: 'EVENT',
    tagColor: { bg: '#FA78B9', text: '#111111' },
    dateFormatted: '15 Oct 2026',
    timeFormatted: '07:00 PM',
    locationOrDept: 'College Ground',
    imageSrc: '/images/garba_night.jpg',
    folder: 'Events',
  },
  {
    id: 'bookmark-google-recruitment',
    title: 'Google Campus Recruitment Drive',
    excerpt: 'Final year students can register for the upcoming Google placement drive.',
    content: 'Google recruitment team is visiting Dr AIT campus for Software Engineer and Solutions Engineering roles for 2026 graduating batches. Register online through Dr AIT placement portal.',
    category: 'Placements',
    tag: 'PLACEMENT',
    tagColor: { bg: '#EFF6FF', text: '#2563EB' },
    dateFormatted: '20 Oct 2026',
    timeFormatted: '10:00 AM',
    locationOrDept: 'Main Auditorium',
    imageSrc: '/images/recruitment_interview.jpg',
    folder: 'Placements',
  },
  {
    id: 'bookmark-library-timings',
    title: 'Library Timings Update',
    excerpt: 'The library will remain open till 10 PM during exam week.',
    content: 'In view of the upcoming mid-semester examinations, the Central Library reading halls and reference sections will remain open extended hours until 10:00 PM on all weekdays.',
    category: 'General',
    tag: 'GENERAL',
    tagColor: { bg: '#EFF6FF', text: '#2563EB' },
    dateFormatted: '11 Oct 2026',
    timeFormatted: '04:20 PM',
    locationOrDept: 'Library Committee',
    imageSrc: '/images/library_books.jpg',
    folder: 'Important',
  },
  {
    id: 'bookmark-transport-routes',
    title: 'New Transport Routes Effective from 1st Nov',
    excerpt: 'New transport routes and timings will be implemented from 1st November 2026.',
    content: 'The campus transport cell has revised bus routes, pickup points, and morning timings. Two new feeder shuttles connecting Vijayanagar Metro Station will run every 15 minutes during peak hours.',
    category: 'General',
    tag: 'GENERAL',
    tagColor: { bg: '#EFF6FF', text: '#2563EB' },
    dateFormatted: '18 Oct 2026',
    timeFormatted: '04:30 PM',
    locationOrDept: 'Transport Cell',
    imageSrc: '/images/campus_bus.jpg',
    folder: 'Important',
  },
  {
    id: 'bookmark-ai-ml-workshop',
    title: 'Workshop on AI & ML',
    excerpt: 'A hands-on workshop organized by the CSE department.',
    content: 'Department of Computer Science & Engineering presents a 2-day certified bootcamp on Deep Learning, PyTorch, and Generative AI applications with industry mentors.',
    category: 'Events',
    tag: 'EVENT',
    tagColor: { bg: '#FA78B9', text: '#111111' },
    dateFormatted: '20 Oct 2026',
    timeFormatted: '02:00 PM',
    locationOrDept: 'CSE Seminar Hall',
    imageSrc: '/images/ai_workshop.jpg',
    folder: 'Events',
  },
]

export function StudentBookmarksView() {
  const router = useRouter()
  const { savedIds, toggleSave, addToast } = useStore()

  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'Latest' | 'Oldest' | 'Category'>('Latest')
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('All Bookmarks')
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  // Bookmarks collection
  const [bookmarksList, setBookmarksList] = useState<SavedNoticeItem[]>(initialSavedNotices)
  const [selectedNotice, setSelectedNotice] = useState<SavedNoticeItem | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  // Filter logic
  const filteredBookmarks = useMemo(() => {
    let list = [...bookmarksList]

    // Category pill filter
    if (activeCategory !== 'All') {
      list = list.filter((b) => b.category === activeCategory)
    }

    // Quick filter widget
    if (selectedQuickFilter !== 'All Bookmarks') {
      list = list.filter((b) => b.category === selectedQuickFilter)
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.locationOrDept.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.tag.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'Oldest') {
      list.reverse()
    } else if (sortBy === 'Category') {
      list.sort((a, b) => a.category.localeCompare(b.category))
    }

    return list
  }, [bookmarksList, activeCategory, selectedQuickFilter, searchQuery, sortBy])

  // Handle Remove Bookmark
  const handleRemoveBookmark = (item: SavedNoticeItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    toggleSave(item.id)
    setBookmarksList((prev) => prev.filter((b) => b.id !== item.id))
    addToast({
      type: 'info',
      title: 'Bookmark Removed',
      message: `Removed "${item.title}" from your saved notices.`,
    })
  }

  // Handle Copy Link
  const handleCopyLink = (item: SavedNoticeItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setActiveMenuId(null)
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: `Direct link to "${item.title}" copied to clipboard.`,
    })
  }

  // Category Pills
  const categoryPills = [
    'All',
    'Announcements',
    'Events',
    'Placements',
    'Academic',
    'General',
    'Others',
  ]

  // Counts for quick filters
  const categoryCounts = {
    'All Bookmarks': bookmarksList.length,
    Announcements: 5,
    Events: bookmarksList.filter((b) => b.category === 'Events').length,
    Placements: bookmarksList.filter((b) => b.category === 'Placements').length,
    Academic: bookmarksList.filter((b) => b.category === 'Academic').length,
    General: bookmarksList.filter((b) => b.category === 'General').length,
  }

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
              placeholder="Search your bookmarked notices, events, placements..."
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
                  <span style={{ fontSize: 13, fontWeight: 900 }}>Bookmark Alerts</span>
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
                    Saved
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
                      setSelectedNotice(initialSavedNotices[0])
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#D5FF38' }}>Exam Schedule Coming Up</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
                      Mid-sem exams start in 2 days. Review your saved timetable.
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
                      setSelectedNotice(initialSavedNotices[1])
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#FA78B9' }}>Garba Night Tonight</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
                      Event begins at 7:00 PM at College Ground.
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

              {/* 8. Bookmarked (ACTIVE) */}
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
                <Bookmark width={17} height={17} />
                <span>Bookmarked</span>
              </button>

              {/* 9. Reading Streak */}
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
            onClick={() => router.push('/student/streak')}
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

        {/* COLUMN 2: CENTER BOOKMARKED NOTICES HUB */}
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
              <span>BOOKMARKS • SAVED • IMPORTANT • QUICK ACCESS</span>
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
                    Bookmarked Notices
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
                  All your saved announcements, events, placements and updates in one place.
                </p>
              </div>

              {/* Tilted Sticker: SAVE TRACK REVISIT STAY AHEAD. */}
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
                    fontSize: 11,
                    fontWeight: 950,
                    lineHeight: 1.2,
                    color: '#111111',
                    letterSpacing: -0.2,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}
                >
                  <div>SAVE</div>
                  <div>TRACK</div>
                  <div>REVISIT</div>
                  <div>STAY AHEAD.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Sort Filters Row */}
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
                  placeholder="Search your bookmarks..."
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

              {/* Sort by Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
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
                  <span>Sort by: {sortBy}</span>
                  <ChevronDown width={14} height={14} color="#6B7280" />
                </button>

                {isSortDropdownOpen && (
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
                    {(['Latest', 'Oldest', 'Category'] as const).map((s) => (
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
                          padding: '8px 12px',
                          fontSize: 12,
                          fontWeight: sortBy === s ? 900 : 600,
                          backgroundColor: sortBy === s ? '#F3F4F6' : 'transparent',
                          color: '#111111',
                          border: 'none',
                          borderRadius: 8,
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

          {/* LIST OF BOOKMARKED CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredBookmarks.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 20,
                  padding: '48px 24px',
                  textAlign: 'center',
                  border: '1px solid #E5E7EB',
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔖</div>
                <h4 style={{ fontSize: 18, fontWeight: 900, color: '#111111', margin: '0 0 6px 0' }}>
                  No saved notices match your filter
                </h4>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                  Try changing category filters or searching for other keywords.
                </p>
              </div>
            ) : (
              filteredBookmarks.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedNotice(item)}
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
                    position: 'relative',
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
                        src={item.imageSrc}
                        alt={item.title}
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
                            backgroundColor: item.tagColor.bg,
                            color: item.tagColor.text,
                          }}
                        >
                          {item.tag}
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
                        {item.title}
                      </h4>

                      <p
                        style={{
                          fontSize: 12,
                          color: '#6B7280',
                          lineHeight: 1.4,
                          margin: '0 0 6px 0',
                        }}
                      >
                        {item.excerpt}
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
                          <span>{item.dateFormatted}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock width={12} height={12} color="#9CA3AF" />
                          <span>{item.timeFormatted}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Building2 width={12} height={12} color="#9CA3AF" />
                          <span>{item.locationOrDept}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Pink Bookmark Button + More Menu */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={(e) => e.stopPropagation()}>
                    {/* Pink Bookmark Pill Icon */}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveBookmark(item, e)}
                      title="Remove Bookmark"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: '#FFE4E6',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Bookmark width={16} height={16} color="#E11D48" fill="#E11D48" />
                    </button>

                    {/* More Menu ... */}
                    <div style={{ position: 'relative' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenuId(activeMenuId === item.id ? null : item.id)
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor: '#F9FAFB',
                          border: '1px solid #E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <MoreHorizontal width={16} height={16} color="#6B7280" />
                      </button>

                      {activeMenuId === item.id && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 36,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 12,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                            border: '1px solid #E5E7EB',
                            padding: 6,
                            minWidth: 150,
                            zIndex: 30,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleCopyLink(item, e)}
                            style={{
                              padding: '8px 10px',
                              fontSize: 12,
                              fontWeight: 700,
                              textAlign: 'left',
                              background: 'none',
                              border: 'none',
                              borderRadius: 6,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              color: '#111111',
                            }}
                          >
                            <Copy width={13} height={13} />
                            <span>Copy Link</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuId(null)
                              setSelectedNotice(item)
                            }}
                            style={{
                              padding: '8px 10px',
                              fontSize: 12,
                              fontWeight: 700,
                              textAlign: 'left',
                              background: 'none',
                              border: 'none',
                              borderRadius: 6,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              color: '#111111',
                            }}
                          >
                            <ExternalLink width={13} height={13} />
                            <span>View Details</span>
                          </button>
                          <div style={{ height: 1, backgroundColor: '#F3F4F6', margin: '2px 0' }} />
                          <button
                            type="button"
                            onClick={(e) => {
                              setActiveMenuId(null)
                              handleRemoveBookmark(item, e)
                            }}
                            style={{
                              padding: '8px 10px',
                              fontSize: 12,
                              fontWeight: 700,
                              textAlign: 'left',
                              background: 'none',
                              border: 'none',
                              borderRadius: 6,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              color: '#EF4444',
                            }}
                          >
                            <Trash2 width={13} height={13} />
                            <span>Remove</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* COLUMN 3: RIGHT WIDGETS (Bookmarks Overview, Quick Filters, Folders, Reminder) */}
        <aside
          style={{
            position: 'sticky',
            top: 84,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* 1. BOOKMARKS OVERVIEW WIDGET */}
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
                gap: 8,
              }}
            >
              <Bookmark width={17} height={17} color="#111111" fill="#111111" />
              <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                Bookmarks Overview
              </span>
            </div>

            {/* 2x2 Metric Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                padding: 14,
              }}
            >
              {/* Stat 1: Total Bookmarks */}
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
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#FFE4E6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bookmark width={16} height={16} color="#E11D48" fill="#E11D48" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    12
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Total Bookmarks
                  </div>
                </div>
              </div>

              {/* Stat 2: Announcements */}
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
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Megaphone width={16} height={16} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    5
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Announcements
                  </div>
                </div>
              </div>

              {/* Stat 3: Events */}
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
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#F3E8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CalendarDays width={16} height={16} color="#9333EA" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    4
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Events
                  </div>
                </div>
              </div>

              {/* Stat 4: Placements */}
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
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Briefcase width={16} height={16} color="#D97706" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    3
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Placements
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. QUICK FILTERS WIDGET */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 20,
              padding: '16px 14px',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 13 }}>⚡</span>
              <span style={{ fontSize: 13, fontWeight: 950, color: '#FFFFFF' }}>
                Quick Filters
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { name: 'All Bookmarks', icon: Bookmark, count: 12 },
                { name: 'Announcements', icon: Megaphone, count: 5 },
                { name: 'Events', icon: CalendarDays, count: 4 },
                { name: 'Placements', icon: Briefcase, count: 3 },
                { name: 'Academic', icon: GraduationCap, count: 4 },
                { name: 'General', icon: Folder, count: 6 },
              ].map((item) => {
                const isActive = selectedQuickFilter === item.name
                const IconComponent = item.icon
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setSelectedQuickFilter(item.name)
                      addToast({
                        type: 'info',
                        title: item.name,
                        message: `Filtering view by ${item.name}.`,
                      })
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: 12,
                      border: 'none',
                      backgroundColor: isActive ? '#D5FF38' : 'transparent',
                      color: isActive ? '#111111' : '#FFFFFF',
                      fontSize: 12,
                      fontWeight: isActive ? 950 : 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IconComponent width={15} height={15} color={isActive ? '#111111' : '#9CA3AF'} />
                      <span>{item.name}</span>
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        backgroundColor: isActive ? '#111111' : '#1F2937',
                        color: isActive ? '#D5FF38' : '#9CA3AF',
                        padding: '2px 8px',
                        borderRadius: 999,
                      }}
                    >
                      {item.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. BOOKMARK FOLDERS WIDGET */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '16px 14px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Folder width={15} height={15} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Bookmark Folders
                </span>
              </div>
              <button
                type="button"
                onClick={() => addToast({ type: 'info', title: 'Manage Folders', message: 'Folder management opened.' })}
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Manage →
              </button>
            </div>

            {/* List of 5 Folders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { name: 'Important', count: '4 items', icon: '★', iconBg: '#FFE4E6', iconColor: '#E11D48' },
                { name: 'Exams', count: '2 items', icon: '📝', iconBg: '#ECFCCB', iconColor: '#65A30D' },
                { name: 'Placements', count: '3 items', icon: '💼', iconBg: '#DBEAFE', iconColor: '#2563EB' },
                { name: 'Events', count: '2 items', icon: '🎉', iconBg: '#E0E7FF', iconColor: '#4338CA' },
                { name: 'To Read Later', count: '1 item', icon: '📖', iconBg: '#F3F4F6', iconColor: '#4B5563' },
              ].map((folder) => (
                <div
                  key={folder.name}
                  onClick={() => {
                    const matched = bookmarksList.filter((b) => b.folder === folder.name)
                    if (matched.length > 0) {
                      addToast({
                        type: 'info',
                        title: folder.name,
                        message: `Showing ${matched.length} items in ${folder.name} folder.`,
                      })
                    }
                  }}
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
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        backgroundColor: folder.iconBg,
                        color: folder.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 900,
                      }}
                    >
                      {folder.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                        {folder.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                        {folder.count}
                      </div>
                    </div>
                  </div>

                  <MoreHorizontal width={14} height={14} color="#9CA3AF" />
                </div>
              ))}
            </div>
          </div>

          {/* 4. NEVER LOSE IMPORTANT UPDATES CARD */}
          <div
            style={{
              backgroundColor: '#3C5BFF',
              borderRadius: 20,
              padding: '16px',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(60,91,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Lightbulb width={18} height={18} color="#FBBF24" />
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 950, color: '#FFFFFF', lineHeight: 1.2 }}>
                Never lose important updates
              </div>
              <div style={{ fontSize: 10, color: '#E0E7FF', lineHeight: 1.35, marginTop: 2 }}>
                Bookmark notices, events and placements to access them quickly anytime.
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* DETAIL MODAL */}
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
                  backgroundColor: selectedNotice.tagColor.bg,
                  color: selectedNotice.tagColor.text,
                  padding: '3px 10px',
                  borderRadius: 999,
                  textTransform: 'uppercase',
                }}
              >
                {selectedNotice.tag}
              </span>
              <h3 style={{ fontSize: 22, fontWeight: 950, margin: '10px 0 6px 0', color: '#111111' }}>
                {selectedNotice.title}
              </h3>
              <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
                {selectedNotice.dateFormatted} • {selectedNotice.timeFormatted} • {selectedNotice.locationOrDept}
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
                Saved Notice Details
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                {selectedNotice.content}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  handleRemoveBookmark(selectedNotice)
                  setSelectedNotice(null)
                }}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: 9999,
                  backgroundColor: '#FFE4E6',
                  color: '#E11D48',
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
                <Trash2 width={15} height={15} />
                <span>Remove Bookmark</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCopyLink(selectedNotice)
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
                <Share2 width={15} height={15} />
                <span>Share Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
