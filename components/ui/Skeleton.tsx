'use client'

import React from 'react'

export function Skeleton({
  height,
  width,
  borderRadius,
  className = '',
  style,
}: {
  height?: number | string
  width?: number | string
  borderRadius?: number | string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`skeleton-shimmer ${className}`.trim()}
      style={{
        height: height ?? '16px',
        width: width ?? '100%',
        borderRadius: borderRadius ?? 'var(--radius-control)',
        ...style,
      }}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="update-card" style={{ gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Skeleton height={28} width={28} borderRadius="50%" />
          <div>
            <Skeleton height={12} width={100} />
            <Skeleton height={10} width={60} style={{ marginTop: 4 }} />
          </div>
        </div>
        <Skeleton height={20} width={70} borderRadius={6} />
      </div>
      <div>
        <Skeleton height={16} width="85%" />
        <Skeleton height={12} width="100%" style={{ marginTop: 8 }} />
        <Skeleton height={12} width="65%" style={{ marginTop: 4 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 }}>
        <Skeleton height={12} width={80} />
        <Skeleton height={12} width={80} />
      </div>
    </div>
  )
}
