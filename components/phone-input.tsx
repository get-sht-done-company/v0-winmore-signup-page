"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  "aria-invalid"?: "true" | "false"
  "aria-describedby"?: string
}

export function PhoneInput({
  value,
  onChange,
  disabled,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value

    // Remove any spaces for checking
    const cleanValue = inputValue.replace(/\s/g, "")

    // If user types +44 or 44 at the start, replace with 0
    if (cleanValue.startsWith("+44")) {
      inputValue = "0" + cleanValue.slice(3)
    } else if (cleanValue.startsWith("44") && cleanValue.length > 2) {
      inputValue = "0" + cleanValue.slice(2)
    }

    onChange(inputValue)
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
        <span className="text-2xl leading-none">🇬🇧</span>
        <span className="text-zinc-400">+44</span>
      </div>
      <input
        id="phone"
        type="tel"
        autoComplete="tel"
        placeholder="7700 900000"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "w-full pl-24 pr-4 py-3 bg-zinc-900 border text-zinc-100 placeholder:text-zinc-500 border-zinc-800 rounded-lg h-12",
          "focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_1px_rgba(255,255,255,1),0_0_0_3px_rgba(255,255,255,0.25)] transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
    </div>
  )
}
