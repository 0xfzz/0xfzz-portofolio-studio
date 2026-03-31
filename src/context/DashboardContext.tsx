'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'

interface DashboardContextType {
  isDiffOpen: boolean
  setIsDiffOpen: (open: boolean) => void
  gitStatus: 'clean' | 'dirty' | 'loading' | 'error'
  refreshStatus: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isDiffOpen, setIsDiffOpen] = useState(false)
  const [gitStatus, setGitStatus] = useState<'clean' | 'dirty' | 'loading' | 'error'>('loading')

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/git/sync')
      const data = await res.json()
      if (data.status) {
        setGitStatus(data.status)
      } else {
        setGitStatus('error')
      }
    } catch (err) {
      setGitStatus('error')
    }
  }, [])

  useEffect(() => {
    refreshStatus()
    // Poll every 30 seconds
    const interval = setInterval(refreshStatus, 30000)
    return () => clearInterval(interval)
  }, [refreshStatus])

  return (
    <DashboardContext.Provider value={{ isDiffOpen, setIsDiffOpen, gitStatus, refreshStatus }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
