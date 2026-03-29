import React from 'react'
import { Plus } from 'lucide-react'
import { InputField } from './ui/InputField'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { slugify } from '@/utils/string'

interface ProjectEditorProps {
  data: {
    title: string
    slug: string
    description: string
    imageUrl: string
    liveUrl: string
    sourceUrl: string
    technologies: string[]
    content: string
  }
  onChange: (newData: any) => void
}

export function ProjectEditor({ data, onChange }: ProjectEditorProps) {
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
        <span className="text-[12px] font-bold text-[#1a1a1a] opacity-60 uppercase tracking-wider block mb-2">Project Metadata</span>
        <h2 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight leading-tight">{data.title || 'Untitled Project'}</h2>
      </div>

      <div className="space-y-10">
        <InputField 
          label="Title"
          value={data.title}
          onChange={(val) => updateField('title', val)}
        />

        <InputField 
          label="Description"
          value={data.description}
          onChange={(val) => updateField('description', val)}
          type="textarea"
          rows={3}
        />

        <InputField 
          label="Image URL"
          value={data.imageUrl}
          onChange={(val) => updateField('imageUrl', val)}
        />

        <div className="grid grid-cols-2 gap-6">
          <InputField 
            label="Live URL"
            value={data.liveUrl}
            onChange={(val) => updateField('liveUrl', val)}
          />
          <InputField 
            label="Source URL"
            value={data.sourceUrl}
            onChange={(val) => updateField('sourceUrl', val)}
          />
        </div>

        <div className="space-y-4">
          <label className="text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a] opacity-60">Technologies</label>
          <div className="flex flex-wrap gap-2">
            {data.technologies.map((tech) => (
              <Badge key={tech} variant="tag" className="px-3 py-1.5">{tech}</Badge>
            ))}
            <Button variant="outline" size="sm" className="px-3 py-1.5 border-dashed text-[#1a1a1a] opacity-60 hover:opacity-100">
              <Plus className="w-3 h-3" /> Add
            </Button>
          </div>
        </div>

        <InputField 
          label="Markdown Content"
          value={data.content}
          onChange={(val) => updateField('content', val)}
          type="textarea"
          rows={15}
          className="border-[#f0f0f0] px-6 py-6 text-[14px] bg-[#fcfcfc]"
        />
      </div>
    </div>
  )
}
