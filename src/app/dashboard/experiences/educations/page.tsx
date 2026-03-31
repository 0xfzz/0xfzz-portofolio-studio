'use client'

import React, { useState, useEffect } from 'react'
import { ExperienceLayout } from '@/components/ExperienceLayout'
import { EducationForm } from '@/components/EducationForm'
import { EducationList } from '@/components/EducationList'
import { RefreshCw } from 'lucide-react'
import { useNotification } from '@/context/NotificationContext'

export default function EducationsPage() {
  const { showToast } = useNotification()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [items, setItems] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/content/experiences/education')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch educations', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setStatus('idle')
      const res = await fetch('/api/content/experiences/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      })
      if (res.ok) {
        setStatus('success')
        showToast('Education history saved successfully', 'success')
      } else {
        setStatus('error')
        showToast('Failed to save education history', 'error')
      }
    } catch (err) {
      setStatus('error')
      showToast('Error saving education history', 'error')
    } finally {
      setSaving(false)
    }
  }

  const updateItem = (newData: any) => {
    const newItems = [...items]
    newItems[activeIndex] = newData
    setItems(newItems)
  }

  const addItem = () => {
    const newItem = {
      institution: '',
      degree: '',
      period: '',
      location: ''
    }
    setItems([newItem, ...items])
    setActiveIndex(0)
  }

  const deleteItem = (idx: number) => {
    const newItems = items.filter((_, i) => i !== idx)
    setItems(newItems)
    if (activeIndex >= newItems.length) setActiveIndex(Math.max(0, newItems.length - 1))
  }

  const reorderItems = (newItems: any[]) => {
    const activeItem = items[activeIndex]
    setItems(newItems)
    const newIdx = newItems.indexOf(activeItem)
    if (newIdx !== -1) setActiveIndex(newIdx)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#fafafa]">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )

  const activeItem = items[activeIndex] || {
    institution: '',
    degree: '',
    period: '',
    location: ''
  }

  return (
    <>
      <ExperienceLayout
        title="Educations"
        subtitle="Manage your academic background"
        form={<EducationForm data={activeItem} onChange={updateItem} />}
        list={<EducationList items={items} activeIndex={activeIndex} onEdit={setActiveIndex} onDelete={deleteItem} onAdd={addItem} onReorder={reorderItems} />}
        onSave={handleSave}
        onReset={fetchData}
        onAdd={addItem}
        saving={saving}
        status={status}
      />
    </>
  )
}
