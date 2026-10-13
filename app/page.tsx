'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

export default function RootPage() {
  const router = useRouter()
  const { role, isAuthenticated } = useStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    } else {
      router.replace(`/${role}`)
    }
  }, [isAuthenticated, role, router])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg-canvas)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div className="brand-mark" style={{ width: 44, height: 44, margin: '0 auto 12px' }}>
          <span style={{ fontSize: 20 }}>●●</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Entering Campus Voice...</div>
      </div>
    </div>
  )
}
