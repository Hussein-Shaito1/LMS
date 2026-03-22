'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getAllCourses, searchCourses } from '@/lib/courses'
import CourseCard from '@/components/ui/CourseCard'
import SearchFilter from '@/components/ui/SearchFilter'
import PageTransition from '@/components/ui/PageTransition'
import HeroSwiper from '@/components/ui/HeroSwiper'
import TeacherCarousel from '@/components/ui/TeacherCarousel'
import { BookOpen, Users, Award, Star } from 'lucide-react'

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
      <HeroSwiper />

      {/* Features */}
      <section className="section section--white">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: BookOpen, title: 'Structured Learning', desc: 'Follow a clear path from beginner to expert with well-organized lessons.' },
              { icon: Users, title: 'Community Driven', desc: 'Join thousands of students and track your progress alongside peers.' },
              { icon: Award, title: 'Track Progress', desc: 'Mark lessons complete and watch your progress bar grow with each step.' },
              { icon: Star, title: 'Top Instructors', desc: 'Learn from industry professionals with real-world teaching experience.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card feature-card">
                <div className="feature-card__icon">
                  <Icon size={24} />
                </div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TeacherCarousel />

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
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Learning?</h2>
          <p className="cta-section__desc">
            Create your free account and get instant access to all courses, progress tracking, and more.
          </p>
          <div className="cta-section__actions">
            <Link href="/register" className="btn btn--white btn--lg">
              Create Free Account
            </Link>
            <Link href="#courses" className="btn btn--outline-white btn--lg">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
