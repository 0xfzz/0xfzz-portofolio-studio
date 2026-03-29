'use client'

import React from 'react'
import { useDashboard } from '@/context/DashboardContext'

export function DashboardHeader() {
  const { setIsDiffOpen } = useDashboard()

  return (
    <header className="flex justify-end p-4 px-10 bg-white border-b border-[#f0f0f0]">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsDiffOpen(true)}
          className="bg-[#f0f0f0] px-3 py-1 rounded-sm border border-[#e5e5e5] flex items-center gap-2 hover:bg-[#e8e8e8] transition-colors cursor-pointer group"
        >
            <span className="text-[11px] font-bold text-[#1a1a1a] tracking-tight uppercase">Diff</span>
            <span className="bg-[#333] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold group-hover:bg-black">
                12
            </span>
        </button>
      </div>
    </header>
  )
}
