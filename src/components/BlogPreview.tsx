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
        <span className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-[0.2em]">Preview</span>
        <div className="flex items-center gap-4 text-[#a0a0a0]">
          <Monitor className="w-4 h-4 cursor-pointer hover:text-[#1a1a1a]" />
          <Tablet className="w-4 h-4 cursor-pointer hover:text-[#1a1a1a]" />
          <Smartphone className="w-4 h-4 cursor-pointer hover:text-[#1a1a1a]" />
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-16 max-w-[800px] mx-auto w-full space-y-12 flex-1 pb-32">
        {/* Blog Hero */}
        <div className="aspect-[21/9] bg-[#1a1a1a] rounded-sm overflow-hidden flex items-center justify-center relative shadow-2xl">
          {data.imageUrl ? (
            <img src={data.imageUrl} className="w-full h-full object-cover opacity-80" alt="Preview" />
          ) : (
            <div className="text-[#333] font-mono text-[10px] uppercase tracking-widest">Image Preview Area</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex gap-2 mb-3">
              {data.tags.map(tag => (
                <Badge key={tag} variant="tag" className="bg-white/10 text-white border-white/20 backdrop-blur-md">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-[32px] font-bold text-white tracking-tight leading-tight">
              {data.title || 'Entry Title'}
            </h1>
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex items-center gap-4 py-6 border-b border-[#eee]">
            <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-[#1a1a1a]" />
            </div>
            <div>
              <span className="text-[12px] font-bold text-[#1a1a1a] block">0xfzz</span>
              <span className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest">Architect & Author</span>
            </div>
          </div>

          <div className="pt-6">
            <MarkdownRenderer content={data.content} />
          </div>
        </div>
      </div>
    </div>
  )
}
