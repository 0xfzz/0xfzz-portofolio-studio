import React, { useState } from 'react'
import { Trash2, Plus, GripVertical } from 'lucide-react'
import { InputField } from '@/components/ui/InputField'
import { Badge } from '@/components/ui/Badge'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ExperienceData {
  company: string
  role: string
  period: string
  location: string
  description: string[]
  tags: string[]
}

interface ExperienceFormProps {
  data: ExperienceData
  onChange: (newData: ExperienceData) => void
}

type DescItem = { id: string; text: string }

function makeId() {
  return `d${Math.random().toString(36).slice(2, 9)}`
}

function SortableDescriptionRow({
  id,
  value,
  onChange,
  onRemove,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 group">
      <div
        {...attributes}
        {...listeners}
        className="w-8 flex items-start justify-center pt-4 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors shrink-0"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      <div className="flex-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full bg-[#fafafa] border border-gray-200 p-4 text-[13px] font-sans text-gray-700 leading-relaxed font-medium focus:border-gray-400 outline-none transition-all resize-none"
          placeholder="Enter responsibility or achievement..."
        />
      </div>

      <button
        onClick={onRemove}
        className="bg-white border border-gray-200 h-[auto] w-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0 rounded-none group-hover:border-gray-300"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  // Local state with stable IDs — avoids stale index-based IDs breaking DnD
  const [descItems, setDescItems] = useState<DescItem[]>(() =>
    data.description.map((text) => ({ id: makeId(), text }))
  )

  const syncDesc = (newItems: DescItem[]) => {
    setDescItems(newItems)
    onChange({ ...data, description: newItems.map((d) => d.text) })
  }

  const addDescription = () => {
    syncDesc([...descItems, { id: makeId(), text: '' }])
  }

  const updateDescription = (id: string, value: string) => {
    syncDesc(descItems.map((d) => (d.id === id ? { ...d, text: value } : d)))
  }

  const removeDescription = (id: string) => {
    syncDesc(descItems.filter((d) => d.id !== id))
  }

  const toggleTag = (tag: string) => {
    const tags = [...data.tags]
    const index = tags.indexOf(tag)
    if (index > -1) tags.splice(index, 1)
    else tags.push(tag)
    onChange({ ...data, tags })
  }

  const updateField = (field: keyof ExperienceData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = descItems.findIndex((d) => d.id === active.id)
    const newIdx = descItems.findIndex((d) => d.id === over.id)
    syncDesc(arrayMove([...descItems], oldIdx, newIdx))
  }

  return (
    <div className="bg-white border border-gray-200 p-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <h2 className="text-[20px] font-sans font-bold text-gray-900 tracking-tight leading-none mb-3">
            {data.role || 'Untitled Role'} @ {data.company || 'Unknown Company'}
          </h2>
          <span className="text-[12px] font-mono font-medium text-gray-500 tracking-wider block uppercase">
            {data.period || 'Period Not Specified'}
          </span>
        </div>
        <Badge variant="success" className="px-2 py-0.5 text-[11px] font-mono font-bold tracking-widest">ENTRY ENABLED</Badge>
      </div>

      {/* Form Fields */}
      <div className="space-y-8 mb-14">
        <InputField
          label="COMPANY / ORGANIZATION"
          value={data.company}
          onChange={(v) => updateField('company', v)}
          horizontal
          placeholder="e.g. PT. Pilar Teknotama Sinergi"
        />
        <InputField
          label="ROLE / POSITION"
          value={data.role}
          onChange={(v) => updateField('role', v)}
          horizontal
          placeholder="e.g. Software Engineer"
        />
        <div className="flex items-center gap-4">
          <label className="text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500 w-48 shrink-0">
            PERIOD
          </label>
          <div className="flex items-center gap-4 w-full">
            <InputField
              label=""
              value={(data.period || '').split(' - ')[0] || ''}
              onChange={(v) => {
                const parts = (data.period || '').split(' - ')
                updateField('period', `${v || ''} - ${parts[1] || ''}`)
              }}
              className="flex-1"
              placeholder="START (e.g. JUN 2023)"
            />
            <span className="text-[11px] font-mono font-normal tracking-[0.05em] text-gray-500 px-2 shrink-0 uppercase">TO</span>
            <InputField
              label=""
              value={(data.period || '').split(' - ')[1] || ''}
              onChange={(v) => {
                const parts = (data.period || '').split(' - ')
                updateField('period', `${parts[0] || ''} - ${v || ''}`)
              }}
              className="flex-1"
              placeholder="END (e.g. PRESENT)"
            />
          </div>
        </div>
        <InputField
          label="LOCATION"
          value={data.location || ''}
          onChange={(v) => updateField('location', v)}
          horizontal
          placeholder="e.g. Yogyakarta, Indonesia"
        />
      </div>

      {/* Tags */}
      <div className="mb-14">
        <label className="text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500 block mb-4">
          TECHNOLOGIES & TAGS
        </label>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag} variant="tag" className="flex items-center gap-2 pr-1">
              {tag}
              <button onClick={() => toggleTag(tag)} className="hover:text-red-500">
                <Plus className="w-3 h-3 rotate-45" />
              </button>
            </Badge>
          ))}
          <input
            type="text"
            placeholder="Add tag..."
            className="bg-transparent border-b border-gray-200 focus:border-gray-900 outline-none text-[12px] font-mono px-2 py-1 min-w-[120px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.currentTarget as HTMLInputElement).value.trim()
                if (val) {
                  toggleTag(val);
                  (e.currentTarget as HTMLInputElement).value = ''
                }
              }
            }}
          />
        </div>
      </div>

      {/* Achievements & Responsibilities — DnD */}
      <div className="mt-14">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500">
            ACHIEVEMENTS & RESPONSIBILITIES
          </span>
          <span className="text-[11px] font-mono font-normal text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <GripVertical className="w-3 h-3" /> drag to reorder · [{descItems.length} items]
          </span>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={descItems.map((d) => d.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 mb-8">
              {descItems.map((item) => (
                <SortableDescriptionRow
                  key={item.id}
                  id={item.id}
                  value={item.text}
                  onChange={(v) => updateDescription(item.id, v)}
                  onRemove={() => removeDescription(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          onClick={addDescription}
          className="w-full border border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 py-4 flex items-center justify-center gap-2 font-mono text-[11px] font-normal tracking-[0.1em] uppercase transition-all rounded-none bg-[#fafafa]"
        >
          <Plus className="w-4 h-4" />
          ADD DESCRIPTION LINE
        </button>
      </div>
    </div>
  )
}
