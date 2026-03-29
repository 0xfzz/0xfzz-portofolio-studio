'use client'

import React, { useState } from 'react'
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
      className={`flex bg-white border ${isDragging ? 'border-black scale-[1.02] z-50' : 'border-[#f0f0f0]'} group hover:border-[#e5e5e5] transition-all overflow-hidden rounded-sm`}
    >
      {/* Drag Handle Area */}
      <div
        {...dragHandleProps}
        className="w-14 bg-[#fafafa] border-r border-[#f0f0f0] flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-[#f0f0f0] transition-colors"
      >
        <GripVertical className="w-4 h-4 text-[#ccc] group-hover:text-[#a0a0a0]" />
      </div>

      {/* Form Area */}
      <div className="flex-1 p-6 px-10 grid grid-cols-12 gap-8 items-end">
        <div className="col-span-3">
          <InputField
            label="PLATFORM"
            value={method.platform}
            onChange={(val) => onUpdate?.(method.id, 'platform', val)}
            className="bg-[#fcfcfc]"
          />
        </div>
        <div className="col-span-4">
          <InputField
            label="LABEL"
            value={method.label}
            onChange={(val) => onUpdate?.(method.id, 'label', val)}
            className="bg-[#fcfcfc]"
          />
        </div>
        <div className="col-span-5">
          <InputField
            label="URL / HREF"
            value={method.href}
            onChange={(val) => onUpdate?.(method.id, 'href', val)}
            className="bg-[#fcfcfc]"
          />
        </div>
      </div>

      {/* Action Area */}
      <div
        className="w-16 border-l border-[#f0f0f0] flex items-center justify-center bg-white hover:bg-[#fff5f5] group/trash cursor-pointer transition-colors"
        onClick={() => onRemove?.(method.id)}
      >
        <Trash2 className="w-4 h-4 text-[#ccc] group-hover/trash:text-[#ff4d4f] transition-colors" />
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

const initialMethods: ContactMethod[] = [
  { id: '1', platform: 'GitHub', label: 'View Repositories', href: 'https://github.com/0xfzz' },
  { id: '2', platform: 'LinkedIn', label: 'Professional Network', href: 'https://linkedin.com/in/0xfzz' },
  { id: '3', platform: 'Email', label: 'faiz@0xfzz.my.id', href: 'mailto:faiz@0xfzz.my.id' }
]

export function ContactManager() {
  const [heroTitle, setHeroTitle] = useState("Let's Connect")
  const [heroSubtitle, setHeroSubtitle] = useState("I'm currently open to new opportunities and technical collaborations. Reach out using the digital outposts below.")
  const [methods, setMethods] = useState<ContactMethod[]>(initialMethods)
  const [activeId, setActiveId] = useState<string | null>(null)

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
      href: ''
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

  return (
    <div className="space-y-16 pb-32">
      <div className="bg-white border border-[#f0f0f0] p-12 space-y-10 relative group hover:border-[#e5e5e5] transition-all">
        <div className="flex items-center gap-3 mb-4">
          <Box className="w-4 h-4 text-[#1a1a1a] opacity-40" />
          <span className="text-[12px] font-mono font-bold text-[#1a1a1a] opacity-40 uppercase tracking-wider">
            Edit Contact Display
          </span>
        </div>

        <InputField label="Display Title" value={heroTitle} onChange={setHeroTitle} />
        <InputField label="Display Subtitle" value={heroSubtitle} onChange={setHeroSubtitle} type="textarea" rows={3} />
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#1a1a1a] opacity-60 uppercase tracking-wider">
            ACTIVE_METHODS ({methods.length})
          </span>
          <button onClick={addMethod} className="bg-[#1a1a1a] text-white px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider hover:bg-black transition-all flex items-center gap-2 rounded-sm">
            <Plus className="w-4 h-4" /> [+ ADD METHOD]
          </button>
        </div>

        <div className="space-y-4">
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
            <div className="p-16 border-2 border-dashed border-[#f0f0f0] text-center rounded-sm">
              <span className="text-[12px] font-bold text-[#ccc] uppercase tracking-wider">No contact methods configured.</span>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-12 right-24 flex items-center gap-4 z-[100]">
        <button className="h-[52px] bg-white border border-[#e5e5e5] px-10 rounded-sm text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a] hover:border-black transition-all bg-white/80 backdrop-blur-md">
          RESET
        </button>
        <button className="h-[52px] bg-[#1a1a1a] text-white px-12 rounded-sm text-[12px] font-bold uppercase tracking-wider hover:bg-black transition-all active:scale-95">
          COMMIT CHANGES
        </button>
      </div>
    </div>
  )
}
