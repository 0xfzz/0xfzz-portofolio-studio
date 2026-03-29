import React, { useState } from 'react'
import { InputField } from './ui/InputField'

export function AwardForm() {
  const [title, setTitle] = useState('3rd Winner of LKS Web Technology 2022')
  const [date, setDate] = useState('MAY 2022')
  const [issuer, setIssuer] = useState('Daerah Istimewa Yogyakarta')
  const [description, setDescription] = useState('Membangun situs web penyaji data IMDb menggunakan scraping JavaScript. Tech stack: Nest.js (Backend) dan Nuxt.js (Frontend).')

  return (
    <div className="bg-white p-14 border border-[#f0f0f0] w-full max-w-[860px] font-mono">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-16 px-1">
        <div>
          <h2 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight leading-tight max-w-[500px]">
            {title || 'Untiled Award'}
          </h2>
          <span className="text-[12px] font-bold text-[#1a1a1a] opacity-60 uppercase tracking-wider block mt-2">
            {date || 'No Date'} — {issuer || 'No Issuer'}
          </span>
        </div>
      </div>

      {/* Form Fields - Horizontal Layout */}
      <div className="space-y-10">
        <InputField 
          label="Title"
          value={title}
          onChange={setTitle}
          horizontal
        />
        
        <InputField 
          label="Date"
          value={date}
          onChange={setDate}
          horizontal
        />

        <InputField 
          label="Issuer"
          value={issuer}
          onChange={setIssuer}
          horizontal
        />

        <InputField 
          label="Description"
          value={description}
          onChange={setDescription}
          type="textarea"
          rows={6}
          className="border-[#999] px-5 py-5 text-[14px] bg-white"
        />
      </div>
    </div>
  )
}
