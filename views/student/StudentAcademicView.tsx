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
  Zap,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface AcademicNoticeItem {
  id: string
  title: string
  excerpt: string
  content: string
  category: 'Exam Schedule' | 'Results' | 'Timetable' | 'Academic Calendar' | 'Circulars' | 'Fee & Finance' | 'Scholarships'
  department: string
  postedDate: string
  postedTime: string
  postedBy: string
  imageSrc: string
  isUrgent?: boolean
  isNew?: boolean
  attachmentName?: string
  attachmentSize?: string
}

const initialAcademicNotices: AcademicNoticeItem[] = [
  {
    id: 'notice-mid-sem-exam-schedule-2026',
    title: 'Mid Semester Exam Schedule',
    excerpt: 'The mid semester examination schedule for all departments has been released. Please check the dates and timings carefully.',
    content: 'All undergraduate and postgraduate students are hereby informed that the Mid-Semester Examinations for the Odd Semester 2026 will commence from October 14, 2026. Hall tickets will be issued through the student portal starting October 11, 2026. Reporting time is 30 minutes prior to exam commencement. Standard examination guidelines apply.',
    category: 'Exam Schedule',
    department: 'All Departments',
    postedDate: '12 Oct 2026',
    postedTime: '09:30 AM',
    postedBy: 'Examination Cell',
    imageSrc: '/images/mid_sem_exam.jpg',
    isUrgent: true,
    isNew: true,
    attachmentName: 'Mid_Sem_Exam_Schedule_Oct_2026.pdf',
    attachmentSize: '1.4 MB',
  },
  {
    id: 'notice-library-timings-update',
    title: 'Library Timings Update',
    excerpt: 'The library will remain open till 10 PM during exam week.',
    content: 'In view of the upcoming mid-semester examinations, the Central Library reading halls and digital reference sections will remain open from 8:00 AM to 10:00 PM on all working days including Saturdays. Night canteen services in Block B will also remain active till 10:30 PM. Silence must be maintained in the study bays.',
    category: 'Academic Calendar',
    department: 'Central Facilities',
    postedDate: '11 Oct 2026',
    postedTime: '04:20 PM',
    postedBy: 'Library Committee',
    imageSrc: '/images/library_books.jpg',
    attachmentName: 'Library_Extended_Hours_Guidelines.pdf',
    attachmentSize: '420 KB',
  },
  {
    id: 'notice-internal-assessment-marks-released',
    title: 'Internal Assessment Marks Released',
    excerpt: 'The internal assessment marks for Semester V have been published on the student portal.',
    content: 'Continuous Internal Assessment (CIE-1) marks for all Semester V courses have been published by the academic office. Students are requested to log in to their student portal and verify their individual subject marks. Any discrepancies must be brought to the notice of the respective course instructors before October 15, 2026.',
    category: 'Results',
    department: 'Academic Office',
    postedDate: '10 Oct 2026',
    postedTime: '11:15 AM',
    postedBy: 'Academic Office',
    imageSrc: '/images/recruitment_interview.jpg',
    attachmentName: 'CIE_Marks_Verification_Circular.pdf',
    attachmentSize: '680 KB',
  },
  {
    id: 'notice-attendance-verification-process',
    title: 'Attendance Verification Process',
    excerpt: 'All students are requested to verify their attendance records latest by 18th October.',
    content: 'Notice is hereby given that attendance percentage consolidation for eligibility in upcoming examinations is underway. A minimum of 75% attendance in each subject is mandatory as per University regulations. Students having condonation requests due to medical or athletic grounds must submit verified certificates to Dean Academics by October 18, 2026.',
    category: 'Circulars',
    department: 'Dean Academics',
    postedDate: '9 Oct 2026',
    postedTime: '03:40 PM',
    postedBy: 'Dean Academics',
    imageSrc: '/images/mid_sem_exam.jpg',
    attachmentName: 'Attendance_Policy_2026.pdf',
    attachmentSize: '890 KB',
  },
]

interface ImportantDateItem {
  id: string
  dateMonth: string
  dateDay: string
  title: string
  description: string
  type: 'Exams' | 'Results' | 'Holidays' | 'General'
}

const importantDates: ImportantDateItem[] = [
  {
    id: 'date-1',
    dateMonth: 'OCT',
    dateDay: '14',
    title: 'Mid Semester Exams Begin',
    description: 'All Departments',
    type: 'Exams',
  },
  {
    id: 'date-2',
    dateMonth: 'OCT',
    dateDay: '20',
    title: 'Last Date for Fee Payment',
    description: 'UG & PG Programs',
    type: 'General',
  },
  {
    id: 'date-3',
    dateMonth: 'OCT',
    dateDay: '28',
    title: 'Practical Examinations',
    description: 'Selected Departments',
    type: 'Exams',
  },
  {
    id: 'date-4',
    dateMonth: 'NOV',
    dateDay: '05',
    title: 'Result Declaration (Internal)',
    description: 'Semester V',
    type: 'Results',
  },
  {
    id: 'date-5',
    dateMonth: 'NOV',
    dateDay: '12',
    title: 'End Semester Registration',
    description: 'All Departments',
    type: 'General',
  },
]

export function StudentAcademicView() {
  const router = useRouter()
  const { savedIds, toggleSave, addToast } = useStore()

  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'Latest' | 'Urgent'>('Latest')
  const [dateFilterTab, setDateFilterTab] = useState<'Upcoming' | 'Exams' | 'Results' | 'Holidays'>('Upcoming')
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  // Interactive notices & modals
  const [noticesList, setNoticesList] = useState<AcademicNoticeItem[]>(initialAcademicNotices)
  const [selectedNotice, setSelectedNotice] = useState<AcademicNoticeItem | null>(null)
  const [activeResourceModal, setActiveResourceModal] = useState<string | null>(null)
  const [activeCarouselSlide, setActiveCarouselSlide] = useState(0)

  // Carousel timer for featured banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCarouselSlide((prev) => (prev + 1) % 4)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // Filtered Notices
  const filteredNotices = useMemo(() => {
    let list = [...noticesList]

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter((n) => n.category === activeCategory)
    }

    // Department filter
    if (selectedDepartment !== 'All Departments') {
      list = list.filter((n) => n.department.includes(selectedDepartment) || n.department === 'All Departments')
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.excerpt.toLowerCase().includes(q) ||
          n.department.toLowerCase().includes(q) ||
          n.postedBy.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'Urgent') {
      list.sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0))
    }

    return list
  }, [noticesList, activeCategory, selectedDepartment, searchQuery, sortBy])

  // Filtered Important Dates
  const filteredDates = useMemo(() => {
    if (dateFilterTab === 'Upcoming') return importantDates
    return importantDates.filter((d) => d.type === dateFilterTab)
  }, [dateFilterTab])

  // Handle Bookmark Toggle
  const handleToggleBookmark = (notice: AcademicNoticeItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    toggleSave(notice.id)
    const isNowSaved = !savedIds.includes(notice.id)
    addToast({
      type: isNowSaved ? 'success' : 'info',
      title: isNowSaved ? 'Notice Bookmarked' : 'Bookmark Removed',
      message: isNowSaved
        ? `Added "${notice.title}" to your saved academic items.`
        : `Removed "${notice.title}" from bookmarks.`,
    })
  }

  // Category Pills
  const categoryPills = [
    'All',
    'Exam Schedule',
    'Results',
    'Timetable',
    'Academic Calendar',
    'Circulars',
    'Fee & Finance',
    'Scholarships',
  ]

  // Departments List
  const departmentsList = [
    'All Departments',
    'Computer Science',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
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
              placeholder="Search academic notices, exam schedules, results, timetables..."
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
                  <span style={{ fontSize: 13, fontWeight: 900 }}>Academic Alerts</span>
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
                    Urgent
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
                      setSelectedNotice(initialAcademicNotices[0])
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#D5FF38' }}>Mid Semester Exam Schedule</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
                      Examination timetable has been finalized. Download your hall tickets.
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
                      setSelectedNotice(initialAcademicNotices[2])
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#FA78B9' }}>Internal Marks Released</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
                      Semester V marks published on student portal.
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

              {/* 6. Academic (ACTIVE) */}
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
                <GraduationCap width={17} height={17} />
                <span>Academic</span>
              </button>

              {/* 7. General */}
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

        {/* COLUMN 2: CENTER ACADEMIC NOTICES HUB */}
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
              <span>ACADEMIC • NOTICES • EXAMINATIONS • RESULTS</span>
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
                    Academic Notices
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
                  Stay updated with important academic announcements, exam schedules, results and more.
                </p>
              </div>

              {/* Tilted Sticker: SAME CAMPUS. BRIGHTER FUTURES. */}
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
                  <div>BRIGHTER FUTURES.</div>
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
                  placeholder="Search notices, exams, results, timetables..."
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

              {/* All Departments Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
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
                  <Building2 width={16} height={16} color="#111111" />
                  <span>{selectedDepartment}</span>
                  <ChevronDown width={14} height={14} color="#6B7280" />
                </button>

                {isDeptDropdownOpen && (
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
                      minWidth: 220,
                    }}
                  >
                    {departmentsList.map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          setSelectedDepartment(dept)
                          setIsDeptDropdownOpen(false)
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: 12,
                          fontWeight: selectedDepartment === dept ? 900 : 600,
                          backgroundColor: selectedDepartment === dept ? '#F3F4F6' : 'transparent',
                          color: '#111111',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                      >
                        {dept}
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

          {/* HERO URGENT EXAM BANNER */}
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
              {/* Left Column: Urgent Exam Notice */}
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
                  <Zap width={12} height={12} fill="#111111" />
                  <span>URGENT</span>
                </div>

                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 950,
                    lineHeight: 1.15,
                    letterSpacing: -0.8,
                    margin: 0,
                    color: '#D5FF38',
                  }}
                >
                  Mid Semester Exam Schedule Released
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
                  The mid semester examination schedule for all departments has been released.
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
                    <span>12 Oct 2026</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Building2 width={15} height={15} color="#FA78B9" />
                    <span>Examination Cell</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => setSelectedNotice(initialAcademicNotices[0])}
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
                  <span>View Schedule</span>
                  <ArrowRight width={16} height={16} />
                </button>
              </div>

              {/* Right Column: Realistic Exam Schedule Document Graphic */}
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
                  src="/images/mid_sem_exam.jpg"
                  alt="Exam Schedule Preview"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 10px',
                    borderRadius: 8,
                    fontSize: 10,
                    fontWeight: 900,
                    color: '#D5FF38',
                    letterSpacing: 0.5,
                  }}
                >
                  EXAM SCHEDULE 2026
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

          {/* NOTICES LIST SECTION */}
          <div>
            {/* Header: Latest Academic Notices + Sort Dropdown */}
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
                Latest Academic Notices
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
                    {(['Latest', 'Urgent'] as const).map((s) => (
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

            {/* List of Full-Width Notice Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredNotices.map((notice) => {
                const isBookmarked = savedIds.includes(notice.id)
                return (
                  <div
                    key={notice.id}
                    onClick={() => setSelectedNotice(notice)}
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
                          src={notice.imageSrc}
                          alt={notice.title}
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
                                notice.category === 'Exam Schedule'
                                  ? '#EFF6FF'
                                  : notice.category === 'Academic Calendar'
                                  ? '#D5FF38'
                                  : notice.category === 'Results'
                                  ? '#FA78B9'
                                  : '#EFF6FF',
                              color:
                                notice.category === 'Exam Schedule'
                                  ? '#2563EB'
                                  : notice.category === 'Academic Calendar'
                                  ? '#111111'
                                  : notice.category === 'Results'
                                  ? '#111111'
                                  : '#2563EB',
                            }}
                          >
                            {notice.category}
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
                          {notice.title}
                        </h4>

                        <p
                          style={{
                            fontSize: 12,
                            color: '#6B7280',
                            lineHeight: 1.4,
                            margin: '0 0 6px 0',
                          }}
                        >
                          {notice.excerpt}
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
                            <span>{notice.postedDate} • {notice.postedTime}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <User width={12} height={12} color="#9CA3AF" />
                            <span>{notice.postedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Icons: New Badge + Bookmark + Chevron */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {notice.isNew && (
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
                        onClick={(e) => handleToggleBookmark(notice, e)}
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

        {/* COLUMN 3: RIGHT WIDGETS (Important Dates, Resources, Departments) */}
        <aside
          style={{
            position: 'sticky',
            top: 84,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* 1. IMPORTANT DATES WIDGET */}
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
                <Calendar width={17} height={17} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Important Dates
                </span>
              </div>
              <button
                type="button"
                onClick={() => addToast({ type: 'info', title: 'Academic Calendar', message: 'Showing all key semester dates.' })}
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

            {/* Sub-Tabs Bar: Upcoming, Exams, Results, Holidays */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '10px 12px 6px 12px',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              {(['Upcoming', 'Exams', 'Results', 'Holidays'] as const).map((tab) => {
                const isActive = dateFilterTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDateFilterTab(tab)}
                    style={{
                      flex: 1,
                      padding: '5px 0',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 800,
                      border: 'none',
                      backgroundColor: isActive ? '#111111' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#6B7280',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>

            {/* List of Important Dates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12 }}>
              {filteredDates.map((item) => (
                <div
                  key={item.id}
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
                  onClick={() =>
                    addToast({
                      type: 'info',
                      title: item.title,
                      message: `Scheduled date: ${item.dateDay} ${item.dateMonth} for ${item.description}.`,
                    })
                  }
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Date Badge */}
                    <div style={{ textAlign: 'center', width: 34 }}>
                      <div style={{ fontSize: 9, fontWeight: 900, color: '#9CA3AF' }}>
                        {item.dateMonth}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                        {item.dateDay}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', lineHeight: 1.15 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <ChevronRight width={14} height={14} color="#9CA3AF" />
                </div>
              ))}
            </div>
          </div>

          {/* 2. ACADEMIC RESOURCES CARD */}
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
                  Academic Resources
                </span>
              </div>
              <button
                type="button"
                onClick={() => addToast({ type: 'info', title: 'Resources Portal', message: 'Showing complete academic repository.' })}
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

            {/* 4 Colorful Resource Cards in 2x2 Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}
            >
              {/* Syllabus (Acid-lime) */}
              <button
                type="button"
                onClick={() => setActiveResourceModal('syllabus')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 14,
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>📑</span>
                <span>Syllabus</span>
              </button>

              {/* Timetables (Pink) */}
              <button
                type="button"
                onClick={() => setActiveResourceModal('timetables')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 14,
                  backgroundColor: '#FA78B9',
                  color: '#111111',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>🗓️</span>
                <span>Timetables</span>
              </button>

              {/* Previous Papers (Electric-blue) */}
              <button
                type="button"
                onClick={() => setActiveResourceModal('papers')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 14,
                  backgroundColor: '#3C5BFF',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>📖</span>
                <span>Previous Papers</span>
              </button>

              {/* Academic Calendar (White) */}
              <button
                type="button"
                onClick={() => setActiveResourceModal('calendar')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>🏛️</span>
                <span>Academic Calendar</span>
              </button>
            </div>
          </div>

          {/* 3. DEPARTMENT NOTICES WIDGET */}
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
                <Building2 width={15} height={15} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Department Notices
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDepartment('All Departments')}
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                View All →
              </button>
            </div>

            {/* List of 5 Departments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { code: 'CSE', name: 'Computer Science', count: '5 new notices', color: '#EDE9FE', textColor: '#7C3AED' },
                { code: 'ECE', name: 'Electronics & Communication', count: '3 new notices', color: '#FFE4E6', textColor: '#E11D48' },
                { code: 'ME', name: 'Mechanical Engineering', count: '2 new notices', color: '#FFEDD5', textColor: '#EA580C' },
                { code: 'CE', name: 'Civil Engineering', count: '4 new notices', color: '#DBEAFE', textColor: '#2563EB' },
                { code: 'IT', name: 'Information Technology', count: '3 new notices', color: '#FCE7F3', textColor: '#DB2777' },
              ].map((dept) => (
                <div
                  key={dept.code}
                  onClick={() => {
                    setSelectedDepartment(dept.name)
                    addToast({
                      type: 'info',
                      title: `${dept.name} Filter`,
                      message: `Filtering notices for ${dept.code} department.`,
                    })
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
                        padding: '4px 6px',
                        borderRadius: 8,
                        backgroundColor: dept.color,
                        color: dept.textColor,
                        fontSize: 10,
                        fontWeight: 950,
                        letterSpacing: 0.5,
                      }}
                    >
                      {dept.code}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', lineHeight: 1.1 }}>
                        {dept.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                        {dept.count}
                      </div>
                    </div>
                  </div>

                  <ChevronRight width={14} height={14} color="#9CA3AF" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL 1: NOTICE DETAIL MODAL */}
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
                {selectedNotice.postedDate} • {selectedNotice.postedTime} • Issued by {selectedNotice.postedBy}
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

            {/* Notice Body */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#111111', marginBottom: 6 }}>
                Official Circular Text
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                {selectedNotice.content}
              </p>
            </div>

            {/* Attachment Box */}
            {selectedNotice.attachmentName && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: 14,
                  marginBottom: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText width={20} height={20} color="#2563EB" />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                      {selectedNotice.attachmentName}
                    </div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>
                      {selectedNotice.attachmentSize} • PDF Document
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addToast({
                      type: 'success',
                      title: 'Download Started',
                      message: `Downloading ${selectedNotice.attachmentName}`,
                    })
                  }
                  style={{
                    backgroundColor: '#111111',
                    color: '#D5FF38',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Download width={12} height={12} />
                  <span>Download</span>
                </button>
              </div>
            )}

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
                    title: 'Schedule Confirmed',
                    message: 'Notice details acknowledged and added to your planner.',
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

      {/* MODAL 2: ACADEMIC RESOURCES MODAL */}
      {activeResourceModal && (
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
          onClick={() => setActiveResourceModal(null)}
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
              onClick={() => setActiveResourceModal(null)}
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
              <span style={{ fontSize: 24 }}>
                {activeResourceModal === 'syllabus' && '📑'}
                {activeResourceModal === 'timetables' && '🗓️'}
                {activeResourceModal === 'papers' && '📖'}
                {activeResourceModal === 'calendar' && '🏛️'}
              </span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 950, margin: 0, color: '#111111' }}>
                  {activeResourceModal === 'syllabus' && 'Undergraduate & PG Syllabus'}
                  {activeResourceModal === 'timetables' && 'Class & Lab Timetables 2026'}
                  {activeResourceModal === 'papers' && 'Question Paper Archive (Last 5 Years)'}
                  {activeResourceModal === 'calendar' && 'Official Academic Calendar 2026-27'}
                </h3>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                  Dr. AIT Academic Secretariat Repository
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, marginBottom: 16 }}>
              {activeResourceModal === 'syllabus' &&
                'Download approved curriculum structures, course outcomes, credit distribution, and textbooks for all semesters.'}
              {activeResourceModal === 'timetables' &&
                'View section-wise master timetables, laboratory batch allocations, and faculty office hours.'}
              {activeResourceModal === 'papers' &&
                'Access semester-end exam question papers with model answers and evaluation rubrics.'}
              {activeResourceModal === 'calendar' &&
                'Review verified term dates, internal assessment schedules, fee deadlines, and gazetted campus holidays.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {['Semester V Master Package (PDF)', 'Continuous Evaluation Guidelines', 'Lab Manuals & Code Templates'].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: '#111111' }}>{item}</span>
                  <span style={{ color: '#2563EB', fontSize: 11 }}>Download ↓</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                addToast({
                  type: 'success',
                  title: 'Academic Archive Downloaded',
                  message: 'The requested resource bundle has been saved.',
                })
                setActiveResourceModal(null)
              }}
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
              }}
            >
              Download Full Academic Bundle
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
