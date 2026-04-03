import React, { useState } from 'react'
import { InputField } from '@/components/ui/InputField'

interface EducationData {
  institution: string
  degree: string
  period: string
  location: string
  description?: string
}

interface EducationFormProps {
  data: EducationData
  onChange: (newData: EducationData) => void
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const updateField = (field: keyof EducationData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="bg-white border border-gray-200 p-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Card Header */}
      <div className="mb-12">
        <h2 className="text-[20px] font-sans font-bold text-gray-900 tracking-tight leading-none mb-3">
          {data.institution || 'Untitled Institution'}
        </h2>
        <span className="text-[12px] font-mono font-medium text-gray-500 tracking-wider block uppercase">
          {data.degree || 'N/A'} | {data.period || 'N/A'}
        </span>
      </div>

      {/* Form Fields - Horizontal Layout */}
      <div className="space-y-8">
        <InputField 
          label="INSTITUTION"
          value={data.institution}
          onChange={(v) => updateField('institution', v)}
          horizontal
          placeholder="e.g. Universitas Teknologi Yogyakarta"
        />
        
        <InputField 
          label="DEGREE / CERTIFICATE"
          value={data.degree}
          onChange={(v) => updateField('degree', v)}
          horizontal
          placeholder="e.g. Bachelor of Informatics"
        />

        <div className="flex items-center gap-4">
          <label className="text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500 w-48 shrink-0">
            PERIOD
          </label>
          <div className="flex items-center gap-4 w-full">
            <InputField 
              label=""
              value={(data.period || '').split(' - ')[0] || ''}
              onChange={(v) => {
                const parts = (data.period || '').split(' - ')
                updateField('period', `${v || ''} - ${parts[1] || ''}`)
              }}
              className="flex-1"
              placeholder="START (e.g. 2023)"
            />
            <span className="text-[11px] font-mono font-normal tracking-[0.05em] text-gray-500 px-2 shrink-0 uppercase">TO</span>
            <InputField 
              label=""
              value={(data.period || '').split(' - ')[1] || ''}
              onChange={(v) => {
                const parts = (data.period || '').split(' - ')
                updateField('period', `${parts[0] || ''} - ${v || ''}`)
              }}
              className="flex-1"
              placeholder="END (e.g. 2025)"
            />
          </div>
        </div>

        <InputField 
          label="LOCATION"
          value={data.location}
          onChange={(v) => updateField('location', v)}
          horizontal
          placeholder="e.g. Yogyakarta, Indonesia"
        />

        <InputField 
          label="DESCRIPTION"
          value={data.description || ''}
          onChange={(v) => updateField('description', v)}
          type="textarea"
          rows={3}
          horizontal
          placeholder="e.g. GPA: 3.9/4.0. Focused on Cybersecurity..."
        />
      </div>
    </div>
  )
}
