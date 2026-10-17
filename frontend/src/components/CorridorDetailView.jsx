import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import SiteHeader from './SiteHeader.jsx'
import ConflictMapView from './explore/ConflictMapView.jsx'
import ExistingSolutions from './explore/ExistingSolutions.jsx'
import GeneratedSolutions from './explore/GeneratedSolutions.jsx'
import PlaceholderCorridorView from './explore/PlaceholderCorridorView.jsx'
import MapLoadingOverlay from './explore/MapLoadingOverlay.jsx'

const PLACEHOLDER_CORRIDORS = ['i5-shasta-trinity', 'sr89-mccloud', 'sr37-baylands', 'hwy17-santacruz', 'us101-marin-marsh', 'i680-sunol-grade', 'us101-rocks-road', 'hwy41-46-cholame', 'i15-temecula', 'us101-agoura-hills', 'sr71-chino-hills']
const NAV_LOAD_MS = 3500

// Dedicated corridor pages: #/corridor/us101-redwood (default) and #/corridor/i5-shasta-trinity and #/corridor/sr89-mccloud.
export default function CorridorDetailView({ corridorId }) {
  const [leaving, setLeaving] = useState(null) // nav href waiting on the loader

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Any nav link shows the loader first, then goes to its route.
  const finishLeaving = useCallback(() => {
    window.location.hash = leaving
  }, [leaving])

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-stone-900">
      <div className="sticky top-0 z-[1000]">
        <SiteHeader onNavigate={setLeaving} />
      </div>
      <main className="mx-auto w-[94vw] max-w-[94vw] py-8">
        {PLACEHOLDER_CORRIDORS.includes(corridorId) ? (
          <PlaceholderCorridorView corridorId={corridorId} />
        ) : (
          <>
            <ConflictMapView />
            <ExistingSolutions />
            <GeneratedSolutions />
          </>
        )}
      </main>
      <AnimatePresence>
        {leaving && <MapLoadingOverlay key="leave" onDone={finishLeaving} duration={NAV_LOAD_MS} />}
      </AnimatePresence>
    </div>
  )
}
