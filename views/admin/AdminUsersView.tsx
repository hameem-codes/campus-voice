'use client'

import React, { useState, useMemo, useRef } from 'react'
import {
  Search,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  Edit2,
  Trash2,
  Upload,
  UserX,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Shield,
  GraduationCap,
  UserRound,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/StatusChip'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Drawer } from '@/components/ui/Drawer'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { UserProfile, Role } from '@/types'

export function AdminUsersView() {
  const {
    departments,
    addUser,
    editUser,
    toggleUserActive,
    bulkImportUsers,
    addToast,
  } = useStore()

  // We fetch users list from store or local state
  // Let's get initialUsers + added users
  // Wait, useStore has users in state and addUser/editUser
  // Let's add `users: UserProfile[]` to useStore if needed, or let's use the users state from store
  const { users } = useStore() as any

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'All' | 'student' | 'faculty' | 'admin'>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modals & Drawers
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<Role>('student')
  const [inviteDept, setInviteDept] = useState(departments[0]?.name || 'School of Design')
  const [inviteError, setInviteError] = useState('')

  // Edit user state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)

  // Deactivate confirmation
  const [deactivateTarget, setDeactivateTarget] = useState<UserProfile | null>(null)

  // Drawer target
  const [detailUser, setDetailUser] = useState<UserProfile | null>(null)

  // CSV Import state with preview
  const [csvModalOpen, setCsvModalOpen] = useState(false)
  const [csvPreviewData, setCsvPreviewData] = useState<Array<Omit<UserProfile, 'id' | 'avatarInitials' | 'lastSeen'>>>([])
  const csvFileRef = useRef<HTMLInputElement>(null)

  // Filtered users list
  const userList: UserProfile[] = users || []

  const filteredUsers = useMemo(() => {
    return userList.filter((u) => {
      if (roleFilter !== 'All' && u.role !== roleFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [userList, roleFilter, searchQuery])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage, pageSize])

  // Bulk actions
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedUsers.length) setSelectedIds([])
    else setSelectedIds(paginatedUsers.map((u) => u.id))
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  // Invite user submit
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim() || !inviteEmail.includes('@')) {
      setInviteError('Please provide a valid full name and campus email.')
      return
    }

    await addUser({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      department: inviteDept,
      active: true,
      notificationPreferences: {
        urgentNotices: true,
        deadlines: true,
        communityEvents: false,
        emailChannel: true,
        pushChannel: true,
        smsChannel: false,
      },
    })

    setInviteModalOpen(false)
    setInviteName('')
    setInviteEmail('')
    setInviteError('')
  }

  // Edit user submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    await editUser(editingUser)
    setEditingUser(null)
  }

  // CSV parse handler with preview
  const handleCSVSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) return
      const lines = text.split('\n').filter((l) => l.trim().length > 0)
      const parsed: Array<Omit<UserProfile, 'id' | 'avatarInitials' | 'lastSeen'>> = []

      // Assume CSV header: Name, Email, Role, Department
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''))
        if (parts.length >= 2 && parts[1].includes('@')) {
          const roleVal = (['student', 'faculty', 'admin'].includes(parts[2]?.toLowerCase())
            ? parts[2].toLowerCase()
            : 'student') as Role

          parsed.push({
            name: parts[0] || 'Campus Member',
            email: parts[1],
            role: roleVal,
            department: parts[3] || 'School of Design',
            active: true,
            notificationPreferences: {
              urgentNotices: true,
              deadlines: true,
              communityEvents: false,
              emailChannel: true,
              pushChannel: true,
              smsChannel: false,
            },
          })
        }
      }

      setCsvPreviewData(parsed)
      if (parsed.length === 0) {
        addToast({
          type: 'warning',
          title: 'Empty or invalid CSV',
          message: 'Expected format: Name, Email, Role, Department',
        })
      }
    }

    reader.readAsText(file)
  }

  const handleConfirmCSVImport = async () => {
    if (csvPreviewData.length === 0) return
    await bulkImportUsers(csvPreviewData)
    setCsvPreviewData([])
    setCsvModalOpen(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="toolbar-search">
            <Search />
            <input
              className="search-input"
              aria-label="Search people"
              placeholder="Search by name, email, or department"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="segmented">
            <button
              type="button"
              className={roleFilter === 'All' ? 'active' : ''}
              onClick={() => {
                setRoleFilter('All')
                setCurrentPage(1)
              }}
            >
              All ({userList.length})
            </button>
            <button
              type="button"
              className={roleFilter === 'student' ? 'active' : ''}
              onClick={() => {
                setRoleFilter('student')
                setCurrentPage(1)
              }}
            >
              Students
            </button>
            <button
              type="button"
              className={roleFilter === 'faculty' ? 'active' : ''}
              onClick={() => {
                setRoleFilter('faculty')
                setCurrentPage(1)
              }}
            >
              Faculty
            </button>
            <button
              type="button"
              className={roleFilter === 'admin' ? 'active' : ''}
              onClick={() => {
                setRoleFilter('admin')
                setCurrentPage(1)
              }}
            >
              Admins
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <Button
            variant="secondary"
            icon={Upload}
            onClick={() => {
              setCsvPreviewData([])
              setCsvModalOpen(true)
            }}
          >
            Import CSV
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setInviteModalOpen(true)}
          >
            Invite user
          </Button>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={
                    paginatedUsers.length > 0 && selectedIds.length === paginatedUsers.length
                  }
                  onChange={toggleSelectAll}
                  aria-label="Select all on this page"
                />
              </th>
              <th>Person</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Active</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {
                const isSelected = selectedIds.includes(user.id)

                return (
                  <tr key={user.id} style={{ background: isSelected ? 'var(--bg-muted)' : undefined }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </td>
                    <td>
                      <div className="table-person">
                        <Avatar initials={user.avatarInitials} />
                        <div>
                          <strong>{user.name}</strong>
                          <div style={{ color: 'var(--text-3)', fontSize: 11, marginTop: 2 }}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusChip
                        tone={
                          user.role === 'admin'
                            ? 'orange'
                            : user.role === 'faculty'
                            ? 'blue'
                            : 'neutral'
                        }
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </StatusChip>
                    </td>
                    <td style={{ fontSize: 12 }}>{user.department}</td>
                    <td>
                      <StatusChip tone={user.active ? 'green' : 'neutral'}>
                        {user.active ? 'Active' : 'Deactivated'}
                      </StatusChip>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text-2)' }}>
                      {user.lastSeen || 'Recently'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`View ${user.name}`}
                          onClick={() => setDetailUser(user)}
                          title="View user card"
                        >
                          <ArrowUpRight width={14} height={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`Edit ${user.name}`}
                          onClick={() => setEditingUser(user)}
                          title="Edit user role & details"
                        >
                          <Edit2 width={14} height={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={user.active ? `Deactivate ${user.name}` : `Reactivate ${user.name}`}
                          onClick={() => setDeactivateTarget(user)}
                          title={user.active ? 'Deactivate user' : 'Reactivate user'}
                          style={{ color: user.active ? 'var(--accent-red)' : 'var(--chip-green-fg)' }}
                        >
                          {user.active ? <UserX width={14} height={14} /> : <UserCheck width={14} height={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-3)' }}>
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px' }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
          Showing {(currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} people
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            className="icon-button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft width={16} height={16} />
          </button>
          <span style={{ fontSize: 12, padding: '0 8px' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="icon-button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            <ChevronRight width={16} height={16} />
          </button>
        </div>
      </div>

      {/* Invite User Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Campus User"
        description="Add a verified student, faculty instructor, or administrator."
      >
        <form onSubmit={handleInviteSubmit} className="form-grid">
          {inviteError && (
            <div className="field full" style={{ color: 'var(--accent-red)', fontSize: 12 }}>
              {inviteError}
            </div>
          )}
          <div className="field full">
            <label htmlFor="inv-name">Full Name *</label>
            <input
              id="inv-name"
              placeholder="e.g. Prof. Sameer Sen"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              required
            />
          </div>
          <div className="field full">
            <label htmlFor="inv-email">Campus Email *</label>
            <input
              id="inv-email"
              type="email"
              placeholder="name@campus.edu"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="inv-role">Assigned Role</label>
            <select
              id="inv-role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as Role)}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty Member</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="inv-dept">Department</label>
            <select
              id="inv-dept"
              value={inviteDept}
              onChange={(e) => setInviteDept(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field full" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <Button variant="secondary" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        title="Edit User Account"
        description={editingUser ? `Updating details for ${editingUser.name}` : ''}
      >
        {editingUser && (
          <form onSubmit={handleEditSubmit} className="form-grid">
            <div className="field full">
              <label>Full Name</label>
              <input
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                required
              />
            </div>
            <div className="field full">
              <label>Email</label>
              <input
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Assigned Role</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as Role })}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="field">
              <label>Department</label>
              <select
                value={editingUser.department}
                onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field full" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <Button variant="secondary" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* CSV Import Modal with Preview Step */}
      <Modal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        title="Bulk Import Users from CSV"
        description="Upload a CSV file containing Name, Email, Role, Department columns."
        maxWidth="640px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            className="upload-box"
            onClick={() => csvFileRef.current?.click()}
            style={{ cursor: 'pointer' }}
          >
            <input
              ref={csvFileRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={(e) => handleCSVSelect(e.target.files)}
            />
            <div>
              <Upload width={24} height={24} />
              <span>Choose CSV file or drag here</span>
              <small>Example: "Aarav Mehta,aarav@campus.edu,student,School of Design"</small>
            </div>
          </div>

          {/* CSV Preview Table */}
          {csvPreviewData.length > 0 && (
            <div>
              <div className="meta-label" style={{ marginBottom: 8 }}>
                Import Preview ({csvPreviewData.length} records ready)
              </div>
              <div className="table-wrap" style={{ maxHeight: 220 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreviewData.slice(0, 5).map((r, i) => (
                      <tr key={i}>
                        <td>{r.name}</td>
                        <td>{r.email}</td>
                        <td>{r.role}</td>
                        <td>{r.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {csvPreviewData.length > 5 && (
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                  + {csvPreviewData.length - 5} additional rows ready for ingestion.
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setCsvModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={csvPreviewData.length === 0}
              onClick={handleConfirmCSVImport}
            >
              Confirm Import ({csvPreviewData.length})
            </Button>
          </div>
        </div>
      </Modal>

      {/* Deactivate / Reactivate Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deactivateTarget)}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={async () => {
          if (deactivateTarget) {
            await toggleUserActive(deactivateTarget.id)
            setDeactivateTarget(null)
          }
        }}
        title={deactivateTarget?.active ? 'Deactivate User?' : 'Reactivate User?'}
        message={
          deactivateTarget?.active
            ? `Deactivating ${deactivateTarget.name} will suspend their login sessions and pause campus alerts.`
            : `Reactivating ${deactivateTarget?.name} will restore account access immediately.`
        }
        confirmText={deactivateTarget?.active ? 'Deactivate' : 'Reactivate'}
        danger={deactivateTarget?.active}
      />

      {/* User Detail Drawer */}
      <Drawer
        isOpen={Boolean(detailUser)}
        onClose={() => setDetailUser(null)}
        title={detailUser?.name || 'User Profile'}
        subtitle={`Role: ${detailUser?.role} · ${detailUser?.department}`}
      >
        {detailUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar initials={detailUser.avatarInitials} large />
              <div>
                <strong style={{ fontSize: 16 }}>{detailUser.name}</strong>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{detailUser.email}</div>
                <div style={{ marginTop: 4 }}>
                  <StatusChip tone={detailUser.active ? 'green' : 'neutral'}>
                    {detailUser.active ? 'Active' : 'Deactivated'}
                  </StatusChip>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div>
                <div className="meta-label">Role</div>
                <div className="meta-value">{detailUser.role.toUpperCase()}</div>
              </div>
              <div>
                <div className="meta-label">Department</div>
                <div className="meta-value">{detailUser.department}</div>
              </div>
              <div>
                <div className="meta-label">Last Active</div>
                <div className="meta-value">{detailUser.lastSeen || 'Recently'}</div>
              </div>
              {detailUser.studentId && (
                <div>
                  <div className="meta-label">Student ID</div>
                  <div className="meta-value">{detailUser.studentId}</div>
                </div>
              )}
            </div>

            <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <Button
                variant="secondary"
                icon={Edit2}
                onClick={() => {
                  const target = detailUser
                  setDetailUser(null)
                  setEditingUser(target)
                }}
              >
                Edit User Account
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
