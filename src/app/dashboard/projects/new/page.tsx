'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardHeader } from '@/components/DashboardHeader'
import { ProjectEditor } from '@/components/ProjectEditor'
import { ProjectPreview } from '@/components/ProjectPreview'
import { EditorFooter } from '@/components/EditorFooter'

const emptyData = {
  title: '',
  slug: '',
  description: '',
  imageUrl: '',
  liveUrl: '',
  sourceUrl: '',
  technologies: [],
  content: ''
}

export default function ProjectNewPage() {
  const [projectData, setProjectData] = useState(emptyData)

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          {/* Editor Side */}
          <ProjectEditor data={projectData} onChange={setProjectData} />
          
          {/* Preview Side */}
          <ProjectPreview data={projectData} />
        </div>

        {/* Footer */}
        <EditorFooter />
      </div>
    </DashboardLayout>
  )
}
