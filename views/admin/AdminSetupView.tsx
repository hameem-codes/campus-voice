'use client'

import React, { useState } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  MoreHorizontal,
  ArrowUpRight,
  SlidersHorizontal,
  Building,
  Calendar,
  Layers,
  BookOpen,
  Users,
  MoveUp,
  MoveDown,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { CategoryItem } from '@/types'

export function AdminSetupView() {
  const {
    categories,
    departments,
    academicYears,
    sections,
    courses,
    audienceGroups,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addDepartment,
    deleteDepartment,
    addAcademicYear,
    deleteAcademicYear,
    addSection,
    deleteSection,
    addCourse,
    deleteCourse,
    addAudienceGroup,
    deleteAudienceGroup,
  } = useStore()

  // Tab: Categories, Academic Units, Audience Groups
  const [activeTab, setActiveTab] = useState<'Categories' | 'Academic' | 'Audiences'>('Categories')

  // Category Modal
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null)
  const [catName, setCatName] = useState('')
  const [catColor, setCatColor] = useState('var(--accent-blue)')

  // Department Modal
  const [deptModalOpen, setDeptModalOpen] = useState(false)
  const [deptName, setDeptName] = useState('')
  const [deptCode, setDeptCode] = useState('')

  // Academic Year Modal
  const [yearModalOpen, setYearModalOpen] = useState(false)
  const [yearName, setYearName] = useState('')
  const [yearCode, setYearCode] = useState('')

  // Section Modal
  const [secModalOpen, setSecModalOpen] = useState(false)
  const [secName, setSecName] = useState('')
  const [secDeptId, setSecDeptId] = useState(departments[0]?.id || '')

  // Course Modal
  const [courseModalOpen, setCourseModalOpen] = useState(false)
  const [courseName, setCourseName] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [courseDeptId, setCourseDeptId] = useState(departments[0]?.id || '')

  // Audience Group Modal
  const [audModalOpen, setAudModalOpen] = useState(false)
  const [audName, setAudName] = useState('')
  const [audDesc, setAudDesc] = useState('')
  const [audCount, setAudCount] = useState(100)

  // Category actions
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catName.trim()) return

    if (editingCat) {
      await updateCategory({ ...editingCat, name: catName.trim(), color: catColor })
    } else {
      await addCategory(catName.trim(), catColor)
    }
    setCatModalOpen(false)
    setEditingCat(null)
    setCatName('')
  }

  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const list = [...categories]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= list.length) return
    const temp = list[index]
    list[index] = list[targetIndex]
    list[targetIndex] = temp
    await reorderCategories(list)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Setup Tabs */}
      <div className="tabs">
        <button
          type="button"
          className={`tab ${activeTab === 'Categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('Categories')}
        >
          <SlidersHorizontal width={15} height={15} />
          <span>Notice Categories</span>
          <span className="tab-pill">{categories.length}</span>
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'Academic' ? 'active' : ''}`}
          onClick={() => setActiveTab('Academic')}
        >
          <Building width={15} height={15} />
          <span>Academic Units & Courses</span>
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'Audiences' ? 'active' : ''}`}
          onClick={() => setActiveTab('Audiences')}
        >
          <Users width={15} height={15} />
          <span>Audience Cohort Groups</span>
          <span className="tab-pill">{audienceGroups.length}</span>
        </button>
      </div>

      {/* TAB 1: CATEGORIES CRUD */}
      {activeTab === 'Categories' && (
        <section className="panel-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 className="panel-title" style={{ margin: 0 }}>
                Notice Categories Management
              </h2>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                Add, rename, recolor, reorder and delete categories. Deletion is safely blocked if in use.
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingCat(null)
                setCatName('')
                setCatColor('var(--accent-blue)')
                setCatModalOpen(true)
              }}
            >
              Add category
            </Button>
          </div>

          <div className="settings-list">
            {categories.map((cat, idx) => (
              <div className="setting-row" key={cat.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 4,
                      background: cat.color,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <strong style={{ fontSize: 13 }}>{cat.name}</strong>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      Order position: {idx + 1}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    type="button"
                    className="icon-button"
                    disabled={idx === 0}
                    onClick={() => handleMoveCategory(idx, 'up')}
                    aria-label={`Move ${cat.name} up`}
                    title="Move up"
                  >
                    <MoveUp width={13} height={13} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    disabled={idx === categories.length - 1}
                    onClick={() => handleMoveCategory(idx, 'down')}
                    aria-label={`Move ${cat.name} down`}
                    title="Move down"
                  >
                    <MoveDown width={13} height={13} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => {
                      setEditingCat(cat)
                      setCatName(cat.name)
                      setCatColor(cat.color)
                      setCatModalOpen(true)
                    }}
                    aria-label={`Edit ${cat.name}`}
                    title="Edit category"
                  >
                    <Edit2 width={13} height={13} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    style={{ color: 'var(--accent-red)' }}
                    onClick={() => deleteCategory(cat.id)}
                    aria-label={`Delete ${cat.name}`}
                    title="Delete category"
                  >
                    <Trash2 width={13} height={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: ACADEMIC UNITS & COURSES CRUD */}
      {activeTab === 'Academic' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Departments */}
          <section className="panel-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Departments</h3>
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => setDeptModalOpen(true)}>
                Add
              </Button>
            </div>
            <div className="settings-list">
              {departments.map((d) => (
                <div key={d.id} className="setting-row">
                  <div>
                    <strong>{d.name}</strong>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'block' }}>
                      Code: {d.code}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    style={{ color: 'var(--accent-red)' }}
                    onClick={() => deleteDepartment(d.id)}
                    aria-label={`Delete ${d.name}`}
                  >
                    <Trash2 width={13} height={13} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Academic Years */}
          <section className="panel-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Academic Years</h3>
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => setYearModalOpen(true)}>
                Add
              </Button>
            </div>
            <div className="settings-list">
              {academicYears.map((y) => (
                <div key={y.id} className="setting-row">
                  <div>
                    <strong>{y.name}</strong>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'block' }}>
                      Code: {y.code}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    style={{ color: 'var(--accent-red)' }}
                    onClick={() => deleteAcademicYear(y.id)}
                    aria-label={`Delete ${y.name}`}
                  >
                    <Trash2 width={13} height={13} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Sections */}
          <section className="panel-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Sections / Studios</h3>
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => setSecModalOpen(true)}>
                Add
              </Button>
            </div>
            <div className="settings-list">
              {sections.map((s) => (
                <div key={s.id} className="setting-row">
                  <strong>Section {s.name}</strong>
                  <button
                    type="button"
                    className="icon-button"
                    style={{ color: 'var(--accent-red)' }}
                    onClick={() => deleteSection(s.id)}
                    aria-label={`Delete Section ${s.name}`}
                  >
                    <Trash2 width={13} height={13} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Courses */}
          <section className="panel-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Active Courses</h3>
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => setCourseModalOpen(true)}>
                Add
              </Button>
            </div>
            <div className="settings-list">
              {courses.map((c) => (
                <div key={c.id} className="setting-row">
                  <div>
                    <strong>{c.name}</strong>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'block' }}>
                      {c.code}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    style={{ color: 'var(--accent-red)' }}
                    onClick={() => deleteCourse(c.id)}
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 width={13} height={13} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: AUDIENCE GROUPS */}
      {activeTab === 'Audiences' && (
        <section className="panel-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 className="panel-title" style={{ margin: 0 }}>
                Audience Cohorts & Groups
              </h2>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                Targeting scopes with calculated live recipient numbers.
              </span>
            </div>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setAudModalOpen(true)}>
              Add cohort group
            </Button>
          </div>

          <div className="settings-list">
            {audienceGroups.map((g) => (
              <div key={g.id} className="setting-row">
                <div>
                  <strong style={{ fontSize: 13 }}>{g.name}</strong>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {g.description || 'Target cohort'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="chip neutral">
                    {g.memberCount.toLocaleString()} members
                  </span>
                  <button
                    type="button"
                    className="icon-button"
                    style={{ color: 'var(--accent-red)' }}
                    onClick={() => deleteAudienceGroup(g.id)}
                    aria-label={`Delete ${g.name}`}
                  >
                    <Trash2 width={13} height={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title={editingCat ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSaveCategory} className="form-grid">
          <div className="field full">
            <label htmlFor="cat-name-input">Category Name</label>
            <input
              id="cat-name-input"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Internships"
              required
            />
          </div>
          <div className="field full">
            <label>Color Accent</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['var(--accent-blue)', 'var(--accent-orange)', 'var(--accent-green)', 'var(--accent-red)'].map(
                (c) => (
                  <button
                    key={c}
                    type="button"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: c,
                      border: catColor === c ? '2px solid var(--text-1)' : '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setCatColor(c)}
                    aria-label={`Select color ${c}`}
                  />
                )
              )}
            </div>
          </div>
          <div className="field full" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setCatModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Department Modal */}
      <Modal isOpen={deptModalOpen} onClose={() => setDeptModalOpen(false)} title="Add Department">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (deptName && deptCode) {
              await addDepartment(deptName.trim(), deptCode.trim())
              setDeptModalOpen(false)
              setDeptName('')
              setDeptCode('')
            }
          }}
          className="form-grid"
        >
          <div className="field full">
            <label>Department Name</label>
            <input value={deptName} onChange={(e) => setDeptName(e.target.value)} required />
          </div>
          <div className="field full">
            <label>Code (e.g. DES)</label>
            <input value={deptCode} onChange={(e) => setDeptCode(e.target.value)} required />
          </div>
          <div className="field full" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setDeptModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Department</Button>
          </div>
        </form>
      </Modal>

      {/* Academic Year Modal */}
      <Modal isOpen={yearModalOpen} onClose={() => setYearModalOpen(false)} title="Add Academic Year">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (yearName && yearCode) {
              await addAcademicYear(yearName.trim(), yearCode.trim())
              setYearModalOpen(false)
              setYearName('')
              setYearCode('')
            }
          }}
          className="form-grid"
        >
          <div className="field full">
            <label>Year Label (e.g. Year 5)</label>
            <input value={yearName} onChange={(e) => setYearName(e.target.value)} required />
          </div>
          <div className="field full">
            <label>Code (e.g. Y5)</label>
            <input value={yearCode} onChange={(e) => setYearCode(e.target.value)} required />
          </div>
          <div className="field full" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setYearModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Year</Button>
          </div>
        </form>
      </Modal>

      {/* Section Modal */}
      <Modal isOpen={secModalOpen} onClose={() => setSecModalOpen(false)} title="Add Section">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (secName) {
              await addSection(secName.trim(), secDeptId)
              setSecModalOpen(false)
              setSecName('')
            }
          }}
          className="form-grid"
        >
          <div className="field full">
            <label>Section Name (e.g. D3)</label>
            <input value={secName} onChange={(e) => setSecName(e.target.value)} required />
          </div>
          <div className="field full" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setSecModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Section</Button>
          </div>
        </form>
      </Modal>

      {/* Course Modal */}
      <Modal isOpen={courseModalOpen} onClose={() => setCourseModalOpen(false)} title="Add Course">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (courseName && courseCode) {
              await addCourse(courseName.trim(), courseCode.trim(), courseDeptId)
              setCourseModalOpen(false)
              setCourseName('')
              setCourseCode('')
            }
          }}
          className="form-grid"
        >
          <div className="field full">
            <label>Course Title</label>
            <input value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
          </div>
          <div className="field full">
            <label>Course Code (e.g. DES 302)</label>
            <input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} required />
          </div>
          <div className="field full" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setCourseModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Course</Button>
          </div>
        </form>
      </Modal>

      {/* Audience Group Modal */}
      <Modal isOpen={audModalOpen} onClose={() => setAudModalOpen(false)} title="Add Audience Group">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (audName) {
              await addAudienceGroup(audName.trim(), audDesc.trim(), audCount)
              setAudModalOpen(false)
              setAudName('')
              setAudDesc('')
            }
          }}
          className="form-grid"
        >
          <div className="field full">
            <label>Cohort Name</label>
            <input value={audName} onChange={(e) => setAudName(e.target.value)} required />
          </div>
          <div className="field full">
            <label>Description</label>
            <input value={audDesc} onChange={(e) => setAudDesc(e.target.value)} />
          </div>
          <div className="field full">
            <label>Member Count</label>
            <input
              type="number"
              value={audCount}
              onChange={(e) => setAudCount(parseInt(e.target.value, 10) || 0)}
            />
          </div>
          <div className="field full" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setAudModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Group</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
