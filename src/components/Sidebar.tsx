'use client'

import React from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  PenSquare, 
  FolderIcon, 
  Trophy, 
  Briefcase, 
  Award, 
  GraduationCap, 
  User, 
  Settings, 
  Code2,
  ChevronDown
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true },
  { id: 'blog', label: 'Blog', icon: PenSquare, href: '/dashboard/blog' },
  { id: 'projects', label: 'Projects', icon: FolderIcon, href: '/dashboard/projects' },
  { id: 'experiences', label: 'Experiences', icon: Trophy, hasSubItems: true },
  { id: 'work-experience', label: 'Work Experience', icon: Briefcase, isSubItem: true, href: '/dashboard/experiences/work-experience' },
  { id: 'awards', label: 'Awards', icon: Award, isSubItem: true, href: '/dashboard/experiences/awards' },
  { id: 'educations', label: 'Educations', icon: GraduationCap, isSubItem: true, href: '/dashboard/experiences/educations' },
  { id: 'contact', label: 'Contact', icon: User, href: '/dashboard/contact' },
  { id: 'site-config', label: 'Site Config', icon: Settings, href: '/dashboard/site-config' },
  { id: 'tech-stack', label: 'Tech Stack', icon: Code2, href: '/dashboard/tech-stack' },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-[#f0f0f0] bg-white h-screen flex flex-col sticky top-0 overflow-y-auto">
      <div className="p-8 pb-12">
        <h1 className="font-mono text-lg font-bold text-[#1a1a1a] leading-tight max-w-[140px]">
          0xfzz's Portofolio Dashboard
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <div key={item.id} className="group">
            <Link
              href={item.href || '#'}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors
                ${item.active 
                  ? 'bg-[#f5f5f5] text-[#1a1a1a]' 
                  : 'text-[#888] hover:bg-[#fafafa] hover:text-[#1a1a1a]'}
                ${item.isSubItem ? 'pl-10' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-5 h-5" strokeWidth={1.5} />
                <span>{item.label}</span>
              </div>
              {item.hasSubItems && (
                <ChevronDown className="w-4 h-4 text-[#888]" />
              )}
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  )
}
