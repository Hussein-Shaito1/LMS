'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import PageTransition from '@/components/ui/PageTransition'
import { ArrowLeft, Camera, Mail, User } from 'lucide-react'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, loading, updateProfile } = useAuth()
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (user) {
      setName(user.name)
      setBio(user.bio || '')
      setAvatar(user.avatar)
    }
  }, [user, loading, router])

  if (loading || !user) return <div className="loading-page"><div className="spinner spinner--lg" /></div>

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!name.trim() || name.trim().length < 2) errs.name = 'Name must be at least 2 characters.'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true)
    await new Promise((r) => setTimeout(r, 600)) // Simulate async
    updateProfile({ name: name.trim(), bio: bio.trim(), avatar })
    setSaving(false)
    showToast('Profile updated successfully!', 'success')
    router.push('/profile')
  }

  const avatarOptions = [
    `https://i.pravatar.cc/150?img=68`,
    `https://i.pravatar.cc/150?img=45`,
    `https://i.pravatar.cc/150?img=32`,
    `https://i.pravatar.cc/150?img=47`,
    `https://i.pravatar.cc/150?img=12`,
    `https://i.pravatar.cc/150?img=25`,
  ]

  return (
    <PageTransition>
      <div className="page">
        <div className="container" style={{ maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Link href="/profile" className="btn btn--ghost btn--icon">
              <ArrowLeft size={20} />
            </Link>
            <h1 style={{ margin: 0 }}>Edit Profile</h1>
          </div>

          <div className="card">
            <form className="form" onSubmit={handleSubmit}>
              {/* Avatar */}
              <div className="form__group" style={{ alignItems: 'center' }}>
                <label className="form__label">Profile Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <Image
                    src={avatar}
                    alt="Current avatar"
                    width={80}
                    height={80}
                    style={{ borderRadius: '50%', objectFit: 'cover', border: '3px solid #e0e7ff' }}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {avatarOptions.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setAvatar(url)}
                        style={{
                          padding: 0, borderRadius: '50%', cursor: 'pointer',
                          border: avatar === url ? '3px solid #6366f1' : '3px solid transparent',
                          transition: 'border-color 0.2s',
                          background: 'none',
                        }}
                      >
                        <Image
                          src={url}
                          alt="Avatar option"
                          width={44}
                          height={44}
                          style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="form__group">
                <label className="form__label" htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-wrapper__icon" size={18} />
                  <input
                    id="name"
                    type="text"
                    className={`input input--with-icon ${errors.name ? 'input--error' : ''}`}
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors({}) }}
                    placeholder="Your full name"
                  />
                </div>
                {errors.name && <span className="form__error">{errors.name}</span>}
              </div>

              {/* Email (read-only) */}
              <div className="form__group">
                <label className="form__label">Email</label>
                <div className="input-wrapper">
                  <Mail className="input-wrapper__icon" size={18} />
                  <input
                    type="email"
                    className="input input--with-icon"
                    value={user.email}
                    readOnly
                    style={{ background: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed' }}
                  />
                </div>
                <span className="form__hint">Email cannot be changed.</span>
              </div>

              {/* Bio */}
              <div className="form__group">
                <label className="form__label" htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  className="input"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  maxLength={200}
                />
                <span className="form__hint">{200 - bio.length} characters remaining</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  className={`btn btn--primary btn--lg ${saving ? 'btn--loading' : ''}`}
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  {saving ? <><span className="btn__spinner" /> Saving...</> : 'Save Changes'}
                </button>
                <Link href="/profile" className="btn btn--secondary btn--lg">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
