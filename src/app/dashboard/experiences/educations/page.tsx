'use client'

import React from 'react'
import { ExperienceLayout } from '@/components/ExperienceLayout'
import { EducationForm } from '@/components/EducationForm'
import { EducationList } from '@/components/EducationList'

export default function EducationsPage() {
  return (
    <ExperienceLayout
      title="Educations"
      subtitle="Experiences"
      form={<EducationForm />}
      list={<EducationList />}
    />
  )
}
