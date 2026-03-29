'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface DashboardContextType {
  isDiffOpen: boolean
  setIsDiffOpen: (open: boolean) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isDiffOpen, setIsDiffOpen] = useState(false)

  return (
    <DashboardContext.Provider value={{ isDiffOpen, setIsDiffOpen }}>
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
