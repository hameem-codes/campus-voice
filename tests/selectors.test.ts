import { describe, it, expect } from 'vitest'
import {
  matchesStudentAudience,
  getStudentFeed,
  getStudentAllCount,
  getStudentUnreadCount,
  getUrgentUnreadCount,
  getStudentTotalUrgentCount,
  getAttentionItems,
  getSavedCount,
  getFacultyNoticesCount,
  getAdminMetrics,
  formatPlural,
  formatAttentionHeadline,
  TOTAL_ENROLLED_ACCOUNTS,
  estimateAudienceReach,
} from '@/lib/selectors'
import { isSameDay, isToday, formatRelativeTime, generateRelativeDates } from '@/lib/date'
import { initialUpdates, initialUsers } from '@/data/mockData'
import { UpdateItem, UserProfile } from '@/types'

const studentUser: UserProfile = initialUsers[0] // Aarav Mehta, School of Design, Year 2, Section D2
const facultyUser: UserProfile = initialUsers[1] // Dr. Maya Rao, Faculty

describe('Phase 1: Selector Consistency & Mathematical Agreement', () => {
  it('1.1: Sidebar Updates badge agrees exactly with student unread count and Updates page tabs', () => {
    const feed = getStudentFeed(initialUpdates, studentUser)
    const allCount = getStudentAllCount(initialUpdates, studentUser)
    const unreadCount = getStudentUnreadCount(initialUpdates, studentUser)

    expect(feed.length).toBe(allCount)
    expect(feed.filter((u) => !u.read).length).toBe(unreadCount)

    // Ensure all items in student feed match the student's cohort
    feed.forEach((update) => {
      expect(matchesStudentAudience(update, studentUser)).toBe(true)
      expect(update.status).toBe('Published')
    })
  })

  it('1.2: One single definition of "urgent unread" used across Home card, banner, and tabs', () => {
    const urgentUnreadCount = getUrgentUnreadCount(initialUpdates, studentUser)
    const feed = getStudentFeed(initialUpdates, studentUser)
    const manualCount = feed.filter((u) => u.priority === 'Urgent' && !u.read).length

    expect(urgentUnreadCount).toBe(manualCount)

    // Attention items should include unread urgent notices
    const attentionItems = getAttentionItems(initialUpdates, studentUser)
    expect(attentionItems.length).toBeGreaterThanOrEqual(urgentUnreadCount)
  })

  it('1.3: Admin Analytics: Total views, KPI cards, and category table sum to the exact same numbers', () => {
    const metrics = getAdminMetrics(initialUpdates)

    // Total notices equals sum of breakdown statuses
    expect(metrics.totalNotices).toBe(
      metrics.publishedCount + metrics.pendingCount + metrics.scheduledCount + metrics.draftCount
    )

    // Total views equals sum of all item views
    const manualViews = initialUpdates.reduce((sum, u) => sum + (u.viewsCount || 0), 0)
    expect(metrics.totalViews).toBe(manualViews)

    // Total reads equals sum of all item reads
    const manualReads = initialUpdates.reduce((sum, u) => sum + (u.readsCount || 0), 0)
    expect(metrics.totalReads).toBe(manualReads)

    // Enrolled accounts constant matches dashboard
    expect(metrics.totalEnrolledAccounts).toBe(TOTAL_ENROLLED_ACCOUNTS)
    expect(TOTAL_ENROLLED_ACCOUNTS).toBe(2412)
  })

  it('1.4: Saved count and Faculty notice count selectors reflect real status items', () => {
    const savedIds = ['exam', 'placement']
    const savedCount = getSavedCount(initialUpdates, savedIds, studentUser)
    expect(savedCount).toBeGreaterThanOrEqual(1)

    const facultyCount = getFacultyNoticesCount(initialUpdates, facultyUser)
    expect(facultyCount).toBeGreaterThan(0)
  })

  it('1.8: Date helper local timezone consistency', () => {
    const now = new Date()
    expect(isToday(now)).toBe(true)
    expect(isSameDay(now, new Date(now.getTime()))).toBe(true)

    // A date 24 hours ago should not be today
    const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000)
    expect(isToday(yesterday)).toBe(false)
  })

  it('2.4: Plural helper formats correctly across all quantities', () => {
    expect(formatPlural(1, 'item')).toBe('1 item')
    expect(formatPlural(2, 'item')).toBe('2 items')
    expect(formatPlural(0, 'notice', 'notices')).toBe('0 notices')
    expect(formatAttentionHeadline(1)).toBe('1 item needs attention')
    expect(formatAttentionHeadline(3)).toBe('3 items need attention')
    expect(formatAttentionHeadline(0)).toBe('0 items need attention')
  })

  it('1.7: Relative seed dates are calculated dynamically relative to now', () => {
    const dates = generateRelativeDates(new Date())
    const now = Date.now()

    // Posted dates should be in the past
    expect(new Date(dates.examPosted).getTime()).toBeLessThan(now)
    expect(new Date(dates.feePosted).getTime()).toBeLessThan(now)

    // Future events should be in the future
    expect(new Date(dates.examEvent).getTime()).toBeGreaterThan(now)
    expect(new Date(dates.feeDeadline).getTime()).toBeGreaterThan(now)
  })

  it('7.1: Audience targeting logic correctly matches cohort parameters', () => {
    // 1. Universal notice matches everyone
    const universalUpdate: UpdateItem = {
      ...initialUpdates[0],
      audience: {
        departments: [],
        years: [],
        sections: [],
        isUniversal: true,
      },
    }
    expect(matchesStudentAudience(universalUpdate, studentUser)).toBe(true)

    // 2. Department match
    const matchingDeptUpdate: UpdateItem = {
      ...initialUpdates[0],
      audience: {
        departments: ['School of Design'],
        years: [],
        sections: [],
        isUniversal: false,
      },
    }
    expect(matchesStudentAudience(matchingDeptUpdate, studentUser)).toBe(true)

    // 3. Department mismatch
    const mismatchDeptUpdate: UpdateItem = {
      ...initialUpdates[0],
      audience: {
        departments: ['Civil Engineering'],
        years: [],
        sections: [],
        isUniversal: false,
      },
    }
    expect(matchesStudentAudience(mismatchDeptUpdate, studentUser)).toBe(false)

    // 4. Year match and mismatch
    const matchingYearUpdate: UpdateItem = {
      ...initialUpdates[0],
      audience: {
        departments: ['School of Design'],
        years: ['Year 2'],
        sections: [],
        isUniversal: false,
      },
    }
    expect(matchesStudentAudience(matchingYearUpdate, studentUser)).toBe(true)

    const mismatchYearUpdate: UpdateItem = {
      ...initialUpdates[0],
      audience: {
        departments: ['School of Design'],
        years: ['Year 4'],
        sections: [],
        isUniversal: false,
      },
    }
    expect(matchesStudentAudience(mismatchYearUpdate, studentUser)).toBe(false)
  })

  it('7.1: Reach estimator accurately calculates cohort reach from 2,412 base', () => {
    // Universal scope
    expect(estimateAudienceReach('All')).toBe(2412)

    // Single department
    const designReach = estimateAudienceReach('Department', ['School of Design'])
    expect(designReach).toBe(480)

    // Multiple departments
    const dualReach = estimateAudienceReach('Department', ['School of Design', 'Computer Science'])
    expect(dualReach).toBe(1100)

    // Scaled by years (e.g. 2 of 4 years = 50%)
    const yearScaled = estimateAudienceReach('Custom', ['School of Design'], ['Year 1', 'Year 2'])
    expect(yearScaled).toBe(240)

    // Scaled by section
    const sectionScaled = estimateAudienceReach(
      'Custom',
      ['School of Design'],
      ['Year 2'],
      ['D2']
    )
    expect(sectionScaled).toBeGreaterThan(0)
    expect(sectionScaled).toBeLessThanOrEqual(480)
  })
})

