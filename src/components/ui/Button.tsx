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
  const baseStyles = 'font-sans font-bold uppercase tracking-widest transition-all transition-colors flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-[#1a1a1a] text-white hover:bg-black',
    secondary: 'bg-[#f5f5f5] text-[#1a1a1a] hover:bg-[#ebebeb]',
    destructive: 'text-[#ff4d4f] hover:underline',
    ghost: 'text-[#a0a0a0] hover:text-[#1a1a1a]',
    outline: 'border border-[#e5e5e5] text-[#1a1a1a] hover:border-black bg-white'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-6 py-3 text-[11px]',
    lg: 'px-8 py-4 text-[12px]'
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
