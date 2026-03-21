'use client'

import { use } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCourseById, getProgressPercent } from '@/lib/courses'
import { useAuth } from '@/context/AuthContext'
import { useLMS } from '@/context/LMSContext'
import { useToast } from '@/context/ToastContext'
import PageTransition from '@/components/ui/PageTransition'
import ProgressBar from '@/components/ui/ProgressBar'
import StarRating from '@/components/ui/StarRating'
import {
  BookOpen, CheckCircle, Clock, Heart, Play, Users,
} from 'lucide-react'

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const courseOrUndef = getCourseById(id)
  if (!courseOrUndef) notFound()
  const course = courseOrUndef!

  const router = useRouter()
  const { user } = useAuth()
  const { enroll, isEnrolled, toggleFavorite, isFavorite, getCompletedLessons } = useLMS()
  const { showToast } = useToast()

  const enrolled = isEnrolled(course.id)
  const favorite = isFavorite(course.id)
  const completedLessons = getCompletedLessons(course.id)
  const progressPct = getProgressPercent(course.id, completedLessons)

  function handleEnroll() {
    if (!user) {
      showToast('Please log in to enroll in courses.', 'info')
      router.push('/login')
      return
    }
    enroll(course.id)
    showToast(`Enrolled in "${course.title}"! Start learning now.`, 'success')
  }

  function handleFavorite() {
    if (!user) {
      showToast('Please log in to save favorites.', 'info')
      return
    }
    const added = toggleFavorite(course.id)
    showToast(added ? 'Added to favorites!' : 'Removed from favorites.', 'success')
  }

  function getLevelClass(level: string) {
    return level.toLowerCase().replace(' ', '-')
  }

  return (
    <PageTransition>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '3rem 0',
      }}>
        <div className="container">
          <div className="course-hero-grid">
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className={`badge badge--${course.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                  {course.category}
                </span>
                <span className={`badge badge--${getLevelClass(course.level)}`}>
                  {course.level}
                </span>
              </div>

              <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem', lineHeight: 1.3 }}>
                {course.title}
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.5rem', maxWidth: 640 }}>
                {course.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <StarRating rating={course.rating} />
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                  <Users size={14} /> {course.students.toLocaleString()} students
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                  <Clock size={14} /> {course.duration}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                  {course.lessons.length} lessons
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Image
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  width={36}
                  height={36}
                  style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }}
                />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                  Taught by <strong style={{ color: 'white' }}>{course.instructor}</strong>
                </span>
              </div>
            </div>

            {/* Thumbnail */}
            <div style={{
              width: 280, borderRadius: '0.75rem', overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)', flexShrink: 0,
            }} className="max-md-hidden">
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={280}
                height={157}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="course-body-grid">
          {/* Main content */}
          <div>
            {/* Progress (if enrolled) */}
            {enrolled && (
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Your Progress</h3>
                <ProgressBar percent={progressPct} label="Course completion" />
                <p style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  {completedLessons.length} of {course.lessons.length} lessons completed
                </p>
              </div>
            )}

            {/* Lessons */}
            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} /> Course Content
                <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#64748b', marginLeft: 'auto' }}>
                  {course.lessons.length} lessons · {course.duration}
                </span>
              </h2>

              <div className="lessons-list">
                {course.lessons.map((lesson, idx) => {
                  const isCompleted = completedLessons.includes(lesson.id)
                  const isAccessible = enrolled
                  return isAccessible ? (
                    <Link
                      key={lesson.id}
                      href={`/course/${course.id}/lesson/${lesson.id}`}
                      className={`lesson-item ${isCompleted ? 'lesson-item--completed' : ''}`}
                    >
                      <span className="lesson-item__number">{idx + 1}</span>
                      <div className="lesson-item__icon">
                        <Play size={16} />
                      </div>
                      <div className="lesson-item__info">
                        <div className="lesson-item__title">{lesson.title}</div>
                        <div className="lesson-item__duration">{lesson.duration}</div>
                      </div>
                      {isCompleted && <CheckCircle className="lesson-item__check" size={20} />}
                    </Link>
                  ) : (
                    <div key={lesson.id} className="lesson-item" style={{ opacity: 0.7, cursor: 'default' }}>
                      <span className="lesson-item__number">{idx + 1}</span>
                      <div className="lesson-item__icon" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                        <Play size={16} />
                      </div>
                      <div className="lesson-item__info">
                        <div className="lesson-item__title">{lesson.title}</div>
                        <div className="lesson-item__duration">{lesson.duration}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {course.tags.map((tag) => (
                <span key={tag} className="badge badge--gray">{tag}</span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="course-body-grid__sidebar">
            <div className="card">
              {enrolled ? (
                <>
                  <div style={{
                    background: '#d1fae5', borderRadius: '0.5rem', padding: '0.75rem 1rem',
                    marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    color: '#059669', fontWeight: 600, fontSize: '0.875rem',
                  }}>
                    <CheckCircle size={16} /> You are enrolled
                  </div>
                  <Link
                    href={`/course/${course.id}/lesson/${course.lessons[0]?.id}`}
                    className="btn btn--primary btn--full btn--lg"
                  >
                    <Play size={18} />
                    {completedLessons.length > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Link>
                  <div style={{ marginTop: '1rem' }}>
                    <ProgressBar percent={progressPct} label="Progress" size="sm" />
                  </div>
                </>
              ) : (
                <button onClick={handleEnroll} className="btn btn--primary btn--full btn--lg">
                  <BookOpen size={18} />
                  Enroll for Free
                </button>
              )}

              <button
                onClick={handleFavorite}
                className="btn btn--secondary btn--full"
                style={{ marginTop: '0.75rem' }}
              >
                <Heart size={16} fill={favorite ? 'currentColor' : 'none'} style={{ color: favorite ? '#ef4444' : undefined }} />
                {favorite ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: BookOpen, text: `${course.lessons.length} lessons` },
                  { icon: Clock, text: course.duration },
                  { icon: Users, text: `${course.students.toLocaleString()} students` },
                  { icon: CheckCircle, text: 'Certificate on completion' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#475569' }}>
                    <Icon size={16} style={{ color: '#6366f1', flexShrink: 0 }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
