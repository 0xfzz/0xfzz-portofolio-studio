'use client'

import React, { useState, useEffect, use } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { BlogEditor } from '@/components/blog/BlogEditor'
import { BlogPreview } from '@/components/blog/BlogPreview'
import { EditorFooter } from '@/components/editor/EditorFooter'
import { CollapsibleSidebar } from '@/components/layout/CollapsibleSidebar'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/context/NotificationContext'

interface BlogData {
  title: string
  slug: string
  description: string
  imageUrl: string
  tags: string[]
  date: string
  featured: boolean
  published: boolean
  content: string
}

export default function BlogEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { showToast } = useNotification()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>('Never saved')
  const [blogData, setBlogData] = useState<BlogData | null>(null)

  useEffect(() => {
    fetchBlog()
  }, [slug])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/content/blog/${slug}.md`)
      if (!res.ok) throw new Error('Not found')
      
      const rawContent = await res.text()
      
      // Basic Frontmatter Parser
      const fmMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
      let metadata: any = {}
      let contentBody = rawContent

      if (fmMatch) {
        const yaml = fmMatch[1]
        contentBody = rawContent.replace(fmMatch[0], '')
        
        yaml.split('\n').forEach(line => {
          const colonIdx = line.indexOf(':')
          if (colonIdx === -1) return
          const key = line.slice(0, colonIdx).trim()
          let val = line.slice(colonIdx + 1).trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
          
          if (val.startsWith('[') && val.endsWith(']')) {
            metadata[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^"(.*)"$/, '$1'))
          } else if (val === 'true') {
            metadata[key] = true
          } else if (val === 'false') {
            metadata[key] = false
          } else {
            metadata[key] = val
          }
        })
      }

      const today = new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })

      setBlogData({
        title: metadata.title || '',
        slug: slug,
        description: metadata.description || metadata.excerpt || '',
        imageUrl: metadata.image || '',
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
        date: metadata.date || today,
        featured: !!metadata.featured,
        published: !!metadata.published,
        content: contentBody.trim()
      })
    } catch (err) {
      console.error('Failed to fetch blog', err)
      router.push('/dashboard/blog')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!blogData) return
    try {
      setSaving(true)
      // Reconstruct Markdown with Frontmatter
      const frontmatter = [
        '---',
        `title: "${blogData.title}"`,
        `date: "${blogData.date}"`,
        `description: "${blogData.description}"`,
        `image: "${blogData.imageUrl}"`,
        `tags: [${blogData.tags.map(t => `"${t}"`).join(', ')}]`,
        `featured: ${blogData.featured}`,
        `published: ${blogData.published}`,
        '---'
      ].join('\n')

      const fullMarkdown = `${frontmatter}\n\n${blogData.content}`

      const res = await fetch(`/api/content/blog/${slug}.md`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fullMarkdown })
      })

      if (res.ok) {
        showToast('Blog post saved successfully', 'success')
        const now = new Date();
        setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + (now.getMonth() + 1) + '/' + now.getDate())
      }
    } catch (err) {
      console.error('Save failed', err)
      showToast('failed to save changes', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#fafafa]">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )

  if (!blogData) return null

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          {/* Metadata Sidebar */}
          <CollapsibleSidebar title="BLOG METADATA">
            <BlogEditor 
              data={blogData} 
              onChange={(newData) => setBlogData(newData)} 
            />
          </CollapsibleSidebar>
          
          {/* Rich Editor Area */}
          <BlogPreview 
            key={blogData.slug}
            data={blogData} 
            onContentChange={(content) => setBlogData({ ...blogData, content })}
          />

        </div>

        {/* Footer */}
        <EditorFooter 
          onSave={handleSave} 
          saving={saving}
          lastSaved={lastSaved}
          wordCount={blogData.content.split(/\s+/).filter(Boolean).length}
          published={blogData.published}
          onPublishedChange={(val) => setBlogData({ ...blogData, published: val })}
        />
      </div>
    </DashboardLayout>
  )
}
