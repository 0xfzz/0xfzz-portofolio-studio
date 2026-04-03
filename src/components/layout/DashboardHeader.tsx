'use client'

import React from 'react'
import { RefreshCw, GitBranch, AlertCircle, CheckCircle } from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'

export function DashboardHeader() {
  const { gitStatus, refreshStatus, isDiffOpen, setIsDiffOpen, diffCount } = useDashboard()

  return (
    <header className="flex justify-end items-center px-6 h-[52px] bg-white border-b border-gray-300 shrink-0">
      <button 
        onClick={() => setIsDiffOpen(!isDiffOpen)}
        className="w-[98px] h-[27px] px-3 rounded-[2px] border border-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors bg-white shadow-none"
      >
        <span className="text-[11px] font-mono font-normal text-gray-900 leading-none">
          DIFF
        </span>
        <span className="bg-gray-900 text-white text-[11px] font-mono font-normal px-2 rounded-[19px] h-[17px] min-w-[30px] flex items-center justify-center leading-none">
          {diffCount}
        </span>
      </button>
    </header>
  )
}
