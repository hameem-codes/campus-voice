'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
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
  Pin,
  Heart,
  MessageSquare,
  Check,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  X,
  Share2,
  Calendar,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Role, UpdateItem } from '@/types'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface AnnouncementCardData {
  id: string
  title: string
  excerpt: string
  description?: string
  category: 'GENERAL' | 'EVENT' | 'PLACEMENT' | 'ACADEMIC'
  tag: string
  isPinned?: boolean
  dateFormatted: string
  likesCount: number
  isLiked?: boolean
  commentsCount: number
  comments?: Array<{ author: string; text: string; time: string }>
  isGoing?: boolean
  goingCount?: number
  isRsvp?: boolean
  rsvpCount?: number
  imageSrc?: string
  bgStyle: 'black' | 'blue' | 'lime' | 'white'
  textColor: 'white' | 'black'
  size: 'large' | 'compact'
  hashTags: string[]
}

const initialCards: AnnouncementCardData[] = [
  {
    id: 'garba-night-2026',
    title: 'GARBA NIGHT',
    excerpt: 'Dr AIT welcomes all the students for the garba-26. Dress code: garba outfit. Not allowed: shorts and torn jeans. Location: College Ground | Date: 25/10/2026 | Time: 7:00PM - 9:00PM Dinner is arranged. (Location is pinned Taj West End, MG Road)',
    category: 'GENERAL',
    tag: 'GENERAL',
    isPinned: true,
    dateFormatted: '15 October 2026 • 11:55 AM',
    likesCount: 0,
    isLiked: false,
    commentsCount: 2,
    comments: [
      { author: 'Rahul S.', text: 'Is traditional dress compulsory for entry?', time: '2h ago' },
      { author: 'Ananya V.', text: 'Passes are being distributed at the Student Council desk.', time: '1h ago' },
    ],
    imageSrc: '/images/garba_night.jpg',
    bgStyle: 'black',
    textColor: 'white',
    size: 'large',
    hashTags: ['#general', '#cultural', '#events'],
  },
  {
    id: 'placement-drive-2026',
    title: 'PLACEMENT DRIVE',
    excerpt: 'Placement drive for pre final and final year students. Multiple top-tier tech and consulting companies hiring across domains.',
    category: 'EVENT',
    tag: 'EVENT',
    isPinned: true,
    dateFormatted: '15 October 2026 • 11:46 AM',
    likesCount: 1,
    isLiked: true,
    commentsCount: 0,
    isGoing: true,
    goingCount: 1,
    imageSrc: '/images/placement_drive.jpg',
    bgStyle: 'black',
    textColor: 'white',
    size: 'large',
    hashTags: ['#event', '#placement', '#placements'],
  },
  {
    id: 'cultural-fest-maitri-2026',
    title: 'Annual Cultural Fest',
    excerpt: 'Buckle up! The annual cultural fest - MAITRI 2026 is about to arrive in style with concert nights, dance battles, and art stages.',
    category: 'EVENT',
    tag: 'EVENT',
    dateFormatted: '14 October 2026 • 12:11 PM',
    likesCount: 2,
    isLiked: true,
    commentsCount: 2,
    comments: [
      { author: 'Divya M.', text: 'Headliner artist lineup announced tomorrow!', time: 'Yesterday' },
      { author: 'Karan P.', text: 'Can students from other colleges attend?', time: '2d ago' },
    ],
    isRsvp: false,
    rsvpCount: 0,
    imageSrc: '/images/cultural_fest.jpg',
    bgStyle: 'blue',
    textColor: 'white',
    size: 'large',
    hashTags: ['#event', '#cultural', '#events'],
  },
  {
    id: 'campus-recruitment-drive-2026',
    title: 'Campus Recruitment Drive',
    excerpt: 'Final-year students can register for the upcoming recruitment drive at the placement cell.',
    category: 'PLACEMENT',
    tag: 'PLACEMENT',
    dateFormatted: '12 October 2026 • 11:00 AM',
    likesCount: 2,
    isLiked: true,
    commentsCount: 0,
    imageSrc: '/images/recruitment_interview.jpg',
    bgStyle: 'lime',
    textColor: 'black',
    size: 'large',
    hashTags: ['#placement', '#placements'],
  },
  {
    id: 'mid-sem-exam-schedule-2026',
    title: 'Mid Sem Exam Schedule',
    excerpt: 'The mid semester examination schedule for all departments has been released.',
    category: 'ACADEMIC',
    tag: 'ACADEMIC',
    dateFormatted: '12 October 2026 • 09:30 AM',
    likesCount: 5,
    isLiked: false,
    commentsCount: 1,
    comments: [
      { author: 'Siddharth T.', text: 'Seating matrix will be pinned on department notice boards.', time: '3d ago' },
    ],
    imageSrc: '/images/mid_sem_exam.jpg',
    bgStyle: 'white',
    textColor: 'black',
    size: 'compact',
    hashTags: ['#academic', '#exams'],
  },
  {
    id: 'library-timings-update-2026',
    title: 'Library Timings Update',
    excerpt: 'Library will remain open till 10 PM during exam week.',
    category: 'GENERAL',
    tag: 'GENERAL',
    dateFormatted: '11 October 2026 • 04:20 PM',
    likesCount: 3,
    isLiked: false,
    commentsCount: 0,
    imageSrc: '/images/library_books.jpg',
    bgStyle: 'white',
    textColor: 'black',
    size: 'compact',
    hashTags: ['#general', '#exams', '#hostel'],
  },
  {
    id: 'workshop-ai-ml-2026',
    title: 'Workshop on AI & ML',
    excerpt: 'A hands-on workshop on AI & ML organized by the CSE department.',
    category: 'EVENT',
    tag: 'EVENT',
    dateFormatted: '10 October 2026 • 03:15 PM',
    likesCount: 4,
    isLiked: false,
    commentsCount: 0,
    imageSrc: '/images/ai_workshop.jpg',
    bgStyle: 'white',
    textColor: 'black',
    size: 'compact',
    hashTags: ['#event', '#workshop', '#academic'],
  },
]

export function StudentDashboardFeedView({
  initialActiveNav = 'Announcements',
}: {
  initialActiveNav?: string
}) {
  const router = useRouter()
  const {
    currentUser,
    role,
    setRole,
    studentFeed,
    savedIds,
    toggleSave,
    unreadNotificationsCount,
    addToast,
    logout,
    theme,
    toggleTheme,
  } = useStore()

  // State
  const [activeNav, setActiveNav] = useState(initialActiveNav)
  const [activeFilter, setActiveFilter] = useState<string>('#all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'likes' | 'pinned'>('latest')
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false)
  const [readingStreakModalOpen, setReadingStreakModalOpen] = useState(false)
  const [activeCommentItem, setActiveCommentItem] = useState<AnnouncementCardData | null>(null)
  const [newCommentText, setNewCommentText] = useState('')

  // Live interactive card collection
  const [feedCards, setFeedCards] = useState<AnnouncementCardData[]>(initialCards)

  // Search input ref for ⌘K shortcut
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Global keyboard shortcut (⌘K or / to search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Interactive Card Actions
  const handleToggleLike = (cardId: string) => {
    setFeedCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          const nextLiked = !card.isLiked
          const nextCount = nextLiked ? card.likesCount + 1 : Math.max(0, card.likesCount - 1)
          addToast({
            type: nextLiked ? 'success' : 'info',
            title: nextLiked ? 'Liked announcement' : 'Unliked announcement',
            message: nextLiked
              ? `You liked "${card.title}". Saved to your activity.`
              : `Removed like for "${card.title}".`,
          })
          return {
            ...card,
            isLiked: nextLiked,
            likesCount: nextCount,
          }
        }
        return card
      })
    )
  }

  const handleToggleGoing = (cardId: string) => {
    setFeedCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          const nextGoing = !card.isGoing
          const nextCount = nextGoing ? (card.goingCount || 0) + 1 : Math.max(0, (card.goingCount || 1) - 1)
          addToast({
            type: nextGoing ? 'success' : 'info',
            title: nextGoing ? 'RSVP Confirmed' : 'RSVP Cancelled',
            message: nextGoing
              ? `You are marked as going to "${card.title}". Added to your calendar.`
              : `You are no longer attending "${card.title}".`,
          })
          return {
            ...card,
            isGoing: nextGoing,
            goingCount: nextCount,
          }
        }
        return card
      })
    )
  }

  const handleToggleRsvp = (cardId: string) => {
    setFeedCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          const nextRsvp = !card.isRsvp
          const nextCount = nextRsvp ? (card.rsvpCount || 0) + 1 : Math.max(0, (card.rsvpCount || 1) - 1)
          addToast({
            type: nextRsvp ? 'success' : 'info',
            title: nextRsvp ? 'RSVP Registered' : 'RSVP Cancelled',
            message: nextRsvp
              ? `Your RSVP for "${card.title}" has been saved.`
              : `Cancelled RSVP for "${card.title}".`,
          })
          return {
            ...card,
            isRsvp: nextRsvp,
            rsvpCount: nextCount,
          }
        }
        return card
      })
    )
  }

  const handleToggleBookmark = (cardId: string, cardTitle: string) => {
    toggleSave(cardId)
    const isCurrentlySaved = savedIds.includes(cardId)
    addToast({
      type: isCurrentlySaved ? 'info' : 'success',
      title: isCurrentlySaved ? 'Removed from Bookmarks' : 'Saved to Bookmarks',
      message: isCurrentlySaved
        ? `"${cardTitle}" removed from your bookmarks.`
        : `"${cardTitle}" saved for quick reference.`,
    })
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim() || !activeCommentItem) return

    const newComment = {
      author: currentUser.name || 'Mateen',
      text: newCommentText.trim(),
      time: 'Just now',
    }

    setFeedCards((prev) =>
      prev.map((c) => {
        if (c.id === activeCommentItem.id) {
          return {
            ...c,
            commentsCount: c.commentsCount + 1,
            comments: [newComment, ...(c.comments || [])],
          }
        }
        return c
      })
    )

    setActiveCommentItem((prev) =>
      prev
        ? {
            ...prev,
            commentsCount: prev.commentsCount + 1,
            comments: [newComment, ...(prev.comments || [])],
          }
        : null
    )

    setNewCommentText('')
    addToast({
      type: 'success',
      title: 'Comment posted',
      message: 'Your comment has been added to the discussion.',
    })
  }

  // Filtered and Sorted Cards
  const displayedCards = useMemo(() => {
    let result = [...feedCards]

    // Active Sidebar Nav Filter
    if (activeNav === 'Events') {
      result = result.filter((c) => c.category === 'EVENT')
    } else if (activeNav === 'Placements') {
      result = result.filter((c) => c.category === 'PLACEMENT')
    } else if (activeNav === 'Academic') {
      result = result.filter((c) => c.category === 'ACADEMIC')
    } else if (activeNav === 'General') {
      result = result.filter((c) => c.category === 'GENERAL')
    } else if (activeNav === 'Bookmarked') {
      result = result.filter((c) => savedIds.includes(c.id))
    } else if (activeNav === 'My Activity') {
      result = result.filter((c) => c.isLiked || c.isGoing || c.isRsvp || savedIds.includes(c.id))
    }

    // Category Filter Chips
    if (activeFilter === '#event') {
      result = result.filter((c) => c.category === 'EVENT' || c.hashTags.includes('#event'))
    } else if (activeFilter === '#placement') {
      result = result.filter((c) => c.category === 'PLACEMENT' || c.hashTags.includes('#placement') || c.hashTags.includes('#placements'))
    } else if (activeFilter === '#academic') {
      result = result.filter((c) => c.category === 'ACADEMIC' || c.hashTags.includes('#academic'))
    } else if (activeFilter === '#general') {
      result = result.filter((c) => c.category === 'GENERAL' || c.hashTags.includes('#general'))
    } else if (activeFilter !== '#all') {
      result = result.filter((c) => c.hashTags.includes(activeFilter.toLowerCase()))
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.excerpt.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.hashTags.some((t) => t.toLowerCase().includes(q))
      )
    }

    // Sorting
    if (sortBy === 'likes') {
      result.sort((a, b) => b.likesCount - a.likesCount)
    } else if (sortBy === 'pinned') {
      result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
    }
    // Default: natural sequence matching the reference layout

    return result
  }, [feedCards, activeNav, activeFilter, searchQuery, sortBy, savedIds])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F7',
        color: '#111111',
        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
      }}
    >
      <ToastContainer />

      {/* Main Responsive Container */}
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '16px 20px 48px',
        }}
      >
        {/* ========================================================
            TOP HEADER BAR
           ======================================================== */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 20,
            flexWrap: 'wrap',
          }}
        >
          {/* Brand Logo: Rounded Black Rect with 4 Equalizer Acid-Lime Bars */}
          <Link
            href="/student"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              color: '#111111',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: '#111111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3.5,
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              }}
            >
              <span style={{ width: 4, height: 14, backgroundColor: '#D5FF38', borderRadius: 9999, display: 'inline-block' }} />
              <span style={{ width: 4, height: 24, backgroundColor: '#D5FF38', borderRadius: 9999, display: 'inline-block' }} />
              <span style={{ width: 4, height: 18, backgroundColor: '#D5FF38', borderRadius: 9999, display: 'inline-block' }} />
              <span style={{ width: 4, height: 12, backgroundColor: '#D5FF38', borderRadius: 9999, display: 'inline-block' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 21,
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: '#111111',
                }}
              >
                CampusVoice
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  letterSpacing: '-0.01em',
                  marginTop: 1,
                }}
              >
                Your Campus. Your Voice.
              </span>
            </div>
          </Link>

          {/* Search Bar Pill with ⌘K Badge */}
          <div
            style={{
              flex: 1,
              maxWidth: 580,
              minWidth: 260,
              backgroundColor: '#FFFFFF',
              borderRadius: 9999,
              border: '1.5px solid #E5E7EB',
              padding: '8px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <Search width={16} height={16} color="#9CA3AF" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search events, placements, announcements..."
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
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  padding: 2,
                }}
              >
                <X width={14} height={14} />
              </button>
            ) : (
              <div
                style={{
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>⌘</span>
                <span>K</span>
              </div>
            )}
          </div>

          {/* Top Right: Notification Bell & Profile Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Notification Bell with Red Badge "3" */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setNotificationPopoverOpen((v) => !v)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
                aria-label="Notifications"
              >
                <Bell width={18} height={18} color="#111111" />
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    fontSize: 10,
                    fontWeight: 900,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFFFFF',
                  }}
                >
                  3
                </span>
              </button>

              {/* Notification Popover */}
              {notificationPopoverOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 52,
                    width: 320,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    border: '2px solid #111111',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                    padding: 16,
                    zIndex: 100,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontWeight: 900, fontSize: 13, textTransform: 'uppercase' }}>
                      Notifications (3)
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotificationPopoverOpen(false)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <X width={14} height={14} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: '8px 10px', backgroundColor: '#F9FAFB', borderRadius: 12, border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: 12, fontWeight: 800 }}>⚡ End Semester Hall Tickets</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>Check your student portal • 2 days left</div>
                    </div>
                    <div style={{ padding: '8px 10px', backgroundColor: '#F9FAFB', borderRadius: 12, border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: 12, fontWeight: 800 }}>🎉 Garba Night Schedule Updated</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>Venue pinned at College Ground</div>
                    </div>
                    <div style={{ padding: '8px 10px', backgroundColor: '#F9FAFB', borderRadius: 12, border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: 12, fontWeight: 800 }}>💼 Placement Drive Slot Allotted</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>Interview scheduled for Oct 16</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Name Pill: "Hi, Mateen" / "Student v" */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '4px 14px 4px 5px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    border: '1.5px solid #111111',
                  }}
                >
                  <Image
                    src="/images/mateen_avatar.jpg"
                    alt="Mateen"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>
                    Hi, Mateen
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 3 }}>
                    Student <ChevronDown width={12} height={12} />
                  </span>
                </div>
              </button>

              {/* Profile / Role Switcher Menu */}
              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 52,
                    width: 220,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 18,
                    border: '2px solid #111111',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                    padding: 10,
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: '6px 10px', fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>
                    Switch Account Role
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('student')
                      setProfileDropdownOpen(false)
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 10,
                      backgroundColor: role === 'student' ? '#D5FF38' : 'transparent',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#111111',
                    }}
                  >
                    <User width={14} height={14} />
                    <span>Student (Mateen)</span>
                    {role === 'student' && <span style={{ marginLeft: 'auto' }}>✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('faculty')
                      setProfileDropdownOpen(false)
                      router.push('/faculty')
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 10,
                      backgroundColor: role === 'faculty' ? '#D5FF38' : 'transparent',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#111111',
                    }}
                  >
                    <GraduationCap width={14} height={14} />
                    <span>Faculty (Dr. Maya Rao)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('admin')
                      setProfileDropdownOpen(false)
                      router.push('/admin')
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 10,
                      backgroundColor: role === 'admin' ? '#D5FF38' : 'transparent',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#111111',
                    }}
                  >
                    <ShieldCheck width={14} height={14} />
                    <span>Admin (Priya Nair)</span>
                  </button>
                  <div style={{ height: 1, backgroundColor: '#E5E7EB', margin: '6px 0' }} />
                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme()
                      setProfileDropdownOpen(false)
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: 'none',
                      background: 'transparent',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#111111',
                    }}
                  >
                    {theme === 'dark' ? <Sun width={14} height={14} /> : <Moon width={14} height={14} />}
                    <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                  </button>
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
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: 'none',
                      background: 'transparent',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#DC2626',
                    }}
                  >
                    <LogOut width={14} height={14} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ========================================================
            3-COLUMN MAIN LAYOUT
           ======================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px minmax(0, 1fr) 300px',
            gap: 20,
            alignItems: 'start',
          }}
          className="dashboard-columns"
        >
          {/* ======================================================
              LEFT COLUMN: PITCH-BLACK SIDEBAR
             ====================================================== */}
          <aside
            style={{
              backgroundColor: '#111111',
              borderRadius: 26,
              padding: '18px 14px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 820,
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
            }}
          >
            {/* Nav list */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* 1. Announcements (Active) */}
              <button
                type="button"
                onClick={() => {
                  setActiveNav('Announcements')
                  setActiveFilter('#all')
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 16px',
                  borderRadius: 16,
                  border: 'none',
                  backgroundColor: activeNav === 'Announcements' ? '#D5FF38' : 'transparent',
                  color: activeNav === 'Announcements' ? '#111111' : '#9CA3AF',
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: activeNav === 'Announcements' ? '0 3px 8px rgba(213,255,56,0.3)' : 'none',
                }}
              >
                <Megaphone width={17} height={17} />
                <span>Announcements</span>
              </button>

              {/* 2. Explore Campus */}
              <button
                type="button"
                onClick={() => {
                  setActiveNav('Explore Campus')
                  router.push('/search')
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeNav === 'Explore Campus' ? '#D5FF38' : 'transparent',
                  color: activeNav === 'Explore Campus' ? '#111111' : '#9CA3AF',
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
                onClick={() => {
                  setActiveNav('My Activity')
                  addToast({
                    type: 'info',
                    title: 'My Activity Filter',
                    message: 'Showing notices you have liked, RSVP’d to, or saved.',
                  })
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeNav === 'My Activity' ? '#D5FF38' : 'transparent',
                  color: activeNav === 'My Activity' ? '#111111' : '#9CA3AF',
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
                onClick={() => {
                  setActiveNav('Events')
                  setActiveFilter('#event')
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeNav === 'Events' ? '#D5FF38' : 'transparent',
                  color: activeNav === 'Events' ? '#111111' : '#9CA3AF',
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
                onClick={() => {
                  setActiveNav('Placements')
                  setActiveFilter('#placement')
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeNav === 'Placements' ? '#D5FF38' : 'transparent',
                  color: activeNav === 'Placements' ? '#111111' : '#9CA3AF',
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
                onClick={() => {
                  setActiveNav('Academic')
                  setActiveFilter('#academic')
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeNav === 'Academic' ? '#D5FF38' : 'transparent',
                  color: activeNav === 'Academic' ? '#111111' : '#9CA3AF',
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
                onClick={() => {
                  setActiveNav('General')
                  setActiveFilter('#general')
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeNav === 'General' ? '#D5FF38' : 'transparent',
                  color: activeNav === 'General' ? '#111111' : '#9CA3AF',
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
                onClick={() => {
                  setActiveNav('Bookmarked')
                  addToast({
                    type: 'info',
                    title: 'Bookmarked Notices',
                    message: `Filtering to ${savedIds.length} saved notice(s).`,
                  })
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeNav === 'Bookmarked' ? '#D5FF38' : 'transparent',
                  color: activeNav === 'Bookmarked' ? '#111111' : '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Bookmark width={17} height={17} />
                <span>Bookmarked</span>
                {savedIds.length > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#282828',
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 800,
                      borderRadius: 9999,
                      padding: '1px 7px',
                    }}
                  >
                    {savedIds.length}
                  </span>
                )}
              </button>

              {/* 9. Reading Streak */}
              <button
                type="button"
                onClick={() => setReadingStreakModalOpen(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: activeNav === 'Reading Streak' ? '#D5FF38' : 'transparent',
                  color: activeNav === 'Reading Streak' ? '#111111' : '#9CA3AF',
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

            {/* Bottom 7 Day Streak Card */}
            <div
              onClick={() => setReadingStreakModalOpen(true)}
              style={{
                marginTop: 'auto',
                backgroundColor: '#1C1C1E',
                border: '1px solid #28282E',
                borderRadius: 18,
                padding: '14px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>🔥</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF' }}>
                    7 Day Streak
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF' }}>
                    Keep up with campus!
                  </span>
                </div>
              </div>
              <ChevronRight width={16} height={16} color="#9CA3AF" />
            </div>
          </aside>

          {/* ======================================================
              CENTER COLUMN: ANNOUNCEMENTS FEED
             ====================================================== */}
          <main style={{ minWidth: 0 }}>
            {/* Tag Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                backgroundColor: '#E5E7EB',
                borderRadius: 9999,
                padding: '5px 14px',
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '0.06em',
                color: '#111111',
                marginBottom: 8,
              }}
            >
              <GraduationCap width={13} height={13} />
              <span>VERIFIED • REAL-TIME • FOR EVERYONE</span>
            </div>

            {/* Headline + Acid-Lime Sticker Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: 'clamp(36px, 3.8vw, 48px)',
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: '-0.04em',
                    color: '#111111',
                    margin: '4px 0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <span>What&apos;s the buzz</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span>on campus?</span>
                    <span style={{ fontSize: 20, color: '#111111', fontWeight: 900, letterSpacing: -1 }}>\ | /</span>
                  </span>
                </h1>
                <p
                  style={{
                    fontSize: 15,
                    color: '#6B7280',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Fresh notices, all in one place. No more digging through group chats.
                </p>
              </div>

              {/* Acid-Lime Green Sticker: YOUR CAMPUS. YOUR VOICE. */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  transform: 'rotate(5deg)',
                  userSelect: 'none',
                }}
                className="hidden-mobile"
              >
                <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', marginBottom: 2 }}>
                  \ | /
                </div>
                <div
                  style={{
                    backgroundColor: '#D5FF38',
                    border: '2px solid #111111',
                    borderRadius: 18,
                    padding: '8px 16px',
                    textAlign: 'center',
                    boxShadow: '2.5px 3px 0px #111111',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                    YOUR CAMPUS.
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                    YOUR VOICE.
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Chips & Sort Dropdown Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 16,
              }}
            >
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {[
                  { id: '#all', label: '#all' },
                  { id: '#event', label: '#event' },
                  { id: '#placement', label: '#placement' },
                  { id: '#academic', label: '#academic' },
                  { id: '#general', label: '#general' },
                ].map((chip) => {
                  const isActive = activeFilter === chip.id
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => {
                        setActiveFilter(chip.id)
                        if (activeNav !== 'Announcements') setActiveNav('Announcements')
                      }}
                      style={{
                        backgroundColor: isActive ? '#111111' : '#FFFFFF',
                        color: isActive ? '#D5FF38' : '#111111',
                        border: isActive ? '1.5px solid #111111' : '1.5px solid #E5E7EB',
                        borderRadius: 9999,
                        padding: '6px 18px',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                        boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                      }}
                    >
                      {chip.label}
                    </button>
                  )
                })}
              </div>

              {/* Sort By Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setSortDropdownOpen((v) => !v)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 9999,
                    padding: '7px 16px',
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  <span>↓↑</span>
                  <span>
                    {sortBy === 'latest'
                      ? 'Latest First'
                      : sortBy === 'likes'
                      ? 'Most Liked'
                      : 'Pinned First'}
                  </span>
                  <ChevronDown width={13} height={13} />
                </button>

                {sortDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 38,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 14,
                      border: '1.5px solid #111111',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      padding: 6,
                      zIndex: 30,
                      minWidth: 150,
                    }}
                  >
                    {[
                      { key: 'latest', label: 'Latest First' },
                      { key: 'likes', label: 'Most Liked' },
                      { key: 'pinned', label: 'Pinned First' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.key as any)
                          setSortDropdownOpen(false)
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '7px 12px',
                          borderRadius: 8,
                          border: 'none',
                          background: sortBy === opt.key ? '#F3F4F6' : 'transparent',
                          fontWeight: 800,
                          fontSize: 12,
                          color: '#111111',
                          cursor: 'pointer',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Urgent Notice Banner: Black Pill with Pink '⚡ URGENT' and Lime text */}
            <div
              style={{
                backgroundColor: '#111111',
                borderRadius: 9999,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 20,
                boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, color: '#D5FF38' }}>⚡</span>
                <span
                  style={{
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    borderRadius: 9999,
                    padding: '2px 10px',
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  URGENT
                </span>
                <span style={{ color: '#D5FF38', fontWeight: 900, fontSize: 13 }}>
                  End Semester Exams – Hall Tickets Released
                </span>
                <span style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 500 }}>
                  • Check your portal for details • 2 days left
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Exam Hall Tickets',
                    message: 'Redirecting to your verified exam schedule and hall ticket download.',
                  })
                  router.push('/student/updates/exam')
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: '#262626',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.15s ease',
                }}
                title="Review notice"
              >
                <ArrowRight width={14} height={14} />
              </button>
            </div>

            {/* Asymmetric Bento Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Row 1: 2 Pitch-Black Cards (Garba Night & Placement Drive) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                  gap: 18,
                }}
              >
                {displayedCards
                  .filter((c) => c.bgStyle === 'black')
                  .map((card) => {
                    const isBookmarked = savedIds.includes(card.id)
                    return (
                      <div
                        key={card.id}
                        style={{
                          backgroundColor: '#111111',
                          color: '#FFFFFF',
                          borderRadius: 24,
                          padding: '18px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          border: '1.5px solid #222222',
                          boxShadow: '0 10px 24px rgba(0,0,0,0.14)',
                          position: 'relative',
                        }}
                      >
                        {/* Top Tags */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <span
                              style={{
                                backgroundColor: '#FFFFFF',
                                color: '#111111',
                                borderRadius: 9999,
                                padding: '3px 10px',
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              {card.tag}
                            </span>
                            {card.isPinned && (
                              <span
                                style={{
                                  color: '#FA78B9',
                                  fontSize: 12,
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                📌 Pinned
                              </span>
                            )}
                          </div>

                          {/* Content Row: Text on Left, Photo on Right */}
                          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                            <div style={{ flex: 1 }}>
                              <h3
                                style={{
                                  margin: '0 0 6px',
                                  fontSize: 18,
                                  fontWeight: 900,
                                  color: '#FFFFFF',
                                  letterSpacing: '-0.02em',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {card.title}
                              </h3>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12,
                                  color: '#9CA3AF',
                                  lineHeight: 1.45,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 4,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {card.excerpt}
                              </p>
                            </div>

                            {/* Card Image */}
                            {card.imageSrc && (
                              <div
                                style={{
                                  width: 120,
                                  height: 96,
                                  borderRadius: 16,
                                  overflow: 'hidden',
                                  position: 'relative',
                                  flexShrink: 0,
                                  border: '1px solid #2C2C2E',
                                }}
                              >
                                <Image
                                  src={card.imageSrc}
                                  alt={card.title}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Date and Time */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 11,
                              color: '#6B7280',
                              marginBottom: 14,
                              fontWeight: 600,
                            }}
                          >
                            <Clock width={12} height={12} />
                            <span>{card.dateFormatted}</span>
                          </div>
                        </div>

                        {/* Bottom Actions Row */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                            paddingTop: 8,
                            borderTop: '1px solid #222222',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            {/* Like Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleLike(card.id)}
                              style={{
                                backgroundColor: card.isLiked ? '#FA78B9' : '#FFFFFF',
                                color: '#111111',
                                border: 'none',
                                borderRadius: 9999,
                                padding: '5px 14px',
                                fontSize: 11,
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                transition: 'all 0.12s ease',
                              }}
                            >
                              <Heart
                                width={12}
                                height={12}
                                fill={card.isLiked ? '#111111' : 'none'}
                              />
                              <span>
                                {card.isLiked ? 'Liked' : 'Like'} {card.likesCount}
                              </span>
                            </button>

                            {/* Comments Button */}
                            <button
                              type="button"
                              onClick={() => setActiveCommentItem(card)}
                              style={{
                                backgroundColor: '#FFFFFF',
                                color: '#111111',
                                border: 'none',
                                borderRadius: 9999,
                                padding: '5px 14px',
                                fontSize: 11,
                                fontWeight: 900,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                transition: 'all 0.12s ease',
                              }}
                            >
                              <MessageSquare width={12} height={12} />
                              <span>Comments {card.commentsCount}</span>
                            </button>

                            {/* Going / RSVP Button for Placement Drive */}
                            {card.goingCount !== undefined && (
                              <button
                                type="button"
                                onClick={() => handleToggleGoing(card.id)}
                                style={{
                                  backgroundColor: card.isGoing ? '#D5FF38' : '#282828',
                                  color: card.isGoing ? '#111111' : '#FFFFFF',
                                  border: 'none',
                                  borderRadius: 9999,
                                  padding: '5px 14px',
                                  fontSize: 11,
                                  fontWeight: 900,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  transition: 'all 0.12s ease',
                                }}
                              >
                                <Check width={12} height={12} />
                                <span>Going {card.goingCount}</span>
                              </button>
                            )}
                          </div>

                          {/* Bookmark Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleBookmark(card.id, card.title)}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: isBookmarked ? '#FFFFFF' : '#222222',
                              color: isBookmarked ? '#111111' : '#9CA3AF',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.12s ease',
                            }}
                            title={isBookmarked ? 'Saved in bookmarks' : 'Add to bookmarks'}
                          >
                            <Bookmark width={14} height={14} fill={isBookmarked ? '#111111' : 'none'} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Row 2: 2 Color Highlight Cards (Electric Blue Cultural Fest & Acid-Lime Placement) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                  gap: 18,
                }}
              >
                {/* Card 3: Annual Cultural Fest (Electric Blue) */}
                {displayedCards
                  .filter((c) => c.bgStyle === 'blue')
                  .map((card) => {
                    const isBookmarked = savedIds.includes(card.id)
                    return (
                      <div
                        key={card.id}
                        style={{
                          backgroundColor: '#3C5BFF',
                          color: '#FFFFFF',
                          borderRadius: 24,
                          padding: '18px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 10px 24px rgba(60,91,255,0.22)',
                        }}
                      >
                        <div>
                          {/* Tag */}
                          <div style={{ marginBottom: 10 }}>
                            <span
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.25)',
                                color: '#FFFFFF',
                                borderRadius: 9999,
                                padding: '3px 10px',
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                backdropFilter: 'blur(4px)',
                              }}
                            >
                              {card.tag}
                            </span>
                          </div>

                          {/* Content Row */}
                          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                            <div style={{ flex: 1 }}>
                              <h3
                                style={{
                                  margin: '0 0 6px',
                                  fontSize: 18,
                                  fontWeight: 900,
                                  color: '#FFFFFF',
                                  letterSpacing: '-0.02em',
                                }}
                              >
                                {card.title}
                              </h3>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12,
                                  color: 'rgba(255,255,255,0.9)',
                                  lineHeight: 1.45,
                                }}
                              >
                                {card.excerpt}
                              </p>
                            </div>

                            {/* Image */}
                            {card.imageSrc && (
                              <div
                                style={{
                                  width: 120,
                                  height: 96,
                                  borderRadius: 16,
                                  overflow: 'hidden',
                                  position: 'relative',
                                  flexShrink: 0,
                                  border: '1.5px solid rgba(255,255,255,0.3)',
                                }}
                              >
                                <Image
                                  src={card.imageSrc}
                                  alt={card.title}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Date and Time */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 11,
                              color: 'rgba(255,255,255,0.75)',
                              marginBottom: 14,
                              fontWeight: 600,
                            }}
                          >
                            <Clock width={12} height={12} />
                            <span>{card.dateFormatted}</span>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            flexWrap: 'wrap',
                            paddingTop: 8,
                            borderTop: '1px solid rgba(255,255,255,0.2)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleLike(card.id)}
                            style={{
                              backgroundColor: card.isLiked ? '#FA78B9' : '#FFFFFF',
                              color: '#111111',
                              border: 'none',
                              borderRadius: 9999,
                              padding: '5px 14px',
                              fontSize: 11,
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                            }}
                          >
                            <Heart width={12} height={12} fill={card.isLiked ? '#111111' : 'none'} />
                            <span>Liked {card.likesCount}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveCommentItem(card)}
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#111111',
                              border: 'none',
                              borderRadius: 9999,
                              padding: '5px 14px',
                              fontSize: 11,
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                            }}
                          >
                            <MessageSquare width={12} height={12} />
                            <span>Comments {card.commentsCount}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleRsvp(card.id)}
                            style={{
                              backgroundColor: card.isRsvp ? '#D5FF38' : '#FFFFFF',
                              color: '#111111',
                              border: 'none',
                              borderRadius: 9999,
                              padding: '5px 14px',
                              fontSize: 11,
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                            }}
                          >
                            <span>{card.isRsvp ? '✓ RSVP’d' : 'RSVP 0'}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}

                {/* Card 4: Campus Recruitment Drive (Acid-Lime Green) */}
                {displayedCards
                  .filter((c) => c.bgStyle === 'lime')
                  .map((card) => {
                    const isBookmarked = savedIds.includes(card.id)
                    return (
                      <div
                        key={card.id}
                        style={{
                          backgroundColor: '#D5FF38',
                          color: '#111111',
                          borderRadius: 24,
                          padding: '18px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 10px 24px rgba(213,255,56,0.22)',
                        }}
                      >
                        <div>
                          {/* Tag */}
                          <div style={{ marginBottom: 10 }}>
                            <span
                              style={{
                                backgroundColor: '#FFFFFF',
                                color: '#111111',
                                borderRadius: 9999,
                                padding: '3px 10px',
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              {card.tag}
                            </span>
                          </div>

                          {/* Content Row */}
                          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                            <div style={{ flex: 1 }}>
                              <h3
                                style={{
                                  margin: '0 0 6px',
                                  fontSize: 18,
                                  fontWeight: 900,
                                  color: '#111111',
                                  letterSpacing: '-0.02em',
                                }}
                              >
                                {card.title}
                              </h3>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 12,
                                  color: '#374151',
                                  lineHeight: 1.45,
                                }}
                              >
                                {card.excerpt}
                              </p>
                            </div>

                            {/* Image */}
                            {card.imageSrc && (
                              <div
                                style={{
                                  width: 120,
                                  height: 96,
                                  borderRadius: 16,
                                  overflow: 'hidden',
                                  position: 'relative',
                                  flexShrink: 0,
                                  border: '1.5px solid #111111',
                                }}
                              >
                                <Image
                                  src={card.imageSrc}
                                  alt={card.title}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Date and Time */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 11,
                              color: '#4B5563',
                              marginBottom: 14,
                              fontWeight: 700,
                            }}
                          >
                            <Clock width={12} height={12} />
                            <span>{card.dateFormatted}</span>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            flexWrap: 'wrap',
                            paddingTop: 8,
                            borderTop: '1px solid rgba(0,0,0,0.1)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleLike(card.id)}
                            style={{
                              backgroundColor: card.isLiked ? '#FA78B9' : '#FFFFFF',
                              color: '#111111',
                              border: 'none',
                              borderRadius: 9999,
                              padding: '5px 14px',
                              fontSize: 11,
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                            }}
                          >
                            <Heart width={12} height={12} fill={card.isLiked ? '#111111' : 'none'} />
                            <span>Liked {card.likesCount}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveCommentItem(card)}
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#111111',
                              border: 'none',
                              borderRadius: 9999,
                              padding: '5px 14px',
                              fontSize: 11,
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                            }}
                          >
                            <MessageSquare width={12} height={12} />
                            <span>Comments {card.commentsCount}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Row 3: 3 Clean White Cards (Mid Sem Exam, Library Timings, Workshop on AI & ML) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                }}
              >
                {displayedCards
                  .filter((c) => c.bgStyle === 'white')
                  .map((card) => {
                    const isBookmarked = savedIds.includes(card.id)
                    return (
                      <div
                        key={card.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#111111',
                          borderRadius: 20,
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          border: '1.5px solid #E5E7EB',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div>
                          {/* Tag */}
                          <div style={{ marginBottom: 8 }}>
                            <span
                              style={{
                                backgroundColor: '#F3F4F6',
                                color: '#374151',
                                borderRadius: 9999,
                                padding: '2px 9px',
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              {card.tag}
                            </span>
                          </div>

                          {/* Title & Excerpt with Right Thumbnail */}
                          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                            <div style={{ flex: 1 }}>
                              <h4
                                style={{
                                  margin: '0 0 4px',
                                  fontSize: 14,
                                  fontWeight: 900,
                                  color: '#111111',
                                  lineHeight: 1.25,
                                }}
                              >
                                {card.title}
                              </h4>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 11,
                                  color: '#6B7280',
                                  lineHeight: 1.4,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {card.excerpt}
                              </p>
                            </div>

                            {/* Thumbnail */}
                            {card.imageSrc && (
                              <div
                                style={{
                                  width: 64,
                                  height: 52,
                                  borderRadius: 12,
                                  overflow: 'hidden',
                                  position: 'relative',
                                  flexShrink: 0,
                                  border: '1px solid #E5E7EB',
                                }}
                              >
                                <Image
                                  src={card.imageSrc}
                                  alt={card.title}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Date and Time */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                              fontSize: 10,
                              color: '#9CA3AF',
                              marginBottom: 12,
                              fontWeight: 600,
                            }}
                          >
                            <Clock width={11} height={11} />
                            <span>{card.dateFormatted}</span>
                          </div>
                        </div>

                        {/* Bottom Actions Row */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 8,
                            borderTop: '1px solid #F3F4F6',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {/* Like Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleLike(card.id)}
                              style={{
                                backgroundColor: card.isLiked ? '#FA78B9' : '#F3F4F6',
                                color: '#111111',
                                border: 'none',
                                borderRadius: 9999,
                                padding: '4px 10px',
                                fontSize: 11,
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <Heart width={11} height={11} fill={card.isLiked ? '#111111' : 'none'} />
                              <span>Like {card.likesCount}</span>
                            </button>

                            {/* Comments Button */}
                            <button
                              type="button"
                              onClick={() => setActiveCommentItem(card)}
                              style={{
                                backgroundColor: '#F3F4F6',
                                color: '#111111',
                                border: 'none',
                                borderRadius: 9999,
                                padding: '4px 10px',
                                fontSize: 11,
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <MessageSquare width={11} height={11} />
                              <span>{card.commentsCount}</span>
                            </button>
                          </div>

                          {/* Bookmark Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleBookmark(card.id, card.title)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              color: isBookmarked ? '#111111' : '#9CA3AF',
                              padding: 4,
                            }}
                            title="Save bookmark"
                          >
                            <Bookmark width={14} height={14} fill={isBookmarked ? '#111111' : 'none'} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Empty state if search or filter yielded nothing */}
              {displayedCards.length === 0 && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: '48px 24px',
                    textAlign: 'center',
                    border: '1.5px dashed #D1D5DB',
                  }}
                >
                  <Sparkles width={32} height={32} color="#9CA3AF" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 6px' }}>No notices match your criteria</h3>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>
                    Try adjusting your search terms or resetting the filter chips.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter('#all')
                      setSearchQuery('')
                    }}
                    style={{
                      backgroundColor: '#111111',
                      color: '#D5FF38',
                      border: 'none',
                      borderRadius: 9999,
                      padding: '8px 20px',
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* ======================================================
              RIGHT COLUMN: 4 ACTIVITY & WIDGET PANELS
             ====================================================== */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* PANEL 1: Upcoming Events (Acid-Lime Green Card) */}
            <div
              style={{
                backgroundColor: '#D5FF38',
                color: '#111111',
                borderRadius: 24,
                padding: '18px 16px',
                boxShadow: '0 8px 20px rgba(213,255,56,0.22)',
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
                  <CalendarDays width={18} height={18} color="#111111" />
                  <span style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>
                    Upcoming Events
                  </span>
                </div>
                <Link
                  href="/student/calendar"
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#111111',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <span>View All</span>
                  <ArrowRight width={11} height={11} />
                </Link>
              </div>

              {/* 4 White Event Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  {
                    month: 'OCT',
                    day: '14',
                    title: 'Annual Cultural Fest',
                    subtitle: '12:00 PM • Main Auditorium',
                  },
                  {
                    month: 'OCT',
                    day: '16',
                    title: 'Placement Drive',
                    subtitle: '10:00 AM • Placement Cell',
                  },
                  {
                    month: 'OCT',
                    day: '20',
                    title: 'Workshop on AI & ML',
                    subtitle: '02:00 PM • CSE Seminar Hall',
                  },
                  {
                    month: 'OCT',
                    day: '25',
                    title: 'Garba Night',
                    subtitle: '07:00 PM • College Ground',
                  },
                ].map((ev, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: ev.title,
                        message: `Scheduled for ${ev.month} ${ev.day}: ${ev.subtitle}`,
                      })
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 14,
                      padding: '9px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      transition: 'transform 0.12s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Date Badge */}
                      <div
                        style={{
                          textAlign: 'center',
                          minWidth: 34,
                          lineHeight: 1.1,
                          paddingRight: 6,
                          borderRight: '1.5px solid #F3F4F6',
                        }}
                      >
                        <div style={{ fontSize: 9, fontWeight: 900, color: '#6B7280' }}>{ev.month}</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: '#111111' }}>{ev.day}</div>
                      </div>

                      {/* Info */}
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#111111', lineHeight: 1.2 }}>
                          {ev.title}
                        </div>
                        <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>
                          {ev.subtitle}
                        </div>
                      </div>
                    </div>

                    <ChevronRight width={14} height={14} color="#9CA3AF" />
                  </div>
                ))}
              </div>
            </div>

            {/* PANEL 2: Quick Actions (Pitch-Black Card with 4 colorful buttons) */}
            <div
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 24,
                padding: '18px 16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Sparkles width={16} height={16} color="#D5FF38" />
                <span style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF' }}>
                  Quick Actions
                </span>
              </div>

              {/* 2x2 Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {/* 1. Browse Events (Lime) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('#event')
                    setActiveNav('Events')
                    addToast({ type: 'info', title: 'Events Filter', message: 'Displaying all upcoming campus events.' })
                  }}
                  style={{
                    backgroundColor: '#D5FF38',
                    color: '#111111',
                    borderRadius: 14,
                    padding: '12px 10px',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(213,255,56,0.2)',
                  }}
                >
                  <Calendar width={16} height={16} color="#111111" />
                  <span style={{ fontSize: 11, fontWeight: 900, textAlign: 'left', lineHeight: 1.2 }}>
                    Browse Events
                  </span>
                </button>

                {/* 2. View Placements (Pink) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('#placement')
                    setActiveNav('Placements')
                    addToast({ type: 'info', title: 'Placements Filter', message: 'Displaying recruitment notices and pre-placement drives.' })
                  }}
                  style={{
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    borderRadius: 14,
                    padding: '12px 10px',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(250,120,185,0.2)',
                  }}
                >
                  <Briefcase width={16} height={16} color="#111111" />
                  <span style={{ fontSize: 11, fontWeight: 900, textAlign: 'left', lineHeight: 1.2 }}>
                    View Placements
                  </span>
                </button>

                {/* 3. Academic Notices (Electric Blue) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('#academic')
                    setActiveNav('Academic')
                    addToast({ type: 'info', title: 'Academic Filter', message: 'Displaying syllabus, exams, and timetable updates.' })
                  }}
                  style={{
                    backgroundColor: '#3C5BFF',
                    color: '#FFFFFF',
                    borderRadius: 14,
                    padding: '12px 10px',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(60,91,255,0.2)',
                  }}
                >
                  <GraduationCap width={16} height={16} color="#FFFFFF" />
                  <span style={{ fontSize: 11, fontWeight: 900, textAlign: 'left', lineHeight: 1.2 }}>
                    Academic Notices
                  </span>
                </button>

                {/* 4. My Bookmarks (White) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('Bookmarked')
                    addToast({ type: 'info', title: 'Saved Bookmarks', message: `Filtered to ${savedIds.length} bookmarked items.` })
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#111111',
                    borderRadius: 14,
                    padding: '12px 10px',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  <Bookmark width={16} height={16} color="#111111" />
                  <span style={{ fontSize: 11, fontWeight: 900, textAlign: 'left', lineHeight: 1.2 }}>
                    My Bookmarks
                  </span>
                </button>
              </div>
            </div>

            {/* PANEL 3: My Activity (White Card with 3 event history rows) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: '18px 16px',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
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
                  <User width={16} height={16} color="#111111" />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>
                    My Activity
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNav('My Activity')}
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#6B7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <span>View All</span>
                  <ArrowRight width={11} height={11} />
                </button>
              </div>

              {/* 3 Activity Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  {
                    iconColor: '#FA78B9',
                    type: 'New announcement',
                    title: 'Garba Night',
                    time: '2 hours ago',
                  },
                  {
                    iconColor: '#D5FF38',
                    type: 'Event update',
                    title: 'Placement Drive',
                    time: '5 hours ago',
                  },
                  {
                    iconColor: '#3C5BFF',
                    type: 'Notice published',
                    title: 'Mid Sem Exam Schedule',
                    time: '1 day ago',
                  },
                ].map((act, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: act.title,
                        message: `${act.type} • ${act.time}`,
                      })
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: act.iconColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Sparkles width={14} height={14} color="#111111" />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>{act.type}</div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: '#111111' }}>{act.title}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 10, color: '#9CA3AF', whiteSpace: 'nowrap' }}>{act.time}</span>
                      <ChevronRight width={12} height={12} color="#9CA3AF" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PANEL 4: Trending Tags (White Card) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: '18px 16px',
                border: '1.5px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp width={16} height={16} color="#111111" />
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#111111' }}>
                    Trending Tags
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('#all')
                    addToast({ type: 'info', title: 'Trending Tags', message: 'Click any tag chip below to filter relevant notices.' })
                  }}
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#6B7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <span>View All</span>
                  <ArrowRight width={11} height={11} />
                </button>
              </div>

              {/* Tag Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Row 1: Pink, Lime, Electric Blue */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('#exams')}
                    style={{
                      backgroundColor: '#FA78B9',
                      color: '#111111',
                      borderRadius: 9999,
                      padding: '4px 12px',
                      fontSize: 11,
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    #exams
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('#placements')}
                    style={{
                      backgroundColor: '#D5FF38',
                      color: '#111111',
                      borderRadius: 9999,
                      padding: '4px 12px',
                      fontSize: 11,
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    #placements
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('#cultural')}
                    style={{
                      backgroundColor: '#3C5BFF',
                      color: '#FFFFFF',
                      borderRadius: 9999,
                      padding: '4px 12px',
                      fontSize: 11,
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    #cultural
                  </button>
                </div>

                {/* Row 2: Subtle Pills */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('#workshop')}
                    style={{
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                      borderRadius: 9999,
                      padding: '4px 12px',
                      fontSize: 11,
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    #workshop
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('#scholarship')}
                    style={{
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                      borderRadius: 9999,
                      padding: '4px 12px',
                      fontSize: 11,
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    #scholarship
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('#hostel')}
                    style={{
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                      borderRadius: 9999,
                      padding: '4px 12px',
                      fontSize: 11,
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    #hostel
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ========================================================
          MODAL: INTERACTIVE COMMENTS DRAWER / DIALOG
         ======================================================== */}
      {activeCommentItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 16,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setActiveCommentItem(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              border: '2px solid #111111',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: 500,
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#6B7280' }}>
                  {activeCommentItem.tag}
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 900 }}>
                  {activeCommentItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCommentItem(null)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X width={18} height={18} />
              </button>
            </div>

            {/* Comment List */}
            <div
              style={{
                maxHeight: 260,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 16,
                paddingRight: 4,
              }}
            >
              {activeCommentItem.comments && activeCommentItem.comments.length > 0 ? (
                activeCommentItem.comments.map((cm, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      borderRadius: 14,
                      padding: '10px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 900, color: '#111111' }}>{cm.author}</span>
                      <span style={{ fontSize: 10, color: '#9CA3AF' }}>{cm.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: '#374151', lineHeight: 1.4 }}>{cm.text}</p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#9CA3AF', fontSize: 13 }}>
                  No comments yet. Start the conversation!
                </div>
              )}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: '#F3F4F6',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  border: '1.5px solid #111111',
                  borderRadius: 9999,
                  padding: '10px 20px',
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: READING STREAK DETAILS
         ======================================================== */}
      {readingStreakModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 16,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setReadingStreakModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              border: '2px solid #111111',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              width: '100%',
              maxWidth: 420,
              padding: 24,
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 44, marginBottom: 8 }}>🔥</div>
            <h3 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 6px' }}>7 Day Reading Streak!</h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 20px' }}>
              You have checked verified campus announcements every day for the past 7 days. Excellent work staying ahead of deadlines!
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 20,
              }}
            >
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div
                  key={i}
                  style={{
                    width: 38,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: '#D5FF38',
                    border: '1.5px solid #111111',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 800 }}>{day}</span>
                  <span style={{ fontSize: 13, fontWeight: 900 }}>✓</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setReadingStreakModalOpen(false)}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#D5FF38',
                borderRadius: 9999,
                padding: '12px',
                fontSize: 14,
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Keep Streak Going
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
