'use client'

import React from 'react'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  compact?: boolean
  subtitle?: string
  inverted?: boolean
  showTagline?: boolean
  className?: string
}

export function BrandLogo({
  size = 'md',
  compact = false,
  subtitle,
  inverted = false,
  showTagline = true,
  className = '',
}: BrandLogoProps) {
  const barHeights = [14, 22, 18, 12]
  const effectiveSize = compact ? 'sm' : size
  const scale = effectiveSize === 'sm' ? 0.75 : effectiveSize === 'lg' ? 1.25 : 1
  const displayTagline = showTagline && !compact && subtitle !== ''

  return (
    <div
      className={`brand-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${Math.round(10 * scale)}px`,
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      {/* 4 Acid-Lime Equalizer Bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: `${Math.round(3 * scale)}px`,
          height: `${Math.round(26 * scale)}px`,
        }}
        aria-hidden="true"
      >
        {barHeights.map((h, i) => (
          <span
            key={i}
            style={{
              width: `${Math.round(4.5 * scale)}px`,
              height: `${Math.round(h * scale)}px`,
              backgroundColor: '#D5FF38', // Acid lime
              borderRadius: '9999px',
              display: 'inline-block',
              transition: 'transform 0.15s ease',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: `${Math.round(18 * scale)}px`,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: inverted ? '#FFFFFF' : '#111111',
          }}
        >
          CampusVoice
        </span>
        {displayTagline && (
          <span
            style={{
              fontSize: `${Math.round(10 * scale)}px`,
              lineHeight: 1.2,
              fontWeight: 600,
              color: inverted ? '#A3A3A3' : '#737373',
              letterSpacing: '-0.01em',
              marginTop: '1px',
            }}
          >
            {subtitle || 'Verified Updates. A Stronger Campus.'}
          </span>
        )}
      </div>
    </div>
  )
}
