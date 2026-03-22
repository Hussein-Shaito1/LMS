import Link from 'next/link'
import { BookOpen, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="not-found__actions">
        <Link href="/" className="btn btn--primary">
          <Home size={16} /> Go Home
        </Link>
        <Link href="/#courses" className="btn btn--secondary">
          <BookOpen size={16} /> Browse Courses
        </Link>
      </div>
    </div>
  )
}
