import React, { useEffect, useState } from 'react'
import { X, RefreshCw, FileText, AlertCircle } from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'

interface DiffFile {
  filename: string
  type: string
  raw: string
}

export function DiffViewer() {
  const { setIsDiffOpen, refreshStatus } = useDashboard()
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<DiffFile[]>([])
  const [activeFile, setActiveFile] = useState<string | null>(null)
  
  const [message, setMessage] = useState('chore: update portfolio content via CMS')
  const [pushing, setPushing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDiffs()
  }, [])

  const fetchDiffs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/git/diff')
      const data = await res.json()
      if (data.files) {
        setFiles(data.files)
        if (data.files.length > 0) setActiveFile(data.files[0].filename)
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
        await refreshStatus()
        setIsDiffOpen(false)
      } else {
        const data = await res.json()
        setError(data.error || 'Push failed')
      }
    } catch (err) {
      setError('Network error occurred during push')
    } finally {
      setPushing(false)
    }
  }

  const currentDiff = files.find(f => f.filename === activeFile)
  const diffLines = currentDiff?.raw ? currentDiff.raw.split('\n').slice(4) : [] // Skip git header lines

  return (
    <div className="bg-white border border-gray-200 w-[950px] max-w-[95vw] mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-[13px] font-mono flex flex-col pt-1 overflow-hidden rounded-[2px] h-[75vh]">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#FAFAFA]">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-[0.2em] text-[#333] uppercase text-[11px]">Repository Diff</span>
          <span className="bg-gray-800 text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">
            {files.length}
          </span>
        </div>
        <button 
          onClick={() => setIsDiffOpen(false)}
          className="text-gray-400 hover:text-gray-800 transition-colors text-[16px] font-sans"
        >
          [ × ]
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: File List */}
        <div className="w-64 border-r border-gray-100 bg-gray-50/30 overflow-y-auto">
          {loading ? (
            <div className="p-6 flex justify-center"><RefreshCw className="w-5 h-5 animate-spin text-gray-300" /></div>
          ) : files.length === 0 ? (
            <div className="p-6 text-gray-400 text-center italic text-[11px]">No pending changes</div>
          ) : (
            files.map(file => (
              <button
                key={file.filename}
                onClick={() => setActiveFile(file.filename)}
                className={`w-full text-left px-5 py-3 border-b border-gray-100 flex items-center gap-3 transition-colors ${activeFile === file.filename ? 'bg-white border-l-2 border-l-gray-800 text-gray-900 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <div className={`w-2 h-2 rounded-full ${file.type === 'M' ? 'bg-orange-400' : file.type === 'A' ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="truncate flex-1">{file.filename}</span>
              </button>
            ))
          )}
        </div>

        {/* Content: Diff Body */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto p-0 font-mono text-[12px] leading-relaxed">
            {loading ? (
               <div className="h-full flex items-center justify-center text-gray-400 uppercase tracking-widest text-[10px]">Analyzing Repository...</div>
            ) : !activeFile ? (
               <div className="h-full flex items-center justify-center text-gray-400 uppercase tracking-widest text-[10px]">Workspace is clean</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {diffLines.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 font-sans italic">Binary file or no line changes detected</div>
                ) : (
                  diffLines.map((line, idx) => (
                    <div 
                      key={idx} 
                      className={`flex group ${line.startsWith('+') ? 'bg-[#eefcf1] text-[#1a7f37]' : line.startsWith('-') ? 'bg-[#ffeef0] text-[#cf222e]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <span className="w-12 shrink-0 text-center opacity-30 select-none border-r border-gray-100 py-1 text-[10px]">{idx + 1}</span>
                      <span className={`w-6 shrink-0 text-center select-none py-1 font-bold ${line.startsWith('+') ? 'opacity-100' : 'opacity-30'}`}>{line[0] === '+' ? '+' : line[0] === '-' ? '-' : ''}</span>
                      <pre className="flex-1 py-1 px-2 whitespace-pre-wrap break-all">{line.startsWith('+') || line.startsWith('-') ? line.slice(1) : line}</pre>
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
        {error && <div className="text-red-500 text-[11px] flex items-center gap-2 mb-2"><AlertCircle className="w-3.5 h-3.5" /> {error}</div>}
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Commit message..."
              className="w-full bg-white border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-800 transition-colors text-[13px] font-sans"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsDiffOpen(false)}
              className="px-8 py-2.5 border border-gray-300 text-[11px] font-sans font-bold hover:bg-gray-50 uppercase tracking-widest text-gray-600 transition-all rounded-none"
            >
              CANCEL
            </button>
            <button 
              onClick={handlePush}
              disabled={pushing || files.length === 0}
              className="px-8 py-2.5 bg-gray-800 hover:bg-black text-white text-[11px] font-sans font-bold tracking-widest uppercase transition-all rounded-none disabled:opacity-30 flex items-center gap-2 shadow-sm"
            >
              {pushing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              {pushing ? 'PUSHING...' : 'PUSH CHANGES'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
