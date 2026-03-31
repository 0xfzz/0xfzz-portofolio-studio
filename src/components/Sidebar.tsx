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
  ChevronDown,
  GitBranch
} from 'lucide-react'
import { usePathname } from 'next/navigation'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'blog', label: 'Blog', icon: PenSquare, href: '/dashboard/blog' },
  { id: 'projects', label: 'Projects', icon: FolderIcon, href: '/dashboard/projects' },
  { id: 'experiences', label: 'Experiences', icon: Trophy, hasSubItems: true },
  { id: 'work-experience', label: 'Work Experience', icon: Briefcase, isSubItem: true, href: '/dashboard/experiences/work-experience' },
  { id: 'other-experience', label: 'Other Experience', icon: Briefcase, isSubItem: true, href: '/dashboard/experiences/other-experience' },
  { id: 'awards', label: 'Awards', icon: Award, isSubItem: true, href: '/dashboard/experiences/awards' },
  { id: 'educations', label: 'Educations', icon: GraduationCap, isSubItem: true, href: '/dashboard/experiences/educations' },
  { id: 'contact', label: 'Contact', icon: User, href: '/dashboard/contact' },
  { id: 'site-config', label: 'Site Config', icon: Settings, href: '/dashboard/site-config' },
  { id: 'tech-stack', label: 'Tech Stack', icon: Code2, href: '/dashboard/tech-stack' },
  { id: 'settings', label: 'Settings', icon: Settings, hasSubItems: true },
  { id: 'git-integration', label: 'Git Cloud Integration', icon: GitBranch, isSubItem: true, href: '/dashboard/settings/git' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[240px] border-r border-gray-300 bg-[#FAFAFA] h-screen flex flex-col sticky top-0 overflow-y-auto z-40">
      <div className="pt-6 pb-10 px-6">
        <h1 className="font-mono text-[16px] font-bold text-gray-900 leading-[24px] tracking-tight">
          0xfzz's Portofolio<br />
          Dashboard
        </h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href ? (pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))) : false

          // Special case for parents: active if any sub-page is active
          const isExperiencesParent = item.id === 'experiences' && pathname?.startsWith('/dashboard/experiences')
          const isSettingsParent = item.id === 'settings' && pathname?.startsWith('/dashboard/settings')
          const finalActive = isActive || isExperiencesParent || isSettingsParent

          return (
            <div key={item.id} className="group">
              <Link
                href={item.href || '#'}
                className={`
                  w-full flex items-center justify-between px-6 h-[41px] text-[13px] transition-all
                  ${finalActive 
                    ? 'bg-[#F5F3F0] text-gray-900 font-medium border-l-[3px] border-olive-500' 
                    : 'text-gray-500 hover:bg-[#EBE7EA] font-medium border-l-[3px] border-transparent'}
                  ${item.isSubItem ? 'pl-[40px] text-[13px]' : ''}
                `}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-4 h-4 opacity-70" strokeWidth={2} />
                  <span>{item.label}</span>
                </div>
                {item.hasSubItems && (
                  <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${finalActive ? 'rotate-180' : ''}`} />
                )}
              </Link>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
