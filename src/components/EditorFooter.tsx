'use client'

import React, { useState } from 'react'
import { ChevronDown, RefreshCw, Check } from 'lucide-react'

interface EditorFooterProps {
  onSave?: () => void
  saving?: boolean
  lastSaved?: string
  wordCount?: number
  published?: boolean
  onPublishedChange?: (val: boolean) => void
}

export function EditorFooter({ 
  onSave, 
  saving = false, 
  lastSaved = '2024-05-24 14:22:01 UTC',
  wordCount = 0,
  published = false,
  onPublishedChange
}: EditorFooterProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  return (
    <div className="h-[60px] bg-[#fafafa] border-t border-gray-200 px-10 flex items-center justify-between shrink-0 text-gray-500 z-50">
      <div className="flex items-center gap-12 text-[11px] font-mono tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">LAST SAVED:</span>
          <span className="font-semibold text-gray-600">{lastSaved}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">WORDS:</span>
          <span className="font-semibold text-gray-600">{wordCount}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Status Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="h-[32px] bg-white border border-gray-300 px-4 flex items-center justify-between gap-6 group hover:border-gray-400 transition-colors rounded-[2px] min-w-[120px]"
          >
            <span className={`text-[11px] font-sans font-bold uppercase tracking-widest ${published ? 'text-green-600' : 'text-gray-600'}`}>
              {published ? 'PUBLISHED' : 'DRAFT'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>

          {showStatusMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-200 py-1 z-[100] animate-in fade-in slide-in-from-bottom-2">
              <button 
                onClick={() => {
                   onPublishedChange?.(false)
                   setShowStatusMenu(false)
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors"
              >
                <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-900">DRAFT</span>
                {!published && <Check className="w-3.5 h-3.5 text-gray-900" />}
              </button>
              <button 
                onClick={() => {
                   onPublishedChange?.(true)
                   setShowStatusMenu(false)
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors border-t border-gray-50"
              >
                <span className="text-[11px] font-mono font-bold text-green-600 uppercase tracking-widest group-hover:text-green-700">PUBLISHED</span>
                {published && <Check className="w-3.5 h-3.5 text-green-600" />}
              </button>
            </div>
          )}
          
          {/* Backdrop for closing menu */}
          {showStatusMenu && (
            <div className="fixed inset-0 z-[-1]" onClick={() => setShowStatusMenu(false)} />
          )}
        </div>

        <button 
          onClick={onSave}
          disabled={saving || !onSave}
          className="h-[32px] bg-[#2d2d2d] text-white px-8 text-[11px] font-sans font-medium uppercase tracking-wider hover:bg-[#1a1a1a] transition-colors rounded-[2px] flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>
    </div>
  )
}
