'use client'

import {
  ShieldAlert,
  Zap,
  Network,
  Globe,
  Server as ServerIcon,
  Info,
  ChevronRight,
} from 'lucide-react'
import { useVpn } from '@/lib/vpn-store'
import { cn } from '@/lib/utils'

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex h-7 w-[52px] shrink-0 items-center rounded-full px-0.5 transition-colors duration-200',
        checked ? 'justify-end bg-primary' : 'justify-start bg-secondary',
      )}
    >
      <span className="size-6 rounded-full bg-white shadow-sm transition-all duration-200" />
    </button>
  )
}

type Row = {
  key: keyof ReturnType<typeof useVpn>['settings']
  icon: typeof Zap
  title: string
  desc: string
}

const TOGGLE_ROWS: Row[] = [
  {
    key: 'killSwitch',
    icon: ShieldAlert,
    title: 'Kill Switch',
    desc: 'Блокировать весь трафик при обрыве туннеля',
  },
  {
    key: 'autoConnect',
    icon: Zap,
    title: 'Auto-connect',
    desc: 'Подключаться автоматически при запуске',
  },
  {
    key: 'lanBypass',
    icon: Network,
    title: 'Bypass LAN',
    desc: 'Не туннелировать локальную сеть',
  },
  {
    key: 'ipv6',
    icon: Globe,
    title: 'IPv6',
    desc: 'Разрешить IPv6 внутри туннеля',
  },
]

export function SettingsScreen() {
  const { settings, updateSettings, servers } = useVpn()

  return (
    <div className="flex flex-1 flex-col px-5 pb-4">
      <header className="pt-6 pb-5">
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
      </header>

      <div className="space-y-6 overflow-y-auto">
        <section>
          <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Соединение
          </h2>
          <div className="card-elevated divide-y divide-border overflow-hidden rounded-2xl">
            {TOGGLE_ROWS.map(({ key, icon: Icon, title, desc }) => (
              <div key={key} className="flex items-center gap-3 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Toggle
                  checked={settings[key] as boolean}
                  onChange={(v) => updateSettings({ [key]: v })}
                  label={title}
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Сеть
          </h2>
          <div className="card-elevated divide-y divide-border overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <ServerIcon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">DNS-сервер</p>
                <p className="text-xs text-muted-foreground">Резолвер внутри туннеля</p>
              </div>
              <input
                value={settings.dns}
                onChange={(e) => updateSettings({ dns: e.target.value })}
                className="w-28 rounded-lg border border-border bg-secondary/40 px-2 py-1.5 text-right font-mono text-xs outline-none focus:border-primary/50"
                aria-label="DNS-сервер"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            О приложении
          </h2>
          <div className="card-elevated divide-y divide-border overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Info className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Eclipse</p>
                <p className="text-xs text-muted-foreground">
                  Версия 1.0.0 · Ядро sing-box (нативная сборка)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 text-sm">
              <span className="flex-1 text-muted-foreground">Импортировано серверов</span>
              <span className="font-mono">{servers.length}</span>
            </div>
            <button
              type="button"
              className="flex w-full items-center gap-3 p-4 text-left text-sm"
            >
              <span className="flex-1">Политика конфиденциальности</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </div>
          <p className="mt-3 px-1 text-[11px] leading-relaxed text-muted-foreground">
            Eclipse не предоставляет серверы и не хранит логи. Вы подключаетесь
            только к собственной инфраструктуре, импортируя конфигурации.
          </p>
        </section>
      </div>
    </div>
  )
}
