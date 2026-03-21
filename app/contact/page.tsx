'use client'

import { useState } from 'react'
import { useToast } from '@/context/ToastContext'
import PageTransition from '@/components/ui/PageTransition'
import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'

export default function ContactPage() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required.'
    if (!form.message.trim() || form.message.length < 10) errs.message = 'Message must be at least 10 characters.'

    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    setForm({ name: '', email: '', subject: '', message: '' })
    showToast('Message sent! We\'ll get back to you soon.', 'success')
  }

  return (
    <PageTransition>
      <div className="page">
        <div className="container">
          <div className="page__header" style={{ textAlign: 'center' }}>
            <h1>Get in Touch</h1>
            <p>Have a question or feedback? We'd love to hear from you.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', alignItems: 'start', maxWidth: 900, margin: '0 auto' }}>
            {/* Info */}
            <div>
              <div className="card" style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Contact Information</h3>
                {[
                  { icon: Mail, label: 'Email', value: 'hello@learnhub.com' },
                  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
                  { icon: MessageSquare, label: 'Live Chat', value: 'Available 9am – 5pm PST' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '0.5rem', background: '#e0e7ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#6366f1', flexShrink: 0,
                    }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.125rem' }}>{label}</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <form className="form" onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form__group">
                    <label className="form__label">Name</label>
                    <input className={`input ${errors.name ? 'input--error' : ''}`} placeholder="Your name" value={form.name} onChange={(e) => update('name', e.target.value)} />
                    {errors.name && <span className="form__error">{errors.name}</span>}
                  </div>
                  <div className="form__group">
                    <label className="form__label">Email</label>
                    <input className={`input ${errors.email ? 'input--error' : ''}`} type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
                    {errors.email && <span className="form__error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form__group">
                  <label className="form__label">Subject (optional)</label>
                  <input className="input" placeholder="What's this about?" value={form.subject} onChange={(e) => update('subject', e.target.value)} />
                </div>

                <div className="form__group">
                  <label className="form__label">Message</label>
                  <textarea className={`input ${errors.message ? 'input--error' : ''}`} rows={5} placeholder="Write your message here..." value={form.message} onChange={(e) => update('message', e.target.value)} />
                  {errors.message && <span className="form__error">{errors.message}</span>}
                </div>

                <button type="submit" className={`btn btn--primary btn--full btn--lg ${sending ? 'btn--loading' : ''}`} disabled={sending}>
                  {sending ? <><span className="btn__spinner" /> Sending...</> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
