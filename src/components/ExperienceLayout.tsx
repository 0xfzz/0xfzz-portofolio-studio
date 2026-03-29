'use client'

import React, { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { DashboardLayout } from './DashboardLayout'
import { DashboardHeader } from './DashboardHeader'
import { ActionsCard } from './ActionsCard'

interface ExperienceLayoutProps {
  title: string
  subtitle: string
  form: ReactNode
  list: ReactNode
}

export function ExperienceLayout({ title, subtitle, form, list }: ExperienceLayoutProps) {
  return (
    <DashboardLayout>
      <DashboardHeader />
      
      <main className="flex-1 p-16 pt-2 overflow-y-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mt-4 mb-16">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] block mb-1">
              {subtitle}
            </span>
            <h1 className="text-[32px] font-bold text-[#1a1a1a] tracking-tight">
              {title}
            </h1>
          </div>
          <button className="bg-white border border-[#e5e5e5] px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            New_Entry
          </button>
        </div>

        {/* Form and Actions */}
        <div className="flex gap-16 items-start mb-24">
          <div className="flex-1">
            {form}
          </div>
          <div className="w-[320px] sticky top-8 shrink-0">
            <ActionsCard />
          </div>
        </div>

        {/* List Content */}
        {list}
      </main>
    </DashboardLayout>
  )
}
