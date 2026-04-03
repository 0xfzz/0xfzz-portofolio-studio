'use client'

import React from 'react'
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Mermaid } from './Mermaid'

interface InteractiveMermaidProps {
  chart: string
  minHeight?: string
  showControls?: boolean
}

const ZoomControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls()
  return (
    <div className="absolute bottom-6 right-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button 
        onClick={() => zoomIn()}
        className="p-2 bg-white/90 backdrop-blur border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900 focus:outline-none"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button 
        onClick={() => zoomOut()}
        className="p-2 bg-white/90 backdrop-blur border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900 focus:outline-none"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button 
        onClick={() => resetTransform()}
        className="p-2 bg-white/90 backdrop-blur border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900 focus:outline-none"
        title="Reset View"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  )
}

export function InteractiveMermaid({ 
  chart, 
  minHeight = '400px', 
  showControls = true 
}: InteractiveMermaidProps) {
  if (!chart.trim()) {
    return (
      <div className="p-10 flex justify-center items-center bg-gray-50/50 rounded border border-dashed border-gray-200 min-h-[100px]">
        <span className="text-gray-300 font-mono text-[11px] uppercase italic">Waiting for valid mermaid code...</span>
      </div>
    )
  }

  return (
    <div 
      className="relative bg-white rounded border border-gray-100 flex flex-col overflow-hidden group cursor-grab active:cursor-grabbing"
      style={{ minHeight }}
    >
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={10}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
      >
        {showControls && <ZoomControls />}
        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="flex items-center justify-center p-20"
        >
          <div className="w-full h-full flex items-center justify-center">
            <Mermaid chart={chart} />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
