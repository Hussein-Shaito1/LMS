import examsData from '@/data/exams.json'
import type { Exam, Question } from '@/types'

export function getAllExams(): Exam[] {
  return examsData as Exam[]
}

export function getExamById(id: string): Exam | undefined {
  return (examsData as Exam[]).find((e) => e.id === id)
}

export function getExamsByCourseId(courseId: string): Exam[] {
  return (examsData as Exam[]).filter((e) => e.courseId === courseId)
}

export function scoreAnswer(question: Question, answer: string): boolean {
  if (!answer) return false
  if (question.type === 'multiselect') {
    const sorted = answer.split(',').filter(Boolean).sort().join(',')
    const correctSorted = question.correctAnswer.split(',').filter(Boolean).sort().join(',')
    return sorted === correctSorted
  }
  if (question.type === 'input-text') {
    return answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
  }
  return answer === question.correctAnswer
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
