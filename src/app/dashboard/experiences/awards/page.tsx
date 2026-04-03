'use client'

import React, { useState, useEffect } from 'react'
import { ExperienceLayout } from '@/components/experience/ExperienceLayout'
import { AwardForm } from '@/components/experience/AwardForm'
import { AwardList } from '@/components/experience/AwardList'
import { RefreshCw } from 'lucide-react'
import { useNotification } from '@/context/NotificationContext'

export default function AwardsPage() {
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
      const res = await fetch('/api/content/experiences/awards')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch awards', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setStatus('idle')
      const res = await fetch('/api/content/experiences/awards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      })
      if (res.ok) {
        setStatus('success')
        showToast('Awards saved successfully', 'success')
      } else {
        setStatus('error')
        showToast('Failed to save awards', 'error')
      }
    } catch (err) {
      setStatus('error')
      showToast('Error saving awards', 'error')
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
      title: '',
      issuer: '',
      date: '',
      description: ''
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
    title: '',
    issuer: '',
    date: '',
    description: ''
  }

  return (
    <>
      <ExperienceLayout
        title="Awards"
        subtitle="Manage your achievements and recognitions"
        form={<AwardForm data={activeItem} onChange={updateItem} />}
        list={<AwardList items={items} activeIndex={activeIndex} onEdit={setActiveIndex} onDelete={deleteItem} onAdd={addItem} onReorder={reorderItems} />}
        onSave={handleSave}
        onReset={fetchData}
        onAdd={addItem}
        saving={saving}
        status={status}
      />
    </>
  )
}
