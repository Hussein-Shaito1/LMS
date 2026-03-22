'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useLMS } from '@/context/LMSContext'
import { getCoursesByIds, getProgressPercent } from '@/lib/courses'
import PageTransition from '@/components/ui/PageTransition'
import { Award, BookOpen, Calendar, Edit, Heart, Mail } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { enrolledCourses, favorites, getCompletedLessons } = useLMS()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading || !user) return <div className="loading-page"><div className="spinner spinner--lg" /></div>

  const enrolledCourseObjs = getCoursesByIds(enrolledCourses)
  const totalLessonsCompleted = enrolledCourseObjs.reduce((sum, c) => {
    return sum + getCompletedLessons(c.id).length
  }, 0)

  const completedCourses = enrolledCourseObjs.filter((c) => {
    const done = getCompletedLessons(c.id)
    return getProgressPercent(c.id, done) === 100
  })

  return (
    <PageTransition>
      <div className="page">
        <div className="container">
          <div className="profile-grid">
            {/* Profile card */}
            <div className="card profile-card">
              <div className="profile-avatar">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={100}
                  height={100}
                  className="profile-avatar__img"
                />
              </div>

              <h2>{user.name}</h2>

              <div className="profile-email">
                <Mail size={14} /> {user.email}
              </div>

              {user.bio && (
                <p className="profile-bio">{user.bio}</p>
              )}

              <div className="profile-joined">
                <Calendar size={13} /> Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>

              <Link href="/profile/edit" className="btn btn--secondary btn--full">
                <Edit size={16} /> Edit Profile
              </Link>
            </div>

            {/* Stats and info */}
            <div className="profile-side">
              <div className="stats-grid">
                {[
                  { icon: BookOpen, label: 'Courses Enrolled', value: enrolledCourses.length, color: 'primary' },
                  { icon: Heart, label: 'Favorites', value: favorites.length, color: 'info' },
                  { icon: Award, label: 'Completed', value: completedCourses.length, color: 'success' },
                  { icon: BookOpen, label: 'Lessons Done', value: totalLessonsCompleted, color: 'warning' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="stat-card">
                    <div className={`stat-card__icon stat-card__icon--${color}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="stat-card__value">{value}</div>
                      <div className="stat-card__label">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {enrolledCourseObjs.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h3>Recent Courses</h3>
                    <Link href="/my-courses">View all →</Link>
                  </div>
                  <div className="recent-list">
                    {enrolledCourseObjs.slice(0, 4).map((course) => {
                      const completed = getCompletedLessons(course.id)
                      const pct = getProgressPercent(course.id, completed)
                      return (
                        <Link key={course.id} href={`/course/${course.id}`} className="recent-course-item">
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            width={60}
                            height={40}
                          />
                          <div className="recent-course-item__body">
                            <div className="recent-course-item__title">{course.title}</div>
                            <div className="recent-course-item__pct">{pct}% complete</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
