'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { filterCourses, getAllTags, getAllTeachers, getCategories, getLevels } from '@/lib/courses'
import type { SortOption } from '@/lib/courses'
import CourseCard from '@/components/ui/CourseCard'
import PageTransition from '@/components/ui/PageTransition'
import { Search, SlidersHorizontal, X, BookOpen } from 'lucide-react'

export default function CoursesPage() {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('All')
  const [category, setCategory] = useState('All')
  const [teacherId, setTeacherId] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>('popular')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const categories = ['All', ...getCategories()]
  const levels = ['All', ...getLevels()]
  const allTags = getAllTags()
  const allTeachers = getAllTeachers()

  const results = useMemo(
    () => filterCourses({ query, level, category, teacherId, tags: selectedTags, sort }),
    [query, level, category, teacherId, selectedTags, sort]
  )

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function clearAll() {
    setQuery('')
    setLevel('All')
    setCategory('All')
    setTeacherId('')
    setSelectedTags([])
    setSort('popular')
  }

  const hasActiveFilters =
    query || level !== 'All' || category !== 'All' || teacherId || selectedTags.length > 0

  return (
    <PageTransition>
      <div className="container courses-page">

        {/* Page header */}
        <div className="courses-page__header">
          <h1>All Courses</h1>
          <p>Explore our full library of courses across every topic.</p>
        </div>

        {/* Search + Sort */}
        <div className="filter-bar">
          <div className="search-bar">
            <Search className="search-bar__icon" size={18} />
            <input
              type="text"
              placeholder="Search courses, instructors, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="shortest">Shortest Duration</option>
          </select>
        </div>

        {/* Results bar */}
        <div className="results-bar">
          <p className="filter-results">
            Showing <strong>{results.length}</strong> course{results.length !== 1 ? 's' : ''}
            {query && ` for "${query}"`}
          </p>
          <div className="results-bar__actions">
            <button
              className={`btn ${sidebarOpen ? 'btn--primary' : 'btn--secondary'} btn--sm`}
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="filter-badge">
                  {[
                    level !== 'All' && 1,
                    category !== 'All' && 1,
                    teacherId && 1,
                    selectedTags.length,
                  ].filter(Boolean).reduce((a: number, b) => a + (b as number), 0)}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button className="btn btn--ghost btn--sm" onClick={clearAll}>
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="courses-layout">

          {/* Sidebar filters */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Mobile backdrop */}
                <motion.div
                  className="filter-overlay__backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSidebarOpen(false)}
                />

                <motion.aside
                  className="courses-layout__sidebar card"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {/* Mobile drag handle */}
                  <div className="filter-popup-handle" />

                  {/* Mobile header */}
                  <div className="filter-popup-header">
                    <span>Filters</span>
                    <button onClick={() => setSidebarOpen(false)} aria-label="Close filters">
                      <X size={18} />
                    </button>
                  </div>

                  <FilterGroup label="Level">
                    <div className="filter-group__items">
                      {levels.map((l) => (
                        <label key={l} className="filter-check">
                          <input
                            type="radio"
                            name="level"
                            value={l}
                            checked={level === l}
                            onChange={() => setLevel(l)}
                          />
                          {l}
                        </label>
                      ))}
                    </div>
                  </FilterGroup>

                  <FilterGroup label="Category">
                    <div className="filter-group__items">
                      {categories.map((c) => (
                        <label key={c} className="filter-check">
                          <input
                            type="radio"
                            name="category"
                            value={c}
                            checked={category === c}
                            onChange={() => setCategory(c)}
                          />
                          {c}
                        </label>
                      ))}
                    </div>
                  </FilterGroup>

                  <FilterGroup label="Instructor">
                    <select
                      className="select"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                    >
                      <option value="">All Instructors</option>
                      {allTeachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </FilterGroup>

                  <FilterGroup label="Tags">
                    <div className="filter-group__tags">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`badge ${selectedTags.includes(tag) ? 'badge--primary' : 'badge--gray'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </FilterGroup>

                  {/* Mobile apply button */}
                  <div className="filter-popup-footer">
                    <button
                      className="btn btn--primary btn--full"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Show {results.length} result{results.length !== 1 ? 's' : ''}
                    </button>
                    {hasActiveFilters && (
                      <button
                        className="btn btn--ghost btn--full"
                        onClick={() => { clearAll(); setSidebarOpen(false) }}
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="courses-layout__results">
            {results.length === 0 ? (
              <div className="filter-empty">
                <BookOpen size={48} />
                <p>No courses match your filters.</p>
                <button className="btn btn--secondary btn--sm" onClick={clearAll}>
                  Clear filters
                </button>
              </div>
            ) : (
              <motion.div
                className="courses-grid"
                layout
              >
                {results.map((course, i) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="filter-group">
      <p className="filter-group__label">{label}</p>
      {children}
    </div>
  )
}
