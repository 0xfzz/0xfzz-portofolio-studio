'use client'

import React from 'react'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { EditorFooter } from '@/components/editor/EditorFooter'

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
