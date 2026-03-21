'use client'

import { Search } from 'lucide-react'
import { getCategories, getLevels } from '@/lib/courses'

interface SearchFilterProps {
  query: string
  category: string
  level: string
  onQuery: (v: string) => void
  onCategory: (v: string) => void
  onLevel: (v: string) => void
  totalResults?: number
}

export default function SearchFilter({
  query,
  category,
  level,
  onQuery,
  onCategory,
  onLevel,
  totalResults,
}: SearchFilterProps) {
  const categories = ['All', ...getCategories()]
  const levels = ['All', ...getLevels()]

  return (
    <div style={{ marginBottom: 'var(--space-8, 2rem)' }}>
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        {/* Search */}
        <div className="search-bar" style={{ flex: '1', minWidth: '240px' }}>
          <Search className="search-bar__icon" size={18} />
          <input
            type="text"
            placeholder="Search courses, instructors, topics..."
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>

        {/* Category */}
        <select
          className="select"
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          style={{ width: 'auto', minWidth: '160px' }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Level */}
        <select
          className="select"
          value={level}
          onChange={(e) => onLevel(e.target.value)}
          style={{ width: 'auto', minWidth: '140px' }}
        >
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {totalResults !== undefined && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #64748b)' }}>
          Showing <strong>{totalResults}</strong> course{totalResults !== 1 ? 's' : ''}
          {query && ` for "${query}"`}
        </p>
      )}
    </div>
  )
}
