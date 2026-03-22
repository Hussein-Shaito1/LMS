'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getExamById, scoreAnswer } from '@/lib/exams'
import { useAuth } from '@/context/AuthContext'
import { useLMS } from '@/context/LMSContext'
import { useToast } from '@/context/ToastContext'
import PageTransition from '@/components/ui/PageTransition'
import ExamTimer from '@/components/exam/ExamTimer'
import ExamQuestionRenderer from '@/components/exam/ExamQuestionRenderer'
import type { ExamAnswer, ExamResult } from '@/types'
import { ChevronLeft, Send } from 'lucide-react'

export default function ExamStartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const exam = getExamById(id)
  if (!exam) notFound()

  const router = useRouter()
  const { user, loading } = useAuth()
  const { saveExamResult } = useLMS()
  const { showToast } = useToast()

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const startTimeRef = useRef<number>(Date.now())
  const submittedRef = useRef(false)

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  // Warn before leaving
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!submittedRef.current) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleSubmit = useCallback((autoSubmit = false) => {
    if (submittedRef.current) return
    submittedRef.current = true

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)

    const answersArray: ExamAnswer[] = exam.questions.map((q) => {
      const answer = answers[q.id] ?? ''
      return { questionId: q.id, answer, isCorrect: scoreAnswer(q, answer) }
    })

    const score = answersArray.filter((a) => a.isCorrect).length
    const total = exam.questions.length
    const percentage = Math.round((score / total) * 100)

    const result: ExamResult = {
      examId: exam.id,
      score,
      total,
      percentage,
      passed: percentage >= exam.passingScore,
      answers: answersArray,
      timeSpent,
      durationSeconds: exam.duration * 60,
      autoSubmitted: autoSubmit,
      completedAt: new Date().toISOString(),
    }

    saveExamResult(result)

    if (autoSubmit) {
      showToast('Time is up! Your exam has been submitted.', 'info')
    }

    setSubmitting(true)
    router.push(`/exam/${exam.id}/results`)
  }, [answers, exam, saveExamResult, showToast, router])

  const handleTimeUp = useCallback(() => {
    handleSubmit(true)
  }, [handleSubmit])

  function setAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function scrollToQuestion(idx: number) {
    document.getElementById(`q-${idx + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (loading || !user) {
    return <div className="loading-page"><div className="spinner spinner--lg" /></div>
  }

  const answeredCount = exam.questions.filter((q) => answers[q.id]).length
  const durationSec = exam.duration * 60

  return (
    <PageTransition>
      <div className="exam-active-page">
        {/* Sticky topbar */}
        <div className="exam-topbar">
          <div className="container exam-topbar__inner">
            <Link href={`/exam/${exam.id}`} className="exam-topbar__back">
              <ChevronLeft size={16} /> Exit
            </Link>
            <span className="exam-topbar__title">{exam.title}</span>
            <div className="exam-topbar__right">
              <span className="exam-progress-label">
                {answeredCount}/{exam.questions.length} answered
              </span>
              <ExamTimer
                durationSeconds={durationSec}
                onTimeUp={handleTimeUp}
              />
            </div>
          </div>
        </div>

        <div className="container exam-body">
          <div className="exam-layout">
            {/* Questions */}
            <div>
              {exam.questions.map((q, idx) => (
                <ExamQuestionRenderer
                  key={q.id}
                  question={q}
                  index={idx + 1}
                  value={answers[q.id] ?? ''}
                  onChange={(v) => setAnswer(q.id, v)}
                  submitted={false}
                />
              ))}
            </div>

            {/* Sidebar */}
            <div className="exam-sidebar">
              <div className="exam-nav-card">
                <p className="exam-nav-card__title">Questions</p>
                <div className="exam-nav-dots">
                  {exam.questions.map((q, idx) => (
                    <button
                      key={q.id}
                      className={[
                        'exam-nav-dot',
                        answers[q.id] ? 'exam-nav-dot--answered' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => scrollToQuestion(idx)}
                      title={`Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <p className="exam-answered-count">
                  <strong>{answeredCount}</strong> of {exam.questions.length} answered
                </p>
                <button
                  className={`btn btn--primary btn--full ${submitting ? 'btn--loading' : ''}`}
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                >
                  {submitting
                    ? <><span className="btn__spinner" /> Submitting...</>
                    : <><Send size={16} /> Submit Exam</>
                  }
                </button>
                {answeredCount < exam.questions.length && (
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', textAlign: 'center' }}>
                    {exam.questions.length - answeredCount} question{exam.questions.length - answeredCount !== 1 ? 's' : ''} unanswered
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile submit */}
          <div className="max-lg-only" style={{ marginTop: '1.5rem' }}>
            <button
              className={`btn btn--primary btn--full btn--lg ${submitting ? 'btn--loading' : ''}`}
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              {submitting
                ? <><span className="btn__spinner" /> Submitting...</>
                : <><Send size={16} /> Submit Exam ({answeredCount}/{exam.questions.length} answered)</>
              }
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
