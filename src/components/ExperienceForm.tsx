'use client'

import React, { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { Input, Field, Label } from '@headlessui/react'

export function ExperienceForm() {
  const [position, setPosition] = useState('Senior Systems Architect')
  const [company, setCompany] = useState('KernelLabs')

  const responsibilities = [
    "Engineered distributed consensus protocols for low-latency node synchronization.",
    "Managed migration of legacy monolith infrastructure to a containerized mesh architecture.",
    "Implemented zero-knowledge proof systems for user identity verification modules."
  ]

  return (
    <div className="bg-white p-14 border border-[#f0f0f0] w-full max-w-[860px] shadow-sm">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-16">
        <div>
          <h2 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">
            {position || 'Untitled Role'} @ {company || 'Unknown Company'}
          </h2>
          <span className="text-[11px] font-bold text-[#a0a0a0] uppercase tracking-[0.2em] block mt-1.5">
            2021 — PRESENT [ACTIVE]
          </span>
        </div>
        <span className="bg-[#e6f4ea] text-[#1e7e34] text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter">
          Latest
        </span>
      </div>

      {/* Form Fields - Horizontal Layout */}
      <div className="space-y-10 mb-16">
        <Field className="flex items-center gap-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] w-48 shrink-0">
            Company Name
          </Label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-[#999] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all"
          />
        </Field>
        
        <Field className="flex items-center gap-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] w-48 shrink-0">
            Position
          </Label>
          <Input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full border border-[#999] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all"
          />
        </Field>
      </div>

      {/* Responsibilities Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#a0a0a0]">
                Responsibilities Entries
            </span>
            <span className="text-[10px] font-bold text-[#a0a0a0] opacity-40">
                [3_items_loaded]
            </span>
        </div>
        
        <div className="space-y-3 mb-8">
          {responsibilities.map((item, idx) => (
            <div key={idx} className="flex gap-2">
               <div className="flex-1 bg-[#f5f5f5] p-6 text-[13px] flex items-start gap-4 border border-[#eee]">
                  <span className="text-[#1a1a1a] leading-relaxed">
                    • {item}
                  </span>
               </div>
               <button className="bg-white border border-[#f0f0f0] p-5 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
                  <Trash2 className="w-4 h-4 text-[#1a1a1a]" strokeWidth={1.5} />
               </button>
            </div>
          ))}
        </div>

        <button className="w-full border border-dashed border-[#e5e5e5] py-4.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] hover:bg-[#fafafa] transition-all flex items-center justify-center gap-2">
          <Plus className="w-3.5 h-3.5" />
          Add New Entries
        </button>
      </div>
    </div>
  )
}
