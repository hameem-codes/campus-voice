'use client'

import React from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconRight?: LucideIcon
  loading?: boolean
  href?: string
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  className = '',
  disabled,
  href,
  ...props
}: ButtonProps) {
  const sizeClass = size === 'sm' ? 'small' : size === 'lg' ? 'large' : ''
  const variantClass = variant === 'danger' ? 'danger' : variant
  const combinedClass = `btn ${variantClass} ${sizeClass} ${className}`.trim()

  const content = (
    <>
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        Icon && <Icon className="btn-icon" aria-hidden="true" />
      )}
      {children && <span>{children}</span>}
      {!loading && IconRight && <IconRight className="btn-icon-right" aria-hidden="true" />}
    </>
  )

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={combinedClass}
        style={props.style}
        aria-label={props['aria-label']}
        tabIndex={props.tabIndex}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      className={combinedClass}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  )
}

