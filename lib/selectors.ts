import { UpdateItem, UserProfile } from '@/types'

/**
 * Standard pluralization helper across the entire application.
 * Example:
 *   formatPlural(1, 'item') => '1 item'
 *   formatPlural(3, 'item') => '3 items'
 *   formatPlural(3, 'notice', 'notices') => '3 notices'
 */
export function formatPlural(count: number, singular: string, plural?: string): string {
  const p = plural || (singular.endsWith('s') ? `${singular}es` : `${singular}s`)
  return `${count} ${count === 1 ? singular : p}`
}

/**
 * Headline pluralization for attention summaries.
 * Example:
 *   formatAttentionHeadline(1) => '1 item needs attention'
 *   formatAttentionHeadline(3) => '3 items need attention'
 *   formatAttentionHeadline(0) => '0 items need attention'
 */
export function formatAttentionHeadline(count: number): string {
  if (count === 1) return '1 item needs attention'
  return `${count} items need attention`
}

/**
 * Checks whether an update matches the student's cohort (department, year, section).
 */
export function matchesStudentAudience(update: UpdateItem, user: UserProfile): boolean {
  if (update.status !== 'Published') return false
  if (update.audience.isUniversal) return true
  const { departments, years, sections } = update.audience
  const matchesDept = departments.length === 0 || departments.includes(user.department)
  const matchesYear = years.length === 0 || (user.year ? years.includes(user.year) : false)
  const matchesSec = sections.length === 0 || (user.section ? sections.includes(user.section) : false)
  return Boolean(matchesDept && matchesYear && matchesSec)
}

/**
 * Returns all published notices targeted to the logged-in student.
 */
export function getStudentFeed(updates: UpdateItem[], user: UserProfile): UpdateItem[] {
  return updates.filter((u) => matchesStudentAudience(u, user))
}

/**
 * Total count of notices targeted to the student (used for "All" tab).
 */
export function getStudentAllCount(updates: UpdateItem[], user: UserProfile): number {
  return getStudentFeed(updates, user).length
}

/**
 * Total unread notices targeted to the student.
 * This MUST equal the sidebar "Updates" badge and the "Unread" tab count.
 */
export function getStudentUnreadCount(updates: UpdateItem[], user: UserProfile): number {
  return getStudentFeed(updates, user).filter((u) => !u.read).length
}

/**
 * Unified definition of "urgent unread":
 * Targeted published notice with priority === 'Urgent' and !u.read.
 * This MUST agree everywhere: Home badge, urgent banner, Urgent tab count, and bell dot.
 */
export function getUrgentUnreadUpdates(
  updates: UpdateItem[],
  user: UserProfile,
  dismissedIds: string[] = []
): UpdateItem[] {
  return getStudentFeed(updates, user).filter(
    (u) => u.priority === 'Urgent' && !u.read && !dismissedIds.includes(u.id)
  )
}

export function getUrgentUnreadCount(
  updates: UpdateItem[],
  user: UserProfile,
  dismissedIds: string[] = []
): number {
  return getUrgentUnreadUpdates(updates, user, dismissedIds).length
}

/**
 * Total urgent notices targeted to the student (both read and unread),
 * used when viewing the "Urgent" tab filter if displaying all urgent items.
 * To keep tab count agreeing with unread urgent, the tab badge displays getUrgentUnreadCount.
 */
export function getStudentTotalUrgentCount(updates: UpdateItem[], user: UserProfile): number {
  return getStudentFeed(updates, user).filter((u) => u.priority === 'Urgent').length
}

/**
 * Attention items on Student Home:
 * Unread urgent notices OR notices with a deadline/event due within 3 days.
 */
export function getAttentionItems(updates: UpdateItem[], user: UserProfile): UpdateItem[] {
  const feed = getStudentFeed(updates, user)
  const now = Date.now()
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000

  return feed.filter((u) => {
    const isUnreadUrgent = u.priority === 'Urgent' && !u.read
    const targetDate = u.deadlineDate || u.eventDate
    let isDueSoon = false
    if (targetDate) {
      const time = new Date(targetDate).getTime()
      isDueSoon = time >= now && time - now <= threeDaysMs
    }
    return isUnreadUrgent || isDueSoon
  })
}

/**
 * Saved notices targeted to the student.
 * Badge must equal the exact count of items saved by the student.
 */
export function getSavedUpdates(
  updates: UpdateItem[],
  savedIds: string[],
  user?: UserProfile
): UpdateItem[] {
  return updates.filter((u) => {
    if (!savedIds.includes(u.id)) return false
    if (user && user.role === 'student') {
      return matchesStudentAudience(u, user)
    }
    return true
  })
}

export function getSavedCount(
  updates: UpdateItem[],
  savedIds: string[],
  user?: UserProfile
): number {
  return getSavedUpdates(updates, savedIds, user).length
}

/**
 * Faculty notices: authored by the current faculty member in circulation/draft.
 */
export function getFacultyNotices(updates: UpdateItem[], user: UserProfile): UpdateItem[] {
  return updates.filter(
    (u) =>
      u.publisher.name === user.name ||
      u.publisher.email === user.email ||
      u.publisher.name === 'Dr. Maya Rao' // demo fallback
  )
}

export function getFacultyNoticesCount(updates: UpdateItem[], user: UserProfile): number {
  return getFacultyNotices(updates, user).length
}

/**
 * Admin & Platform-wide Analytics Selectors.
 * Derived from the exact same dataset so all KPI cards, chart total, and tables match.
 */
export const TOTAL_ENROLLED_ACCOUNTS = 2412

export function getAdminMetrics(updates: UpdateItem[]) {
  const published = updates.filter((u) => u.status === 'Published')
  const pending = updates.filter((u) => u.status === 'Pending')
  const scheduled = updates.filter((u) => u.status === 'Scheduled')
  const draft = updates.filter((u) => u.status === 'Draft')

  const totalNotices = updates.length
  const totalViews = updates.reduce((sum, u) => sum + (u.viewsCount || 0), 0)
  const totalReads = updates.reduce((sum, u) => sum + (u.readsCount || 0), 0)

  // Weighted verified reach rate from published notices
  const totalReachSum = published.reduce((sum, u) => sum + (u.reachPercentage || 0), 0)
  const averageReach = published.length > 0 ? Math.round(totalReachSum / published.length) : 0

  return {
    totalNotices,
    publishedCount: published.length,
    pendingCount: pending.length,
    scheduledCount: scheduled.length,
    draftCount: draft.length,
    totalViews,
    totalReads,
    averageReach,
    totalEnrolledAccounts: TOTAL_ENROLLED_ACCOUNTS,
  }
}

/**
 * Reach Estimator (Task 4.6 & 7.1)
 */
export function estimateAudienceReach(
  scope: string,
  selectedDepts: string[] = [],
  selectedYears: string[] = [],
  selectedSections: string[] = []
): number {
  if (scope === 'All') return TOTAL_ENROLLED_ACCOUNTS
  let total = 0
  if (selectedDepts.includes('School of Design')) total += 480
  if (selectedDepts.includes('Computer Science')) total += 620
  if (total === 0) total = Math.max(1, selectedDepts.length) * 402
  if (selectedYears.length > 0) total = Math.round(total * (selectedYears.length / 4))
  if (selectedSections.length > 0) total = Math.max(30, Math.round(total * 0.4))
  return Math.min(TOTAL_ENROLLED_ACCOUNTS, Math.max(24, total))
}
