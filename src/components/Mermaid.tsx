'use client'

import React, { useEffect, useRef } from 'react'
// @ts-ignore
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    primaryColor: '#ffffff',
    primaryTextColor: '#1a1a1a',
    primaryBorderColor: '#1a1a1a',
    lineColor: '#1a1a1a',
    secondaryColor: '#f9f9f9',
    tertiaryColor: '#ffffff',
    fontSize: '14px',
    fontFamily: 'monospace'
  },
  securityLevel: 'loose',
})

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      // Clear previous rendering
      ref.current.removeAttribute('data-processed')
      mermaid.contentLoaded()
    }
  }, [chart])

  return (
    <div className="mermaid bg-[#fcfcfc] border border-[#f0f0f0] p-8 my-10 flex justify-center overflow-x-auto rounded-sm" ref={ref}>
      {chart}
    </div>
  )
}
