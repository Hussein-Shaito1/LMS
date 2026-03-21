import Link from 'next/link'
import { Award, BookOpen, Heart, Users } from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <span className="about-hero__eyebrow">Our Mission</span>
          <h1>
            Learning Should Be <span>Accessible to All</span>
          </h1>
          <p>
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
          <div className="about-values-grid">
            {[
              { icon: BookOpen, title: 'Quality Content', desc: 'Every course is carefully curated by industry professionals to ensure the highest educational standards.' },
              { icon: Users, title: 'Community First', desc: 'We believe in the power of learning together, tracking progress, and growing alongside a community.' },
              { icon: Heart, title: 'Student Focused', desc: 'Everything we build is designed with the student\'s success and experience in mind.' },
              { icon: Award, title: 'Real Results', desc: 'Our students build real projects and gain skills they can immediately apply in their careers.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card card--hover feature-card">
                <div className="feature-card__icon">
                  <Icon size={26} />
                </div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-dark">
        <div className="container">
          <div className="stats-dark__grid">
            {[
              { value: '10+', label: 'Expert Courses' },
              { value: '50K+', label: 'Students Enrolled' },
              { value: '4.8/5', label: 'Average Rating' },
              { value: '6', label: 'Subject Areas' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="stats-dark__value">{value}</div>
                <div className="stats-dark__label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--center">
        <div className="container">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students who are already building their skills with LearnHub.</p>
          <div className="cta-section__actions">
            <Link href="/register" className="btn btn--primary btn--lg">Get Started Free</Link>
            <Link href="/" className="btn btn--secondary btn--lg">Browse Courses</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
