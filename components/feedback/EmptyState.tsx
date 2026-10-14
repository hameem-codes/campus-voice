'use client'

import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title = 'No matches',
  description = 'Try a different filter.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Icon width={28} height={28} style={{ color: 'var(--text-3)' }} />
      <div>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        {actionLabel && onAction && (
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
