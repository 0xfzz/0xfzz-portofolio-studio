'use client'

import React, { useEffect, useState } from 'react'
import { X, RefreshCw, FileText, AlertCircle, GitCommit, Cloud, Terminal, Trash2, ChevronDown, RotateCcw } from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'
import { useNotification } from '@/context/NotificationContext'

interface DiffFile {
  file: string
  type: string
  raw: string
  category: 'LOCAL' | 'LOCAL COMMIT'
  commitMsg?: string
}

export function DiffViewer() {
  const { showToast, confirm } = useNotification()
  const { setIsDiffOpen, refreshStatus } = useDashboard()
  const [loading, setLoading] = useState(true)
  const [localFiles, setLocalFiles] = useState<DiffFile[]>([])
  const [unpushedFiles, setUnpushedFiles] = useState<DiffFile[]>([])
  const [syncedCommits, setSyncedCommits] = useState<any[]>([])
  const [activeFile, setActiveFile] = useState<string | null>(null)
  
  const [message, setMessage] = useState('chore: update portfolio content via CMS')
  const [pushing, setPushing] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [showDiscardMenu, setShowDiscardMenu] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDiffs()
  }, [])

  const fetchDiffs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/git/diff')
      const data = await res.json()
      
      setLocalFiles(data.local || [])
      setUnpushedFiles(data.unpushed || [])
      setSyncedCommits(data.synced || [])

      if (data.local && data.local.length > 0) {
        setActiveFile(data.local[0].file)
      } else if (data.unpushed && data.unpushed.length > 0) {
        setActiveFile(data.unpushed[0].file)
      }
    } catch (err) {
      setError('Failed to fetch repository diffs')
    } finally {
      setLoading(false)
    }
  }

  const handlePush = async () => {
    if (!message.trim()) {
      setError('Commit message is required');
      return;
    }

    try {
      setPushing(true)
      setError(null)
      const res = await fetch('/api/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      
      if (res.ok) {
        showToast('Changes committed & pushed', 'success')
        await refreshStatus()
        setIsDiffOpen(false)
      } else {
        const data = await res.json()
        setError(data.error || 'Push failed')
        showToast('Push failed', 'error')
      }
    } catch (err) {
      setError('Network error occurred during push')
      showToast('Network error during push', 'error')
    } finally {
      setPushing(false)
    }
  }

  const handleReset = async (mode: 'soft' | 'hard') => {
    const confirmMsg = mode === 'soft' 
      ? "This will delete your local commits but KEEP your draft edits. Proceed?" 
      : "CRITICAL: This will DELETE BOTH your local commits and ALL your draft edits. This cannot be undone. Proceed?";
    
    const confirmed = await confirm({
      title: mode === 'soft' ? 'Soft Reset' : 'Hard Reset',
      message: confirmMsg,
      variant: mode === 'hard' ? 'destructive' : 'primary',
      confirmText: 'Reset Now'
    })

    if (!confirmed) return;

    try {
      setResetting(true)
      setShowDiscardMenu(false)
      setError(null)
      const res = await fetch('/api/git/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      })
      
      if (res.ok) {
        showToast(`Repository reset (${mode}) successful`, 'success')
        await refreshStatus()
        await fetchDiffs() // Refresh view
      } else {
        const data = await res.json()
        setError(data.error || 'Reset failed')
        showToast('Reset failed', 'error')
      }
    } catch (err) {
      setError('Network error occurred during reset')
      showToast('Network error during reset', 'error')
    } finally {
      setResetting(false)
    }
  }

  const allDiffFiles = [...localFiles, ...unpushedFiles]
  const currentDiff = allDiffFiles.find(f => f.file === activeFile)
  const diffLines = currentDiff?.raw ? currentDiff.raw.split('\n').slice(4) : []

  return (
    <div className="bg-white border border-gray-200 w-[1000px] max-w-[95vw] mx-auto text-[13px] font-mono flex flex-col pt-1 overflow-hidden rounded-[2px] h-[80vh]">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#FAFAFA]">
        <div className="flex items-center gap-4">
          <span className="font-semibold tracking-[0.2em] text-[#333] uppercase text-[11px]">Source Explorer</span>
          <div className="flex items-center gap-3">
             <span className="bg-olive-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-[1px] flex items-center justify-center min-w-[32px]">
               {localFiles.length} DRAFT
             </span>
             {unpushedFiles.length > 0 && (
               <span className="bg-gray-800 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-[1px] flex items-center justify-center min-w-[32px]">
                 {unpushedFiles.length} PENDING PUSH
               </span>
             )}
          </div>
        </div>
        <button 
          onClick={() => setIsDiffOpen(false)}
          className="text-gray-400 hover:text-gray-800 transition-colors text-[16px] font-sans"
        >
          [ × CLOSE ]
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-100 bg-gray-50/30 overflow-y-auto custom-scrollbar">
          
          <div className="px-5 py-3 bg-white border-b border-gray-100 sticky top-0 z-10 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">(LOCAL)</span>
             </div>
             {localFiles.length === 0 && <span className="text-[9px] text-gray-300">CLEAN</span>}
          </div>
          {localFiles.map(file => (
            <button
              key={file.file + 'local'}
              onClick={() => setActiveFile(file.file)}
              className={`w-full text-left px-5 py-3 border-b border-gray-100 flex flex-col gap-1 transition-colors ${activeFile === file.file && localFiles.includes(file) ? 'bg-white border-l-2 border-l-olive-500 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${file.type === 'M' ? 'bg-orange-400' : 'bg-green-400'}`} />
                <span className={`truncate flex-1 text-[11px] ${activeFile === file.file && localFiles.includes(file) ? 'font-bold' : ''}`}>
                  {file.file}
                </span>
              </div>
            </button>
          ))}

          {unpushedFiles.length > 0 && (
            <>
              <div className="px-5 py-3 bg-white border-b border-gray-100 sticky top-0 z-10 mt-4 flex items-center gap-2">
                <GitCommit className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">(LOCAL COMMIT)</span>
              </div>
              {unpushedFiles.map(file => (
                <button
                  key={file.file + 'unpushed'}
                  onClick={() => setActiveFile(file.file)}
                  className={`w-full text-left px-5 py-3 border-b border-gray-100 flex flex-col gap-1 transition-colors ${activeFile === file.file && unpushedFiles.includes(file) ? 'bg-white border-l-2 border-l-gray-900 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span className={`truncate flex-1 text-[11px] ${activeFile === file.file && unpushedFiles.includes(file) ? 'font-bold' : ''}`}>
                      {file.file}
                    </span>
                  </div>
                  {file.commitMsg && <span className="text-[9px] text-gray-400 italic truncate opacity-70 ml-3.5">{file.commitMsg}</span>}
                </button>
              ))}
            </>
          )}

          <div className="px-5 py-3 bg-white border-b border-gray-100 sticky top-0 z-10 mt-4 flex items-center gap-2">
            <Cloud className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">(SYNCED)</span>
          </div>
          {syncedCommits.map(commit => (
            <div key={commit.hash} className="w-full px-5 py-3 border-b border-gray-100 flex flex-col gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
               <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-gray-400">#{commit.hash.slice(0, 7)}</span>
                  <span className="text-[9px] font-mono text-gray-400 uppercase">{commit.date}</span>
               </div>
               <span className="text-[10px] text-gray-700 leading-tight">{commit.message}</span>
            </div>
          ))}
        </div>

        {/* Diff View Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto p-0 font-mono text-[12px] leading-relaxed custom-scrollbar bg-[#f8f9fa]">
            {!activeFile ? (
               <div className="h-full flex items-center justify-center text-gray-400 uppercase tracking-[0.2em] text-[10px] italic">No active file selected</div>
            ) : (
              <div className="divide-y divide-gray-100/50 bg-white min-h-full">
                {diffLines.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 font-sans italic border-b border-gray-100">No content changes detected</div>
                ) : (
                  diffLines.map((line, idx) => (
                    <div 
                      key={idx} 
                      className={`flex group border-b border-gray-50/30 ${line.startsWith('+') ? 'bg-[#eefcf1] text-[#1a7f37]' : line.startsWith('-') ? 'bg-[#ffeef0] text-[#cf222e]' : 'text-gray-600 hover:bg-gray-50/50'}`}
                    >
                      <span className="w-12 shrink-0 text-center opacity-30 select-none border-r border-gray-100/50 py-1 text-[10px] bg-[#FAFAFA] font-sans">{idx + 1}</span>
                      <span className={`w-6 shrink-0 text-center select-none py-1 font-bold ${line.startsWith('+') ? 'opacity-100' : 'opacity-30'}`}>{line[0] === '+' ? '+' : line[0] === '-' ? '-' : ''}</span>
                      <pre className="flex-1 py-1 px-3 whitespace-pre-wrap break-all">{line.startsWith('+') || line.startsWith('-') ? line.slice(1) : line}</pre>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t border-gray-200 flex flex-col gap-4 bg-[#FAFAFA]">
        {error && <div className="text-red-500 text-[11px] flex items-center gap-2 mb-2 font-bold px-2 py-1 bg-red-50/50 border-l-2 border-red-500 animate-pulse"><AlertCircle className="w-3.5 h-3.5" /> {error}</div>}
        
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="text-[9px] font-mono text-gray-400 uppercase mb-1.5 font-bold tracking-widest pl-1">COMMIT MESSAGE</div>
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your changes..."
              className="w-full bg-white border border-gray-300 px-4 py-2.5 outline-none focus:border-olive-500 transition-all text-[13px] font-sans"
            />
          </div>
          <div className="flex gap-3 pt-6 relative">
            <div className="relative">
              <button 
                onClick={() => setShowDiscardMenu(!showDiscardMenu)}
                disabled={resetting || (localFiles.length === 0 && unpushedFiles.length === 0)}
                className="px-6 py-2.5 border border-gray-300 text-[11px] font-sans font-bold hover:bg-red-50 hover:text-red-600 uppercase tracking-widest text-gray-500 transition-all rounded-none flex items-center gap-2 disabled:opacity-30"
              >
                {resetting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                DISCARD <ChevronDown className="w-3 h-3" />
              </button>
              
              {showDiscardMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-white border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100">
                  <button 
                    onClick={() => handleReset('soft')}
                    className="w-full text-left px-4 py-4 hover:bg-gray-50 flex flex-col gap-1 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-olive-600 font-bold text-[10px] uppercase tracking-widest">
                       <RotateCcw className="w-3 h-3" /> UNDO COMMITS (KEEP EDITS)
                    </div>
                    <span className="text-[9px] text-gray-400 font-sans normal-case leading-tight">Deletes local commits but keeps your draft changes in the sidebar.</span>
                  </button>
                  <button 
                    onClick={() => handleReset('hard')}
                    className="w-full text-left px-4 py-4 hover:bg-red-50 flex flex-col gap-1 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-red-600 font-bold text-[10px] uppercase tracking-widest">
                       <Trash2 className="w-3 h-3" /> RESET TO CLOUD (WIPE ALL)
                    </div>
                    <span className="text-[10px] text-gray-400 font-sans normal-case leading-tight">CRITICAL: Wipes out both local commits and draft changes to match remote.</span>
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsDiffOpen(false)}
              className="px-8 py-2.5 border border-gray-300 text-[11px] font-sans font-bold hover:bg-gray-50 uppercase tracking-widest text-gray-600 transition-all rounded-none"
            >
              CANCEL
            </button>
            <button 
              onClick={handlePush}
              disabled={pushing || (localFiles.length === 0 && unpushedFiles.length === 0)}
              className="px-10 py-2.5 bg-gray-800 hover:bg-black text-white text-[11px] font-sans font-bold tracking-widest uppercase transition-all rounded-none disabled:opacity-30 flex items-center gap-3"
            >
              {pushing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              {pushing ? 'PUSHING DATA...' : 'PUSH CHANGES'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
