import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CONFLICTS } from '../../data/conflicts.js'
import CaliforniaMap from './CaliforniaMap.jsx'
import ConflictSidebar from './ConflictSidebar.jsx'
import MapLoadingOverlay from './MapLoadingOverlay.jsx'
import GeneratingOverlay from './GeneratingOverlay.jsx'
import SolutionView from './SolutionView.jsx'

const DETAIL_PINS = ['us101-redwood', 'i5-shasta-trinity', 'sr89-mccloud', 'sr37-baylands', 'hwy17-santacruz', 'us101-marin-marsh', 'i680-sunol-grade', 'us101-rocks-road', 'hwy41-46-cholame', 'i15-temecula', 'us101-agoura-hills', 'sr71-chino-hills'] // pins with a dedicated corridor page
const DETAIL_LOAD_MS = 3500

// Workflow: pick a region (loader) -> zoomed map (puff-out) -> pick a pin (sidebar) -> generate (overlay) -> solution view.
export default function ExploreSection() {
  const [regionId, setRegionId] = useState(null)
  const [puffId, setPuffId] = useState(null) // clicked region, held while the loader shows
  const [loadingMap, setLoadingMap] = useState(false)
  const [pendingDetail, setPendingDetail] = useState(null) // pin whose detail map opens when the loader ends
  const [conflictId, setConflictId] = useState(null) // selected pin; the sidebar shows while phase is idle
  const [phase, setPhase] = useState('idle') // 'idle' | 'generating' | 'solution'

  const conflict = CONFLICTS.find((c) => c.id === conflictId) ?? null

  // Lock page scroll behind any overlay.
  useEffect(() => {
    document.body.style.overflow = conflict || loadingMap ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [conflict, loadingMap])

  const pickRegion = (id) => {
    if (puffId) return
    setConflictId(null)
    setPuffId(id)
    setLoadingMap(true)
  }
  const finishLoading = useCallback(() => {
    if (puffId) setRegionId(puffId) // a pin click shows the loader but leaves the view as is
    setPuffId(null)
    setLoadingMap(false)
    if (pendingDetail) window.location.hash = `#/corridor/${pendingDetail}` // dedicated page; see CorridorDetailView
  }, [puffId, pendingDetail])
  const pickPin = (id) => {
    setPendingDetail(DETAIL_PINS.includes(id) ? id : null)
    setLoadingMap(true)
  }

  const backToState = () => { setRegionId(null); setConflictId(null) }
  const closeAll = useCallback(() => { setPhase('idle'); setConflictId(null) }, [])
  const cancelGenerate = useCallback(() => setPhase('idle'), [])
  const finishGenerate = useCallback(() => setPhase('solution'), [])

  return (
    <section id="explore" className="scroll-mt-14 border-t border-stone-200 px-6 py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brick-600">Interactive map</h2>
        <p className="mt-4 font-serif text-4xl tracking-tight">Explore California Infrastructure Conflicts</p>
        <p className="mt-2 max-w-xl text-sm text-stone-500">
          Click a region to zoom in, select a conflict pin, then generate a civil engineering solution.
        </p>

        {/* Toolbar row above the map; fixed height so showing the reset button never shifts the layout */}
        <div className="mt-8 mb-6 flex h-9 items-center">
          {regionId && (
            <button
              type="button"
              onClick={backToState}
              className="rounded-full border border-stone-300 bg-white/90 px-4 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-white"
            >
              ← All of California
            </button>
          )}
        </div>

        {/* Only the SVG zooms; the container clips it so it can never cover the text above */}
        <div className="relative mx-auto h-[85vh] max-h-[850px] min-h-[75vh] w-full overflow-hidden">
          <CaliforniaMap regionId={regionId} conflictId={conflictId} onRegion={pickRegion} onPin={pickPin} />
        </div>
      </div>

      <ConflictSidebar
        conflict={phase === 'idle' ? conflict : null}
        onClose={closeAll}
        onGenerate={() => setPhase('generating')}
      />
      <AnimatePresence>
        {loadingMap && <MapLoadingOverlay key="load" onDone={finishLoading} duration={pendingDetail ? DETAIL_LOAD_MS : undefined} />}
        {phase === 'generating' && conflict && (
          <GeneratingOverlay key="gen" conflict={conflict} onDone={finishGenerate} onCancel={cancelGenerate} />
        )}
        {phase === 'solution' && conflict && <SolutionView key="sol" conflict={conflict} onBack={closeAll} />}
      </AnimatePresence>
    </section>
  )
}
