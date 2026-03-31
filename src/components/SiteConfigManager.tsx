'use client'

import React, { useState, useEffect } from 'react'
import { Box, Eye, Layers, FileText, Briefcase, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { InputField } from './ui/InputField'
import { Switch } from './ui/Switch'

export function SiteConfigManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const EMPTY_CONFIG = {
    metadata: { title: '', name: '', description: '' },
    visibility: { projects: true, experiences: true, blog: true, contact: true, techStack: true },
    hero: { title: '', subtitle: '', description: '' },
    pages: {
      projects: { title: '', subtitle: '' },
      blog: { title: '', subtitle: '' },
      experiences: { title: '', subtitle: '', sections: { work: '', other: '', education: '', awards: '' } }
    }
  }

  // State for all site-config data
  const [config, setConfig] = useState<any>(EMPTY_CONFIG)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/content/site-config')
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
      const data = await res.json()
      // Deep merge with empty config to ensure all fields exist
      setConfig({
        ...EMPTY_CONFIG,
        ...data,
        metadata: { ...EMPTY_CONFIG.metadata, ...data.metadata },
        visibility: { ...EMPTY_CONFIG.visibility, ...data.visibility },
        hero: { ...EMPTY_CONFIG.hero, ...data.hero },
        pages: {
          ...EMPTY_CONFIG.pages,
          ...data.pages,
          experiences: {
             ...EMPTY_CONFIG.pages.experiences,
             ...data.pages?.experiences,
             sections: { ...EMPTY_CONFIG.pages.experiences.sections, ...data.pages?.experiences?.sections }
          }
        }
      })
    } catch (err) {
      console.warn('Failed to fetch config, using empty state', err)
      setConfig(EMPTY_CONFIG)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setStatus('idle')
      const res = await fetch('/api/content/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch (err) {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const updateMetadata = (field: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }))
  }

  const updateVisibility = (field: string, value: boolean) => {
    setConfig((prev: any) => ({
      ...prev,
      visibility: { ...prev.visibility, [field]: value }
    }))
  }

  const updatePage = (page: string, field: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      pages: {
        ...(prev.pages || {}),
        [page]: {
          ...(prev.pages?.[page] || {}),
          [field]: value
        }
      }
    }))
  }

  const updateExperienceSection = (field: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      pages: {
        ...(prev.pages || {}),
        experiences: {
          ...(prev.pages?.experiences || {}),
          sections: {
            ...(prev.pages?.experiences?.sections || {}),
            [field]: value
          }
        }
      }
    }))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 border border-dashed border-[#e5e5e5]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )

  if (!config) return (
    <div className="flex items-center justify-center h-64 border border-dashed border-red-100 bg-red-50/30">
      <AlertCircle className="w-6 h-6 text-red-400 mr-2" />
      <span className="text-[12px] font-bold text-red-400 uppercase tracking-wider">Failed to load content configuration</span>
    </div>
  )

  return (
    <div className="space-y-10 pb-32">
      {/* Top Row: Global Metadata & Visibility */}
      <div className="grid grid-cols-12 gap-8">
        {/* Global Metadata */}
        <div className="col-span-12 lg:col-span-7 bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
              GLOBAL METADATA
            </span>
          </div>
          <div className="space-y-6">
            <InputField label="TITLE" value={config.metadata?.title || ''} onChange={(v) => updateMetadata('title', v)} />
            <InputField label="NAME" value={config.metadata?.name || ''} onChange={(v) => updateMetadata('name', v)} />
            <InputField label="DESCRIPTION" value={config.metadata?.description || ''} onChange={(v) => updateMetadata('description', v)} type="textarea" rows={3} />
          </div>
        </div>

        {/* Visibility Toggles */}
        <div className="col-span-12 lg:col-span-5 bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
              VISIBILITY TOGGLES
            </span>
          </div>
          <div className="space-y-6 mt-6">
            <Switch label="PROJECTS" enabled={config.visibility?.projects ?? true} onChange={(v) => updateVisibility('projects', v)} />
            <Switch label="EXPERIENCES" enabled={config.visibility?.experiences ?? true} onChange={(v) => updateVisibility('experiences', v)} />
            <Switch label="BLOG" enabled={config.visibility?.blog ?? true} onChange={(v) => updateVisibility('blog', v)} />
            <Switch label="CONTACT" enabled={config.visibility?.contact ?? true} onChange={(v) => updateVisibility('contact', v)} />
            <Switch label="TECH STACK" enabled={config.visibility?.techStack ?? true} onChange={(v) => updateVisibility('techStack', v)} />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
            HERO SECTION
          </span>
        </div>
        <div className="space-y-6">
          <InputField label="TITLE" value={config.hero?.title || ''} onChange={(v) => {
            setConfig((prev: any) => ({ ...prev, hero: { ...prev.hero, title: v } }))
          }} className="font-semibold text-[18px] text-gray-900 tracking-tight" />
          <InputField label="SUBTITLE (Tagline)" value={config.hero?.subtitle || ''} onChange={(v) => {
            setConfig((prev: any) => ({ ...prev, hero: { ...prev.hero, subtitle: v } }))
          }} />
          <InputField label="DESCRIPTION (Long Summary)" value={config.hero?.description || ''} onChange={(v) => {
            setConfig((prev: any) => ({ ...prev, hero: { ...prev.hero, description: v } }))
          }} type="textarea" rows={4} />
        </div>
      </div>

      {/* Projects */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
        <div className="flex items-center gap-3">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
            PROJECTS PAGE
          </span>
        </div>
        <div className="space-y-6">
          <InputField label="TITLE" value={config.pages?.projects?.title || ''} onChange={(v) => updatePage('projects', 'title', v)} className="font-semibold text-[18px] text-gray-900 tracking-tight" />
          <InputField label="SUBTITLE" value={config.pages?.projects?.subtitle || ''} onChange={(v) => updatePage('projects', 'subtitle', v)} />
        </div>
      </div>

      {/* Blogs */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
            BLOGS PAGE
          </span>
        </div>
        <div className="space-y-6">
          <InputField label="TITLE" value={config.pages?.blog?.title || ''} onChange={(v) => updatePage('blog', 'title', v)} className="font-semibold text-[18px] text-gray-900 tracking-tight" />
          <InputField label="SUBTITLE" value={config.pages?.blog?.subtitle || ''} onChange={(v) => updatePage('blog', 'subtitle', v)} />
        </div>
      </div>

      {/* Experiences */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
        <div className="flex items-center gap-3">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
            EXPERIENCES PAGE
          </span>
        </div>
        <div className="space-y-6">
          <InputField label="TITLE" value={config.pages?.experiences?.title || ''} onChange={(v) => updatePage('experiences', 'title', v)} className="font-semibold text-[18px] text-gray-900 tracking-tight" />
          <InputField label="SUBTITLE" value={config.pages?.experiences?.subtitle || ''} onChange={(v) => updatePage('experiences', 'subtitle', v)} />
        </div>
      </div>

      {/* Sections */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
            EXPERIENCE SECTIONS
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputField label="WORK" value={config.pages?.experiences?.sections?.work || ''} onChange={(v) => updateExperienceSection('work', v)} />
          <InputField label="OTHER" value={config.pages?.experiences?.sections?.other || ''} onChange={(v) => updateExperienceSection('other', v)} />
          <InputField label="EDUCATION" value={config.pages?.experiences?.sections?.education || ''} onChange={(v) => updateExperienceSection('education', v)} />
          <InputField label="AWARDS" value={config.pages?.experiences?.sections?.awards || ''} onChange={(v) => updateExperienceSection('awards', v)} />
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-12 right-12 flex items-center gap-4 z-50">
        {status === 'success' && (
          <div className="bg-gray-900 text-white px-6 py-3 border border-gray-800 text-[11px] font-mono font-bold uppercase tracking-[0.2em] rounded-[2px] animate-in fade-in slide-in-from-bottom-2">
            CHANGES SAVED LOCALLY
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-500 text-white px-6 py-3 rounded-[2px] text-[11px] font-mono font-bold uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-2">
            SAVE FAILED
          </div>
        )}
        <button
          onClick={fetchConfig}
          className="w-[92px] h-[42px] bg-[#FCF8F9] border border-[#333235] rounded-none text-[12px] font-mono font-bold tracking-widest text-[#333235] hover:bg-gray-100 transition-colors shadow-none"
        >
          RESET
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-[207px] h-[42px] bg-[#333235] text-[#FCF8F9] rounded-none text-[12px] font-mono font-bold tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center shadow-none disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-3" /> : null}
          {saving ? 'SAVING...' : 'SAVE LOCALLY'}
        </button>
      </div>
    </div>
  )
}
