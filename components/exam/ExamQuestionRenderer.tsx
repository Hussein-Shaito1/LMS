'use client'

import { useState } from 'react'
import { Reorder } from 'framer-motion'
import { CheckCircle, GripVertical, XCircle } from 'lucide-react'
import type { Question, QuestionOption } from '@/types'
import { scoreAnswer } from '@/lib/exams'

interface Props {
  question: Question
  index: number
  value: string
  onChange: (v: string) => void
  submitted: boolean
}

export default function ExamQuestionRenderer({ question, index, value, onChange, submitted }: Props) {
  const isCorrect = submitted ? scoreAnswer(question, value) : false
  const numCls = submitted
    ? isCorrect ? 'exam-question__num exam-question__num--correct' : 'exam-question__num exam-question__num--incorrect'
    : 'exam-question__num'

  const cardCls = [
    'exam-question',
    value ? 'exam-question--answered' : '',
    submitted && isCorrect ? 'exam-question--correct' : '',
    submitted && !isCorrect && value ? 'exam-question--incorrect' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardCls} id={`q-${index}`}>
      <div className="exam-question__header">
        <span className={numCls}>Q{index}</span>
        <p className="exam-question__text">{question.question}</p>
        {submitted && value && (
          <span className={`exam-question__status exam-question__status--${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
          </span>
        )}
      </div>

      {question.type === 'multiple-choice' && (
        <MCOptions
          options={question.options ?? []}
          value={value}
          onChange={onChange}
          submitted={submitted}
          correctAnswer={question.correctAnswer}
        />
      )}

      {question.type === 'multiselect' && (
        <MSOptions
          options={question.options ?? []}
          value={value}
          onChange={onChange}
          submitted={submitted}
          correctAnswer={question.correctAnswer}
        />
      )}

      {question.type === 'dropdown' && (
        <DDSelect
          options={question.options ?? []}
          value={value}
          onChange={onChange}
          submitted={submitted}
          correctAnswer={question.correctAnswer}
        />
      )}

      {question.type === 'input-text' && (
        <InputText
          value={value}
          onChange={onChange}
          submitted={submitted}
          isCorrect={isCorrect}
        />
      )}

      {question.type === 'sorting' && (
        <SortQuestion
          options={question.options ?? []}
          value={value}
          onChange={onChange}
          submitted={submitted}
          correctAnswer={question.correctAnswer}
        />
      )}

      {question.type === 'multiselect' && !submitted && (
        <p className="exam-answer-hint">Select all that apply</p>
      )}
    </div>
  )
}

// ── Multiple Choice ──────────────────────────────────────────────────────────

function MCOptions({ options, value, onChange, submitted, correctAnswer }: {
  options: QuestionOption[]; value: string; onChange: (v: string) => void
  submitted: boolean; correctAnswer: string
}) {
  return (
    <div className="mc-options">
      {options.map((opt) => {
        let cls = 'mc-option'
        if (submitted) {
          if (opt.id === correctAnswer) cls += ' mc-option--correct'
          else if (opt.id === value && opt.id !== correctAnswer) cls += ' mc-option--incorrect'
        } else if (opt.id === value) {
          cls += ' mc-option--selected'
        }
        return (
          <button
            key={opt.id}
            className={cls}
            onClick={() => !submitted && onChange(opt.id)}
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

// ── Multiselect ──────────────────────────────────────────────────────────────

function MSOptions({ options, value, onChange, submitted, correctAnswer }: {
  options: QuestionOption[]; value: string; onChange: (v: string) => void
  submitted: boolean; correctAnswer: string
}) {
  const selected = new Set(value.split(',').filter(Boolean))
  const correct = new Set(correctAnswer.split(',').filter(Boolean))

  function toggle(id: string) {
    if (submitted) return
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    onChange([...next].join(','))
  }

  return (
    <div className="ms-options">
      {options.map((opt) => {
        let cls = 'ms-option'
        if (submitted) {
          if (correct.has(opt.id) && selected.has(opt.id))  cls += ' ms-option--correct'
          else if (!correct.has(opt.id) && selected.has(opt.id)) cls += ' ms-option--incorrect'
          else if (correct.has(opt.id) && !selected.has(opt.id)) cls += ' ms-option--missed'
        } else if (selected.has(opt.id)) {
          cls += ' ms-option--selected'
        }
        return (
          <button key={opt.id} className={cls} onClick={() => toggle(opt.id)} disabled={submitted}>
            <span className="ms-option__checkbox">
              {(selected.has(opt.id) || (submitted && correct.has(opt.id))) && (
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

// ── Dropdown ─────────────────────────────────────────────────────────────────

function DDSelect({ options, value, onChange, submitted, correctAnswer }: {
  options: QuestionOption[]; value: string; onChange: (v: string) => void
  submitted: boolean; correctAnswer: string
}) {
  const isCorrect = submitted && value === correctAnswer
  const isWrong = submitted && value && value !== correctAnswer
  const cls = `dropdown-answer${isCorrect ? ' dropdown-answer--correct' : isWrong ? ' dropdown-answer--incorrect' : ''}`

  return (
    <div className={cls}>
      <div className="dropdown-answer__wrapper">
        <select
          className="dropdown-answer__select"
          value={value}
          onChange={(e) => !submitted && onChange(e.target.value)}
          disabled={submitted}
        >
          <option value="">-- Select an answer --</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.text}</option>
          ))}
        </select>
      </div>
      {submitted && value !== correctAnswer && (
        <p className="dropdown-answer__hint">
          Correct: <strong>{options.find((o) => o.id === correctAnswer)?.text}</strong>
        </p>
      )}
    </div>
  )
}

// ── Input Text ────────────────────────────────────────────────────────────────

function InputText({ value, onChange, submitted, isCorrect }: {
  value: string; onChange: (v: string) => void; submitted: boolean; isCorrect: boolean
}) {
  const cls = `input-answer${submitted ? (isCorrect ? ' input-answer--correct' : ' input-answer--incorrect') : ''}`
  return (
    <div className={cls}>
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

// ── Sorting ───────────────────────────────────────────────────────────────────

function SortQuestion({ options, value, onChange, submitted, correctAnswer }: {
  options: QuestionOption[]; value: string; onChange: (v: string) => void
  submitted: boolean; correctAnswer: string
}) {
  const [items, setItems] = useState<QuestionOption[]>(() => {
    if (value) {
      const ordered = value.split(',')
        .map((id) => options.find((o) => o.id === id))
        .filter(Boolean) as QuestionOption[]
      if (ordered.length === options.length) return ordered
    }
    return [...options].sort(() => Math.random() - 0.5)
  })

  const correctOrder = correctAnswer.split(',')

  function handleReorder(next: QuestionOption[]) {
    setItems(next)
    onChange(next.map((i) => i.id).join(','))
  }

  return (
    <div className="sort-question">
      <p className="sort-question__hint">Drag to reorder into the correct sequence</p>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={submitted ? () => {} : handleReorder}
        className="sort-list"
      >
        {items.map((item, idx) => {
          const isAtRight = submitted && correctOrder[idx] === item.id
          const isAtWrong = submitted && correctOrder[idx] !== item.id
          return (
            <Reorder.Item
              key={item.id}
              value={item}
              className={`sort-item ${isAtRight ? 'sort-item--correct' : ''} ${isAtWrong ? 'sort-item--incorrect' : ''} ${submitted ? 'sort-item--submitted' : ''}`}
              whileDrag={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 10 }}
            >
              <GripVertical size={16} className="sort-item__grip" />
              <span className="sort-item__pos">{idx + 1}</span>
              <span className="sort-item__text">{item.text}</span>
              {submitted && (
                isAtRight
                  ? <CheckCircle size={16} className="sort-item__icon sort-item__icon--ok" />
                  : <XCircle size={16} className="sort-item__icon sort-item__icon--bad" />
              )}
            </Reorder.Item>
          )
        })}
      </Reorder.Group>
    </div>
  )
}
