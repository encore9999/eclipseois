'use client'

import { useState } from 'react'
import { VpnProvider } from '@/lib/vpn-store'
import { PhoneFrame } from '@/components/phone-frame'
import { BottomNav, type Screen } from '@/components/bottom-nav'
import { ConnectScreen } from '@/components/screens/connect-screen'
import { ServersScreen } from '@/components/screens/servers-screen'
import { ImportScreen } from '@/components/screens/import-screen'
import { SettingsScreen } from '@/components/screens/settings-screen'

function AppShell() {
  const [screen, setScreen] = useState<Screen>('connect')

  return (
    <PhoneFrame>
      <main className="flex flex-1 flex-col overflow-hidden">
        {screen === 'connect' && (
          <ConnectScreen
            onOpenServers={() => setScreen('servers')}
            onOpenSettings={() => setScreen('settings')}
            onImport={() => setScreen('import')}
          />
        )}
        {screen === 'servers' && <ServersScreen onImport={() => setScreen('import')} />}
        {screen === 'import' && <ImportScreen onDone={() => setScreen('servers')} />}
        {screen === 'settings' && <SettingsScreen />}
      </main>
      <BottomNav active={screen} onChange={setScreen} />
    </PhoneFrame>
  )
}

export default function Page() {
  return (
    <VpnProvider>
      <AppShell />
    </VpnProvider>
  )
}
