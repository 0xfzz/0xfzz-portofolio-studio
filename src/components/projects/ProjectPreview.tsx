'use client'

import React from 'react'
import { Monitor, Tablet, Smartphone, ExternalLink, Code } from 'lucide-react'
import { MarkdownRenderer } from '@/components/editor/MarkdownRenderer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface ProjectPreviewProps {
  data: {
    title: string
    description: string
    imageUrl: string
    liveUrl?: string
    sourceUrl: string
    technologies: string[]
    content: string
  }
}

export function ProjectPreview({ data }: ProjectPreviewProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#fafafa] flex flex-col scrollbar-hide">
      {/* Preview Header */}
      <div className="h-[60px] border-b border-[#f0f0f0] px-10 flex items-center justify-between bg-white shrink-0">
        <span className="text-[12px] font-bold text-[#a0a0a0] uppercase tracking-wider">Preview</span>
        <div className="flex items-center gap-4 text-[#a0a0a0]">
          <Monitor className="w-4 h-4 cursor-pointer hover:text-[#1a1a1a]" />
          <Tablet className="w-4 h-4 cursor-pointer hover:text-[#1a1a1a]" />
          <Smartphone className="w-4 h-4 cursor-pointer hover:text-[#1a1a1a]" />
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-16 max-w-[800px] mx-auto w-full space-y-12 flex-1 pb-32">
        {/* Project Hero */}
        <div className="aspect-video bg-[#1a1a1a] rounded-sm overflow-hidden flex items-center justify-center relative border border-[#f0f0f0]">
          {data.imageUrl ? (
            <img src={data.imageUrl} className="w-full h-full object-cover" alt="Preview" />
          ) : (
             <div className="text-[#1a1a1a] opacity-20 font-mono text-[12px] uppercase tracking-wider">Image Preview Area</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
               {data.technologies.map(tech => (
                 <Badge key={tech} variant="tag">{tech}</Badge>
               ))}
            </div>
            <h1 className="text-[48px] font-bold text-[#1a1a1a] tracking-tight leading-none mb-6">
              {data.title || 'Untitled Project'}
            </h1>
            <div className="text-[18px] text-[#888] font-medium leading-relaxed max-w-[600px] prose-slate">
              <MarkdownRenderer content={data.description || 'Project description goes here...'} />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <a href={data.liveUrl || '#'}>
              <Button variant="primary">
                <ExternalLink className="w-4 h-4" /> Live Demo
              </Button>
            </a>
            <a href={data.sourceUrl || '#'}>
              <Button variant="outline">
                <Code className="w-4 h-4" /> Source Code
              </Button>
            </a>
          </div>

          <div className="space-y-12 pt-16 border-t border-[#eee]">
            <MarkdownRenderer content={data.content} />
          </div>
        </div>
      </div>
    </div>
  )
}
