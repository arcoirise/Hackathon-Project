import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx'
import MapView from './components/MapView.jsx'
import Diagnostics from './components/Diagnostics.jsx'
import Landing from './components/Landing.jsx'
import { FALLBACK_REGIONS } from './data/fallback.js'

const DEFAULT_REGION = 'sd-i15'

// Backend fields win, but anything it doesn't send (cards, map overlays) comes from the fallback.
function withFallback(region) {
  const base = FALLBACK_REGIONS.find((r) => r.id === region.id)
  return { ...base, ...region }
}

function downloadBrief(region) {
  const blob = new Blob([JSON.stringify(region, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `wildpass-${region.id}-brief.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Tiny hash router: '' = landing page, '#/dashboard' or '#/dashboard/<region id>' = dashboard.
function useDashboardRoute() {
  const read = () => window.location.hash.startsWith('#/dashboard')
  const [open, setOpen] = useState(read)
  useEffect(() => {
    const onChange = () => { setOpen(read()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return open
}

export default function App() {
  const dashboard = useDashboardRoute()
  // Buttons pass a click event; only a region id string picks the starting region.
  const launch = (regionId) => {
    window.location.hash = typeof regionId === 'string' ? `#/dashboard/${regionId}` : '#/dashboard'
  }
  if (!dashboard) return <Landing onLaunch={launch} />
  return <Dashboard />
}

function Dashboard() {
  const [regions, setRegions] = useState(FALLBACK_REGIONS)
  const [regionId, setRegionId] = useState(() => window.location.hash.split('/')[2] || DEFAULT_REGION)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/regions')
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setRegions(data.map(withFallback))
          setError(null)
        }
      })
      .catch((e) => setError(e.message))
  }, [])

  const region = regions.find((r) => r.id === regionId) ?? regions[0]
  const onDownload = () => downloadBrief(region)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onDownload={onDownload} />
      <Header regions={regions} regionId={region.id} onRegionChange={setRegionId} onDownload={onDownload} />
      <main className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_400px]">
        {error && (
          <p className="col-span-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm text-brick-800">
            Showing built-in San Diego I-15 data — backend unavailable ({error}).
          </p>
        )}
        <div className="h-[65vh] min-h-[460px] lg:h-auto lg:min-h-[640px]">
          <MapView region={region} />
        </div>
        <Diagnostics region={region} />
      </main>
    </div>
  )
}
