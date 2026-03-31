'use client'

import React from 'react'

/**
 * DashboardLayout
 * Simple wrapper for dashboard content. 
 * Root-level providers and Sidebar are now in src/app/dashboard/layout.tsx
 */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col relative w-full h-full min-h-screen">
      {children}
    </div>
  )
}
