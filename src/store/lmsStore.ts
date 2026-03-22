import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Answers, ExamResult, Progress, UserAnswer } from '@/types'

interface LMSState {
  enrolledCourses: string[]
  favorites: string[]
  progress: Progress
  answers: Answers
  examResults: Record<string, ExamResult>

  enroll: (courseId: string) => void
  unenroll: (courseId: string) => void
  isEnrolled: (courseId: string) => boolean
  toggleFavorite: (courseId: string) => boolean
  isFavorite: (courseId: string) => boolean
  markLesson: (courseId: string, lessonId: string) => void
  isLessonCompleted: (courseId: string, lessonId: string) => boolean
  getCompletedLessons: (courseId: string) => string[]

  submitAnswer: (courseId: string, lessonId: string, questionId: string, answer: string, isCorrect: boolean) => void
  getAnswer: (courseId: string, lessonId: string, questionId: string) => UserAnswer | undefined
  getLessonAnswers: (courseId: string, lessonId: string) => Record<string, UserAnswer>

  saveExamResult: (result: ExamResult) => void
  getExamResult: (examId: string) => ExamResult | undefined

  resetAll: () => void
}

const empty = {
  enrolledCourses: [] as string[],
  favorites: [] as string[],
  progress: {} as Progress,
  answers: {} as Answers,
  examResults: {} as Record<string, ExamResult>,
}

export const useLMSStore = create<LMSState>()(
  persist(
    (set, get) => ({
      ...empty,

      enroll: (courseId) => {
        set((state) => {
          if (state.enrolledCourses.includes(courseId)) return state
          return { enrolledCourses: [...state.enrolledCourses, courseId] }
        })
      },

      unenroll: (courseId) => {
        set((state) => ({
          enrolledCourses: state.enrolledCourses.filter((id) => id !== courseId),
        }))
      },

      isEnrolled: (courseId) => get().enrolledCourses.includes(courseId),

      toggleFavorite: (courseId) => {
        const exists = get().favorites.includes(courseId)
        set((state) => ({
          favorites: exists
            ? state.favorites.filter((id) => id !== courseId)
            : [...state.favorites, courseId],
        }))
        return !exists
      },

      isFavorite: (courseId) => get().favorites.includes(courseId),

      markLesson: (courseId, lessonId) => {
        set((state) => {
          const courseLessons = state.progress[courseId] ?? []
          if (courseLessons.includes(lessonId)) return state
          return { progress: { ...state.progress, [courseId]: [...courseLessons, lessonId] } }
        })
      },

      isLessonCompleted: (courseId, lessonId) =>
        (get().progress[courseId] ?? []).includes(lessonId),

      getCompletedLessons: (courseId) => get().progress[courseId] ?? [],

      submitAnswer: (courseId, lessonId, questionId, answer, isCorrect) => {
        const userAnswer: UserAnswer = {
          questionId,
          answer,
          isCorrect,
          submittedAt: new Date().toISOString(),
        }
        set((state) => ({
          answers: {
            ...state.answers,
            [courseId]: {
              ...(state.answers[courseId] ?? {}),
              [lessonId]: {
                ...(state.answers[courseId]?.[lessonId] ?? {}),
                [questionId]: userAnswer,
              },
            },
          },
        }))
      },

      getAnswer: (courseId, lessonId, questionId) =>
        get().answers[courseId]?.[lessonId]?.[questionId],

      getLessonAnswers: (courseId, lessonId) =>
        get().answers[courseId]?.[lessonId] ?? {},

      saveExamResult: (result) => {
        set((state) => ({
          examResults: { ...state.examResults, [result.examId]: result },
        }))
      },

      getExamResult: (examId) => get().examResults[examId],

      resetAll: () => set(empty),
    }),
    { name: 'lms_data_store' }
  )
)

export const useLMS = useLMSStore
