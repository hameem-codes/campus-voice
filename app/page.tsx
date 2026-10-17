'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  GraduationCap,
  FileText,
  Megaphone,
  Calendar,
  Users,
  Search,
  Compass,
  User,
  Heart,
  MessageSquare,
  Check,
  Presentation,
  BarChart3,
  X,
  Play,
  ArrowRight,
  Pin,
  Sparkles,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Role } from '@/types'

export default function RootPage() {
  const router = useRouter()
  const { role, isAuthenticated, login, addToast } = useStore()

  // Local interactive states for the preview cards
  const [garbaLikes, setGarbaLikes] = useState(0)
  const [placementLiked, setPlacementLiked] = useState(true)
  const [placementGoing, setPlacementGoing] = useState(true)
  const [culturalLiked, setCulturalLiked] = useState(true)
  const [culturalRsvp, setCulturalRsvp] = useState(false)
  const [recruitmentLiked, setRecruitmentLiked] = useState(true)
  const [activeFilter, setActiveFilter] = useState('#all')
  const [showDemoModal, setShowDemoModal] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${role}`)
    }
  }, [isAuthenticated, role, router])

  const handleQuickLogin = (targetRole: Role) => {
    login(targetRole)
    router.push(`/${targetRole}`)
  }

  const handleInteractiveLike = (itemTitle: string) => {
    addToast({
      type: 'success',
      title: 'Liked notice',
      message: `You liked "${itemTitle}". Added to your engagement activity.`,
    })
  }

  const handleInteractiveGoing = (itemTitle: string) => {
    addToast({
      type: 'info',
      title: 'RSVP confirmed',
      message: `Marked as going for "${itemTitle}". Added to your calendar.`,
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F7',
        color: '#111111',
        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
      }}
    >
      {/* Container */}
      <div
        style={{
          maxWidth: 1360,
          margin: '0 auto',
          padding: '24px 28px 64px',
        }}
      >
        {/* Top Navigation Bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 36,
          }}
        >
          {/* Logo with 4 Acid-Lime Equalizer Bars */}
          <Link
            href="/"
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
                  fontSize: 22,
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
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

          {/* Center Pill Navigation */}
          <nav
            style={{
              backgroundColor: '#111111',
              borderRadius: 9999,
              padding: '5px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
            className="hidden-mobile"
          >
            <a
              href="#home"
              style={{
                backgroundColor: '#D5FF38',
                color: '#111111',
                borderRadius: 9999,
                padding: '7px 22px',
                fontWeight: 800,
                fontSize: 13,
                textDecoration: 'none',
                transition: 'transform 0.12s ease',
              }}
            >
              Home
            </a>
            <a
              href="#features"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                borderRadius: 9999,
                padding: '7px 18px',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
                transition: 'opacity 0.12s ease',
              }}
            >
              Features
            </a>
            <a
              href="#about"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                borderRadius: 9999,
                padding: '7px 18px',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
                transition: 'opacity 0.12s ease',
              }}
            >
              About
            </a>
            <a
              href="#faq"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                borderRadius: 9999,
                padding: '7px 18px',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
                transition: 'opacity 0.12s ease',
              }}
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/login"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#111111',
                border: '2px solid #111111',
                borderRadius: 9999,
                padding: '9px 24px',
                fontWeight: 800,
                fontSize: 14,
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.15s ease',
              }}
            >
              Sign in
            </Link>

            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              style={{
                backgroundColor: '#D5FF38',
                color: '#111111',
                border: '2px solid #111111',
                borderRadius: 9999,
                padding: '9px 22px',
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(213,255,56,0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Get Started</span>
              <span style={{ fontSize: 16 }}>→</span>
            </button>
          </div>
        </header>

        {/* Hero Section: Split 2-Column Layout */}
        <section
          id="home"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 48,
            alignItems: 'center',
            marginBottom: 60,
          }}
        >
          {/* Left Column: Editorial Oversized Typography & CTAs */}
          <div>
            {/* Top Tag Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#EEF0FD',
                border: '1.5px solid #D6DAFB',
                borderRadius: 9999,
                padding: '6px 16px',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#28236E',
                marginBottom: 20,
              }}
            >
              <GraduationCap width={14} height={14} />
              <span>VERIFIED • REAL-TIME • FOR EVERYONE</span>
            </div>

            {/* Bold Oversized Headline */}
            <h1
              style={{
                fontSize: 'clamp(44px, 5.2vw, 68px)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: '#111111',
                margin: '0 0 20px',
              }}
            >
              Important<br />
              campus updates.<br />
              All in one place.
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.55,
                color: '#4B5563',
                maxWidth: 480,
                margin: '0 0 32px',
                fontWeight: 500,
              }}
            >
              Stay informed with verified announcements, events, placements, academic updates and more — without the noise.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 14,
                alignItems: 'center',
                marginBottom: 44,
              }}
            >
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                style={{
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  border: '2px solid #111111',
                  borderRadius: 9999,
                  padding: '14px 30px',
                  fontSize: 16,
                  fontWeight: 900,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(213,255,56,0.35)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span>Get Started</span>
                <span style={{ fontSize: 18 }}>→</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  border: '2px solid #111111',
                  borderRadius: 9999,
                  padding: '14px 28px',
                  fontSize: 16,
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span style={{ fontSize: 13 }}>▶</span>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 4 Mini Stats in Horizontal Row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 20,
                alignItems: 'center',
              }}
            >
              {/* Stat 1: 10K+ Students */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#D5FF38',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #111111',
                    flexShrink: 0,
                  }}
                >
                  <FileText width={18} height={18} color="#111111" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#111111', lineHeight: 1.1 }}>10K+</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Students Informed</div>
                </div>
              </div>

              {/* Stat 2: 500+ Announcements */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#FA78B9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #111111',
                    flexShrink: 0,
                  }}
                >
                  <Megaphone width={18} height={18} color="#111111" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#111111', lineHeight: 1.1 }}>500+</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Announcements</div>
                </div>
              </div>

              {/* Stat 3: 200+ Events */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#3C5BFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #111111',
                    flexShrink: 0,
                  }}
                >
                  <Calendar width={18} height={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#111111', lineHeight: 1.1 }}>200+</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Events & Deadlines</div>
                </div>
              </div>

              {/* Stat 4: 50+ Faculty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #111111',
                    flexShrink: 0,
                  }}
                >
                  <Users width={18} height={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#111111', lineHeight: 1.1 }}>50+</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Faculty Members</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Feed Mockup with Overlapping Floating Cards */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 580, margin: '0 auto' }}>
            {/* Playful Doodles & Arrows */}
            {/* Top Doodle: CAMPUS UPDATES MADE SIMPLE with curved arrow */}
            <div
              style={{
                position: 'absolute',
                top: -50,
                left: -20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 6,
                pointerEvents: 'none',
              }}
              className="hidden-mobile"
            >
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.04em', color: '#111111', lineHeight: 1.2, textAlign: 'center' }}>
                <span style={{ fontSize: 10, display: 'block', marginBottom: 2 }}>\ | /</span>
                CAMPUS<br />
                UPDATES<br />
                MADE SIMPLE
              </div>
              <svg width="45" height="35" viewBox="0 0 45 35" fill="none" style={{ marginTop: 2, transform: 'rotate(10deg)' }}>
                <path d="M 38 4 Q 15 10 12 28" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 6 22 L 12 29 L 19 23" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>

            {/* Pink Brush Stroke on Top-Right */}
            <div
              style={{
                position: 'absolute',
                top: -12,
                right: -16,
                width: 90,
                height: 40,
                backgroundColor: '#FA78B9',
                transform: 'rotate(-18deg)',
                borderRadius: 12,
                zIndex: 1,
                opacity: 0.95,
              }}
            />

            {/* Pink Brush Stroke behind Bottom-Left Blue Card */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: -22,
                width: 80,
                height: 36,
                backgroundColor: '#FA78B9',
                transform: 'rotate(-28deg)',
                borderRadius: 12,
                zIndex: 2,
                opacity: 0.95,
              }}
            />

            {/* Right Accent Ticks */}
            <div
              style={{
                position: 'absolute',
                top: '40%',
                right: -24,
                fontSize: 16,
                fontWeight: 900,
                color: '#111111',
                transform: 'rotate(15deg)',
                zIndex: 5,
                userSelect: 'none',
              }}
              className="hidden-mobile"
            >
              \ | /
            </div>

            {/* Main Black Card Mockup */}
            <div
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: 28,
                border: '2px solid #282828',
                padding: '22px 22px 30px',
                boxShadow: '0 24px 50px -10px rgba(0,0,0,0.22)',
                position: 'relative',
                zIndex: 3,
              }}
            >
              {/* Inner Top Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  gap: 8,
                }}
              >
                {/* Mini Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2.5,
                      height: 18,
                    }}
                  >
                    <span style={{ width: 3, height: 10, backgroundColor: '#D5FF38', borderRadius: 9999 }} />
                    <span style={{ width: 3, height: 18, backgroundColor: '#D5FF38', borderRadius: 9999 }} />
                    <span style={{ width: 3, height: 14, backgroundColor: '#D5FF38', borderRadius: 9999 }} />
                    <span style={{ width: 3, height: 8, backgroundColor: '#D5FF38', borderRadius: 9999 }} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                    CampusVoice
                  </span>
                </div>

                {/* Right Mini Tabs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      backgroundColor: '#D5FF38',
                      color: '#111111',
                      borderRadius: 9999,
                      padding: '4px 12px',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Announcements
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#9CA3AF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <Compass width={12} height={12} />
                    <span>Explore Campus</span>
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#9CA3AF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <User width={12} height={12} />
                    <span>My Activity</span>
                  </span>
                </div>
              </div>

              {/* White Full-Width Pill Search */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 9999,
                  padding: '9px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <Search width={14} height={14} color="#9CA3AF" />
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
                  Search events, placements, announcements...
                </span>
              </div>

              {/* Category Filter Chips */}
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
                  marginBottom: 18,
                  overflowX: 'auto',
                }}
              >
                {['#all', '#event', '#placement', '#academic', '#general'].map((chip) => {
                  const isActive = activeFilter === chip
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setActiveFilter(chip)}
                      style={{
                        backgroundColor: isActive ? '#1F2937' : '#181818',
                        color: isActive ? '#D5FF38' : '#D1D5DB',
                        border: isActive ? '1.5px solid #D5FF38' : '1px solid #2E2E2E',
                        borderRadius: 9999,
                        padding: '4px 12px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {chip}
                    </button>
                  )
                })}
              </div>

              {/* 2 Notices Grid inside Mockup */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                {/* Notice 1: Garba Night */}
                <div
                  style={{
                    backgroundColor: '#181818',
                    border: '1.5px solid #282828',
                    borderRadius: 20,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#111111',
                          borderRadius: 9999,
                          padding: '2px 8px',
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}
                      >
                        GENERAL
                      </span>
                      <span style={{ color: '#FA78B9', fontSize: 11, fontWeight: 800 }}>
                        📌 Pinned
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                      GARBA NIGHT
                    </h3>

                    <p style={{ margin: '0 0 10px', fontSize: 11, color: '#9CA3AF', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      Dr AIT welcomes all the students for the garba-26. Dress code: garba outfit Not allowed : shorts and torn jeans Location : College Ground date : 25/10/2026 Time : 7:00PM-9:00PM Dinner is arranged (Location is pinned Taj West End,MG...
                    </p>

                    <div style={{ fontSize: 10, color: '#6B7280', marginBottom: 6 }}>
                      🕒 15 October 2026 · 11:55 AM
                    </div>

                    <a
                      href="#open-link"
                      onClick={(e) => {
                        e.preventDefault()
                        handleQuickLogin('student')
                      }}
                      style={{ fontSize: 11, color: '#FFFFFF', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      Open attached link
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setGarbaLikes((v) => v + 1)
                        handleInteractiveLike('Garba Night')
                      }}
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#111111',
                        border: 'none',
                        borderRadius: 9999,
                        padding: '4px 12px',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Heart width={11} height={11} fill={garbaLikes > 0 ? '#FA78B9' : 'none'} color={garbaLikes > 0 ? '#FA78B9' : '#111111'} />
                      <span>Like {garbaLikes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('student')}
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#111111',
                        border: 'none',
                        borderRadius: 9999,
                        padding: '4px 12px',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <MessageSquare width={11} height={11} />
                      <span>Comments 2</span>
                    </button>
                  </div>
                </div>

                {/* Notice 2: Placement Drive */}
                <div
                  style={{
                    backgroundColor: '#181818',
                    border: '1.5px solid #282828',
                    borderRadius: 20,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#111111',
                          borderRadius: 9999,
                          padding: '2px 8px',
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}
                      >
                        EVENT
                      </span>
                      <span style={{ color: '#FA78B9', fontSize: 11, fontWeight: 800 }}>
                        📌 Pinned
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                      PLACEMENT DRIVE
                    </h3>

                    <p style={{ margin: '0 0 10px', fontSize: 11, color: '#9CA3AF', lineHeight: 1.4 }}>
                      Placement drive for pre final and final year students
                    </p>

                    <div style={{ fontSize: 10, color: '#6B7280' }}>
                      🕒 15 October 2026 · 11:46 AM
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setPlacementLiked(!placementLiked)
                        handleInteractiveLike('Placement Drive')
                      }}
                      style={{
                        backgroundColor: '#FA78B9',
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
                      <Heart width={11} height={11} fill="#111111" />
                      <span>Liked {placementLiked ? 1 : 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('student')}
                      style={{
                        backgroundColor: '#FFFFFF',
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
                      <span>Comments 0</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPlacementGoing(!placementGoing)
                        handleInteractiveGoing('Placement Drive')
                      }}
                      style={{
                        backgroundColor: '#D5FF38',
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
                      <Check width={11} height={11} strokeWidth={3} />
                      <span>Going {placementGoing ? 1 : 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Floating Bento Cards at the Bottom */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
                marginTop: -44,
                position: 'relative',
                zIndex: 4,
                padding: '0 10px',
              }}
            >
              {/* Floating Card 1: Electric Blue (#3C5BFF) - Annual Cultural Fest */}
              <div
                style={{
                  backgroundColor: '#3C5BFF',
                  color: '#FFFFFF',
                  borderRadius: 22,
                  padding: 18,
                  boxShadow: '0 16px 36px rgba(60,91,255,0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              >
                <div>
                  <span
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#3C5BFF',
                      borderRadius: 9999,
                      padding: '2px 8px',
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      display: 'inline-block',
                      marginBottom: 8,
                    }}
                  >
                    EVENT
                  </span>

                  <h4 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                    Annual Cultural Fest
                  </h4>

                  <p style={{ margin: '0 0 8px', fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                    Buckle up! The annual cultural fest - MAITRI 2026 is about to arrive in style
                  </p>

                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
                    🕒 14 October 2026 · 12:11 PM
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCulturalLiked(!culturalLiked)
                      handleInteractiveLike('Annual Cultural Fest')
                    }}
                    style={{
                      backgroundColor: '#FA78B9',
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
                    <Heart width={11} height={11} fill="#111111" />
                    <span>Liked {culturalLiked ? 2 : 1}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student')}
                    style={{
                      backgroundColor: '#FFFFFF',
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
                    <span>Comments 2</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCulturalRsvp(!culturalRsvp)
                      handleInteractiveGoing('Annual Cultural Fest')
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#111111',
                      border: 'none',
                      borderRadius: 9999,
                      padding: '4px 10px',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <span>RSVP {culturalRsvp ? 1 : 0}</span>
                  </button>
                </div>
              </div>

              {/* Floating Card 2: Acid Lime (#D5FF38) - Campus Recruitment Drive */}
              <div
                style={{
                  backgroundColor: '#D5FF38',
                  color: '#111111',
                  borderRadius: 22,
                  padding: 18,
                  boxShadow: '0 16px 36px rgba(0,0,0,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '2px solid #111111',
                }}
              >
                <div>
                  <span
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#111111',
                      borderRadius: 9999,
                      padding: '2px 8px',
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      display: 'inline-block',
                      marginBottom: 8,
                      border: '1px solid #111111',
                    }}
                  >
                    PLACEMENT
                  </span>

                  <h4 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 900, letterSpacing: '-0.02em', color: '#111111' }}>
                    Campus Recruitment Drive
                  </h4>

                  <p style={{ margin: '0 0 8px', fontSize: 12, color: '#1A1A1A', lineHeight: 1.4, fontWeight: 500 }}>
                    Final-year students can register for the upcoming recruitment drive at the placement cell.
                  </p>

                  <div style={{ fontSize: 11, color: '#4B5563', fontWeight: 600 }}>
                    🕒 12 October 2026 · 11:00 AM
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setRecruitmentLiked(!recruitmentLiked)
                      handleInteractiveLike('Campus Recruitment Drive')
                    }}
                    style={{
                      backgroundColor: '#FA78B9',
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
                    <Heart width={11} height={11} fill="#111111" />
                    <span>Liked {recruitmentLiked ? 2 : 1}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student')}
                    style={{
                      backgroundColor: '#FFFFFF',
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
                    <span>Comments 0</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Row — 3 Bento Feature Cards */}
        <section
          id="features"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {/* Card 1: For Students (Black #111111) */}
          <div
            onClick={() => handleQuickLogin('student')}
            style={{
              backgroundColor: '#111111',
              color: '#FFFFFF',
              borderRadius: 26,
              padding: 26,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease',
            }}
          >
            <div>
              {/* Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      backgroundColor: '#D5FF38',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#111111',
                    }}
                  >
                    <GraduationCap width={26} height={26} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                      For Students
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>
                      Get the latest updates, events, placements and more.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 16,
                  }}
                >
                  →
                </div>
              </div>

              {/* 2 Rows of White Pill Tags */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ backgroundColor: '#FFFFFF', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Announcements
                  </span>
                  <span style={{ backgroundColor: '#FFFFFF', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Events
                  </span>
                  <span style={{ backgroundColor: '#FFFFFF', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Placements
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ backgroundColor: '#FFFFFF', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Academic
                  </span>
                  <span style={{ backgroundColor: '#FFFFFF', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Bookmarks
                  </span>
                  <span style={{ backgroundColor: '#FFFFFF', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Personalized Feed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: For Faculty (White #FFFFFF) */}
          <div
            onClick={() => handleQuickLogin('faculty')}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#111111',
              border: '2px solid #E5E7EB',
              borderRadius: 26,
              padding: 26,
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease',
            }}
          >
            <div>
              {/* Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      backgroundColor: '#FA78B9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#111111',
                    }}
                  >
                    <Presentation width={26} height={26} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#111111', letterSpacing: '-0.02em' }}>
                      For Faculty
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>
                      Publish notices, reach students and track engagement.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    color: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 16,
                  }}
                >
                  →
                </div>
              </div>

              {/* 2 Rows of Pill Tags with Gray Border */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D1D5DB', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Create Notices
                  </span>
                  <span style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D1D5DB', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Templates
                  </span>
                  <span style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D1D5DB', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Audience Reach
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D1D5DB', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Student Preview
                  </span>
                  <span style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D1D5DB', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Drafts
                  </span>
                  <span style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #D1D5DB', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Engagement Analytics
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: For Administrators (Electric Blue #3C5BFF) */}
          <div
            onClick={() => handleQuickLogin('admin')}
            style={{
              backgroundColor: '#3C5BFF',
              color: '#FFFFFF',
              borderRadius: 26,
              padding: 26,
              boxShadow: '0 8px 24px rgba(60,91,255,0.25)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease',
            }}
          >
            <div>
              {/* Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      backgroundColor: '#2642DE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                    }}
                  >
                    <BarChart3 width={26} height={26} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                      For Administrators
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                      Review, approve and manage campus communications.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    color: '#3C5BFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 16,
                  }}
                >
                  →
                </div>
              </div>

              {/* 2 Rows of White Pill Tags */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Approval Queue
                  </span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Analytics
                  </span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Role Management
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Readership Stats
                  </span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    Audit Logs
                  </span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#111111', borderRadius: 9999, padding: '6px 14px', fontSize: 12, fontWeight: 700 }}>
                    System Control
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Watch Demo Modal */}
      {showDemoModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowDemoModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 28,
              border: '2px solid #111111',
              maxWidth: 540,
              width: '100%',
              padding: '32px 28px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowDemoModal(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6B7280',
              }}
            >
              <X width={20} height={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#D5FF38',
                  border: '1.5px solid #111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play width={16} height={16} fill="#111111" />
              </div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>CampusVoice Interactive Demo</h3>
            </div>

            <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.5, margin: '0 0 20px' }}>
              Experience the verified academic communication platform. Choose a role below to jump right into the simulated live workspace:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <GraduationCap width={18} height={18} color="#D5FF38" />
                  <span>Launch Student Feed</span>
                </div>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('faculty')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  borderRadius: 16,
                  border: '2px solid #E5E7EB',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Presentation width={18} height={18} color="#FA78B9" />
                  <span>Enter Faculty Workspace</span>
                </div>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  backgroundColor: '#3C5BFF',
                  color: '#FFFFFF',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BarChart3 width={18} height={18} color="#FFFFFF" />
                  <span>Open Admin Approval Console</span>
                </div>
                <span>→</span>
              </button>
            </div>

            <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', fontWeight: 600 }}>
              ⚡ Instant 1-click test accounts with pre-loaded notices, bookmarks & analytics.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
