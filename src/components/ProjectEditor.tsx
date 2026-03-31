import React from 'react'
import { Plus } from 'lucide-react'
import { InputField } from './ui/InputField'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { slugify } from '@/utils/string'

interface ProjectData {
  title: string
  slug: string
  shortDescription: string
  description: string
  image: string
  role: string
  timeline: string
  technologies: string[]
  githubUrl: string
  liveUrl?: string
  featured: boolean
  published: boolean
  content: string
}

interface ProjectEditorProps {
  data: ProjectData
  onChange: (newData: ProjectData) => void
}

export function ProjectEditor({ data, onChange }: ProjectEditorProps) {
  const updateField = (field: keyof ProjectData, value: any) => {
    const newData = { ...data, [field]: value }
    if (field === 'title') {
      newData.slug = slugify(value)
    }
    onChange(newData)
  }

  const toggleArrayItem = (category: 'technologies', item: string) => {
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
            PROJECT METADATA
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

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <InputField 
            label="TITLE"
            value={data.title}
            onChange={(val) => updateField('title', val)}
            className="font-semibold text-[18px] text-gray-900 tracking-tight"
          />

          <InputField 
            label="SHORT DESCRIPTION (SUMMARY)"
            value={data.shortDescription}
            onChange={(val) => updateField('shortDescription', val)}
            type="textarea"
            rows={2}
          />

          <InputField 
            label="DETAILED DESCRIPTION"
            value={data.description}
            onChange={(val) => updateField('description', val)}
            type="textarea"
            rows={4}
          />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <InputField 
            label="ROLE"
            value={data.role}
            onChange={(val) => updateField('role', val)}
            placeholder="e.g. Lead Developer"
          />
          <div className="space-y-3">
            <label className="text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500 block">TIMELINE</label>
            <div className="flex items-center gap-4">
              <InputField 
                label=""
                value={data.timeline.split(' - ')[0] || ''}
                onChange={(v) => {
                  const parts = data.timeline.split(' - ')
                  updateField('timeline', `${v} - ${parts[1] || ''}`)
                }}
                className="flex-1"
                placeholder="e.g. JAN 2024"
              />
              <span className="text-[11px] font-mono font-normal tracking-[0.05em] text-gray-500 px-1 shrink-0 uppercase">TO</span>
              <InputField 
                label=""
                value={data.timeline.split(' - ')[1] || ''}
                onChange={(v) => {
                  const parts = data.timeline.split(' - ')
                  updateField('timeline', `${parts[0] || ''} - ${v}`)
                }}
                className="flex-1"
                placeholder="e.g. MAR 2024"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 border-t border-gray-100 pt-10">
        <InputField 
          label="COVER IMAGE URL"
          value={data.image}
          onChange={(val) => updateField('image', val)}
          placeholder="https://..."
        />

        <div className="grid grid-cols-2 gap-6">
          <InputField 
            label="GITHUB REPOSITORY URL"
            value={data.githubUrl}
            onChange={(val) => updateField('githubUrl', val)}
          />
          <InputField 
            label="LIVE DEMO URL (OPTIONAL)"
            value={data.liveUrl || ''}
            onChange={(val) => updateField('liveUrl', val)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500 block">TECHNOLOGIES</label>
          <div className="flex flex-wrap gap-2">
            {data.technologies.map((tech) => (
              <Badge key={tech} variant="tag" className="flex items-center gap-2 pr-1">
                {tech}
                <button onClick={() => toggleArrayItem('technologies', tech)} className="hover:text-red-500">
                  <Plus className="w-3 h-3 rotate-45" />
                </button>
              </Badge>
            ))}
            <div className="flex gap-2 items-center min-w-[200px]">
               <input 
                 type="text" 
                 placeholder="Add tech..." 
                 className="flex-1 bg-transparent border-b border-gray-200 focus:border-gray-900 outline-none text-[12px] font-mono py-1"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     const val = (e.currentTarget as HTMLInputElement).value.trim()
                     if (val) {
                       toggleArrayItem('technologies', val);
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
