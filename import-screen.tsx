import { PROTOCOL_LABELS, TRANSPORT_LABELS } from '@/lib/parse-config'
import type { Protocol, Transport } from '@/lib/types'
import { cn } from '@/lib/utils'

const PROTOCOL_TONE: Record<Protocol, string> = {
  vless: 'bg-primary/15 text-primary border-primary/30',
  trojan: 'bg-chart-3/15 text-chart-3 border-chart-3/30',
  hysteria2: 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  vmess: 'bg-chart-5/15 text-chart-5 border-chart-5/30',
}

export function ProtocolBadge({
  protocol,
  className,
}: {
  protocol: Protocol
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide',
        PROTOCOL_TONE[protocol],
        className,
      )}
    >
      {PROTOCOL_LABELS[protocol]}
    </span>
  )
}

export function TransportBadge({ transport }: { transport: Transport }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {TRANSPORT_LABELS[transport]}
    </span>
  )
}
