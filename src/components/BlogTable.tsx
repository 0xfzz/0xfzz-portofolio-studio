import React from 'react'
import { DataTable } from './ui/DataTable'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

const blogData = [
  {
    id: 1,
    title: 'Lumina Core Engine',
    tags: ['Go', 'Kubernetes', 'Observability'],
    date: '2023.10.24',
    status: 'PUBLISHED'
  },
  {
    id: 2,
    title: 'ZENITH ARCHITECTURE',
    tags: ['Architecture', 'System Design'],
    date: '2023.10.28',
    status: 'PUBLISHED'
  },
  {
    id: 3,
    title: 'RUST VS C++ FOR CORE',
    tags: ['Rust', 'C++', 'System'],
    date: '2023.11.02',
    status: 'PUBLISHED'
  },
  {
    id: 4,
    title: 'NEURAL NETWORK CORE',
    tags: ['Python', 'AI', 'Neural'],
    date: '2023.11.15',
    status: 'DRAFT'
  }
]

export function BlogTable() {
  const columns = [
    {
      header: 'Title',
      key: 'title',
      width: '35%',
      render: (blog: any) => (
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#8b8b6a]" />
          <span className="text-[14px] font-bold text-[#1a1a1a] tracking-tight truncate">{blog.title}</span>
        </div>
      )
    },
    {
      header: 'Tags',
      key: 'tags',
      width: '25%',
      render: (blog: any) => (
        <div className="flex flex-wrap gap-1.5">
          {blog.tags.map((tag: string) => (
            <Badge key={tag} variant="tag">{tag}</Badge>
          ))}
        </div>
      )
    },
    {
      header: 'Date',
      key: 'date',
      width: '15%',
      render: (blog: any) => <span className="text-[12px] font-medium text-[#a0a0a0] font-mono opacity-80">{blog.date}</span>
    },
    {
      header: 'Status',
      key: 'status',
      width: '10%',
      render: (blog: any) => (
        <Badge variant={blog.status === 'PUBLISHED' ? 'success' : 'neutral'} className="rounded-none px-3 py-1">
          {blog.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      width: '15%',
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
      label: 'TAGS',
      key: 'tags',
      options: ['Go', 'Kubernetes', 'Observability', 'Architecture', 'System Design', 'Rust', 'C++', 'Python', 'AI', 'Neural']
    },
    {
      label: 'STATUS',
      key: 'status',
      options: ['PUBLISHED', 'DRAFT']
    }
  ]

  return (
    <DataTable 
      data={blogData} 
      columns={columns} 
      searchPlaceholder="SEARCH_BLOG_ENTRIES..."
      searchKeys={['title', 'tags']}
      filters={filterOptions}
      pageSize={10}
    />
  )
}
