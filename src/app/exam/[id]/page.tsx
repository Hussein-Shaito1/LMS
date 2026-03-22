'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getExamById } from '@/lib/exams'
import { getCourseById } from '@/lib/courses'
import { useLMS } from '@/context/LMSContext'
import { useAuth } from '@/context/AuthContext'
import PageTransition from '@/components/ui/PageTransition'
import { Award, BookOpen, CheckCircle, Clock, FileQuestion, RotateCcw, Target } from 'lucide-react'
import { formatTime } from '@/lib/exams'

export default function ExamIntroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const exam = getExamById(id)
  if (!exam) notFound()

  const { user } = useAuth()
  const { getExamResult } = useLMS()
  const result = getExamResult(exam.id)
  const course = exam.courseId ? getCourseById(exam.courseId) : undefined

  return (
    <PageTransition>
      {/* Hero */}
      <div className="exam-intro__hero">
        <div className="container">
          <div className="exam-intro__eyebrow">
            <FileQuestion size={12} />
            {course ? course.title : 'Standalone Exam'}
          </div>
          <h1 className="exam-intro__title">{exam.title}</h1>
          <p className="exam-intro__desc">{exam.description}</p>

          <div className="exam-meta">
            <div className="exam-meta-item">
              <Clock size={16} />
              <span><strong>{exam.duration}</strong> minutes</span>
            </div>
            <div className="exam-meta-item">
              <FileQuestion size={16} />
              <span><strong>{exam.questions.length}</strong> questions</span>
            </div>
            <div className="exam-meta-item">
              <Target size={16} />
              <span>Pass at <strong>{exam.passingScore}%</strong></span>
            </div>
            {course && (
              <div className="exam-meta-item">
                <BookOpen size={16} />
                <Link href={`/course/${course.id}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                  {course.title}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container page" style={{ paddingTop: '2.5rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Previous result */}
          {result && (
            <div className="exam-existing-result">
              <div className="exam-existing-result__header">
                <h4>Your Previous Result</h4>
                <span className={`badge ${result.passed ? 'badge--success' : 'badge--error'}`}>
                  {result.passed ? '✓ Passed' : '✗ Failed'}
                </span>
              </div>
              <div className="exam-existing-result__stats">
                <div className="exam-existing-result__stat">
                  <strong>{result.percentage}%</strong>
                  Score
                </div>
                <div className="exam-existing-result__stat">
                  <strong>{result.score}/{result.total}</strong>
                  Correct
                </div>
                <div className="exam-existing-result__stat">
                  <strong>{formatTime(result.timeSpent)}</strong>
                  Time spent
                </div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <Link href={`/exam/${exam.id}/results`} className="btn btn--secondary btn--sm">
                  View Results
                </Link>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="exam-instructions">
            <p className="exam-instructions__title">
              <CheckCircle size={16} /> Instructions
            </p>
            <p>{exam.instructions}</p>
          </div>

          {/* What to expect */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} /> What to Expect
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                `${exam.questions.length} questions across multiple formats (multiple choice, fill-in, drag & drop, and more)`,
                `${exam.duration}-minute countdown timer that auto-submits when time is up`,
                `Instant results with detailed answer review and explanations`,
                `Score of ${exam.passingScore}% or higher required to pass`,
              ].map((item) => (
                <div key={item} style={{ display: 'flex', gap: '0.625rem', fontSize: '0.9rem', color: '#475569' }}>
                  <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="exam-start-actions">
            {user ? (
              <>
                <Link href={`/exam/${exam.id}/start`} className="btn btn--primary btn--lg">
                  <FileQuestion size={18} />
                  {result ? 'Retake Exam' : 'Start Exam'}
                </Link>
                {result && (
                  <Link href={`/exam/${exam.id}/results`} className="btn btn--secondary btn--lg">
                    <RotateCcw size={16} /> View Last Results
                  </Link>
                )}
              </>
            ) : (
              <Link href="/login" className="btn btn--primary btn--lg">
                Log in to Take This Exam
              </Link>
            )}
            {course && (
              <Link href={`/course/${course.id}`} className="btn btn--ghost btn--lg">
                ← Back to Course
              </Link>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
