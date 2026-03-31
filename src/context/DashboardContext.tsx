'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'

interface DashboardContextType {
  isDiffOpen: boolean
  setIsDiffOpen: (open: boolean) => void
  gitStatus: 'clean' | 'dirty' | 'loading' | 'error' | 'not_initialized'
  diffCount: number
  refreshStatus: () => Promise<void>
  
  // Shared Save/Reset Actions
  onSave: (() => Promise<void>) | null
  setOnSave: (fn: (() => Promise<void>) | null) => void
  onReset: (() => Promise<void>) | null
  setOnReset: (fn: (() => Promise<void>) | null) => void
  isSaving: boolean
  setIsSaving: (saving: boolean) => void
  saveStatus: 'idle' | 'success' | 'error'
  setSaveStatus: (status: 'idle' | 'success' | 'error') => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isDiffOpen, setIsDiffOpen] = useState(false)
  const [gitStatus, setGitStatus] = useState<'clean' | 'dirty' | 'loading' | 'error' | 'not_initialized'>('loading')
  const [diffCount, setDiffCount] = useState(0)
  
  const [onSave, setOnSave] = useState<(() => Promise<void>) | null>(null)
  const [onReset, setOnReset] = useState<(() => Promise<void>) | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/git/status')
      const data = await res.json()
      if (data.status) {
        setGitStatus(data.status)
        setDiffCount((data.localCount || 0) + (data.unpushedCount || 0))
      } else {
        setGitStatus('error')
      }
    } catch (err) {
      setGitStatus('error')
    }
  }, [])

  useEffect(() => {
    refreshStatus()
  }, [refreshStatus])

  return (
    <DashboardContext.Provider value={{ 
      isDiffOpen, setIsDiffOpen, gitStatus, diffCount, refreshStatus,
      onSave, setOnSave, onReset, setOnReset, isSaving, setIsSaving,
      saveStatus, setSaveStatus
    }}>
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
