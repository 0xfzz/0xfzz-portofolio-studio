'use client'

import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'neutral' | 'tag' | 'ghost'
  className?: string
}

export function Badge({ children, variant = 'tag', className = '' }: BadgeProps) {
  const baseStyles = 'px-2 py-0.5 text-[11px] font-sans font-semibold tracking-wider rounded-[2px] border uppercase'
  
  const variants = {
    success: 'bg-[#7a8276] text-white border-transparent',
    neutral: 'bg-transparent text-gray-500 border-gray-300 font-bold',
    tag: 'bg-[#f0f0f0] text-gray-600 border-[#d1d1d1] font-sans text-[11px] py-1 px-2.5',
    ghost: 'text-gray-500 border-transparent'
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
