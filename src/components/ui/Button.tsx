'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-sans font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 rounded-sm'
  
  const variants = {
    primary: 'bg-[#2d2d2d] text-white hover:bg-[#1a1a1a] border border-[#2d2d2d]',
    secondary: 'bg-white text-[#1a1a1a] border border-gray-200 hover:bg-gray-50',
    destructive: 'bg-[#991b1b] text-white border border-[#991b1b] hover:bg-[#7f1d1d]',
    ghost: 'text-gray-500 hover:text-[#1a1a1a] border border-transparent hover:bg-gray-50',
    outline: 'border border-gray-200 text-[#1a1a1a] hover:bg-gray-50 bg-white'
  }

  const sizes = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-6 py-2.5 text-[12px]',
    lg: 'px-10 py-3.5 text-[13px]'
  }

  const variantStyles = variants[variant]
  const sizeStyles = sizes[size]

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
