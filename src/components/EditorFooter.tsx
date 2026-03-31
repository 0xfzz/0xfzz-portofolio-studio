'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

export function EditorFooter() {
  return (
    <div className="h-[60px] bg-[#fafafa] border-t border-gray-200 px-10 flex items-center justify-between shrink-0 text-gray-500">
      <div className="flex items-center gap-12 text-[11px] font-mono tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">LAST SAVED:</span>
          <span className="font-semibold text-gray-600">2024-05-24 14:22:01<br/>UTC</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">WORDS:</span>
          <span className="font-semibold text-gray-600">482</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="h-[32px] bg-white border border-gray-300 px-4 flex items-center justify-between gap-6 group hover:border-gray-400 transition-colors shadow-sm rounded-[2px] min-w-[120px]">
          <span className="text-[11px] font-sans font-semibold text-gray-600 uppercase tracking-widest">DRAFT</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
        <button className="h-[32px] bg-[#2d2d2d] text-white px-8 text-[11px] font-sans font-medium uppercase tracking-wider hover:bg-[#1a1a1a] transition-colors shadow-sm rounded-[2px]">
          COMMIT
        </button>
      </div>
    </div>
  )
}
