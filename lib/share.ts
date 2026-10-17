import { UpdateItem } from '@/types'
import { formatDisplayDate } from './date'

export function formatWhatsAppSummary(item: UpdateItem): string {
  const isUrgent = item.priority === 'Urgent'
  const lines: string[] = [
    `📢 [Campus Voice Verified] ${item.title}`
  ]

  if (isUrgent) {
    lines.push(`⚠️ Urgent: ${item.excerpt || 'Critical announcement requiring attention.'}`)
  } else if (item.excerpt) {
    lines.push(`📌 Summary: ${item.excerpt}`)
  }

  const dateVal = item.eventDate || item.deadlineDate
  if (dateVal) {
    lines.push(`📅 Event Date: ${formatDisplayDate(dateVal)}`)
  }

  const origin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://campusvoice-ashen.vercel.app'

  lines.push(`🔗 Read official notice: ${origin}/student/updates/${item.id}`)

  return lines.join('\n')
}

export async function copyWhatsAppSummary(
  item: UpdateItem,
  onCopied?: () => void
): Promise<boolean> {
  const text = formatWhatsAppSummary(item)
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      onCopied?.()
      return true
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err)
  }

  // Fallback for older browsers / iframe contexts
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      onCopied?.()
      return true
    } catch (err2) {
      console.error('Fallback copy failed', err2)
    }
  }

  return false
}
