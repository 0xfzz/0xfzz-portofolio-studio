'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardHeader } from '@/components/DashboardHeader'
import { BlogEditor } from '@/components/BlogEditor'
import { BlogPreview } from '@/components/BlogPreview'
import { EditorFooter } from '@/components/EditorFooter'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/context/NotificationContext'

export default function BlogNewPage() {
  const router = useRouter()
  const { showToast } = useNotification()
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
    try {
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
        router.push(`/dashboard/blog/edit/${blogData.slug}`)
      }
    } catch (err) {
      console.error('Create failed', err)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          {/* Editor Side */}
          <BlogEditor data={blogData} onChange={setBlogData} />
          
          {/* Preview Side */}
          <BlogPreview data={blogData} />
        </div>

        {/* Footer */}
        <EditorFooter 
          onSave={handleSave} 
          published={blogData.published}
          onPublishedChange={(val) => setBlogData({ ...blogData, published: val })}
        />
      </div>
    </DashboardLayout>
  )
}
