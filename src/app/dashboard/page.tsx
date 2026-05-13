'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

export default function DashboardPage() {
  const [blogCount, setBlogCount] = useState<number | string>('...')
  const [projectCount, setProjectCount] = useState<number | string>('...')

  useEffect(() => {
    fetch('/api/content/blog')
      .then(res => res.json())
      .then(data => {
        setBlogCount(Array.isArray(data) ? data.length : 0)
      })
      .catch(() => setBlogCount('Error'))

    fetch('/api/content/projects')
      .then(res => res.json())
      .then(data => {
        setProjectCount(Array.isArray(data) ? data.length : 0)
      })
      .catch(() => setProjectCount('Error'))
  }, [])

  return (
    <DashboardLayout>
      <DashboardHeader />
      <main className="flex-1 p-12 pt-8 overflow-y-auto bg-white">
        <h2 className="text-[20px] font-sans font-semibold text-gray-900 mb-8">Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
          {/* Blog Metrics */}
          <div className="bg-white border border-gray-200 p-8 flex flex-col justify-center items-start">
            <span className="text-[12px] font-mono font-medium text-gray-500 uppercase mb-3">Total Blogs</span>
            <span className="text-[48px] font-sans font-bold text-gray-900 leading-none">{blogCount}</span>
          </div>

          {/* Project Metrics */}
          <div className="bg-white border border-gray-200 p-8 flex flex-col justify-center items-start">
            <span className="text-[12px] font-mono font-medium text-gray-500 uppercase mb-3">Total Projects</span>
            <span className="text-[48px] font-sans font-bold text-gray-900 leading-none">{projectCount}</span>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
