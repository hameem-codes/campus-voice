'use client'

import React from 'react'

const AVATAR_PALETTES = [
  { bg: '#ECEDFB', fg: '#474AB0', border: '#D7D9F8' }, // Indigo tint
  { bg: '#FBF0EA', fg: '#A34F25', border: '#F8D8C8' }, // Warm amber tint
  { bg: '#EBF7EE', fg: '#2C6C38', border: '#CFE9D6' }, // Sage green tint
  { bg: '#EBF3FE', fg: '#2A5C9A', border: '#D0E3FA' }, // Soft blue tint
  { bg: '#F5EFFB', fg: '#663B8B', border: '#E4D5F5' }, // Muted violet tint
  { bg: '#F7F4EC', fg: '#6E5D30', border: '#E8E1CE' }, // Warm sand tint
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

