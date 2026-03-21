'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock } from 'lucide-react'
import { formatTime } from '@/lib/exams'

interface ExamTimerProps {
  durationSeconds: number
  onTimeUp: () => void
  onTick?: (remaining: number) => void
}

export default function ExamTimer({ durationSeconds, onTimeUp, onTick }: ExamTimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const calledUp = useRef(false)

  useEffect(() => {
    if (remaining <= 0) {
      if (!calledUp.current) {
        calledUp.current = true
        onTimeUp()
      }
      return
    }
    const t = setTimeout(() => {
      const next = remaining - 1
      setRemaining(next)
      onTick?.(next)
    }, 1000)
    return () => clearTimeout(t)
  }, [remaining, onTimeUp, onTick])

  const isWarning = remaining <= 300 && remaining > 60   // < 5 min
  const isCritical = remaining <= 60                      // < 1 min

  const cls = [
    'exam-timer',
    isWarning ? 'exam-timer--warning' : '',
    isCritical ? 'exam-timer--critical' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} aria-live="polite" aria-label={`${formatTime(remaining)} remaining`}>
      <Clock size={14} />
      <span>{formatTime(remaining)}</span>
    </div>
  )
}
