'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowUpRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Calendar,
  Layers,
  Clock,
  Radio,
  FileCheck2,
  Lock,
  Pin,
  Heart,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Role } from '@/types'
import { BrandLogo } from '@/components/ui/BrandLogo'

export default function RootPage() {
  const router = useRouter()
  const { role, isAuthenticated, login } = useStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${role}`)
    }
  }, [isAuthenticated, role, router])

  const handleQuickLogin = (targetRole: Role) => {
    login(targetRole)
    router.push(`/${targetRole}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)', color: 'var(--text-1)' }}>
      {/* Top Navigation - Panel 1 */}
      <header
        style={{
          borderBottom: '2px solid var(--border)',
          background: 'var(--bg-surface)',
          padding: '14px 28px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <BrandLogo subtitle="Verified Updates. A Stronger Campus." />

          {/* Center Nav Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
            }}
            className="hidden-mobile"
          >
            <a href="#hero" style={{ textDecoration: 'none', color: '#111111', fontWeight: 700, fontSize: 14 }}>
              Home
            </a>
            <a href="#features" style={{ textDecoration: 'none', color: '#737373', fontWeight: 600, fontSize: 14 }}>
              Features
            </a>
            <a href="#roles" style={{ textDecoration: 'none', color: '#737373', fontWeight: 600, fontSize: 14 }}>
              Roles
            </a>
            <a href="#architecture" style={{ textDecoration: 'none', color: '#737373', fontWeight: 600, fontSize: 14 }}>
              Architecture
            </a>
          </nav>

          {/* Right Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/login"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--text-1)',
                textDecoration: 'none',
                padding: '8px 14px',
              }}
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              style={{
                background: 'var(--accent-lime)',
                color: '#111111',
                border: '2px solid var(--border)',
                borderRadius: '9999px',
                padding: '10px 22px',
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px 80px' }}>
        {/* Hero Section - Split Layout matching Panel 1 */}
        <section
          id="hero"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 48,
            alignItems: 'center',
            marginBottom: 64,
          }}
        >
          {/* Left Column: Oversized typography & CTAs */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#ffffff',
                border: '2px solid var(--border)',
                borderRadius: '9999px',
                padding: '6px 16px',
                fontSize: 12,
                fontWeight: 800,
                color: '#111111',
                marginBottom: 24,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-lime)', border: '1px solid #111111' }} />
              <span>Verified Campus Intelligence · Live 2026</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(40px, 5.5vw, 68px)',
                lineHeight: 1.02,
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#111111',
                margin: '0 0 20px',
              }}
            >
              Important<br />
              campus updates.<br />
              Verified.
            </h1>

            <p
              style={{
                fontSize: 'clamp(16px, 1.8vw, 19px)',
                lineHeight: 1.5,
                color: 'var(--text-2)',
                margin: '0 0 32px',
                maxWidth: 480,
                fontWeight: 500,
              }}
            >
              Stay informed with verified announcements, events and notices — all in one place.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                style={{
                  background: 'var(--accent-lime)',
                  color: '#111111',
                  border: '2px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '14px 32px',
                  fontWeight: 900,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(213,255,56,0.3)',
                }}
              >
                Get Started
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                style={{
                  background: '#ffffff',
                  color: '#111111',
                  border: '2px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '14px 28px',
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Column: Floating Dark Card Mockup - Panel 1 */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Floating Pills around the card */}
            <div
              style={{
                position: 'absolute',
                top: -16,
                right: 32,
                background: 'var(--accent-blue)',
                color: '#ffffff',
                border: '2px solid var(--border)',
                borderRadius: '9999px',
                padding: '6px 16px',
                fontSize: 12,
                fontWeight: 900,
                zIndex: 3,
                boxShadow: '0 4px 12px rgba(60,91,255,0.25)',
              }}
            >
              ⚡ Events
            </div>

            <div
              style={{
                position: 'absolute',
                top: 48,
                right: -10,
                background: 'var(--accent-pink)',
                color: '#111111',
                border: '2px solid var(--border)',
                borderRadius: '9999px',
                padding: '6px 16px',
                fontSize: 12,
                fontWeight: 900,
                zIndex: 3,
                boxShadow: '0 4px 12px rgba(250,120,185,0.25)',
              }}
            >
              🎓 Placements
            </div>

            {/* Main Black Container Card */}
            <div
              style={{
                background: 'var(--bg-dark)',
                color: '#ffffff',
                border: '2px solid var(--border)',
                borderRadius: 28,
                padding: '24px 24px 32px',
                width: '100%',
                maxWidth: 420,
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <BrandLogo compact subtitle="" />
                <span
                  style={{
                    background: 'rgba(213,255,56,0.15)',
                    color: 'var(--accent-lime)',
                    border: '1.5px solid var(--accent-lime)',
                    borderRadius: '9999px',
                    padding: '2px 10px',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  LIVE FEED
                </span>
              </div>

              {/* Notice 1 inside mockup */}
              <div
                style={{
                  background: '#1A1A1A',
                  border: '1.5px solid #282828',
                  borderRadius: 20,
                  padding: 18,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span
                    style={{
                      background: '#ffffff',
                      color: '#111111',
                      borderRadius: '9999px',
                      padding: '2px 10px',
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                    }}
                  >
                    General
                  </span>
                  <span style={{ color: 'var(--accent-lime)', fontSize: 11, fontWeight: 700 }}>
                    📌 Pinned
                  </span>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 900, color: '#ffffff' }}>
                  Annual Cultural Fest
                </h3>
                <div style={{ fontSize: 12, color: '#A0A0A0' }}>
                  Oct 14 · 12:00 PM
                </div>
              </div>

              {/* Notice 2 inside mockup */}
              <div
                style={{
                  background: '#1A1A1A',
                  border: '1.5px solid #282828',
                  borderRadius: 20,
                  padding: 18,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span
                    style={{
                      background: 'var(--accent-pink)',
                      color: '#111111',
                      borderRadius: '9999px',
                      padding: '2px 10px',
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                    }}
                  >
                    Placement
                  </span>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 900, color: '#ffffff' }}>
                  Placement Drive
                </h3>
                <div style={{ fontSize: 12, color: '#A0A0A0' }}>
                  Oct 15 · 10:00 AM
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Role Bento Cards - Style Guide Panel 1 Bottom Row */}
        <section
          id="roles"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
            marginBottom: 72,
          }}
        >
          {/* Card 1: Acid Lime - For Students */}
          <div
            style={{
              background: 'var(--accent-lime)',
              color: '#111111',
              border: '2px solid var(--border)',
              borderRadius: 26,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 180,
              boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <GraduationCap width={20} height={20} />
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>
                  For Students
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.8)', lineHeight: 1.4 }}>
                Get the latest updates, events and opportunities.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              style={{
                marginTop: 20,
                alignSelf: 'flex-start',
                background: 'none',
                border: 'none',
                padding: 0,
                fontWeight: 900,
                fontSize: 14,
                color: '#111111',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'underline',
              }}
            >
              Enter as Student →
            </button>
          </div>

          {/* Card 2: Bubblegum Pink - For Faculty */}
          <div
            style={{
              background: 'var(--accent-pink)',
              color: '#111111',
              border: '2px solid var(--border)',
              borderRadius: 26,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 180,
              boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <FileCheck2 width={20} height={20} />
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>
                  For Faculty
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.8)', lineHeight: 1.4 }}>
                Publish notices, reach students and track engagement.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleQuickLogin('faculty')}
              style={{
                marginTop: 20,
                alignSelf: 'flex-start',
                background: 'none',
                border: 'none',
                padding: 0,
                fontWeight: 900,
                fontSize: 14,
                color: '#111111',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'underline',
              }}
            >
              Enter as Faculty →
            </button>
          </div>

          {/* Card 3: Electric Blue - For Administrators */}
          <div
            style={{
              background: 'var(--accent-blue)',
              color: '#ffffff',
              border: '2px solid var(--border)',
              borderRadius: 26,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 180,
              boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <ShieldCheck width={20} height={20} />
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  For Administrators
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                Review, approve and manage campus communications.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              style={{
                marginTop: 20,
                alignSelf: 'flex-start',
                background: 'none',
                border: 'none',
                padding: 0,
                fontWeight: 900,
                fontSize: 14,
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'underline',
              }}
            >
              Enter as Admin →
            </button>
          </div>
        </section>

        {/* The Problem vs The Solution Cards */}
        <section style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Problem Card */}
          <div
            style={{
              border: '3px solid var(--border)',
              background: '#FFF5F5',
              padding: 28,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: 'var(--accent-red)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 900,
                textTransform: 'uppercase',
                padding: '3px 8px',
                border: '1.5px solid #000',
                marginBottom: 14,
              }}
            >
              The Problem Today
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', margin: '0 0 12px' }}>
              Chaotic, Fragmented Channels
            </h2>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, fontSize: 14, fontWeight: 500, color: 'var(--text-2)' }}>
              <li><strong>WhatsApp groups</strong> are flooded with memes, spam, and unverified forwarded PDFs.</li>
              <li><strong>Critical exam venue changes</strong> get buried under 300 messages within minutes.</li>
              <li><strong>Physical notice boards</strong> are inaccessible to commuters and remote students.</li>
              <li><strong>Faculty & departments</strong> lack delivery tracking or confirmed student read verification.</li>
            </ul>
          </div>

          {/* Solution Card */}
          <div
            style={{
              border: '3px solid var(--border)',
              background: 'var(--neo-secondary)',
              padding: 28,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: '#000',
                color: '#FFD93D',
                fontSize: 11,
                fontWeight: 900,
                textTransform: 'uppercase',
                padding: '3px 8px',
                border: '1.5px solid #000',
                marginBottom: 14,
              }}
            >
              The Campus Voice Way
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', margin: '0 0 12px' }}>
              Verified, Noise-Free Stream
            </h2>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, fontSize: 14, fontWeight: 700, color: '#000' }}>
              <li><strong>100% verified publishers:</strong> Every update is approved by the central academic office.</li>
              <li><strong>Cohort precision:</strong> Year 2 Design only sees Year 2 Design circulars and university alerts.</li>
              <li><strong>Live cross-tab broadcast:</strong> Instant notification across open windows when urgent alerts drop.</li>
              <li><strong>1-Click Calendar Sync:</strong> Download RFC-compliant .ics files directly to Apple/Google calendars.</li>
            </ul>
          </div>
        </section>

        {/* 3 User Roles in Harmony */}
        <section style={{ marginTop: 72 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', margin: '0 0 8px' }}>
              Engineered for Three Campus Roles
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: 14, fontWeight: 500 }}>
              Tailored workspaces designed around each stakeholder's daily responsibilities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {/* Role 1: Students */}
            <div
              style={{
                border: '3px solid var(--border)',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-sm)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: 'var(--neo-secondary)',
                      border: '2px solid #000',
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <GraduationCap width={16} height={16} />
                  </div>
                  <strong style={{ fontSize: 16, textTransform: 'uppercase', fontWeight: 900 }}>Students</strong>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 16px' }}>
                  A noise-free feed tailored to your department and year. Pinned urgent banner, deadlines countdown, reading streak, and bookmark shelf.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickLogin('student')}
              >
                Enter as Student →
              </Button>
            </div>

            {/* Role 2: Faculty */}
            <div
              style={{
                border: '3px solid var(--border)',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-sm)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: 'var(--neo-muted)',
                      border: '2px solid #000',
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <FileCheck2 width={16} height={16} />
                  </div>
                  <strong style={{ fontSize: 16, textTransform: 'uppercase', fontWeight: 900 }}>Faculty Members</strong>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 16px' }}>
                  Guided notice composer with live Student Preview, instant reach estimator (e.g. 1,206 students), and one-click templates for exams and events.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickLogin('faculty')}
              >
                Enter as Faculty →
              </Button>
            </div>

            {/* Role 3: Admin */}
            <div
              style={{
                border: '3px solid var(--border)',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-sm)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: 'var(--neo-accent)',
                      border: '2px solid #000',
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <ShieldCheck width={16} height={16} />
                  </div>
                  <strong style={{ fontSize: 16, textTransform: 'uppercase', fontWeight: 900 }}>Administration</strong>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 16px' }}>
                  Centralized approval queue with inline Approve/Reject, required audit logs, verified readership charts, and role access management.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleQuickLogin('admin')}
              >
                Enter as Admin →
              </Button>
            </div>
          </div>
        </section>

        {/* 6 Key Architecture & Frontend Features */}
        <section style={{ marginTop: 72 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', margin: '0 0 8px' }}>
              6 Production-Grade Frontend Features
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: 14, fontWeight: 500 }}>
              Engineered with strict client-state reliability, accessibility, and zero data drift.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
            {[
              {
                icon: Layers,
                title: 'Single Store Selector Layer',
                desc: 'All badges, KPI cards, and charts calculate from one selector layer, eliminating count mismatches forever.',
              },
              {
                icon: Radio,
                title: 'Live Cross-Tab BroadcastChannel',
                desc: 'Faculty submits in Window A, Admin approves in Window B, and Student Window C receives instant alert without refreshing.',
              },
              {
                icon: Calendar,
                title: 'Full Calendar .ics Generator',
                desc: 'RFC-compliant iCalendar engine downloads single events or the entire visible month with one click.',
              },
              {
                icon: Clock,
                title: 'Relative Date Anchor Engine',
                desc: 'Seed dates calculate relative to live runtime, ensuring recent notices, due dates, and streaks never show stale data.',
              },
              {
                icon: Lock,
                title: 'Role-Gated Neo-Brutalist Cards',
                desc: 'Dedicated card variants per role: students see bookmark/read toggles; admins see inline approval/rejection workflows.',
              },
              {
                icon: Sparkles,
                title: 'Self-Hosted Offline PWA',
                desc: 'Self-hosted Space Grotesk fonts, web manifest, offline service shell, and WCAG AA contrast compliance.',
              },
            ].map((feat, i) => {
              const Icon = feat.icon
              return (
                <div
                  key={i}
                  style={{
                    border: '2.5px solid var(--border)',
                    background: 'var(--bg-surface)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: 'var(--neo-secondary)',
                      border: '2px solid #000',
                      boxShadow: '2px 2px 0 0 #000',
                      display: 'grid',
                      placeItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <Icon width={18} height={18} />
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 900, textTransform: 'uppercase' }}>
                    {feat.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, fontWeight: 500 }}>
                    {feat.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* How it Works in 3 Steps */}
        <section
          style={{
            marginTop: 72,
            border: '3.5px solid var(--border)',
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-lg)',
            padding: '36px 32px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, textTransform: 'uppercase', margin: '0 0 6px' }}>
              How It Works In 3 Simple Steps
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
              From Faculty Submission to Enrolled Student Devices in Seconds
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            <div style={{ borderLeft: '4px solid var(--neo-accent)', paddingLeft: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-red)' }}>
                Step 01
              </div>
              <h3 style={{ margin: '4px 0 6px', fontSize: 18, fontWeight: 900, textTransform: 'uppercase' }}>
                Draft Notice
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                Faculty selects a template (exam, fee, event), attaches PDFs, and specifies the targeted cohort with real-time reach calculation.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid var(--neo-secondary)', paddingLeft: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#000' }}>
                Step 02
              </div>
              <h3 style={{ margin: '4px 0 6px', fontSize: 18, fontWeight: 900, textTransform: 'uppercase' }}>
                Admin Approves
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                Dean's office inspects submission in the Approval Queue and clicks Approve (or Rejects with a mandatory recorded audit reason).
              </p>
            </div>

            <div style={{ borderLeft: '4px solid var(--accent-green)', paddingLeft: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: 'var(--chip-green-fg)' }}>
                Step 03
              </div>
              <h3 style={{ margin: '4px 0 6px', fontSize: 18, fontWeight: 900, textTransform: 'uppercase' }}>
                Instant Delivery
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                Students receive sticky urgent alerts, bell badges update, calendar entries sync, and desktop notifications trigger immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section
          style={{
            marginTop: 64,
            background: 'var(--neo-secondary)',
            border: '3.5px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
            padding: '40px 24px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 12px' }}>
            Ready to explore Campus Voice?
          </h2>
          <p style={{ fontSize: 15, fontWeight: 700, margin: '0 auto 24px', maxWidth: 540 }}>
            Jump directly into the fully-populated mock workspace and test all three roles live.
          </p>
          <Button
            variant="primary"
            size="lg"
            iconRight={ArrowUpRight}
            onClick={() => handleQuickLogin('student')}
          >
            Launch Interactive Demo Now
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '3px solid var(--border)',
          background: 'var(--bg-surface)',
          padding: '24px',
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: 'var(--text-3)',
        }}
      >
        <div>Campus Voice · National Design Institute Updates Workspace · Demo Version 2.4</div>
        <div style={{ marginTop: 6, fontSize: 11, opacity: 0.8 }}>
          Judge-Ready Frontend Edition · Fully decoupled mock service layer (lib/api.ts)
        </div>
      </footer>
    </div>
  )
}
