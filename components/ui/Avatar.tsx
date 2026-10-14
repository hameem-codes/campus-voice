'use client'

import React from 'react'

const AVATAR_PALETTES = [
  { bg: '#FFD93D', fg: '#000000', border: '#000000' }, // Vivid Yellow
  { bg: '#FF6B6B', fg: '#000000', border: '#000000' }, // Hot Red
  { bg: '#C4B5FD', fg: '#000000', border: '#000000' }, // Soft Violet
  { bg: '#9BCB8B', fg: '#000000', border: '#000000' }, // Sage Green
  { bg: '#7FB7E6', fg: '#000000', border: '#000000' }, // Sky Blue
  { bg: '#FFA07A', fg: '#000000', border: '#000000' }, // Tangerine
]

function getAvatarPalette(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length
  return AVATAR_PALETTES[index]
}

export function Avatar({
  initials,
  large = false,
  className = '',
}: {
  initials: string
  large?: boolean
  className?: string
}) {
  const palette = getAvatarPalette(initials || 'CV')
  return (
    <div
      className={`avatar ${large ? 'large' : ''} ${className}`.trim()}
      aria-hidden="true"
      style={{
        backgroundColor: palette.bg,
        color: palette.fg,
        borderColor: palette.border,
      }}
    >
      {initials}
    </div>
  )
}

