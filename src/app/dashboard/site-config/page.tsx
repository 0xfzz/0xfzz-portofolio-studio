import React from 'react'
import { PageLayout } from '@/components/ui/PageLayout'
import { SiteConfigManager } from '@/components/site-config/SiteConfigManager'

export default function SiteConfigPage() {
  return (
    <PageLayout 
      title="Site Config"
      subtitle="Global Metadata & Visibility Configuration"
    >
      <SiteConfigManager />
    </PageLayout>
  )
}
