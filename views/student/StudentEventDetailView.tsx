'use client'

import React, { useState, useEffect, useMemo } from 'react'
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
  ArrowLeft,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Music,
  Camera,
  Gift,
  Utensils,
  Sparkles,
  Mail,
  ChevronRight,
  X,
  Check,
  Building2,
  Flame,
  Award,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface EventDetailData {
  id: string
  title: string
  subtitle: string
  category: string
  tag: string
  publisher: {
    name: string
    isVerified: boolean
    organizerGroup: string
  }
  heroBanner: {
    line1: string
    line2: string
    tagsPill: string
    imageSrc: string
  }
  quickInfo: {
    date: string
    dayOfWeek: string
    time: string
    duration: string
    venue: string
    campusArea: string
    eventType: string
    eligibility: string
  }
  description: string
  highlights: {
    icon: string
    label: string
    color: string
    bgColor: string
  }[]
  schedule: {
    time: string
    dotColor: string
    activity: string
  }[]
  registration: {
    registeredCount: number
    totalCapacity: number
    percentage: number
    isFree: boolean
  }
  countdown: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  organizers: {
    name: string
    role: string
    isVerified?: boolean
    email: string
    avatarSrc?: string
    isTeam?: boolean
  }[]
  relatedEvents: {
    id: string
    title: string
    date: string
    imageSrc: string
  }[]
}

const defaultEventData: EventDetailData = {
  id: 'garba-night-2026',
  title: 'Garba Night 2026',
  subtitle: 'Join us for a vibrant evening of music, dance and cultural celebration.',
  category: 'Cultural',
  tag: 'FEATURED EVENT',
  publisher: {
    name: 'Cultural Committee',
    isVerified: true,
    organizerGroup: 'Organized by Student Council',
  },
  heroBanner: {
    line1: 'GARBA',
    line2: 'NIGHT',
    tagsPill: 'DANCE • MUSIC • CULTURE',
    imageSrc: '/images/garba_night.jpg',
  },
  quickInfo: {
    date: '15 Oct 2026',
    dayOfWeek: 'Thursday',
    time: '07:00 PM - 11:00 PM',
    duration: '4 hours',
    venue: 'College Ground',
    campusArea: 'Main Campus',
    eventType: 'Cultural Event',
    eligibility: 'Open to All',
  },
  description:
    'Join us for an unforgettable evening of Garba Night 2026! Experience the joy of traditional dance, vibrant music, delicious food and a celebration of our rich cultural heritage. Open to all students, faculty and staff. Come dressed in your best traditional attire and be a part of this exciting event!',
  highlights: [
    {
      icon: '🎵',
      label: 'Live DJ & Music',
      color: '#DB2777',
      bgColor: '#FCE7F3',
    },
    {
      icon: '💃',
      label: 'Traditional Garba',
      color: '#65A30D',
      bgColor: '#ECFCCB',
    },
    {
      icon: '🍲',
      label: 'Food Stalls',
      color: '#0284C7',
      bgColor: '#E0F2FE',
    },
    {
      icon: '🎁',
      label: 'Exciting Prizes',
      color: '#E11D48',
      bgColor: '#FFE4E6',
    },
    {
      icon: '📸',
      label: 'Photo Booth',
      color: '#7C3AED',
      bgColor: '#EDE9FE',
    },
  ],
  schedule: [
    {
      time: '07:00 PM',
      dotColor: '#D5FF38',
      activity: 'Registration & Entry',
    },
    {
      time: '07:30 PM',
      dotColor: '#FA78B9',
      activity: 'Opening Ceremony',
    },
    {
      time: '08:00 PM',
      dotColor: '#A855F7',
      activity: 'Garba & Dance Sessions',
    },
    {
      time: '10:30 PM',
      dotColor: '#A855F7',
      activity: 'Prize Distribution',
    },
    {
      time: '11:00 PM',
      dotColor: '#D5FF38',
      activity: 'Event Closing',
    },
  ],
  registration: {
    registeredCount: 320,
    totalCapacity: 500,
    percentage: 64,
    isFree: true,
  },
  countdown: {
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 18,
  },
  organizers: [
    {
      name: 'Cultural Committee',
      role: 'Student Council',
      isVerified: true,
      email: 'cultural@drait.edu.in',
      isTeam: true,
    },
    {
      name: 'Ayesha Khan',
      role: 'Event Coordinator',
      email: 'ayesha.k@drait.edu.in',
      avatarSrc: '/images/mateen_avatar.jpg',
    },
    {
      name: 'Dr. Rahul Mehta',
      role: 'Faculty Advisor',
      email: 'rahul.mehta@drait.edu.in',
      avatarSrc: '/images/recruitment_interview.jpg',
    },
  ],
  relatedEvents: [
    {
      id: 'tech-fest-2026',
      title: 'Tech Fest 2026',
      date: '28 Oct 2026',
      imageSrc: '/images/ai_workshop.jpg',
    },
    {
      id: 'sports-day-2026',
      title: 'Sports Day',
      date: '12 Nov 2026',
      imageSrc: '/images/sports_stadium.jpg',
    },
    {
      id: 'music-concert-2026',
      title: 'Music Concert',
      date: '20 Nov 2026',
      imageSrc: '/images/cultural_fest.jpg',
    },
  ],
}

export function StudentEventDetailView({ eventId }: { eventId?: string }) {
  const router = useRouter()
  const { savedIds, toggleSave, addToast } = useStore()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isFullScheduleModalOpen, setIsFullScheduleModalOpen] = useState(false)
  const [eventData, setEventData] = useState<EventDetailData>(defaultEventData)
  const [activeTab, setActiveTab] = useState<'Overview' | 'Schedule' | 'Gallery' | 'Organizers' | 'FAQs'>('Overview')
  const [isRegistered, setIsRegistered] = useState(false)

  // Live ticking countdown timer
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 18,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Check if saved in store
  const isSaved = savedIds.includes(eventData.id)

  // Toggle Save
  const handleToggleSave = () => {
    toggleSave(eventData.id)
    addToast({
      type: isSaved ? 'info' : 'success',
      title: isSaved ? 'Removed from Bookmarks' : 'Event Bookmarked',
      message: isSaved
        ? `Removed "${eventData.title}" from your saved events.`
        : `Saved "${eventData.title}" to your bookmarked calendar.`,
    })
  }

  // Handle Share
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      addToast({
        type: 'success',
        title: 'Event Link Copied',
        message: 'Direct invite link copied to your clipboard.',
      })
    }
  }

  // Handle Register
  const handleRegister = () => {
    if (isRegistered) {
      setIsRegistered(false)
      setEventData((prev) => ({
        ...prev,
        registration: {
          ...prev.registration,
          registeredCount: prev.registration.registeredCount - 1,
          percentage: Math.round(((prev.registration.registeredCount - 1) / prev.registration.totalCapacity) * 100),
        },
      }))
      addToast({
        type: 'info',
        title: 'Registration Cancelled',
        message: `Your pass for "${eventData.title}" has been cancelled.`,
      })
    } else {
      setIsRegistered(true)
      setEventData((prev) => ({
        ...prev,
        registration: {
          ...prev.registration,
          registeredCount: prev.registration.registeredCount + 1,
          percentage: Math.round(((prev.registration.registeredCount + 1) / prev.registration.totalCapacity) * 100),
        },
      }))
      addToast({
        type: 'success',
        title: 'Registered Successfully! 🎉',
        message: `Your entry pass for ${eventData.title} is confirmed. See you on ${eventData.quickInfo.date}!`,
      })
    }
  }

  // Handle Related Event Click
  const handleRelatedClick = (item: { id: string; title: string; date: string }) => {
    addToast({
      type: 'info',
      title: 'Opening Event',
      message: `Loading "${item.title}"`,
    })
    setEventData((prev) => ({
      ...prev,
      id: item.id,
      title: item.title,
      subtitle: `Official campus event: ${item.title}. Mark your calendar for ${item.date}.`,
      quickInfo: {
        ...prev.quickInfo,
        date: item.date,
      },
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
              placeholder="Search events, announcements, placements, academic notices..."
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
                  <span style={{ fontWeight: 800, fontSize: 13 }}>Notifications (3)</span>
                  <span style={{ fontSize: 11, color: '#D5FF38', cursor: 'pointer' }}>
                    Mark all read
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div
                    style={{
                      padding: '8px 10px',
                      backgroundColor: '#1A1A1A',
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#D5FF38' }}>Garba Night Pass</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11 }}>
                      Registration closes when 500 cap is reached.
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '8px 10px',
                      backgroundColor: '#1A1A1A',
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>Tech Fest Keynote</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11 }}>
                      Schedule published by CSE Department.
                    </div>
                  </div>
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

              {/* 4. Events (ACTIVE: Bright Acid-Lime Pill in this screen!) */}
              <button
                type="button"
                onClick={() => router.push('/student/calendar')}
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
                <CalendarDays width={17} height={17} strokeWidth={2.5} />
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

        {/* COLUMN 2: CENTER EVENT DETAILS */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Back to Events Link */}
          <div>
            <button
              type="button"
              onClick={() => router.push('/student/calendar')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: '#111111',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                padding: 0,
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <ArrowLeft width={15} height={15} strokeWidth={2.5} />
              <span>Back to Events</span>
            </button>
          </div>

          {/* Tag Pills Row (Hot Pink FEATURED EVENT + CULTURAL) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                backgroundColor: '#FA78B9',
                color: '#111111',
                fontSize: 11,
                fontWeight: 950,
                padding: '4px 12px',
                borderRadius: 9999,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
              }}
            >
              <span>🏷️</span>
              <span>{eventData.tag}</span>
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                color: '#111111',
                border: '1px solid #E5E7EB',
                fontSize: 11,
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: 9999,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
              }}
            >
              {eventData.category}
            </span>
          </div>

          {/* Massive Event Title */}
          <h1
            style={{
              fontSize: 44,
              fontWeight: 950,
              letterSpacing: -1.2,
              color: '#111111',
              margin: '0',
              lineHeight: 1.1,
            }}
          >
            {eventData.title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 14,
              color: '#4B5563',
              lineHeight: 1.5,
              margin: '0',
              fontWeight: 500,
            }}
          >
            {eventData.subtitle}
          </p>

          {/* Publisher Row + Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
              paddingBottom: 4,
            }}
          >
            {/* Publisher / Organizer Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  backgroundColor: '#111111',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Music width={20} height={20} color="#D5FF38" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 950, color: '#111111' }}>
                    {eventData.publisher.name}
                  </span>
                  {eventData.publisher.isVerified && (
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: '#3B82F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check width={10} height={10} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
                  {eventData.publisher.organizerGroup}
                </div>
              </div>
            </div>

            {/* Right: Save, Share, and Register Now Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Save Button */}
              <button
                type="button"
                onClick={handleToggleSave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: isSaved ? '#111111' : '#FFFFFF',
                  color: isSaved ? '#D5FF38' : '#111111',
                  border: '1px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '9px 18px',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Bookmark width={15} height={15} fill={isSaved ? '#D5FF38' : 'none'} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  border: '1px solid #E5E7EB',
                  borderRadius: 9999,
                  padding: '9px 18px',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Share2 width={15} height={15} strokeWidth={2.2} />
                <span>Share</span>
              </button>

              {/* Register Now Button (Acid-Lime) */}
              <button
                type="button"
                onClick={handleRegister}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: isRegistered ? '#111111' : '#D5FF38',
                  color: isRegistered ? '#D5FF38' : '#111111',
                  border: 'none',
                  borderRadius: 9999,
                  padding: '10px 22px',
                  fontSize: 13,
                  fontWeight: 950,
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(213,255,56,0.3)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{isRegistered ? 'Registered ✓' : 'Register Now'}</span>
                <ArrowRight width={15} height={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* EVENT HERO BANNER CARD (BLACK TITLE HALF + PHOTOGRAPHIC HALF) */}
          <div
            style={{
              borderRadius: 24,
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr 1.35fr',
              minHeight: 220,
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              border: '1px solid #111111',
            }}
          >
            {/* Left Box (Pitch Black with Doodle Rays + Bold Garba Night) */}
            <div
              style={{
                backgroundColor: '#111111',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Radiating Doodle Rays */}
              <svg
                width="36"
                height="24"
                viewBox="0 0 36 24"
                fill="none"
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 28,
                }}
              >
                <path d="M4 20L1 10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 16L18 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 20L35 10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </svg>

              <div
                style={{
                  fontSize: 36,
                  fontWeight: 950,
                  lineHeight: 1.05,
                  letterSpacing: -0.8,
                  marginBottom: 14,
                }}
              >
                <div style={{ color: '#FFFFFF' }}>GARBA</div>
                <div style={{ color: '#D5FF38' }}>NIGHT</div>
              </div>

              <div>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    fontSize: 10,
                    fontWeight: 950,
                    padding: '4px 12px',
                    borderRadius: 9999,
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {eventData.heroBanner.tagsPill}
                </span>
              </div>
            </div>

            {/* Right Photo Banner */}
            <div
              style={{
                position: 'relative',
                minHeight: 220,
                width: '100%',
              }}
            >
              <Image
                src={eventData.heroBanner.imageSrc}
                alt={eventData.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* 4 QUICK INFO CARDS ROW */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
            }}
          >
            {/* Card 1: Date */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                padding: '14px 14px',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
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
                  flexShrink: 0,
                }}
              >
                <Calendar width={18} height={18} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Date</div>
                <div style={{ fontSize: 13, fontWeight: 950, color: '#111111', lineHeight: 1.2 }}>
                  {eventData.quickInfo.date}
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                  {eventData.quickInfo.dayOfWeek}
                </div>
              </div>
            </div>

            {/* Card 2: Time */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                padding: '14px 14px',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: '#FCE7F3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DB2777',
                  flexShrink: 0,
                }}
              >
                <Clock width={18} height={18} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Time</div>
                <div style={{ fontSize: 12, fontWeight: 950, color: '#111111', lineHeight: 1.2 }}>
                  {eventData.quickInfo.time}
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                  {eventData.quickInfo.duration}
                </div>
              </div>
            </div>

            {/* Card 3: Venue */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                padding: '14px 14px',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: '#CCFBF1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0D9488',
                  flexShrink: 0,
                }}
              >
                <MapPin width={18} height={18} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Venue</div>
                <div style={{ fontSize: 13, fontWeight: 950, color: '#111111', lineHeight: 1.2 }}>
                  {eventData.quickInfo.venue}
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                  {eventData.quickInfo.campusArea}
                </div>
              </div>
            </div>

            {/* Card 4: Event Type */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                padding: '14px 14px',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: '#EDE9FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                  flexShrink: 0,
                }}
              >
                <Users width={18} height={18} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Event Type</div>
                <div style={{ fontSize: 13, fontWeight: 950, color: '#111111', lineHeight: 1.2 }}>
                  {eventData.quickInfo.eventType}
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                  {eventData.quickInfo.eligibility}
                </div>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION BAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '1px solid #E5E7EB',
              paddingBottom: 4,
            }}
          >
            {(['Overview', 'Schedule', 'Gallery', 'Organizers', 'FAQs'] as const).map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    backgroundColor: isActive ? '#111111' : '#FFFFFF',
                    color: isActive ? '#D5FF38' : '#6B7280',
                    border: '1px solid',
                    borderColor: isActive ? '#111111' : '#E5E7EB',
                    borderRadius: 9999,
                    padding: '8px 18px',
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* EVENT DESCRIPTION SECTION */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 950,
                color: '#111111',
                letterSpacing: -0.3,
                margin: '4px 0 0 0',
              }}
            >
              Event Description
            </h2>

            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
              {eventData.description}
            </p>

            {/* 5 FEATURE HIGHLIGHT PILLS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
              {eventData.highlights.map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: h.bgColor,
                    color: '#111111',
                    borderRadius: 9999,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 850,
                  }}
                >
                  <span style={{ fontSize: 13 }}>{h.icon}</span>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* EVENT SCHEDULE SECTION */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
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
                  color: '#111111',
                  letterSpacing: -0.3,
                  margin: 0,
                }}
              >
                Event Schedule
              </h2>
              <button
                type="button"
                onClick={() => setIsFullScheduleModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#111111',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>View Full Schedule</span>
                <ArrowRight width={13} height={13} />
              </button>
            </div>

            {/* Schedule Timeline Rows */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '16px 20px',
                border: '1px solid #E5E7EB',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              {eventData.schedule.map((slot, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontWeight: 800, color: '#6B7280', minWidth: 70 }}>
                    {slot.time}
                  </span>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: slot.dotColor,
                      flexShrink: 0,
                      boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                    }}
                  />
                  <span style={{ fontWeight: 850, color: '#111111' }}>
                    {slot.activity}
                  </span>
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
          {/* WIDGET 1: EVENT REGISTRATION (YELLOW / LIME ACCENT CARD) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              border: '1px solid #E5E7EB',
            }}
          >
            {/* Bright Lime Header */}
            <div
              style={{
                backgroundColor: '#D5FF38',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <TicketIcon />
              <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                Event Registration
              </span>
            </div>

            {/* Registration Progress & CTA */}
            <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 12,
                }}
              >
                <span style={{ color: '#4B5563', fontWeight: 700 }}>
                  {eventData.registration.registeredCount} / {eventData.registration.totalCapacity} registered
                </span>
                <span style={{ fontWeight: 950, color: '#111111' }}>
                  {eventData.registration.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  height: 7,
                  backgroundColor: '#E5E7EB',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${eventData.registration.percentage}%`,
                    backgroundColor: '#D5FF38',
                    borderRadius: 999,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              {/* Register Button */}
              <button
                type="button"
                onClick={handleRegister}
                style={{
                  width: '100%',
                  backgroundColor: '#111111',
                  color: isRegistered ? '#D5FF38' : '#FFFFFF',
                  borderRadius: 9999,
                  padding: '11px 18px',
                  fontSize: 13,
                  fontWeight: 950,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'background 0.15s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <span>{isRegistered ? 'Registered (Pass Confirmed ✓)' : 'Register Now'}</span>
                {!isRegistered && <ArrowRight width={14} height={14} />}
              </button>

              <div style={{ fontSize: 10, color: '#6B7280', textAlign: 'center', fontWeight: 600 }}>
                Registration is free. Open to all students.
              </div>
            </div>
          </div>

          {/* WIDGET 2: EVENT COUNTDOWN */}
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
                gap: 6,
                fontSize: 13,
                fontWeight: 950,
                color: '#111111',
                marginBottom: 12,
              }}
            >
              <Clock width={16} height={16} />
              <span>Event Countdown</span>
            </div>

            {/* 4 Countdown Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {/* Days */}
              <div
                style={{
                  backgroundColor: '#ECFCCB',
                  borderRadius: 14,
                  padding: '10px 4px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                  {String(countdown.days).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 10, color: '#65A30D', fontWeight: 700, marginTop: 2 }}>
                  Days
                </div>
              </div>

              {/* Hours */}
              <div
                style={{
                  backgroundColor: '#FCE7F3',
                  borderRadius: 14,
                  padding: '10px 4px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 10, color: '#DB2777', fontWeight: 700, marginTop: 2 }}>
                  Hours
                </div>
              </div>

              {/* Minutes */}
              <div
                style={{
                  backgroundColor: '#E0F2FE',
                  borderRadius: 14,
                  padding: '10px 4px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 10, color: '#0284C7', fontWeight: 700, marginTop: 2 }}>
                  Minutes
                </div>
              </div>

              {/* Seconds */}
              <div
                style={{
                  backgroundColor: '#EDE9FE',
                  borderRadius: 14,
                  padding: '10px 4px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 10, color: '#7C3AED', fontWeight: 700, marginTop: 2 }}>
                  Seconds
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 3: EVENT ORGANIZERS */}
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
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users width={16} height={16} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Event Organizers
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('Organizers')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 11,
                  fontWeight: 900,
                  color: '#111111',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>View All</span>
                <ArrowRight width={12} height={12} strokeWidth={2.5} />
              </button>
            </div>

            {/* List of 3 Organizers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {eventData.organizers.map((org, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {org.isTeam ? (
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          backgroundColor: '#111111',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#D5FF38',
                        }}
                      >
                        <Music width={17} height={17} />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <Image
                          src={org.avatarSrc || '/images/mateen_avatar.jpg'}
                          alt={org.name}
                          width={34}
                          height={34}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, color: '#111111' }}>
                          {org.name}
                        </span>
                        {org.isVerified && (
                          <div
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              backgroundColor: '#3B82F6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check width={9} height={9} color="#FFFFFF" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                        {org.role}
                      </div>
                    </div>
                  </div>

                  <a
                    href={`mailto:${org.email}`}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#F3F4F6',
                      border: '1px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4B5563',
                      textDecoration: 'none',
                    }}
                    title={`Contact ${org.name}`}
                  >
                    <Mail width={12} height={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 4: RELATED EVENTS */}
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
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Gift width={16} height={16} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Related Events
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push('/student/calendar')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 11,
                  fontWeight: 900,
                  color: '#111111',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>View All</span>
                <ArrowRight width={12} height={12} strokeWidth={2.5} />
              </button>
            </div>

            {/* List of 3 Related Events */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {eventData.relatedEvents.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleRelatedClick(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '8px 8px',
                    borderRadius: 14,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
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
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 850,
                          color: '#111111',
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, marginTop: 2 }}>
                        {item.date}
                      </div>
                    </div>
                  </div>

                  <ChevronRight width={15} height={15} color="#9CA3AF" />
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 5: NEED HELP? (SOFT LAVENDER CARD) */}
          <div
            style={{
              backgroundColor: '#EEF2FF',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #E0E7FF',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 950,
                color: '#111111',
                marginBottom: 6,
              }}
            >
              <Lightbulb width={16} height={16} color="#4F46E5" />
              <span>Need Help?</span>
            </div>

            <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Have questions about this event?
              <br />
              Contact the Cultural Committee.
            </p>

            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                color: '#111111',
                borderRadius: 9999,
                padding: '9px 16px',
                fontSize: 12,
                fontWeight: 900,
                border: '1px solid #D1D5DB',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <span>Contact Now</span>
              <ArrowRight width={13} height={13} />
            </button>
          </div>
        </aside>
      </div>

      {/* CONTACT ORGANIZER MODAL */}
      {isContactModalOpen && (
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
          onClick={() => setIsContactModalOpen(false)}
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
              onClick={() => setIsContactModalOpen(false)}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
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
                <Music width={20} height={20} color="#111111" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 950, color: '#111111', margin: 0 }}>
                  Contact Cultural Committee
                </h3>
                <div style={{ fontSize: 11, color: '#6B7280' }}>Student Council • Dr AIT</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 18 }}>
              For queries about Dandiya passes, parking permits, guest invitations, or dress code guidelines, contact the coordinators below:
            </div>

            <div
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 14,
                padding: '12px 16px',
                fontSize: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginBottom: 20,
              }}
            >
              <div>
                <span style={{ fontWeight: 800, color: '#111111' }}>Coordinator Desk: </span>
                <span style={{ color: '#4B5563' }}>Ayesha Khan (+91 98450 12345)</span>
              </div>
              <div>
                <span style={{ fontWeight: 800, color: '#111111' }}>Official Email: </span>
                <span style={{ color: '#2563EB', fontWeight: 700 }}>cultural@drait.edu.in</span>
              </div>
              <div>
                <span style={{ fontWeight: 800, color: '#111111' }}>Help Desk Location: </span>
                <span style={{ color: '#4B5563' }}>Student Council Room, Main Campus Ground</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsContactModalOpen(false)
                addToast({
                  type: 'success',
                  title: 'Message Sent',
                  message: 'Your query has been dispatched to the Cultural Committee team.',
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
              Send Direct Message
            </button>
          </div>
        </div>
      )}

      {/* FULL SCHEDULE MODAL */}
      {isFullScheduleModalOpen && (
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
          onClick={() => setIsFullScheduleModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 520,
              width: '100%',
              padding: 26,
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsFullScheduleModalOpen(false)}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#D5FF38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarDays width={18} height={18} color="#111111" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 950, color: '#111111', margin: 0 }}>
                  Garba Night 2026 — Master Schedule
                </h3>
                <div style={{ fontSize: 11, color: '#6B7280' }}>Thursday, 15 Oct 2026 • Main Campus Grounds</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 14, padding: '8px 12px', backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <span style={{ fontWeight: 900, color: '#111111', width: 75 }}>06:30 PM</span>
                <span style={{ color: '#4B5563' }}>Gates open & QR pass scanning</span>
              </div>
              <div style={{ display: 'flex', gap: 14, padding: '8px 12px', backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <span style={{ fontWeight: 900, color: '#111111', width: 75 }}>07:00 PM</span>
                <span style={{ color: '#4B5563' }}>Registration Desk & Dandiya Stick distribution</span>
              </div>
              <div style={{ display: 'flex', gap: 14, padding: '8px 12px', backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <span style={{ fontWeight: 900, color: '#111111', width: 75 }}>07:30 PM</span>
                <span style={{ color: '#4B5563' }}>Lamp lighting & opening address by Principal</span>
              </div>
              <div style={{ display: 'flex', gap: 14, padding: '8px 12px', backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <span style={{ fontWeight: 900, color: '#111111', width: 75 }}>08:00 PM</span>
                <span style={{ color: '#4B5563' }}>Traditional Folk Raas & Live Music Beats</span>
              </div>
              <div style={{ display: 'flex', gap: 14, padding: '8px 12px', backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <span style={{ fontWeight: 900, color: '#111111', width: 75 }}>10:30 PM</span>
                <span style={{ color: '#4B5563' }}>Best Dressed & Best Dancer Awards</span>
              </div>
              <div style={{ display: 'flex', gap: 14, padding: '8px 12px', backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <span style={{ fontWeight: 900, color: '#111111', width: 75 }}>11:00 PM</span>
                <span style={{ color: '#4B5563' }}>Aarti & Event Closing</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFullScheduleModalOpen(false)}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                padding: '10px 18px',
                borderRadius: 9999,
                fontWeight: 900,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Close Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function TicketIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  )
}
