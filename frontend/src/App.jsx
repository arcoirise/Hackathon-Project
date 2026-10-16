import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import MapView from './components/MapView.jsx'
import Diagnostics from './components/Diagnostics.jsx'

const DEFAULT_REGION = 'sd-i15'

export default function App() {
  const [regions, setRegions] = useState([])
  const [regionId, setRegionId] = useState(DEFAULT_REGION)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/regions')
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`)
        return res.json()
      })
      .then(setRegions)
      .catch((e) => setError(e.message))
  }, [])

  const region = regions.find((r) => r.id === regionId)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar regions={regions} regionId={regionId} onRegionChange={setRegionId} />
      <main className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_380px]">
        {error && (
          <p className="col-span-full rounded-md border border-brick-600 bg-white p-4 text-sm text-brick-800">
            Could not load regions: {error}. Is the backend running on port 8000?
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
