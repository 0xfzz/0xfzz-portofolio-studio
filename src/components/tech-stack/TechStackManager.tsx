'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, Trash2, Cpu, Users, Wrench, RefreshCw, AlertCircle, 
  Layers, Database, Cloud, Shield, Gauge, BarChart, Code2, 
  Terminal, Globe, Server, HardDrive, Smartphone, Layout, 
  Palette, Search, Lock, Zap, Settings, Activity, Infinity
} from 'lucide-react'
import { InputField } from '@/components/ui/InputField'
import { Badge } from '@/components/ui/Badge'

interface Expertise {
  title: string
  icon: string
}

interface TechStack {
  title: string
  subtitle: string
  skills: {
    hard: string[]
    soft: string[]
    tools: string[]
  }
  expertise: Expertise[]
}

const EMPTY_TECH_STACK: TechStack = {
  title: "",
  subtitle: "",
  skills: {
    hard: [],
    soft: [],
    tools: []
  },
  expertise: []
}

const ICON_OPTIONS = [
  { name: 'Layers', Icon: Layers },
  { name: 'Database', Icon: Database },
  { name: 'Cloud', Icon: Cloud },
  { name: 'Shield', Icon: Shield },
  { name: 'Gauge', Icon: Gauge },
  { name: 'BarChart', Icon: BarChart },
  { name: 'Code2', Icon: Code2 },
  { name: 'Terminal', Icon: Terminal },
  { name: 'Cpu', Icon: Cpu },
  { name: 'Globe', Icon: Globe },
  { name: 'Server', Icon: Server },
  { name: 'HardDrive', Icon: HardDrive },
  { name: 'Smartphone', Icon: Smartphone },
  { name: 'Layout', Icon: Layout },
  { name: 'Palette', Icon: Palette },
  { name: 'Search', Icon: Search },
  { name: 'Lock', Icon: Lock },
  { name: 'Zap', Icon: Zap },
  { name: 'Settings', Icon: Settings },
  { name: 'Activity', Icon: Activity },
  { name: 'Infinity', Icon: Infinity },
]

export function TechStackManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [config, setConfig] = useState<TechStack>(EMPTY_TECH_STACK)
  const [newSkill, setNewSkill] = useState({ hard: '', soft: '', tools: '' })

  useEffect(() => {
    fetchTechStack()
  }, [])

  const fetchTechStack = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/content/tech-stack')
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
      const data = await res.json()
      setConfig({
        title: data.title || '',
        subtitle: data.subtitle || '',
        skills: {
          hard: Array.isArray(data.skills?.hard) ? data.skills.hard : [],
          soft: Array.isArray(data.skills?.soft) ? data.skills.soft : [],
          tools: Array.isArray(data.skills?.tools) ? data.skills.tools : []
        },
        expertise: Array.isArray(data.expertise) ? data.expertise : []
      })
    } catch (err) {
      console.warn('Failed to fetch tech stack, using empty state', err)
      setConfig(EMPTY_TECH_STACK)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config) return
    try {
      setSaving(true)
      setStatus('idle')
      const res = await fetch('/api/content/tech-stack', {
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

  const addSkill = (category: keyof TechStack['skills']) => {
    const value = newSkill[category].trim()
    if (!value || !config) return
    
    setConfig({
      ...config,
      skills: {
        ...config.skills,
        [category]: [...config.skills[category], value]
      }
    })
    setNewSkill({ ...newSkill, [category]: '' })
  }

  const removeSkill = (category: keyof TechStack['skills'], index: number) => {
    if (!config) return
    const newList = [...config.skills[category]]
    newList.splice(index, 1)
    setConfig({
      ...config,
      skills: {
        ...config.skills,
        [category]: newList
      }
    })
  }

  const addExpertise = () => {
    if (!config) return
    setConfig({
      ...config,
      expertise: [...config.expertise, { title: '', icon: 'Layers' }]
    })
  }

  const updateExpertise = (index: number, field: keyof Expertise, value: string) => {
    if (!config) return
    const newExpertise = [...config.expertise]
    newExpertise[index] = { ...newExpertise[index], [field]: value }
    setConfig({ ...config, expertise: newExpertise })
  }

  const removeExpertise = (index: number) => {
    if (!config) return
    const newExpertise = [...config.expertise]
    newExpertise.splice(index, 1)
    setConfig({ ...config, expertise: newExpertise })
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 border border-dashed border-[#e5e5e5]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )

  return (
    <div className="space-y-10 pb-32">
      {/* Header Info */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-gray-400" />
          <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
            TECH STACK HEADER
          </span>
        </div>
        <div className="space-y-6">
          <InputField 
            label="TITLE" 
            value={config.title} 
            onChange={(v) => setConfig({ ...config, title: v })}
            className="font-semibold text-[18px] text-gray-900 tracking-tight"
          />
          <InputField 
            label="SUBTITLE" 
            value={config.subtitle} 
            onChange={(v) => setConfig({ ...config, subtitle: v })} 
            type="textarea" 
            rows={2} 
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-12 gap-8">
        {(['hard', 'soft', 'tools'] as const).map((category) => (
          <div key={category} className="col-span-12 md:col-span-4 bg-[#fafafa] border border-gray-200 p-8 space-y-6">
            <div className="flex items-center gap-3">
              {category === 'hard' && <Cpu className="w-4 h-4 text-gray-400" />}
              {category === 'soft' && <Users className="w-4 h-4 text-gray-400" />}
              {category === 'tools' && <Wrench className="w-4 h-4 text-gray-400" />}
              <span className="text-[12px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
                {category} SKILLS
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {config.skills[category].map((skill, idx) => (
                <Badge key={idx} variant="tag" className="flex items-center gap-2 group pr-1">
                  {skill}
                  <button 
                    onClick={() => removeSkill(category, idx)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <Plus className="w-3 h-3 rotate-45" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <input 
                type="text"
                placeholder={`Add ${category}...`}
                value={newSkill[category]}
                onChange={(e) => setNewSkill({ ...newSkill, [category]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && addSkill(category)}
                className="flex-1 bg-transparent border-b border-gray-200 focus:border-gray-900 outline-none text-[12px] font-mono py-1 transition-colors"
              />
              <button 
                onClick={() => addSkill(category)}
                className="w-6 h-6 flex items-center justify-center bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Expertise Section */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
              CORE EXPERTISE
            </span>
          </div>
          <button 
            onClick={addExpertise}
            className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Expertise
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {config.expertise.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-200 p-6 space-y-6 relative group">
              <button 
                onClick={() => removeExpertise(idx)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <InputField 
                label="EXPERTISE TITLE"
                value={item.title}
                onChange={(v) => updateExpertise(idx, 'title', v)}
                placeholder="e.g. Microservices"
              />

              <div className="space-y-3">
                <label className="text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500">
                  SELECT ICON
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {ICON_OPTIONS.map(({ name, Icon }) => (
                    <button
                      key={name}
                      onClick={() => updateExpertise(idx, 'icon', name)}
                      className={`flex items-center justify-center p-2 border transition-all ${
                        item.icon === name 
                          ? 'border-gray-900 bg-gray-900 text-white shadow-sm' 
                          : 'border-gray-100 hover:border-gray-300 text-gray-400'
                      }`}
                      title={name}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {config.expertise.length === 0 && (
            <div className="col-span-full py-12 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <Layers className="w-8 h-8 mb-3 opacity-20" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em]">No expertise defined</span>
              <button 
                onClick={addExpertise}
                className="mt-4 text-[10px] bg-gray-900 text-white px-4 py-2 font-mono font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Add first item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-12 right-12 flex items-center gap-4 z-50">
        {status === 'success' && (
          <div className="bg-gray-900 text-white px-6 py-3 border border-gray-800 text-[11px] font-mono font-bold uppercase tracking-[0.2em] rounded-[2px] animate-in fade-in slide-in-from-bottom-2">
            CHANGES SAVED LOCALLY
          </div>
        )}
        <button 
          onClick={fetchTechStack}
          className="w-[92px] h-[42px] bg-[#FCF8F9] border border-[#333235] text-[#333235] rounded-none text-[12px] font-mono font-bold tracking-widest hover:bg-gray-100 transition-colors shadow-none flex items-center justify-center"
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
