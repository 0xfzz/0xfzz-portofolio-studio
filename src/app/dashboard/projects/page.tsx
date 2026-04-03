'use client'

import React from 'react'
import { PageLayout } from '@/components/ui/PageLayout'
import { ProjectTable } from '@/components/projects/ProjectTable'

export default function ProjectsPage() {
  return (
    <PageLayout
      title="Project Portfolio"
      subtitle="CMS / REPOSITORY"
      newEntryHref="/dashboard/projects/new"
    >
      <ProjectTable />
    </PageLayout>
  )
}
