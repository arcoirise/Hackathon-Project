import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import MapView from './components/MapView.jsx'
import Diagnostics from './components/Diagnostics.jsx'
import { FALLBACK_REGIONS } from './data/fallback.js'

const DEFAULT_REGION = 'sd-i15'

export default function App() {
  const [regions, setRegions] = useState(FALLBACK_REGIONS)
  const [regionId, setRegionId] = useState(DEFAULT_REGION)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/regions')
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setRegions(data)
          setError(null)
        }
      })
      .catch((e) => setError(e.message))
  }, [])

  const region = regions.find((r) => r.id === regionId) ?? regions[0]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar regions={regions} regionId={regionId} onRegionChange={setRegionId} />
      <main className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_380px]">
        {error && (
          <p className="col-span-full rounded-md border border-blush-200 bg-white px-4 py-2 text-sm text-brick-800">
            Showing built-in San Diego I-15 data — backend unavailable ({error}).
          </p>
        )}
        {region && (
          <>
            <div className="h-[60vh] min-h-[400px] lg:h-auto">
              <MapView region={region} />
            </div>
            <Diagnostics region={region} />
          </>
        )}
      </main>
    </div>
  )
}
