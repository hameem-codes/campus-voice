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
  ArrowLeft,
  Share2,
  Download,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  Headphones,
  Paperclip,
  Check,
  Building2,
  X,
  FileSpreadsheet,
  Flame,
  FileDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface AnnouncementData {
  id: string
  title: string
  subtitle: string
  category: string
  badgeText: string
  publisher: {
    name: string
    isVerified: boolean
    type: string
    date: string
    time: string
  }
  featuredBanner: {
    headingLine1: string
    headingLine2: string
    tagline: string
    imageSrc: string
    imageTag: string
  }
  detailsContent: string
  importantNote: string
  keyInfo: {
    examType: string
    applicableTo: string
    examDate: string
    mode: string
    timings: string
    venue: string
  }
  instructions: string[]
  overview: {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    applicableTo: string
    mode: string
  }
  attachments: {
    name: string
    size: string
    type: 'pdf' | 'docx' | 'xlsx'
  }[]
  related: {
    id: string
    title: string
    date: string
    imageSrc: string
  }[]
}

const defaultAnnouncement: AnnouncementData = {
  id: 'mid-sem-exam-schedule-2026',
  title: 'Mid Semester Exam Schedule Released for All Departments',
  subtitle:
    'The mid semester examination schedule for all departments has been released. Please find the detailed dates, timings and instructions below.',
  category: 'Academic',
  badgeText: 'IMPORTANT',
  publisher: {
    name: 'Examination Cell',
    isVerified: true,
    type: 'Official Notice',
    date: '12 Oct 2026',
    time: '09:30 AM',
  },
  featuredBanner: {
    headingLine1: 'MID SEMESTER',
    headingLine2: 'EXAM SCHEDULE',
    tagline: 'NOW RELEASED',
    imageSrc: '/images/campus_building.jpg',
    imageTag: 'ALL DEPARTMENTS',
  },
  detailsContent:
    'The mid semester examinations for the current semester will be conducted as per the schedule mentioned below. All students are requested to carefully check their respective department schedules and follow the instructions.',
  importantNote:
    'Students must carry their valid college ID card and follow all examination guidelines.',
  keyInfo: {
    examType: 'Mid Semester Examination',
    applicableTo: 'All Departments',
    examDate: '20 Oct 2026 - 28 Oct 2026',
    mode: 'Offline (On Campus)',
    timings: '09:30 AM - 12:30 PM',
    venue: 'Respective Department Halls',
  },
  instructions: [
    'Carry your valid college ID card to the examination hall.',
    'Reach the examination hall at least 30 minutes before the scheduled time.',
    'Students are not allowed to carry any electronic devices.',
    'Follow all additional instructions provided by the invigilators.',
  ],
  overview: {
    startDate: '20 Oct 2026',
    endDate: '28 Oct 2026',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    applicableTo: 'All Departments',
    mode: 'On Campus',
  },
  attachments: [
    {
      name: 'Mid Semester Exam Schedule.pdf',
      size: '2.4 MB',
      type: 'pdf',
    },
    {
      name: 'Exam Guidelines.docx',
      size: '1.1 MB',
      type: 'docx',
    },
    {
      name: 'Room Allocation List.xlsx',
      size: '856 KB',
      type: 'xlsx',
    },
  ],
  related: [
    {
      id: 'end-sem-guidelines',
      title: 'End Semester Exam Guidelines',
      date: '05 Oct 2026',
      imageSrc: '/images/library_books.jpg',
    },
    {
      id: 'ia-marks-released',
      title: 'Internal Assessment Marks Released',
      date: '10 Oct 2026',
      imageSrc: '/images/recruitment_interview.jpg',
    },
    {
      id: 'reevaluation-details',
      title: 'Re-evaluation Process Details',
      date: '08 Oct 2026',
      imageSrc: '/images/campus_building.jpg',
    },
  ],
}

export function StudentAnnouncementDetailView({ noticeId }: { noticeId?: string }) {
  const router = useRouter()
  const { savedIds, toggleSave, addToast, updates } = useStore()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [announcement, setAnnouncement] = useState<AnnouncementData>(defaultAnnouncement)

  // Check if saved
  const isSaved = savedIds.includes(announcement.id)

  // Toggle Save
  const handleToggleSave = () => {
    toggleSave(announcement.id)
    addToast({
      type: isSaved ? 'info' : 'success',
      title: isSaved ? 'Removed from Bookmarks' : 'Announcement Saved',
      message: isSaved
        ? 'Removed announcement from your saved items.'
        : 'Saved this announcement to your bookmarks for quick reference.',
    })
  }

  // Handle Share
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      addToast({
        type: 'success',
        title: 'Share Link Copied',
        message: 'Direct link to this announcement copied to your clipboard.',
      })
    }
  }

  // Download attachment simulation
  const handleDownloadAttachment = (file: { name: string; size: string }) => {
    const content = `CAMPUSVOICE OFFICIAL ANNOUNCEMENT\n\nTitle: ${announcement.title}\nAttachment: ${file.name}\nPublished by: ${announcement.publisher.name}\nDate: ${announcement.publisher.date} ${announcement.publisher.time}\n\nKey Details:\n- Mode: ${announcement.keyInfo.mode}\n- Timings: ${announcement.keyInfo.timings}\n- Venue: ${announcement.keyInfo.venue}\n\nInstructions:\n${announcement.instructions.map((ins, i) => `${i + 1}. ${ins}`).join('\n')}`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    addToast({
      type: 'info',
      title: 'Downloading Attachment',
      message: `Downloaded ${file.name} (${file.size})`,
    })
  }

  // Download all attachments
  const handleDownloadAll = () => {
    announcement.attachments.forEach((file) => handleDownloadAttachment(file))
    addToast({
      type: 'success',
      title: 'All Attachments Downloaded',
      message: 'Downloaded all 3 official schedule documents.',
    })
  }

  // Handle Related Announcement Click
  const handleRelatedClick = (item: { id: string; title: string }) => {
    addToast({
      type: 'info',
      title: 'Opening Announcement',
      message: `Navigating to "${item.title}"`,
    })
    setAnnouncement((prev) => ({
      ...prev,
      id: item.id,
      title: item.title,
      subtitle: `Official guidance and procedure documentation regarding ${item.title.toLowerCase()}.`,
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

      {/* TOP NAVIGATION BAR */}
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
        {/* Left: Equalizer Logo & Brand */}
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

        {/* Center: Search Bar with ⌘ K */}
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

        {/* Right: Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Notifications */}
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
                    <div style={{ fontWeight: 700, color: '#D5FF38' }}>Exam Schedule Released</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11 }}>
                      Check room allocations and invigilation timetable.
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
                    <div style={{ fontWeight: 700 }}>Placement Drive Alert</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11 }}>
                      Google drive registration closes tomorrow.
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
                  color: '#FFFFFF',
                  fontWeight: 800,
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

        {/* COLUMN 2: CENTER ANNOUNCEMENT DETAILS */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Back to Announcements Link */}
          <div>
            <button
              type="button"
              onClick={() => router.push('/student')}
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
              <span>Back to Announcements</span>
            </button>
          </div>

          {/* Category Tag Pill */}
          <div>
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
              <span>📌</span>
              <span>{announcement.badgeText}</span>
            </span>
          </div>

          {/* Massive Heading */}
          <h1
            style={{
              fontSize: 38,
              fontWeight: 950,
              letterSpacing: -1,
              color: '#111111',
              margin: '0',
              lineHeight: 1.15,
            }}
          >
            {announcement.title}
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
            {announcement.subtitle}
          </p>

          {/* Publisher Row + Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
              paddingBottom: 6,
            }}
          >
            {/* Publisher Information */}
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
                <Building2 width={20} height={20} color="#D5FF38" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 950, color: '#111111' }}>
                    {announcement.publisher.name}
                  </span>
                  {announcement.publisher.isVerified && (
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
                  {announcement.publisher.type} • {announcement.publisher.date} •{' '}
                  {announcement.publisher.time}
                </div>
              </div>
            </div>

            {/* Right: Save and Share Buttons */}
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
                  padding: '9px 20px',
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

              {/* Share Button (Acid-Lime Green) */}
              <button
                type="button"
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#D5FF38',
                  color: '#111111',
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
                <Share2 width={15} height={15} strokeWidth={2.5} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* FEATURED BANNER CARD (BLACK HERO + CAMPUS PHOTO + TILTED STICKER) */}
          <div
            style={{
              borderRadius: 24,
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              minHeight: 220,
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              border: '1px solid #111111',
            }}
          >
            {/* Left Box (Pitch Black with acid-lime headline) */}
            <div
              style={{
                backgroundColor: '#111111',
                padding: '30px 28px',
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
                  fontSize: 32,
                  fontWeight: 950,
                  color: '#D5FF38',
                  lineHeight: 1.05,
                  letterSpacing: -0.8,
                  textTransform: 'uppercase',
                  marginBottom: 14,
                }}
              >
                {announcement.featuredBanner.headingLine1}
                <br />
                {announcement.featuredBanner.headingLine2}
              </div>

              <div>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#FA78B9',
                    color: '#111111',
                    fontSize: 11,
                    fontWeight: 950,
                    padding: '4px 14px',
                    borderRadius: 9999,
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {announcement.featuredBanner.tagline}
                </span>
              </div>
            </div>

            {/* Right Photo Banner with Tilted Sticker */}
            <div
              style={{
                position: 'relative',
                minHeight: 220,
                width: '100%',
              }}
            >
              <Image
                src={announcement.featuredBanner.imageSrc}
                alt={announcement.title}
                fill
                style={{ objectFit: 'cover' }}
              />

              {/* Tilted Hot Pink Sticker: ALL DEPARTMENTS */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 24,
                  right: 20,
                  backgroundColor: '#FA78B9',
                  color: '#111111',
                  padding: '8px 16px',
                  borderRadius: 12,
                  fontWeight: 950,
                  fontSize: 12,
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  transform: 'rotate(-8deg)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  border: '1.5px solid #111111',
                }}
              >
                {announcement.featuredBanner.imageTag}
              </div>
            </div>
          </div>

          {/* ANNOUNCEMENT DETAILS SECTION */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 950,
                color: '#111111',
                letterSpacing: -0.3,
                margin: '8px 0 0 0',
              }}
            >
              Announcement Details
            </h2>

            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
              {announcement.detailsContent}
            </p>

            {/* Important Note Box (Light green / lime tinted card) */}
            <div
              style={{
                backgroundColor: '#F7FEE7',
                border: '1px solid #D9F99D',
                borderRadius: 14,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: '#65A30D',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 900,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                i
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#365314', marginBottom: 2 }}>
                  Important Note
                </div>
                <div style={{ fontSize: 12, color: '#4D7C0F', fontWeight: 600, lineHeight: 1.4 }}>
                  {announcement.importantNote}
                </div>
              </div>
            </div>

            {/* Key Information Box (White rounded card with 2-column grid) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '18px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 950,
                  color: '#111111',
                  marginBottom: 14,
                }}
              >
                <FileText width={17} height={17} />
                <span>Key Information</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '12px 24px',
                  fontSize: 12,
                }}
              >
                {/* Item 1: Exam Type */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar width={15} height={15} color="#6B7280" />
                  <span style={{ color: '#6B7280', fontWeight: 600, minWidth: 90 }}>
                    Exam Type
                  </span>
                  <span style={{ fontWeight: 800, color: '#111111' }}>
                    {announcement.keyInfo.examType}
                  </span>
                </div>

                {/* Item 2: Mode */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MapPin width={15} height={15} color="#6B7280" />
                  <span style={{ color: '#6B7280', fontWeight: 600, minWidth: 70 }}>Mode</span>
                  <span style={{ fontWeight: 800, color: '#111111' }}>
                    {announcement.keyInfo.mode}
                  </span>
                </div>

                {/* Item 3: Applicable To */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Users width={15} height={15} color="#6B7280" />
                  <span style={{ color: '#6B7280', fontWeight: 600, minWidth: 90 }}>
                    Applicable To
                  </span>
                  <span style={{ fontWeight: 800, color: '#111111' }}>
                    {announcement.keyInfo.applicableTo}
                  </span>
                </div>

                {/* Item 4: Timings */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Clock width={15} height={15} color="#6B7280" />
                  <span style={{ color: '#6B7280', fontWeight: 600, minWidth: 70 }}>
                    Timings
                  </span>
                  <span style={{ fontWeight: 800, color: '#111111' }}>
                    {announcement.keyInfo.timings}
                  </span>
                </div>

                {/* Item 5: Exam Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar width={15} height={15} color="#6B7280" />
                  <span style={{ color: '#6B7280', fontWeight: 600, minWidth: 90 }}>
                    Exam Date
                  </span>
                  <span style={{ fontWeight: 800, color: '#111111' }}>
                    {announcement.keyInfo.examDate}
                  </span>
                </div>

                {/* Item 6: Venue */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Building2 width={15} height={15} color="#6B7280" />
                  <span style={{ color: '#6B7280', fontWeight: 600, minWidth: 70 }}>Venue</span>
                  <span style={{ fontWeight: 800, color: '#111111' }}>
                    {announcement.keyInfo.venue}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* INSTRUCTIONS FOR STUDENTS */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 950,
                color: '#111111',
                letterSpacing: -0.3,
                margin: '6px 0 0 0',
              }}
            >
              Instructions for Students
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {announcement.instructions.map((inst, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 13,
                    color: '#374151',
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: '#FA78B9',
                      color: '#111111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 950,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                  <span>{inst}</span>
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
          {/* WIDGET 1: ANNOUNCEMENT OVERVIEW (ACID-LIME HEADER) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              border: '1px solid #E5E7EB',
            }}
          >
            {/* Bright Acid-Lime Header Bar */}
            <div
              style={{
                backgroundColor: '#D5FF38',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Megaphone width={16} height={16} color="#111111" strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                Announcement Overview
              </span>
            </div>

            {/* 2-Column Overview Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                padding: 12,
              }}
            >
              {/* Box 1: Exam Start Date */}
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
                  <CalendarDays width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    {announcement.overview.startDate}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Exam Start Date
                  </div>
                </div>
              </div>

              {/* Box 2: Exam End Date */}
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
                    backgroundColor: '#FFEDD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EA580C',
                    flexShrink: 0,
                  }}
                >
                  <CalendarDays width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    {announcement.overview.endDate}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Exam End Date
                  </div>
                </div>
              </div>

              {/* Box 3: Start Time */}
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
                  <Clock width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    {announcement.overview.startTime}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Start Time
                  </div>
                </div>
              </div>

              {/* Box 4: End Time */}
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
                  <Clock width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    {announcement.overview.endTime}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    End Time
                  </div>
                </div>
              </div>

              {/* Box 5: Applicable To */}
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
                    backgroundColor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4B5563',
                    flexShrink: 0,
                  }}
                >
                  <Users width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    All Departments
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Applicable To
                  </div>
                </div>
              </div>

              {/* Box 6: Mode */}
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
                    backgroundColor: '#CCFBF1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0D9488',
                    flexShrink: 0,
                  }}
                >
                  <MapPin width={16} height={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    {announcement.overview.mode}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Mode</div>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 2: ATTACHMENTS (3) */}
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
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Paperclip width={16} height={16} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Attachments ({announcement.attachments.length})
                </span>
              </div>
              <button
                type="button"
                onClick={handleDownloadAll}
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
                <span>Download All</span>
                <ArrowRight width={12} height={12} strokeWidth={2.5} />
              </button>
            </div>

            {/* List of Attachments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {announcement.attachments.map((file, idx) => {
                const isPdf = file.type === 'pdf'
                const isDocx = file.type === 'docx'
                const isXlsx = file.type === 'xlsx'

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      backgroundColor: '#F9FAFB',
                      borderRadius: 12,
                      border: '1px solid #F3F4F6',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor: isPdf ? '#FEE2E2' : isDocx ? '#DBEAFE' : '#DCFCE7',
                          color: isPdf ? '#EF4444' : isDocx ? '#2563EB' : '#16A34A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isXlsx ? (
                          <FileSpreadsheet width={16} height={16} />
                        ) : (
                          <FileText width={16} height={16} />
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: '#111111',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {file.name}
                        </div>
                        <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                          {file.size}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadAttachment(file)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#111111',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#111111'
                        e.currentTarget.style.color = '#FFFFFF'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF'
                        e.currentTarget.style.color = '#111111'
                      }}
                    >
                      <Download width={13} height={13} strokeWidth={2.5} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* WIDGET 3: RELATED ANNOUNCEMENTS */}
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
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Folder width={16} height={16} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Related Announcements
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push('/student')}
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

            {/* List of 3 Related Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {announcement.related.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleRelatedClick(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '8px 10px',
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
                      <div
                        style={{
                          fontSize: 10,
                          color: '#6B7280',
                          fontWeight: 600,
                          marginTop: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Clock width={11} height={11} />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight width={15} height={15} color="#9CA3AF" />
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 4: NEED HELP? PANEL */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 950,
                color: '#111111',
                marginBottom: 6,
              }}
            >
              <Headphones width={17} height={17} />
              <span>Need Help?</span>
            </div>

            <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Have questions about the exam schedule?
              <br />
              Contact the Examination Cell.
            </p>

            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 9999,
                padding: '10px 16px',
                fontSize: 12,
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#222222')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
            >
              <span>Contact Examination Cell</span>
              <ArrowRight width={13} height={13} />
            </button>
          </div>
        </aside>
      </div>

      {/* CONTACT EXAMINATION CELL MODAL */}
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
            {/* Close Button */}
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
                <Building2 width={20} height={20} color="#111111" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 950, color: '#111111', margin: 0 }}>
                  Contact Examination Cell
                </h3>
                <div style={{ fontSize: 11, color: '#6B7280' }}>Dr. Ambedkar Institute of Technology</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 18 }}>
              For queries related to mid-semester exam dates, clashes, medical exemptions, or hall ticket issues, please reach out to the controller of examinations:
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
                <span style={{ fontWeight: 800, color: '#111111' }}>Office Location: </span>
                <span style={{ color: '#4B5563' }}>Admin Block, Room 104</span>
              </div>
              <div>
                <span style={{ fontWeight: 800, color: '#111111' }}>Helpline Phone: </span>
                <span style={{ color: '#4B5563' }}>+91 80 2321 1234</span>
              </div>
              <div>
                <span style={{ fontWeight: 800, color: '#111111' }}>Email: </span>
                <span style={{ color: '#2563EB', fontWeight: 700 }}>examcell@drait.edu.in</span>
              </div>
              <div>
                <span style={{ fontWeight: 800, color: '#111111' }}>Working Hours: </span>
                <span style={{ color: '#4B5563' }}>09:00 AM – 04:30 PM (Mon – Sat)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsContactModalOpen(false)
                addToast({
                  type: 'success',
                  title: 'Inquiry Submitted',
                  message: 'Your query notification has been sent to the examination cell support desk.',
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
              Send Direct Inquiry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
