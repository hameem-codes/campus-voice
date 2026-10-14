'use client'

import React from 'react'
import { Languages } from 'lucide-react'
import { useStore } from '@/lib/store'

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useStore()

  return (
    <div
      role="group"
      aria-label="Language selection"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#fff',
        border: '2px solid #000',
        boxShadow: compact ? '2px 2px 0 0 #000' : '3px 3px 0 0 #000',
        padding: 2,
        gap: 2,
      }}
    >
      {!compact && (
        <span
          style={{
            padding: '2px 6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#000',
          }}
        >
          <Languages width={14} height={14} />
        </span>
      )}

      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        style={{
          border: '1.5px solid #000',
          background: locale === 'en' ? 'var(--neo-accent)' : '#fff',
          color: '#000',
          fontWeight: 900,
          fontSize: 11,
          padding: '4px 8px',
          cursor: 'pointer',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          transition: 'all 0.1s ease',
        }}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLocale('hi')}
        aria-pressed={locale === 'hi'}
        style={{
          border: '1.5px solid #000',
          background: locale === 'hi' ? 'var(--neo-accent)' : '#fff',
          color: '#000',
          fontWeight: 900,
          fontSize: 11,
          padding: '4px 8px',
          cursor: 'pointer',
          letterSpacing: '0.04em',
          transition: 'all 0.1s ease',
        }}
      >
        हिन्दी
      </button>
    </div>
  )
}
