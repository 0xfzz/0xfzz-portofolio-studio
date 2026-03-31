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

import { PageLayout } from './ui/PageLayout'

export function ExperienceLayout({ title, subtitle, form, list }: ExperienceLayoutProps) {
  return (
    <PageLayout
      title={title}
      subtitle={subtitle}
      newEntryHref="#"
    >
      {/* Form and Actions */}
      <div className="flex gap-10 items-start mb-16">
        <div className="flex-1 min-w-0">
          {form}
        </div>
        <div className="w-[320px] sticky top-8 shrink-0">
          <ActionsCard />
        </div>
      </div>

      {/* List Content */}
      {list}
    </PageLayout>
  )
}
