import { Star } from 'lucide-react'

export default function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="stars" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor"
        />
      ))}
      <span style={{ fontSize: '0.875rem', fontWeight: 600, marginLeft: '0.25rem' }}>
        {rating}
      </span>
    </div>
  )
}
