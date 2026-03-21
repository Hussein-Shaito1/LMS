import coursesData from '@/data/courses.json'
import teachersData from '@/data/teachers.json'
import type { Course, Lesson, Teacher } from '@/types'

const courses = coursesData as Course[]
const teachers = teachersData as Teacher[]

export function getAllCourses(): Course[] {
  return courses
}

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id)
}

export function getLessonById(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourseById(courseId)
  return course?.lessons.find((l) => l.id === lessonId)
}

export function getCategories(): string[] {
  return [...new Set(courses.map((c) => c.category))].sort()
}

export function getLevels(): string[] {
  return ['Beginner', 'Intermediate', 'Advanced']
}

export function getAllTags(): string[] {
  const tags = courses.flatMap((c) => c.tags)
  return [...new Set(tags)].sort()
}

export function getAllTeachers(): Teacher[] {
  return teachers
}

export function getTeacherById(id: string): Teacher | undefined {
  return teachers.find((t) => t.id === id)
}

export function getCoursesByTeacherId(teacherId: string): Course[] {
  return courses.filter((c) => c.instructorId === teacherId)
}

export type SortOption = 'popular' | 'rating' | 'newest' | 'shortest'

export interface CourseFilters {
  query?: string
  category?: string
  level?: string
  teacherId?: string
  tags?: string[]
  sort?: SortOption
}

export function filterCourses({
  query = '',
  category = '',
  level = '',
  teacherId = '',
  tags = [],
  sort = 'popular',
}: CourseFilters): Course[] {
  let result = [...courses]

  if (query.trim()) {
    const q = query.toLowerCase()
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  if (category && category !== 'All') {
    result = result.filter((c) => c.category === category)
  }

  if (level && level !== 'All') {
    result = result.filter((c) => c.level === level)
  }

  if (teacherId) {
    result = result.filter((c) => c.instructorId === teacherId)
  }

  if (tags.length > 0) {
    result = result.filter((c) => tags.every((tag) => c.tags.includes(tag)))
  }

  // Sort
  switch (sort) {
    case 'popular':
      result.sort((a, b) => b.students - a.students)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      // Use reverse of original array order as proxy for "newest"
      result.sort((a, b) => {
        const ia = courses.findIndex((c) => c.id === a.id)
        const ib = courses.findIndex((c) => c.id === b.id)
        return ib - ia
      })
      break
    case 'shortest':
      result.sort((a, b) => {
        const toMinutes = (dur: string) => {
          const match = dur.match(/(\d+)h\s*(\d+)?m?/)
          if (!match) return 0
          return parseInt(match[1]) * 60 + (parseInt(match[2] ?? '0') || 0)
        }
        return toMinutes(a.duration) - toMinutes(b.duration)
      })
      break
  }

  return result
}

export function searchCourses(query: string, category: string, level: string): Course[] {
  return filterCourses({ query, category, level })
}

export function getCoursesByIds(ids: string[]): Course[] {
  return ids.map((id) => getCourseById(id)).filter(Boolean) as Course[]
}

export function getProgressPercent(courseId: string, completedLessons: string[]): number {
  const course = getCourseById(courseId)
  if (!course || course.lessons.length === 0) return 0
  const completed = completedLessons.filter((lid) =>
    course.lessons.some((l) => l.id === lid)
  ).length
  return Math.round((completed / course.lessons.length) * 100)
}

export function getNextLesson(courseId: string, currentLessonId: string): Lesson | undefined {
  const course = getCourseById(courseId)
  if (!course) return undefined
  const idx = course.lessons.findIndex((l) => l.id === currentLessonId)
  return course.lessons[idx + 1]
}

export function getPrevLesson(courseId: string, currentLessonId: string): Lesson | undefined {
  const course = getCourseById(courseId)
  if (!course) return undefined
  const idx = course.lessons.findIndex((l) => l.id === currentLessonId)
  return idx > 0 ? course.lessons[idx - 1] : undefined
}
