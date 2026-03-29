import React from 'react'
import { Plus } from 'lucide-react'
import { InputField } from './ui/InputField'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { slugify } from '@/utils/string'

interface BlogEditorProps {
  data: {
    title: string
    slug: string
    excerpt: string
    imageUrl: string
    tags: string[]
    content: string
  }
  onChange: (newData: any) => void
}

export function BlogEditor({ data, onChange }: BlogEditorProps) {
  const updateField = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    if (field === 'title') {
      newData.slug = slugify(value)
    }
    onChange(newData)
  }

  return (
    <div className="flex-1 overflow-y-auto p-12 space-y-12 font-mono scrollbar-hide border-r border-[#f0f0f0] bg-white">
      <div>
        <span className="text-[12px] font-mono font-bold text-[#1a1a1a] opacity-60 uppercase tracking-wider block mb-2">Entry Metadata</span>
        <h2 className="text-[32px] font-sans font-bold text-[#1a1a1a] tracking-tight leading-none uppercase">{data.title || 'Untitled Entry'}</h2>
      </div>

      <div className="space-y-10">
        <InputField 
          label="Title"
          value={data.title}
          onChange={(val) => updateField('title', val)}
        />

        <InputField 
          label="Slug"
          value={data.slug}
          onChange={(val) => updateField('slug', val)}
        />

        <InputField 
          label="Excerpt"
          value={data.excerpt}
          onChange={(val) => updateField('excerpt', val)}
          type="textarea"
          rows={3}
        />

        <InputField 
          label="Image URL"
          value={data.imageUrl}
          onChange={(val) => updateField('imageUrl', val)}
          type="textarea"
          rows={3}
        />

        <div className="space-y-4">
          <label className="text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a] opacity-60">Tags</label>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="tag" className="px-3 py-1.5">{tag}</Badge>
            ))}
            <button className="h-8 border border-[#e5e5e5] border-dashed px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a] opacity-60 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all flex items-center gap-2">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
        </div>

        <InputField 
          label="Markdown Content"
          value={data.content}
          onChange={(val) => updateField('content', val)}
          type="textarea"
          rows={20}
          className="border-[#f0f0f0] px-6 py-6 text-[14px] bg-[#fcfcfc]"
        />
      </div>
    </div>
  )
}
