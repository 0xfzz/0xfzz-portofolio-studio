'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { BlogEditor } from '@/components/blog/BlogEditor'
import { BlogPreview } from '@/components/blog/BlogPreview'
import { EditorFooter } from '@/components/editor/EditorFooter'
import { CollapsibleSidebar } from '@/components/layout/CollapsibleSidebar'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/context/NotificationContext'

export default function BlogNewPage() {
  const router = useRouter()
  const { showToast } = useNotification()
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>('Never saved')
  const [blogData, setBlogData] = useState({
    title: '',
    slug: '',
    description: '',
    imageUrl: '',
    tags: [] as string[],
    date: new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    featured: false,
    published: false,
    content: ''
  })

  const handleSave = async () => {
    if (!blogData.slug) {
      showToast('Please provide a slug', 'error')
      return
    }
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

      const res = await fetch(`/api/content/blog/${blogData.slug}.md`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fullMarkdown })
      })

      if (res.ok) {
        showToast('Blog post created successfully', 'success')
        const now = new Date();
        setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + (now.getMonth() + 1) + '/' + now.getDate())
        router.push(`/dashboard/blog/edit/${blogData.slug}`)
      }
    } catch (err) {
      console.error('Create failed', err)
      showToast('failed to create blog post', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          {/* Metadata Sidebar */}
          <CollapsibleSidebar title="BLOG METADATA">
            <BlogEditor 
              data={blogData} 
              onChange={(newData: any) => setBlogData(newData)} 
            />
          </CollapsibleSidebar>
          
          {/* Rich Editor Area */}
          <BlogPreview 
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
