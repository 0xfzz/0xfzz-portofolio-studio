'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { ProjectEditor } from '@/components/projects/ProjectEditor'
import { ProjectPreview } from '@/components/projects/ProjectPreview'
import { EditorFooter } from '@/components/editor/EditorFooter'
import { CollapsibleSidebar } from '@/components/layout/CollapsibleSidebar'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/context/NotificationContext'

export default function ProjectNewPage() {
  const router = useRouter()
  const { showToast } = useNotification()
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>('Never saved')
  
  const [projectData, setProjectData] = useState({
    title: '',
    slug: '',
    description: '',
    imageUrl: '',
    liveUrl: '',
    sourceUrl: '',
    technologies: [] as string[],
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
    if (!projectData.slug) {
       showToast('Please provide a slug/title', 'error')
       return
    }
    try {
      setSaving(true)
      // Reconstruct Markdown with Frontmatter
      const frontmatter = [
        '---',
        `title: "${projectData.title}"`,
        `date: "${projectData.date}"`,
        `description: "${projectData.description}"`,
        `image: "${projectData.imageUrl}"`,
        `technologies: [${projectData.technologies.map(t => `"${t}"`).join(', ')}]`,
        `sourceUrl: "${projectData.sourceUrl}"`,
        `liveUrl: "${projectData.liveUrl}"`,
        `featured: ${projectData.featured}`,
        `published: ${projectData.published}`,
        '---'
      ].join('\n')

      const fullMarkdown = `${frontmatter}\n\n${projectData.content}`

      const res = await fetch(`/api/content/projects/${projectData.slug}.md`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fullMarkdown })
      })

      if (res.ok) {
        showToast('Project created successfully', 'success')
        const now = new Date();
        setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + (now.getMonth() + 1) + '/' + now.getDate())
        router.push(`/dashboard/projects/edit/${projectData.slug}`)
      }
    } catch (err) {
      console.error('Create failed', err)
      showToast('failed to create project', 'error')
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
          <CollapsibleSidebar title="PROJECT METADATA">
            <ProjectEditor 
              data={projectData} 
              onChange={(newData: any) => setProjectData(newData)} 
            />
          </CollapsibleSidebar>
          
          {/* Rich Editor Area */}
          <ProjectPreview 
            data={projectData} 
            onContentChange={(content) => setProjectData({ ...projectData, content })}
          />
        </div>

        {/* Footer */}
        <EditorFooter 
          onSave={handleSave} 
          saving={saving}
          lastSaved={lastSaved}
          wordCount={projectData.content.split(/\s+/).filter(Boolean).length}
          published={projectData.published}
          onPublishedChange={(val) => setProjectData({ ...projectData, published: val })}
        />
      </div>
    </DashboardLayout>
  )
}
