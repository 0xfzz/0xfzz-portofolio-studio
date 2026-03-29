'use client'

import React from 'react'
import { ExperienceLayout } from '@/components/ExperienceLayout'
import { ExperienceForm } from '@/components/ExperienceForm'
import { ExperienceHistory } from '@/components/ExperienceHistory'

export default function WorkExperiencePage() {
  return (
    <ExperienceLayout
      title="Work Experience"
      subtitle="Experiences"
      form={<ExperienceForm />}
      list={<ExperienceHistory />}
    />
  )
}
