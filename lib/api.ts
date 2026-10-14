import {
  UpdateItem,
  UserProfile,
  NotificationItem,
  CategoryItem,
  DepartmentItem,
  AcademicYearItem,
  SectionItem,
  CourseItem,
  AudienceGroupItem,
  AuditLogItem,
  AppSettings,
} from '@/types'
import {
  initialUpdates,
  initialUsers,
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

const STORAGE_KEYS = {
  UPDATES: 'cv_updates_v1',
  USERS: 'cv_users_v1',
  NOTIFICATIONS: 'cv_notifications_v1',
  CATEGORIES: 'cv_categories_v1',
  DEPARTMENTS: 'cv_departments_v1',
  YEARS: 'cv_years_v1',
  SECTIONS: 'cv_sections_v1',
  COURSES: 'cv_courses_v1',
  AUDIENCES: 'cv_audiences_v1',
  LOGS: 'cv_logs_v1',
  SETTINGS: 'cv_settings_v1',
  CURRENT_USER_ID: 'cv_current_user_id_v1',
  SAVED_IDS: 'cv_saved_ids_v1',
  DISMISSED_URGENT_IDS: 'cv_dismissed_urgent_ids_v1',
  RECENT_SEARCHES: 'cv_recent_searches_v1',
}

function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore local storage errors
  }
}

export const api = {
  // Updates
  async getUpdates(): Promise<UpdateItem[]> {
    const data = getStored<UpdateItem[]>(STORAGE_KEYS.UPDATES, initialUpdates)
    return delay(data)
  },

  async getUpdateById(id: string): Promise<UpdateItem | null> {
    const list = await this.getUpdates()
    return list.find((item) => item.id === id) || null
  },

  async saveUpdate(update: UpdateItem): Promise<UpdateItem> {
    const list = await this.getUpdates()
    const index = list.findIndex((item) => item.id === update.id)
    let updatedList: UpdateItem[]
    if (index >= 0) {
      updatedList = [...list]
      updatedList[index] = update
    } else {
      updatedList = [update, ...list]
    }
    setStored(STORAGE_KEYS.UPDATES, updatedList)
    return delay(update)
  },

  async deleteUpdate(id: string): Promise<boolean> {
    const list = await this.getUpdates()
    const filtered = list.filter((item) => item.id !== id)
    setStored(STORAGE_KEYS.UPDATES, filtered)
    return delay(true)
  },

  // Users
  async getUsers(): Promise<UserProfile[]> {
    const data = getStored<UserProfile[]>(STORAGE_KEYS.USERS, initialUsers)
    return delay(data)
  },

  async saveUser(user: UserProfile): Promise<UserProfile> {
    const list = await this.getUsers()
    const index = list.findIndex((u) => u.id === user.id)
    let updatedList: UserProfile[]
    if (index >= 0) {
      updatedList = [...list]
      updatedList[index] = user
    } else {
      updatedList = [...list, user]
    }
    setStored(STORAGE_KEYS.USERS, updatedList)
    return delay(user)
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const data = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
    return delay(data)
  },

  async saveNotifications(notifs: NotificationItem[]): Promise<NotificationItem[]> {
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs)
    return delay(notifs)
  },

  // Categories
  async getCategories(): Promise<CategoryItem[]> {
    const data = getStored<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, initialCategories)
    return delay(data)
  },

  async saveCategories(cats: CategoryItem[]): Promise<CategoryItem[]> {
    setStored(STORAGE_KEYS.CATEGORIES, cats)
    return delay(cats)
  },

  // Academic Setup: Departments, Years, Sections, Courses, Audience Groups
  async getDepartments(): Promise<DepartmentItem[]> {
    const data = getStored<DepartmentItem[]>(STORAGE_KEYS.DEPARTMENTS, initialDepartments)
    return delay(data)
  },

  async saveDepartments(deps: DepartmentItem[]): Promise<DepartmentItem[]> {
    setStored(STORAGE_KEYS.DEPARTMENTS, deps)
    return delay(deps)
  },

  async getAcademicYears(): Promise<AcademicYearItem[]> {
    const data = getStored<AcademicYearItem[]>(STORAGE_KEYS.YEARS, initialAcademicYears)
    return delay(data)
  },

  async saveAcademicYears(years: AcademicYearItem[]): Promise<AcademicYearItem[]> {
    setStored(STORAGE_KEYS.YEARS, years)
    return delay(years)
  },

  async getSections(): Promise<SectionItem[]> {
    const data = getStored<SectionItem[]>(STORAGE_KEYS.SECTIONS, initialSections)
    return delay(data)
  },

  async saveSections(secs: SectionItem[]): Promise<SectionItem[]> {
    setStored(STORAGE_KEYS.SECTIONS, secs)
    return delay(secs)
  },

  async getCourses(): Promise<CourseItem[]> {
    const data = getStored<CourseItem[]>(STORAGE_KEYS.COURSES, initialCourses)
    return delay(data)
  },

  async saveCourses(courses: CourseItem[]): Promise<CourseItem[]> {
    setStored(STORAGE_KEYS.COURSES, courses)
    return delay(courses)
  },

  async getAudienceGroups(): Promise<AudienceGroupItem[]> {
    const data = getStored<AudienceGroupItem[]>(STORAGE_KEYS.AUDIENCES, initialAudienceGroups)
    return delay(data)
  },

  async saveAudienceGroups(groups: AudienceGroupItem[]): Promise<AudienceGroupItem[]> {
    setStored(STORAGE_KEYS.AUDIENCES, groups)
    return delay(groups)
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLogItem[]> {
    const data = getStored<AuditLogItem[]>(STORAGE_KEYS.LOGS, initialAuditLogs)
    return delay(data)
  },

  async addAuditLog(entry: Omit<AuditLogItem, 'id' | 'timestamp'>): Promise<AuditLogItem> {
    const list = await this.getAuditLogs()
    const newLog: AuditLogItem = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    }
    const updated = [newLog, ...list]
    setStored(STORAGE_KEYS.LOGS, updated)
    return delay(newLog)
  },

  // Settings
  async getSettings(): Promise<AppSettings> {
    const data = getStored<AppSettings>(STORAGE_KEYS.SETTINGS, initialSettings)
    return delay(data)
  },

  async saveSettings(settings: AppSettings): Promise<AppSettings> {
    setStored(STORAGE_KEYS.SETTINGS, settings)
    return delay(settings)
  },

  // AI Summary Demo Method (Phase 4.8)
  async getAiSummary(updateId: string): Promise<{ bullets: string[]; generatedAt: string }> {
    const list = await this.getUpdates()
    const update = list.find((u) => u.id === updateId)
    const bullets = update?.aiSummaryBullets || [
      `Key announcement: ${update?.title || 'Notice details'}`,
      `Audience & Scope: Verified for ${update?.audience?.label || 'Target cohorts'} by ${update?.department || 'Department'}.`,
      `Required Action: Note published schedule and deadlines (${update?.eventDate ? new Date(update.eventDate).toLocaleDateString() : 'immediate notice'}).`,
    ]
    return delay({ bullets, generatedAt: new Date().toISOString() }, 250)
  },

  // Reset to default
  async resetAllToDefault(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.UPDATES)
      localStorage.removeItem(STORAGE_KEYS.USERS)
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS)
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES)
      localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS)
      localStorage.removeItem(STORAGE_KEYS.YEARS)
      localStorage.removeItem(STORAGE_KEYS.SECTIONS)
      localStorage.removeItem(STORAGE_KEYS.COURSES)
      localStorage.removeItem(STORAGE_KEYS.AUDIENCES)
      localStorage.removeItem(STORAGE_KEYS.LOGS)
      localStorage.removeItem(STORAGE_KEYS.SETTINGS)
      localStorage.removeItem(STORAGE_KEYS.SAVED_IDS)
      localStorage.removeItem(STORAGE_KEYS.DISMISSED_URGENT_IDS)
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES)
    }
    return delay(undefined, 80)
  },
}
