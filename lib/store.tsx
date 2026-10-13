'use client'

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import {
  Role,
  UserProfile,
  UpdateItem,
  NotificationItem,
  CategoryItem,
  DepartmentItem,
  AcademicYearItem,
  SectionItem,
  CourseItem,
  AudienceGroupItem,
  AuditLogItem,
  AppSettings,
  ToastMessage,
  CreateUpdateInput,
} from '@/types'
import { api } from '@/lib/api'
import {
  initialUsers,
  initialUpdates,
  initialNotifications,
  initialCategories,
  initialDepartments,
  initialAcademicYears,
  initialSections,
  initialCourses,
  initialAudienceGroups,
  initialAuditLogs,
  initialSettings,
} from '@/data/mockData'

interface StoreContextType {
  // Auth & Session
  currentUser: UserProfile
  role: Role
  isAuthenticated: boolean
  isLoaded: boolean
  setRole: (role: Role) => void
  login: (role: Role, email?: string) => void
  logout: () => void

  // Data
  updates: UpdateItem[]
  notifications: NotificationItem[]
  categories: CategoryItem[]
  departments: DepartmentItem[]
  academicYears: AcademicYearItem[]
  sections: SectionItem[]
  courses: CourseItem[]
  audienceGroups: AudienceGroupItem[]
  auditLogs: AuditLogItem[]
  settings: AppSettings

  // Student specific state
  savedIds: string[]
  dismissedUrgentIds: string[]
  toggleSave: (updateId: string) => void
  markAsRead: (updateId: string) => void
  markAsUnread: (updateId: string) => void
  markAllUpdatesRead: () => void
  dismissUrgent: (updateId: string) => void

  // Notifications
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  unreadNotificationsCount: number
  hasUrgentNotification: boolean

  // Search
  recentSearches: string[]
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void

  // Update actions
  createUpdate: (update: CreateUpdateInput) => Promise<UpdateItem>
  editUpdate: (update: UpdateItem) => Promise<UpdateItem>
  deleteUpdate: (id: string) => Promise<void>
  approveUpdate: (id: string) => Promise<void>
  rejectUpdate: (id: string, reason: string) => Promise<void>
  archiveUpdate: (id: string) => Promise<void>
  duplicateUpdate: (id: string) => Promise<UpdateItem>

  // Profile actions
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>
  resetPreferencesToDefault: () => Promise<void>

  // Admin User actions
  addUser: (user: Omit<UserProfile, 'id' | 'avatarInitials' | 'lastSeen'>) => Promise<void>
  editUser: (user: UserProfile) => Promise<void>
  toggleUserActive: (id: string) => Promise<void>
  bulkImportUsers: (users: Array<Omit<UserProfile, 'id' | 'avatarInitials' | 'lastSeen'>>) => Promise<void>

  // Admin Setup actions
  addCategory: (name: string, color: string) => Promise<void>
  updateCategory: (cat: CategoryItem) => Promise<void>
  deleteCategory: (id: string) => Promise<{ success: boolean; message?: string }>
  reorderCategories: (ordered: CategoryItem[]) => Promise<void>

  addDepartment: (name: string, code: string) => Promise<void>
  deleteDepartment: (id: string) => Promise<{ success: boolean; message?: string }>

  addAcademicYear: (name: string, code: string) => Promise<void>
  deleteAcademicYear: (id: string) => Promise<{ success: boolean; message?: string }>

  addSection: (name: string, deptId: string) => Promise<void>
  deleteSection: (id: string) => Promise<{ success: boolean; message?: string }>

  addCourse: (name: string, code: string, deptId: string) => Promise<void>
  deleteCourse: (id: string) => Promise<{ success: boolean; message?: string }>

  addAudienceGroup: (name: string, desc: string, count: number) => Promise<void>
  deleteAudienceGroup: (id: string) => Promise<void>

  // Settings
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>

  // UI state
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  theme: 'light' | 'dark'
  toggleTheme: () => void

  // Toast
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void

  // Dev simulation
  simulateNewUrgentUpdate: () => void
  resetAllData: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [users, setUsers] = useState<UserProfile[]>(initialUsers)
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUsers[0])
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true)
  const [updates, setUpdates] = useState<UpdateItem[]>(initialUpdates)
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories)
  const [departments, setDepartments] = useState<DepartmentItem[]>(initialDepartments)
  const [academicYears, setAcademicYears] = useState<AcademicYearItem[]>(initialAcademicYears)
  const [sections, setSections] = useState<SectionItem[]>(initialSections)
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses)
  const [audienceGroups, setAudienceGroups] = useState<AudienceGroupItem[]>(initialAudienceGroups)
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs)
  const [settings, setSettings] = useState<AppSettings>(initialSettings)

  const [savedIds, setSavedIds] = useState<string[]>(['placement', 'result', 'critique'])
  const [dismissedUrgentIds, setDismissedUrgentIds] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>(['Exams', 'Fee deadline', 'Design critique'])
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Load from LocalStorage on mount
  useEffect(() => {
    setIsClient(true)
    async function loadData() {
      try {
        const [u, notifs, cats, deps, yrs, secs, crs, auds, logs, st, userList] = await Promise.all([
          api.getUpdates(),
          api.getNotifications(),
          api.getCategories(),
          api.getDepartments(),
          api.getAcademicYears(),
          api.getSections(),
          api.getCourses(),
          api.getAudienceGroups(),
          api.getAuditLogs(),
          api.getSettings(),
          api.getUsers(),
        ])
        setUpdates(u)
        setNotifications(notifs)
        setCategories(cats)
        setDepartments(deps)
        setAcademicYears(yrs)
        setSections(secs)
        setCourses(crs)
        setAudienceGroups(auds)
        setAuditLogs(logs)
        setSettings(st)
        setUsers(userList)

        // Saved IDs
        const saved = localStorage.getItem('cv_saved_ids_v1')
        if (saved) setSavedIds(JSON.parse(saved))

        // Dismissed IDs
        const dismissed = localStorage.getItem('cv_dismissed_urgent_ids_v1')
        if (dismissed) setDismissedUrgentIds(JSON.parse(dismissed))

        // Recent searches
        const searches = localStorage.getItem('cv_recent_searches_v1')
        if (searches) setRecentSearches(JSON.parse(searches))

        // Sidebar
        const sb = localStorage.getItem('cv_sidebar_collapsed_v1')
        if (sb) setSidebarCollapsed(sb === 'true')

        // Theme
        const storedTheme = (localStorage.getItem('cv_theme_v1') as 'light' | 'dark') || 'light'
        setTheme(storedTheme)
        if (storedTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }

        // Current user
        const storedRole = localStorage.getItem('cv_role_v1') as Role
        const authFlag = localStorage.getItem('cv_authenticated_v1')
        if (authFlag === 'false') {
          setIsAuthenticated(false)
        }
        if (storedRole) {
          const matched = userList.find((usr) => usr.role === storedRole)
          if (matched) setCurrentUser(matched)
        }
      } catch (err) {
        console.error('Failed to initialize local data', err)
      } finally {
        setIsLoaded(true)
      }
    }
    loadData()
  }, [])

  // Toast dispatch helper
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    const newToast: ToastMessage = { ...toast, id }
    setToasts((prev) => [...prev, newToast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Auth & Roles
  const setRole = useCallback(
    (role: Role) => {
      const match = users.find((u) => u.role === role) || users[0]
      setCurrentUser(match)
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_role_v1', role)
      }
      addToast({
        type: 'info',
        title: `Switched to ${role.charAt(0).toUpperCase() + role.slice(1)} view`,
        message: `Active profile: ${match.name}`,
      })
    },
    [users, addToast]
  )

  const login = useCallback(
    (role: Role, email?: string) => {
      const match = users.find((u) => (email ? u.email === email : u.role === role)) || users.find((u) => u.role === role) || users[0]
      setCurrentUser(match)
      setIsAuthenticated(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_role_v1', match.role)
        localStorage.setItem('cv_authenticated_v1', 'true')
      }
      addToast({
        type: 'success',
        title: 'Logged in successfully',
        message: `Welcome back, ${match.name}!`,
      })
    },
    [users, addToast]
  )

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('cv_authenticated_v1', 'false')
    }
    addToast({
      type: 'info',
      title: 'Signed out',
      message: 'You have been logged out of your session.',
    })
  }, [addToast])

  // Save / Bookmark
  const toggleSave = useCallback(
    (updateId: string) => {
      const isSaved = savedIds.includes(updateId)
      let next: string[]
      if (isSaved) {
        next = savedIds.filter((id) => id !== updateId)
        addToast({
          type: 'info',
          title: 'Removed from saved',
          actionLabel: 'Undo',
          onAction: () => {
            setSavedIds((current) => {
              const undone = [...current, updateId]
              if (typeof window !== 'undefined') {
                localStorage.setItem('cv_saved_ids_v1', JSON.stringify(undone))
              }
              return undone
            })
          },
        })
      } else {
        next = [...savedIds, updateId]
        addToast({
          type: 'success',
          title: 'Saved to your shelf',
          message: 'Find it anytime in your Saved tab.',
        })
      }
      setSavedIds(next)
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_saved_ids_v1', JSON.stringify(next))
      }

      // Also sync update.saved for current student
      setUpdates((prev) =>
        prev.map((item) => {
          if (item.id === updateId) {
            return { ...item, saved: !isSaved }
          }
          return item
        })
      )
    },
    [savedIds, addToast]
  )

  // Read status
  const markAsRead = useCallback(
    async (updateId: string) => {
      setUpdates((prev) =>
        prev.map((item) => {
          if (item.id === updateId) {
            const readBy = item.readBy ? (item.readBy.includes(currentUser.id) ? item.readBy : [...item.readBy, currentUser.id]) : [currentUser.id]
            const updated = { ...item, read: true, readBy, readsCount: (item.readsCount || 0) + (item.read ? 0 : 1) }
            api.saveUpdate(updated)
            return updated
          }
          return item
        })
      )
    },
    [currentUser.id]
  )

  const markAsUnread = useCallback(
    async (updateId: string) => {
      setUpdates((prev) =>
        prev.map((item) => {
          if (item.id === updateId) {
            const readBy = (item.readBy || []).filter((id) => id !== currentUser.id)
            const updated = { ...item, read: false, readBy, readsCount: Math.max(0, (item.readsCount || 1) - 1) }
            api.saveUpdate(updated)
            return updated
          }
          return item
        })
      )
      addToast({
        type: 'info',
        title: 'Marked as unread',
      })
    },
    [currentUser.id, addToast]
  )

  const markAllUpdatesRead = useCallback(async () => {
    setUpdates((prev) =>
      prev.map((item) => {
        const readBy = item.readBy ? (item.readBy.includes(currentUser.id) ? item.readBy : [...item.readBy, currentUser.id]) : [currentUser.id]
        const updated = { ...item, read: true, readBy }
        api.saveUpdate(updated)
        return updated
      })
    )
    addToast({
      type: 'success',
      title: 'All updates marked as read',
    })
  }, [currentUser.id, addToast])

  const dismissUrgent = useCallback((updateId: string) => {
    setDismissedUrgentIds((prev) => {
      const next = [...prev, updateId]
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_dismissed_urgent_ids_v1', JSON.stringify(next))
      }
      return next
    })
  }, [])

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      api.saveNotifications(next)
      return next
    })
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }))
      api.saveNotifications(next)
      return next
    })
    addToast({
      type: 'info',
      title: 'All notifications marked as read',
    })
  }, [addToast])

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  const hasUrgentNotification = useMemo(() => {
    return notifications.some((n) => !n.read && n.type === 'urgent')
  }, [notifications])

  // Searches
  const addRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== query.toLowerCase())
      const next = [query.trim(), ...filtered].slice(0, 8)
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_recent_searches_v1', JSON.stringify(next))
      }
      return next
    })
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cv_recent_searches_v1')
    }
  }, [])

  // Update CRUD
  const createUpdate = useCallback(
    async (data: CreateUpdateInput) => {
      const id = `upd-${Date.now()}`
      const newUpdate: UpdateItem = {
        ...data,
        id,
        postedAt: new Date().toISOString(),
        read: false,
        saved: false,
        readBy: [],
        savedBy: [],
        reachPercentage: 0,
        viewsCount: 0,
        readsCount: 0,
        editHistory: [
          {
            date: new Date().toISOString(),
            author: currentUser.name,
            action: `Created update as ${data.status}`,
          },
        ],
      }
      const saved = await api.saveUpdate(newUpdate)
      setUpdates((prev) => [saved, ...prev])

      // Add audit log
      const log = await api.addAuditLog({
        user: currentUser.name,
        role: currentUser.role === 'admin' ? 'Admin' : 'Faculty',
        action: `Created notice`,
        details: `${newUpdate.title} (${newUpdate.status})`,
        updateId: id,
      })
      setAuditLogs((prev) => [log, ...prev])

      addToast({
        type: 'success',
        title: 'Update created',
        message: newUpdate.status === 'Pending' ? 'Submitted for Admin Approval' : `Notice saved as ${newUpdate.status}`,
      })
      return saved
    },
    [currentUser, addToast]
  )

  const editUpdate = useCallback(
    async (update: UpdateItem) => {
      const updatedItem: UpdateItem = {
        ...update,
        editHistory: [
          ...update.editHistory,
          {
            date: new Date().toISOString(),
            author: currentUser.name,
            action: 'Updated details',
          },
        ],
      }
      const saved = await api.saveUpdate(updatedItem)
      setUpdates((prev) => prev.map((item) => (item.id === saved.id ? saved : item)))

      const log = await api.addAuditLog({
        user: currentUser.name,
        role: currentUser.role === 'admin' ? 'Admin' : 'Faculty',
        action: 'Edited notice',
        details: updatedItem.title,
        updateId: updatedItem.id,
      })
      setAuditLogs((prev) => [log, ...prev])

      addToast({
        type: 'success',
        title: 'Update changes saved',
      })
      return saved
    },
    [currentUser, addToast]
  )

  const deleteUpdate = useCallback(
    async (id: string) => {
      const target = updates.find((u) => u.id === id)
      await api.deleteUpdate(id)
      setUpdates((prev) => prev.filter((item) => item.id !== id))
      if (target) {
        const log = await api.addAuditLog({
          user: currentUser.name,
          role: currentUser.role === 'admin' ? 'Admin' : 'Faculty',
          action: 'Deleted notice',
          details: target.title,
        })
        setAuditLogs((prev) => [log, ...prev])
      }
      addToast({
        type: 'info',
        title: 'Update deleted',
      })
    },
    [updates, currentUser, addToast]
  )

  const approveUpdate = useCallback(
    async (id: string) => {
      const target = updates.find((u) => u.id === id)
      if (!target) return
      const updated: UpdateItem = {
        ...target,
        status: 'Published',
        editHistory: [
          ...target.editHistory,
          {
            date: new Date().toISOString(),
            author: currentUser.name,
            action: 'Approved & Published',
          },
        ],
      }
      await api.saveUpdate(updated)
      setUpdates((prev) => prev.map((item) => (item.id === id ? updated : item)))

      const log = await api.addAuditLog({
        user: currentUser.name,
        role: 'Admin',
        action: 'Approved update',
        details: `${target.title} (Published)`,
        updateId: id,
      })
      setAuditLogs((prev) => [log, ...prev])

      // Also create a notification for students
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        updateId: id,
        title: target.title,
        message: target.excerpt,
        type: target.priority === 'Urgent' ? 'urgent' : 'info',
        timestamp: new Date().toISOString(),
        read: false,
      }
      setNotifications((prev) => [notif, ...prev])
      api.saveNotifications([notif, ...notifications])

      addToast({
        type: 'success',
        title: 'Notice approved and published',
      })
    },
    [updates, currentUser, notifications, addToast]
  )

  const rejectUpdate = useCallback(
    async (id: string, reason: string) => {
      const target = updates.find((u) => u.id === id)
      if (!target) return
      const updated: UpdateItem = {
        ...target,
        status: 'Rejected',
        rejectionReason: reason,
        editHistory: [
          ...target.editHistory,
          {
            date: new Date().toISOString(),
            author: currentUser.name,
            action: `Rejected: ${reason}`,
          },
        ],
      }
      await api.saveUpdate(updated)
      setUpdates((prev) => prev.map((item) => (item.id === id ? updated : item)))

      const log = await api.addAuditLog({
        user: currentUser.name,
        role: 'Admin',
        action: 'Rejected update',
        details: `${target.title} - Reason: "${reason}"`,
        updateId: id,
      })
      setAuditLogs((prev) => [log, ...prev])

      addToast({
        type: 'warning',
        title: 'Update rejected',
        message: `Reason recorded: "${reason}"`,
      })
    },
    [updates, currentUser, addToast]
  )

  const archiveUpdate = useCallback(
    async (id: string) => {
      const target = updates.find((u) => u.id === id)
      if (!target) return
      const updated: UpdateItem = {
        ...target,
        status: 'Archived',
        editHistory: [
          ...target.editHistory,
          {
            date: new Date().toISOString(),
            author: currentUser.name,
            action: 'Archived',
          },
        ],
      }
      await api.saveUpdate(updated)
      setUpdates((prev) => prev.map((item) => (item.id === id ? updated : item)))

      const log = await api.addAuditLog({
        user: currentUser.name,
        role: currentUser.role === 'admin' ? 'Admin' : 'Faculty',
        action: 'Archived update',
        details: target.title,
        updateId: id,
      })
      setAuditLogs((prev) => [log, ...prev])

      addToast({
        type: 'info',
        title: 'Update archived',
      })
    },
    [updates, currentUser, addToast]
  )

  const duplicateUpdate = useCallback(
    async (id: string) => {
      const target = updates.find((u) => u.id === id)
      if (!target) throw new Error('Update not found')
      const dup: Omit<UpdateItem, 'id' | 'postedAt' | 'editHistory'> = {
        title: `${target.title} (Copy)`,
        category: target.category,
        priority: target.priority,
        status: 'Draft',
        excerpt: target.excerpt,
        content: target.content,
        department: target.department,
        publisher: {
          name: currentUser.name,
          role: currentUser.role === 'admin' ? 'Admin Office' : 'Faculty',
          email: currentUser.email,
        },
        read: true,
        saved: false,
        attachments: target.attachments,
        audience: target.audience,
      }
      return createUpdate(dup)
    },
    [updates, currentUser, createUpdate]
  )

  // Profile actions
  const updateProfile = useCallback(
    async (updatesData: Partial<UserProfile>) => {
      const updated = { ...currentUser, ...updatesData }
      setCurrentUser(updated)
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      await api.saveUser(updated)
      addToast({
        type: 'success',
        title: 'Profile updated',
      })
    },
    [currentUser, addToast]
  )

  const resetPreferencesToDefault = useCallback(async () => {
    const defaultPrefs = {
      urgentNotices: true,
      deadlines: true,
      communityEvents: false,
      emailChannel: true,
      pushChannel: true,
      smsChannel: false,
    }
    await updateProfile({ notificationPreferences: defaultPrefs })
    addToast({
      type: 'info',
      title: 'Preferences reset to defaults',
    })
  }, [updateProfile, addToast])

  // User management (Admin)
  const addUser = useCallback(
    async (data: Omit<UserProfile, 'id' | 'avatarInitials' | 'lastSeen'>) => {
      const initials = data.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
      const newUser: UserProfile = {
        ...data,
        id: `usr-${Date.now()}`,
        avatarInitials: initials,
        lastSeen: 'Never',
      }
      const saved = await api.saveUser(newUser)
      setUsers((prev) => [saved, ...prev])
      const log = await api.addAuditLog({
        user: currentUser.name,
        role: 'Admin',
        action: 'Added user',
        details: `${newUser.name} (${newUser.role})`,
      })
      setAuditLogs((prev) => [log, ...prev])
      addToast({
        type: 'success',
        title: 'User added successfully',
        message: `${newUser.name} (${newUser.email})`,
      })
    },
    [currentUser, addToast]
  )

  const editUser = useCallback(
    async (user: UserProfile) => {
      const saved = await api.saveUser(user)
      setUsers((prev) => prev.map((u) => (u.id === user.id ? saved : u)))
      const log = await api.addAuditLog({
        user: currentUser.name,
        role: 'Admin',
        action: 'Updated user details',
        details: `${user.name} (${user.role})`,
      })
      setAuditLogs((prev) => [log, ...prev])
      addToast({
        type: 'success',
        title: 'User updated',
      })
    },
    [currentUser, addToast]
  )

  const toggleUserActive = useCallback(
    async (id: string) => {
      const user = users.find((u) => u.id === id)
      if (!user) return
      const nextActive = !user.active
      const updated = { ...user, active: nextActive }
      await api.saveUser(updated)
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
      const log = await api.addAuditLog({
        user: currentUser.name,
        role: 'Admin',
        action: nextActive ? 'Reactivated user' : 'Deactivated user',
        details: user.name,
      })
      setAuditLogs((prev) => [log, ...prev])
      addToast({
        type: nextActive ? 'success' : 'warning',
        title: nextActive ? 'User reactivated' : 'User deactivated',
        message: user.name,
      })
    },
    [users, currentUser, addToast]
  )

  const bulkImportUsers = useCallback(
    async (newList: Array<Omit<UserProfile, 'id' | 'avatarInitials' | 'lastSeen'>>) => {
      const createdUsers = newList.map((item, idx) => ({
        ...item,
        id: `usr-csv-${Date.now()}-${idx}`,
        avatarInitials: item.name
          .split(' ')
          .map((p) => p[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
        lastSeen: 'Never',
      }))
      const combined = [...users, ...createdUsers]
      setUsers(combined)
      for (const u of createdUsers) {
        await api.saveUser(u)
      }
      const log = await api.addAuditLog({
        user: currentUser.name,
        role: 'Admin',
        action: 'CSV User Import',
        details: `Imported ${createdUsers.length} accounts`,
      })
      setAuditLogs((prev) => [log, ...prev])
      addToast({
        type: 'success',
        title: `Imported ${createdUsers.length} users successfully`,
      })
    },
    [users, currentUser, addToast]
  )

  // Categories Setup
  const addCategory = useCallback(
    async (name: string, color: string) => {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name,
        color,
        order: categories.length + 1,
        permissionGroupsCount: 1,
      }
      const updated = [...categories, newCat]
      setCategories(updated)
      await api.saveCategories(updated)
      addToast({ type: 'success', title: 'Category added' })
    },
    [categories, addToast]
  )

  const updateCategory = useCallback(
    async (cat: CategoryItem) => {
      const updated = categories.map((c) => (c.id === cat.id ? cat : c))
      setCategories(updated)
      await api.saveCategories(updated)
      addToast({ type: 'success', title: 'Category updated' })
    },
    [categories, addToast]
  )

  const deleteCategory = useCallback(
    async (id: string) => {
      const cat = categories.find((c) => c.id === id)
      if (!cat) return { success: false }
      // Check if in use
      const inUseCount = updates.filter((u) => u.category.toLowerCase() === cat.name.toLowerCase()).length
      if (inUseCount > 0) {
        addToast({
          type: 'error',
          title: 'Cannot delete category',
          message: `Category "${cat.name}" is currently used in ${inUseCount} notice${inUseCount === 1 ? '' : 's'}. Reassign them before deleting.`,
        })
        return { success: false, message: `Category is used in ${inUseCount} notices.` }
      }
      const updated = categories.filter((c) => c.id !== id)
      setCategories(updated)
      await api.saveCategories(updated)
      addToast({ type: 'info', title: 'Category deleted' })
      return { success: true }
    },
    [categories, updates, addToast]
  )

  const reorderCategories = useCallback(
    async (ordered: CategoryItem[]) => {
      setCategories(ordered)
      await api.saveCategories(ordered)
    },
    []
  )

  // Departments, Years, Sections, Courses CRUD
  const addDepartment = useCallback(
    async (name: string, code: string) => {
      const next = [...departments, { id: `dept-${Date.now()}`, name, code }]
      setDepartments(next)
      await api.saveDepartments(next)
      addToast({ type: 'success', title: 'Department added' })
    },
    [departments, addToast]
  )

  const deleteDepartment = useCallback(
    async (id: string) => {
      const dept = departments.find((d) => d.id === id)
      if (!dept) return { success: false }
      const inUse = updates.filter((u) => u.department === dept.name).length
      if (inUse > 0) {
        addToast({
          type: 'error',
          title: 'Cannot delete department',
          message: `Department "${dept.name}" has ${inUse} linked notice${inUse === 1 ? '' : 's'}.`,
        })
        return { success: false, message: `Department has ${inUse} linked notices.` }
      }
      const next = departments.filter((d) => d.id !== id)
      setDepartments(next)
      await api.saveDepartments(next)
      addToast({ type: 'info', title: 'Department removed' })
      return { success: true }
    },
    [departments, updates, addToast]
  )

  const addAcademicYear = useCallback(
    async (name: string, code: string) => {
      const next = [...academicYears, { id: `year-${Date.now()}`, name, code }]
      setAcademicYears(next)
      await api.saveAcademicYears(next)
      addToast({ type: 'success', title: 'Academic Year added' })
    },
    [academicYears, addToast]
  )

  const deleteAcademicYear = useCallback(
    async (id: string) => {
      const next = academicYears.filter((y) => y.id !== id)
      setAcademicYears(next)
      await api.saveAcademicYears(next)
      addToast({ type: 'info', title: 'Academic Year deleted' })
      return { success: true }
    },
    [academicYears, addToast]
  )

  const addSection = useCallback(
    async (name: string, deptId: string) => {
      const next = [...sections, { id: `sec-${Date.now()}`, name, departmentId: deptId }]
      setSections(next)
      await api.saveSections(next)
      addToast({ type: 'success', title: 'Section added' })
    },
    [sections, addToast]
  )

  const deleteSection = useCallback(
    async (id: string) => {
      const next = sections.filter((s) => s.id !== id)
      setSections(next)
      await api.saveSections(next)
      addToast({ type: 'info', title: 'Section deleted' })
      return { success: true }
    },
    [sections, addToast]
  )

  const addCourse = useCallback(
    async (name: string, code: string, deptId: string) => {
      const next = [...courses, { id: `course-${Date.now()}`, name, code, departmentId: deptId }]
      setCourses(next)
      await api.saveCourses(next)
      addToast({ type: 'success', title: 'Course added' })
    },
    [courses, addToast]
  )

  const deleteCourse = useCallback(
    async (id: string) => {
      const next = courses.filter((c) => c.id !== id)
      setCourses(next)
      await api.saveCourses(next)
      addToast({ type: 'info', title: 'Course deleted' })
      return { success: true }
    },
    [courses, addToast]
  )

  const addAudienceGroup = useCallback(
    async (name: string, desc: string, memberCount: number) => {
      const next = [...audienceGroups, { id: `aud-${Date.now()}`, name, description: desc, memberCount }]
      setAudienceGroups(next)
      await api.saveAudienceGroups(next)
      addToast({ type: 'success', title: 'Audience group added' })
    },
    [audienceGroups, addToast]
  )

  const deleteAudienceGroup = useCallback(
    async (id: string) => {
      const next = audienceGroups.filter((g) => g.id !== id)
      setAudienceGroups(next)
      await api.saveAudienceGroups(next)
      addToast({ type: 'info', title: 'Audience group deleted' })
    },
    [audienceGroups, addToast]
  )

  // Settings
  const updateSettings = useCallback(
    async (newSettings: Partial<AppSettings>) => {
      const updated = { ...settings, ...newSettings }
      setSettings(updated)
      await api.saveSettings(updated)
      addToast({
        type: 'success',
        title: 'Settings saved',
        message: 'Your system configuration has been updated.',
      })
    },
    [settings, addToast]
  )

  // UI State: Sidebar & Theme
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_sidebar_collapsed_v1', String(next))
      }
      return next
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_theme_v1', next)
        if (next === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      addToast({
        type: 'info',
        title: `Switched to ${next} theme`,
      })
      return next
    })
  }, [addToast])

  // Dev simulation
  const simulateNewUrgentUpdate = useCallback(() => {
    const randomId = `sim-urgent-${Date.now()}`
    const urgentItem: UpdateItem = {
      id: randomId,
      title: 'Emergency campus weather & safety alert',
      category: 'Events',
      priority: 'Urgent',
      status: 'Published',
      excerpt: 'Heavy rainfall expected this evening. Shuttle services modified to main gate depot.',
      content: 'Campus safety advisory: shuttle service routes have been adjusted. Avoid exterior walkways after 7:00 PM.',
      department: 'Administration',
      postedAt: new Date().toISOString(),
      eventDate: new Date().toISOString(),
      publisher: {
        name: 'Campus Safety',
        role: 'Official emergency advisory',
      },
      read: false,
      saved: false,
      readBy: [],
      savedBy: [],
      attachments: [],
      audience: {
        departments: [],
        years: [],
        sections: [],
        isUniversal: true,
      },
      editHistory: [{ date: new Date().toISOString(), author: 'System Alert', action: 'Dispatched emergency notice' }],
    }
    setUpdates((prev) => [urgentItem, ...prev])
    api.saveUpdate(urgentItem)

    const notif: NotificationItem = {
      id: `notif-urgent-${Date.now()}`,
      updateId: randomId,
      title: 'Urgent: Campus weather & safety alert',
      message: 'Shuttle routes modified. Tap to view full instructions.',
      type: 'urgent',
      timestamp: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [notif, ...prev])
    api.saveNotifications([notif, ...notifications])

    addToast({
      type: 'warning',
      title: '🚨 New Urgent Alert Received!',
      message: urgentItem.title,
      duration: 6000,
    })
  }, [notifications, addToast])

  const resetAllData = useCallback(async () => {
    await api.resetAllToDefault()
    setUpdates(initialUpdates)
    setNotifications(initialNotifications)
    setCategories(initialCategories)
    setDepartments(initialDepartments)
    setAcademicYears(initialAcademicYears)
    setSections(initialSections)
    setCourses(initialCourses)
    setAudienceGroups(initialAudienceGroups)
    setAuditLogs(initialAuditLogs)
    setSettings(initialSettings)
    setUsers(initialUsers)
    setCurrentUser(initialUsers[0])
    setSavedIds(['placement', 'result', 'critique'])
    setDismissedUrgentIds([])
    setRecentSearches(['Exams', 'Fee deadline', 'Design critique'])
    addToast({
      type: 'info',
      title: 'Workspace restored to defaults',
    })
  }, [addToast])

  const value = useMemo(
    () => ({
      currentUser,
      role: currentUser.role,
      isAuthenticated,
      isLoaded,
      setRole,
      login,
      logout,
      updates,
      notifications,
      categories,
      departments,
      academicYears,
      sections,
      courses,
      audienceGroups,
      auditLogs,
      settings,
      savedIds,
      dismissedUrgentIds,
      toggleSave,
      markAsRead,
      markAsUnread,
      markAllUpdatesRead,
      dismissUrgent,
      markNotificationRead,
      markAllNotificationsRead,
      unreadNotificationsCount,
      hasUrgentNotification,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      createUpdate,
      editUpdate,
      deleteUpdate,
      approveUpdate,
      rejectUpdate,
      archiveUpdate,
      duplicateUpdate,
      updateProfile,
      resetPreferencesToDefault,
      addUser,
      editUser,
      toggleUserActive,
      bulkImportUsers,
      addCategory,
      updateCategory,
      deleteCategory,
      reorderCategories,
      addDepartment,
      deleteDepartment,
      addAcademicYear,
      deleteAcademicYear,
      addSection,
      deleteSection,
      addCourse,
      deleteCourse,
      addAudienceGroup,
      deleteAudienceGroup,
      updateSettings,
      sidebarCollapsed,
      toggleSidebar,
      theme,
      toggleTheme,
      toasts,
      addToast,
      removeToast,
      simulateNewUrgentUpdate,
      resetAllData,
    }),
    [
      currentUser,
      isAuthenticated,
      isLoaded,
      setRole,
      login,
      logout,
      updates,
      notifications,
      categories,
      departments,
      academicYears,
      sections,
      courses,
      audienceGroups,
      auditLogs,
      settings,
      savedIds,
      dismissedUrgentIds,
      toggleSave,
      markAsRead,
      markAsUnread,
      markAllUpdatesRead,
      dismissUrgent,
      markNotificationRead,
      markAllNotificationsRead,
      unreadNotificationsCount,
      hasUrgentNotification,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      createUpdate,
      editUpdate,
      deleteUpdate,
      approveUpdate,
      rejectUpdate,
      archiveUpdate,
      duplicateUpdate,
      updateProfile,
      resetPreferencesToDefault,
      addUser,
      editUser,
      toggleUserActive,
      bulkImportUsers,
      addCategory,
      updateCategory,
      deleteCategory,
      reorderCategories,
      addDepartment,
      deleteDepartment,
      addAcademicYear,
      deleteAcademicYear,
      addSection,
      deleteSection,
      addCourse,
      deleteCourse,
      addAudienceGroup,
      deleteAudienceGroup,
      updateSettings,
      sidebarCollapsed,
      toggleSidebar,
      theme,
      toggleTheme,
      toasts,
      addToast,
      removeToast,
      simulateNewUrgentUpdate,
      resetAllData,
    ]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
