import React, { useState, useEffect } from 'react'
import { DataTable } from './ui/DataTable'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { useNotification } from '@/context/NotificationContext'
import Link from 'next/link'

export function BlogTable() {
  const { showToast, confirm } = useNotification()
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/content/blog')
      const data = await res.json()
      setBlogs(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch blogs', err)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (blog: any) => {
    const confirmed = await confirm({
      title: 'Delete Blog Post',
      message: `Are you sure you want to delete "${blog.title}"? This will permanently remove the file "${blog._slug}.md".`,
      variant: 'destructive',
      confirmText: 'Delete'
    })

    if (!confirmed) return

    try {
      const res = await fetch(`/api/content/blog/${blog._slug}.md`, {
        method: 'DELETE'
      })
      if (res.ok) {
        showToast('Blog post deleted successfully', 'success')
        fetchBlogs()
      } else {
        showToast('Failed to delete blog post', 'error')
      }
    } catch (err) {
      showToast('Error deleting blog post', 'error')
    }
  }

  const columns = [
    {
      header: 'TITLE',
      key: 'title',
      width: '35%',
      render: (blog: any) => (
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          <span className="text-[14px] font-bold text-gray-900 tracking-tight truncate">{blog.title || 'Untitled'}</span>
        </div>
      )
    },
    {
      header: 'TAGS',
      key: 'tags',
      width: '25%',
      render: (blog: any) => (
        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(blog.tags) ? blog.tags : []).map((tag: string) => (
            <Badge key={tag} variant="tag">{tag}</Badge>
          ))}
        </div>
      )
    },
    {
      header: 'DATE',
      key: 'date',
      width: '15%',
      render: (blog: any) => <span className="text-[11px] font-medium text-gray-400 font-mono tracking-widest uppercase">{blog.date || 'No Date'}</span>
    },
    {
      header: 'STATUS',
      key: 'published',
      width: '10%',
      render: (blog: any) => (
        <Badge variant={blog.published === 'true' || blog.published === true ? 'success' : 'neutral'}>
          {blog.published === 'true' || blog.published === true ? 'PUBLISHED' : 'DRAFT'}
        </Badge>
      )
    },
    {
      header: 'ACTIONS',
      key: 'actions',
      width: '15%',
      className: 'text-right',
      render: (blog: any) => (
        <div className="flex items-center justify-end gap-2.5 font-mono text-[11px] tracking-widest text-gray-600">
          <Link href={`/dashboard/blog/edit/${blog._slug}`} className="hover:text-gray-900 transition-colors uppercase">[EDIT]</Link>
          <button 
            onClick={() => handleDelete(blog)}
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
        data={blogs} 
        columns={columns} 
        searchPlaceholder="Search projects..."
        searchKeys={['title', 'tags']}
        filters={filterOptions}
        pageSize={10}
      />
    </div>
  )
}
