'use client'

import React, { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { Table } from './Table'
import { Button } from './Button'

interface FilterOption {
  label: string
  key: string
  options: string[]
}

interface DataTableProps<T> {
  data: T[]
  columns: any[]
  searchPlaceholder?: string
  searchKeys?: (keyof T | string)[]
  filters?: FilterOption[]
  pageSize?: number
  onRowClick?: (item: T) => void
}

export function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  searchPlaceholder = 'SEARCH_RECORDS...', 
  searchKeys = [],
  filters = [],
  pageSize = 10,
  onRowClick
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  // Filtering Logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 1. Search Query Match
      if (searchQuery && searchKeys.length > 0) {
        const matchesSearch = searchKeys.some(key => {
          const value = item[key as keyof T]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchQuery.toLowerCase())
          }
          if (Array.isArray(value)) {
            return value.some(val => 
              typeof val === 'string' && val.toLowerCase().includes(searchQuery.toLowerCase())
            )
          }
          return false
        })
        if (!matchesSearch) return false
      }

      // 2. Active Filters Match
      return Object.entries(activeFilters).every(([key, val]) => {
        if (!val || val === 'ALL') return true
        const itemVal = item[key as keyof T]
        if (Array.isArray(itemVal)) {
          return itemVal.includes(val)
        }
        return itemVal === val
      })
    })
  }, [data, searchQuery, searchKeys, activeFilters])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Search & Filter Header - Unified Bar */}
      <div className="flex h-14 border border-[#f0f0f0] bg-white rounded-sm overflow-hidden">
        {/* Search Section */}
        <div className="flex-[2] flex items-center px-6 border-r border-[#f0f0f0] group">
           <Search className="w-4 h-4 text-[#a0a0a0] mr-4 group-focus-within:text-[#1a1a1a] transition-colors" />
           <input 
             type="text"
             placeholder={searchPlaceholder}
             value={searchQuery}
             onChange={handleSearchChange}
             className="w-full bg-transparent border-none outline-none text-[11px] font-mono font-bold tracking-[0.1em] text-[#1a1a1a] placeholder:text-[#ccc]"
           />
        </div>

        {/* Filters Sections */}
        {filters.map((filter, idx) => (
          <div key={filter.key} className={`flex-1 relative group flex items-center px-6 ${idx < filters.length - 1 ? 'border-r border-[#f0f0f0]' : ''}`}>
            <select
              value={activeFilters[filter.key] || 'ALL'}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="w-full appearance-none bg-transparent border-none outline-none text-[10px] font-mono font-bold uppercase tracking-widest text-[#a0a0a0] focus:text-[#1a1a1a] transition-all cursor-pointer pr-8"
            >
              <option value="ALL">ALL {filter.label}</option>
              {filter.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a0a0a0] pointer-events-none group-hover:text-[#1a1a1a] transition-colors" />
          </div>
        ))}
      </div>

      {/* Main Table */}
      <Table data={paginatedData} columns={columns} onRowClick={onRowClick} />

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-6">
        <div className="text-[10px] font-mono font-bold text-[#a0a0a0] uppercase tracking-[0.1em]">
          SHOWING {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredData.length)} OF {filteredData.length} ENTRIES | SYS_LOG: OK
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 border border-[#f0f0f0] flex items-center justify-center text-[#a0a0a0] hover:bg-[#fafafa] transition-all disabled:opacity-30"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex items-center gap-1">
               {[...Array(totalPages)].map((_, i) => (
                 <button
                   key={i}
                   onClick={() => setCurrentPage(i + 1)}
                   className={`w-9 h-9 border text-[11px] font-mono font-bold flex items-center justify-center transition-all ${
                     currentPage === i + 1 
                       ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] z-10' 
                       : 'bg-white text-[#1a1a1a] border-[#f0f0f0] hover:bg-[#fafafa]'
                   }`}
                 >
                   {i + 1}
                 </button>
               ))}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 border border-[#f0f0f0] flex items-center justify-center text-[#a0a0a0] hover:bg-[#fafafa] transition-all disabled:opacity-30"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
