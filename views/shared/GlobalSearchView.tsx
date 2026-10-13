'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search,
  X,
  History,
  SlidersHorizontal,
  ArrowUpRight,
  Filter,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { UpdateCard } from '@/components/cards/UpdateCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/feedback/EmptyState'

export function GlobalSearchView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const {
    updates,
    categories,
    departments,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    role,
  } = useStore()

  const [query, setQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState<'All' | 'Urgent' | 'Normal'>('All')

  // Sync with searchParams
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
      addRecentSearch(initialQuery)
    }
  }, [initialQuery, addRecentSearch])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      addRecentSearch(query.trim())
    }
  }

  // Filter updates
  const searchResults = useMemo(() => {
    if (!query.trim() && selectedCategory === 'All' && selectedDepartment === 'All' && selectedPriority === 'All') {
      return []
    }

    const q = query.toLowerCase().trim()

    return updates.filter((u) => {
      // Filter constraints
      if (selectedCategory !== 'All' && u.category !== selectedCategory) return false
      if (selectedDepartment !== 'All' && u.department !== selectedDepartment) return false
      if (selectedPriority !== 'All' && u.priority !== selectedPriority) return false

      if (!q) return true

      const inTitle = u.title.toLowerCase().includes(q)
      const inExcerpt = u.excerpt.toLowerCase().includes(q)
      const inContent = u.content.toLowerCase().includes(q)
      const inDept = u.department.toLowerCase().includes(q)
      const inCat = u.category.toLowerCase().includes(q)
      const inPublisher = u.publisher.name.toLowerCase().includes(q)

      return inTitle || inExcerpt || inContent || inDept || inCat || inPublisher
    })
  }, [updates, query, selectedCategory, selectedDepartment, selectedPriority])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="search-bar-wrap">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search className="search-bar-icon" />
          <input
            className="search-bar-input"
            aria-label="Search all updates and announcements"
            placeholder="Search across title, content, department, or categories (⌘F / Ctrl+F)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="search-bar-clear"
              aria-label="Clear search"
              onClick={() => setQuery('')}
            >
              <X width={16} height={16} />
            </button>
          )}
        </div>
        <Button type="submit" variant="primary">
          Search
        </Button>
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-3)' }}>
            <History width={13} height={13} />
            <span>Recent searches:</span>
          </div>
          {recentSearches.map((s) => (
            <button
              key={s}
              type="button"
              className="chip filter"
              onClick={() => {
                setQuery(s)
                addRecentSearch(s)
              }}
            >
              {s}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentSearches}
            style={{ fontSize: 11, padding: '2px 6px' }}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Filters Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          padding: '12px 16px',
          background: 'var(--bg-muted)',
          borderRadius: 'var(--radius-control)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-2)' }}>
          <Filter width={14} height={14} />
          <strong>Filters:</strong>
        </div>

        <select
          aria-label="Filter by category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-control)',
            padding: '4px 8px',
            fontSize: 12,
            background: 'var(--bg-surface)',
          }}
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by department"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-control)',
            padding: '4px 8px',
            fontSize: 12,
            background: 'var(--bg-surface)',
          }}
        >
          <option value="All">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by priority"
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value as any)}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-control)',
            padding: '4px 8px',
            fontSize: 12,
            background: 'var(--bg-surface)',
          }}
        >
          <option value="All">All Priorities</option>
          <option value="Urgent">Urgent Only</option>
          <option value="Normal">Normal</option>
        </select>

        {(selectedCategory !== 'All' || selectedDepartment !== 'All' || selectedPriority !== 'All') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategory('All')
              setSelectedDepartment('All')
              setSelectedPriority('All')
            }}
            style={{ fontSize: 11 }}
          >
            Reset filters
          </Button>
        )}

        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-3)' }}>
          {searchResults.length} matching result{searchResults.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Results grid */}
      {searchResults.length > 0 ? (
        <div className="card-grid">
          {searchResults.map((item) => (
            <UpdateCard key={item.id} item={item} />
          ))}
        </div>
      ) : query.trim() || selectedCategory !== 'All' || selectedDepartment !== 'All' ? (
        <EmptyState
          title="No results found"
          description={`We could not find any notices matching "${query}". Try searching with alternate keywords or clearing filters.`}
          icon={Search}
          actionLabel="Clear search"
          onAction={() => {
            setQuery('')
            setSelectedCategory('All')
            setSelectedDepartment('All')
            setSelectedPriority('All')
          }}
        />
      ) : (
        <div className="empty-state" style={{ minHeight: 200 }}>
          <Search width={24} height={24} style={{ color: 'var(--text-3)' }} />
          <h3>Type a query to search</h3>
          <p>Search across official examination schedules, fee deadlines, results, and campus events.</p>
        </div>
      )}
    </div>
  )
}
