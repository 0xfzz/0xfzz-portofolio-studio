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
  actions?: ReactNode
  children: ReactNode
  maxWidth?: string
}

export function PageLayout({ 
  title, 
  subtitle, 
  newEntryHref, 
  newEntryLabel = 'NEW_ENTRY',
  actions, 
  children,
  maxWidth = 'max-w-[1440px]'
}: PageLayoutProps) {
  return (
    <DashboardLayout>
      <DashboardHeader />
      
      <main className="flex-1 p-16 pt-2 overflow-y-auto font-mono scrollbar-hide">
        <div className="w-full">
          {/* Page Header */}
          <div className="flex items-center justify-between mt-4 mb-16">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#a0a0a0] block mb-1">
                {subtitle}
              </span>
              <h1 className="text-[32px] font-sans font-bold text-[#1a1a1a] tracking-tight uppercase leading-none">
                {title}
              </h1>
            </div>
            {newEntryHref && (
              <Link 
                href={newEntryHref}
                className="bg-white border border-[#e5e5e5] px-6 py-2.5 text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                {newEntryLabel}
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
