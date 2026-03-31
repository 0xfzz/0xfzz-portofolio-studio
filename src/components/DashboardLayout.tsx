'use client'

import React from 'react'
import { Sidebar } from './Sidebar'
import { DashboardProvider, useDashboard } from '@/context/DashboardContext'
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react'
import { DiffViewer } from './DiffViewer'

function DiffModal() {
  const { isDiffOpen, setIsDiffOpen } = useDashboard()

  return (
    <Dialog open={isDiffOpen} onClose={() => setIsDiffOpen(false)} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-5xl">
          <DiffViewer />
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-white font-sans text-[#1a1a1a]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
      <DiffModal />
    </DashboardProvider>
  )
}
