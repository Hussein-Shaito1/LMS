'use client'

import { use, useEffect, useRef, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getExamById } from '@/lib/exams'
import { getCourseById } from '@/lib/courses'
import { useLMS } from '@/context/LMSContext'
import { useAuth } from '@/context/AuthContext'
import PageTransition from '@/components/ui/PageTransition'
import { AlertCircle, Award, CheckCircle, Clock, RotateCcw, XCircle } from 'lucide-react'
import { formatTime } from '@/lib/exams'

export default function ExamResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const exam = getExamById(id)
  if (!exam) notFound()

  const router = useRouter()
  const { user, loading } = useAuth()
  const { getExamResult } = useLMS()
  const result = getExamResult(exam.id)

  const course = exam.courseId ? getCourseById(exam.courseId) : undefined

  // Animated ring
  const circumference = 2 * Math.PI * 54
  const [dashOffset, setDashOffset] = useState(circumference)
  const animated = useRef(false)

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
  }, [user, loading, router])

  useEffect(() => {
    if (result && !animated.current) {
      animated.current = true
      setTimeout(() => {
        setDashOffset(circumference - (circumference * result.percentage) / 100)
      }, 300)
    }
  }, [result, circumference])

  if (loading || !user) return <div className="loading-page"><div className="spinner spinner--lg" /></div>

  if (!result) {
    return (
      <PageTransition>
        <div className="page">
          <div className="container" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '4rem 1rem' }}>
            <h2>No result found</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>You haven't taken this exam yet.</p>
            <Link href={`/exam/${exam.id}`} className="btn btn--primary">Take Exam</Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  const timeLeft = result.durationSeconds - result.timeSpent

  return (
    <PageTransition>
      <div className="exam-result-page">
        {/* Hero */}
        <div className={`exam-result-hero exam-result-hero--${result.passed ? 'pass' : 'fail'}`}>
          <div className="container">
            <div style={{ textAlign: 'center' }}>
              <div className="exam-result-hero__badge">
                {result.passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {result.passed ? 'Exam Passed' : 'Exam Failed'}
              </div>

              <h1 className="exam-result-hero__title">{exam.title}</h1>
              <p className="exam-result-hero__subtitle">
                {result.passed
                  ? `Congratulations! You scored above the ${exam.passingScore}% passing threshold.`
                  : `You needed ${exam.passingScore}% to pass. Keep studying and try again!`}
              </p>

              {/* Score ring */}
              <div className="score-display">
                <div className="score-ring">
                  <svg viewBox="0 0 120 120" width="140" height="140">
                    <circle className="score-ring__bg" cx="60" cy="60" r="54" />
                    <circle
                      className="score-ring__fill"
                      cx="60"
                      cy="60"
                      r="54"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                    />
                  </svg>
                  <div className="score-ring__percent">
                    <span className="percent-value">{result.percentage}%</span>
                    <span className="percent-label">Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>

            {/* Auto-submit notice */}
            {result.autoSubmitted && (
              <div className="auto-submit-notice">
                <AlertCircle size={16} />
                This exam was automatically submitted when the timer ran out.
              </div>
            )}

            {/* Stats */}
            <div className="result-stats">
              <div className="result-stat-card">
                <div className="result-stat-card__icon result-stat-card__icon--success">
                  <CheckCircle size={20} />
                </div>
                <div className="result-stat-card__value">{result.score}/{result.total}</div>
                <div className="result-stat-card__label">Correct Answers</div>
              </div>

              <div className="result-stat-card">
                <div className="result-stat-card__icon result-stat-card__icon--info">
                  <Clock size={20} />
                </div>
                <div className="result-stat-card__value">{formatTime(result.timeSpent)}</div>
                <div className="result-stat-card__label">Time Spent</div>
              </div>

              <div className="result-stat-card">
                <div className={`result-stat-card__icon result-stat-card__icon--${timeLeft > 0 ? 'warning' : 'error'}`}>
                  <Clock size={20} />
                </div>
                <div className="result-stat-card__value">
                  {timeLeft > 0 ? formatTime(timeLeft) : '0:00'}
                </div>
                <div className="result-stat-card__label">Time Remaining</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link href={`/exam/${exam.id}/start`} className="btn btn--primary">
                <RotateCcw size={16} /> Retake Exam
              </Link>
              <Link href={`/exam/${exam.id}`} className="btn btn--secondary">
                Exam Details
              </Link>
              {course && (
                <Link href={`/course/${course.id}`} className="btn btn--ghost">
                  ← Back to Course
                </Link>
              )}
            </div>

            {/* Answer review */}
            <div className="exam-review">
              <div className="exam-review__header">
                <h3>Answer Review</h3>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {result.score} correct · {result.total - result.score} incorrect
                </span>
              </div>

              {exam.questions.map((q, idx) => {
                const a = result.answers.find((ans) => ans.questionId === q.id)
                const isCorrect = a?.isCorrect ?? false

                return (
                  <div
                    key={q.id}
                    className={`review-question review-question--${isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <div className="review-question__header">
                      <span className="review-question__num">{idx + 1}</span>
                      <p className="review-question__text">{q.question}</p>
                      <span className={`review-question__icon review-question__icon--${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      </span>
                    </div>

                    <div className="review-question__answers">
                      {/* Your answer */}
                      <div className="review-question__answer-row">
                        <span className="review-question__answer-row-label">Your answer:</span>
                        <span className={`review-question__answer-row-value review-question__answer-row-value--${isCorrect ? 'correct' : 'incorrect'}`}>
                          {formatAnswer(q, a?.answer ?? '')}
                        </span>
                      </div>

                      {/* Correct answer (only if wrong) */}
                      {!isCorrect && (
                        <div className="review-question__answer-row">
                          <span className="review-question__answer-row-label">Correct answer:</span>
                          <span className="review-question__answer-row-value review-question__answer-row-value--correct">
                            {formatAnswer(q, q.correctAnswer)}
                          </span>
                        </div>
                      )}

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="review-question__explanation">
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function formatAnswer(q: { type: string; options?: Array<{ id: string; text: string }> }, answer: string): string {
  if (!answer) return '(no answer)'
  if (q.type === 'multiple-choice' || q.type === 'dropdown') {
    return q.options?.find((o) => o.id === answer)?.text ?? answer
  }
  if (q.type === 'multiselect') {
    const ids = answer.split(',').filter(Boolean)
    return ids.map((id) => q.options?.find((o) => o.id === id)?.text ?? id).join(', ')
  }
  if (q.type === 'sorting') {
    const ids = answer.split(',').filter(Boolean)
    return ids.map((id, i) => `${i + 1}. ${q.options?.find((o) => o.id === id)?.text ?? id}`).join(' → ')
  }
  return answer
}
