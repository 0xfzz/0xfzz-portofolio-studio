'use client'

import React from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardHeader } from '@/components/DashboardHeader'
import { ActionsCard } from '@/components/ActionsCard'
import { StatusBar } from '@/components/StatusBar'
import { DiffViewer } from '@/components/DiffViewer'

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
