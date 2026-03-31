'use client'

import { Field, Label, Input, Button } from '@headlessui/react'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4 font-sans">
      <div className="bg-white p-12 lg:p-14 border border-gray-200 w-full max-w-[420px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Logo/Title Section */}
        <div className="mb-10">
          <h1 className="font-mono text-2xl font-bold text-[#1a1a1a] tracking-tight text-center">
            0xfzz
          </h1>
        </div>

        <form className="space-y-6">
          {/* Password Field */}
          <Field className="flex flex-col gap-2">
            <Label className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-gray-400 text-center">
              PASSWORD
            </Label>
            <Input
              type="password"
              placeholder="..........."
              className="w-full border border-gray-300 px-4 py-3 text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors shadow-sm"
            />
          </Field>

          {/* Cloudflare Placeholder/Button */}
          <div className="pt-2">
            <button type="button" className="w-full border border-gray-300 rounded-[6px] py-4 px-6 font-bold text-[14px] text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer flex justify-center items-center shadow-sm font-sans">
              Cloudflare Captcha
            </button>
          </div>

          {/* Enter Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-[#2d2d2d] text-white py-3.5 px-6 font-sans font-medium text-[11px] tracking-wider uppercase hover:bg-[#1a1a1a] transition-colors cursor-pointer shadow-sm"
            >
              ENTER
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
