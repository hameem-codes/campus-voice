'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Role } from '@/types'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: Role[]
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, role, isLoaded } = useStore()

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password')

  useEffect(() => {
    if (isLoaded && !isAuthenticated && !isAuthRoute) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isAuthRoute, isLoaded, pathname, router])

  if (!isLoaded && !isAuthRoute) {
    return (
      <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ height: 32, width: 220 }} className="skeleton-shimmer" />
        <div style={{ height: 200, width: '100%', borderRadius: 'var(--radius-card)' }} className="skeleton-shimmer" />
      </div>
    )
  }

  if (!isAuthenticated && !isAuthRoute) {
    return null
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-card">
          <div className="access-denied-icon">
            <ShieldAlert width={32} height={32} />
          </div>
          <h2>Access Denied</h2>
          <p>
            This section is restricted to <strong>{allowedRoles.join(' or ')}</strong> accounts.
            You are currently viewing as <strong>{role}</strong>.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            <Button variant="secondary" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button variant="primary" onClick={() => router.push(`/${role}`)}>
              Return to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
