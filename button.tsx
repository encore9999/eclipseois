'use client'

import { useState } from 'react'
import { Link2, QrCode, ClipboardPaste, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { useVpn } from '@/lib/vpn-store'
import { cn } from '@/lib/utils'

type Tab = 'link' | 'paste' | 'qr'

const TABS: Array<{ id: Tab; label: string; icon: typeof Link2 }> = [
  { id: 'link', label: 'Подписка', icon: Link2 },
  { id: 'paste', label: 'Вставить', icon: ClipboardPaste },
  { id: 'qr', label: 'QR-код', icon: QrCode },
]

export function ImportScreen({ onDone }: { onDone: () => void }) {
  const { importText } = useVpn()
  const [tab, setTab] = useState<Tab>('link')
  const [subUrl, setSubUrl] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [result, setResult] = useState<{ added: number; failed: number } | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubscription() {
    if (!subUrl.trim()) return
    setBusy(true)
    setResult(null)
    // In a native build this fetches the subscription URL then parses the body.
    // Here we parse the URL fragment directly if it carries share links, else
    // simulate a fetched base64 payload for the demo.
    try {
      let body = subUrl
      if (/^https?:\/\//i.test(subUrl.trim())) {
        // Demo payload representing a fetched subscription.
        body = [
          'vless://11111111-2222-3333-4444-555555555555@nl.eclipse.net:443?type=grpc&security=reality&sni=cloudflare.com&serviceName=grpc#NL · Amsterdam Reality',
          'trojan://Demo-Trojan@fr.eclipse.net:443?type=ws&security=tls&path=/ws#FR · Paris TLS',
          'hysteria2://Demo-Hy2@jp.eclipse.net:8443?sni=jp.eclipse.net#JP · Tokyo Hysteria2',
        ].join('\n')
      }
      const summary = importText(body)
      setResult({ added: summary.added, failed: summary.failed })
    } finally {
      setBusy(false)
    }
  }

  function handlePaste() {
    if (!pasteText.trim()) return
    const summary = importText(pasteText)
    setResult({ added: summary.added, failed: summary.failed })
    if (summary.added > 0) setPasteText('')
  }

  function loadQrDemo() {
    const summary = importText(
      'vless://99999999-8888-7777-6666-555555555555@sg.eclipse.net:443?type=xhttp&security=tls&sni=sg.eclipse.net&path=/xh#SG · Singapore XHTTP',
    )
    setResult({ added: summary.added, failed: summary.failed })
  }

  return (
    <div className="flex flex-1 flex-col px-5 pb-4">
      <header className="flex items-start justify-between pt-4 pb-4">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-primary/80">IMPORT</p>
          <h1 className="text-2xl font-semibold">Импорт конфигурации</h1>
        </div>
        <button
          type="button"
          onClick={onDone}
          aria-label="Закрыть"
          className="card-elevated rounded-full p-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </header>

      <div className="card-elevated mb-4 grid grid-cols-3 gap-1 rounded-2xl p-1.5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id)
              setResult(null)
            }}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-medium transition-all',
              tab === id
                ? 'glow-primary bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'link' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Ссылка-подписка</label>
          <p className="text-xs text-muted-foreground">
            Вставьте URL подписки от вашего провайдера. Поддерживаются
            base64-подписки со ссылками VLESS, Trojan, Hysteria2 и VMess.
          </p>
          <input
            value={subUrl}
            onChange={(e) => setSubUrl(e.target.value)}
            placeholder="https://example.com/sub?token=…"
            className="card-elevated w-full rounded-2xl px-4 py-3.5 text-sm outline-none transition-shadow focus:glow-primary"
          />
          <button
            type="button"
            onClick={handleSubscription}
            disabled={busy || !subUrl.trim()}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-8px_var(--color-primary)] transition-transform active:scale-[0.99] disabled:opacity-50 disabled:shadow-none"
          >
            {busy ? 'Загрузка подписки…' : 'Импортировать'}
          </button>
        </div>
      )}

      {tab === 'paste' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Вставить конфигурации</label>
          <p className="text-xs text-muted-foreground">
            По одной ссылке на строку. Также принимается base64-подписка целиком.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={7}
            placeholder="vless://…&#10;trojan://…&#10;hysteria2://…"
            className="card-elevated w-full resize-none rounded-2xl px-4 py-3.5 font-mono text-xs outline-none transition-shadow focus:glow-primary"
          />
          <button
            type="button"
            onClick={handlePaste}
            disabled={!pasteText.trim()}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-8px_var(--color-primary)] transition-transform active:scale-[0.99] disabled:opacity-50 disabled:shadow-none"
          >
            Разобрать и добавить
          </button>
        </div>
      )}

      {tab === 'qr' && (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="card-elevated flex size-56 items-center justify-center rounded-3xl">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <span className="flex size-20 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <QrCode className="size-11" />
              </span>
              <p className="px-6 text-xs">
                Камера сканирует QR-код с конфигурацией. В превью используется
                демонстрационный код.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadQrDemo}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-8px_var(--color-primary)] transition-transform active:scale-[0.99]"
          >
            Симулировать сканирование
          </button>
        </div>
      )}

      {result && (
        <div
          className={cn(
            'card-elevated mt-4 flex items-start gap-3 rounded-2xl border p-4 text-sm',
            result.added > 0 ? 'border-success/40' : 'border-destructive/40',
          )}
        >
          {result.added > 0 ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
          ) : (
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
          )}
          <div className="flex-1">
            <p className="font-medium">
              {result.added > 0
                ? `Добавлено серверов: ${result.added}`
                : 'Не удалось распознать конфигурацию'}
            </p>
            {result.failed > 0 && (
              <p className="text-xs text-muted-foreground">
                Пропущено некорректных строк: {result.failed}
              </p>
            )}
            {result.added > 0 && (
              <button
                type="button"
                onClick={onDone}
                className="mt-2 text-xs font-medium text-primary"
              >
                Перейти к серверам →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
