'use client'

import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

export function StatusBar() {
  return (
    <div className="bg-white border-y border-[#f0f0f0] p-4 px-12 flex items-center justify-between mb-12">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-bold text-[#1a1a1a] opacity-30 uppercase tracking-wider">Status:</span>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#28a745]" />
              <span className="text-[12px] font-bold text-[#1a1a1a] opacity-60 uppercase tracking-wider">Live_Operational</span>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-[#f0f0f0] pl-10">
            <span className="text-[12px] font-bold text-[#1a1a1a] opacity-30 uppercase tracking-wider">Environment:</span>
            <span className="text-[12px] font-bold text-[#1a1a1a] opacity-60 uppercase tracking-wider">Production_v4.2</span>
          </div>
        </div>

      <div className="flex items-center gap-4">
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 border border-[#e5e5e5] px-6 py-2 text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a] hover:bg-gray-50 transition-colors">
            Draft
            <ChevronDown className="w-4 h-4" />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-[#e5e5e5] focus:outline-none z-10">
            <MenuItem>
              <button className="flex w-full px-4 py-2 text-[12px] uppercase tracking-wider hover:bg-gray-50">Publish</button>
            </MenuItem>
          </MenuItems>
        </Menu>
        
        <button className="bg-[#1a1a1a] text-white px-10 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10">
          SAVE LOCALLY
        </button>
      </div>
    </div>
  )
}
