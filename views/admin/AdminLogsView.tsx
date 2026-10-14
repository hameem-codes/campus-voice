'use client'

import React, { useState, useMemo } from 'react'
import {
  ListFilter,
  Search,
  Save,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Bell,
  Clock,
  Shield,
  FileText,
  User,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import { formatRelativeTime } from '@/lib/date'

export function AdminLogsView() {
  const { auditLogs, settings, updateSettings, addToast } = useStore()

  // Tabs: Audit Log or Settings
  const [activeTab, setActiveTab] = useState<'Logs' | 'Settings'>('Logs')

  // Search & Filter state for Logs
  const [logSearch, setLogSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  // Editable settings form state
  const [emailNotifs, setEmailNotifs] = useState(settings.emailNotifications)
  const [pushNotifs, setPushNotifs] = useState(settings.pushNotifications)
  const [smsNotifs, setSmsNotifs] = useState(settings.smsNotifications)
  const [approvalRule, setApprovalRule] = useState(settings.urgentApprovalRule)
  const [retention, setRetention] = useState(settings.retentionMonths)

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (roleFilter !== 'All' && log.role !== roleFilter) return false
      if (logSearch.trim()) {
        const q = logSearch.toLowerCase()
        return (
          log.user.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [auditLogs, roleFilter, logSearch])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateSettings({
      emailNotifications: emailNotifs,
      pushNotifications: pushNotifs,
      smsNotifications: smsNotifs,
      urgentApprovalRule: approvalRule,
      retentionMonths: retention,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tabs */}
      <div className="tabs">
        <button
          type="button"
          className={`tab ${activeTab === 'Logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('Logs')}
        >
          <ListFilter width={15} height={15} />
          <span>Audit log</span>
          <span className="tab-pill">{auditLogs.length}</span>
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'Settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('Settings')}
        >
          <Sliders width={15} height={15} />
          <span>Settings</span>
        </button>
      </div>

      {/* TAB 1: AUDIT LOGS */}
      {activeTab === 'Logs' && (
        <section className="panel-card" style={{ padding: 24 }}>
          {/* Log Filters Toolbar */}
          <div className="toolbar" style={{ marginBottom: 16 }}>
            <div className="toolbar-left">
              <div className="toolbar-search">
                <Search />
                <input
                  className="search-input"
                  aria-label="Search logs"
                  placeholder="Filter logs by user, action, or notice title"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                />
              </div>

              <select
                aria-label="Filter logs by role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-control)',
                  padding: '6px 10px',
                  fontSize: 12,
                  background: 'var(--bg-surface)',
                }}
              >
                <option value="All">All Sources</option>
                <option value="Admin">Admin</option>
                <option value="Faculty">Faculty</option>
                <option value="System">System</option>
              </select>
            </div>

            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              {filteredLogs.length} logged record{filteredLogs.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Audit Rows */}
          <div className="audit-list">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="audit-row" style={{ padding: '14px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <StatusChip
                      tone={
                        log.role === 'Admin'
                          ? 'orange'
                          : log.role === 'Faculty'
                          ? 'blue'
                          : 'neutral'
                      }
                    >
                      {log.role}
                    </StatusChip>
                    <div className="audit-copy">
                      <strong>{log.user}</strong> {log.action}:{' '}
                      <span style={{ color: 'var(--text-1)' }}>{log.details}</span>
                    </div>
                  </div>
                  <span className="audit-time">{formatRelativeTime(log.timestamp)}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-3)' }}>
                No audit entries match the current filter.
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 2: SYSTEM SETTINGS */}
      {activeTab === 'Settings' && (
        <form onSubmit={handleSaveSettings} className="panel-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 className="panel-title" style={{ margin: 0 }}>
                Campus Delivery Channels & Verification Policies
              </h2>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                Saved rules apply immediately to notice validation and automated delivery.
              </span>
            </div>
            <Button type="submit" variant="primary" icon={Save}>
              Save Settings
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Delivery Toggles */}
            <div>
              <div className="nav-section-label" style={{ padding: 0, marginBottom: 12 }}>
                Active Broadcast Channels
              </div>
              <div className="settings-list">
                <div className="setting-row">
                  <div className="setting-copy">
                    <strong>Email Delivery Service</strong>
                    <span>Broadcast announcements via SMTP gateway (99.4% SLA)</span>
                  </div>
                  <button
                    type="button"
                    className={`switch ${emailNotifs ? 'on' : ''}`}
                    onClick={() => setEmailNotifs((v) => !v)}
                    aria-label="Toggle email notifications"
                  >
                    <span />
                  </button>
                </div>

                <div className="setting-row">
                  <div className="setting-copy">
                    <strong>Push Notifications Service</strong>
                    <span>In-app and mobile device push notifications</span>
                  </div>
                  <button
                    type="button"
                    className={`switch ${pushNotifs ? 'on' : ''}`}
                    onClick={() => setPushNotifs((v) => !v)}
                    aria-label="Toggle push notifications"
                  >
                    <span />
                  </button>
                </div>

                <div className="setting-row">
                  <div className="setting-copy">
                    <strong>SMS Emergency Relay</strong>
                    <span>Emergency broadcast to student mobile phones</span>
                  </div>
                  <button
                    type="button"
                    className={`switch ${smsNotifs ? 'on' : ''}`}
                    onClick={() => setSmsNotifs((v) => !v)}
                    aria-label="Toggle SMS alerts"
                  >
                    <span />
                  </button>
                </div>
              </div>
            </div>

            {/* Editable Rules */}
            <div>
              <div className="nav-section-label" style={{ padding: 0, marginBottom: 12 }}>
                Approval Rules & Retention Policy
              </div>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor="app-rule">Urgent Notice Approval Rule</label>
                  <select
                    id="app-rule"
                    value={approvalRule}
                    onChange={(e) => setApprovalRule(e.target.value)}
                  >
                    <option value="Standard single review">Standard single review (1-step admin review)</option>
                    <option value="2-step review for urgent notices">2-step review for urgent notices (Recommended)</option>
                    <option value="Department Chair endorsement required">Department Chair endorsement required</option>
                  </select>
                </div>

                <div className="field full">
                  <label htmlFor="ret-months">Audit Log Retention Window</label>
                  <select
                    id="ret-months"
                    value={retention}
                    onChange={(e) => setRetention(parseInt(e.target.value, 10))}
                  >
                    <option value={6}>6 months retention</option>
                    <option value={12}>12 months retention (Standard academic year)</option>
                    <option value={24}>24 months retention (2 full academic years)</option>
                    <option value={60}>5 years compliance archiving</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
