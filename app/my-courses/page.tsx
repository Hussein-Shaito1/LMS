'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useLMS } from '@/context/LMSContext'
import { getCoursesByIds, getProgressPercent } from '@/lib/courses'
import CourseCard from '@/components/ui/CourseCard'
import PageTransition from '@/components/ui/PageTransition'
import EmptyState from '@/components/ui/EmptyState'
import { BookOpen, Play } from 'lucide-react'
import type { Metadata } from 'next'

export default function MyCoursesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { enrolledCourses, getCompletedLessons } = useLMS()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading || !user) return <div className="loading-page"><div className="spinner spinner--lg" /></div>

  const courses = getCoursesByIds(enrolledCourses)

  const inProgress = courses.filter((c) => {
    const completed = getCompletedLessons(c.id)
    const pct = getProgressPercent(c.id, completed)
    return pct > 0 && pct < 100
  })

  const notStarted = courses.filter((c) => {
    const completed = getCompletedLessons(c.id)
    return completed.length === 0
  })

  const finished = courses.filter((c) => {
    const completed = getCompletedLessons(c.id)
    const pct = getProgressPercent(c.id, completed)
    return pct === 100
  })

  return (
    <PageTransition>
      <div className="page">
        <div className="container">
          <div className="page__header">
            <h1>My Courses</h1>
            <p>Track your learning journey and continue where you left off.</p>
          </div>

          {courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Enroll in a course to start your learning journey."
              actionLabel="Browse Courses"
              actionHref="/"
            />
          ) : (
            <>
              {/* Stats */}
              <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
                {[
                  { label: 'Total Enrolled', value: courses.length, color: 'primary' },
                  { label: 'In Progress', value: inProgress.length, color: 'info' },
                  { label: 'Completed', value: finished.length, color: 'success' },
                  { label: 'Not Started', value: notStarted.length, color: 'warning' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="stat-card">
                    <div className={`stat-card__icon stat-card__icon--${color}`}>
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <div className="stat-card__value">{value}</div>
                      <div className="stat-card__label">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* In Progress */}
              {inProgress.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Continue Learning</h2>
                  <div className="courses-grid">
                    {inProgress.map((c) => (
                      <CourseCard key={c.id} course={c} showProgress />
                    ))}
                  </div>
                </div>
              )}

              {/* Not started */}
              {notStarted.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Not Started Yet</h2>
                  <div className="courses-grid">
                    {notStarted.map((c) => (
                      <CourseCard key={c.id} course={c} showProgress />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed */}
              {finished.length > 0 && (
                <div>
                  <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Completed</h2>
                  <div className="courses-grid">
                    {finished.map((c) => (
                      <CourseCard key={c.id} course={c} showProgress />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
