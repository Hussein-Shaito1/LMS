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
    <div className="search-filter">
      <div className="search-filter__bar">
        {/* Search */}
        <div className="search-bar">
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
        >
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {totalResults !== undefined && (
        <p className="search-filter__results">
          Showing <strong>{totalResults}</strong> course{totalResults !== 1 ? 's' : ''}
          {query && ` for "${query}"`}
        </p>
      )}
    </div>
  )
}
