'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { ActionsCard } from '@/components/shared/ActionsCard'
import { StatusBar } from '@/components/shared/StatusBar'
import { DiffViewer } from '@/components/editor/DiffViewer'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <main className="flex-1 p-12 pt-4 overflow-y-auto">
        <ActionsCard />
        <StatusBar />
        <DiffViewer />
      </main>
    </DashboardLayout>
  )
}
