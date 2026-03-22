'use client'

import { useToast } from '@/context/ToastContext'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import type { ToastType } from '@/types'

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <XCircle size={20} />,
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />,
}

const TITLES: Record<ToastType, string> = {
  success: 'Success',
  error: 'Error',
  info: 'Info',
  warning: 'Warning',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="alert">
          <span className="toast__icon">{ICONS[toast.type]}</span>
          <div className="toast__content">
            <div className="toast__title">{toast.title || TITLES[toast.type]}</div>
            {toast.message && <div className="toast__message">{toast.message}</div>}
          </div>
          <button
            className="toast__close"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
