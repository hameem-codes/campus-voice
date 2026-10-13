'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  UserRound,
  Bell,
  Lock,
  Globe,
  Sun,
  Moon,
  LogOut,
  RotateCcw,
  Check,
  Edit2,
  Save,
  X,
  Shield,
  Smartphone,
  Mail,
  MessageSquare,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function StudentProfileView() {
  const router = useRouter()
  const {
    currentUser,
    updateProfile,
    resetPreferencesToDefault,
    departments,
    academicYears,
    sections,
    theme,
    toggleTheme,
    logout,
    addToast,
  } = useStore()

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(currentUser.name)
  const [studentId, setStudentId] = useState(currentUser.studentId || '')
  const [department, setDepartment] = useState(currentUser.department)
  const [year, setYear] = useState(currentUser.year || 'Year 2')
  const [section, setSection] = useState(currentUser.section || 'D2')
  const [editError, setEditError] = useState('')

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Language selector state
  const [language, setLanguage] = useState('English (US)')

  // Reset defaults dialog
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  // Notification Preferences
  const prefs = currentUser.notificationPreferences

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setEditError('Full name is required.')
      return
    }
    if (!studentId.trim()) {
      setEditError('Student ID is required.')
      return
    }
    setEditError('')
    await updateProfile({
      name: name.trim(),
      studentId: studentId.trim(),
      department,
      year,
      section,
    })
    setIsEditing(false)
    addToast({
      type: 'success',
      title: 'Profile updated',
      message: 'Your campus notice feed has been adjusted to your new cohort.',
    })
  }

  const handleTogglePref = async (key: keyof typeof prefs) => {
    const updated = {
      ...prefs,
      [key]: !prefs[key],
    }
    await updateProfile({ notificationPreferences: updated })
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      setPasswordError('Please enter your current password.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    setPasswordError('')
    setPasswordSuccess('Password successfully updated!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    addToast({
      type: 'success',
      title: 'Account password changed',
    })
    setTimeout(() => setPasswordSuccess(''), 4000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Profile Information Card */}
      <section className="panel-card" style={{ padding: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            paddingBottom: 20,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar initials={currentUser.avatarInitials} large />
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>
                {currentUser.name}
              </h2>
              <p style={{ color: 'var(--text-2)', margin: '4px 0 0', fontSize: 13 }}>
                {currentUser.department} · {currentUser.year} · Section {currentUser.section}
              </p>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                Student ID: <strong>{currentUser.studentId}</strong> · {currentUser.email}
              </div>
            </div>
          </div>

          <div>
            {isEditing ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="secondary" icon={X} onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" icon={Save} onClick={handleSaveProfile}>
                  Save changes
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                icon={Edit2}
                onClick={() => {
                  setName(currentUser.name)
                  setStudentId(currentUser.studentId || '')
                  setDepartment(currentUser.department)
                  setYear(currentUser.year || 'Year 2')
                  setSection(currentUser.section || 'D2')
                  setIsEditing(true)
                }}
              >
                Edit profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Fields: View Mode or Edit Form */}
        {isEditing ? (
          <div className="form-grid" style={{ marginTop: 20 }}>
            {editError && (
              <div className="field full" style={{ color: 'var(--accent-red)', fontSize: 12 }}>
                {editError}
              </div>
            )}
            <div className="field">
              <label htmlFor="edit-name">Full Name</label>
              <input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="edit-student-id">Student ID</label>
              <input
                id="edit-student-id"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="edit-dept">Department</label>
              <select
                id="edit-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="edit-year">Academic Year</label>
              <select
                id="edit-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {academicYears.map((y) => (
                  <option key={y.id} value={y.name}>
                    {y.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="edit-section">Class Section</label>
              <select
                id="edit-section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="form-grid" style={{ marginTop: 20 }}>
            <div>
              <div className="meta-label">Campus Email</div>
              <div className="meta-value">{currentUser.email}</div>
            </div>
            <div>
              <div className="meta-label">Student ID</div>
              <div className="meta-value">{currentUser.studentId}</div>
            </div>
            <div>
              <div className="meta-label">Department</div>
              <div className="meta-value">{currentUser.department}</div>
            </div>
            <div>
              <div className="meta-label">Cohort & Section</div>
              <div className="meta-value">
                {currentUser.year} · Section {currentUser.section}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Notification Preferences per Category AND per Channel */}
      <section className="panel-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 className="panel-title" style={{ margin: 0 }}>
              Notification Preferences
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-2)' }}>
              Configure alert subscriptions per category and delivery channels.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={() => setResetDialogOpen(true)}
          >
            Reset to default
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {/* Category Toggles */}
          <div>
            <div className="nav-section-label" style={{ marginBottom: 12, padding: 0 }}>
              Notice Categories
            </div>
            <div className="settings-list">
              <div className="setting-row">
                <div className="setting-copy">
                  <strong>Urgent Campus Notices</strong>
                  <span>Emergency alerts, exam venue changes</span>
                </div>
                <button
                  type="button"
                  className={`switch ${prefs.urgentNotices ? 'on' : ''}`}
                  onClick={() => handleTogglePref('urgentNotices')}
                  aria-label="Toggle urgent campus notices"
                >
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <div className="setting-copy">
                  <strong>Deadlines and Reminders</strong>
                  <span>Fee payment window, course registration</span>
                </div>
                <button
                  type="button"
                  className={`switch ${prefs.deadlines ? 'on' : ''}`}
                  onClick={() => handleTogglePref('deadlines')}
                  aria-label="Toggle deadline reminders"
                >
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <div className="setting-copy">
                  <strong>Student Community Events</strong>
                  <span>Club workshops, open studios, talks</span>
                </div>
                <button
                  type="button"
                  className={`switch ${prefs.communityEvents ? 'on' : ''}`}
                  onClick={() => handleTogglePref('communityEvents')}
                  aria-label="Toggle community events"
                >
                  <span />
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Channel Toggles */}
          <div>
            <div className="nav-section-label" style={{ marginBottom: 12, padding: 0 }}>
              Delivery Channels
            </div>
            <div className="settings-list">
              <div className="setting-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Mail width={16} height={16} style={{ color: 'var(--text-3)' }} />
                  <div className="setting-copy">
                    <strong>Email Delivery</strong>
                    <span>Digest and critical announcements</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`switch ${prefs.emailChannel ? 'on' : ''}`}
                  onClick={() => handleTogglePref('emailChannel')}
                  aria-label="Toggle email delivery"
                >
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Smartphone width={16} height={16} style={{ color: 'var(--text-3)' }} />
                  <div className="setting-copy">
                    <strong>Push Notifications</strong>
                    <span>In-app and mobile alerts</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`switch ${prefs.pushChannel ? 'on' : ''}`}
                  onClick={() => handleTogglePref('pushChannel')}
                  aria-label="Toggle push notifications"
                >
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MessageSquare width={16} height={16} style={{ color: 'var(--text-3)' }} />
                  <div className="setting-copy">
                    <strong>SMS Critical Alerts</strong>
                    <span>Restricted to urgent emergency notices</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`switch ${prefs.smsChannel ? 'on' : ''}`}
                  onClick={() => handleTogglePref('smsChannel')}
                  aria-label="Toggle SMS alerts"
                >
                  <span />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Account Settings & Password change form */}
      <section className="panel-card" style={{ padding: 24 }}>
        <h2 className="panel-title" style={{ margin: '0 0 16px' }}>
          Account Security & Preferences
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="nav-section-label" style={{ padding: 0 }}>
              Change Password
            </div>
            {passwordError && (
              <div style={{ color: 'var(--accent-red)', fontSize: 12 }}>{passwordError}</div>
            )}
            {passwordSuccess && (
              <div style={{ color: 'var(--chip-green-fg)', fontSize: 12 }}>{passwordSuccess}</div>
            )}

            <div className="field">
              <label htmlFor="cur-pass">Current Password</label>
              <input
                id="cur-pass"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="field">
              <label htmlFor="new-pass">New Password</label>
              <input
                id="new-pass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
            <div className="field">
              <label htmlFor="confirm-pass">Confirm New Password</label>
              <input
                id="confirm-pass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </div>
            <Button type="submit" variant="secondary" icon={Lock} style={{ alignSelf: 'flex-start' }}>
              Update Password
            </Button>
          </form>

          {/* Regional & Appearance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="nav-section-label" style={{ padding: 0 }}>
              Regional & Theme
            </div>

            <div className="field">
              <label htmlFor="pref-lang">Interface Language</label>
              <select
                id="pref-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Spanish">Spanish (Español)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
              <div>
                <strong>Color Theme</strong>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </div>
              </div>
              <Button
                variant="secondary"
                icon={theme === 'dark' ? Sun : Moon}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </Button>
            </div>

            <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <Button
                variant="ghost"
                icon={LogOut}
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
              >
                Sign out of account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Dialog for Reset Defaults */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={async () => {
          await resetPreferencesToDefault()
          setResetDialogOpen(false)
        }}
        title="Reset Notification Preferences?"
        message="This will restore all category and delivery channel settings to the system default recommendations."
        confirmText="Reset to default"
      />
    </div>
  )
}
