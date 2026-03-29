'use client'

import React from 'react'
import { DashboardHeader } from '@/components/DashboardHeader'
import { EditorFooter } from '@/components/EditorFooter'

interface EditorLayoutProps {
  children: React.ReactNode
}

export function EditorLayout({ children }: EditorLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
      <EditorFooter />
    </div>
  )
}
