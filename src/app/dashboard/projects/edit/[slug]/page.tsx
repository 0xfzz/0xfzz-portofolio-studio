'use client'

import React, { useState, useEffect, use } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardHeader } from '@/components/DashboardHeader'
import { ProjectEditor } from '@/components/ProjectEditor'
import { ProjectPreview } from '@/components/ProjectPreview'
import { EditorFooter } from '@/components/EditorFooter'
import { useRouter } from 'next/navigation'

interface ProjectData {
  title: string
  slug: string
  description: string
  imageUrl: string
  date: string
  technologies: string[]
  sourceUrl: string
  liveUrl?: string
  featured: boolean
  published: boolean
  content: string
}

export default function ProjectEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [projectData, setProjectData] = useState<ProjectData | null>(null)

  useEffect(() => {
    fetchProject()
  }, [slug])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/content/projects/${slug}.md`)
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

      setProjectData({
        title: metadata.title || '',
        slug: slug,
        description: metadata.description || '',
        imageUrl: metadata.image || '',
        date: metadata.date || today,
        technologies: Array.isArray(metadata.technologies) ? metadata.technologies : [],
        sourceUrl: metadata.sourceUrl || metadata.githubUrl || '',
        liveUrl: metadata.liveUrl || '',
        featured: !!metadata.featured,
        published: !!metadata.published,
        content: contentBody.trim()
      })
    } catch (err) {
      console.error('Failed to fetch project', err)
      router.push('/dashboard/projects')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!projectData) return
    try {
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

      const res = await fetch(`/api/content/projects/${slug}.md`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fullMarkdown })
      })

      if (res.ok) {
        alert('CHANGES SAVED SUCCESSFULLY')
      }
    } catch (err) {
      console.error('Save failed', err)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#fafafa]">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )

  if (!projectData) return null

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          {/* Editor Side */}
          <ProjectEditor 
            data={projectData} 
            onChange={(newData) => setProjectData(newData)} 
          />
          
          {/* Preview Side */}
          <ProjectPreview data={projectData} />
        </div>

        {/* Footer */}
        <EditorFooter 
          onSave={handleSave} 
          published={projectData.published}
          onPublishedChange={(val) => setProjectData({ ...projectData, published: val })}
        />
      </div>
    </DashboardLayout>
  )
}
