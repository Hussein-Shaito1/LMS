'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import {
  BookOpen,
  GraduationCap,
  Heart,
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from 'lucide-react'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Courses', icon: GraduationCap },
  { href: '/my-courses', label: 'My Courses', icon: BookOpen, authRequired: true },
  { href: '/favorites', label: 'Favorites', icon: Heart, authRequired: true },
  { href: '/about', label: 'About', icon: Info },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname])

  function handleLogout() {
    logout()
    showToast('Logged out successfully. See you soon!', 'info')
    router.push('/')
    setDropdownOpen(false)
  }

  const visibleLinks = NAV_LINKS.filter((l) => !l.authRequired || user)

  return (
    <>
      <header className="header">
        <div className="header__inner">
          {/* Logo */}
          <Link href="/" className="header__logo">
            <BookOpen />
            <span>LearnHub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="header__nav">
            {visibleLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`header__nav-link ${pathname === href ? 'header__nav-link--active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="header__actions">
            {user ? (
              <div className="header__user" ref={dropdownRef}>
                <button
                  className="header__user-btn"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-label="User menu"
                >
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={28}
                    height={28}
                    className="header__user-btn-avatar"
                  />
                  <span className="header__user-btn-name">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="header__dropdown">
                    <Link href="/profile" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <User size={16} /> Profile
                    </Link>
                    <Link href="/my-courses" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <BookOpen size={16} /> My Courses
                    </Link>
                    <Link href="/favorites" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Heart size={16} /> Favorites
                    </Link>
                    <Link href="/profile/edit" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Settings size={16} /> Settings
                    </Link>
                    <div className="header__dropdown-divider" />
                    <button className="header__dropdown-item header__dropdown-item--danger" onClick={handleLogout}>
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn--ghost btn--sm">
                  <LogIn size={16} /> Log In
                </Link>
                <Link href="/register" className="btn btn--primary btn--sm">
                  Get Started
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              className={`header__hamburger ${menuOpen ? 'header__hamburger--open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <div className="header__mobile-menu">
            <nav className="header__mobile-menu-nav">
              {NAV_LINKS.filter((l) => !l.authRequired || user).map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`header__mobile-menu-link ${pathname === href ? 'header__mobile-menu-link--active' : ''}`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}

              <div className="header__mobile-menu-divider" />

              {user ? (
                <>
                  <Link href="/profile" className="header__mobile-menu-link">
                    <User size={20} /> Profile
                  </Link>
                  <button
                    className="header__mobile-menu-link"
                    style={{ color: 'var(--error, #ef4444)', background: 'none', width: '100%', textAlign: 'left' }}
                    onClick={handleLogout}
                  >
                    <LogOut size={20} /> Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="header__mobile-menu-link">
                    <LogIn size={20} /> Log In
                  </Link>
                  <Link href="/register" className="header__mobile-menu-link">
                    Get Started Free
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Backdrop */}
          <div
            style={{
              position: 'fixed', inset: 0, top: 70, background: 'rgba(15,23,42,0.4)',
              zIndex: 98, backdropFilter: 'blur(2px)'
            }}
            onClick={() => setMenuOpen(false)}
          />
        </>
      )}
    </>
  )
}
