'use client'

import React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardProvider, useDashboard } from '@/context/DashboardContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { NotificationProviderUI } from '@/components/ui/NotificationProvider'
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react'
import { DiffViewer } from '@/components/editor/DiffViewer'

/**
 * Global Diff Modal for the dashboard
 */
function DashboardDiffModal() {
  const { isDiffOpen, setIsDiffOpen } = useDashboard()

  return (
    <Dialog open={isDiffOpen} onClose={() => setIsDiffOpen(false)} className="relative z-[9998]">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-5xl">
          <DiffViewer />
        </DialogPanel>
      </div>
    </Dialog>
  )
}

/**
 * Root Dashboard Layout
 * Wraps all dashboard pages in necessary context providers.
 */
export default function DashboardRootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <NotificationProvider>
      <DashboardProvider>
        <div className="flex min-h-screen bg-white font-sans text-[#1a1a1a]">
          <Sidebar />
          <div className="flex-1 flex flex-col relative">
            {children}
          </div>
        </div>
        <DashboardDiffModal />
        <NotificationProviderUI />
      </DashboardProvider>
    </NotificationProvider>
  )
}
