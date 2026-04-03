'use client'

import React from 'react'
import { SortableList, SortableListItem } from '@/components/editor/SortableList'

interface ExperienceHistoryProps {
  items: any[]
  activeIndex: number
  onEdit: (index: number) => void
  onDelete: (index: number) => void
  onAdd: () => void
  onReorder: (newItems: any[]) => void
}

export function ExperienceHistory({
  items,
  activeIndex,
  onEdit,
  onDelete,
  onAdd,
  onReorder,
}: ExperienceHistoryProps) {
  // Map array items to SortableListItem shape using index as stable-ish id
  const listItems: SortableListItem[] = items.map((node, idx) => ({
    id: String(idx) + '_' + (node.role || '') + '_' + (node.company || ''),
    primary: `${node.role || 'Untitled Role'} @ ${node.company || 'Unknown'}`,
    secondary: node.period || 'No Period',
  }))

  // Since ids are derived from content+index, we match back by index
  const handleSelect = (id: string) => {
    const idx = listItems.findIndex((i) => i.id === id)
    if (idx !== -1) onEdit(idx)
  }

  const handleDelete = (id: string) => {
    const idx = listItems.findIndex((i) => i.id === id)
    if (idx !== -1) onDelete(idx)
  }

  const handleReorder = (newListItems: SortableListItem[]) => {
    // Remap sorted ids back to original items array order
    const newItems = newListItems.map((li) => {
      const oldIdx = listItems.findIndex((o) => o.id === li.id)
      return items[oldIdx]
    })
    onReorder(newItems)
  }

  const activeId = listItems[activeIndex]?.id ?? null

  return (
    <SortableList
      label="HISTORY / ENTRIES"
      items={listItems}
      activeId={activeId}
      onSelect={handleSelect}
      onDelete={handleDelete}
      onAdd={onAdd}
      onReorder={handleReorder}
    />
  )
}
