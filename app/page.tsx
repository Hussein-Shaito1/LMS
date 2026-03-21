'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getAllCourses, searchCourses } from '@/lib/courses'
import CourseCard from '@/components/ui/CourseCard'
import SearchFilter from '@/components/ui/SearchFilter'
import PageTransition from '@/components/ui/PageTransition'
import { BookOpen, Users, Award, Star } from 'lucide-react'

const STATS = [
  { value: '10+', label: 'Expert Courses' },
  { value: '50K+', label: 'Students Enrolled' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '100%', label: 'Free to Browse' },
]

export default function HomePage() {
  const allCourses = getAllCourses()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')

  const filtered = useMemo(
    () => searchCourses(query, category, level),
    [query, category, level]
  )

  const featuredCourses = allCourses.slice(0, 3)
  const isSearching = query.trim() || category !== 'All' || level !== 'All'

  return (
    <PageTransition>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__eyebrow">
            <BookOpen size={14} />
            The Future of Learning is Here
          </div>

          <h1>
            Learn Without <span>Limits</span>
          </h1>

          <p className="hero__subtitle">
            Explore 10+ expert-led courses in web development, design, data science, and more.
            Track your progress and learn at your own pace — completely free.
          </p>

          <div className="hero__actions">
            <Link href="#courses" className="btn btn--primary btn--lg">
              Browse Courses
            </Link>
            <Link href="/register" className="btn btn--secondary btn--lg">
              Start Learning Free
            </Link>
          </div>

          <div className="hero__stats">
            {STATS.map(({ value, label }) => (
              <div key={label} className="hero__stat">
                <div className="hero__stat-value">{value}</div>
                <div className="hero__stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'white', paddingBlock: '4rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { icon: BookOpen, title: 'Structured Learning', desc: 'Follow a clear path from beginner to expert with well-organized lessons.' },
              { icon: Users, title: 'Community Driven', desc: 'Join thousands of students and track your progress alongside peers.' },
              { icon: Award, title: 'Track Progress', desc: 'Mark lessons complete and watch your progress bar grow with each step.' },
              { icon: Star, title: 'Top Instructors', desc: 'Learn from industry professionals with real-world teaching experience.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: '#e0e7ff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 1rem', color: '#6366f1',
                }}>
                  <Icon size={24} />
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>
                <p style={{ fontSize: '0.875rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="section" id="courses">
        <div className="container">
          <div className="section__header">
            <span className="section__header-eyebrow">Our Catalog</span>
            <h2>
              {isSearching ? 'Search Results' : 'All Courses'}
            </h2>
            <p>
              {isSearching
                ? `Found ${filtered.length} course${filtered.length !== 1 ? 's' : ''} matching your criteria.`
                : 'From beginner to advanced — find your perfect course.'}
            </p>
          </div>

          <SearchFilter
            query={query}
            category={category}
            level={level}
            onQuery={setQuery}
            onCategory={setCategory}
            onLevel={setLevel}
            totalResults={isSearching ? filtered.length : undefined}
          />

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <BookOpen size={36} />
              </div>
              <h3>No courses found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button
                className="btn btn--primary"
                onClick={() => { setQuery(''); setCategory('All'); setLevel('All') }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="courses-grid stagger-children">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
        padding: '5rem 0',
        color: 'white',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '2.25rem' }}>
            Ready to Start Learning?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            Create your free account and get instant access to all courses, progress tracking, and more.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn--lg" style={{ background: 'white', color: '#6366f1' }}>
              Create Free Account
            </Link>
            <Link href="#courses" className="btn btn--lg" style={{ border: '2px solid rgba(255,255,255,0.5)', color: 'white' }}>
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
