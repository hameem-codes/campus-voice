'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  Inbox,
  CalendarDays,
  Bookmark,
  UserRound,
  FilePlus2,
  LineChart,
  Users,
  SlidersHorizontal,
  Settings2,
  Menu,
  X,
  ShieldCheck,
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  Search,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Role } from '@/types'

export function MobileBar() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    role,
    setRole,
    currentUser,
    studentUnreadCount,
    savedCount,
    facultyNoticesCount,
    adminMetrics,
    theme,
    toggleTheme,
    logout,
  } = useStore()

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)

  const allItemsForRole = {
    student: [
      { href: '/student', label: 'Home', icon: Home },
      { href: '/student/updates', label: 'Updates', icon: Inbox, count: studentUnreadCount },
      { href: '/student/calendar', label: 'Calendar', icon: CalendarDays },
      { href: '/student/saved', label: 'Saved', icon: Bookmark, count: savedCount },
      { href: '/student/profile', label: 'Profile', icon: UserRound },
    ],
    faculty: [
      { href: '/faculty', label: 'Home', icon: Home },
      { href: '/faculty/create', label: 'Create', icon: FilePlus2 },
      { href: '/faculty/updates', label: 'My Notices', icon: Inbox, count: facultyNoticesCount },
      { href: '/faculty/analytics', label: 'Analytics', icon: LineChart },
    ],
    admin: [
      { href: '/admin', label: 'Home', icon: Home },
      { href: '/admin/updates', label: 'Notices', icon: Inbox, count: adminMetrics.pendingCount },
      { href: '/admin/create', label: 'Create update', icon: FilePlus2 },
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/setup', label: 'Setup', icon: SlidersHorizontal },
      { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
      { href: '/admin/logs', label: 'Logs', icon: Settings2 },
    ],
  }[role]

  // Primary 4 items on the bar
  const primaryItems = allItemsForRole.slice(0, 4)

  const handleRoleSwitch = (nextRole: Role) => {
    setRole(nextRole)
    setBottomSheetOpen(false)
    router.push(`/${nextRole}`)
  }

  return (
    <>
      <nav className="mobile-bar" aria-label="Mobile navigation">
        {primaryItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <div style={{ position: 'relative' }}>
                <Icon />
                {item.count && item.count > 0 ? <span className="mobile-badge" /> : null}
              </div>
              <span>{item.label}</span>
            </Link>
          )
        })}

        <button
          type="button"
          className={`mobile-nav-item ${bottomSheetOpen ? 'active' : ''}`}
          onClick={() => setBottomSheetOpen(true)}
          aria-label="Open full menu"
        >
          <Menu />
          <span>More</span>
        </button>
      </nav>

      {/* "More" Bottom Sheet */}
      {bottomSheetOpen && (
        <div
          className="bottom-sheet-backdrop"
          onClick={() => setBottomSheetOpen(false)}
          role="presentation"
        >
          <div
            className="bottom-sheet-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="More navigation links"
          >
            <div className="bottom-sheet-header">
              <div>
                <strong>Navigation & Roles</strong>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {currentUser.name} · {role.toUpperCase()}
                </div>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setBottomSheetOpen(false)}
                aria-label="Close menu"
              >
                <X width={16} height={16} />
              </button>
            </div>

            <div className="bottom-sheet-section">
              <div className="bottom-sheet-label">All {role} pages</div>
              <div className="bottom-sheet-grid">
                {allItemsForRole.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`bottom-sheet-link ${isActive ? 'active' : ''}`}
                      onClick={() => setBottomSheetOpen(false)}
                    >
                      <Icon width={16} height={16} />
                      <span>{item.label}</span>
                      {item.count && item.count > 0 ? (
                        <span className="nav-count" style={{ marginLeft: 'auto' }}>
                          {item.count}
                        </span>
                      ) : null}
                    </Link>
                  )
                })}
                <Link
                  href="/search"
                  className="bottom-sheet-link"
                  onClick={() => setBottomSheetOpen(false)}
                >
                  <Search width={16} height={16} />
                  <span>Global Search</span>
                </Link>
              </div>
            </div>

            <div className="bottom-sheet-section">
              <div className="bottom-sheet-label">Switch Workspace Role</div>
              <div className="bottom-sheet-role-group">
                <button
                  type="button"
                  className={`bottom-sheet-role-btn ${role === 'student' ? 'active' : ''}`}
                  onClick={() => handleRoleSwitch('student')}
                >
                  <UserRound width={16} height={16} />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  className={`bottom-sheet-role-btn ${role === 'faculty' ? 'active' : ''}`}
                  onClick={() => handleRoleSwitch('faculty')}
                >
                  <GraduationCap width={16} height={16} />
                  <span>Faculty</span>
                </button>
                <button
                  type="button"
                  className={`bottom-sheet-role-btn ${role === 'admin' ? 'active' : ''}`}
                  onClick={() => handleRoleSwitch('admin')}
                >
                  <ShieldCheck width={16} height={16} />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            <div className="bottom-sheet-footer">
              <button
                type="button"
                className="btn secondary small"
                onClick={toggleTheme}
                style={{ flex: 1 }}
              >
                {theme === 'dark' ? <Sun width={14} height={14} /> : <Moon width={14} height={14} />}
                <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
              <button
                type="button"
                className="btn ghost small"
                onClick={() => {
                  setBottomSheetOpen(false)
                  logout()
                  router.push('/login')
                }}
              >
                <LogOut width={14} height={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
