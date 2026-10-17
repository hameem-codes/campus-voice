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
  Heart,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  X,
  MapPin,
  Calendar,
  Layers,
  Wrench,
  Users,
  Trophy,
  Check,
  ChevronLeft,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  Building2,
  BarChart3,
  Rocket,
  BookOpen,
  FileText,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Award,
  Globe,
  Share2,
  Star,
  SlidersHorizontal,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

interface PlacementDriveItem {
  id: string
  company: string
  role: string
  type: 'On Campus' | 'Off Campus'
  category: 'All' | 'On Campus' | 'Off Campus' | 'Internship' | 'Full Time' | 'Work From Home' | 'Core' | 'Non-Core'
  subCategory?: string[]
  yearEligibility: string
  branches: string
  dateFormatted: string
  timeFormatted: string
  location: string
  isOnline?: boolean
  packageLPA: string
  stipendPerMonth?: string
  description: string
  rounds: string[]
  criteria: string
  logoType: 'google' | 'microsoft' | 'amazon' | 'tcs' | 'infosys' | 'deloitte'
  interestedCount: number
  isInterested?: boolean
  isBookmarked?: boolean
  dateBadge: { month: string; day: string }
}

const initialDrives: PlacementDriveItem[] = [
  {
    id: 'drive-google-swe-2026',
    company: 'Google',
    role: 'Software Engineer Intern',
    type: 'On Campus',
    category: 'On Campus',
    subCategory: ['Internship', 'Core'],
    yearEligibility: 'Final Year',
    branches: 'CSE, IT, ECE',
    dateFormatted: '20 Oct 2026',
    timeFormatted: '10:00 AM',
    location: 'Main Auditorium',
    packageLPA: '32.5 LPA',
    stipendPerMonth: '₹1,25,000 / month',
    description: 'Build for billions. Google is visiting for campus recruitment of 2026 graduates. Roles available in Search, Cloud, and Android systems engineering.',
    rounds: ['Online Coding Assessment (LeetCode Hard)', 'Technical Round 1 (Data Structures)', 'Technical Round 2 (System Design)', 'Googliness & Leadership'],
    criteria: 'CGPA 8.0+ with no standing arrears. Strong command of C++, Java, or Python.',
    logoType: 'google',
    interestedCount: 420,
    isInterested: false,
    isBookmarked: false,
    dateBadge: { month: 'OCT', day: '20' },
  },
  {
    id: 'drive-microsoft-sde-2026',
    company: 'Microsoft',
    role: 'SDE Full Time',
    type: 'On Campus',
    category: 'On Campus',
    subCategory: ['Full Time', 'Core'],
    yearEligibility: 'Final Year',
    branches: 'CSE, IT',
    dateFormatted: '22 Oct 2026',
    timeFormatted: '11:00 AM',
    location: 'Main Auditorium',
    packageLPA: '26.8 LPA',
    stipendPerMonth: '₹95,000 / month',
    description: 'Empower every person and organization on the planet. Seeking passionate Software Development Engineers to work on Azure Cloud and AI copilot services.',
    rounds: ['Online Cognitive & Coding Test', 'Technical Interview 1 (Algorithms)', 'Technical Interview 2 (Object-Oriented Design)', 'Director AA Round'],
    criteria: 'CGPA 7.5+ across all semesters. Strong fundamentals in distributed systems.',
    logoType: 'microsoft',
    interestedCount: 380,
    isInterested: true,
    isBookmarked: true,
    dateBadge: { month: 'OCT', day: '22' },
  },
  {
    id: 'drive-amazon-sde-2026',
    company: 'Amazon',
    role: 'SDE Intern',
    type: 'Off Campus',
    category: 'Off Campus',
    subCategory: ['Internship', 'Core', 'Work From Home'],
    yearEligibility: 'Pre-Final & Final Year',
    branches: 'All Engineering Disciplines',
    dateFormatted: '25 Oct 2026',
    timeFormatted: '02:00 PM',
    location: 'Online',
    isOnline: true,
    packageLPA: '28.0 LPA',
    stipendPerMonth: '₹80,000 / month',
    description: 'Join Amazon Web Services and Retail technology engineering teams for a 6-month hands-on software development internship program.',
    rounds: ['Online Assessment 1 (Debugging & Code)', 'Online Assessment 2 (Work Styles)', 'Virtual Interview (2 Technical Rounds)'],
    criteria: 'Eligible for pre-final and final year students. High proficiency in problem-solving.',
    logoType: 'amazon',
    interestedCount: 310,
    isInterested: false,
    isBookmarked: false,
    dateBadge: { month: 'OCT', day: '25' },
  },
  {
    id: 'drive-tcs-digital-2026',
    company: 'TCS',
    role: 'Digital Engineering',
    type: 'On Campus',
    category: 'On Campus',
    subCategory: ['Full Time', 'Core'],
    yearEligibility: 'Final Year',
    branches: 'All Branches',
    dateFormatted: '28 Oct 2026',
    timeFormatted: '10:00 AM',
    location: 'Main Auditorium',
    packageLPA: '9.0 LPA',
    description: 'Tata Consultancy Services premium Digital cadre recruitment drive for next-generation IoT, Cloud, and Machine Learning solution engineers.',
    rounds: ['TCS NQT Digital Assessment', 'Technical Coding Interview', 'HR & Managerial Discussion'],
    criteria: '60% or 6.5 CGPA throughout 10th, 12th, and B.Tech. Open to all branches.',
    logoType: 'tcs',
    interestedCount: 290,
    isInterested: true,
    isBookmarked: false,
    dateBadge: { month: 'OCT', day: '28' },
  },
  {
    id: 'drive-infosys-specialist-2026',
    company: 'Infosys',
    role: 'Systems Engineer',
    type: 'On Campus',
    category: 'On Campus',
    subCategory: ['Full Time', 'Non-Core'],
    yearEligibility: 'Final Year',
    branches: 'CSE, IT, ECE',
    dateFormatted: '02 Nov 2026',
    timeFormatted: '11:00 AM',
    location: 'Main Auditorium',
    packageLPA: '6.5 LPA',
    description: 'Infosys specialist programmer and systems engineer recruitment drive with global learning certifications at Mysore campus.',
    rounds: ['Online Aptitude & Pseudo-code Test', 'Technical & Domain Assessment', 'HR Interview'],
    criteria: '65%+ in graduation with no active backlogs.',
    logoType: 'infosys',
    interestedCount: 240,
    isInterested: false,
    isBookmarked: false,
    dateBadge: { month: 'NOV', day: '02' },
  },
  {
    id: 'drive-deloitte-analyst-2026',
    company: 'Deloitte',
    role: 'Associate Analyst',
    type: 'Off Campus',
    category: 'Off Campus',
    subCategory: ['Full Time', 'Non-Core'],
    yearEligibility: 'Final Year',
    branches: 'All Branches',
    dateFormatted: '05 Nov 2026',
    timeFormatted: '10:00 AM',
    location: 'Online',
    isOnline: true,
    packageLPA: '7.6 LPA',
    description: 'Join Deloitte USI Consulting & Advisory practice. Focus on risk analytics, cloud transformations, and business technology integration.',
    rounds: ['Versant Communication Test', 'Cognitive Ability & Case Study', 'Partner Leadership Round'],
    criteria: 'Graduation CGPA 7.0+ across all semesters. Strong presentation and analytical skills.',
    logoType: 'deloitte',
    interestedCount: 195,
    isInterested: false,
    isBookmarked: false,
    dateBadge: { month: 'NOV', day: '05' },
  },
]

// Vector SVG Company Logos
function CompanyLogo({ type, size = 32 }: { type: PlacementDriveItem['logoType']; size?: number }) {
  if (type === 'google') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          fill="#EA4335"
        />
      </svg>
    )
  }
  if (type === 'microsoft') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" rx="1.5" />
        <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" rx="1.5" />
        <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" rx="1.5" />
        <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" rx="1.5" />
      </svg>
    )
  }
  if (type === 'amazon') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <span style={{ fontSize: size * 0.75, fontWeight: 900, fontFamily: 'sans-serif', color: '#111111', lineHeight: 1 }}>
          a
        </span>
        <span style={{ fontSize: size * 0.6, fontWeight: 900, color: '#FF9900', marginLeft: -2 }}>
          smile
        </span>
      </div>
    )
  }
  if (type === 'tcs') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <span style={{ fontSize: size * 0.6, fontWeight: 900, color: '#E53E3E', letterSpacing: -0.5 }}>
          tcs
        </span>
      </div>
    )
  }
  if (type === 'infosys') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <span style={{ fontSize: size * 0.55, fontWeight: 800, color: '#0070AD', letterSpacing: -0.5 }}>
          Infosys
        </span>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <span style={{ fontSize: size * 0.75, fontWeight: 950, color: '#111111' }}>
        D.
      </span>
    </div>
  )
}

export function StudentPlacementsView() {
  const router = useRouter()
  const { savedIds, toggleSave, addToast } = useStore()

  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('All Years')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'Latest' | 'Date' | 'Package'>('Latest')
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  // Interactive Drive Collection
  const [drivesList, setDrivesList] = useState<PlacementDriveItem[]>(initialDrives)
  const [selectedDrive, setSelectedDrive] = useState<PlacementDriveItem | null>(null)
  const [activePrepModal, setActivePrepModal] = useState<string | null>(null)
  const [isContactCellOpen, setIsContactCellOpen] = useState(false)
  const [activeCarouselSlide, setActiveCarouselSlide] = useState(0)

  // Carousel timer for featured banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCarouselSlide((prev) => (prev + 1) % 4)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // Filter logic
  const filteredDrives = useMemo(() => {
    let list = [...drivesList]

    // Category filter
    if (activeCategory !== 'All') {
      if (activeCategory === 'On Campus' || activeCategory === 'Off Campus') {
        list = list.filter((d) => d.type === activeCategory)
      } else {
        list = list.filter((d) => d.subCategory?.includes(activeCategory))
      }
    }

    // Year filter
    if (selectedYear !== 'All Years') {
      if (selectedYear.includes('Final Year')) {
        list = list.filter((d) => d.yearEligibility.includes('Final Year'))
      } else if (selectedYear.includes('Pre-Final')) {
        list = list.filter((d) => d.yearEligibility.includes('Pre-Final'))
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (d) =>
          d.company.toLowerCase().includes(q) ||
          d.role.toLowerCase().includes(q) ||
          d.branches.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'Package') {
      list.sort((a, b) => parseFloat(b.packageLPA) - parseFloat(a.packageLPA))
    }

    return list
  }, [drivesList, activeCategory, selectedYear, searchQuery, sortBy])

  // Handle Interested Click
  const handleToggleInterested = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setDrivesList((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.isInterested
          if (nextState) {
            addToast({
              type: 'success',
              title: 'Marked as Interested!',
              message: `You will receive updates about ${d.company}'s drive.`,
            })
          } else {
            addToast({
              type: 'info',
              title: 'Preference Updated',
              message: `Removed ${d.company} from your interested list.`,
            })
          }
          return {
            ...d,
            isInterested: nextState,
            interestedCount: nextState ? d.interestedCount + 1 : d.interestedCount - 1,
          }
        }
        return d
      })
    )
  }

  // Handle Bookmark Toggle
  const handleToggleBookmark = (drive: PlacementDriveItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    toggleSave(drive.id)
    setDrivesList((prev) =>
      prev.map((d) => (d.id === drive.id ? { ...d, isBookmarked: !d.isBookmarked } : d))
    )
    addToast({
      type: 'info',
      title: 'Drive Bookmarked',
      message: `Saved ${drive.company} drive to your reading and review list.`,
    })
  }

  // Filter pills list
  const categoryPills = [
    'All',
    'On Campus',
    'Off Campus',
    'Internship',
    'Full Time',
    'Work From Home',
    'Core',
    'Non-Core',
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
                  <span style={{ fontSize: 13, fontWeight: 900 }}>Placement Notifications</span>
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
                    2 New
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
                      setSelectedDrive(initialDrives[0])
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#D5FF38' }}>Google Placement Drive</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
                      Online registration opens in 24 hours. Check eligibility criteria.
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
                      setSelectedDrive(initialDrives[1])
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#FA78B9' }}>Microsoft Drive Reminder</div>
                    <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
                      Pre-placement talk scheduled on Oct 22 at Main Auditorium.
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

              {/* 5. Placements (ACTIVE) */}
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
                <Briefcase width={17} height={17} />
                <span>Placements</span>
              </button>

              {/* 6. Academic */}
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

        {/* COLUMN 2: CENTER PLACEMENTS HUB */}
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
              <span>OPPORTUNITIES • PREPARE • GET HIRED</span>
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
                    Placements
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
                  Your gateway to career opportunities. Find drives, prepare and get placed.
                </p>
              </div>

              {/* Tilted Sticker: SAME CAMPUS. BIGGER OPPORTUNITIES. */}
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
                  <div>BIGGER OPPORTUNITIES.</div>
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
                  placeholder="Search companies, roles, skills, location..."
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

              {/* All Years Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
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
                  <GraduationCap width={16} height={16} color="#111111" />
                  <span>{selectedYear}</span>
                  <ChevronDown width={14} height={14} color="#6B7280" />
                </button>

                {isYearDropdownOpen && (
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
                      minWidth: 190,
                    }}
                  >
                    {['All Years', 'Final Year (2026)', 'Pre-Final (2027)', '2nd Year'].map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setSelectedYear(year)
                          setIsYearDropdownOpen(false)
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: 12,
                          fontWeight: selectedYear === year ? 900 : 600,
                          backgroundColor: selectedYear === year ? '#F3F4F6' : 'transparent',
                          color: '#111111',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                      >
                        {year}
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

          {/* FEATURED PLACEMENT BANNER */}
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
              {/* Left Column: Featured Details */}
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: '#FFFFFF',
                    color: '#111111',
                    fontSize: 10,
                    fontWeight: 900,
                    padding: '4px 10px',
                    borderRadius: 9999,
                    letterSpacing: 0.5,
                    marginBottom: 12,
                  }}
                >
                  <span>✦</span>
                  <span>FEATURED</span>
                </div>

                <h2
                  style={{
                    fontSize: 30,
                    fontWeight: 950,
                    lineHeight: 1.1,
                    letterSpacing: -0.8,
                    margin: 0,
                    color: '#FFFFFF',
                  }}
                >
                  Google Placement Drive 2026
                </h2>

                <p
                  style={{
                    fontSize: 13,
                    color: '#9CA3AF',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    margin: '10px 0 18px 0',
                    maxWidth: 440,
                  }}
                >
                  Kickstart your career with Google. Explore roles, eligibility and preparation resources.
                </p>

                {/* Metadata tags */}
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
                    <MapPin width={15} height={15} color="#FA78B9" />
                    <span>Main Auditorium</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users width={15} height={15} color="#3C5BFF" />
                    <span>Multiple Roles</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => setSelectedDrive(initialDrives[0])}
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
                  <span>View Details</span>
                  <ArrowRight width={16} height={16} />
                </button>
              </div>

              {/* Right Column: Google Campus Slogan & Graphic */}
              <div
                style={{
                  position: 'relative',
                  backgroundColor: '#1C1C1E',
                  borderRadius: 18,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #2C2C2E',
                  overflow: 'hidden',
                }}
              >
                {/* Background Glow */}
                <div
                  style={{
                    position: 'absolute',
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(66, 133, 244, 0.3) 0%, rgba(0,0,0,0) 70%)',
                    top: -20,
                    right: -20,
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, width: '100%' }}>
                  <CompanyLogo type="google" size={48} />
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 950, color: '#FFFFFF', letterSpacing: -0.5 }}>
                      Google
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#D5FF38' }}>
                      Build for everyone.
                    </div>
                  </div>
                </div>

                {/* Campus graphic preview */}
                <div
                  style={{
                    width: '100%',
                    height: 100,
                    borderRadius: 12,
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid #333333',
                  }}
                >
                  <Image
                    src="/images/recruitment_interview.jpg"
                    alt="Google Recruitment Drive"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(4px)',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#FFFFFF',
                    }}
                  >
                    Campus Drive • Oct 2026
                  </div>
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

          {/* LOWER SECTION: PREPARATION WIDGETS (LEFT) + LATEST DRIVES (RIGHT) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '240px 1fr',
              gap: 20,
              alignItems: 'start',
            }}
          >
            {/* LEFT SUB-COLUMN: Placement Preparation & Placement Cell */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Placement Preparation Card */}
              <div
                style={{
                  backgroundColor: '#111111',
                  borderRadius: 20,
                  padding: '18px 16px',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    marginBottom: 14,
                  }}
                >
                  <BookOpen width={16} height={16} color="#D5FF38" />
                  <span>Placement Preparation</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Aptitude Resources (Acid-lime) */}
                  <button
                    type="button"
                    onClick={() => setActivePrepModal('aptitude')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      backgroundColor: '#D5FF38',
                      color: '#111111',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: '0 2px 8px rgba(213,255,56,0.25)',
                    }}
                  >
                    <span>📑</span>
                    <span>Aptitude Resources</span>
                  </button>

                  {/* Technical Preparation (Pink) */}
                  <button
                    type="button"
                    onClick={() => setActivePrepModal('technical')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      backgroundColor: '#FA78B9',
                      color: '#111111',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>🎯</span>
                    <span>Technical Preparation</span>
                  </button>

                  {/* Interview Experiences (Electric-blue) */}
                  <button
                    type="button"
                    onClick={() => setActivePrepModal('interview')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      backgroundColor: '#3C5BFF',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>💬</span>
                    <span>Interview Experiences</span>
                  </button>

                  {/* Resume Templates (White) */}
                  <button
                    type="button"
                    onClick={() => setActivePrepModal('resume')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      backgroundColor: '#FFFFFF',
                      color: '#111111',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>📄</span>
                    <span>Resume Templates</span>
                  </button>

                  {/* Company Insights (Dark surface) */}
                  <button
                    type="button"
                    onClick={() => setActivePrepModal('insights')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      backgroundColor: '#1F2937',
                      color: '#FFFFFF',
                      border: '1px solid #374151',
                      fontSize: 12,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>🏢</span>
                    <span>Company Insights</span>
                  </button>
                </div>
              </div>

              {/* Placement Cell Card */}
              <div
                style={{
                  backgroundColor: '#111111',
                  borderRadius: 20,
                  padding: '18px 16px',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    marginBottom: 8,
                  }}
                >
                  <Users width={16} height={16} color="#D5FF38" />
                  <span>Placement Cell</span>
                </div>

                <p
                  style={{
                    fontSize: 11,
                    color: '#9CA3AF',
                    lineHeight: 1.45,
                    margin: '0 0 14px 0',
                    fontWeight: 500,
                  }}
                >
                  Have questions? Reach out to the placement cell for support and guidance.
                </p>

                <button
                  type="button"
                  onClick={() => setIsContactCellOpen(true)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 9999,
                    backgroundColor: '#FFFFFF',
                    color: '#111111',
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <span>Contact Placement Cell</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* RIGHT SUB-COLUMN: Latest Drives Grid */}
            <div>
              {/* Header: Latest Drives + Sort Dropdown */}
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
                  Latest Drives
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
                      {(['Latest', 'Package'] as const).map((s) => (
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

              {/* 3-Column Drive Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 14,
                }}
              >
                {filteredDrives.map((drive) => {
                  const isBookmarked = savedIds.includes(drive.id) || drive.isBookmarked
                  return (
                    <div
                      key={drive.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: 18,
                        padding: '16px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                    >
                      <div>
                        {/* Top Row: Company Logo + Tag + Bookmark */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 10,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CompanyLogo type={drive.logoType} size={30} />
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: 999,
                                backgroundColor: drive.type === 'On Campus' ? '#EFF6FF' : '#F3F4F6',
                                color: drive.type === 'On Campus' ? '#2563EB' : '#4B5563',
                              }}
                            >
                              {drive.type}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleToggleBookmark(drive, e)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 4,
                            }}
                          >
                            <Bookmark
                              width={16}
                              height={16}
                              color={isBookmarked ? '#111111' : '#9CA3AF'}
                              fill={isBookmarked ? '#111111' : 'none'}
                            />
                          </button>
                        </div>

                        {/* Company Name & Role */}
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 15, fontWeight: 950, color: '#111111', lineHeight: 1.2 }}>
                            {drive.company}
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginTop: 2 }}>
                            {drive.role}
                          </div>
                        </div>

                        {/* Metadata Rows */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#4B5563',
                            marginBottom: 14,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <User width={13} height={13} color="#9CA3AF" />
                            <span>{drive.yearEligibility} • {drive.branches}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar width={13} height={13} color="#9CA3AF" />
                            <span>{drive.dateFormatted} • {drive.timeFormatted}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {drive.isOnline ? (
                              <Globe width={13} height={13} color="#9CA3AF" />
                            ) : (
                              <MapPin width={13} height={13} color="#9CA3AF" />
                            )}
                            <span>{drive.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Interested Button + View Details */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          paddingTop: 10,
                          borderTop: '1px solid #F3F4F6',
                        }}
                      >
                        {/* Pink Interested Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleInterested(drive.id, e)}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            padding: '6px 8px',
                            borderRadius: 9999,
                            border: 'none',
                            backgroundColor: drive.isInterested ? '#F43F5E' : '#FA78B9',
                            color: drive.isInterested ? '#FFFFFF' : '#111111',
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Heart
                            width={12}
                            height={12}
                            fill={drive.isInterested ? '#FFFFFF' : '#111111'}
                            color={drive.isInterested ? '#FFFFFF' : '#111111'}
                          />
                          <span>Interested</span>
                        </button>

                        {/* View Details Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedDrive(drive)}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            borderRadius: 9999,
                            border: '1px solid #E5E7EB',
                            backgroundColor: '#FFFFFF',
                            color: '#111111',
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>

        {/* COLUMN 3: RIGHT STATS & UPCOMING WIDGETS */}
        <aside
          style={{
            position: 'sticky',
            top: 84,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* 1. PLACEMENT STATISTICS CARD */}
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
                <BarChart3 width={17} height={17} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Placement Statistics
                </span>
              </div>
              <button
                type="button"
                onClick={() => addToast({ type: 'info', title: 'Placement Analytics', message: 'Campus placement rate is currently at 88.4% for 2026 batch.' })}
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

            {/* 2x2 Metric Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                padding: 14,
              }}
            >
              {/* Stat 1: Companies Visited */}
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
                    backgroundColor: '#EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Building2 width={18} height={18} color="#7C3AED" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    120+
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Companies Visited
                  </div>
                </div>
              </div>

              {/* Stat 2: Students Placed */}
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
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users width={18} height={18} color="#16A34A" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    850+
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Students Placed
                  </div>
                </div>
              </div>

              {/* Stat 3: Highest Package */}
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
                  <TrendingUp width={18} height={18} color="#E11D48" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    12 LPA
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Highest Package
                  </div>
                </div>
              </div>

              {/* Stat 4: Average Package */}
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
                    backgroundColor: '#DBEAFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BarChart3 width={18} height={18} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: '#111111', lineHeight: 1.1 }}>
                    5.6 LPA
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                    Average Package
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. GET PLACEMENT READY CARD */}
          <div
            style={{
              backgroundColor: '#111111',
              borderRadius: 20,
              padding: '18px 18px',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Rocket width={18} height={18} color="#FBBF24" />
              <span style={{ fontSize: 14, fontWeight: 950, color: '#FFFFFF' }}>
                Get Placement Ready
              </span>
            </div>

            <p
              style={{
                fontSize: 11,
                color: '#9CA3AF',
                lineHeight: 1.45,
                margin: '0 0 14px 0',
                maxWidth: 200,
                fontWeight: 500,
              }}
            >
              Access resources, previous papers, interview experiences and more.
            </p>

            <button
              type="button"
              onClick={() => setActivePrepModal('aptitude')}
              style={{
                padding: '8px 16px',
                borderRadius: 9999,
                backgroundColor: '#FFFFFF',
                color: '#111111',
                fontSize: 11,
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>Explore Resources</span>
              <span>→</span>
            </button>

            {/* Graphic Illustration on Right */}
            <div
              style={{
                position: 'absolute',
                right: 12,
                bottom: 12,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 3,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 38,
                  backgroundColor: '#FA78B9',
                  borderRadius: 6,
                  transform: 'rotate(-8deg)',
                }}
              />
              <div
                style={{
                  width: 22,
                  height: 48,
                  backgroundColor: '#38BDF8',
                  borderRadius: 6,
                  transform: 'rotate(5deg)',
                }}
              />
              <div
                style={{
                  width: 26,
                  height: 34,
                  backgroundColor: '#D5FF38',
                  borderRadius: 6,
                  transform: 'rotate(-12deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                }}
              >
                🎓
              </div>
            </div>
          </div>

          {/* 3. UPCOMING PLACEMENT DRIVES WIDGET */}
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
                <Calendar width={15} height={15} color="#111111" />
                <span style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                  Upcoming Placement Drives
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
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

            {/* List of 5 Drives */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {initialDrives.slice(0, 5).map((drive) => (
                <div
                  key={`upcoming-${drive.id}`}
                  onClick={() => setSelectedDrive(drive)}
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
                    <CompanyLogo type={drive.logoType} size={24} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', lineHeight: 1.1 }}>
                        {drive.company}
                      </div>
                      <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>
                        {drive.role}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, fontWeight: 800, color: '#9CA3AF' }}>
                        {drive.dateBadge.month}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 950, color: '#111111', lineHeight: 1 }}>
                        {drive.dateBadge.day}
                      </div>
                    </div>
                    <ChevronRight width={14} height={14} color="#9CA3AF" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL 1: DRIVE DETAILS & APPLICATION MODAL */}
      {selectedDrive && (
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
          onClick={() => setSelectedDrive(null)}
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
              onClick={() => setSelectedDrive(null)}
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

            {/* Header: Company & Role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <CompanyLogo type={selectedDrive.logoType} size={48} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 950, margin: 0, color: '#111111' }}>
                    {selectedDrive.company}
                  </h3>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      padding: '2px 8px',
                      borderRadius: 999,
                    }}
                  >
                    {selectedDrive.type}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#4B5563', marginTop: 2 }}>
                  {selectedDrive.role}
                </div>
              </div>
            </div>

            {/* Highlight Badges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                backgroundColor: '#F9FAFB',
                padding: 14,
                borderRadius: 16,
                marginBottom: 18,
              }}
            >
              <div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Package (CTC)</div>
                <div style={{ fontSize: 16, fontWeight: 950, color: '#16A34A' }}>
                  {selectedDrive.packageLPA}
                </div>
              </div>
              {selectedDrive.stipendPerMonth && (
                <div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Stipend</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#2563EB' }}>
                    {selectedDrive.stipendPerMonth}
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Drive Date</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>
                  {selectedDrive.dateFormatted} • {selectedDrive.timeFormatted}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Venue / Location</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#111111' }}>
                  {selectedDrive.location}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', marginBottom: 4 }}>
                About the Opportunity
              </div>
              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
                {selectedDrive.description}
              </p>
            </div>

            {/* Eligibility Criteria */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', marginBottom: 4 }}>
                Eligibility Criteria
              </div>
              <div
                style={{
                  backgroundColor: '#FEF9C3',
                  border: '1px solid #FDE047',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#713F12',
                }}
              >
                {selectedDrive.criteria} ({selectedDrive.branches})
              </div>
            </div>

            {/* Selection Rounds */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#111111', marginBottom: 8 }}>
                Selection Process & Rounds
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedDrive.rounds.map((round, idx) => (
                  <div
                    key={round}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#374151',
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: '#111111',
                        color: '#D5FF38',
                        fontSize: 10,
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span>{round}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  handleToggleInterested(selectedDrive.id)
                  setSelectedDrive(null)
                }}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: 9999,
                  backgroundColor: selectedDrive.isInterested ? '#F43F5E' : '#FA78B9',
                  color: selectedDrive.isInterested ? '#FFFFFF' : '#111111',
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
                <Heart width={15} height={15} />
                <span>{selectedDrive.isInterested ? 'Marked Interested' : 'Express Interest'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Application Initiated!',
                    message: `Redirecting you to ${selectedDrive.company}'s campus registration portal.`,
                  })
                  setSelectedDrive(null)
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
                <span>Register for Drive</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PREPARATION RESOURCES MODAL */}
      {activePrepModal && (
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
          onClick={() => setActivePrepModal(null)}
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
              onClick={() => setActivePrepModal(null)}
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
                {activePrepModal === 'aptitude' && '📑'}
                {activePrepModal === 'technical' && '🎯'}
                {activePrepModal === 'interview' && '💬'}
                {activePrepModal === 'resume' && '📄'}
                {activePrepModal === 'insights' && '🏢'}
              </span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 950, margin: 0, color: '#111111' }}>
                  {activePrepModal === 'aptitude' && 'Aptitude & Quantitative Kits'}
                  {activePrepModal === 'technical' && 'Technical & DSA Question Bank'}
                  {activePrepModal === 'interview' && 'Past Interview Experiences'}
                  {activePrepModal === 'resume' && 'Standard Campus Resume Templates'}
                  {activePrepModal === 'insights' && 'Tier-1 Company Hiring Insights'}
                </h3>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                  Curated by Placement Officers & Alumni
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, marginBottom: 16 }}>
              {activePrepModal === 'aptitude' &&
                'Review 500+ quantitative aptitude, verbal reasoning, and data interpretation practice sheets tailored for TCS NQT, Infosys, and Cognizant.'}
              {activePrepModal === 'technical' &&
                'Top 150 LeetCode patterns frequently tested by Google, Microsoft, and Amazon campus interviewers.'}
              {activePrepModal === 'interview' &&
                'Read verified transcripts from 2024 & 2025 graduates detailing questions asked in HR and tech rounds.'}
              {activePrepModal === 'resume' &&
                'Download ATS-optimized single-page LaTeX and DOCX resume formats approved by top recruiters.'}
              {activePrepModal === 'insights' &&
                'Cutoffs, average salaries, past hiring quotas, and department-wise selection analytics for 2026.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {['Module 1: Quick Revision Notes (PDF)', 'Module 2: Solved Mock Test Papers', 'Module 3: Video Walkthrough by Seniors'].map((item, idx) => (
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
                  title: 'Resource Pack Downloaded',
                  message: 'The placement preparation package has been saved to your downloads.',
                })
                setActivePrepModal(null)
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
              Download Full Prep Bundle
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: CONTACT PLACEMENT CELL MODAL */}
      {isContactCellOpen && (
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
          onClick={() => setIsContactCellOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              maxWidth: 480,
              width: '100%',
              padding: 26,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsContactCellOpen(false)}
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
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: '#D5FF38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users width={20} height={20} color="#111111" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 950, margin: 0, color: '#111111' }}>
                  Placement & Training Cell
                </h3>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                  Dr. AIT Campus • Block B, Room 204
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18, fontSize: 12 }}>
              <div style={{ padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <div style={{ fontWeight: 800, color: '#111111' }}>Head Placement Officer</div>
                <div style={{ color: '#4B5563', marginTop: 2 }}>Prof. K. R. Sharma</div>
                <div style={{ color: '#2563EB', fontWeight: 600 }}>placements@drait.edu</div>
              </div>
              <div style={{ padding: '10px 14px', backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                <div style={{ fontWeight: 800, color: '#111111' }}>Office Hours</div>
                <div style={{ color: '#4B5563', marginTop: 2 }}>Monday – Friday: 9:30 AM – 5:00 PM</div>
                <div style={{ color: '#4B5563' }}>Helpline: +91 80 2321 2167</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Inquiry Submitted',
                  message: 'Your placement query has been forwarded to the training coordinator.',
                })
                setIsContactCellOpen(false)
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
              Send Direct Message
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
