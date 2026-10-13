'use client'

import React, { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Captured runtime error:', error)
  }, [error])

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-denied-icon" style={{ background: 'var(--chip-orange-bg)', color: 'var(--accent-red)' }}>
          <AlertCircle width={32} height={32} />
        </div>
        <h2>Something went wrong</h2>
        <p>
          We encountered an unexpected error while loading this page. You can retry or head back to safety.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <Button variant="secondary" icon={RefreshCw} onClick={() => reset()}>
            Try again
          </Button>
          <Link href="/student">
            <Button variant="primary" icon={Home}>
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
