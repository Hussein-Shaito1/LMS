'use client'

import React from 'react'
export { useLMS } from '@/store/lmsStore'

export function LMSProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
