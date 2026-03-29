'use client'

import React from 'react'
import { Monitor, Tablet, Smartphone, BadgeCheck } from 'lucide-react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { Badge } from './ui/Badge'

interface BlogPreviewProps {
  data: {
    title: string
    slug: string
    excerpt: string
    imageUrl: string
    tags: string[]
    content: string
  }
}

export function BlogPreview({ data }: BlogPreviewProps) {
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
      <div className="p-16 w-full space-y-12 flex-1 pb-32">
        <div className="max-w-[800px] mx-auto space-y-10">
          {/* Main Hero Image - Large, Centered */}
          <div className="aspect-[16/9] bg-[#1a1a1a] rounded-sm overflow-hidden flex items-center justify-center relative border border-[#f0f0f0]">
            {data.imageUrl ? (
              <img src={data.imageUrl} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="text-[#1a1a1a] opacity-20 font-mono text-[12px] uppercase tracking-wider">Image Preview Area</div>
            )}
          </div>

          <div className="space-y-8">
            <h1 className="text-[36px] font-sans font-extrabold text-[#1a1a1a] tracking-tight leading-tight">
              {data.title || 'Entry Title'}
            </h1>

            <div className="pt-4">
              <MarkdownRenderer content={data.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
