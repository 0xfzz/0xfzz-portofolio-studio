'use client'

import { Switch as HeadlessSwitch } from '@headlessui/react'

interface SwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
}

export function Switch({ enabled, onChange, label }: SwitchProps) {
  return (
    <div className="flex items-center justify-between h-[37px] border-b border-gray-100 py-2">
      {label && (
        <span className="text-[12px] font-mono font-normal text-gray-900 uppercase">
          {label}
        </span>
      )}
      <HeadlessSwitch
        checked={enabled}
        onChange={onChange}
        className={`${
          enabled ? 'bg-gray-900' : 'bg-[#EBE7EA]'
        } relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer items-center rounded-none border border-gray-400 transition-colors duration-100 ease-in-out focus:outline-none`}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-[22px] bg-[#FCF8F9]' : 'translate-x-[2px] bg-gray-400'
          } pointer-events-none inline-block h-[12px] w-[12px] transform rounded-none transition duration-100 ease-in-out border border-transparent`}
        />
      </HeadlessSwitch>
    </div>
  )
}
