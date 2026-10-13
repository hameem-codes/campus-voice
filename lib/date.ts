// Date formatting, relative calculations, and .ics calendar generation

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
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

export function formatDisplayDate(dateString?: string): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateString
  }
}

export function formatShortDate(dateString?: string): { month: string; day: string } {
  if (!dateString) return { month: 'OCT', day: '13' }
  try {
    const date = new Date(dateString)
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const day = String(date.getDate()).padStart(2, '0')
    return { month, day }
  } catch {
    return { month: 'OCT', day: '13' }
  }
}

export function isUpcoming(dateString?: string): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  return date.getTime() >= new Date().setHours(0, 0, 0, 0)
}

export function isRecent(postedAtString: string, daysWindow = 7): boolean {
  const posted = new Date(postedAtString).getTime()
  const now = new Date().getTime()
  if (posted > now) return false // never show future dates under recent
  const windowMs = daysWindow * 24 * 60 * 60 * 1000
  return now - posted <= windowMs
}

export function downloadICS(event: {
  title: string
  description?: string
  location?: string
  startDate: string
  endDate?: string
}) {
  const start = new Date(event.startDate)
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 60 * 60 * 1000)

  const pad = (n: number) => (n < 10 ? '0' + n : n)
  const formatICSDate = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`

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
