import type { StoredUser, Progress } from '@/types'

const KEYS = {
  USER: 'lms_user',
  ENROLLED: 'lms_enrolledCourses',
  FAVORITES: 'lms_favorites',
  PROGRESS: 'lms_progress',
} as const

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // quota exceeded or private mode
  }
}

// ── User ──────────────────────────────────────────────────────────────────────
export const getUser = (): StoredUser | null => safeGet<StoredUser | null>(KEYS.USER, null)
export const setUser = (user: StoredUser) => safeSet(KEYS.USER, user)
export const clearUser = () => typeof window !== 'undefined' && localStorage.removeItem(KEYS.USER)

// ── Enrolled courses ──────────────────────────────────────────────────────────
export const getEnrolled = (): string[] => safeGet<string[]>(KEYS.ENROLLED, [])
export const setEnrolled = (ids: string[]) => safeSet(KEYS.ENROLLED, ids)

// ── Favorites ─────────────────────────────────────────────────────────────────
export const getFavorites = (): string[] => safeGet<string[]>(KEYS.FAVORITES, [])
export const setFavorites = (ids: string[]) => safeSet(KEYS.FAVORITES, ids)

// ── Progress ──────────────────────────────────────────────────────────────────
export const getProgress = (): Progress => safeGet<Progress>(KEYS.PROGRESS, {})
export const setProgress = (progress: Progress) => safeSet(KEYS.PROGRESS, progress)

// ── Full clear (logout) ───────────────────────────────────────────────────────
export const clearAll = () => {
  if (typeof window === 'undefined') return
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
}
