'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Inbox,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import { Priority, UpdateStatus } from '@/types'

const steps = ['Content', 'Audience', 'Schedule', 'Review']

export function AdminCreateView() {
  const router = useRouter()
  const { categories, departments, createUpdate, currentUser, addToast } = useStore()

  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('Fees')
  const [priority, setPriority] = useState<Priority>('Normal')
  const [audienceLabel, setAudienceLabel] = useState('All students')
  const [publishDate, setPublishDate] = useState('2026-10-15')
  const [publishTime, setPublishTime] = useState('09:00')
  const [expiry, setExpiry] = useState('Never')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {}
    if (currentStep === 0) {
      if (!title.trim()) errs.title = 'Title is required.'
      if (!message.trim()) errs.message = 'Official message is required.'
      else if (message.trim().length < 15) errs.message = 'Message must be at least 15 characters.'
    } else if (currentStep === 2) {
      if (!publishDate) errs.publishDate = 'Date is required.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(steps.length - 1, s + 1))
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return

    await createUpdate({
      title: title.trim(),
      category,
      priority,
      status: 'Published' as UpdateStatus, // Admin universal updates are published directly
      excerpt: title.trim(),
      content: message.trim(),
      department: 'Administration',
      eventDate: `${publishDate}T${publishTime}:00Z`,
      deadlineDate: `${publishDate}T${publishTime}:00Z`,
      publisher: {
        name: currentUser.name,
        role: 'Admin Office',
        email: currentUser.email,
      },
      attachments: [],
      audience: {
        departments: [],
        years: [],
        sections: [],
        isUniversal: true,
        label: audienceLabel,
      },
    })

    setSubmitted(true)
    addToast({
      type: 'success',
      title: 'Universal update published',
    })
  }

  if (submitted) {
    return (
      <div className="empty-state" style={{ minHeight: 280, padding: 32 }}>
        <CheckCircle2 width={48} height={48} style={{ color: 'var(--chip-green-fg)' }} />
        <h2 style={{ margin: '12px 0 4px', fontSize: 22, fontWeight: 500 }}>
          Universal Notice Broadcast Live
        </h2>
        <p style={{ maxWidth: 480, margin: '0 auto 20px', color: 'var(--text-2)' }}>
          The notice <strong>"{title}"</strong> has been published to all active campus channels.
        </p>
        <Button variant="primary" icon={Inbox} onClick={() => router.push('/admin/updates')}>
          Return to updates
        </Button>
      </div>
    )
  }

  return (
    <div className="form-layout">
      {/* Stepper */}
      <div className="stepper">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`step ${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`}
            onClick={() => {
              if (index < step || validateStep(step)) setStep(index)
            }}
          >
            <span className="step-number">
              {index < step ? <Check width={12} height={12} /> : index + 1}
            </span>
            <span className="step-copy">
              <strong>{label}</strong>
            </span>
          </button>
        ))}
      </div>

      {/* Form Card */}
      <section className="form-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2>{steps[step][0]}</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-2)', fontSize: 12 }}>
              {steps[step][1]} · Step {step + 1} of {steps.length}
            </p>
          </div>
          <StatusChip tone="blue">Universal Update</StatusChip>
        </div>

        {/* STEP 0: MESSAGE */}
        {step === 0 && (
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="admin-title">Update Title *</label>
              <input
                id="admin-title"
                placeholder="e.g. Fee payment window closes Friday"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <span style={{ color: 'var(--accent-red)', fontSize: 11 }}>{errors.title}</span>}
            </div>

            <div className="field full">
              <label htmlFor="admin-message">Campus-Wide Notice Content *</label>
              <textarea
                id="admin-message"
                rows={5}
                placeholder="Share the official campus-wide information clearly..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {errors.message && <span style={{ color: 'var(--accent-red)', fontSize: 11 }}>{errors.message}</span>}
            </div>
          </div>
        )}

        {/* STEP 1: SCOPE & POLICY */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="panel-card" style={{ background: 'var(--bg-muted)' }}>
              <div className="meta-label">Publishing Policy</div>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-2)', lineHeight: '18px' }}>
                Campus Voice notices are universal. If a student requires individual fee guidance,
                handle that through their private student accounts portal — never target named individuals in broadcast updates.
              </p>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                  <option value="Normal">Normal Notice</option>
                  <option value="Urgent">Urgent Campus Alert</option>
                </select>
              </div>

              <div className="field full">
                <label>Universal Audience</label>
                <select value={audienceLabel} onChange={(e) => setAudienceLabel(e.target.value)}>
                  <option value="All students">All students (Universal)</option>
                  <option value="All students and faculty">All students and faculty</option>
                  <option value="Campus-wide">Full campus community</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SCHEDULE */}
        {step === 2 && (
          <div className="form-grid">
            <div className="field">
              <label htmlFor="admin-date">Publish Date *</label>
              <input
                id="admin-date"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="admin-time">Publish Time</label>
              <input
                id="admin-time"
                type="time"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
              />
            </div>
            <div className="field full">
              <label htmlFor="admin-exp">Expiry Rule</label>
              <select id="admin-exp" value={expiry} onChange={(e) => setExpiry(e.target.value)}>
                <option value="Never">Never (Permanent archive)</option>
                <option value="After 7 days">Archive after 7 days</option>
                <option value="After 30 days">Archive after 30 days</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: PREVIEW */}
        {step === 3 && (
          <div className="panel-card" style={{ background: 'var(--bg-muted)' }}>
            <div className="meta-label">Preview · {audienceLabel}</div>
            <h3 style={{ margin: '8px 0 6px', fontSize: 20, fontWeight: 500 }}>
              {title || 'Untitled Update'}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-2)', fontSize: 13, lineHeight: '22px', whiteSpace: 'pre-wrap' }}>
              {message || 'No content entered.'}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <StatusChip tone="green">Published</StatusChip>
              <StatusChip tone="neutral">Campus-wide</StatusChip>
            </div>
          </div>
        )}

        <div className="form-footer">
          <Button
            variant="secondary"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>

          {step < steps.length - 1 ? (
            <Button variant="primary" iconRight={ArrowUpRight} onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button variant="primary" icon={Send} onClick={handleSubmit}>
              Publish Universal Update
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
