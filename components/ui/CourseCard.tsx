'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, Star } from 'lucide-react'
import type { Course } from '@/types'
import { useLMS } from '@/context/LMSContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { getProgressPercent } from '@/lib/courses'
import ProgressBar from './ProgressBar'

interface CourseCardProps {
  course: Course
  showProgress?: boolean
}

function getLevelClass(level: string): string {
  return level.toLowerCase().replace(' ', '-')
}

function getCategoryClass(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

export default function CourseCard({ course, showProgress }: CourseCardProps) {
  const { user } = useAuth()
  const { isFavorite, toggleFavorite, getCompletedLessons } = useLMS()
  const { showToast } = useToast()

  const completedLessons = getCompletedLessons(course.id)
  const progressPct = getProgressPercent(course.id, completedLessons)

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    if (!user) {
      showToast('Please log in to save favorites.', 'info')
      return
    }
    const added = toggleFavorite(course.id)
    showToast(
      added ? 'Added to favorites!' : 'Removed from favorites.',
      'success'
    )
  }

  return (
    <Link href={`/course/${course.id}`} className="course-card">
      <div className="course-card__thumbnail">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className={`badge badge--${getLevelClass(course.level)} course-card__thumbnail-badge`}>
          {course.level}
        </span>
        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          aria-label={isFavorite(course.id) ? 'Remove from favorites' : 'Add to favorites'}
          className={`course-card__fav-btn${isFavorite(course.id) ? ' course-card__fav-btn--active' : ''}`}
        >
          <svg width="16" height="16" fill={isFavorite(course.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="course-card__body">
        <div className="course-card__meta">
          <span className={`badge badge--${getCategoryClass(course.category)}`}>
            {course.category}
          </span>
        </div>

        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__description">{course.shortDescription}</p>

        <Link
          href={`/teacher/${course.instructorId}`}
          className="course-card__instructor"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={course.instructorAvatar}
            alt={course.instructor}
            width={28}
            height={28}
            className="course-card__instructor-avatar"
          />
          <span className="course-card__instructor-name">{course.instructor}</span>
        </Link>

        {showProgress && (
          <ProgressBar percent={progressPct} label="Progress" />
        )}

        <div className="course-card__footer">
          <div className="course-card__stats">
            <span className="course-card__stat">
              <Clock size={13} />
              {course.duration}
            </span>
            <span className="course-card__stat">
              <Users size={13} />
              {course.students.toLocaleString()}
            </span>
          </div>
          <div className="course-card__rating">
            <Star size={14} fill="currentColor" />
            {course.rating}
          </div>
        </div>
      </div>
    </Link>
  )
}
