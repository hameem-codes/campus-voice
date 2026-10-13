import React from 'react'
import { CardSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ height: 40, width: 260 }} className="skeleton-shimmer" />
      <div className="card-grid">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
