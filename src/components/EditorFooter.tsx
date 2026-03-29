'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

export function EditorFooter() {
  return (
    <div className="h-[80px] bg-white border-t border-[#f0f0f0] px-12 flex items-center justify-between shrink-0 font-mono shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-12">
        <div>
          <span className="text-[9px] font-bold text-[#a0a0a0] uppercase tracking-widest block mb-1">Last Saved</span>
          <span className="text-[11px] font-medium text-[#1a1a1a]">2024-05-24 14:22:01 UTC</span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-[#a0a0a0] uppercase tracking-widest block mb-1">Words</span>
          <span className="text-[11px] font-medium text-[#1a1a1a]">482</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="h-[44px] border border-[#e5e5e5] px-6 rounded-sm flex items-center justify-between gap-4 group hover:border-black transition-all min-w-[140px]">
          <span className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest">Draft</span>
          <ChevronDown className="w-4 h-4 text-[#a0a0a0] group-hover:text-black" />
        </button>
        <button className="h-[44px] bg-[#1a1a1a] text-white px-10 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg active:scale-95">
          Commit
        </button>
      </div>
    </div>
  )
}
