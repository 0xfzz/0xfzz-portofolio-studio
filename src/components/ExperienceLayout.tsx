'use client'

import React, { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { DashboardLayout } from './DashboardLayout'
import { DashboardHeader } from './DashboardHeader'
import { ActionsCard } from './ActionsCard'
import { PageLayout } from './ui/PageLayout'

interface ExperienceLayoutProps {
  title: string
  subtitle: string
  form: ReactNode
  list: ReactNode
  onSave?: () => void
  onReset?: () => void
  onAdd?: () => void
  saving?: boolean
  status?: 'idle' | 'success' | 'error'
}

export function ExperienceLayout({ 
  title, 
  subtitle, 
  form, 
  list,
  onSave,
  onReset,
  onAdd,
  saving = false,
  status = 'idle'
}: ExperienceLayoutProps) {
  return (
    <PageLayout
      title={title}
      subtitle={subtitle}
      onNewEntry={onAdd}
      newEntryLabel="Add Entry"
    >
      {/* Form and Actions Row */}
      <div className="flex gap-16 items-start mb-16">
        <div className="flex-1 min-w-0">
          {form}
        </div>
        
        {/* Floating Sidebar Container */}
        <div className="w-[320px] sticky top-32 shrink-0">
          <ActionsCard 
            onSave={onSave}
            onReset={onReset}
            saving={saving}
            status={status}
          />
        </div>
      </div>

      {/* List Content Area (Starts after the floating row ends) */}
      <div className="pt-8 border-t border-gray-100 mb-20">
        <div className="flex items-center justify-between mb-8">
           <div className="flex flex-col gap-1">
             <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Historical Data</span>
             <h3 className="text-[18px] font-sans font-semibold text-gray-900 tracking-tight">HISTORY / ENTRIES</h3>
           </div>
        </div>
        {list}
      </div>
    </PageLayout>
  )
}
