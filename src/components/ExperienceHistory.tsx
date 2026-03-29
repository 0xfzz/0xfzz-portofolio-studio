'use client'

import React from 'react'
import { CheckCircle2, History } from 'lucide-react'

const historyNodes = [
  { 
    id: 1, 
    role: "DevOps Lead @ CloudSphere", 
    period: "2018 — 2021", 
    icon: CheckCircle2 
  },
  { 
    id: 2, 
    role: "Junior Fullstack @ StartFlow", 
    period: "2016 — 2018", 
    icon: History 
  }
]

export function ExperienceHistory() {
  return (
    <div className="w-full">
      <span className="text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a] opacity-60 block mb-6 px-4">
        History_Nodes
      </span>
      
      <div className="bg-white border border-[#f0f0f0] divide-y divide-[#f0f0f0]">
        {historyNodes.map((node) => (
          <div key={node.id} className="p-6 px-10 flex items-center justify-between group hover:bg-[#fafafa] transition-colors">
            <div className="flex items-center gap-6">
              <node.icon className="w-5 h-5 text-[#a0a0a0]" strokeWidth={1.5} />
              <div>
                <h3 className="text-[13px] font-bold text-[#1a1a1a] tracking-tight">{node.role}</h3>
                <span className="text-[12px] font-bold text-[#a0a0a0] uppercase tracking-wider mt-0.5 block">{node.period}</span>
              </div>
            </div>
            <button className="text-[12px] font-bold uppercase tracking-wider text-[#a0a0a0] hover:text-[#1a1a1a] transition-colors">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
