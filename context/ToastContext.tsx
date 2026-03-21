'use client'

import React from 'react'
export { useToast } from '@/store/toastStore'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
