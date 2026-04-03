'use client'

import React from 'react'
import { SortableList, SortableListItem } from '@/components/editor/SortableList'

interface EducationListProps {
  items: any[]
  activeIndex: number
  onEdit: (index: number) => void
  onDelete: (index: number) => void
  onAdd: () => void
  onReorder: (newItems: any[]) => void
}

export function EducationList({
  items,
  activeIndex,
  onEdit,
  onDelete,
  onAdd,
  onReorder,
}: EducationListProps) {
  const listItems: SortableListItem[] = items.map((node, idx) => ({
    id: String(idx) + '_' + (node.institution || ''),
    primary: node.institution || 'Untitled Institution',
    secondary: `${node.degree || ''} | ${node.period || ''}`,
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
      label="EDUCATIONS"
      items={listItems}
      activeId={activeId}
      onSelect={handleSelect}
      onDelete={handleDelete}
      onAdd={onAdd}
      onReorder={handleReorder}
    />
  )
}
