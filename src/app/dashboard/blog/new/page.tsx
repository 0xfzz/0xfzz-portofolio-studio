'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { DashboardHeader } from '@/components/DashboardHeader'
import { BlogEditor } from '@/components/BlogEditor'
import { BlogPreview } from '@/components/BlogPreview'
import { EditorFooter } from '@/components/EditorFooter'

const emptyData = {
  title: '',
  slug: '',
  excerpt: '',
  imageUrl: '',
  tags: [],
  content: ''
}

export default function BlogNewPage() {
  const [blogData, setBlogData] = useState(emptyData)

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
