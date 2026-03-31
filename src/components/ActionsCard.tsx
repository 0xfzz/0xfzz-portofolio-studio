'use client'

import React from 'react'

export function ActionsCard() {
  return (
    <div className="bg-white border border-gray-200 p-8 rounded-[2px]">
      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-400 font-semibold block mb-6">
        ACTIONS
      </span>
      <button className="w-full bg-[#333] text-white py-3 px-6 font-sans font-medium text-[11px] tracking-wider uppercase hover:bg-[#1a1a1a] transition-colors rounded-[2px]">
        COMMIT CHANGES
      </button>
    </div>
  )
}
