'use client'

import React from 'react'
import Link from 'next/link'
import { FileQuestion, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-denied-icon">
          <FileQuestion width={32} height={32} />
        </div>
        <h2>404 · Page Not Found</h2>
        <p>
          The page or update you are looking for has been moved, archived, or does not exist.
        </p>
        <div style={{ marginTop: 16 }}>
          <Link href="/student">
            <Button variant="primary" icon={Home}>
              Return to Campus Voice
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
