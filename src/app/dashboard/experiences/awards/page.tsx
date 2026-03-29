'use client'

import React from 'react'
import { ExperienceLayout } from '@/components/ExperienceLayout'
import { AwardForm } from '@/components/AwardForm'
import { AwardList } from '@/components/AwardList'

export default function AwardsPage() {
  return (
    <ExperienceLayout
      title="Awards"
      subtitle="Experiences"
      form={<AwardForm />}
      list={<AwardList />}
    />
  )
}
