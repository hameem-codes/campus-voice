'use client'

import React from 'react'
import { ChipTone } from '@/types'

export function toneForStatus(status: string): ChipTone {
  const s = status.toLowerCase()
  if (s === 'urgent' || s === 'rejected') return 'orange'
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
