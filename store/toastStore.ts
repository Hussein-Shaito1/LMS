import { create } from 'zustand'
import type { Toast, ToastType } from '@/types'

interface ToastState {
  toasts: Toast[]
  showToast: (title: string, type?: ToastType, message?: string, duration?: number) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },

  showToast: (title, type = 'info', message, duration = 4000) => {
    const id = Math.random().toString(36).slice(2)
    const toast: Toast = { id, type, title, message, duration }
    set((state) => ({ toasts: [...state.toasts, toast] }))
    setTimeout(() => get().removeToast(id), duration)
  },
}))

export const useToast = useToastStore
