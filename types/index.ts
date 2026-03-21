export type QuestionType = 'multiple-choice' | 'input-text' | 'dropdown' | 'multiselect' | 'sorting'

export interface QuestionOption {
  id: string
  text: string
}

export interface Question {
  id: string
  type: QuestionType
  question: string
  options?: QuestionOption[]   // for multiple-choice and dropdown
  correctAnswer: string        // option id or text string
  explanation?: string
}

export interface UserAnswer {
  questionId: string
  answer: string
  isCorrect: boolean
  submittedAt: string
}

// answers[courseId][lessonId][questionId] = UserAnswer
export type Answers = Record<string, Record<string, Record<string, UserAnswer>>>

export interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl: string
  description?: string
  questions?: Question[]
}

export interface Course {
  id: string
  title: string
  description: string
  shortDescription: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  instructor: string
  instructorAvatar: string
  instructorId: string
  duration: string
  thumbnail: string
  rating: number
  students: number
  lessons: Lesson[]
  tags: string[]
}

export interface Teacher {
  id: string
  name: string
  avatar: string
  title: string
  bio: string
  contact?: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  avatar: string
  bio: string
  joinedAt: string
}

export interface StoredUser {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  joinedAt: string
}

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

export interface Progress {
  [courseId: string]: string[]
}
