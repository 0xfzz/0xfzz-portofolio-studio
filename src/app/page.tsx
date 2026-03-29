'use client'

import { Field, Label, Input, Button } from '@headlessui/react'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fbfbfb] p-4">
      <div className="bg-white p-10 md:p-14 border border-[#f0f0f0] w-full max-w-[460px]">
        {/* Logo/Title Section */}
        <div className="mb-12">
          <h1 className="font-mono text-4xl font-bold text-[#1a1a1a] tracking-tight">
            0xfzz
          </h1>
        </div>

        <form className="space-y-8">
          {/* Password Field */}
          <Field className="flex flex-col gap-2.5">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a0a0a0]">
              Password
            </Label>
            <Input
              type="password"
              placeholder=".........."
              className="w-full border border-[#e5e5e5] px-4 py-3.5 text-lg font-medium placeholder:text-[#d1d1d1] focus:outline-none focus:border-[#999] transition-all"
            />
          </Field>

          {/* Cloudflare Placeholder/Button */}
          <div className="pt-2">
            <Button className="w-full border border-black rounded-lg py-3.5 px-6 font-bold text-[15px] text-[#1a1a1a] hover:bg-gray-50 transition-colors cursor-pointer">
              Cloudflare Captcha
            </Button>
          </div>

          {/* Enter Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-[#2d2d2d] text-white py-4.5 px-6 font-bold text-[13px] tracking-[0.15em] uppercase hover:bg-black transition-colors cursor-pointer"
            >
              Enter
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
