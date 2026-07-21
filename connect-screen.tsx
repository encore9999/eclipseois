'use client'

import { useEffect, useState } from 'react'

// A phone chrome so the mobile app UI reads correctly in the web preview.
// On small screens it goes edge-to-edge like a real device.
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex min-h-dvh items-center justify-center p-0 sm:p-6">
      <div className="relative flex h-dvh w-full max-w-[420px] flex-col overflow-hidden border-border bg-transparent sm:h-[860px] sm:rounded-[2.75rem] sm:border-8 sm:border-[oklch(0.08_0.02_285)] sm:shadow-2xl">
        {/* Status bar */}
        <div className="flex items-center justify-between px-7 pt-3 pb-1 text-xs font-medium">
          <span className="font-mono tabular-nums">{time || '9:41'}</span>
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground">ECLIPSE</span>
          <span className="font-mono">100%</span>
        </div>
        {children}
      </div>
    </div>
  )
}
