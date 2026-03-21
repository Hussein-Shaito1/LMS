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
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="profile-avatar" style={{ margin: '0 auto 1rem' }}>
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={100}
                  height={100}
                  className="profile-avatar__img"
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>

              <h2 style={{ marginBottom: '0.25rem' }}>{user.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                <Mail size={14} /> {user.email}
              </div>

              {user.bio && (
                <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>{user.bio}</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                <Calendar size={13} /> Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>

              <Link href="/profile/edit" className="btn btn--secondary btn--full">
                <Edit size={16} /> Edit Profile
              </Link>
            </div>

            {/* Stats and info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Stats */}
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

              {/* Recent courses */}
              {enrolledCourseObjs.length > 0 && (
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>Recent Courses</h3>
                    <Link href="/my-courses" style={{ fontSize: '0.875rem', color: '#6366f1' }}>View all →</Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {enrolledCourseObjs.slice(0, 4).map((course) => {
                      const completed = getCompletedLessons(course.id)
                      const pct = getProgressPercent(course.id, completed)
                      return (
                        <Link
                          key={course.id}
                          href={`/course/${course.id}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textDecoration: 'none', transition: 'all 0.2s' }}
                        >
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            width={60}
                            height={40}
                            style={{ borderRadius: '0.375rem', objectFit: 'cover', flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {course.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{pct}% complete</div>
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
