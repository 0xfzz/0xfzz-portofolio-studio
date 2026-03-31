'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical, History, Box } from 'lucide-react'
import { InputField } from './ui/InputField'
import { Button } from './ui/Button'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ContactMethod {
  id: string
  platform: string
  label: string
  href: string
  icon: string
}

// Presentational component for the method row
const MethodItem = ({
  method,
  onUpdate,
  onRemove,
  isDragging,
  dragHandleProps,
  style
}: {
  method: ContactMethod,
  onUpdate?: (id: string, field: keyof ContactMethod, value: string) => void,
  onRemove?: (id: string) => void,
  isDragging?: boolean,
  dragHandleProps?: any,
  style?: React.CSSProperties
}) => {
  return (
    <div
      style={style}
      className={`flex bg-[#fafafa] border ${isDragging ? 'border-gray-400 z-50' : 'border-gray-300'} group transition-all mb-4 rounded-none h-auto`}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="w-[48px] border-r border-gray-300 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors shrink-0"
      >
        <GripVertical className="w-3.5 h-3.5 text-gray-500" />
      </div>

      {/* Form Area */}
      <div className="flex-1 p-5 px-6 grid grid-cols-12 gap-6 items-end">
        <div className="col-span-3">
          <InputField
            label="PLATFORM"
            value={method.platform}
            placeholder="e.g. GitHub"
            onChange={(val) => onUpdate?.(method.id, 'platform', val)}
          />
        </div>
        <div className="col-span-3">
          <InputField
            label="ICON NAME"
            value={method.icon}
            placeholder="e.g. Github"
            onChange={(val) => onUpdate?.(method.id, 'icon', val)}
          />
        </div>
        <div className="col-span-3">
          <InputField
            label="LABEL"
            value={method.label}
            placeholder="e.g. View Repositories"
            onChange={(val) => onUpdate?.(method.id, 'label', val)}
          />
        </div>
        <div className="col-span-3">
          <InputField
            label="URL / HREF"
            value={method.href}
            placeholder="https://"
            onChange={(val) => onUpdate?.(method.id, 'href', val)}
          />
        </div>
      </div>

      {/* Delete Area */}
      <div
        className="w-[48px] border-l border-gray-300 flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-gray-500 cursor-pointer transition-colors shrink-0"
        onClick={() => onRemove?.(method.id)}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </div>
    </div>
  )
}

function SortableMethodItem({
  method,
  onUpdate,
  onRemove
}: {
  method: ContactMethod,
  onUpdate: (id: string, field: keyof ContactMethod, value: string) => void,
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: method.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Traditional dnd-kit look for smoothness
  }

  return (
    <div ref={setNodeRef} style={style}>
      <MethodItem
        method={method}
        onUpdate={onUpdate}
        onRemove={onRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

export function ContactManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const [heroTitle, setHeroTitle] = useState("")
  const [heroSubtitle, setHeroSubtitle] = useState("")
  const [methods, setMethods] = useState<ContactMethod[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/content/contact')
      const data = await res.json()
      setHeroTitle(data.title || "")
      setHeroSubtitle(data.subtitle || "")
      setMethods(data.methods?.map((m: any) => ({ ...m, id: m.id || Math.random().toString(36).substr(2, 9) })) || [])
    } catch (err) {
      console.error('Failed to fetch contact', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setStatus('idle')
      const contactData = {
        title: heroTitle,
        subtitle: heroSubtitle,
        methods: methods.map(({ id, ...m }) => m) // Remove internal IDs before saving
      }
      const res = await fetch('/api/content/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch (err) {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setMethods((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
    setActiveId(null)
  }

  const addMethod = () => {
    const newId = Math.random().toString(36).substr(2, 9)
    const newMethod: ContactMethod = {
      id: newId,
      platform: '',
      label: '',
      href: '',
      icon: ''
    }
    setMethods([...methods, newMethod])
  }

  const updateMethod = (id: string, field: keyof ContactMethod, value: string) => {
    setMethods(methods.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const removeMethod = (id: string) => {
    setMethods(methods.filter(m => m.id !== id))
  }

  const activeMethod = methods.find(m => m.id === activeId)

  if (loading) return (
    <div className="flex items-center justify-center h-64 border border-dashed border-[#e5e5e5]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )

  return (
    <div className="space-y-16 pb-32">
      <div className="bg-[#fafafa] border border-gray-300 p-8 lg:p-10 relative rounded-none space-y-8">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
            EDIT CONTACT DISPLAY
          </span>
        </div>

        <div className="space-y-6">
          <InputField 
            label="DISPLAY TITLE" 
            value={heroTitle} 
            onChange={setHeroTitle}
            className="font-semibold text-[18px] text-gray-900 tracking-tight"
          />
          <InputField 
            label="DISPLAY SUBTITLE" 
            value={heroSubtitle} 
            onChange={setHeroSubtitle} 
            type="textarea" 
            rows={3} 
          />
        </div>
      </div>

      <div className="bg-[#fafafa] border border-gray-300 p-8 lg:p-10 space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
              2. METHODS LIST
            </span>
          </div>
          <button 
            onClick={addMethod} 
            className="w-[150.14px] h-[32px] bg-[#333235] text-white px-4 py-2 text-[12px] font-mono font-normal flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors rounded-none shadow-none"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            Add Method
          </button>
        </div>

        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={methods.map(m => m.id)} strategy={verticalListSortingStrategy}>
              {methods.map((method) => (
                <SortableMethodItem
                  key={method.id}
                  method={method}
                  onUpdate={updateMethod}
                  onRemove={removeMethod}
                />
              ))}
            </SortableContext>

            <DragOverlay dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.5',
                  },
                },
              }),
            }}>
              {activeId && activeMethod ? (
                <MethodItem method={activeMethod} isDragging />
              ) : null}
            </DragOverlay>
          </DndContext>

          {methods.length === 0 && (
            <div className="p-16 border border-dashed border-gray-300 text-center bg-gray-50/50">
              <span className="text-[11px] font-mono font-semibold text-gray-400 uppercase tracking-[0.2em]">No contact methods configured.</span>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-12 right-12 flex items-center gap-4 z-[100]">
        {status === 'success' && (
          <div className="bg-gray-900 text-white px-6 py-3 border border-gray-800 text-[11px] font-mono font-bold uppercase tracking-[0.2em] rounded-[2px] animate-in fade-in slide-in-from-bottom-2">
            CHANGES SAVED LOCALLY
          </div>
        )}
        <button 
          onClick={fetchContact}
          className="w-[92px] h-[42px] bg-[#FCF8F9] border border-[#333235] text-[#333235] rounded-none text-[12px] font-mono font-bold tracking-widest hover:bg-gray-100 transition-colors shadow-none flex items-center justify-center"
        >
          RESET
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-[207px] h-[42px] bg-[#333235] text-[#FCF8F9] rounded-none text-[12px] font-mono font-bold tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center shadow-none disabled:opacity-50"
        >
          {saving ? 'SAVING...' : 'SAVE LOCALLY'}
        </button>
      </div>
    </div>
  )
}
