'use client'

import React from 'react'
import { TechStackManager } from '@/components/tech-stack/TechStackManager'
import { PageLayout } from '@/components/ui/PageLayout'

export default function TechStackPage() {
  return (
    <PageLayout
      title="Tech Stack"
      subtitle="Manage your professional skills and tools categorizations"
    >
      <TechStackManager />
    </PageLayout>
  )
}
