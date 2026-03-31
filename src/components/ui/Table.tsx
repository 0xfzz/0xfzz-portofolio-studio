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
    <div className="bg-white border border-gray-300 rounded-[2px] overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#fbfbfb]">
          <tr className="border-b border-gray-300">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`px-5 py-3.5 text-[11px] font-mono font-semibold text-gray-500 uppercase tracking-widest ${col.className || ''}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr 
              key={item.id} 
              className={`group transition-all ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : 'hover:bg-gray-50/50 bg-white'}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col, idx) => (
                <td key={idx} className={`px-5 py-4 font-sans text-[13px] ${col.className || ''}`}>
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
