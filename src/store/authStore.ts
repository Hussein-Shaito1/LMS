import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StoredUser } from '@/types'
import usersData from '@/data/users.json'
import { useLMSStore } from './lmsStore'

const REGISTERED_KEY = 'lms_registered_users'

function getRegistered(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(REGISTERED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRegistered(users: StoredUser[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(users))
}

interface AuthState {
  user: StoredUser | null
  _hasHydrated: boolean
  setHasHydrated: (val: boolean) => void
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<Pick<StoredUser, 'name' | 'bio' | 'avatar'>>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      login: async (email, password) => {
        const seedUsers = usersData as Array<{
          id: string; name: string; email: string; password: string
          avatar: string; bio: string; joinedAt: string
        }>
        const seedMatch = seedUsers.find((u) => u.email === email && u.password === password)

        if (seedMatch) {
          const stored: StoredUser = {
            id: seedMatch.id,
            name: seedMatch.name,
            email: seedMatch.email,
            avatar: seedMatch.avatar,
            bio: seedMatch.bio,
            joinedAt: seedMatch.joinedAt,
          }
          set({ user: stored })
          return { success: true }
        }

        const registered = getRegistered()
        const match = registered.find((u) => u.email === email)
        if (!match) return { success: false, error: 'No account found with this email.' }

        const storedPw = typeof window !== 'undefined' ? localStorage.getItem(`lms_pw_${email}`) : null
        if (storedPw !== password) return { success: false, error: 'Incorrect password.' }

        set({ user: match })
        return { success: true }
      },

      register: async (name, email, password) => {
        const seedUsers = usersData as Array<{ email: string }>
        if (seedUsers.some((u) => u.email === email)) {
          return { success: false, error: 'An account with this email already exists.' }
        }

        const registered = getRegistered()
        if (registered.some((u) => u.email === email)) {
          return { success: false, error: 'An account with this email already exists.' }
        }

        const newUser: StoredUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          avatar: `https://i.pravatar.cc/150?u=${email}`,
          bio: '',
          joinedAt: new Date().toISOString().split('T')[0],
        }

        registered.push(newUser)
        saveRegistered(registered)
        if (typeof window !== 'undefined') {
          localStorage.setItem(`lms_pw_${email}`, password)
        }

        set({ user: newUser })
        return { success: true }
      },

      logout: () => {
        set({ user: null })
        useLMSStore.getState().resetAll()
      },

      updateProfile: (updates) => {
        const { user } = get()
        if (!user) return
        const updated = { ...user, ...updates }
        set({ user: updated })

        const registered = getRegistered()
        const idx = registered.findIndex((u) => u.id === updated.id)
        if (idx >= 0) {
          registered[idx] = updated
          saveRegistered(registered)
        }
      },
    }),
    {
      name: 'lms_auth_store',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export function useAuth() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _hasHydrated, setHasHydrated, ...rest } = useAuthStore()
  return { ...rest, loading: !_hasHydrated }
}
