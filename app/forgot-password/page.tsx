'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MessageSquareText, ArrowLeft, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'

export default function ForgotPasswordPage() {
  const { addToast } = useStore()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      addToast({
        type: 'success',
        title: 'Reset instructions dispatched',
        message: `Recovery link sent to ${email}`,
      })
    }, 450)
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-mark" style={{ width: 40, height: 40 }}>
            <MessageSquareText width={22} height={22} />
          </div>
          <h1 className="login-title">Reset Password</h1>
          <p className="login-subtitle">
            Enter your verified campus email to receive a recovery passkey.
          </p>
        </div>

        {submitted ? (
          <div className="empty-state" style={{ minHeight: 180, margin: '16px 0' }}>
            <MailCheck width={32} height={32} style={{ color: 'var(--chip-green-fg)' }} />
            <h3>Check your inbox</h3>
            <p>
              We sent password recovery instructions to <strong>{email}</strong>.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button variant="primary" href="/reset-password">
                Proceed to reset code
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label htmlFor="recovery-email">Campus Email</label>
              <input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campus.edu"
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              style={{ width: '100%', marginTop: 8 }}
            >
              Send Password Reset Link
            </Button>
          </form>
        )}

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link href="/login" className="back-link">
            <ArrowLeft width={14} height={14} />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
