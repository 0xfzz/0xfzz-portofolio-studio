import React, { useState } from 'react'
import { InputField } from './ui/InputField'

interface AwardData {
  title: string
  issuer: string
  date: string
  description: string
}

interface AwardFormProps {
  data: AwardData
  onChange: (newData: AwardData) => void
}

export function AwardForm({ data, onChange }: AwardFormProps) {
  const updateField = (field: keyof AwardData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="bg-white border border-gray-200 p-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Card Header */}
      <div className="mb-12">
        <h2 className="text-[20px] font-sans font-bold text-gray-900 tracking-tight leading-none mb-3">
          {data.title || 'Untitled Award'}
        </h2>
        <span className="text-[12px] font-mono font-medium text-gray-500 tracking-wider block uppercase">
          {data.date || 'No Date'} — {data.issuer || 'No Issuer'}
        </span>
      </div>

      {/* Form Fields - Horizontal Layout */}
      <div className="space-y-8">
        <InputField 
          label="AWARD TITLE"
          value={data.title}
          onChange={(v) => updateField('title', v)}
          horizontal
          placeholder="e.g. 1st Winner of Bug Bounty 2023"
        />
        
        <InputField 
          label="DATE"
          value={data.date}
          onChange={(v) => updateField('date', v)}
          horizontal
          placeholder="e.g. AUG 2023"
        />

        <InputField 
          label="ISSUER"
          value={data.issuer}
          onChange={(v) => updateField('issuer', v)}
          horizontal
          placeholder="e.g. Kemdikbud"
        />

        <InputField 
          label="AWARD DESCRIPTION"
          value={data.description}
          onChange={(v) => updateField('description', v)}
          type="textarea"
          rows={4}
          horizontal
          placeholder="Briefly describe the achievement..."
        />
      </div>
    </div>
  )
}
