'use client'

import { useEffect, useState } from 'react'
import {
  Power,
  Plus,
  Settings2,
  ChevronRight,
  ShieldCheck,
  Signal,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react'
import { useVpn } from '@/lib/vpn-store'
import { formatBytes, formatDuration, regionFlag } from '@/lib/format'
import { ProtocolBadge } from '@/components/protocol-badge'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<string, string> = {
  disconnected: 'Не подключено',
  connecting: 'Подключение…',
  connected: 'Подключено',
  error: 'Ошибка',
}

function qualityLabel(ping?: number) {
  if (ping == null) return { label: 'Нет данных', tone: 'text-muted-foreground' }
  if (ping < 90) return { label: 'Отличное соединение', tone: 'text-success' }
  if (ping < 170) return { label: 'Стабильное соединение', tone: 'text-primary' }
  return { label: 'Слабый сигнал', tone: 'text-destructive' }
}

export function ConnectScreen({
  onOpenServers,
  onOpenSettings,
  onImport,
}: {
  onOpenServers: () => void
  onOpenSettings: () => void
  onImport: () => void
}) {
  const { state, activeServer, connectedSince, totals, traffic, toggle } = useVpn()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (state !== 'connected') return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [state])

  const isOn = state === 'connected'
  const isBusy = state === 'connecting'
  const duration = connectedSince ? formatDuration(now - connectedSince) : '00:00:00'
  const last = traffic[traffic.length - 1]
  const down = isOn ? formatBytes(last?.down ?? 0, true) : '—'
  const up = isOn ? formatBytes(last?.up ?? 0, true) : '—'
  const quality = qualityLabel(activeServer?.pingMs)

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-5 pb-2">
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Настройки"
          className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings2 className="size-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight">Eclipse</h1>
        <button
          type="button"
          onClick={onImport}
          aria-label="Добавить конфигурацию"
          className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors hover:bg-primary/25"
        >
          <Plus className="size-5" strokeWidth={2.5} />
        </button>
      </header>

      {/* Central connect dial */}
      <section className="flex flex-1 flex-col items-center justify-center py-6">
        <div className="relative flex size-64 items-center justify-center">
          {/* soft backdrop glow */}
          <div
            className={cn(
              'pointer-events-none absolute inset-0 rounded-full blur-3xl transition-all duration-700',
              isOn ? 'bg-primary/25 scale-110' : 'bg-primary/10 scale-90',
            )}
          />
          {/* rotating conic aura */}
          {(isOn || isBusy) && (
            <div className="conic-aura absolute inset-4 rounded-full opacity-70 blur-[2px]" />
          )}
          {/* outer track */}
          <div className="absolute inset-4 rounded-full border border-white/10" />
          {/* filled disc */}
          <div
            className={cn(
              'absolute inset-5 rounded-full bg-card/60 backdrop-blur-sm transition-shadow duration-700',
              isOn && 'glow-primary',
            )}
          />
          {/* breathing ring */}
          <div
            className={cn(
              'absolute inset-10 rounded-full border transition-colors duration-500',
              isOn ? 'animate-breathe border-primary/50' : 'border-white/10',
            )}
          />

          <button
            type="button"
            onClick={toggle}
            disabled={!activeServer}
            aria-label={isOn ? 'Отключить VPN' : 'Подключить VPN'}
            className="group relative flex size-40 flex-col items-center justify-center gap-3 rounded-full disabled:opacity-50"
          >
            <span
              className={cn(
                'flex size-24 items-center justify-center rounded-full transition-all duration-500',
                isOn
                  ? 'bg-primary text-primary-foreground shadow-[0_0_60px_-6px_var(--color-primary)]'
                  : 'bg-secondary/70 text-foreground group-hover:bg-secondary',
              )}
            >
              <Power className="size-10" strokeWidth={2.2} />
            </span>
          </button>
        </div>

        {/* Status */}
        <div className="mt-6 flex flex-col items-center gap-1.5">
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
              isOn ? 'bg-success/15 text-success' : 'bg-white/5 text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'size-1.5 rounded-full',
                isOn ? 'bg-success' : isBusy ? 'bg-primary animate-pulse' : 'bg-muted-foreground',
              )}
            />
            {STATUS_LABEL[state]}
          </span>
          {isOn && (
            <p className="font-mono text-3xl font-semibold tabular-nums">{duration}</p>
          )}
        </div>
      </section>

      {/* Connection quality + live traffic */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="card-elevated flex flex-col items-center gap-1 rounded-2xl py-3">
          <Signal className={cn('size-4', quality.tone)} />
          <p className="font-mono text-sm font-semibold tabular-nums">
            {activeServer?.pingMs != null ? `${activeServer.pingMs}` : '—'}
            <span className="text-[10px] text-muted-foreground"> ms</span>
          </p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Ping</p>
        </div>
        <div className="card-elevated flex flex-col items-center gap-1 rounded-2xl py-3">
          <ArrowDownToLine className="size-4 text-primary" />
          <p className="font-mono text-sm font-semibold tabular-nums">{down}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Download</p>
        </div>
        <div className="card-elevated flex flex-col items-center gap-1 rounded-2xl py-3">
          <ArrowUpFromLine className="size-4 text-chart-3" />
          <p className="font-mono text-sm font-semibold tabular-nums">{up}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Upload</p>
        </div>
      </div>

      {/* Selected server row */}
      <button
        type="button"
        onClick={onOpenServers}
        className="card-elevated mt-3 flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition-transform active:scale-[0.99]"
      >
        {activeServer ? (
          <span className="text-2xl leading-none" aria-hidden="true">
            {regionFlag(activeServer.region)}
          </span>
        ) : (
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <ShieldCheck className="size-5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {activeServer ? activeServer.name : 'Сервер не выбран'}
          </p>
          <p className={cn('mt-0.5 truncate text-xs', quality.tone)}>
            {activeServer ? quality.label : 'Нажмите «+», чтобы импортировать'}
          </p>
        </div>
        {activeServer && <ProtocolBadge protocol={activeServer.protocol} />}
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {/* Session total */}
      <div className="mt-2.5 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-2.5">
        <span className="text-xs text-muted-foreground">Трафик за сессию</span>
        <span className="font-mono text-xs font-medium tabular-nums">
          {isOn ? `↓ ${formatBytes(totals.down)} · ↑ ${formatBytes(totals.up)}` : '↓ 0 B · ↑ 0 B'}
        </span>
      </div>
    </div>
  )
}
