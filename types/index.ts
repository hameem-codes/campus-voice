export type Role = 'student' | 'faculty' | 'admin'

export type Priority = 'Normal' | 'Urgent'

export type UpdateStatus = 'Draft' | 'Pending' | 'Published' | 'Scheduled' | 'Archived' | 'Rejected'

export type ChipTone = 'orange' | 'green' | 'blue' | 'neutral' | 'red'

export interface Attachment {
  id: string
  name: string
  size: string
  type: 'pdf' | 'image' | 'doc'
  url?: string
}

export interface EditHistoryEntry {
  date: string
  author: string
  action: string
  note?: string
}

export interface Audience {
  departments: string[]
  years: string[]
  sections: string[]
  isUniversal?: boolean
  label?: string
}

export interface UpdateItem {
  id: string
  title: string
  category: string
  priority: Priority
  status: UpdateStatus
  excerpt: string
  content: string
  department: string
  postedAt: string // ISO string or parsable date
  eventDate?: string // ISO string or parsable date
  deadlineDate?: string // ISO string or parsable date
  publisher: {
    name: string
    role: string
    email?: string
  }
  read: boolean
  saved: boolean
  readBy?: string[]
  savedBy?: string[]
  attachments: Attachment[]
  audience: Audience
  rejectionReason?: string
  editHistory: EditHistoryEntry[]
  reachPercentage?: number
  viewsCount?: number
  readsCount?: number
}

export type CreateUpdateInput = Omit<UpdateItem, 'id' | 'postedAt' | 'editHistory' | 'read' | 'saved'> & {
  read?: boolean
  saved?: boolean
}

export interface NotificationItem {
  id: string
  updateId?: string
  title: string
  message: string
  type: 'urgent' | 'reminder' | 'info'
  timestamp: string
  read: boolean
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: Role
  department: string
  year?: string
  section?: string
  studentId?: string
  avatarInitials: string
  active: boolean
  lastSeen?: string
  notificationPreferences: {
    urgentNotices: boolean
    deadlines: boolean
    communityEvents: boolean
    emailChannel: boolean
    pushChannel: boolean
    smsChannel: boolean
  }
}

export interface CategoryItem {
  id: string
  name: string
  color: string
  order: number
  permissionGroupsCount: number
}

export interface DepartmentItem {
  id: string
  name: string
  code: string
}

export interface AcademicYearItem {
  id: string
  name: string
  code: string
}

export interface SectionItem {
  id: string
  name: string
  departmentId: string
}

export interface CourseItem {
  id: string
  name: string
  code: string
  departmentId: string
}

export interface AudienceGroupItem {
  id: string
  name: string
  memberCount: number
  description?: string
}

export interface AuditLogItem {
  id: string
  user: string
  role: string
  action: string
  details: string
  timestamp: string
  updateId?: string
}

export interface AppSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  urgentApprovalRule: string
  retentionMonths: number
  theme: 'light' | 'dark'
}

export interface ToastMessage {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  duration?: number
}
