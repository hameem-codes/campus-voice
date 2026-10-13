'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquareText, ArrowLeft, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { addToast } = useStore()

  const [code, setCode] = useState('849201')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      addToast({
        type: 'success',
        title: 'Password updated',
        message: 'Your password was successfully reset. Please sign in.',
      })
      router.push('/login')
    }, 400)
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-mark" style={{ width: 40, height: 40 }}>
            <KeyRound width={22} height={22} />
          </div>
          <h1 className="login-title">New Password</h1>
          <p className="login-subtitle">
            Enter the 6-digit recovery code and pick your new secure password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="form-error-banner">{error}</div>}

          <div className="field">
            <label htmlFor="reset-code">Verification Code</label>
            <input
              id="reset-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setError('')
              }}
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError('')
              }}
              placeholder="Re-enter password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', marginTop: 8 }}
          >
            Update Password & Return
          </Button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link href="/login" className="back-link">
            <ArrowLeft width={14} height={14} />
            <span>Cancel and return to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
