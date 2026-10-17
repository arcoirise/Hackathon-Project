import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MapLoadingOverlay from './MapLoadingOverlay.jsx'
import ViewSolutionModal from './ViewSolutionModal.jsx'

const GENERATE_MS = 5000
const STAGGER_S = 0.1

const CARDS = [
  {
    id: 'tribal-prairie',
    category: 'Indigenous Co-Management | Habitat Management',
    title: 'Yurok Tribal Prairie Co-Management & Forage Restoration',
    overview:
      "Expanding ancestral prairie management, controlled burns, and native pasture restoration on tribal and park lands east of US-101 (such as the 'O Rew / Stone Lagoon gateway).",
    impact:
      'Sustains high-protein off-corridor forage, naturally enticing Roosevelt elk herds to feed in safe meadow zones away from high-speed pavement.',
    backing: 'Spearheaded by the Yurok Tribe and Save the Redwoods League.',
  },
  {
    id: 'culvert-retrofit',
    category: 'Drainage Connectivity | Low-Footprint',
    title: 'Coastal Wetland Culvert Expansion & Underpass Retrofitting',
    overview:
      'Enlarging existing large-format box culverts and stream bridges along Stone Lagoon and Prairie Creek drainages with natural dirt benches and subtle directional drift fencing.',
    impact:
      'Enables elk cows, calves, and smaller wildlife to safely navigate beneath highway bridges along natural watercourses without constructing full-scale overpasses.',
    backing: 'Supported by State Park ecology teams and North Coast watershed restoration partners.',
  },
  {
    id: 'overpass-fencing',
    featured: true,
    category: 'Capital Infrastructure | High Demand & Impact',
    title: 'Dedicated Wildlife Overpass & Directional Funnel Fencing',
    overview:
      'Full engineering construction of a vegetated wildlife overpass bridge spanning US-101 near Stone Lagoon (PM 114–115.5) paired with 8–10 ft exclusion guide fencing along highway margins.',
    scope:
      'Requires multi-million dollar capital allocations, state transportation bond funding, extensive CEQA/NEPA environmental impact studies, and structural engineering across coastal redwood wetland zones.',
    impact:
      'Physically eliminates animal-vehicle collisions across primary crossing bottlenecks while restoring 24/7 habitat connectivity.',
    backing: 'Supported by regional conservation coalitions, Caltrans Wildlife Connectivity Framework, and state park stewards.',
  },
  {
    id: 'smart-radar',
    category: 'Intelligent Transport System | Dynamic Warning',
    title: 'Smart Radar Detection & Real-Time Driver Speed Management',
    overview:
      'Upgrading existing radio transceiver posts into a multi-sensor network (thermal imagery + radar) that dynamically triggers variable speed limit signs (dropping 65 mph to 45 mph during active crossings).',
    impact:
      'Eliminates driver warning fatigue by enforcing reduced speeds only when wildlife is physically detected on or near the right-of-way.',
    backing: 'Backed by California Highway Patrol (CHP) local dispatches and UC Davis Road Ecology Center researchers.',
  },
  {
    id: 'gps-tracking',
    category: 'Data & Mobile Integration | Commuter Alert',
    title: 'Multi-Agency GPS Herd Tracking & Dynamic Hotspot Alerts',
    overview:
      'Expanding real-time GPS collar tracking between CDFW, tribal wildlife managers, and navigation platforms to push dynamic driver alerts onto Apple Maps, Waze, and Caltrans QuickMap overlays.',
    impact:
      'Provides commuters and park visitors with pre-route situational awareness before entering high-density migration bottlenecks during dusk/dawn hours.',
    backing: 'Backed by CDFW field biologists, local county traffic safety committees, and regional transit authorities.',
  },
]

function SolutionCard({ card, index, onView }) {
  const { featured } = card
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * STAGGER_S, ease: 'easeOut' }}
      className="relative flex flex-col overflow-hidden rounded-lg border-2 border-t-4 border-slate-200 border-t-emerald-600 bg-white p-6 shadow-sm transition-all hover:shadow-md"
    >
      {card.image && (
        <img
          src={card.image}
          alt={`Render: ${card.title}`}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          className="mb-4 h-auto max-h-48 w-full rounded-lg border border-slate-200 bg-slate-50 object-contain"
        />
      )}
      <span
        className={`self-start rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
          featured ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {card.category}
      </span>
      <h3 className={`mt-4 font-serif font-semibold leading-snug text-slate-900 text-lg`}>
        {card.title}
      </h3>
      <p className={`mt-3 text-sm leading-relaxed text-stone-700`}>{card.overview}</p>

      {card.scope && (
        <div className="mt-5 rounded-xl border border-emerald-100 bg-white/70 p-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Demanding Scope &amp; Cost</p>
          <p className="mt-1 text-sm leading-relaxed text-[#2C2C2C]">{card.scope}</p>
        </div>
      )}

      {card.impact && (
        <div className="mt-5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Key Impact</p>
          <p className="mt-1 text-sm leading-relaxed text-[#2C2C2C]">{card.impact}</p>
        </div>
      )}
      {card.cost && (
        <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-emerald-100 bg-white/70 p-4">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Estimated Cost</p>
            <p className="mt-1 text-sm font-semibold text-[#2C2C2C]">{card.cost}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Target</p>
            <p className="mt-1 text-sm text-[#2C2C2C]">{card.target}</p>
          </div>
        </div>
      )}

      <div className="mt-auto border-t border-slate-100 pt-4">
        {card.backing && (<>
        <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Community &amp; Tribal Backing
        </p>
        <p className="mt-1 text-sm font-medium leading-relaxed text-emerald-900">{card.backing}</p>
        </>)}
        <button
          type="button"
          onClick={() => onView(card.id)}
          className="mt-4 flex items-center gap-1.5 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-800"
        >
          {card.viewLabel ?? 'View Solution'}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </motion.article>
  )
}

const PICK = 2

const shuffled = (n) => {
  const order = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export default function GeneratedSolutions({ cards = CARDS, pick = PICK, loadingMessage = 'generating corridor solutions', cumulative = false, placeholders = false }) {
  const [generating, setGenerating] = useState(false)
  // The pool is dealt out in a shuffled order, PICK cards per generation, until all of the cards have been shown.
  const [order, setOrder] = useState(null)
  const [viewed, setViewed] = useState(0) // how many of the pool have been shown so far
  const [viewingId, setViewingId] = useState(null) // solution whose detail modal is open
  const [run, setRun] = useState(0) // bumps each generation so the reveal replays

  const exhausted = viewed >= cards.length
  const label = viewed === 0 ? 'Generate Solutions' : exhausted ? 'Regenerate Solutions' : 'Generate More Solutions'
  // `cumulative` keeps earlier cards on screen and adds the next ones, in the given order
  const shown = order ? order.slice(cumulative ? 0 : Math.max(0, viewed - pick), viewed) : []

  useEffect(() => {
    if (!generating) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [generating])

  const closeModal = useCallback(() => setViewingId(null), [])

  const finish = useCallback(() => {
    // Start a fresh shuffled pool on the first run and after the whole pool has been shown.
    const fresh = !order || viewed >= cards.length
    const nextOrder = fresh ? (cumulative ? cards.map((_, i) => i) : shuffled(cards.length)) : order
    const start = fresh ? 0 : viewed
    setOrder(nextOrder)
    setViewed(Math.min(start + pick, cards.length))
    setRun((r) => r + 1)
    setGenerating(false)
  }, [order, viewed])

  return (
    <section aria-labelledby="generated-solutions" className="mt-16 min-h-[70vh] border-t border-stone-200 pb-24 pt-16">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#8B0000]">03</span>
        <h2 id="generated-solutions" className="font-serif text-3xl tracking-tight text-[#2C2C2C]">
          <span aria-hidden="true">— </span>Generated Corridor Solutions
        </h2>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
        Simulated multi-tier mitigation strategies combining indigenous co-management, capital infrastructure, intelligent
        transport systems, and real-time telemetry.
      </p>

      {shown.length === 0 && placeholders && (
        <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {[0, 1].map((i) => (
            <article key={i} className="relative flex flex-col overflow-hidden rounded-lg border-2 border-t-4 border-slate-200 border-t-emerald-600 bg-white p-6 shadow-sm">
              <span className="self-start rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">Category | Placeholder</span>
              <div className="mt-4 h-5 w-3/4 rounded bg-slate-100" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-11/12 rounded bg-slate-100" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
              </div>
            </article>
          ))}
        </div>
      )}
      {shown.length > 0 && (
        <div key={run} className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {shown.map((idx, i) => (
            <SolutionCard key={cards[idx].title} card={cards[idx]} index={i} onView={setViewingId} />
          ))}
        </div>
      )}

      <div className={`mb-6 flex justify-center ${shown.length || placeholders ? 'mt-10' : 'mt-14'}`}>
        <button
          type="button"
          onClick={() => setGenerating(true)}
          disabled={generating}
          className="rounded-xl bg-emerald-700 px-10 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-70 md:text-lg"
        >
          {label}
        </button>
      </div>

      <AnimatePresence>
        {generating && (
          <MapLoadingOverlay key="gen" onDone={finish} duration={GENERATE_MS} message={loadingMessage} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {viewingId && <ViewSolutionModal key={viewingId} solutionId={viewingId} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  )
}
