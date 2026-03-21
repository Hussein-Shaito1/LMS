import Link from 'next/link'
import { BookOpen, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', textAlign: 'center', padding: '2rem',
    }}>
      <div style={{
        fontSize: '6rem', fontWeight: 800, color: '#e0e7ff',
        lineHeight: 1, marginBottom: '1rem',
      }}>
        404
      </div>
      <h1 style={{ marginBottom: '0.75rem' }}>Page Not Found</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: 400 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
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
