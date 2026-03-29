'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardHeader } from '@/components/DashboardHeader'
import { BlogEditor } from '@/components/BlogEditor'
import { BlogPreview } from '@/components/BlogPreview'
import { EditorFooter } from '@/components/EditorFooter'

const initialData = {
  title: 'Lumina Core Engine',
  slug: 'lumina-core-engine',
  excerpt: 'Next-generation real-time rendering engine built for high-performance architectural visualization.',
  imageUrl: 'https://images.unsplash.com/photo-1635332396679-452af77c0f13?q=80&w=2070&auto=format&fit=crop',
  tags: ['RUST', 'VULKAN', 'WASM'],
  content: `Lumina Core is a high-performance graphics framework designed from the ground up using the latest systems programming techniques. The engine implements a fully multi-threaded command buffer generation system, allowing it to saturate modern multi-core CPUs while maintaining ultra-low latency on the GPU.

### Key Innovations:
- Bindless resource management for maximum GPU throughput.
- Compute-driven geometry pipeline bypassing fixed-function overhead.
- Global illumination via temporal radiance caching.`
}

export default function BlogEditPage() {
  const [blogData, setBlogData] = useState(initialData)

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
        <EditorFooter />
      </div>
    </DashboardLayout>
  )
}
