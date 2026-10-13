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
} from 'lucide-react'
import { Role } from '@/types'
import { useStore } from '@/lib/store'

interface NavItemDef {
  href: string
  label: string
  icon: LucideIcon
  badgeKey?: 'updates' | 'saved'
}

const roleNavMap: Record<Role, NavItemDef[]> = {
  student: [
    { href: '/student', label: 'Home', icon: Home },
    { href: '/student/updates', label: 'Updates', icon: Inbox, badgeKey: 'updates' },
    { href: '/student/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/student/saved', label: 'Saved', icon: Bookmark, badgeKey: 'saved' },
    { href: '/student/profile', label: 'Profile', icon: UserRound },
  ],
  faculty: [
    { href: '/faculty', label: 'Home', icon: Home },
    { href: '/faculty/create', label: 'Create', icon: FilePlus2 },
    { href: '/faculty/updates', label: 'My Updates', icon: Inbox, badgeKey: 'updates' },
    { href: '/faculty/analytics', label: 'Analytics', icon: LineChart },
  ],
  admin: [
    { href: '/admin', label: 'Home', icon: Home },
    { href: '/admin/updates', label: 'Updates', icon: Inbox, badgeKey: 'updates' },
    { href: '/admin/create', label: 'Create update', icon: FilePlus2 },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/setup', label: 'Setup', icon: SlidersHorizontal },
    { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
    { href: '/admin/logs', label: 'Logs & Settings', icon: Settings2 },
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
    label: 'Student dashboard',
    roleTitle: 'Aarav Mehta',
    icon: UserRound,
    defaultRoute: '/student',
  },
  {
    key: 'faculty',
    label: 'Faculty dashboard',
    roleTitle: 'Dr. Maya Rao',
    icon: GraduationCap,
    defaultRoute: '/faculty',
  },
  {
    key: 'admin',
    label: 'Admin dashboard',
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
    updates,
    savedIds,
    sidebarCollapsed,
    toggleSidebar,
    theme,
    toggleTheme,
    simulateNewUrgentUpdate,
    logout,
  } = useStore()

  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Compute live nav badges
  const unreadCount = updates.filter((u) => !u.read && (role !== 'faculty' || u.publisher.name === currentUser.name)).length
  const savedCount = savedIds.length

  const currentRoleCfg = roleConfigs.find((r) => r.key === role) || roleConfigs[0]
  const navItems = roleNavMap[role]

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
              <div className="brand-name">Campus Voice</div>
              <div className="brand-subtitle">One clear campus signal</div>
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
        <div className="nav-section-label">{currentRoleCfg.label}</div>
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
            countBadge = unreadCount > 0 ? unreadCount : undefined
          } else if (item.badgeKey === 'saved') {
            countBadge = savedCount > 0 ? savedCount : undefined
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon />
              {!sidebarCollapsed && (
                <>
                  <span className="nav-item-label">{item.label}</span>
                  {countBadge !== undefined && (
                    <span className="nav-count">{countBadge}</span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quick Tools & Dev Helper */}
      <div className="sidebar-spacer" />

      {!sidebarCollapsed && (
        <div className="sidebar-quick-tools">
          <button
            type="button"
            className="sidebar-tool-btn"
            onClick={simulateNewUrgentUpdate}
            title="Simulate incoming urgent alert"
          >
            <Sparkles width={13} height={13} style={{ color: 'var(--accent-orange)' }} />
            <span>Simulate Urgent Notice</span>
          </button>
        </div>
      )}

      {/* Role Switcher panel (3-way: Student, Faculty, Admin) */}
      <div className="role-panel">
        {!sidebarCollapsed && <div className="role-caption">Switch dashboard</div>}

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
