'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardHeader } from '@/components/DashboardHeader'
import { ProjectEditor } from '@/components/ProjectEditor'
import { ProjectPreview } from '@/components/ProjectPreview'
import { EditorFooter } from '@/components/EditorFooter'

const initialData = {
  title: 'Lumina Core Engine',
  slug: 'lumina-core-engine',
  description: 'Next-generation real-time rendering engine built for high-performance architectural visualization.',
  imageUrl: 'https://images.unsplash.com/photo-1635332396679-452af77c0f13?q=80&w=2070&auto=format&fit=crop',
  liveUrl: 'https://lumina-demo.io',
  sourceUrl: 'https://github.com/0xfzz/lumina-core',
  technologies: ['C++', 'VULKAN', 'RUST'],
  content: `Lumina Core is a high-performance graphics framework designed from the ground up using the latest systems programming techniques. The engine implements a fully multi-threaded command buffer generation system, allowing it to saturate modern multi-core CPUs while maintaining ultra-low latency on the GPU.

### Key Innovations:
- Bindless resource management for maximum GPU throughput.
- Compute-driven geometry pipeline bypassing fixed-function overhead.
- Global illumination via temporal radiance caching.

Built for developers who refuse to compromise on performance or visual fidelity, Lumina provides the bedrock for the next decade of interactive experiences.`
}

export default function ProjectEditPage() {
  const [projectData, setProjectData] = useState(initialData)

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
