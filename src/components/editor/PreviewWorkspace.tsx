'use client'

import React from 'react'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PreviewWorkspaceProps {
  title: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function PreviewWorkspace({
  title,
  children,
  className,
  contentClassName
}: PreviewWorkspaceProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto bg-white flex flex-col scrollbar-hide", className)}>
      {/* Shared Preview Header */}
      <div className="h-[60px] border-b border-gray-100 px-10 flex items-center justify-between bg-white shrink-0 sticky top-0 z-20">
        <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </span>
      </div>

      {/* Main Content Area */}
      <div className={cn("p-16 w-full space-y-12 flex-1 pb-32", contentClassName)}>
        <div className="max-w-[800px] mx-auto space-y-10">
          {children}
        </div>
      </div>
    </div>
  )
}
