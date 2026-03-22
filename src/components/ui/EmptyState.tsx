import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export default function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon size={36} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn--primary">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
