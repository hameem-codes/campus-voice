'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Check,
  ArrowUpRight,
  Send,
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  AlertCircle,
  Save,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import { Modal } from '@/components/ui/Modal'
import { Attachment, Priority, UpdateStatus, UpdateItem } from '@/types'

const steps = [
  ['Details', 'Title and message'],
  ['Classify', 'Category and priority'],
  ['Audience', 'Who should see it'],
  ['Assets', 'Attachments and files'],
  ['Schedule', 'Publish timing'],
  ['Preview', 'Review and submit'],
]

export function FacultyCreateView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const {
    updates,
    createUpdate,
    editUpdate,
    categories,
    departments,
    academicYears,
    sections,
    audienceGroups,
    currentUser,
    addToast,
  } = useStore()

  // Form state
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState('Events')
  const [priority, setPriority] = useState<Priority>('Normal')
  const [audienceScope, setAudienceScope] = useState<'All' | 'Department' | 'Cohort'>('Department')
  const [selectedDepts, setSelectedDepts] = useState<string[]>([currentUser.department])
  const [selectedYears, setSelectedYears] = useState<string[]>(['Year 2'])
  const [selectedSections, setSelectedSections] = useState<string[]>(['D2'])
  const [audienceNote, setAudienceNote] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [publishDate, setPublishDate] = useState('2026-10-15')
  const [publishTime, setPublishTime] = useState('09:00')
  const [expiry, setExpiry] = useState('Never')

  // Validation error states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null)

  // Load existing update if in edit mode
  useEffect(() => {
    if (editId) {
      const existing = updates.find((u) => u.id === editId)
      if (existing) {
        setTitle(existing.title)
        setMessage(existing.content)
        setSummary(existing.excerpt)
        setCategory(existing.category)
        setPriority(existing.priority)
        setSelectedDepts(existing.audience.departments || [currentUser.department])
        setSelectedYears(existing.audience.years || [])
        setSelectedSections(existing.audience.sections || [])
        setAttachments(existing.attachments || [])
        if (existing.eventDate) {
          setPublishDate(existing.eventDate.slice(0, 10))
        }
      }
    }
  }, [editId, updates, currentUser.department])

  // Compute live estimated reach
  const estimatedReach = useMemo(() => {
    if (audienceScope === 'All') return 2400
    let total = 0
    if (selectedDepts.includes('School of Design')) total += 184
    if (selectedDepts.includes('Computer Science')) total += 420
    if (selectedYears.length > 0) total = Math.round(total * (selectedYears.length / 4))
    if (selectedSections.length > 0) total = Math.max(30, Math.round(total * 0.4))
    return Math.max(24, total)
  }, [audienceScope, selectedDepts, selectedYears, selectedSections])

  // Required-field validation per step
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {}

    if (currentStep === 0) {
      if (!title.trim()) errs.title = 'Update title is required.'
      if (!message.trim()) errs.message = 'Notice message content is required.'
      else if (message.trim().length < 15) errs.message = 'Message must be at least 15 characters.'
    } else if (currentStep === 1) {
      if (!category) errs.category = 'Please choose a category.'
      if (!summary.trim()) errs.summary = 'Short card summary is required.'
    } else if (currentStep === 2) {
      if (audienceScope !== 'All' && selectedDepts.length === 0) {
        errs.departments = 'Select at least one department.'
      }
    } else if (currentStep === 4) {
      if (!publishDate) errs.publishDate = 'Publish date is required.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Next step handler
  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(steps.length - 1, s + 1))
    }
  }

  // Autosave Draft functionality
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      addToast({ type: 'warning', title: 'Cannot save draft', message: 'Enter a title first.' })
      return
    }
    setIsSavingDraft(true)
    const draftData = {
      title: title.trim(),
      category,
      priority,
      status: 'Draft' as UpdateStatus,
      excerpt: summary || title,
      content: message,
      department: selectedDepts[0] || currentUser.department,
      publisher: {
        name: currentUser.name,
        role: currentUser.role === 'admin' ? 'Admin Office' : 'Faculty',
        email: currentUser.email,
      },
      attachments,
      audience: {
        departments: selectedDepts,
        years: selectedYears,
        sections: selectedSections,
        isUniversal: audienceScope === 'All',
        label: audienceScope === 'All' ? 'Campus-wide' : `${selectedDepts[0] || 'Targeted'} (${selectedYears.join(',')})`,
      },
    }

    if (editId) {
      const existing = updates.find((u) => u.id === editId)
      if (existing) {
        await editUpdate({ ...existing, ...draftData })
      }
    } else {
      await createUpdate(draftData)
    }

    setIsSavingDraft(false)
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    addToast({ type: 'info', title: 'Draft saved to store' })
  }

  // Real File Upload Handler (drag & drop or input)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    const newAtts: Attachment[] = []

    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      if (f.size > 10 * 1024 * 1024) {
        addToast({
          type: 'error',
          title: 'File too large',
          message: `${f.name} exceeds 10 MB limit.`,
        })
        continue
      }
      const ext = f.name.split('.').pop()?.toLowerCase()
      let type: 'pdf' | 'image' | 'doc' = 'doc'
      if (ext === 'pdf') type = 'pdf'
      else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) type = 'image'

      const sizeStr = f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`
      newAtts.push({
        id: `att-${Date.now()}-${i}`,
        name: f.name,
        size: sizeStr,
        type,
      })
    }

    setAttachments((prev) => [...prev, ...newAtts])
    addToast({
      type: 'success',
      title: `Added ${newAtts.length} attachment${newAtts.length === 1 ? '' : 's'}`,
    })
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  // Submit for Approval Handler
  const handleSubmit = async () => {
    if (!validateStep(step)) return

    const noticeData = {
      title: title.trim(),
      category,
      priority,
      status: 'Pending' as UpdateStatus, // submitted to pending queue
      excerpt: summary.trim() || title.trim(),
      content: message.trim(),
      department: selectedDepts[0] || currentUser.department,
      eventDate: `${publishDate}T${publishTime}:00Z`,
      deadlineDate: `${publishDate}T${publishTime}:00Z`,
      publisher: {
        name: currentUser.name,
        role: currentUser.role === 'admin' ? 'Admin Office' : 'Faculty Member',
        email: currentUser.email,
      },
      attachments,
      audience: {
        departments: selectedDepts,
        years: selectedYears,
        sections: selectedSections,
        isUniversal: audienceScope === 'All',
        label: audienceScope === 'All' ? 'Campus-wide' : `${selectedDepts.join(', ')} · ${selectedYears.join(', ')}`,
      },
    }

    if (editId) {
      const existing = updates.find((u) => u.id === editId)
      if (existing) {
        await editUpdate({ ...existing, ...noticeData })
      }
    } else {
      await createUpdate(noticeData)
    }

    setSubmittedSuccess(true)
  }

  // Success view
  if (submittedSuccess) {
    return (
      <div className="empty-state" style={{ minHeight: 280, padding: 32 }}>
        <CheckCircle2 width={48} height={48} style={{ color: 'var(--chip-green-fg)' }} />
        <h2 style={{ margin: '12px 0 4px', fontSize: 22, fontWeight: 500 }}>
          Notice Submitted for Approval
        </h2>
        <p style={{ maxWidth: 480, margin: '0 auto 20px', color: 'var(--text-2)' }}>
          Your update <strong>"{title}"</strong> has been placed in the Admin Approval Queue.
          Once reviewed, it will be automatically published to the estimated{' '}
          <strong>{estimatedReach.toLocaleString()} recipients</strong>.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setSubmittedSuccess(false)
              setStep(0)
              setTitle('')
              setMessage('')
              setSummary('')
              setAttachments([])
            }}
          >
            Create Another
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push('/faculty/updates')}
          >
            Go to My Updates
          </Button>
        </div>
      </div>
    )
  }

  const currentStep = steps[step]

  return (
    <div className="form-layout">
      {/* Left Stepper */}
      <div className="stepper">
        {steps.map(([label, copy], index) => (
          <button
            key={label}
            type="button"
            className={`step ${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`}
            onClick={() => {
              if (index < step || validateStep(step)) {
                setStep(index)
              }
            }}
          >
            <span className="step-number">
              {index < step ? <Check width={12} height={12} /> : index + 1}
            </span>
            <span className="step-copy">
              <strong>{label}</strong>
              <span>{copy}</span>
            </span>
          </button>
        ))}

        {/* Autosave status indicator */}
        <div style={{ marginTop: 'auto', padding: '12px 8px', fontSize: 11, color: 'var(--text-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Save width={13} height={13} />
            <span>{lastSavedTime ? `Draft saved at ${lastSavedTime}` : 'Unsaved changes'}</span>
          </div>
          <button
            type="button"
            className="btn ghost small"
            style={{ fontSize: 11, padding: '4px 0', marginTop: 4 }}
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
          >
            Save draft now
          </button>
        </div>
      </div>

      {/* Main Step Form Card */}
      <section className="form-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2>{currentStep[0]}</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-2)', fontSize: 12 }}>
              {currentStep[1]} · Step {step + 1} of {steps.length}
            </p>
          </div>
          <StatusChip tone={step === 5 ? 'green' : 'blue'}>
            {step === 5 ? 'Ready to Submit' : priority === 'Urgent' ? 'Urgent Draft' : 'Draft'}
          </StatusChip>
        </div>

        {/* STEP 0: DETAILS */}
        {step === 0 && (
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="update-title">Update Title *</label>
              <input
                id="update-title"
                placeholder="e.g. Mid-semester examination schedule released"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
                }}
              />
              {errors.title && <span style={{ color: 'var(--accent-red)', fontSize: 11 }}>{errors.title}</span>}
            </div>

            <div className="field full">
              <label htmlFor="update-message">Official Message Content *</label>
              <textarea
                id="update-message"
                placeholder="Write the verified details students and staff need to know..."
                value={message}
                rows={5}
                onChange={(e) => {
                  setMessage(e.target.value)
                  if (errors.message) setErrors((prev) => ({ ...prev, message: '' }))
                }}
              />
              {errors.message && <span style={{ color: 'var(--accent-red)', fontSize: 11 }}>{errors.message}</span>}
            </div>
          </div>
        )}

        {/* STEP 1: CLASSIFY */}
        {step === 1 && (
          <div className="form-grid">
            <div className="field">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="priority">Priority *</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="Normal">Normal Notice</option>
                <option value="Urgent">Urgent Alert</option>
              </select>
            </div>

            <div className="field full">
              <label htmlFor="summary">Short Excerpt / Card Summary *</label>
              <input
                id="summary"
                placeholder="One or two sentences shown on feed cards..."
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value)
                  if (errors.summary) setErrors((prev) => ({ ...prev, summary: '' }))
                }}
              />
              {errors.summary && <span style={{ color: 'var(--accent-red)', fontSize: 11 }}>{errors.summary}</span>}
            </div>
          </div>
        )}

        {/* STEP 2: AUDIENCE & ESTIMATED REACH */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Live estimated reach banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--chip-blue-bg)',
                borderRadius: 'var(--radius-control)',
                border: '1px solid #C8DDF2',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Users width={18} height={18} style={{ color: 'var(--chip-blue-fg)' }} />
                <div>
                  <strong style={{ color: 'var(--chip-blue-fg)', fontSize: 13 }}>
                    Live Estimated Reach: {estimatedReach.toLocaleString()} recipients
                  </strong>
                  <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                    Calculated from cohort enrollment parameters
                  </div>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="field full">
                <label>Audience Targeting Scope</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    type="button"
                    className={`btn small ${audienceScope === 'All' ? 'primary' : 'secondary'}`}
                    onClick={() => setAudienceScope('All')}
                  >
                    Universal (All Campus)
                  </button>
                  <button
                    type="button"
                    className={`btn small ${audienceScope === 'Department' ? 'primary' : 'secondary'}`}
                    onClick={() => setAudienceScope('Department')}
                  >
                    Department Focused
                  </button>
                  <button
                    type="button"
                    className={`btn small ${audienceScope === 'Cohort' ? 'primary' : 'secondary'}`}
                    onClick={() => setAudienceScope('Cohort')}
                  >
                    Specific Cohort / Studio
                  </button>
                </div>
              </div>

              {audienceScope !== 'All' && (
                <>
                  <div className="field">
                    <label>Target Departments</label>
                    <select
                      value={selectedDepts[0] || ''}
                      onChange={(e) => setSelectedDepts([e.target.value])}
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Target Academic Year</label>
                    <select
                      value={selectedYears[0] || 'Year 2'}
                      onChange={(e) => setSelectedYears([e.target.value])}
                    >
                      {academicYears.map((y) => (
                        <option key={y.id} value={y.name}>
                          {y.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field full">
                    <label>Sections / Studios</label>
                    <input
                      placeholder="e.g. D2, CS1 (comma separated)"
                      value={selectedSections.join(', ')}
                      onChange={(e) =>
                        setSelectedSections(e.target.value.split(',').map((s) => s.trim()))
                      }
                    />
                  </div>
                </>
              )}

              <div className="field full">
                <label htmlFor="aud-note">Audience Note (Optional)</label>
                <textarea
                  id="aud-note"
                  placeholder="Internal note regarding targeted cohort..."
                  value={audienceNote}
                  onChange={(e) => setAudienceNote(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ASSETS & REAL FILE UPLOAD */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Drag & drop upload box */}
            <div
              className="upload-box"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                handleFileUpload(e.dataTransfer.files)
              }}
              style={{ cursor: 'pointer' }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <div>
                <UploadCloud width={28} height={28} />
                <span style={{ fontWeight: 500 }}>Click to browse or drop files here</span>
                <small>Supports PDF, PNG, JPG up to 10 MB each</small>
              </div>
            </div>

            {/* List of uploaded attachments */}
            {attachments.length > 0 && (
              <div>
                <div className="meta-label" style={{ marginBottom: 8 }}>
                  Uploaded Attachments ({attachments.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-control)',
                        background: 'var(--bg-muted)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileText width={18} height={18} style={{ color: 'var(--accent-blue)' }} />
                        <div>
                          <strong style={{ fontSize: 13 }}>{att.name}</strong>
                          <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 8 }}>
                            {att.size}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          className="icon-button"
                          style={{ width: 28, height: 28 }}
                          onClick={() => setPreviewAttachment(att)}
                          aria-label={`Preview ${att.name}`}
                        >
                          <Eye width={14} height={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          style={{ width: 28, height: 28, color: 'var(--accent-red)' }}
                          onClick={() => removeAttachment(att.id)}
                          aria-label={`Remove ${att.name}`}
                        >
                          <Trash2 width={14} height={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: SCHEDULE */}
        {step === 4 && (
          <div className="form-grid">
            <div className="field">
              <label htmlFor="pub-date">Publication Date *</label>
              <input
                id="pub-date"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="pub-time">Publication Time</label>
              <input
                id="pub-time"
                type="time"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
              />
            </div>

            <div className="field full">
              <label htmlFor="expiry">Expiry Rule</label>
              <select
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              >
                <option value="Never">Never (Keep in archives)</option>
                <option value="After 7 days">Archive after 7 days</option>
                <option value="After 30 days">Archive after 30 days</option>
                <option value="End of semester">Archive at end of Autumn Term</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 5: PREVIEW WITH REAL ENTERED CONTENT */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="panel-card" style={{ background: 'var(--bg-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="meta-label">Verified Preview · {category}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <StatusChip tone={priority === 'Urgent' ? 'orange' : 'neutral'}>
                    {priority}
                  </StatusChip>
                  <StatusChip tone="blue">Scheduled for {publishDate}</StatusChip>
                </div>
              </div>

              <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 500 }}>
                {title || 'Untitled Notice'}
              </h3>
              <p style={{ margin: '0 0 16px', color: 'var(--text-2)', fontSize: 13, lineHeight: '20px' }}>
                {summary || 'No summary entered.'}
              </p>

              <div
                style={{
                  background: 'var(--bg-surface)',
                  padding: 16,
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid var(--border)',
                  fontSize: 13,
                  lineHeight: '22px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {message || 'No content entered.'}
              </div>

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text-3)' }}>
                <div>
                  Publisher: <strong>{currentUser.name}</strong> · {selectedDepts.join(', ')}
                </div>
                <div>
                  Attachments: <strong>{attachments.length} files</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Footer */}
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
              Submit for Admin Approval
            </Button>
          )}
        </div>
      </section>

      {/* Attachment Preview Modal */}
      <Modal
        isOpen={Boolean(previewAttachment)}
        onClose={() => setPreviewAttachment(null)}
        title={previewAttachment?.name || 'File Preview'}
        description={`${previewAttachment?.size} · Uploaded file preview`}
      >
        <div style={{ padding: 24, textAlign: 'center', background: 'var(--bg-canvas)', borderRadius: 8 }}>
          <FileText width={36} height={36} style={{ color: 'var(--accent-blue)', margin: '0 auto 12px' }} />
          <strong>{previewAttachment?.name}</strong>
          <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
            File ready to attach to campus notice.
          </p>
        </div>
      </Modal>
    </div>
  )
}
