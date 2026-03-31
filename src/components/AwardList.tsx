'use client'

import React from 'react'
import { SortableList, SortableListItem } from './SortableList'

interface AwardListProps {
  items: any[]
  activeIndex: number
  onEdit: (index: number) => void
  onDelete: (index: number) => void
  onAdd: () => void
  onReorder: (newItems: any[]) => void
}

export function AwardList({
  items,
  activeIndex,
  onEdit,
  onDelete,
  onAdd,
  onReorder,
}: AwardListProps) {
  const listItems: SortableListItem[] = items.map((node, idx) => ({
    id: String(idx) + '_' + (node.title || ''),
    primary: node.title || 'Untitled Award',
    secondary: `${node.date || ''} — ${node.issuer || ''}`,
  }))

  const handleSelect = (id: string) => {
    const idx = listItems.findIndex((i) => i.id === id)
    if (idx !== -1) onEdit(idx)
  }

  const handleDelete = (id: string) => {
    const idx = listItems.findIndex((i) => i.id === id)
    if (idx !== -1) onDelete(idx)
  }

  const handleReorder = (newListItems: SortableListItem[]) => {
    const newItems = newListItems.map((li) => {
      const oldIdx = listItems.findIndex((o) => o.id === li.id)
      return items[oldIdx]
    })
    onReorder(newItems)
  }

  const activeId = listItems[activeIndex]?.id ?? null

  return (
    <SortableList
      label="AWARDS"
      items={listItems}
      activeId={activeId}
      onSelect={handleSelect}
      onDelete={handleDelete}
      onAdd={onAdd}
      onReorder={handleReorder}
    />
  )
}
