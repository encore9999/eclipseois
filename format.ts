'use client'

import { useState } from 'react'
import { Check, Trash2, Signal, Server, Search } from 'lucide-react'
import { useVpn } from '@/lib/vpn-store'
import { regionFlag } from '@/lib/format'
import { ProtocolBadge, TransportBadge } from '@/components/protocol-badge'
import { cn } from '@/lib/utils'

function pingTone(ms?: number) {
  if (ms == null) return 'text-muted-foreground'
  if (ms < 90) return 'text-success'
  if (ms < 170) return 'text-primary'
  return 'text-destructive'
}

export function ServersScreen({ onImport }: { onImport: () => void }) {
  const { servers, activeId, selectServer, removeServer } = useVpn()
  const [query, setQuery] = useState('')

  const filtered = servers.filter((s) =>
    (s.name + s.address + s.protocol).toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="flex flex-1 flex-col px-5 pb-4">
      <header className="pt-4 pb-4">
        <p className="text-xs font-medium tracking-[0.2em] text-primary/80">SERVERS</p>
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-semibold">Серверы</h1>
          <span className="pb-1 text-sm text-muted-foreground">{servers.length} шт.</span>
        </div>
      </header>

      <div className="card-elevated mb-3 flex items-center gap-2 rounded-2xl px-3.5 py-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию или адресу"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="card-elevated mt-6 flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Server className="size-7" />
            </span>
            <p className="text-sm text-muted-foreground">
              {servers.length === 0
                ? 'Нет импортированных серверов'
                : 'Ничего не найдено'}
            </p>
            {servers.length === 0 && (
              <button
                type="button"
                onClick={onImport}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Импортировать конфигурацию
              </button>
            )}
          </div>
        )}

        {filtered.map((s) => {
          const active = s.id === activeId
          return (
            <div
              key={s.id}
              className={cn(
                'card-elevated group flex items-center gap-3 rounded-2xl p-3.5 transition-all',
                active && 'glow-primary',
              )}
            >
              <button
                type="button"
                onClick={() => selectServer(s.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {regionFlag(s.region)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.address}:{s.port}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <ProtocolBadge protocol={s.protocol} />
                    <TransportBadge transport={s.transport} />
                  </div>
                </div>
                <div className={cn('flex items-center gap-1', pingTone(s.pingMs))}>
                  <Signal className="size-3.5" />
                  <span className="font-mono text-xs tabular-nums">{s.pingMs} ms</span>
                </div>
              </button>

              <div className="flex flex-col items-center gap-2 pl-1">
                <span
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full border transition-colors',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-transparent',
                  )}
                  aria-hidden="true"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <button
                  type="button"
                  onClick={() => removeServer(s.id)}
                  aria-label={`Удалить ${s.name}`}
                  className="text-muted-foreground/60 transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
