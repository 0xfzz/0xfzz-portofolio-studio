'use client'

import React from 'react'
import { RefreshCw } from 'lucide-react'

interface ActionsCardProps {
  onSave?: () => void
  onReset?: () => void
  saving?: boolean
  status?: 'idle' | 'success' | 'error'
}

export function ActionsCard({ 
  onSave, 
  onReset, 
  saving = false,
  status = 'idle'
}: ActionsCardProps) {
  return (
    <div className="bg-white border border-gray-200 p-8 rounded-[2px] transition-all">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-6">
        ACTIONS
      </span>
      
      <div className="flex flex-col gap-3">
        {status === 'success' && (
          <div className="bg-gray-900 text-white px-4 py-2 border border-gray-800 text-[10px] font-mono font-bold uppercase tracking-[0.1em] rounded-[2px] mb-2 animate-in fade-in slide-in-from-top-1 text-center">
            SAVED SUCCESSFULLY
          </div>
        )}
        
        <button 
          onClick={onSave}
          disabled={saving || !onSave}
          className="w-full bg-[#333] text-white py-3 px-6 font-sans font-medium text-[11px] tracking-wider uppercase hover:bg-[#1a1a1a] transition-all rounded-[2px] flex items-center justify-center disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
          {saving ? 'SAVING...' : 'SAVE LOCALLY'}
        </button>

        {onReset && (
          <button 
            onClick={onReset}
            className="w-full bg-white border border-gray-200 text-gray-600 py-3 px-6 font-sans font-medium text-[11px] tracking-wider uppercase hover:bg-gray-50 transition-all rounded-[2px]"
          >
            RESET
          </button>
        )}
      </div>
    </div>
  )
}
