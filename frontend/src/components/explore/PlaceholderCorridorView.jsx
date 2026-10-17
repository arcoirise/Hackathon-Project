import { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { BASE_MAPS } from './ConflictMapView.jsx'

// Placeholder corridor pages (map + sections 02/03 stubs), keyed by the #/corridor/<id> route.
// Highway lines are approximate hand-placed alignments, not traced from OSM.
const MIN_ZOOM = 8
const MAX_ZOOM = 16
const REGION_VIEW = { center: [40.7, -122.4], zoom: 7 }
const CORRIDORS = {
  'i5-shasta-trinity': {
    title: 'I-5 Shasta-Trinity Corridor',
    subtitle: 'Shasta & Siskiyou Counties | Cascade and Trinity ranges, multi-lane mountain freeway',
    site: [40.78, -122.3], // Pit River / Shasta Lake area
    stretch: [[40.55, -122.5], [41.35, -122.1]],
    lockBounds: [[40.2, -123.2], [41.8, -121.6]],
    maxFlyZoom: 11,
    highway: [
      [40.55, -122.37], [40.65, -122.37], [40.7, -122.36], [40.78, -122.3], [40.9, -122.38],
      [41.0, -122.4], [41.12, -122.32], [41.21, -122.27], [41.31, -122.31],
    ],
    legend: 'I-5 (approximate alignment)',
    popup: 'I-5 Shasta-Trinity Corridor',
    existing: {
      title: 'Existing mitigation data coming soon',
      body: 'Documented I-5 Shasta-Trinity mitigations will appear here.',
    },
  },
  'sr89-mccloud': {
    title: 'SR-89 McCloud Corridor',
    subtitle: 'Siskiyou County | High-density vehicle collision zones across critical elk winter ranges',
    site: [41.26, -122.0],
    stretch: [[41.2, -122.35], [41.34, -121.9]],
    lockBounds: [[40.8, -122.9], [41.7, -121.4]],
    maxFlyZoom: 12,
    highway: [[41.3, -122.29], [41.27, -122.22], [41.256, -122.14], [41.27, -122.05], [41.26, -122.0]],
    legend: 'SR-89 (approximate alignment)',
    popup: 'SR-89 McCloud Corridor',
    existing: {
      title: 'Winter range collisions and habitat fragmentation',
      body: 'Placeholder: SR-89 bisects seasonal winter range, concentrating vehicle collisions where herds descend to lower elevations and fragmenting habitat on either side of the road. Documented collision data and existing mitigations will appear here.',
    },
  },
}
const HIGHWAY_STYLE = { color: '#8B261D', weight: 4, opacity: 0.85, lineCap: 'round' }

const PIN_ICON = L.divIcon({
  className: '',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  html: `<svg width="28" height="36" viewBox="-9 -17 18 18" style="overflow:visible;filter:drop-shadow(0 0 10px rgba(162,72,56,0.5))">
    <path d="M0 0C-5-7-7-10-7-14a7 7 0 1 1 14 0c0 4-2 7-7 14z" fill="#A24838" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cy="-14" r="2.6" fill="#fff"/>
  </svg>`,
})

function FlyIn({ stretch, lockBounds, maxFlyZoom }) {
  const map = useMap()
  useEffect(() => {
    const lock = () => {
      map.setMinZoom(MIN_ZOOM)
      map.setMaxZoom(MAX_ZOOM)
      map.setMaxBounds(lockBounds)
    }
    map.invalidateSize()
    map.once('moveend', lock)
    const t = setTimeout(() => map.flyToBounds(stretch, { duration: 3, padding: [40, 40], maxZoom: maxFlyZoom }), 500)
    return () => {
      clearTimeout(t)
      map.off('moveend', lock)
    }
  }, [map, stretch, lockBounds, maxFlyZoom])
  return null
}

const SectionHeading = ({ num, id, children, blurb }) => (
  <>
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#8B0000]">{num}</span>
      <h2 id={id} className="font-serif text-3xl tracking-tight text-[#2C2C2C]">
        <span aria-hidden="true">— </span>{children}
      </h2>
    </div>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">{blurb}</p>
  </>
)

const CARD = 'relative flex flex-col overflow-hidden rounded-lg border-2 border-t-4 border-slate-200 border-t-emerald-600 bg-white p-6 shadow-sm transition-all hover:shadow-md'

export default function PlaceholderCorridorView({ corridorId }) {
  const c = CORRIDORS[corridorId]
  const [baseMap, setBaseMap] = useState('standard')
  const base = BASE_MAPS[baseMap]
  if (!c) return <p className="py-24 text-center text-stone-500">Corridor not found.</p>

  return (
    <div>
      {/* 01: corridor map */}
      <h2 className="font-serif text-4xl tracking-tight">{c.title}</h2>
      <p className="mt-2 text-sm text-stone-500">{c.subtitle}</p>

      <div className="relative isolate mt-6 h-[85vh] w-full overflow-hidden rounded-2xl border border-stone-200">
        <MapContainer key={corridorId} center={REGION_VIEW.center} zoom={REGION_VIEW.zoom} minZoom={5} maxZoom={MAX_ZOOM} maxBoundsViscosity={1} className="h-full w-full">
          <TileLayer key={baseMap} attribution={base.attribution} url={base.url} maxZoom={MAX_ZOOM} />
          <Polyline positions={c.highway} pathOptions={HIGHWAY_STYLE}>
            <Popup>
              <p className="text-sm font-semibold">{c.popup}</p>
              <p className="mt-1 text-xs text-stone-500">Approximate alignment; detailed overlays are coming soon.</p>
            </Popup>
          </Polyline>
          <Marker position={c.site} icon={PIN_ICON} interactive={false} />
          <FlyIn stretch={c.stretch} lockBounds={c.lockBounds} maxFlyZoom={c.maxFlyZoom} />
        </MapContainer>
        <div className="absolute right-4 top-4 z-[1000] flex items-center gap-0.5 rounded-xl border border-[#E6E1DA] bg-[#FBF9F5]/90 p-1.5 text-xs font-medium text-[#5A524C] shadow-sm backdrop-blur-md" role="group" aria-label="Base map">
          {Object.entries(BASE_MAPS).map(([id, b]) => (
            <button
              key={id}
              type="button"
              onClick={() => setBaseMap(id)}
              aria-pressed={baseMap === id}
              className={`rounded-lg px-3 py-1.5 transition ${baseMap === id ? 'bg-[#6E231A] text-white' : 'hover:bg-stone-200/60'}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 px-2 text-xs font-medium text-[#5A524C] md:text-sm">
        <li className="flex items-center gap-2.5"><span className="h-1 w-7 rounded-full bg-[#8B261D]/85" />{c.legend}</li>
      </ul>

      {/* 02: existing solutions placeholder */}
      <section aria-labelledby="i5-existing" className="mt-16 border-t border-stone-200 pt-12">
        <SectionHeading num="02" id="i5-existing" blurb="A review of baseline mitigations, field interventions, and active protocols currently deployed along the corridor.">
          Existing Solutions
        </SectionHeading>
        <div className="mt-8">
          <article className={CARD}>
            <span className="self-start rounded-full bg-slate-100 px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-500">Placeholder</span>
            <h3 className="mt-4 font-serif text-xl font-medium text-slate-900">{c.existing.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">{c.existing.body}</p>
          </article>
        </div>
      </section>

      {/* 03: generated solutions placeholder; the button is intentionally inert for now */}
      <section aria-labelledby="i5-generated" className="mt-16 min-h-[70vh] border-t border-stone-200 pb-24 pt-16">
        <SectionHeading num="03" id="i5-generated" blurb="Simulated multi-tier mitigation strategies combining indigenous co-management, capital infrastructure, intelligent transport systems, and real-time telemetry.">
          Generated Corridor Solutions
        </SectionHeading>
        <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {[0, 1].map((i) => (
            <article key={i} className={CARD}>
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
        <div className="mb-6 mt-10 flex justify-center">
          <button
            type="button"
            aria-disabled="true"
            className="cursor-default rounded-xl bg-emerald-700 px-10 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-emerald-800 md:text-lg"
          >
            Generate Solutions
          </button>
        </div>
      </section>
    </div>
  )
}
