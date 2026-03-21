'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLMS } from '@/context/LMSContext'
import { getCoursesByIds } from '@/lib/courses'
import CourseCard from '@/components/ui/CourseCard'
import PageTransition from '@/components/ui/PageTransition'
import EmptyState from '@/components/ui/EmptyState'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { favorites } = useLMS()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading || !user) return <div className="loading-page"><div className="spinner spinner--lg" /></div>

  const courses = getCoursesByIds(favorites)

  return (
    <PageTransition>
      <div className="page">
        <div className="container">
          <div className="page__header">
            <h1>My Favorites</h1>
            <p>{courses.length} saved course{courses.length !== 1 ? 's' : ''}</p>
          </div>

          {courses.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              description="Click the heart icon on any course to save it here for later."
              actionLabel="Browse Courses"
              actionHref="/"
            />
          ) : (
            <div className="courses-grid stagger-children">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
