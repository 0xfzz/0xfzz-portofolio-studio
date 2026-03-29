import React, { useState } from 'react'
import { InputField } from './ui/InputField'

export function EducationForm() {
    const [institution, setInstitution] = useState('Universitas Teknologi Yogyakarta')
    const [degree, setDegree] = useState('Bachelor of Informatics')
    const [startYear, setStartYear] = useState('JUN 2023')
    const [endYear, setEndYear] = useState('PRESENT')
    const [location, setLocation] = useState('Mlati, Sleman')

  return (
    <div className="bg-white p-14 border border-[#f0f0f0] w-full max-w-[860px] font-mono">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-16 px-1">
        <div>
          <h2 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight leading-tight">
            {institution || 'Untitled Institution'}
          </h2>
          <span className="text-[12px] font-bold text-[#1a1a1a] opacity-60 uppercase tracking-wider block mt-2">
            {degree || 'Degree'} | {startYear || 'Start'} — {endYear || 'End'}
          </span>
        </div>
      </div>

      {/* Form Fields - Horizontal Layout */}
      <div className="space-y-10">
        <InputField 
          label="Institution"
          value={institution}
          onChange={setInstitution}
          horizontal
        />
        
        <InputField 
          label="Degree"
          value={degree}
          onChange={setDegree}
          horizontal
        />

        <div className="flex items-center gap-4">
          <label className="text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a] opacity-60 w-48 shrink-0 px-1">
            Period
          </label>
          <div className="flex items-center gap-4 w-full">
            <InputField 
              label="Start Year"
              value={startYear}
              onChange={setStartYear}
              className="flex-1"
            />
            <span className="text-[12px] font-bold text-[#1a1a1a] opacity-60 uppercase tracking-wider px-8 shrink-0">To</span>
            <InputField 
              label="End Year"
              value={endYear}
              onChange={setEndYear}
              className="flex-1"
            />
          </div>
        </div>

        <InputField 
          label="Location"
          value={location}
          onChange={setLocation}
          horizontal
        />
      </div>
    </div>
  )
}
