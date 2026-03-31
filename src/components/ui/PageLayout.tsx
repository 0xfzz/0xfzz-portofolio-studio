'use client'

import React, { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardHeader } from '@/components/DashboardHeader'

interface PageLayoutProps {
  title: string
  subtitle: string
  newEntryHref?: string
  newEntryLabel?: string
  onNewEntry?: () => void
  actions?: ReactNode
  children: ReactNode
  maxWidth?: string
}

export function PageLayout({ 
  title, 
  subtitle, 
  newEntryHref, 
  newEntryLabel = 'NEW_ENTRY',
  onNewEntry,
  actions, 
  children,
  maxWidth = 'max-w-[1440px]'
}: PageLayoutProps) {
  return (
    <DashboardLayout>
      <DashboardHeader />
      
      <main className="flex-1 p-10 lg:p-12 font-sans scrollbar-hide bg-white">
        <div className="w-full">
          {/* Page Header */}
          <div className="flex items-end justify-between mb-10 pb-8 border-b border-gray-200">
            <div>
              <span className="text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500 mb-2 block">
                {subtitle}
              </span>
              <h1 className="text-[30px] font-sans font-semibold text-gray-900 tracking-[-0.6px] leading-[36px]">
                {title}
              </h1>
            </div>
            {onNewEntry && (
              <button 
                onClick={onNewEntry}
                className="bg-[#2d2d2d] text-white px-5 py-2.5 text-[12px] font-mono font-normal uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors rounded-none flex items-center gap-2"
              >
                [+ {newEntryLabel.replace('_', ' ')}]
              </button>
            )}
            {newEntryHref && !onNewEntry && (
              <Link 
                href={newEntryHref}
                className="bg-[#2d2d2d] text-white px-5 py-2.5 text-[12px] font-mono font-normal uppercase tracking-widest hover:bg-[#1a1a1a] transition-colors rounded-none flex items-center gap-2"
              >
                [+ {newEntryLabel.replace('_', ' ')}]
              </Link>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex gap-16 items-start">
            <div className="flex-1 min-w-0">
              {children}
            </div>
            {actions && (
              <div className="w-[320px] sticky top-8 shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
