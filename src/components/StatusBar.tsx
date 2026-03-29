'use client'

import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'

export function StatusBar() {
  return (
    <div className="bg-white border-y border-[#f0f0f0] p-4 px-12 flex items-center justify-between mb-12">
      <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.1em] text-[#a0a0a0]">
        <span>Last Saved: <span className="text-[#1a1a1a]">2024-05-24 14:22:01 UTC</span></span>
        <span>Words: <span className="text-[#1a1a1a]">482</span></span>
      </div>

      <div className="flex items-center gap-4">
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 border border-[#e5e5e5] px-6 py-2 text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a] hover:bg-gray-50 transition-colors">
            Draft
            <ChevronDown className="w-4 h-4" />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-[#e5e5e5] shadow-lg focus:outline-none z-10">
            <MenuItem>
              <button className="flex w-full px-4 py-2 text-xs uppercase tracking-widest hover:bg-gray-50">Publish</button>
            </MenuItem>
          </MenuItems>
        </Menu>
        
        <button className="bg-[#2d2d2d] text-white px-10 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors">
          Commit
        </button>
      </div>
    </div>
  )
}
