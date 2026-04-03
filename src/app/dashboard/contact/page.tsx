import React from 'react'
import { PageLayout } from '@/components/ui/PageLayout'
import { ContactManager } from '@/components/contact/ContactManager'

export default function ContactPage() {
  return (
    <PageLayout 
      title="Contact"
      subtitle="Digital Outposts & Inquiries"
    >
      <ContactManager />
    </PageLayout>
  )
}
