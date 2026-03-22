'use client'

import { useEffect, useRef, useState } from 'react'

interface ProgressBarProps {
  percent: number
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function ProgressBar({ percent, label, showLabel = true, size = 'md' }: ProgressBarProps) {
  const [animated, setAnimated] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(percent), 100)
        }
      },
      { threshold: 0.3 }
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [percent])

  const sizeClass = size === 'sm' ? 'progress__bar--sm' : size === 'lg' ? 'progress__bar--lg' : ''

  return (
    <div ref={ref}>
      {showLabel && (
        <div className="progress__label">
          <span>{label || 'Progress'}</span>
          <span className="progress__label-value">{percent}%</span>
        </div>
      )}
      <div className={`progress__bar${sizeClass ? ` ${sizeClass}` : ''}`}>
        <div
          className="progress__fill"
          style={{ width: `${animated}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
