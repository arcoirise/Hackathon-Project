import { useState } from 'react'
import SphereCanvas from './SphereCanvas.jsx'
import VisControl from './VisControl.jsx'

const REGIONS = [
  {
    id: 'sd-i15',
    name: 'San Diego (I-15 / Temecula / Rainbow Canyon)',
    blurb:
      'An 8-lane freeway with barrier fencing splits the Santa Ana Mountains from the Agua Tibia and Palomar ranges.',
    species: 'Mountain lion',
    ready: true,
  },
  {
    id: 'nb-sr37',
    name: 'North Bay: State Route 37 (San Pablo Baylands Corridor)',
    blurb: 'A low-lying causeway across the baylands, exposed to traffic and sea-level rise.',
    species: 'Tule elk and baylands wildlife',
    ready: false,
  },
  {
    id: 'sc-hwy17',
    name: 'Santa Cruz (Highway 17 Corridor)',
    blurb: 'A busy mountain route cutting through the Santa Cruz Mountains habitat linkage.',
    species: 'Mountain lion',
    ready: false,
  },
]

const MISSION =
  "Modern highways and expanding infrastructure severely fragment natural ecosystems, trapping wildlife and isolating populations such as California's mountain lions and tule elk. WildPass is an interactive civil planning dashboard made for planners, developers, and civil engineers that maps severe wildlife infrastructure conflicts across key California regions and models actionable science-backed solutions to protect both biodiversity and safety."

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function Landing({ onLaunch }) {
  const [controls, setControls] = useState({ dotSize: 45, distortion: 40, density: 55 })
  const [regionId, setRegionId] = useState(REGIONS[0].id)
  const region = REGIONS.find((r) => r.id === regionId)

  const navLink = 'text-sm text-stone-600 transition hover:text-stone-900'

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-stone-900">
      <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#FBF9F6]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-lg font-bold tracking-tight">
            WildPass
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            <button type="button" className={navLink} onClick={() => scrollTo('mission')}>About Us</button>
            <button type="button" className={navLink} onClick={() => scrollTo('regions')}>Regions</button>
            <button type="button" className={navLink} onClick={onLaunch}>Dashboard</button>
            <button type="button" className={navLink} onClick={onLaunch}>Reports</button>
          </nav>
          <button
            type="button"
            onClick={onLaunch}
            className="rounded-full bg-brick-800 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brick-600"
          >
            Launch Dashboard
          </button>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <SphereCanvas
          controls={controls}
          className="absolute inset-0 -z-10 h-full w-full opacity-90 lg:left-[22%] lg:w-[78%]"
        />
        <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1400px] flex-col justify-center px-6 py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brick-600">
            Wildlife × Infrastructure
          </p>
          <h1 className="pointer-events-none text-6xl font-bold leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl">
            WildPass
          </h1>
          <p className="pointer-events-none mt-8 max-w-xl text-base leading-relaxed text-stone-700 sm:text-lg">
            Mapping where California's highways cut off wildlife, and modeling the crossings that reconnect them.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollTo('regions')}
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Explore Regions ↓
            </button>
            <button
              type="button"
              onClick={() => scrollTo('mission')}
              className="rounded-full border border-stone-300 bg-white/70 px-6 py-3 text-sm font-medium transition hover:bg-white"
            >
              Read Mission
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 right-6 hidden sm:block">
          <VisControl controls={controls} onChange={setControls} />
        </div>
      </section>

      <section id="mission" className="scroll-mt-14 border-t border-stone-200 px-6 py-24">
        <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brick-600">Our Mission</h2>
          <p className="mt-4 text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:mt-0">{MISSION}</p>
        </div>
      </section>

      <section id="regions" className="scroll-mt-14 border-t border-stone-200 px-6 py-24">
        <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brick-600">Regions</h2>
            <p className="mt-4 text-3xl font-bold tracking-tight">Pick a corridor.</p>
          </div>
          <div className="mt-8 lg:mt-0">
            <label className="block text-sm text-stone-500" htmlFor="region-select">Region</label>
            <select
              id="region-select"
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brick-600"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{region.name}</h3>
                <p className="mt-1 text-sm text-stone-600">{region.blurb}</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-stone-400">Focal species · {region.species}</p>
              </div>
              <button
                type="button"
                disabled={!region.ready}
                onClick={onLaunch}
                className="shrink-0 rounded-full bg-brick-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brick-600 disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                {region.ready ? 'Open in dashboard' : 'Coming soon'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
