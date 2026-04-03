'use client'

import React, { useEffect, useRef } from 'react'
// @ts-ignore
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#ffffff',
    primaryTextColor: '#1a1a1a',
    primaryBorderColor: '#1a1a1a',
    lineColor: '#1a1a1a',
    secondaryColor: '#f9f9f9',
    tertiaryColor: '#ffffff',
    fontSize: '20px',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  sequence: {
    useMaxWidth: false,
    width: 250,
  },
  flowchart: {
    useMaxWidth: false,
  },
  securityLevel: 'loose',
})

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderChart = async () => {
      if (ref.current && chart) {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
          const { svg } = await mermaid.render(id, chart)
          ref.current.innerHTML = svg
          
          // Fix SVG to not be restricted by max-width/height
          const svgElement = ref.current.querySelector('svg')
          if (svgElement) {
             svgElement.style.maxWidth = 'none'
             svgElement.style.height = 'auto'
          }
        } catch (error) {
          console.error('Mermaid render error:', error)
          ref.current.innerHTML = `<span class="text-red-400 font-mono text-xs italic">Syntax Error: ${error}</span>`
        }
      }
    }
    renderChart()
  }, [chart])

  return (
    <div 
      className="bg-white p-4 font-sans overflow-x-auto min-h-[100px]" 
      ref={ref} 
    />
  )
}
