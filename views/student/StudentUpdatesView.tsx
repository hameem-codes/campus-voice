'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  Grid2X2,
  LayoutList,
  CheckCheck,
  X,
  SlidersHorizontal,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { UpdateCard } from '@/components/cards/UpdateCard'
import { Button } from '@/components/ui/Button'
import { matchesStudentAudience } from './StudentHomeView'
import { EmptyState } from '@/components/feedback/EmptyState'

export function StudentUpdatesView() {
  const searchParams = useSearchParams()
  const initialFilterParam = searchParams.get('filter')
  const { updates, currentUser, categories, departments, markAllUpdatesRead } = useStore()

  // State
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Urgent'>(
    initialFilterParam === 'attention' ? 'Urgent' : 'All'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All')
  const [selectedPriority, setSelectedPriority] = useState<'All' | 'Normal' | 'Urgent'>('All')
  const [sortBy, setSortBy] = useState<'newest' | 'priority' | 'eventDate'>('newest')
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)

  // Persisted Grid / List mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const savedMode = localStorage.getItem('cv_view_mode_v1') as 'grid' | 'list'
    if (savedMode) setViewMode(savedMode)
  }, [])

  const setAndPersistViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('cv_view_mode_v1', mode)
    }
  }

  // Audience targeted items
  const targetedUpdates = useMemo(() => {
    return updates.filter((u) => matchesStudentAudience(u, currentUser))
  }, [updates, currentUser])

  // Computed counts for the tabs
  const unreadCount = useMemo(() => {
    return targetedUpdates.filter((u) => !u.read).length
  }, [targetedUpdates])

  const urgentCount = useMemo(() => {
    return targetedUpdates.filter((u) => u.priority === 'Urgent').length
  }, [targetedUpdates])

  // Filtered & sorted items
  const filteredUpdates = useMemo(() => {
    return targetedUpdates
      .filter((item) => {
        // Tab filter
        if (activeTab === 'Unread' && item.read) return false
        if (activeTab === 'Urgent' && item.priority !== 'Urgent') return false

        // Unread only toggle
        if (unreadOnly && item.read) return false

        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) return false

        // Department filter
        if (selectedDepartment !== 'All' && item.department !== selectedDepartment) return false

        // Priority filter
        if (selectedPriority !== 'All' && item.priority !== selectedPriority) return false

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchesTitle = item.title.toLowerCase().includes(q)
          const matchesExcerpt = item.excerpt.toLowerCase().includes(q)
          const matchesDept = item.department.toLowerCase().includes(q)
          const matchesCat = item.category.toLowerCase().includes(q)
          if (!matchesTitle && !matchesExcerpt && !matchesDept && !matchesCat) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          if (a.priority === 'Urgent' && b.priority !== 'Urgent') return -1
          if (a.priority !== 'Urgent' && b.priority === 'Urgent') return 1
        }
        if (sortBy === 'eventDate') {
          const dateA = a.eventDate ? new Date(a.eventDate).getTime() : 0
          const dateB = b.eventDate ? new Date(b.eventDate).getTime() : 0
          return dateB - dateA
        }
        // Default: newest postedAt
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      })
  }, [
    targetedUpdates,
    activeTab,
    unreadOnly,
    selectedCategory,
    selectedDepartment,
    selectedPriority,
    searchQuery,
    sortBy,
  ])

  // Active filters count for chip row
  const activeFilters = useMemo(() => {
    const list: { key: string; label: string; onClear: () => void }[] = []
    if (selectedCategory !== 'All') {
      list.push({
        key: 'category',
        label: `Category: ${selectedCategory}`,
        onClear: () => setSelectedCategory('All'),
      })
    }
    if (selectedDepartment !== 'All') {
      list.push({
        key: 'department',
        label: `Dept: ${selectedDepartment}`,
        onClear: () => setSelectedDepartment('All'),
      })
    }
    if (selectedPriority !== 'All') {
      list.push({
        key: 'priority',
        label: `Priority: ${selectedPriority}`,
        onClear: () => setSelectedPriority('All'),
      })
    }
    if (unreadOnly) {
      list.push({
        key: 'unread',
        label: 'Unread only',
        onClear: () => setUnreadOnly(false),
      })
    }
    if (searchQuery.trim()) {
      list.push({
        key: 'search',
        label: `Search: "${searchQuery}"`,
        onClear: () => setSearchQuery(''),
      })
    }
    return list
  }, [selectedCategory, selectedDepartment, selectedPriority, unreadOnly, searchQuery])

  const clearAllFilters = () => {
    setSelectedCategory('All')
    setSelectedDepartment('All')
    setSelectedPriority('All')
    setUnreadOnly(false)
    setSearchQuery('')
    setActiveTab('All')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Status Tabs (All / Unread / Urgent) with active states and live badges */}
      <div className="tabs">
        <button
          type="button"
          className={`tab ${activeTab === 'All' ? 'active' : ''}`}
          onClick={() => setActiveTab('All')}
        >
          All updates
          <span className="tab-pill">{targetedUpdates.length}</span>
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'Unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('Unread')}
        >
          Unread
          {unreadCount > 0 && <span className="tab-pill">{unreadCount}</span>}
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'Urgent' ? 'active' : ''}`}
          onClick={() => setActiveTab('Urgent')}
        >
          Urgent
          {urgentCount > 0 && <span className="tab-pill orange">{urgentCount}</span>}
        </button>
      </div>

      {/* 2. Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="toolbar-search">
            <Search />
            <input
              className="search-input"
              aria-label="Search updates"
              placeholder="Search by title, department, or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            variant={filterPanelOpen ? 'primary' : 'secondary'}
            icon={Filter}
            onClick={() => setFilterPanelOpen((v) => !v)}
            aria-expanded={filterPanelOpen}
          >
            Filters
            {activeFilters.length > 0 && ` (${activeFilters.length})`}
          </Button>

          <Button
            variant="ghost"
            icon={CheckCheck}
            onClick={markAllUpdatesRead}
            title="Mark all targeted updates as read"
          >
            Mark all read
          </Button>
        </div>

        <div className="toolbar-right">
          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Sort:</span>
            <select
              aria-label="Sort updates"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-control)',
                background: 'var(--bg-surface)',
                color: 'var(--text-1)',
                padding: '4px 8px',
                fontSize: 12,
              }}
            >
              <option value="newest">Newest posted</option>
              <option value="priority">Urgent priority first</option>
              <option value="eventDate">Event / Deadline date</option>
            </select>
          </div>

          <span style={{ color: 'var(--text-3)', fontSize: 12 }}>
            {filteredUpdates.length} notice{filteredUpdates.length === 1 ? '' : 's'}
          </span>

          {/* Grid / List toggle */}
          <div className="toggle-group">
            <button
              type="button"
              className={`icon-button ${viewMode === 'grid' ? 'active' : ''}`}
              aria-label="Grid view"
              onClick={() => setAndPersistViewMode('grid')}
            >
              <Grid2X2 />
            </button>
            <button
              type="button"
              className={`icon-button ${viewMode === 'list' ? 'active' : ''}`}
              aria-label="List view"
              onClick={() => setAndPersistViewMode('list')}
            >
              <LayoutList />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Filter Drawer / Panel */}
      {filterPanelOpen && (
        <div
          className="panel-card"
          style={{
            background: 'var(--bg-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            animation: 'modalEnter 0.18s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal width={16} height={16} />
              <strong>Refine Notices</strong>
            </div>
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Reset all
            </Button>
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="filter-category">Category</label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="filter-department">Department</label>
              <select
                id="filter-department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="All">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="filter-priority">Priority</label>
              <select
                id="filter-priority"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as any)}
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent Only</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            <div className="field" style={{ justifyContent: 'center' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => setUnreadOnly(e.target.checked)}
                />
                <span style={{ fontSize: 13, textTransform: 'none', color: 'var(--text-1)' }}>
                  Show unread notices only
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active filter chips */}
      {activeFilters.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Active filters:</span>
          {activeFilters.map((af) => (
            <span
              key={af.key}
              className="chip filter active"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <span>{af.label}</span>
              <button
                type="button"
                onClick={af.onClear}
                style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer', display: 'grid' }}
                aria-label={`Remove filter ${af.label}`}
              >
                <X width={12} height={12} />
              </button>
            </span>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} style={{ fontSize: 11 }}>
            Clear all
          </Button>
        </div>
      )}

      {/* Category quick bar (max 5 with overflow) */}
      <div className="filter-row" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`chip filter ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>
        {(showAllCategories ? categories : categories.slice(0, 5)).map((c) => (
          <button
            key={c.id}
            type="button"
            className={`chip filter ${selectedCategory === c.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(c.name)}
          >
            {c.name}
          </button>
        ))}
        {categories.length > 5 && (
          <button
            type="button"
            className="chip filter"
            onClick={() => setShowAllCategories((v) => !v)}
            style={{ color: 'var(--accent-indigo)', fontWeight: 500 }}
          >
            {showAllCategories ? 'Show less' : `+ ${categories.length - 5} more`}
          </button>
        )}
      </div>

      {/* 5. Updates Grid / List */}
      {filteredUpdates.length > 0 ? (
        <div className={viewMode === 'grid' ? 'card-grid' : 'update-list'}>
          {filteredUpdates.map((item) => (
            <UpdateCard
              key={item.id}
              item={item}
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matches"
          description="Try a different filter."
          actionLabel="Reset filters"
          onAction={clearAllFilters}
        />
      )}
    </div>
  )
}
