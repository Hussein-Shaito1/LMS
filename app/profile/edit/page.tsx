'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import PageTransition from '@/components/ui/PageTransition'
import { ArrowLeft, Mail, User } from 'lucide-react'

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
    await new Promise((r) => setTimeout(r, 600))
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
        <div className="container container--sm">
          <div className="edit-header">
            <Link href="/profile" className="btn btn--ghost btn--icon">
              <ArrowLeft size={20} />
            </Link>
            <h1>Edit Profile</h1>
          </div>

          <div className="card">
            <form className="form" onSubmit={handleSubmit}>
              {/* Avatar */}
              <div className="form__group form__group--center">
                <label className="form__label">Profile Photo</label>
                <div className="avatar-picker">
                  <Image
                    src={avatar}
                    alt="Current avatar"
                    width={80}
                    height={80}
                    className="avatar-current"
                  />
                  <div className="avatar-options">
                    {avatarOptions.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setAvatar(url)}
                        className={`avatar-option${avatar === url ? ' avatar-option--active' : ''}`}
                      >
                        <Image
                          src={url}
                          alt="Avatar option"
                          width={44}
                          height={44}
                          className="avatar-option__img"
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
                    className="input input--with-icon input--readonly"
                    value={user.email}
                    readOnly
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

              <div className="form__actions">
                <button
                  type="submit"
                  className={`btn btn--primary btn--lg ${saving ? 'btn--loading' : ''}`}
                  disabled={saving}
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
