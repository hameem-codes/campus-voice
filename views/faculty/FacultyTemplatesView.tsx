'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  Megaphone,
  CalendarDays,
  Briefcase,
  GraduationCap,
  Users,
  FileText,
  Activity,
  MessageSquare,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  Clock,
  Calendar,
  X,
  Check,
  Building2,
  Sparkles,
  HelpCircle,
  Home,
  Bus,
  ShieldAlert,
  MoreHorizontal,
  Eye,
  Send,
  Plus,
  Flame,
  ChevronRight,
  Presentation,
  BookOpen,
  CalendarX,
  FilePlus,
  Lightbulb,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ToastContainer } from '@/components/ui/ToastContainer'

export interface NoticeTemplateItem {
  id: string
  title: string
  category: 'Academic' | 'Events' | 'Placements' | 'General' | 'Hostel' | 'Transport' | 'Health & Safety' | 'Other'
  tag: string
  tagColor: { bg: string; text: string }
  description: string
  icon: any
  iconBg: string
  iconColor: string
  sampleContent: string
  targetAudience: string
  defaultPriority: 'Normal' | 'Important' | 'Urgent'
}

export function FacultyTemplatesView() {
  const router = useRouter()
  const { addToast, logout } = useStore()

  // State
  const [activeTab, setActiveTab] = useState<string>('All Templates')
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  // Preview Modal State
  const [previewTemplate, setPreviewTemplate] = useState<NoticeTemplateItem | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [requestForm, setRequestForm] = useState({
    title: '',
    purpose: '',
    department: 'Computer Science & Engineering',
  })

  // 12 Templates matching screenshot
  const templatesList: NoticeTemplateItem[] = [
    {
      id: 'tmpl-exam-schedule',
      title: 'Exam Schedule Notice',
      category: 'Academic',
      tag: 'ACADEMIC',
      tagColor: { bg: '#FEF9C3', text: '#854D0E' },
      description: 'Template for announcing semester exam schedules, timings and guidelines.',
      icon: GraduationCap,
      iconBg: '#FEF9C3',
      iconColor: '#854D0E',
      sampleContent: 'The final semester examination schedule for all undergraduate students has been released. Morning sessions commence at 09:30 AM. Reporting time is strictly 30 minutes prior to exam commencement. Hall tickets and college ID cards must be presented upon entry.',
      targetAudience: 'All Cohorts',
      defaultPriority: 'Important',
    },
    {
      id: 'tmpl-event-announcement',
      title: 'Event Announcement',
      category: 'Events',
      tag: 'EVENTS',
      tagColor: { bg: '#FCE7F3', text: '#DB2777' },
      description: 'Template for cultural, technical or department events with registration details.',
      icon: CalendarDays,
      iconBg: '#FCE7F3',
      iconColor: '#DB2777',
      sampleContent: 'We are thrilled to announce the annual campus celebration. Join us for a vibrant evening of music, performances, and student innovation showcase. Early bird registrations are now open on the campus portal.',
      targetAudience: 'All Students',
      defaultPriority: 'Normal',
    },
    {
      id: 'tmpl-placement-drive',
      title: 'Placement Drive Notice',
      category: 'Placements',
      tag: 'PLACEMENTS',
      tagColor: { bg: '#E0F2FE', text: '#0284C7' },
      description: 'Template for announcing campus recruitment drives and eligibility details.',
      icon: Briefcase,
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      sampleContent: 'Campus recruitment drive registration is now live for final year students. Eligibility criteria: Minimum CGPA of 7.5 with zero active backlogs. Interested candidates must submit updated resumes by 6:00 PM tomorrow.',
      targetAudience: 'Final Year Students',
      defaultPriority: 'Important',
    },
    {
      id: 'tmpl-general-notice',
      title: 'General Notice',
      category: 'General',
      tag: 'GENERAL',
      tagColor: { bg: '#EDE9FE', text: '#7C3AED' },
      description: 'Template for general updates and important information.',
      icon: Megaphone,
      iconBg: '#EDE9FE',
      iconColor: '#7C3AED',
      sampleContent: 'Please take note of upcoming campus facility maintenance and schedule updates. All departmental laboratories will remain accessible under standard operating hours.',
      targetAudience: 'All Students',
      defaultPriority: 'Normal',
    },
    {
      id: 'tmpl-hostel-notice',
      title: 'Hostel Notice',
      category: 'Hostel',
      tag: 'HOSTEL',
      tagColor: { bg: '#DCFCE7', text: '#15803D' },
      description: 'Template for hostel related updates, rules and maintenance information.',
      icon: Home,
      iconBg: '#DCFCE7',
      iconColor: '#15803D',
      sampleContent: 'Resident students are notified that monthly electrical and plumbing maintenance will take place this Saturday between 10:00 AM and 02:00 PM. Please plan accordingly.',
      targetAudience: 'Hostel Residents',
      defaultPriority: 'Normal',
    },
    {
      id: 'tmpl-transport-notice',
      title: 'Transport Notice',
      category: 'Transport',
      tag: 'TRANSPORT',
      tagColor: { bg: '#FEF3C7', text: '#D97706' },
      description: 'Template for bus routes, timings and transport related announcements.',
      icon: Bus,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      sampleContent: 'New bus routes and timings will take effect from the 1st of next month. Students using college transportation can download the revised route maps from the attachment section.',
      targetAudience: 'Day Scholars & Commuters',
      defaultPriority: 'Normal',
    },
    {
      id: 'tmpl-health-safety',
      title: 'Health & Safety Notice',
      category: 'Health & Safety',
      tag: 'HEALTH & SAFETY',
      tagColor: { bg: '#FEE2E2', text: '#DC2626' },
      description: 'Template for safety guidelines, health alerts and emergency information.',
      icon: ShieldAlert,
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      sampleContent: 'Important health and wellness advisories to be observed during seasonal weather transitions. The campus health center is operational 24/7 with emergency first-aid support.',
      targetAudience: 'All Campus Community',
      defaultPriority: 'Urgent',
    },
    {
      id: 'tmpl-class-cancellation',
      title: 'Class Cancellation Notice',
      category: 'Academic',
      tag: 'ACADEMIC',
      tagColor: { bg: '#FEF9C3', text: '#854D0E' },
      description: 'Template for informing about class cancellations or rescheduling.',
      icon: Users,
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
      sampleContent: 'Due to faculty attendance at the university academic senate, lectures for Computer Networks (CS304) scheduled for today are postponed. Makeup sessions will be notified shortly.',
      targetAudience: '3rd Year CSE',
      defaultPriority: 'Important',
    },
    {
      id: 'tmpl-workshop-notice',
      title: 'Workshop Notice',
      category: 'Events',
      tag: 'EVENTS',
      tagColor: { bg: '#FCE7F3', text: '#DB2777' },
      description: 'Template for workshops, seminars and guest lectures.',
      icon: Presentation,
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
      sampleContent: 'Department of Computer Science invites all enthusiasts to a 2-day Hands-on Workshop on Cloud Native Development and Docker Containers. Certificate of completion provided.',
      targetAudience: 'CSE & IT Students',
      defaultPriority: 'Normal',
    },
    {
      id: 'tmpl-internship-opportunity',
      title: 'Internship Opportunity',
      category: 'Placements',
      tag: 'PLACEMENTS',
      tagColor: { bg: '#E0F2FE', text: '#0284C7' },
      description: 'Template for sharing internship opportunities with students.',
      icon: Briefcase,
      iconBg: '#EDE9FE',
      iconColor: '#7C3AED',
      sampleContent: 'Applications are invited for Winter Research & Engineering Internships. Stipend: ₹35,000/month. Eligible students can apply through the placement cell portal.',
      targetAudience: '2nd & 3rd Year Students',
      defaultPriority: 'Important',
    },
    {
      id: 'tmpl-holiday-notice',
      title: 'Holiday Notice',
      category: 'General',
      tag: 'GENERAL',
      tagColor: { bg: '#EDE9FE', text: '#7C3AED' },
      description: 'Template for declaring holidays and campus closures.',
      icon: CalendarX,
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      sampleContent: 'The college will remain closed on Friday in observance of the upcoming public festival. Academic and administrative activities will resume as scheduled on Monday.',
      targetAudience: 'All Campus Community',
      defaultPriority: 'Important',
    },
    {
      id: 'tmpl-custom-notice',
      title: 'Custom Notice',
      category: 'Other',
      tag: 'OTHER',
      tagColor: { bg: '#F3F4F6', text: '#4B5563' },
      description: 'A blank template to create your own custom announcement.',
      icon: FilePlus,
      iconBg: '#F3F4F6',
      iconColor: '#4B5563',
      sampleContent: 'Draft your specialized department message, custom cohort guidelines, or special announcements.',
      targetAudience: 'Custom Audience',
      defaultPriority: 'Normal',
    },
  ]

  // Category Counts
  const categoryCounts: Record<string, number> = {
    'All Templates': templatesList.length,
    'Academic': templatesList.filter((t) => t.category === 'Academic').length,
    'Events': templatesList.filter((t) => t.category === 'Events').length,
    'Placements': templatesList.filter((t) => t.category === 'Placements').length,
    'General': templatesList.filter((t) => t.category === 'General').length,
    'Hostel': templatesList.filter((t) => t.category === 'Hostel').length,
    'Transport': templatesList.filter((t) => t.category === 'Transport').length,
    'Health & Safety': templatesList.filter((t) => t.category === 'Health & Safety').length,
    'Other': templatesList.filter((t) => t.category === 'Other').length,
  }

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templatesList.filter((tmpl) => {
      const matchesCategory =
        activeTab === 'All Templates' || tmpl.category === activeTab
      const matchesSearch =
        !searchQuery.trim() ||
        tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeTab, searchQuery, templatesList])

  // Handle Use Template
  const handleUseTemplate = (tmpl: NoticeTemplateItem) => {
    addToast({
      type: 'success',
      title: 'Template Selected',
      message: `Loaded "${tmpl.title}" into the announcement composer.`,
    })
    router.push(`/faculty/create?title=${encodeURIComponent(tmpl.title)}&category=${encodeURIComponent(tmpl.category)}`)
  }

  // Handle Request Template
  const handleRequestTemplate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestForm.title.trim()) return

    setIsRequestModalOpen(false)
    setRequestForm({ title: '', purpose: '', department: 'Computer Science & Engineering' })
    addToast({
      type: 'success',
      title: 'Template Requested',
      message: 'Your suggestion has been submitted to the academic board.',
    })
  }

  // Tabs list
  const tabList = [
    'All Templates',
    'Academic',
    'Events',
    'Placements',
    'General',
    'Hostel',
    'Transport',
    'Health & Safety',
    'Other',
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
                  backgroundColor: '#111111',
                }}
              >
                <Image
                  src="/images/mateen_avatar.jpg"
                  alt="Dr. Rahul Mehta"
                  fill
                  sizes="32px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#111111' }}>
                  Dr. Rahul Mehta
                </div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Faculty</div>
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
                  Faculty Dashboard
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
          maxWidth: 1540,
          margin: '0 auto',
          padding: '24px 20px',
          display: 'grid',
          gridTemplateColumns: '220px minmax(0, 1fr) 320px',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* COLUMN 1: LEFT DARK SIDEBAR (FACULTY) */}
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
              {/* 1. Dashboard */}
              <button
                type="button"
                onClick={() => router.push('/faculty')}
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
                <LayoutGrid width={17} height={17} />
                <span>Dashboard</span>
              </button>

              {/* 2. Create Announcement */}
              <button
                type="button"
                onClick={() => router.push('/faculty/create')}
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
                <span>Create Announcement</span>
              </button>

              {/* 3. Notice Templates (ACTIVE: Highlighted with border & acid-lime) */}
              <button
                type="button"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 16px',
                  borderRadius: 16,
                  border: '1.5px solid #D5FF38',
                  backgroundColor: 'rgba(213,255,56,0.1)',
                  color: '#D5FF38',
                  fontWeight: 950,
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LayoutGrid width={17} height={17} strokeWidth={2.5} color="#D5FF38" />
                <span>Notice Templates</span>
              </button>

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

              {/* 7. Students */}
              <button
                type="button"
                onClick={() => router.push('/admin/users')}
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
                <Users width={17} height={17} />
                <span>Students</span>
              </button>

              {/* 8. Notices Management */}
              <button
                type="button"
                onClick={() => router.push('/faculty/updates')}
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
                <FileText width={17} height={17} />
                <span>Notices Management</span>
              </button>

              {/* 9. My Activity */}
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
                <Activity width={17} height={17} />
                <span>My Activity</span>
              </button>

              {/* 10. Messages */}
              <button
                type="button"
                onClick={() => router.push('/faculty')}
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
                <MessageSquare width={17} height={17} />
                <span>Messages</span>
              </button>

              {/* 11. Settings */}
              <button
                type="button"
                onClick={() => router.push('/student/profile')}
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
                <Settings width={17} height={17} />
                <span>Settings</span>
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
                  Keep engaging!
                </div>
              </div>
            </div>
            <ChevronRight width={16} height={16} color="#6B7280" />
          </div>
        </aside>

        {/* COLUMN 2: CENTER NOTICE TEMPLATES GALLERY */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Header Row: Title & Tilted Sticker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              position: 'relative',
              paddingTop: 4,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 44,
                  fontWeight: 950,
                  letterSpacing: -1.1,
                  color: '#111111',
                  margin: '0 0 6px 0',
                  lineHeight: 1.05,
                }}
              >
                Notice Templates
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: '#6B7280',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Use pre-designed templates to quickly create professional announcements.
              </p>
            </div>

            {/* Tilted Sticker Tag */}
            <div
              style={{
                transform: 'rotate(7deg)',
                position: 'relative',
                marginTop: -10,
                marginRight: 6,
              }}
            >
              {/* Doodle marks */}
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: 18,
                  display: 'flex',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 2,
                    height: 8,
                    backgroundColor: '#111111',
                    transform: 'rotate(-25deg)',
                  }}
                />
                <div
                  style={{
                    width: 2,
                    height: 8,
                    backgroundColor: '#111111',
                    transform: 'rotate(-25deg)',
                  }}
                />
              </div>

              <div
                style={{
                  backgroundColor: '#D5FF38',
                  padding: '8px 14px',
                  borderRadius: 14,
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
                  SAVE TIME
                  <br />
                  COMMUNICATE
                  <br />
                  BETTER
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs Bar */}
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
                  onClick={() => setActiveTab(tab)}
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

          {/* 3x4 Template Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            {filteredTemplates.map((tmpl) => {
              const Icon = tmpl.icon
              return (
                <div
                  key={tmpl.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '18px 16px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 14,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Top: Icon + Category Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: tmpl.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tmpl.iconColor,
                        flexShrink: 0,
                      }}
                    >
                      <Icon width={22} height={22} strokeWidth={2.2} />
                    </div>

                    <span
                      style={{
                        backgroundColor: tmpl.tagColor.bg,
                        color: tmpl.tagColor.text,
                        fontSize: 9,
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: 9999,
                        letterSpacing: '0.2px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {tmpl.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 950,
                        color: '#111111',
                        margin: '0 0 6px 0',
                        lineHeight: 1.25,
                      }}
                    >
                      {tmpl.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 11,
                        color: '#6B7280',
                        fontWeight: 500,
                        lineHeight: 1.4,
                        margin: 0,
                      }}
                    >
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Actions Row: Preview & Use Template */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      paddingTop: 8,
                      borderTop: '1px solid #F3F4F6',
                    }}
                  >
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tmpl)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        borderRadius: 9999,
                        padding: '6px 10px',
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#111111',
                        cursor: 'pointer',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      <Eye width={12} height={12} />
                      <span>Preview</span>
                    </button>

                    {/* Use Template Button */}
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(tmpl)}
                      style={{
                        flex: 1.4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        backgroundColor: '#111111',
                        border: 'none',
                        borderRadius: 9999,
                        padding: '7px 10px',
                        fontSize: 11,
                        fontWeight: 900,
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
                    >
                      <span>Use Template</span>
                      <ArrowRight width={12} height={12} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '40px 20px',
                textAlign: 'center',
                border: '1px solid #E5E7EB',
              }}
            >
              <LayoutGrid width={36} height={36} color="#9CA3AF" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: 15, fontWeight: 900, color: '#111111', marginBottom: 4 }}>
                No templates found
              </div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>
                Try adjusting your category filter or search keywords.
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
          {/* WIDGET 1: TEMPLATE CATEGORIES (WHITE CARD) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Header */}
            <h3 style={{ fontSize: 14, fontWeight: 950, color: '#111111', margin: 0 }}>
              Template Categories
            </h3>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Object.entries(categoryCounts).map(([catName, count]) => {
                const isSelected = activeTab === catName
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setActiveTab(catName)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 12,
                      border: 'none',
                      backgroundColor: isSelected ? '#D5FF38' : 'transparent',
                      color: isSelected ? '#111111' : '#4B5563',
                      fontWeight: isSelected ? 950 : 700,
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13 }}>
                        {catName === 'All Templates'
                          ? '🎛️'
                          : catName === 'Academic'
                          ? '🎓'
                          : catName === 'Events'
                          ? '📅'
                          : catName === 'Placements'
                          ? '💼'
                          : catName === 'General'
                          ? '📄'
                          : catName === 'Hostel'
                          ? '🏠'
                          : catName === 'Transport'
                          ? '🚌'
                          : catName === 'Health & Safety'
                          ? '🛡️'
                          : '⋯'}
                      </span>
                      <span>{catName}</span>
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        color: isSelected ? '#111111' : '#9CA3AF',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* WIDGET 2: CREATE FROM SCRATCH (LAVENDER CARD) */}
          <div
            style={{
              backgroundColor: '#F5F3FF',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #DDD6FE',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                }}
              >
                <FileText width={16} height={16} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 950, color: '#111111' }}>
                Create from Scratch
              </div>
            </div>

            <p style={{ fontSize: 11, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
              Don&apos;t want to use a template? Start with a blank announcement.
            </p>

            <button
              type="button"
              onClick={() => router.push('/faculty/create')}
              style={{
                width: '100%',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 9999,
                padding: '9px 14px',
                border: 'none',
                fontSize: 12,
                fontWeight: 900,
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
              <span>Create Blank Notice</span>
              <ArrowRight width={13} height={13} />
            </button>
          </div>

          {/* WIDGET 3: MY SAVED TEMPLATES (WHITE CARD) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: 13, fontWeight: 950, color: '#111111', margin: 0 }}>
                My Saved Templates
              </h3>
              <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 800 }}>
                View All →
              </span>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Saved 1 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 12,
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #F3F4F6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      backgroundColor: '#E0F2FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0284C7',
                      fontSize: 11,
                    }}
                  >
                    📄
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                      Dept. Meeting Notice
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>Last used 5 days ago</div>
                  </div>
                </div>
                <MoreHorizontal width={14} height={14} color="#9CA3AF" />
              </div>

              {/* Saved 2 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 12,
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #F3F4F6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      backgroundColor: '#EDE9FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#7C3AED',
                      fontSize: 11,
                    }}
                  >
                    ⏰
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                      Project Submission Reminder
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>Last used 1 week ago</div>
                  </div>
                </div>
                <MoreHorizontal width={14} height={14} color="#9CA3AF" />
              </div>

              {/* Saved 3 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 12,
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #F3F4F6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      backgroundColor: '#DCFCE7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#15803D',
                      fontSize: 11,
                    }}
                  >
                    🔒
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#111111' }}>
                      Lab Closure Notice
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>Last used 2 weeks ago</div>
                  </div>
                </div>
                <MoreHorizontal width={14} height={14} color="#9CA3AF" />
              </div>
            </div>
          </div>

          {/* WIDGET 4: NEED A CUSTOM TEMPLATE? (LIGHT BLUE CARD) */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: 22,
              padding: '18px 16px',
              border: '1px solid #BFDBFE',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                }}
              >
                <Lightbulb width={16} height={16} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 950, color: '#1E3A8A' }}>
                Need a Custom Template?
              </div>
            </div>

            <p style={{ fontSize: 11, color: '#4B5563', margin: 0, lineHeight: 1.4 }}>
              Request a new template for your department or suggest improvements.
            </p>

            <button
              type="button"
              onClick={() => setIsRequestModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                color: '#1E3A8A',
                borderRadius: 9999,
                padding: '9px 14px',
                border: '1px solid #BFDBFE',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginTop: 4,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#DBEAFE')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <span>Request Template</span>
              <ArrowRight width={13} height={13} />
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL 1: TEMPLATE PREVIEW MODAL */}
      {previewTemplate && (
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
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 520,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '2px solid #111111',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    backgroundColor: previewTemplate.tagColor.bg,
                    color: previewTemplate.tagColor.text,
                    fontSize: 10,
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    letterSpacing: '0.2px',
                  }}
                >
                  {previewTemplate.tag}
                </span>
                <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                  Priority: {previewTemplate.defaultPriority}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
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

            {/* Title & Description */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 950, color: '#111111', margin: '0 0 8px 0' }}>
                {previewTemplate.title}
              </h2>
              <p style={{ fontSize: 13, color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                {previewTemplate.sampleContent}
              </p>
            </div>

            {/* Target Audience Pill */}
            <div
              style={{
                backgroundColor: '#F9FAFB',
                padding: '10px 14px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12,
              }}
            >
              <span style={{ color: '#6B7280', fontWeight: 600 }}>Target Audience:</span>
              <span style={{ fontWeight: 800, color: '#111111' }}>{previewTemplate.targetAudience}</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 10,
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const tmpl = previewTemplate
                  setPreviewTemplate(null)
                  handleUseTemplate(tmpl)
                }}
                style={{
                  padding: '9px 20px',
                  borderRadius: 10,
                  border: 'none',
                  backgroundColor: '#111111',
                  color: '#D5FF38',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                Use This Template →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REQUEST TEMPLATE MODAL */}
      {isRequestModalOpen && (
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
          onClick={() => setIsRequestModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 460,
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
                Request New Notice Template
              </h3>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
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

            <form onSubmit={handleRequestTemplate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4, color: '#4B5563' }}>
                  Template Name
                </label>
                <input
                  type="text"
                  value={requestForm.title}
                  onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                  placeholder="e.g. Guest Lecturer Welcome Notice"
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
                  Purpose & Standard Sections
                </label>
                <textarea
                  rows={3}
                  value={requestForm.purpose}
                  onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })}
                  placeholder="Explain why this template would help faculty save time..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1px solid #D1D5DB',
                    fontSize: 12,
                    fontWeight: 500,
                    outline: 'none',
                    resize: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
