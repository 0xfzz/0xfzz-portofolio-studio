'use client'

import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'neutral' | 'tag' | 'ghost'
  className?: string
}

export function Badge({ children, variant = 'tag', className = '' }: BadgeProps) {
  const baseStyles = 'px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider rounded-sm border'
  
  const variants = {
    success: 'bg-[#7a7a5a] text-white border-none',
    neutral: 'bg-[#efefef] text-[#a0a0a0] border border-[#d5d5d5]',
    tag: 'bg-[#f5f5f5] text-[#1a1a1a] border border-[#e5e5e5]',
    ghost: 'text-[#a0a0a0] border border-transparent'
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
