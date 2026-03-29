import React from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DataTable } from './ui/DataTable'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

const projects = [
  {
    id: 1,
    title: 'Lumina Core Engine',
    technologies: ['C++', 'Vulkan', 'Rust'],
    date: '2023.10.14',
    status: 'PUBLISHED',
  },
  {
    id: 2,
    title: 'Zenith Cloud Platform',
    technologies: ['Go', 'Kubernetes', 'AWS'],
    date: '2023.09.28',
    status: 'PUBLISHED',
  },
  {
    id: 3,
    title: 'Aether UI Framework',
    technologies: ['TypeScript', 'React', 'WASM'],
    date: '2023.08.12',
    status: 'PUBLISHED',
  },
  {
    id: 4,
    title: 'Nova Neural Network',
    technologies: ['Python', 'PyTorch', 'Cuda'],
    date: '2023.07.05',
    status: 'DRAFT',
  },
]

export function ProjectTable() {
  const columns = [
    {
      header: 'Project Title',
      key: 'title',
      width: '40%',
      render: (project: any) => (
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#8b8b6a]" />
          <span className="text-[14px] font-bold text-[#1a1a1a] tracking-tight">{project.title}</span>
        </div>
      )
    },
    {
      header: 'Technologies',
      key: 'technologies',
      render: (project: any) => (
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech: string) => (
            <Badge key={tech} variant="tag">{tech}</Badge>
          ))}
        </div>
      )
    },
    {
      header: 'Date',
      key: 'date',
      render: (project: any) => <span className="text-[12px] font-medium text-[#a0a0a0] font-mono opacity-80">{project.date}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (project: any) => (
        <Badge variant={project.status === 'PUBLISHED' ? 'success' : 'neutral'} className="rounded-none px-3 py-1">
          {project.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: () => (
        <div className="flex items-center justify-end gap-3 font-bold text-[11px] tracking-widest">
          <button className="text-[#1a1a1a] hover:opacity-70 transition-opacity">[EDIT]</button>
          <button className="text-[#8b2d2d] hover:opacity-70 transition-opacity">[DELETE]</button>
        </div>
      )
    }
  ]

  const filterOptions = [
    {
      label: 'TECH',
      key: 'technologies',
      options: ['C++', 'Vulkan', 'Rust', 'Go', 'Kubernetes', 'AWS', 'TypeScript', 'React', 'WASM', 'Python', 'PyTorch', 'Cuda']
    },
    {
      label: 'STATUS',
      key: 'status',
      options: ['PUBLISHED', 'DRAFT']
    }
  ]

  return (
    <DataTable 
      data={projects} 
      columns={columns} 
      searchPlaceholder="SEARCH_PROJECTS..."
      searchKeys={['title', 'technologies']}
      filters={filterOptions}
      pageSize={10}
    />
  )
}
