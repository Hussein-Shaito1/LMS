'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getTeacherById, getCoursesByTeacherId } from '@/lib/courses'
import { useLMS } from '@/context/LMSContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import PageTransition from '@/components/ui/PageTransition'
import CourseCard from '@/components/ui/CourseCard'
import { BookOpen, Mail, Star, Users } from 'lucide-react'

export default function TeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const teacher = getTeacherById(id)
  if (!teacher) notFound()

  const courses = getCoursesByTeacherId(id)
  const { user } = useAuth()
  const { toggleFavorite, isFavorite } = useLMS()
  const { showToast } = useToast()

  // Aggregate stats
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0)
  const avgRating = courses.length
    ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
    : '—'

  function handleFavorite(courseId: string, title: string) {
    if (!user) {
      showToast('Please log in to save favorites.', 'info')
      return
    }
    const added = toggleFavorite(courseId)
    showToast(added ? 'Added to favorites!' : 'Removed from favorites.', 'success')
  }

  return (
    <PageTransition>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '4rem 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Image
                src={teacher.avatar}
                alt={teacher.name}
                width={120}
                height={120}
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Instructor
              </p>
              <h1 style={{ color: 'white', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {teacher.name}
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '1.25rem' }}>
                {teacher.title}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, maxWidth: 640, marginBottom: '1.5rem' }}>
                {teacher.bio}
              </p>
              {teacher.contact && (
                <a
                  href={`mailto:${teacher.contact}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    color: '#818cf8', fontSize: '0.875rem', textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                >
                  <Mail size={15} /> {teacher.contact}
                </a>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignSelf: 'center' }}>
              {[
                { icon: BookOpen, value: courses.length, label: 'Courses' },
                { icon: Users, value: totalStudents.toLocaleString(), label: 'Students' },
                { icon: Star, value: avgRating, label: 'Avg Rating' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem 1.5rem',
                  textAlign: 'center',
                  minWidth: 100,
                }}>
                  <Icon size={20} style={{ color: '#818cf8', marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Courses by {teacher.name}
        </h2>

        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No courses yet.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
