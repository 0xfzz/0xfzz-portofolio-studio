import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Field, Label, Input } from '@headlessui/react'

export function AwardForm() {
  const [title, setTitle] = useState('3rd Winner of LKS Web Technology 2022')
  const [date, setDate] = useState('MAY 2022')
  const [issuer, setIssuer] = useState('Daerah Istimewa Yogyakarta')
  const [description, setDescription] = useState('Membangun situs web penyaji data IMDb menggunakan scraping JavaScript. Tech stack: Nest.js (Backend) dan Nuxt.js (Frontend).')

  return (
    <div className="bg-white p-14 border border-[#f0f0f0] w-full max-w-[860px] shadow-sm font-mono">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-16 px-1">
        <div>
          <h2 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight leading-tight max-w-[500px]">
            {title || 'Untiled Award'}
          </h2>
          <span className="text-[11px] font-bold text-[#a0a0a0] uppercase tracking-[0.2em] block mt-2">
            {date || 'No Date'} — {issuer || 'No Issuer'}
          </span>
        </div>
      </div>

      {/* Form Fields - Horizontal Layout */}
      <div className="space-y-10">
        <Field className="flex items-center gap-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] w-48 shrink-0">
            Title
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#999] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all"
          />
        </Field>
        
        <Field className="flex items-center gap-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] w-48 shrink-0">
            Date
          </Label>
          <Input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-[#999] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all"
          />
        </Field>

        <Field className="flex items-center gap-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] w-48 shrink-0">
            Issuer
          </Label>
          <Input
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            className="w-full border border-[#999] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all"
          />
        </Field>

        <Field className="space-y-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] px-1 block">
            Description
          </Label>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-[#999] px-5 py-5 text-[14px] font-medium focus:outline-none focus:border-black transition-all resize-none leading-relaxed"
          ></textarea>
        </Field>
      </div>
    </div>
  )
}
