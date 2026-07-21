'use client'

import { Power, Server, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Screen = 'connect' | 'servers' | 'import' | 'settings'

const ITEMS: Array<{ id: Screen; label: string; icon: typeof Power }> = [
  { id: 'connect', label: 'Подключение', icon: Power },
  { id: 'servers', label: 'Сервера', icon: Server },
  { id: 'settings', label: 'Настройки', icon: Settings },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: Screen
  onChange: (s: Screen) => void
}) {
  return (
    <nav className="px-4 pb-5 pt-2">
      <ul className="card-elevated flex items-center justify-around rounded-2xl p-1.5">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex w-full flex-col items-center gap-1 rounded-xl py-2 transition-all duration-300',
                  isActive
                    ? 'glow-primary bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.6 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
