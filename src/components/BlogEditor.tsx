import React from 'react'
import { Plus } from 'lucide-react'
import { InputField } from './ui/InputField'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { slugify } from '@/utils/string'

interface BlogData {
  title: string
  slug: string
  excerpt: string
  image: string
  tags: string[]
  date: string
  featured: boolean
  published: boolean
  content: string
}

interface BlogEditorProps {
  data: BlogData
  onChange: (newData: BlogData) => void
}

export function BlogEditor({ data, onChange }: BlogEditorProps) {
  const updateField = (field: keyof BlogData, value: any) => {
    const newData = { ...data, [field]: value }
    if (field === 'title') {
      newData.slug = slugify(value)
    }
    onChange(newData)
  }

  const toggleArrayItem = (category: 'tags', item: string) => {
    const list = [...data[category]]
    const index = list.indexOf(item)
    if (index > -1) list.splice(index, 1)
    else list.push(item)
    updateField(category, list)
  }

  return (
    <div className="flex-1 overflow-y-auto p-10 space-y-10 font-sans scrollbar-hide border-r border-[#e5e7eb] bg-[#fafafa]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
            BLOG ENTRY METADATA
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={data.featured} 
              onChange={(e) => updateField('featured', e.target.checked)}
              className="w-3.5 h-3.5 accent-gray-900"
            />
            <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider">FEATURED</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={data.published} 
              onChange={(e) => updateField('published', e.target.checked)}
              className="w-3.5 h-3.5 accent-gray-900"
            />
            <span className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider">PUBLISHED</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <InputField 
          label="TITLE"
          value={data.title}
          onChange={(val) => updateField('title', val)}
          className="font-semibold text-[18px] text-gray-900 tracking-tight"
        />

        <div className="grid grid-cols-2 gap-6">
          <InputField 
            label="SLUG"
            value={data.slug}
            onChange={(val) => updateField('slug', val)}
          />
          <InputField 
            label="PUBLISHED DATE"
            value={data.date}
            onChange={(val) => updateField('date', val)}
            placeholder="e.g. March 10, 2025"
          />
        </div>

        <InputField 
          label="EXCERPT / SUMMARY"
          value={data.excerpt}
          onChange={(val) => updateField('excerpt', val)}
          type="textarea"
          rows={3}
        />

        <InputField 
          label="COVER IMAGE URL"
          value={data.image}
          onChange={(val) => updateField('image', val)}
          placeholder="https://..."
        />

        <div className="space-y-3">
          <label className="text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500 block">TAGS</label>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="tag" className="flex items-center gap-2 pr-1">
                {tag}
                <button onClick={() => toggleArrayItem('tags', tag)} className="hover:text-red-500">
                  <Plus className="w-3 h-3 rotate-45" />
                </button>
              </Badge>
            ))}
            <div className="flex gap-2 items-center min-w-[200px]">
               <input 
                 type="text" 
                 placeholder="Add tag..." 
                 className="flex-1 bg-transparent border-b border-gray-200 focus:border-gray-900 outline-none text-[12px] font-mono py-1"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     const val = (e.currentTarget as HTMLInputElement).value.trim()
                     if (val) {
                       toggleArrayItem('tags', val);
                       (e.currentTarget as HTMLInputElement).value = ''
                     }
                   }
                 }}
               />
            </div>
          </div>
        </div>

        <InputField 
          label="MARKDOWN CONTENT (MAIN BODY)"
          value={data.content}
          onChange={(val) => updateField('content', val)}
          type="textarea"
          rows={20}
          className="font-mono text-[13px] leading-relaxed"
        />
      </div>
    </div>
  )
}
