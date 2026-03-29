'use client'

import React, { useState } from 'react'
import { Field, Label, Input } from '@headlessui/react'

export function EducationForm() {
    const [institution, setInstitution] = useState('Universitas Teknologi Yogyakarta')
    const [degree, setDegree] = useState('Bachelor of Informatics')
    const [startYear, setStartYear] = useState('JUN 2023')
    const [endYear, setEndYear] = useState('PRESENT')
    const [location, setLocation] = useState('Mlati, Sleman')

  return (
    <div className="bg-white p-14 border border-[#f0f0f0] w-full max-w-[860px] shadow-sm font-mono">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-16 px-1">
        <div>
          <h2 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight leading-tight">
            {institution || 'Untitled Institution'}
          </h2>
          <span className="text-[11px] font-bold text-[#a0a0a0] uppercase tracking-[0.2em] block mt-2">
            {degree || 'Degree'} | {startYear || 'Start'} — {endYear || 'End'}
          </span>
        </div>
      </div>

      {/* Form Fields - Horizontal Layout */}
      <div className="space-y-10">
        <Field className="flex items-center gap-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] w-48 shrink-0">
            Institution
          </Label>
          <Input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full border border-[#999] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all"
          />
        </Field>
        
        <Field className="flex items-center gap-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] w-48 shrink-0">
            Degree
          </Label>
          <Input
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="w-full border border-[#999] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all"
          />
        </Field>

        <Field className="flex items-center gap-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] w-48 shrink-0">
            Period
          </Label>
          <div className="flex items-center gap-4 w-full">
            <Input
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="flex-1 border border-[#999] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all"
            />
            <span className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest px-8">To</span>
            <Input
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="flex-1 border border-[#999] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all"
            />
          </div>
        </Field>

        <Field className="flex items-center gap-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] w-48 shrink-0">
            Location
          </Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-[#999] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all"
          />
        </Field>
      </div>
    </div>
  )
}
