'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import PageTransition from '@/components/ui/PageTransition'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'

type FormValues = {
  name: string
  bio: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const avatarOptions = [
  'https://i.pravatar.cc/150?img=68',
  'https://i.pravatar.cc/150?img=45',
  'https://i.pravatar.cc/150?img=32',
  'https://i.pravatar.cc/150?img=47',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=25',
]

export default function EditProfilePage() {
  const router = useRouter()
  const { user, loading, updateProfile, changePassword } = useAuth()
  const { showToast } = useToast()

  const [avatar, setAvatar] = useState('')
  const [saving, setSaving] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', bio: '', currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (user) {
      setAvatar(user.avatar)
      reset({ name: user.name, bio: user.bio || '', currentPassword: '', newPassword: '', confirmPassword: '' })
    }
  }, [user, loading, router, reset])

  if (loading || !user) return <div className="loading-page"><div className="spinner spinner--lg" /></div>

  async function onSubmit(data: FormValues) {
    const isChangingPassword = data.newPassword.length > 0

    if (isChangingPassword) {
      if (!data.currentPassword) {
        setError('currentPassword', { message: 'Current password is required.' })
        return
      }
      const result = await changePassword(data.currentPassword, data.newPassword)
      if (!result.success) {
        setError('currentPassword', { message: result.error })
        return
      }
    }

    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    updateProfile({ name: data.name.trim(), bio: data.bio.trim(), avatar })
    setSaving(false)
    showToast('Profile updated successfully!', 'success')
    router.push('/profile')
  }

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
            <form className="form" onSubmit={handleSubmit(onSubmit)}>

              {/* Avatar */}
              <div className="form__group form__group--center">
                <label className="form__label">Profile Photo</label>
                <div className="avatar-picker">
                  <Image src={avatar} alt="Current avatar" width={80} height={80} className="avatar-current" />
                  <div className="avatar-options">
                    {avatarOptions.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setAvatar(url)}
                        className={`avatar-option${avatar === url ? ' avatar-option--active' : ''}`}
                      >
                        <Image src={url} alt="Avatar option" width={44} height={44} className="avatar-option__img" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="form__group">
                <label className="form__label" htmlFor="name">Full Name <span className="form__required">*</span></label>
                <div className="form__input-wrap">
                  <div className="input-wrapper">
                    <User className="input-wrapper__icon" size={18} />
                    <input
                      id="name"
                      type="text"
                      className={`input input--with-icon${errors.name ? ' input--error' : ''}`}
                      placeholder="Your full name"
                      {...register('name', {
                        required: 'Name is required.',
                        minLength: { value: 2, message: 'Name must be at least 2 characters.' },
                      })}
                    />
                  </div>
                  <span className="form__error">{errors.name?.message}</span>
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="form__group">
                <label className="form__label">Email</label>
                <div className="input-wrapper">
                  <Mail className="input-wrapper__icon" size={18} />
                  <input type="email" className="input input--with-icon input--readonly" value={user.email} readOnly />
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
                  placeholder="Tell us a bit about yourself..."
                  maxLength={200}
                  {...register('bio')}
                />
                <span className="form__hint">{200 - (watch('bio')?.length ?? 0)} characters remaining</span>
              </div>

              {/* ── Change Password ──────────────────────────── */}
              <div className="form__section">
                <h3 className="form__section-title">Change Password</h3>
                <p className="form__section-desc">Leave blank to keep your current password.</p>
              </div>

              {/* Current Password */}
              <div className="form__group">
                <label className="form__label" htmlFor="currentPassword">Current Password</label>
                <div className="form__input-wrap">
                  <div className="input-wrapper">
                    <Lock className="input-wrapper__icon" size={18} />
                    <input
                      id="currentPassword"
                      type={showCurrent ? 'text' : 'password'}
                      className={`input input--with-icon input--with-action${errors.currentPassword ? ' input--error' : ''}`}
                      placeholder="Enter current password"
                      {...register('currentPassword')}
                    />
                    <button type="button" className="input-wrapper__action" onClick={() => setShowCurrent((v) => !v)}>
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="form__error">{errors.currentPassword?.message}</span>
                </div>
              </div>

              {/* New Password */}
              <div className="form__group">
                <label className="form__label" htmlFor="newPassword">New Password</label>
                <div className="form__input-wrap">
                  <div className="input-wrapper">
                    <Lock className="input-wrapper__icon" size={18} />
                    <input
                      id="newPassword"
                      type={showNew ? 'text' : 'password'}
                      className={`input input--with-icon input--with-action${errors.newPassword ? ' input--error' : ''}`}
                      placeholder="Enter new password"
                      {...register('newPassword', {
                        minLength: { value: 6, message: 'Password must be at least 6 characters.' },
                      })}
                    />
                    <button type="button" className="input-wrapper__action" onClick={() => setShowNew((v) => !v)}>
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="form__error">{errors.newPassword?.message}</span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form__group">
                <label className="form__label" htmlFor="confirmPassword">Confirm New Password</label>
                <div className="form__input-wrap">
                  <div className="input-wrapper">
                    <Lock className="input-wrapper__icon" size={18} />
                    <input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      className={`input input--with-icon input--with-action${errors.confirmPassword ? ' input--error' : ''}`}
                      placeholder="Confirm new password"
                      {...register('confirmPassword', {
                        validate: (val) =>
                          !watch('newPassword') || val === watch('newPassword') || 'Passwords do not match.',
                      })}
                    />
                    <button type="button" className="input-wrapper__action" onClick={() => setShowConfirm((v) => !v)}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="form__error">{errors.confirmPassword?.message}</span>
                </div>
              </div>

              <div className="form__actions">
                <button
                  type="submit"
                  className={`btn btn--primary btn--lg${saving ? ' btn--loading' : ''}`}
                  disabled={saving}
                >
                  {saving ? <><span className="btn__spinner" /> Saving...</> : 'Save Changes'}
                </button>
                <Link href="/profile" className="btn btn--secondary btn--lg">Cancel</Link>
              </div>

            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
