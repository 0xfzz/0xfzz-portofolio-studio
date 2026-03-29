'use client'

import React from 'react'
import { X } from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'

const diffData = [
  { key: '"version": "1.0.4",', local: ' ', prod: ' ', type: 'neutral' },
  { key: '"env": "production-v2",', local: '+', prod: '-', prodValue: '"env": "production-v1",', type: 'changed' },
  { key: '"debug": false,', local: ' ', prod: ' ', type: 'neutral' },
  { key: '"analytics_id": "UA-9982-1",', local: '+', prod: ' ', type: 'added' },
  { key: '"legacy_support": true,', local: ' ', prod: '-', type: 'removed' },
  { key: '"endpoint": "https://api.v2/",', local: ' ', prod: ' ', type: 'neutral' },
  { key: '"timeout_ms": 5000,', local: '+', prod: '-', prodValue: '"timeout_ms": 3000,', type: 'changed' },
  { key: '"retries": 3', local: ' ', prod: ' ', type: 'neutral' },
]

export function DiffViewer() {
  const { setIsDiffOpen } = useDashboard()
  
  return (
    <div className="bg-white border border-[#f0f0f0] w-full shadow-2xl mb-0">
      {/* Diff Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#f0f0f0]">
        <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-wider">Diff</span>
            <span className="bg-[#333] text-white text-[11px] w-5.5 h-5.5 flex items-center justify-center rounded-full font-bold">12</span>
        </div>
        <button 
            onClick={() => setIsDiffOpen(false)}
            className="text-[#888] hover:text-[#1a1a1a] transition-colors"
        >
            <span className="text-xs font-mono lowercase opacity-50">[ x ]</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#f0f0f0]">
        <div className="bg-[#f0f0f0] px-6 py-3 text-[13px] font-bold text-[#1a1a1a] border-r border-[#f0f0f0]">
            site-config.json
        </div>
        <div className="flex-1 bg-white"></div>
      </div>

      {/* Diff Content Header */}
      <div className="grid grid-cols-2 text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a] opacity-60 border-b border-[#f0f0f0]">
        <div className="p-3 px-6 border-r border-[#f0f0f0]">Local Environment</div>
        <div className="p-3 px-6">Production (Live)</div>
      </div>

      {/* Diff Rows */}
      <div className="font-mono text-[12px] leading-relaxed">
        {diffData.map((row, idx) => (
          <div key={idx} className="grid grid-cols-2 group">
            {/* Local Side */}
            <div className={`
                flex p-1.5 px-6 border-r border-[#f0f0f0] relative
                ${row.type === 'added' || (row.type === 'changed' && row.local === '+') ? 'bg-[#f0fff4] text-[#22863a]' : ''}
                ${row.type === 'removed' ? 'opacity-30' : ''}
            `}>
                <span className="w-6 opacity-40 select-none">{row.local}</span>
                <span className="flex-1 whitespace-pre">{row.key}</span>
            </div>
            
            {/* Prod Side */}
            <div className={`
                flex p-1.5 px-6
                ${row.type === 'removed' || (row.type === 'changed' && row.prod === '-') ? 'bg-[#fff5f5] text-[#cb2431]' : ''}
                ${row.type === 'changed' && row.prod === '-' ? 'line-through decoration-[#cb2431] opacity-60' : ''}
                ${row.type === 'removed' ? 'line-through decoration-[#cb2431]' : ''}
                ${row.type === 'added' ? 'opacity-30' : ''}
            `}>
                <span className="w-6 opacity-40 select-none">{row.prod}</span>
                <span className="flex-1 whitespace-pre">{row.prodValue || row.key}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Diff Footer */}
      <div className="p-8 flex justify-center gap-4">
        <button 
            onClick={() => setIsDiffOpen(false)}
            className="border border-black px-10 py-3 text-[12px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-all cursor-pointer"
        >
            Cancel
        </button>
        <button className="border border-[#cb2431] text-[#cb2431] px-10 py-3 text-[12px] font-bold uppercase tracking-wider hover:bg-[#fff5f5] transition-all cursor-pointer">
            Discard Changes
        </button>
        <button className="bg-[#6f7c5d] text-white px-10 py-3 text-[12px] font-bold uppercase tracking-wider hover:bg-[#5a664c] transition-all cursor-pointer">
            Push Changes
        </button>
      </div>
    </div>
  )
}
