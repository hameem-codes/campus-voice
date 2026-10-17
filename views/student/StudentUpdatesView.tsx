'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
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
import { EmptyState } from '@/components/feedback/EmptyState'

export function StudentUpdatesView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialFilterParam = searchParams.get('filter')
  const {
    currentUser,
    categories,
    departments,
    markAllUpdatesRead,
    studentFeed,
    studentAllCount,
    studentUnreadCount,
    urgentUnreadCount,
  } = useStore()

  // State
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Urgent'>(
    initialFilterParam === 'attention' || initialFilterParam === 'urgent'
      ? 'Urgent'
      : initialFilterParam === 'unread'
      ? 'Unread'
      : 'All'
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

  // Filtered & sorted items
  const filteredUpdates = useMemo(() => {
    return studentFeed
      .filter((item) => {
        // Tab filter: Unread matches !item.read; Urgent matches unread urgent
        if (activeTab === 'Unread' && item.read) return false
        if (activeTab === 'Urgent' && (item.priority !== 'Urgent' || item.read)) return false

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
    studentFeed,
    activeTab,
    unreadOnly,
    selectedCategory,
    selectedDepartment,
    selectedPriority,
    searchQuery,
    sortBy,
  ])

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Floating Pill Navigation Bar (from Style Guide) */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px' }}>
        <nav className="pill-nav-container" aria-label="Student Navigation">
          <Link
            href="/student/updates"
            className="pill-nav-btn active"
          >
            Announcements
          </Link>
          <Link
            href="/student/calendar"
            className="pill-nav-btn"
          >
            Explore Campus
          </Link>
          <Link
            href="/student/saved"
            className="pill-nav-btn"
          >
            My Activity
          </Link>
        </nav>
      </div>

      {/* 2. Editorial Page Heading (from Style Guide) */}
      <div style={{ margin: '4px 0 8px' }}>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 44px)',
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            margin: '0 0 8px',
            color: '#111111',
          }}
        >
          What's the buzz on campus?
        </h1>
        <p
          style={{
            fontSize: '15px',
            lineHeight: '22px',
            color: 'var(--text-3)',
            fontWeight: 600,
            margin: 0,
            maxWidth: 600,
          }}
        >
          Fresh notices, all in one place. No more digging through group chats.
        </p>
      </div>

      {/* 3. Full-Width Pill Search Input (from Style Guide) */}
      <div className="pill-search-wrap">
        <Search
          width={18}
          height={18}
          style={{ position: 'absolute', left: 20, top: 17, color: 'var(--text-3)', strokeWidth: 2.4 }}
        />
        <input
          className="pill-search-input"
          aria-label="Search events, placements, announcements"
          placeholder="Search events, placements, announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 18,
              top: 15,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-3)',
              padding: 4,
            }}
            aria-label="Clear search query"
          >
            <X width={16} height={16} />
          </button>
        )}
      </div>

      {/* 4. Category Filter Chips (#all, #events, etc. from Style Guide) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`chip filter ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            #all
          </button>
          {(showAllCategories ? categories : categories.slice(0, 5)).map((c) => {
            const tag = `#${c.name.toLowerCase()}`
            const isActive = selectedCategory === c.name
            return (
              <button
                key={c.id}
                type="button"
                className={`chip filter ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(c.name)}
              >
                {tag}
              </button>
            )
          })}
          {categories.length > 5 && (
            <button
              type="button"
              className="chip filter"
              onClick={() => setShowAllCategories((v) => !v)}
              style={{ fontWeight: 700 }}
            >
              {showAllCategories ? 'Show less' : `+${categories.length - 5} more`}
            </button>
          )}
        </div>

        {/* Toolbar Right: Filter Drawer Toggle, Sort, View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button
            variant={filterPanelOpen ? 'primary' : 'secondary'}
            icon={Filter}
            onClick={() => setFilterPanelOpen((v) => !v)}
            aria-expanded={filterPanelOpen}
            size="sm"
          >
            Filters
            {activeFilters.length > 0 && ` (${activeFilters.length})`}
          </Button>

          {/* Sort Dropdown */}
          <select
            aria-label="Sort updates"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              border: '2px solid var(--border)',
              borderRadius: 'var(--radius-pill)',
              background: '#FFFFFF',
              color: '#111111',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 800,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="newest">Newest</option>
            <option value="priority">Urgent first</option>
            <option value="eventDate">Event Date</option>
          </select>

          {/* Grid / List toggle */}
          <div className="toggle-group" style={{ display: 'flex', gap: 4 }}>
            <button
              type="button"
              className={`icon-button ${viewMode === 'grid' ? 'active' : ''}`}
              aria-label="Grid view"
              onClick={() => setAndPersistViewMode('grid')}
              style={{
                borderRadius: 'var(--radius-control)',
                background: viewMode === 'grid' ? 'var(--accent-lime)' : '#FFFFFF',
              }}
            >
              <Grid2X2 width={15} height={15} />
            </button>
            <button
              type="button"
              className={`icon-button ${viewMode === 'list' ? 'active' : ''}`}
              aria-label="List view"
              onClick={() => setAndPersistViewMode('list')}
              style={{
                borderRadius: 'var(--radius-control)',
                background: viewMode === 'list' ? 'var(--accent-lime)' : '#FFFFFF',
              }}
            >
              <LayoutList width={15} height={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Filter Drawer / Panel */}
      {filterPanelOpen && (
        <div
          className="styleguide-panel"
          style={{
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
              <label htmlFor="filter-department">Department</label>
              <select
                id="filter-department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{ borderRadius: 'var(--radius-control)', border: '2px solid var(--border)', padding: '8px 12px' }}
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
                style={{ borderRadius: 'var(--radius-control)', border: '2px solid var(--border)', padding: '8px 12px' }}
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

      {/* 6. Active Filter Pills */}
      {activeFilters.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700 }}>Active:</span>
          {activeFilters.map((af) => (
            <span
              key={af.key}
              className="chip filter active"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <span>{af.label}</span>
              <button
                type="button"
                onClick={af.onClear}
                style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer', display: 'grid', color: 'inherit' }}
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

      {/* 7. Asymmetric Bento Grid / List View */}
      {filteredUpdates.length > 0 ? (
        viewMode === 'grid' ? (
          <div>
            {filteredUpdates.length >= 4 ? (
              <>
                {/* Asymmetric Row 1: Large Black Card (1.3fr) + Black Card (1fr) */}
                <div className="asymmetric-feed-grid">
                  <UpdateCard item={filteredUpdates[0]} variant="black" />
                  <UpdateCard item={filteredUpdates[1]} variant="black" />
                </div>

                {/* Asymmetric Row 2: Electric Blue Card (1fr) + Acid Lime Card (1.3fr) */}
                <div
                  className="asymmetric-feed-grid"
                  style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr)' }}
                >
                  <UpdateCard item={filteredUpdates[2]} variant="blue" />
                  <UpdateCard item={filteredUpdates[3]} variant="lime" />
                </div>

                {/* Row 3+: Remaining cards in 3-column responsive grid */}
                {filteredUpdates.length > 4 && (
                  <div className="card-grid">
                    {filteredUpdates.slice(4).map((item, index) => {
                      // Alternate variants intentionally for visual rhythm
                      const v = index % 3 === 0 ? 'white' : index % 3 === 1 ? 'black' : 'blue'
                      return <UpdateCard key={item.id} item={item} variant={v} />
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="card-grid">
                {filteredUpdates.map((item, idx) => (
                  <UpdateCard
                    key={item.id}
                    item={item}
                    variant={idx === 1 ? 'blue' : idx === 2 ? 'lime' : 'black'}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="update-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredUpdates.map((item) => (
              <UpdateCard key={item.id} item={item} compact />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          title="No notices found"
          description="Try adjusting your category or search query."
          actionLabel="Reset filters"
          onAction={clearAllFilters}
        />
      )}
    </div>
  )
}
