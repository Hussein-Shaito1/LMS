import Link from 'next/link'
import { Award, BookOpen, Heart, Users } from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 60%)',
        padding: '5rem 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <span style={{
            display: 'inline-block', background: '#e0e7ff', color: '#6366f1',
            borderRadius: '9999px', padding: '0.25rem 1rem', fontSize: '0.875rem',
            fontWeight: 600, marginBottom: '1rem',
          }}>
            Our Mission
          </span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Learning Should Be <span style={{ color: '#6366f1' }}>Accessible to All</span>
          </h1>
          <p style={{ fontSize: '1.125rem', maxWidth: 620, margin: '0 auto 2rem', color: '#475569' }}>
            LearnHub was built to make high-quality tech education free and accessible to anyone, anywhere in the world.
          </p>
          <Link href="/register" className="btn btn--primary btn--lg">
            Join LearnHub Free
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2>What We Stand For</h2>
            <p>Our platform is guided by these core values.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {[
              { icon: BookOpen, title: 'Quality Content', desc: 'Every course is carefully curated by industry professionals to ensure the highest educational standards.' },
              { icon: Users, title: 'Community First', desc: 'We believe in the power of learning together, tracking progress, and growing alongside a community.' },
              { icon: Heart, title: 'Student Focused', desc: 'Everything we build is designed with the student\'s success and experience in mind.' },
              { icon: Award, title: 'Real Results', desc: 'Our students build real projects and gain skills they can immediately apply in their careers.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card card--hover" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', background: '#e0e7ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem', color: '#6366f1',
                }}>
                  <Icon size={26} />
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>
                <p style={{ fontSize: '0.875rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#0f172a', color: 'white', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { value: '10+', label: 'Expert Courses' },
              { value: '50K+', label: 'Students Enrolled' },
              { value: '4.8/5', label: 'Average Rating' },
              { value: '6', label: 'Subject Areas' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#818cf8', marginBottom: '0.5rem' }}>{value}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem' }}>Ready to Start Learning?</h2>
          <p style={{ marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            Join thousands of students who are already building their skills with LearnHub.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn--primary btn--lg">Get Started Free</Link>
            <Link href="/" className="btn btn--secondary btn--lg">Browse Courses</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
