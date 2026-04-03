'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, LayoutPanelLeft } from 'lucide-react'
import { cn } from '@/utils/cn'


interface CollapsibleSidebarProps {
  children: React.ReactNode
  title?: string
  initialCollapsed?: boolean
  className?: string
}

export function CollapsibleSidebar({
  children,
  title = "METADATA",
  initialCollapsed = false,
  className
}: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-[#fafafa] border-r border-gray-200 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-12" : "w-[400px]",
        className
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 focus:outline-none shadow-sm"
        title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Sidebar Header (Icon only when collapsed) */}
      <div className={cn(
        "h-[60px] border-b border-gray-100 flex items-center px-4 shrink-0 overflow-hidden bg-white",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <LayoutPanelLeft className="w-4 h-4 text-gray-400" />
            <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">
              {title}
            </span>
          </div>
        )}
        {isCollapsed && <LayoutPanelLeft className="w-5 h-5 text-gray-400" />}
      </div>

      {/* Sidebar Content (Hidden when collapsed) */}
      <div className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-8 px-6",
        isCollapsed ? "opacity-0 invisible" : "opacity-100 visible delay-100"
      )}>
        {children}
      </div>

      {/* Focus Mode Indicator (Visible when collapsed) */}
      {isCollapsed && (
        <div className="flex-1 flex items-center justify-center [writing-mode:vertical-lr] py-4">
          <span className="text-[13px] font-mono font-semibold text-gray-400 uppercase rotate-180">
            Metadata Sidebar
          </span>
        </div>
      )}
    </div>
  )
}
