'use client'

import React from 'react'
import { Field, Label, Input as HeadlessInput } from '@headlessui/react'

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'textarea' | 'password'
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
  const containerClasses = horizontal ? 'flex items-center gap-4' : 'space-y-1.5'
  const labelClasses = `text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500 ${horizontal ? 'w-48 shrink-0' : ''}`
  const inputClasses = `w-full border border-gray-100 px-4 py-3 text-[13px] font-sans focus:outline-none focus:border-gray-900 focus:ring-0 transition-all bg-white rounded-[2px] placeholder:text-gray-300 ${className}`
  const textareaClasses = `w-full border border-gray-100 px-6 py-5 text-[15px] font-sans focus:outline-none focus:border-gray-900 focus:ring-0 transition-all bg-white rounded-[2px] resize-none leading-[1.8] text-[#333] tracking-tight placeholder:text-gray-300 ${className}`

  return (
    <Field className={containerClasses}>
      <Label className={labelClasses}>{label}</Label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={textareaClasses}
        />
      ) : (
        <HeadlessInput
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </Field>
  )
}
