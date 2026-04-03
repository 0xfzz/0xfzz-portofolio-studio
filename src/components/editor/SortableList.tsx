'use client'

import React, { useState } from 'react'
import { Plus, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface SortableListItem {
  id: string
  primary: string
  secondary?: string
}

interface SortableListProps {
  label: string
  items: SortableListItem[]
  activeId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
  onReorder: (newItems: SortableListItem[]) => void
}

function ListRow({
  item,
  isActive,
  onSelect,
  onDelete,
  dragHandleProps,
  style,
  isDragging,
}: {
  item: SortableListItem
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  style?: React.CSSProperties
  isDragging?: boolean
}) {
  return (
    <div
      style={style}
      className={`flex items-stretch group transition-all ${
        isDragging ? 'shadow-lg ring-1 ring-gray-300 z-50' : ''
      } ${isActive ? 'bg-[#f5f3f0] border-l-2 border-gray-900' : 'hover:bg-gray-50 border-l-2 border-transparent'}`}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        onClick={(e) => e.stopPropagation()}
        className="w-9 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors border-r border-gray-100 shrink-0"
      >
        <GripVertical className="w-3.5 h-3.5 text-gray-400" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-between p-5 px-4 cursor-pointer">
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-sans font-bold tracking-tight text-gray-900 truncate">
            {item.primary}
          </h3>
          {item.secondary && (
            <span className="text-[11px] font-mono font-medium text-gray-400 uppercase tracking-widest mt-0.5 block truncate">
              {item.secondary}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-[11px] font-mono font-semibold uppercase tracking-widest text-red-500 hover:underline"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  )
}

function SortableRow({
  item,
  isActive,
  onSelect,
  onDelete,
}: {
  item: SortableListItem
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ListRow
        item={item}
        isActive={isActive}
        onSelect={onSelect}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

export function SortableList({
  label,
  items,
  activeId,
  onSelect,
  onDelete,
  onAdd,
  onReorder,
}: SortableListProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggingId(null)
    if (over && active.id !== over.id) {
      const oldIdx = items.findIndex((i) => i.id === active.id)
      const newIdx = items.findIndex((i) => i.id === over.id)
      onReorder(arrayMove(items, oldIdx, newIdx))
    }
  }

  const draggingItem = items.find((i) => i.id === draggingId)

  return (
    <div className="w-full pb-16 pt-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-mono font-normal uppercase tracking-[0.05em] text-gray-500">
          {label} [{items.length}]
        </span>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 text-[11px] font-mono font-bold text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-widest"
        >
          <Plus className="w-3.5 h-3.5" /> ADD NEW
        </button>
      </div>

      <div className="bg-white border border-gray-200 divide-y divide-gray-200 overflow-hidden">
        {items.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-gray-200 bg-gray-50/30">
            <span className="text-[12px] font-mono text-gray-400 uppercase tracking-widest">
              No entries found. Click "Add New" to start.
            </span>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setDraggingId(null)}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  isActive={item.id === activeId}
                  onSelect={() => onSelect(item.id)}
                  onDelete={() => onDelete(item.id)}
                />
              ))}
            </SortableContext>

            <DragOverlay
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: { active: { opacity: '0.4' } },
                }),
              }}
            >
              {draggingItem ? (
                <ListRow
                  item={draggingItem}
                  isActive={false}
                  onSelect={() => {}}
                  onDelete={() => {}}
                  isDragging
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  )
}
