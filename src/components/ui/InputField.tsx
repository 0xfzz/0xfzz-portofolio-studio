'use client'

import React from 'react'
import { Field, Label, Input as HeadlessInput } from '@headlessui/react'

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'textarea'
  rows?: number
  className?: string
  placeholder?: string
  horizontal?: boolean
}

export function InputField({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  rows = 3, 
  className = '', 
  placeholder = '',
  horizontal = false
}: InputFieldProps) {
  const containerClasses = horizontal ? 'flex items-center gap-4' : 'space-y-3'
  const labelClasses = `text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0] ${horizontal ? 'w-48 shrink-0' : ''}`
  const inputClasses = `w-full border border-[#e5e5e5] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-black transition-all bg-[#fbfbfb] ${className}`

  return (
    <Field className={containerClasses}>
      <Label className={labelClasses}>{label}</Label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={`${inputClasses} resize-none leading-relaxed`}
        />
      ) : (
        <HeadlessInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </Field>
  )
}
