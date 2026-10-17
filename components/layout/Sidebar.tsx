'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
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
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  MessageSquareText,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  Compass,
  Megaphone,
} from 'lucide-react'
import { Role } from '@/types'
import { useStore } from '@/lib/store'
import {
  getBrowserNotificationPermission,
  requestBrowserNotification,
  NotificationPermissionState,
} from '@/lib/notifications'

interface NavItemDef {
  href: string
  label: string
  icon: LucideIcon
  badgeKey?: 'updates' | 'saved'
}

const roleNavMap: Record<Role, NavItemDef[]> = {
  student: [
    { href: '/student', label: 'Announcements', icon: Megaphone },
    { href: '/student/explore', label: 'Explore Campus', icon: Compass },
    { href: '/student/activity', label: 'My Activity', icon: UserRound },
    { href: '/student/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/student/saved', label: 'Saved', icon: Bookmark, badgeKey: 'saved' },
    { href: '/student/profile', label: 'Profile', icon: UserRound },
  ],
  faculty: [
    { href: '/faculty', label: 'Home', icon: Home },
    { href: '/faculty/create', label: 'New notice', icon: FilePlus2 },
    { href: '/faculty/updates', label: 'My notices', icon: Inbox, badgeKey: 'updates' },
    { href: '/faculty/analytics', label: 'Analytics', icon: LineChart },
  ],
  admin: [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/updates', label: 'Notices', icon: Inbox, badgeKey: 'updates' },
    { href: '/admin/create', label: 'New notice', icon: FilePlus2 },
    { href: '/admin/users', label: 'People', icon: Users },
    { href: '/admin/setup', label: 'Settings', icon: SlidersHorizontal },
    { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
    { href: '/admin/logs', label: 'Activity log', icon: Settings2 },
  ],
}

const roleConfigs: {
  key: Role
  label: string
  roleTitle: string
  icon: LucideIcon
  defaultRoute: string
}[] = [
  {
    key: 'student',
    label: 'Student',
    roleTitle: 'Aarav Mehta',
    icon: UserRound,
    defaultRoute: '/student',
  },
  {
    key: 'faculty',
    label: 'Faculty',
    roleTitle: 'Dr. Maya Rao',
    icon: GraduationCap,
    defaultRoute: '/faculty',
  },
  {
    key: 'admin',
    label: 'Admin',
    roleTitle: 'Priya Nair',
    icon: ShieldCheck,
    defaultRoute: '/admin',
  },
]

export function Sidebar() {
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
    sidebarCollapsed,
    toggleSidebar,
    theme,
    toggleTheme,
    logout,
    addToast,
    t,
  } = useStore()

  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [alertPerm, setAlertPerm] = useState<NotificationPermissionState>(() =>
    getBrowserNotificationPermission()
  )

  // Compute live nav badges strictly from selector layer
  let updatesBadgeCount = 0
  if (role === 'student') {
    updatesBadgeCount = studentUnreadCount
  } else if (role === 'faculty') {
    updatesBadgeCount = facultyNoticesCount
  } else if (role === 'admin') {
    updatesBadgeCount = adminMetrics.pendingCount
  }
  const savedBadgeCount = savedCount

  const currentRoleCfg = roleConfigs.find((r) => r.key === role) || roleConfigs[0]
  const navItems = roleNavMap[role]

  const getNavLabel = (item: NavItemDef) => {
    switch (item.href) {
      case '/student':
        return 'Announcements'
      case '/faculty':
        return t('navHome')
      case '/student/updates':
        return t('navUpdates')
      case '/student/calendar':
        return t('navCalendar')
      case '/student/saved':
        return t('navSaved')
      case '/student/profile':
        return t('navProfile')
      case '/faculty/create':
      case '/admin/create':
        return t('navCreate')
      case '/faculty/updates':
        return t('navNotices')
      case '/faculty/analytics':
      case '/admin/analytics':
        return t('navAnalytics')
      case '/admin':
        return t('navHome')
      case '/admin/updates':
        return t('navUpdates')
      case '/admin/users':
        return t('navUsers')
      case '/admin/setup':
        return t('navSetup')
      case '/admin/logs':
        return t('navLogs')
      default:
        return item.label
    }
  }

  const handleRoleSelect = (nextRole: Role) => {
    setRole(nextRole)
    setRoleMenuOpen(false)
    const target = roleConfigs.find((r) => r.key === nextRole)?.defaultRoute || `/${nextRole}`
    router.push(target)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/search')
    }
  }

  return (
    <aside
      className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      aria-label="Main sidebar"
    >
      {/* Brand & collapse */}
      <div className="workspace">
        <Link
          href={currentRoleCfg.defaultRoute}
          className="brand-link"
          style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}
        >
          <div className="brand-mark">
            <MessageSquareText />
          </div>
          {!sidebarCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="brand-name" style={{ whiteSpace: 'nowrap' }}>Campus Voice</div>
              <div className="brand-subtitle" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Design Institute</div>
            </div>
          )}
        </Link>
        <button
          type="button"
          className="icon-button"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={toggleSidebar}
          style={{ marginLeft: 'auto' }}
        >
          {sidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </button>
      </div>

      {/* Global search */}
      {!sidebarCollapsed ? (
        <form onSubmit={handleSearchSubmit} className="sidebar-search">
          <Search />
          <input
            aria-label="Search workspace"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="shortcut">⌘ F</span>
        </form>
      ) : (
        <button
          type="button"
          className="icon-button sidebar-collapsed-btn"
          aria-label="Global search"
          onClick={() => router.push('/search')}
        >
          <Search />
        </button>
      )}

      {/* Role label */}
      {!sidebarCollapsed && (
        <div className="nav-section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <currentRoleCfg.icon width={12} height={12} />
          <span>{currentRoleCfg.label}</span>
        </div>
      )}

      {/* Navigation List */}
      <nav className="nav-list" aria-label={`${currentRoleCfg.label} navigation`}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === currentRoleCfg.defaultRoute
              ? pathname === item.href
              : pathname.startsWith(item.href)

          let countBadge: string | number | undefined
          if (item.badgeKey === 'updates') {
            countBadge = updatesBadgeCount > 0 ? updatesBadgeCount : undefined
          } else if (item.badgeKey === 'saved') {
            countBadge = savedBadgeCount > 0 ? savedBadgeCount : undefined
          }

          const labelText = getNavLabel(item)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={sidebarCollapsed ? labelText : undefined}
            >
              <Icon />
              {!sidebarCollapsed && (
                <>
                  <span className="nav-item-label">{labelText}</span>
                  {countBadge !== undefined && (
                    <span className="nav-count">{countBadge}</span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="sidebar-spacer" />

      {/* Neo-brutalist Promo Sticker Card */}
      {!sidebarCollapsed && role === 'student' && (
        <div
          style={{
            background: 'var(--neo-secondary)',
            border: '2.5px solid #000',
            boxShadow: 'var(--shadow-sm)',
            padding: '12px 14px',
            marginBottom: '4px',
            color: '#000',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#000',
                color: '#FFD93D',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Sparkles width={13} height={13} />
            </div>
            <strong style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 900 }}>
              Instant Alerts
            </strong>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, lineHeight: '15px' }}>
            Never miss urgent exam or fee deadlines.
          </p>
          <button
            type="button"
            onClick={async () => {
              const res = await requestBrowserNotification()
              setAlertPerm(res)
              if (res === 'granted') {
                addToast({
                  type: 'success',
                  title: 'Instant alerts activated',
                  message: 'Your browser will now receive desktop notifications for urgent notices.',
                })
              } else if (res === 'denied') {
                addToast({
                  type: 'error',
                  title: 'Notification permission blocked',
                  message: 'Please unblock notifications in your browser address bar settings.',
                })
              }
            }}
            style={{
              width: '100%',
              display: 'block',
              textAlign: 'center',
              background: alertPerm === 'granted' ? 'var(--chip-green-bg)' : '#000',
              color: alertPerm === 'granted' ? '#000' : '#fff',
              border: '2px solid #000',
              boxShadow: '2px 2px 0 0 #000',
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
            }}
          >
            {alertPerm === 'granted' ? '✓ Alerts Active' : 'Turn on alerts →'}
          </button>
        </div>
      )}

      {/* Role Switcher panel (3-way: Student, Faculty, Admin) */}
      <div className="role-panel">
        {!sidebarCollapsed && <div className="role-caption">Switch role</div>}

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="role-switch"
            aria-expanded={roleMenuOpen}
            aria-label="Switch active role"
            onClick={() => setRoleMenuOpen((prev) => !prev)}
            title={sidebarCollapsed ? currentRoleCfg.label : undefined}
          >
            <div className="role-avatar">
              <currentRoleCfg.icon />
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="role-switch-copy">
                  <div className="role-switch-name">{currentUser.name}</div>
                  <div className="role-switch-meta">{currentRoleCfg.label}</div>
                </div>
                <ChevronDown className="role-chevron" width={15} height={15} />
              </>
            )}
          </button>

          {/* 3-way Role Dropdown Menu */}
          {roleMenuOpen && (
            <div
              className="role-dropdown-menu"
              role="menu"
              aria-label="Select role"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dropdown-header">Choose Role</div>
              {roleConfigs.map((rc) => {
                const Icon = rc.icon
                const isSelected = rc.key === role
                return (
                  <button
                    key={rc.key}
                    type="button"
                    role="menuitem"
                    className={`role-dropdown-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect(rc.key)}
                  >
                    <div className="role-avatar" style={{ width: 24, height: 24 }}>
                      <Icon width={13} height={13} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                      <div className="dropdown-item-title">{rc.label}</div>
                      <div className="dropdown-item-sub">{rc.roleTitle}</div>
                    </div>
                    {isSelected && <span className="dropdown-check">✓</span>}
                  </button>
                )
              })}

              <div className="dropdown-divider" />
              <button
                type="button"
                className="role-dropdown-item"
                onClick={() => {
                  toggleTheme()
                  setRoleMenuOpen(false)
                }}
              >
                {theme === 'dark' ? <Sun width={15} height={15} /> : <Moon width={15} height={15} />}
                <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              </button>
              <button
                type="button"
                className="role-dropdown-item"
                onClick={() => {
                  setRoleMenuOpen(false)
                  logout()
                  router.push('/login')
                }}
              >
                <LogOut width={15} height={15} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
