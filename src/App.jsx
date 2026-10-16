import { useState } from 'react'
import Header from './components/Header.jsx'
import Tabs, { TABS } from './components/Tabs.jsx'
import RegionMap from './components/RegionMap.jsx'
import DiagnosticsCard from './components/DiagnosticsCard.jsx'
import { REGIONS } from './data/regions.js'

export default function App() {
  const [regionId, setRegionId] = useState('sd-i15')
  const [tab, setTab] = useState(TABS[0])
  const region = REGIONS.find((r) => r.id === regionId)

  return (
    <div className="flex min-h-screen flex-col">
      <Header regions={REGIONS} regionId={regionId} onRegionChange={setRegionId} />
      <Tabs active={tab} onChange={setTab} />
      <main className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_360px]">
        {tab === TABS[0] ? (
          <>
            <div className="h-[60vh] min-h-[400px] lg:h-auto">
              <RegionMap region={region} />
            </div>
            <DiagnosticsCard region={region} />
          </>
        ) : (
          <div className="col-span-full rounded-lg border border-dashed border-stone-300 p-10 text-center text-stone-500">
            {tab} — coming soon
          </div>
        )}
      </main>
    </div>
  )
}
