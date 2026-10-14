// Date formatting, relative calculations, timezone-safe comparisons, and .ics calendar generation

/**
 * Checks if two dates refer to the exact same calendar day in the local timezone.
 */
export function isSameDay(d1: Date | string, d2: Date | string = new Date()): boolean {
  try {
    const a = typeof d1 === 'string' ? new Date(d1) : d1
    const b = typeof d2 === 'string' ? new Date(d2) : d2
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    )
  } catch {
    return false
  }
}

/**
 * Checks if a given date string or Date object is today in the local timezone.
 */
export function isToday(date: Date | string, referenceNow: Date = new Date()): boolean {
  return isSameDay(date, referenceNow)
}

/**
 * Formats a date for the home greeting eyebrow: e.g. "Wednesday, October 14, 2026".
 */
export function formatTodayDisplay(referenceNow: Date = new Date()): string {
  return referenceNow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Formats relative time from a reference timestamp (default: now).
 */
export function formatRelativeTime(dateString: string, referenceNow: Date = new Date()): string {
  try {
    const date = new Date(dateString)
    const now = referenceNow
    const diffMs = now.getTime() - date.getTime()

    if (diffMs < 0) {
      // Future date
      const futureHours = Math.round(Math.abs(diffMs) / (1000 * 60 * 60))
      if (futureHours < 24) return `in ${futureHours} hr${futureHours === 1 ? '' : 's'}`
      const futureDays = Math.round(futureHours / 24)
      return `in ${futureDays} day${futureDays === 1 ? '' : 's'}`
    }

    const diffSecs = Math.floor(diffMs / 1000)
    if (diffSecs < 60) return 'Just now'

    const diffMins = Math.floor(diffSecs / 60)
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateString
  }
}

/**
 * Formats date as e.g. "Oct 18, 2026".
 */
export function formatDisplayDate(dateString?: string): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateString
  }
}

/**
 * Formats date for calendar date boxes: { month: "OCT", day: "14" }.
 */
export function formatShortDate(dateString?: string): { month: string; day: string } {
  if (!dateString) return { month: 'OCT', day: '14' }
  try {
    const date = new Date(dateString)
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const day = String(date.getDate()).padStart(2, '0')
    return { month, day }
  } catch {
    return { month: 'OCT', day: '14' }
  }
}

/**
 * Checks if a date is on or after the start of today in local timezone.
 */
export function isUpcoming(dateString?: string, referenceNow: Date = new Date()): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const todayStart = new Date(referenceNow)
  todayStart.setHours(0, 0, 0, 0)
  return date.getTime() >= todayStart.getTime()
}

/**
 * Checks if notice was posted within the past N days (and not in the future).
 */
export function isRecent(
  postedAtString: string,
  daysWindow = 7,
  referenceNow: Date = new Date()
): boolean {
  const posted = new Date(postedAtString).getTime()
  const now = referenceNow.getTime()
  if (posted > now) return false
  const windowMs = daysWindow * 24 * 60 * 60 * 1000
  return now - posted <= windowMs
}

/**
 * Generates dynamic dates relative to a base date (now) for seed mock data.
 * Guarantees that "Recent", "Urgent", "Due soon", and the calendar are always in sync.
 */
export function generateRelativeDates(baseDate: Date = new Date()) {
  const t = baseDate.getTime()
  const hour = 60 * 60 * 1000
  const day = 24 * hour

  return {
    examPosted: new Date(t - 2 * hour).toISOString(),
    examEvent: new Date(t + 5 * day).toISOString(),

    feePosted: new Date(t - 1 * day).toISOString(),
    feeDeadline: new Date(t + 2 * day).toISOString(),

    placementPosted: new Date(t - 2 * day).toISOString(),
    placementEvent: new Date(t + 7 * day).toISOString(),

    holidayPosted: new Date(t - 3 * day).toISOString(),
    holidayEvent: new Date(t + 10 * day).toISOString(),

    resultPosted: new Date(t - 4 * day).toISOString(),

    eventPosted: new Date(t - 5 * hour).toISOString(),
    eventEvent: new Date(t + 4 * hour).toISOString(),

    critiquePosted: new Date(t - 7 * hour).toISOString(),
    critiqueEvent: new Date(t + 18 * hour).toISOString(),

    facUpdate1Posted: new Date(t - 20 * hour).toISOString(),

    facUpdate2Posted: new Date(t - 12 * hour).toISOString(),
    facUpdate2Event: new Date(t + 3 * day).toISOString(),

    facDraftPosted: new Date(t - 6 * hour).toISOString(),
  }
}

const pad = (n: number) => (n < 10 ? '0' + n : String(n))
const formatICSDate = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`

/**
 * Downloads a single .ics calendar invite for an event or notice deadline.
 */
export function downloadICS(event: {
  title: string
  description?: string
  location?: string
  startDate: string
  endDate?: string
}) {
  const start = new Date(event.startDate)
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 60 * 60 * 1000)

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campus Voice//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@campusvoice.edu`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${event.title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
    `LOCATION:${(event.location || 'Campus').replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Exports multiple calendar events as a single .ics file (e.g. for the whole month).
 */
export function downloadMonthICS(
  events: Array<{
    title: string
    description?: string
    location?: string
    startDate: string
    endDate?: string
  }>,
  monthLabel: string
) {
  const now = new Date()
  const vevents = events.map((event, index) => {
    const start = new Date(event.startDate)
    const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 60 * 60 * 1000)
    return [
      'BEGIN:VEVENT',
      `UID:${now.getTime()}-${index}@campusvoice.edu`,
      `DTSTAMP:${formatICSDate(now)}`,
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      `SUMMARY:${event.title.replace(/,/g, '\\,')}`,
      `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
      `LOCATION:${(event.location || 'Campus').replace(/,/g, '\\,')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ].join('\r\n')
  })

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campus Voice//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    ...vevents,
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `campus_voice_events_${monthLabel.replace(/\s+/g, '_').toLowerCase()}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
