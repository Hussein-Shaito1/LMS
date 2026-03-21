'use client'

import { use, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCourseById, getLessonById, getNextLesson, getPrevLesson, getProgressPercent } from '@/lib/courses'
import { useAuth } from '@/context/AuthContext'
import { useLMS } from '@/context/LMSContext'
import { useToast } from '@/context/ToastContext'
import PageTransition from '@/components/ui/PageTransition'
import ProgressBar from '@/components/ui/ProgressBar'
import QuestionSection from '@/components/lesson/QuestionSection'
import { ArrowLeft, ArrowRight, CheckCircle, ChevronLeft, Play } from 'lucide-react'

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>
}) {
  const { id, lessonId } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { isEnrolled, markLesson, isLessonCompleted, getCompletedLessons } = useLMS()
  const { showToast } = useToast()

  const course = getCourseById(id)
  const lesson = getLessonById(id, lessonId)
  const nextLesson = getNextLesson(id, lessonId)
  const prevLesson = getPrevLesson(id, lessonId)

  if (!course || !lesson) notFound()

  const enrolled = isEnrolled(course.id)
  const completed = isLessonCompleted(course.id, lesson.id)
  const completedLessons = getCompletedLessons(course.id)
  const progressPct = getProgressPercent(course.id, completedLessons)
  const lessonIndex = course.lessons.findIndex((l) => l.id === lesson.id) + 1

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (!enrolled) {
      router.push(`/course/${id}`)
    }
  }, [user, enrolled, id, router])

  if (!user || !enrolled) return null

  function handleMarkComplete() {
    markLesson(course!.id, lesson!.id)
    showToast('Lesson completed! Great work!', 'success')
  }

  return (
    <PageTransition>
      <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 70px)' }}>
        {/* Top bar */}
        <div style={{
          background: 'white', borderBottom: '1px solid #e2e8f0',
          padding: '0.75rem 0',
        }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              href={`/course/${course.id}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}
            >
              <ChevronLeft size={16} /> Back to course
            </Link>
            <div style={{ flex: 1 }}>
              <ProgressBar percent={progressPct} showLabel={false} size="sm" />
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', whiteSpace: 'nowrap' }}>
              {completedLessons.length}/{course.lessons.length} done
            </span>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
            {/* Main */}
            <div>
              {/* Video */}
              <div className="video-player" style={{ marginBottom: '1.5rem' }}>
                <iframe
                  src={lesson.videoUrl}
                  title={lesson.title}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>

              {/* Lesson info */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontSize: '0.8125rem', color: '#6366f1', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Lesson {lessonIndex} of {course.lessons.length}
                    </p>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{lesson.title}</h1>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Duration: {lesson.duration}</p>
                  </div>

                  <button
                    onClick={handleMarkComplete}
                    disabled={completed}
                    className={`btn ${completed ? 'btn--success' : 'btn--primary'}`}
                    style={completed ? { background: '#10b981', borderColor: '#10b981', color: 'white' } : {}}
                  >
                    <CheckCircle size={16} />
                    {completed ? 'Completed!' : 'Mark as Complete'}
                  </button>
                </div>

                {/* Lesson description */}
                {lesson.description && (
                  <p style={{
                    marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0',
                    fontSize: '0.9375rem', color: '#475569', lineHeight: 1.7,
                  }}>
                    {lesson.description}
                  </p>
                )}

                {/* Navigation */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', gap: '1rem',
                  marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0',
                }}>
                  {prevLesson ? (
                    <Link href={`/course/${course.id}/lesson/${prevLesson.id}`} className="btn btn--secondary">
                      <ArrowLeft size={16} /> Previous
                    </Link>
                  ) : <div />}
                  {nextLesson ? (
                    <Link href={`/course/${course.id}/lesson/${nextLesson.id}`} className="btn btn--primary">
                      Next <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link href={`/course/${course.id}`} className="btn btn--success" style={{ background: '#10b981', borderColor: '#10b981', color: 'white' }}>
                      <CheckCircle size={16} /> Finish Course
                    </Link>
                  )}
                </div>
              </div>

              {/* Questions */}
              {lesson.questions && lesson.questions.length > 0 && (
                <QuestionSection
                  courseId={course.id}
                  lessonId={lesson.id}
                  questions={lesson.questions}
                />
              )}
            </div>

            {/* Lesson list sidebar */}
            <div className="card" style={{ maxHeight: '80vh', overflowY: 'auto', position: 'sticky', top: '90px' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Course Content</h3>
              <div className="lessons-list">
                {course.lessons.map((l, idx) => {
                  const isDone = completedLessons.includes(l.id)
                  const isActive = l.id === lesson.id
                  return (
                    <Link
                      key={l.id}
                      href={`/course/${course.id}/lesson/${l.id}`}
                      className={`lesson-item ${isDone ? 'lesson-item--completed' : ''} ${isActive ? 'lesson-item--active' : ''}`}
                    >
                      <span className="lesson-item__number">{idx + 1}</span>
                      <div className="lesson-item__icon">
                        {isDone ? <CheckCircle size={15} /> : <Play size={14} />}
                      </div>
                      <div className="lesson-item__info">
                        <div className="lesson-item__title">{l.title}</div>
                        <div className="lesson-item__duration">{l.duration}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
