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
  BookOpen, CheckCircle, Clock, FileQuestion, Heart, Play, Users,
} from 'lucide-react'
import { getExamsByCourseId } from '@/lib/exams'

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
  const courseExams = getExamsByCourseId(course.id)
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
      <div className="course-hero">
        <div className="container">
          <div className="course-hero-grid">
            <div>
              <div className="badge-row">
                <span className={`badge badge--${course.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                  {course.category}
                </span>
                <span className={`badge badge--${getLevelClass(course.level)}`}>
                  {course.level}
                </span>
              </div>

              <h1 className="course-detail-title">{course.title}</h1>

              <p className="course-detail-desc">{course.description}</p>

              <div className="course-meta">
                <StarRating rating={course.rating} />
                <span className="course-meta__stat">
                  <Users size={14} /> {course.students.toLocaleString()} students
                </span>
                <span className="course-meta__stat">
                  <Clock size={14} /> {course.duration}
                </span>
                <span className="course-meta__stat">
                  {course.lessons.length} lessons
                </span>
              </div>

              <div className="course-instructor-row">
                <Image
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  width={36}
                  height={36}
                />
                <span className="course-instructor-row__text">
                  Taught by <strong>{course.instructor}</strong>
                </span>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="course-hero__thumbnail max-md-hidden">
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

      <div className="container course-body">
        <div className="course-body-grid">
          {/* Main content */}
          <div>
            {/* Progress (if enrolled) */}
            {enrolled && (
              <div className="card course-progress-card">
                <h3>Your Progress</h3>
                <ProgressBar percent={progressPct} label="Course completion" />
                <p>
                  {completedLessons.length} of {course.lessons.length} lessons completed
                </p>
              </div>
            )}

            {/* Lessons */}
            <div className="card">
              <h2 className="lessons-card-title">
                <BookOpen size={20} /> Course Content
                <span className="lessons-card-title__count">
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
                    <div key={lesson.id} className="lesson-item lesson-item--locked">
                      <span className="lesson-item__number">{idx + 1}</span>
                      <div className="lesson-item__icon lesson-item__icon--locked">
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
            <div className="tags-row">
              {course.tags.map((tag) => (
                <span key={tag} className="badge badge--gray">{tag}</span>
              ))}
            </div>

            {/* Linked Exams */}
            {courseExams.length > 0 && (
              <div className="card course-exams">
                <h2 className="course-exams__title">
                  <FileQuestion size={20} /> Course Exams
                </h2>
                {courseExams.map((exam) => (
                  <Link key={exam.id} href={`/exam/${exam.id}`} className="exam-card">
                    <div className="exam-card__icon">
                      <FileQuestion size={20} />
                    </div>
                    <div className="exam-card__info">
                      <div className="exam-card__title">{exam.title}</div>
                      <div className="exam-card__meta">
                        <span>{exam.questions.length} questions</span>
                        <span>{exam.duration} min</span>
                        <span>Pass at {exam.passingScore}%</span>
                      </div>
                    </div>
                    <span className="badge badge--primary">Take Exam →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="course-body-grid__sidebar">
            <div className="card">
              {enrolled ? (
                <>
                  <div className="enrolled-banner">
                    <CheckCircle size={16} /> You are enrolled
                  </div>
                  <Link
                    href={`/course/${course.id}/lesson/${course.lessons[0]?.id}`}
                    className="btn btn--primary btn--full btn--lg"
                  >
                    <Play size={18} />
                    {completedLessons.length > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Link>
                  <div className="sidebar-progress">
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
                className="btn btn--secondary btn--full sidebar-fav-btn"
              >
                <Heart size={16} fill={favorite ? 'currentColor' : 'none'} className={favorite ? 'text-red' : ''} />
                {favorite ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>

              <div className="course-info-list">
                {[
                  { icon: BookOpen, text: `${course.lessons.length} lessons` },
                  { icon: Clock, text: course.duration },
                  { icon: Users, text: `${course.students.toLocaleString()} students` },
                  { icon: CheckCircle, text: 'Certificate on completion' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="course-info-item">
                    <Icon size={16} className="course-info-item__icon" />
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
