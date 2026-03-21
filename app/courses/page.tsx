'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>

        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>All Courses</h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Explore our full library of courses across every topic.
          </p>
        </div>

        {/* Top bar: search + sort + filter toggle */}
        <div style={{
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
          alignItems: 'center', marginBottom: '1.5rem',
        }}>
          {/* Search */}
          <div className="search-bar" style={{ flex: '1', minWidth: '220px' }}>
            <Search className="search-bar__icon" size={18} />
            <input
              type="text"
              placeholder="Search courses, instructors, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Sort */}
          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            style={{ minWidth: 160 }}
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="shortest">Shortest Duration</option>
          </select>

          {/* Filter toggle */}
          <button
            className={`btn ${sidebarOpen ? 'btn--primary' : 'btn--secondary'} btn--sm`}
            onClick={() => setSidebarOpen((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasActiveFilters && (
              <span style={{
                background: 'white', color: '#6366f1', borderRadius: '9999px',
                fontSize: '0.7rem', fontWeight: 700, padding: '0 0.375rem', lineHeight: '1.4',
              }}>
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
            <button className="btn btn--ghost btn--sm" onClick={clearAll} style={{ gap: '0.375rem' }}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        <div className="courses-layout">

          {/* Sidebar filters */}
          {sidebarOpen && (
            <motion.aside
              className="courses-layout__sidebar"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'white',
                border: '1.5px solid #e2e8f0',
                borderRadius: '1rem',
                padding: '1.25rem',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
              }}
            >
              <FilterGroup label="Level">
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
              </FilterGroup>

              <FilterGroup label="Category">
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
              </FilterGroup>

              <FilterGroup label="Instructor">
                <select
                  className="select"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8125rem' }}
                >
                  <option value="">All Instructors</option>
                  {allTeachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label="Tags">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`badge ${selectedTags.includes(tag) ? 'badge--primary' : 'badge--gray'}`}
                      style={{ cursor: 'pointer', border: 'none', fontSize: '0.75rem' }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            </motion.aside>
          )}

          {/* Results */}
          <div className="courses-layout__results">
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Showing <strong>{results.length}</strong> course{results.length !== 1 ? 's' : ''}
              {query && ` for "${query}"`}
            </p>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                <BookOpen size={48} style={{ opacity: 0.3, display: 'block', margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '1rem' }}>No courses match your filters.</p>
                <button className="btn btn--secondary btn--sm" onClick={clearAll} style={{ marginTop: '1rem' }}>
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
    <div>
      <p style={{
        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '0.625rem',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {children}
      </div>
    </div>
  )
}
