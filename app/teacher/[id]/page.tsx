'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
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
  const { toggleFavorite } = useLMS()
  const { showToast } = useToast()

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0)
  const avgRating = courses.length
    ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
    : '—'

  function handleFavorite(courseId: string) {
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
      <div className="teacher-hero">
        <div className="container">
          <div className="teacher-hero__inner">
            <div className="teacher-hero__avatar">
              <Image
                src={teacher.avatar}
                alt={teacher.name}
                width={120}
                height={120}
                className="teacher-hero__avatar-img"
              />
            </div>

            <div className="teacher-hero__info">
              <p className="teacher-hero__role">Instructor</p>
              <h1 className="teacher-hero__name">{teacher.name}</h1>
              <p className="teacher-hero__title">{teacher.title}</p>
              <p className="teacher-hero__bio">{teacher.bio}</p>
              {teacher.contact && (
                <a href={`mailto:${teacher.contact}`} className="teacher-hero__contact">
                  <Mail size={15} /> {teacher.contact}
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="teacher-hero__stats">
              {[
                { icon: BookOpen, value: courses.length, label: 'Courses' },
                { icon: Users, value: totalStudents.toLocaleString(), label: 'Students' },
                { icon: Star, value: avgRating, label: 'Avg Rating' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="teacher-stat">
                  <div className="teacher-stat__icon">
                    <Icon size={20} />
                  </div>
                  <div className="teacher-stat__value">{value}</div>
                  <div className="teacher-stat__label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="container teacher-courses">
        <h2 className="section-heading-plain">Courses by {teacher.name}</h2>

        {courses.length === 0 ? (
          <div className="empty-simple">
            <BookOpen size={48} />
            <p>No courses yet.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
