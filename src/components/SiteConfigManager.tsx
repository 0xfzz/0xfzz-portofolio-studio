'use client'

import React, { useState } from 'react'
import { History, Box, Eye, Layers, FileText, Briefcase, Award } from 'lucide-react'
import { InputField } from './ui/InputField'
import { Switch } from './ui/Switch'

export function SiteConfigManager() {
  // Global Metadata
  const [siteTitle, setSiteTitle] = useState("0xfzz // Software Architect & Creative Developer")
  const [siteDesc, setSiteDesc] = useState("Full-stack engineering focused on performance, modular architecture, and brutalist design aesthetics.")

  // Visibility Toggles
  const [visibility, setVisibility] = useState({
    projects: true,
    experiences: true,
    blog: true,
    contact: false,
    techStack: true
  })

  // Section Headers
  const [sections, setSections] = useState({
    hero: { title: "ARCHITECTING DIGITAL MONOLITHS", subtitle: "Crafting high-density interfaces for technical minds." },
    projects: { title: "ARCHITECTING DIGITAL MONOLITHS", subtitle: "Crafting high-density interfaces for technical minds." },
    blogs: { title: "ARCHITECTING DIGITAL MONOLITHS", subtitle: "Crafting high-density interfaces for technical minds." },
    experiences: { title: "ARCHITECTING DIGITAL MONOLITHS", subtitle: "Crafting high-density interfaces for technical minds." },
    subSections: { work: "Work Experience", education: "Education", awards: "Awards" }
  })

  const updateSection = (key: keyof typeof sections, field: string, value: string) => {
    setSections(prev => ({
      ...prev,
      [key]: { ...(prev[key] as any), [field]: value }
    }))
  }

  const updateSubSection = (field: keyof typeof sections.subSections, value: string) => {
    setSections(prev => ({
      ...prev,
      subSections: { ...prev.subSections, [field]: value }
    }))
  }

  return (
    <div className="space-y-12 pb-32">
      {/* Top Header Actions */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 text-[12px] font-bold text-[#1a1a1a] opacity-60 uppercase tracking-wider hover:opacity-100 transition-opacity">
          <History className="w-4 h-4" />
          RESTORE_BACKUP
        </button>
      </div>

      {/* Top Row: Global Metadata & Visibility */}
      <div className="grid grid-cols-12 gap-10">
        {/* Global Metadata */}
        <div className="col-span-7 bg-white border border-[#f0f0f0] p-10 space-y-10 rounded-sm">
          <div className="flex items-center gap-3">
             <Box className="w-4 h-4 text-[#1a1a1a] opacity-40" />
             <span className="text-[12px] font-bold text-[#1a1a1a] opacity-40 uppercase tracking-wider">
               GLOBAL METADATA
             </span>
          </div>
          <InputField label="TITLE" value={siteTitle} onChange={setSiteTitle} />
          <InputField label="DESCRIPTION" value={siteDesc} onChange={setSiteDesc} type="textarea" rows={3} />
        </div>

        {/* Visibility Toggles */}
        <div className="col-span-5 bg-white border border-[#f0f0f0] p-10 space-y-10 rounded-sm">
          <div className="flex items-center gap-3">
             <Eye className="w-4 h-4 text-[#1a1a1a] opacity-40" />
             <span className="text-[12px] font-bold text-[#1a1a1a] opacity-40 uppercase tracking-wider">
               VISIBILITY TOGGLES
             </span>
          </div>
          <div className="space-y-6">
            <Switch label="PROJECTS" enabled={visibility.projects} onChange={(v) => setVisibility({...visibility, projects: v})} />
            <Switch label="EXPERIENCES" enabled={visibility.experiences} onChange={(v) => setVisibility({...visibility, experiences: v})} />
            <Switch label="BLOG" enabled={visibility.blog} onChange={(v) => setVisibility({...visibility, blog: v})} />
            <Switch label="CONTACT" enabled={visibility.contact} onChange={(v) => setVisibility({...visibility, contact: v})} />
            <Switch label="TECH STACK" enabled={visibility.techStack} onChange={(v) => setVisibility({...visibility, techStack: v})} />
          </div>
        </div>
      </div>

      {/* Section Headers Configuration */}
      {[
        { id: 'hero', label: 'HERO SECTION', icon: Layers },
        { id: 'projects', label: 'PROJECTS', icon: Box },
        { id: 'blogs', label: 'BLOGS', icon: FileText },
        { id: 'experiences', label: 'EXPERIENCES', icon: Briefcase }
      ].map((sec) => (
        <div key={sec.id} className="bg-white border border-[#f0f0f0] p-10 space-y-8 rounded-sm group hover:border-[#e5e5e5] transition-all">
          <div className="flex items-center gap-3">
             <sec.icon className="w-4 h-4 text-[#1a1a1a] opacity-40" />
             <span className="text-[12px] font-bold text-[#1a1a1a] opacity-40 uppercase tracking-wider">
               {sec.label}
             </span>
          </div>
          <div className="space-y-8">
             <InputField 
               label="TITLE" 
               value={(sections as any)[sec.id].title} 
               onChange={(v) => updateSection(sec.id as any, 'title', v)} 
             />
             <InputField 
               label="SUBTITLE" 
               value={(sections as any)[sec.id].subtitle} 
               onChange={(v) => updateSection(sec.id as any, 'subtitle', v)} 
               className="bg-white"
             />
          </div>
        </div>
      ))}

      {/* Sub-sections Labels */}
      <div className="bg-white border border-[#f0f0f0] p-10 space-y-8 rounded-sm">
        <div className="flex items-center gap-3">
           <Layers className="w-4 h-4 text-[#1a1a1a] opacity-40" />
           <span className="text-[12px] font-bold text-[#1a1a1a] opacity-40 uppercase tracking-wider">
             SECTIONS
           </span>
        </div>
        <div className="grid grid-cols-3 gap-8">
           <InputField label="WORK EXPERIENCE" value={sections.subSections.work} onChange={(v) => updateSubSection('work', v)} />
           <InputField label="EDUCATION" value={sections.subSections.education} onChange={(v) => updateSubSection('education', v)} />
           <InputField label="AWARDS" value={sections.subSections.awards} onChange={(v) => updateSubSection('awards', v)} />
        </div>
      </div>

      <div className="fixed bottom-12 right-24 flex items-center gap-4 z-50">
        <button className="h-[52px] bg-white border border-[#e5e5e5] px-10 rounded-sm text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a] hover:border-black transition-all bg-white/80 backdrop-blur-md">
          RESET
        </button>
        <button className="h-[52px] bg-[#1a1a1a] text-white px-12 rounded-sm text-[12px] font-bold uppercase tracking-wider hover:bg-black transition-all active:scale-95">
          COMMIT CHANGES
        </button>
      </div>
    </div>
  )
}
