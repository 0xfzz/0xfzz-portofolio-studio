'use client'

import React, { useState, useEffect } from 'react'
import { ExperienceLayout } from '@/components/ExperienceLayout'
import { AwardForm } from '@/components/AwardForm'
import { AwardList } from '@/components/AwardList'
import { RefreshCw } from 'lucide-react'

export default function AwardsPage() {
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
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch (err) {
      setStatus('error')
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
      />

      {/* Floating Action Bar */}
      <div className="fixed bottom-12 right-12 flex items-center gap-4 z-[60]">
        {status === 'success' && (
          <div className="bg-gray-900 text-white px-6 py-3 border border-gray-800 text-[11px] font-mono font-bold uppercase tracking-[0.2em] shadow-lg rounded-[2px] animate-in fade-in slide-in-from-bottom-2">
            CHANGES SAVED LOCALLY
          </div>
        )}
        <button 
          onClick={fetchData}
          className="w-[92px] h-[42px] bg-[#FCF8F9] border border-[#333235] text-[#333235] rounded-none text-[12px] font-mono font-bold tracking-widest hover:bg-gray-100 transition-colors shadow-none flex items-center justify-center"
        >
          RESET
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-[207px] h-[42px] bg-[#333235] text-[#FCF8F9] rounded-none text-[12px] font-mono font-bold tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center shadow-none disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-3" /> : null}
          {saving ? 'SAVING...' : 'COMMIT CHANGES'}
        </button>
      </div>
    </>
  )
}
