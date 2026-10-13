'use client'

import React from 'react'
import { ChipTone } from '@/types'

export function toneForStatus(status: string): ChipTone {
  const s = status.toLowerCase()
  if (s === 'urgent' || s === 'rejected') return 'orange'
  if (s === 'published' || s === 'active') return 'green'
  if (s === 'scheduled' || s === 'pending') return 'blue'
  return 'neutral'
}

export function StatusChip({
  children,
  tone = 'neutral',
  className = '',
  onClick,
}: {
  children: React.ReactNode
  tone?: ChipTone
  className?: string
  onClick?: () => void
}) {
  const Component = onClick ? 'button' : 'span'
  return (
    <Component
      className={`chip ${tone} ${className}`.trim()}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Component>
  )
}
