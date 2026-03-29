'use client'

import React from 'react'

interface Column<T> {
  header: string
  key: keyof T | string
  render?: (item: T) => React.ReactNode
  className?: string
  width?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
}

export function Table<T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick 
}: TableProps<T>) {
  return (
    <div className="bg-white border border-[#f0f0f0] rounded-sm overflow-hidden font-mono">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#f0f0f0] bg-[#fafafa]">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`px-8 py-5 text-[10px] font-mono font-bold text-[#a0a0a0] uppercase tracking-[0.2em] ${col.className || ''}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0f0f0]">
          {data.map((item) => (
            <tr 
              key={item.id} 
              className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[#fafafa]' : 'hover:bg-[#fafafa]'}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col, idx) => (
                <td key={idx} className={`px-8 py-6 font-mono text-[12px] text-[#1a1a1a] ${col.className || ''}`}>
                  {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
