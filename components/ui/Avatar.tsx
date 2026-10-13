'use client'

import React from 'react'

export function Avatar({
  initials,
  large = false,
  className = '',
}: {
  initials: string
  large?: boolean
  className?: string
}) {
  return (
    <div className={`avatar ${large ? 'large' : ''} ${className}`.trim()} aria-hidden="true">
      {initials}
    </div>
  )
}
