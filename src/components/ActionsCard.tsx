'use client'

import React from 'react'

export function ActionsCard() {
  return (
    <div className="bg-white p-10 border border-[#f0f0f0] shadow-sm mb-12">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0] font-bold block mb-4">
        Actions
      </span>
      <button className="w-full bg-[#2d2d2d] text-white py-4.5 px-6 font-bold text-[13px] tracking-[0.15em] uppercase hover:bg-black transition-colors cursor-pointer">
        Commit Changes
      </button>
    </div>
  )
}
