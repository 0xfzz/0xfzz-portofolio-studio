'use client'

import React from 'react'
import { GraduationCap } from 'lucide-react'

const educationItems = [
  {
    id: 1,
    institution: 'Universitas Teknologi Yogyakarta',
    subtitle: 'Bachelor of Informatics | JUN 2023 - PRESENT',
  },
  {
    id: 2,
    institution: 'Junior Fullstack @ StartFlow',
    subtitle: '2016 - 2018',
  }
]

export function EducationList() {
  return (
    <div className="w-full">
      <span className="text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a] opacity-60 block mb-6 px-4">
        Education List
      </span>
      
      <div className="bg-white border border-[#f0f0f0] divide-y divide-[#f0f0f0]">
        {educationItems.map((item) => (
          <div key={item.id} className="p-6 px-10 flex items-center justify-between group hover:bg-[#fafafa] transition-colors">
            <div className="flex items-center gap-6">
              <GraduationCap className="w-6 h-6 text-[#a0a0a0]" strokeWidth={1.5} />
              <div>
                <h3 className="text-[14px] font-bold text-[#1a1a1a] tracking-tight">{item.institution}</h3>
                <span className="text-[12px] font-bold text-[#a0a0a0] uppercase tracking-wider mt-0.5 block">{item.subtitle}</span>
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
