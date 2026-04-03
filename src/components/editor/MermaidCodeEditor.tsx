import React from 'react'
import { CodeBlockEditorProps, useCodeBlockEditorContext } from '@mdxeditor/editor'
import { InteractiveMermaid } from './InteractiveMermaid'

export function MermaidCodeEditor({ code, language }: CodeBlockEditorProps) {
  const { setCode } = useCodeBlockEditorContext()

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-50/50 rounded-lg border border-gray-100 shadow-sm my-6">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Mermaid Diagram Code</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
        </div>
      </div>

      <textarea
        className="w-full h-[200px] font-mono text-[13px] bg-white border border-gray-200 rounded p-4 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all resize-y text-gray-600 leading-relaxed"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      />

      <div className="mt-8 border-t border-gray-100 pt-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Live Diagram Preview</span>
          <div className="h-px flex-1 bg-gray-50" />
        </div>
        
        <InteractiveMermaid chart={code} minHeight="400px" />
      </div>
    </div>
  )
}
