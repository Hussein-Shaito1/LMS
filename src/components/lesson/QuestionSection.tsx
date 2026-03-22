'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { CheckCircle, XCircle, HelpCircle, ChevronDown, GripVertical } from 'lucide-react'
import type { Question, QuestionOption } from '@/types'
import { useLMS } from '@/context/LMSContext'
import { useToast } from '@/context/ToastContext'

interface Props {
  courseId: string
  lessonId: string
  questions: Question[]
}

export default function QuestionSection({ courseId, lessonId, questions }: Props) {
  const { getAnswer, markLesson, isLessonCompleted } = useLMS()
  const { showToast } = useToast()

  function handleAnswerSubmit() {
    if (isLessonCompleted(courseId, lessonId)) return
    const allAnswered = questions.every((q) => getAnswer(courseId, lessonId, q.id))
    if (allAnswered) {
      markLesson(courseId, lessonId)
      showToast('All questions answered! Lesson marked as complete!', 'success')
    }
  }

  return (
    <div className="question-section">
      <h2 className="question-section__title">
        <HelpCircle size={20} />
        Knowledge Check
      </h2>
      <div className="question-section__list">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx + 1}
            courseId={courseId}
            lessonId={lessonId}
            onAnswerSubmit={handleAnswerSubmit}
          />
        ))}
      </div>
    </div>
  )
}

function QuestionCard({
  question,
  index,
  courseId,
  lessonId,
  onAnswerSubmit,
}: {
  question: Question
  index: number
  courseId: string
  lessonId: string
  onAnswerSubmit: () => void
}) {
  const { submitAnswer, getAnswer } = useLMS()
  const { showToast } = useToast()
  const existingAnswer = getAnswer(courseId, lessonId, question.id)

  const [selected, setSelected] = useState<string>(existingAnswer?.answer ?? '')
  const [submitted, setSubmitted] = useState(!!existingAnswer)
  const [showExplanation, setShowExplanation] = useState(false)

  // For multiselect: track selected set
  const [multiSelected, setMultiSelected] = useState<Set<string>>(() => {
    if (existingAnswer?.answer && question.type === 'multiselect') {
      return new Set(existingAnswer.answer.split(',').filter(Boolean))
    }
    return new Set()
  })

  // For sorting: track current order of options
  const [sortItems, setSortItems] = useState<QuestionOption[]>(() => {
    if (question.type === 'sorting' && question.options) {
      if (existingAnswer?.answer) {
        const order = existingAnswer.answer.split(',')
        return order
          .map((id) => question.options!.find((o) => o.id === id))
          .filter(Boolean) as QuestionOption[]
      }
      // Shuffle for initial display
      return [...question.options].sort(() => Math.random() - 0.5)
    }
    return question.options ?? []
  })

  const isCorrect = existingAnswer?.isCorrect ?? false

  function handleSubmit() {
    let answer = ''
    let correct = false

    if (question.type === 'multiselect') {
      const sorted = [...multiSelected].sort().join(',')
      const correctSorted = question.correctAnswer.split(',').sort().join(',')
      answer = sorted
      correct = sorted === correctSorted
    } else if (question.type === 'sorting') {
      answer = sortItems.map((o) => o.id).join(',')
      correct = answer === question.correctAnswer
    } else if (question.type === 'input-text') {
      answer = selected.trim()
      correct = answer.toLowerCase() === question.correctAnswer.toLowerCase()
    } else {
      answer = selected
      correct = answer === question.correctAnswer
    }

    if (!answer) return

    submitAnswer(courseId, lessonId, question.id, answer, correct)
    setSubmitted(true)
    onAnswerSubmit()

    if (correct) {
      showToast('Correct! Well done!', 'success')
    } else {
      showToast('Not quite — check the explanation below.', 'error')
    }
  }

  function handleReset() {
    setSelected('')
    setMultiSelected(new Set())
    if (question.type === 'sorting' && question.options) {
      setSortItems([...question.options].sort(() => Math.random() - 0.5))
    }
    setSubmitted(false)
    setShowExplanation(false)
  }

  const canSubmit = useMemo(() => {
    if (question.type === 'multiselect') return multiSelected.size > 0
    if (question.type === 'sorting') return true
    return selected.trim().length > 0
  }, [question.type, multiSelected, selected])

  return (
    <motion.div
      className={`question-card ${submitted ? (isCorrect ? 'question-card--correct' : 'question-card--incorrect') : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="question-card__header">
        <span className="question-card__number">Q{index}</span>
        <p className="question-card__text">{question.question}</p>
        {submitted && (
          <span className={`question-card__status ${isCorrect ? 'question-card__status--correct' : 'question-card__status--incorrect'}`}>
            {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
          </span>
        )}
      </div>

      <div className="question-card__body">
        {question.type === 'multiple-choice' && (
          <MultipleChoice
            options={question.options ?? []}
            selected={selected}
            onSelect={setSelected}
            submitted={submitted}
            correctAnswer={question.correctAnswer}
          />
        )}

        {question.type === 'input-text' && (
          <InputText
            value={selected}
            onChange={setSelected}
            submitted={submitted}
            isCorrect={isCorrect}
          />
        )}

        {question.type === 'dropdown' && (
          <DropdownSelect
            options={question.options ?? []}
            selected={selected}
            onSelect={setSelected}
            submitted={submitted}
            correctAnswer={question.correctAnswer}
          />
        )}

        {question.type === 'multiselect' && (
          <MultiSelect
            options={question.options ?? []}
            selected={multiSelected}
            onToggle={(id) => {
              if (submitted) return
              setMultiSelected((prev) => {
                const next = new Set(prev)
                if (next.has(id)) next.delete(id)
                else next.add(id)
                return next
              })
            }}
            submitted={submitted}
            correctAnswer={question.correctAnswer}
          />
        )}

        {question.type === 'sorting' && (
          <SortingQuestion
            items={sortItems}
            onReorder={setSortItems}
            submitted={submitted}
            correctAnswer={question.correctAnswer}
          />
        )}
      </div>

      {!submitted && (
        <div className="question-card__actions">
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Submit Answer
          </button>
        </div>
      )}

      {submitted && (
        <div className="question-card__footer">
          {question.explanation && (
            <button
              className="question-card__explanation-toggle"
              onClick={() => setShowExplanation((v) => !v)}
            >
              <ChevronDown
                size={16}
                className={`explanation-toggle__icon${showExplanation ? ' explanation-toggle__icon--open' : ''}`}
              />
              {showExplanation ? 'Hide' : 'Show'} explanation
            </button>
          )}
          <button className="btn btn--secondary btn--sm" onClick={handleReset}>
            Try Again
          </button>
        </div>
      )}

      <AnimatePresence>
        {submitted && showExplanation && question.explanation && (
          <motion.div
            className="question-card__explanation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p>{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ----- Sub-components -----

function MultipleChoice({
  options,
  selected,
  onSelect,
  submitted,
  correctAnswer,
}: {
  options: QuestionOption[]
  selected: string
  onSelect: (id: string) => void
  submitted: boolean
  correctAnswer: string
}) {
  return (
    <div className="mc-options">
      {options.map((opt) => {
        let cls = 'mc-option'
        if (submitted) {
          if (opt.id === correctAnswer) cls += ' mc-option--correct'
          else if (opt.id === selected) cls += ' mc-option--incorrect'
        } else if (opt.id === selected) {
          cls += ' mc-option--selected'
        }
        return (
          <button
            key={opt.id}
            className={cls}
            onClick={() => !submitted && onSelect(opt.id)}
            disabled={submitted}
          >
            <span className="mc-option__letter">{opt.id.toUpperCase()}</span>
            {opt.text}
          </button>
        )
      })}
    </div>
  )
}

function MultiSelect({
  options,
  selected,
  onToggle,
  submitted,
  correctAnswer,
}: {
  options: QuestionOption[]
  selected: Set<string>
  onToggle: (id: string) => void
  submitted: boolean
  correctAnswer: string
}) {
  const correctSet = new Set(correctAnswer.split(','))

  return (
    <div className="ms-options">
      <p className="ms-options__hint">Select all that apply</p>
      {options.map((opt) => {
        let cls = 'ms-option'
        if (submitted) {
          if (correctSet.has(opt.id) && selected.has(opt.id)) cls += ' ms-option--correct'
          else if (!correctSet.has(opt.id) && selected.has(opt.id)) cls += ' ms-option--incorrect'
          else if (correctSet.has(opt.id) && !selected.has(opt.id)) cls += ' ms-option--missed'
        } else if (selected.has(opt.id)) {
          cls += ' ms-option--selected'
        }

        return (
          <button
            key={opt.id}
            className={cls}
            onClick={() => onToggle(opt.id)}
            disabled={submitted}
          >
            <span className="ms-option__checkbox">
              {(selected.has(opt.id) || (submitted && correctSet.has(opt.id))) && (
                <CheckCircle size={14} />
              )}
            </span>
            {opt.text}
          </button>
        )
      })}
    </div>
  )
}

function SortingQuestion({
  items,
  onReorder,
  submitted,
  correctAnswer,
}: {
  items: QuestionOption[]
  onReorder: (items: QuestionOption[]) => void
  submitted: boolean
  correctAnswer: string
}) {
  const correctOrder = correctAnswer.split(',')

  return (
    <div className="sort-question">
      <p className="sort-question__hint">Drag to reorder items into the correct sequence</p>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={submitted ? () => {} : onReorder}
        className="sort-list"
      >
        {items.map((item, idx) => {
          const isAtCorrectPos = submitted && correctOrder[idx] === item.id
          const isWrongPos = submitted && correctOrder[idx] !== item.id
          return (
            <Reorder.Item
              key={item.id}
              value={item}
              className={`sort-item ${isAtCorrectPos ? 'sort-item--correct' : ''} ${isWrongPos ? 'sort-item--incorrect' : ''} ${submitted ? 'sort-item--submitted' : ''}`}
              whileDrag={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 10 }}
            >
              <GripVertical size={16} className="sort-item__grip" />
              <span className="sort-item__pos">{idx + 1}</span>
              <span className="sort-item__text">{item.text}</span>
              {submitted && (
                isAtCorrectPos
                  ? <CheckCircle size={16} className="sort-item__icon sort-item__icon--ok" />
                  : <XCircle size={16} className="sort-item__icon sort-item__icon--bad" />
              )}
            </Reorder.Item>
          )
        })}
      </Reorder.Group>
      {submitted && (
        <div className="sort-question__answer">
          <p>Correct order:</p>
          <ol>
            {correctOrder.map((id) => (
              <li key={id}>{items.find((o) => o.id === id)?.text ?? id}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

function InputText({
  value,
  onChange,
  submitted,
  isCorrect,
}: {
  value: string
  onChange: (val: string) => void
  submitted: boolean
  isCorrect: boolean
}) {
  return (
    <div className={`input-answer ${submitted ? (isCorrect ? 'input-answer--correct' : 'input-answer--incorrect') : ''}`}>
      <input
        type="text"
        className="input-answer__field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitted}
        placeholder="Type your answer..."
      />
    </div>
  )
}

function DropdownSelect({
  options,
  selected,
  onSelect,
  submitted,
  correctAnswer,
}: {
  options: QuestionOption[]
  selected: string
  onSelect: (id: string) => void
  submitted: boolean
  correctAnswer: string
}) {
  return (
    <div className={`dropdown-answer ${submitted ? (selected === correctAnswer ? 'dropdown-answer--correct' : 'dropdown-answer--incorrect') : ''}`}>
      <div className="dropdown-answer__wrapper">
        <select
          className="dropdown-answer__select"
          value={selected}
          onChange={(e) => !submitted && onSelect(e.target.value)}
          disabled={submitted}
        >
          <option value="">-- Select an answer --</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.text}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="dropdown-answer__icon" />
      </div>
      {submitted && (
        <p className="dropdown-answer__hint">
          Correct answer: <strong>{options.find((o) => o.id === correctAnswer)?.text}</strong>
        </p>
      )}
    </div>
  )
}
