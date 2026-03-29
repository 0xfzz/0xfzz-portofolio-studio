'use client'

import React from 'react'
import { PageLayout } from '@/components/ui/PageLayout'
import { BlogTable } from '@/components/BlogTable'

export default function BlogPage() {
  return (
    <PageLayout
      title="Blog Articles"
      subtitle="DASHBOARD / BLOG"
      newEntryHref="/dashboard/blog/new"
    >
      <BlogTable />
    </PageLayout>
  )
}
