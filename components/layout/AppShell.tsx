'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { MobileBar } from './MobileBar'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { useStore } from '@/lib/store'
import { AlertTriangle, X, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    role,
    updates,
    dismissedUrgentIds,
    dismissUrgent,
    sidebarCollapsed,
  } = useStore()

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password')

  // Global keyboard shortcuts (⌘F / Ctrl+F / ⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'f' || e.key === 'k')) {
        e.preventDefault()
        router.push('/search')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  // Active unread urgent updates for student
  const activeUrgentUpdates = updates.filter(
    (u) =>
      u.priority === 'Urgent' &&
      !u.read &&
      !dismissedUrgentIds.includes(u.id) &&
      u.status === 'Published'
  )

  if (isAuthPage) {
    return (
      <div className="auth-shell">
        <ToastContainer />
        {children}
      </div>
    )
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <ToastContainer />
      <Sidebar />

      <main className="main-panel">
        {/* Sticky Orange Urgent Banner for Students with exit animation */}
        <AnimatePresence>
          {role === 'student' && activeUrgentUpdates.length > 0 && (
            <motion.div
              key={activeUrgentUpdates[0].id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="sticky-urgent-banner"
              role="alert"
            >
              <div className="urgent-banner-inner">
                <div className="urgent-banner-left">
                  <AlertTriangle width={16} height={16} className="urgent-banner-icon" />
                  <span>
                    <strong>Urgent Notice:</strong> {activeUrgentUpdates[0].title}
                  </span>
                </div>
                <div className="urgent-banner-actions">
                  <Link
                    href={`/student/updates/${activeUrgentUpdates[0].id}`}
                    className="urgent-banner-link"
                  >
                    <span>Review now</span>
                    <ArrowUpRight width={12} height={12} />
                  </Link>
                  <button
                    type="button"
                    className="urgent-banner-dismiss"
                    aria-label="Dismiss this urgent banner"
                    onClick={() => dismissUrgent(activeUrgentUpdates[0].id)}
                  >
                    <X width={14} height={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="page">{children}</div>
      </main>

      <MobileBar />
    </div>
  )
}
