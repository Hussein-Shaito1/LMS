'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: typeof errors = {}

    if (!email.trim()) newErrors.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email.'
    if (!password) newErrors.password = 'Password is required.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      showToast('Welcome back! You are now logged in.', 'success')
      router.push('/')
    } else {
      showToast(result.error || 'Login failed. Please try again.', 'error')
      setErrors({ email: result.error })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__header">
          <div className="auth-page__header-logo">
            <BookOpen size={24} />
            LearnHub
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to continue your learning journey.</p>
        </div>

        <div className="demo-credentials">
          <strong>Demo:</strong> alex@example.com / password123
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__group">
            <label className="form__label" htmlFor="email">Email</label>
            <div className="form__input-wrap">
              <div className="input-wrapper">
                <Mail className="input-wrapper__icon" size={18} />
                <input
                  id="email"
                  type="email"
                  className={`input input--with-icon${errors.email ? ' input--error' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({}) }}
                  autoComplete="email"
                />
              </div>
              <span className="form__error">{errors.email}</span>
            </div>
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="password">Password</label>
            <div className="form__input-wrap">
              <div className="input-wrapper">
                <Lock className="input-wrapper__icon" size={18} />
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className={`input input--with-icon input--with-action${errors.password ? ' input--error' : ''}`}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({}) }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-wrapper__action"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span className="form__error">{errors.password}</span>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn--primary btn--full btn--lg${loading ? ' btn--loading' : ''}`}
            disabled={loading}
          >
            {loading ? <><span className="btn__spinner" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="auth-page__footer">
          Don&apos;t have an account?{' '}
          <Link href="/register">Create one free</Link>
        </div>
      </div>
    </div>
  )
}
