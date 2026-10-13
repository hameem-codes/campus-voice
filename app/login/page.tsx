'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MessageSquareText, UserRound, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Role } from '@/types'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const { login } = useStore()

  const [selectedRole, setSelectedRole] = useState<Role>('student')
  const [email, setEmail] = useState('aarav.mehta@campus.edu')
  const [password, setPassword] = useState('••••••••')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    if (role === 'student') setEmail('aarav.mehta@campus.edu')
    else if (role === 'faculty') setEmail('maya.rao@campus.edu')
    else setEmail('priya.nair@campus.edu')
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please provide a valid campus email address.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      login(selectedRole, email)
      const target = redirectUrl || `/${selectedRole}`
      router.push(target)
    }, 400)
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        {/* Brand header */}
        <div className="login-header">
          <div className="brand-mark" style={{ width: 40, height: 40 }}>
            <MessageSquareText width={22} height={22} />
          </div>
          <h1 className="login-title">Campus Voice</h1>
          <p className="login-subtitle">
            Sign in to access your campus signal and workspace.
          </p>
        </div>

        {/* Role Quick Selector */}
        <div className="login-role-selector">
          <div className="meta-label" style={{ marginBottom: 8 }}>
            Choose demo account role
          </div>
          <div className="login-role-tabs">
            <button
              type="button"
              className={`login-role-tab ${selectedRole === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('student')}
            >
              <UserRound width={16} height={16} />
              <span>Student</span>
            </button>
            <button
              type="button"
              className={`login-role-tab ${selectedRole === 'faculty' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('faculty')}
            >
              <GraduationCap width={16} height={16} />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              className={`login-role-tab ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('admin')}
            >
              <ShieldCheck width={16} height={16} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="form-error-banner">{error}</div>}

          <div className="field">
            <label htmlFor="login-email">Campus Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@campus.edu"
              required
            />
          </div>

          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="login-password">Password</label>
              <Link href="/forgot-password" className="forgot-password-link">
                Forgot?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            iconRight={ArrowRight}
            style={{ width: '100%', marginTop: 8 }}
          >
            Enter {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Workspace
          </Button>
        </form>

        <div className="login-footer">
          <span>Demo credentials pre-filled · No password required</span>
        </div>
      </div>
    </div>
  )
}
