import React, { useState, useEffect } from 'react'
import { Edit2, Trash2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { DataTable } from './ui/DataTable'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { useNotification } from '@/context/NotificationContext'

export function ProjectTable() {
  const { showToast, confirm } = useNotification()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/content/projects')
      const data = await res.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch projects', err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (project: any) => {
    const confirmed = await confirm({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project.title}"? This will permanently remove the file "${project._slug}.md".`,
      variant: 'destructive',
      confirmText: 'Delete'
    })

    if (!confirmed) return

    try {
      const res = await fetch(`/api/content/projects/${project._slug}.md`, {
        method: 'DELETE'
      })
      if (res.ok) {
        showToast('Project deleted successfully', 'success')
        fetchProjects()
      } else {
        showToast('Failed to delete project', 'error')
      }
    } catch (err) {
      showToast('Error deleting project', 'error')
    }
  }

  const columns = [
    {
      header: 'PROJECT TITLE',
      key: 'title',
      width: '40%',
      render: (project: any) => (
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          <span className="text-[14px] font-bold text-gray-900 tracking-tight truncate">{project.title || 'Untitled'}</span>
        </div>
      )
    },
    {
      header: 'TECHNOLOGIES',
      key: 'technologies',
      render: (project: any) => (
        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(project.technologies) ? project.technologies : []).map((tech: string) => (
            <Badge key={tech} variant="tag">{tech}</Badge>
          ))}
        </div>
      )
    },
    {
      header: 'DATE / TIMELINE',
      key: 'timeline',
      render: (project: any) => <span className="text-[11px] font-medium text-gray-400 font-mono tracking-widest uppercase">{project.timeline || 'No Date'}</span>
    },
    {
      header: 'STATUS',
      key: 'published',
      render: (project: any) => (
        <Badge variant={project.published === 'true' || project.published === true ? 'success' : 'neutral'}>
          {project.published === 'true' || project.published === true ? 'PUBLISHED' : 'DRAFT'}
        </Badge>
      )
    },
    {
      header: 'ACTIONS',
      key: 'actions',
      className: 'text-right',
      render: (project: any) => (
        <div className="flex items-center justify-end gap-2.5 font-mono text-[11px] tracking-widest text-gray-600">
          <Link href={`/dashboard/projects/edit/${project._slug}`} className="hover:text-gray-900 transition-colors uppercase">[EDIT]</Link>
          <button 
            onClick={() => handleDelete(project)}
            className="text-[#991b1b] hover:text-[#7f1d1d] transition-colors uppercase"
          >
            [DELETE]
          </button>
        </div>
      )
    }
  ]

  const filterOptions = [
    {
      label: 'STATUS',
      key: 'published',
      options: ['PUBLISHED', 'DRAFT']
    }
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64 border border-dashed border-[#e5e5e5]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )

  return (
    <div className="w-full">
      <DataTable 
        data={projects} 
        columns={columns} 
        searchPlaceholder="Search projects..."
        searchKeys={['title', 'technologies']}
        filters={filterOptions}
        pageSize={10}
      />
    </div>
  )
}
