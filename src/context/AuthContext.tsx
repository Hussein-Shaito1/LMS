'use client'

import React from 'react'
export { useAuth } from '@/store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
