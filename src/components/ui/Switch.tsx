'use client'

import { Switch as HeadlessSwitch } from '@headlessui/react'

interface SwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
}

export function Switch({ enabled, onChange, label }: SwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {label && (
        <span className="text-[12px] font-bold text-[#1a1a1a] opacity-60 uppercase tracking-wider">
          {label}
        </span>
      )}
      <HeadlessSwitch
        checked={enabled}
        onChange={onChange}
        className={`${
          enabled ? 'bg-[#1a1a1a]' : 'bg-[#e5e5e5]'
        } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out`}
        />
      </HeadlessSwitch>
    </div>
  )
}
