import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  GRAZING_STYLE,
  HABITAT_STYLE,
  HIGHWAY_HIT_STYLE,
  HIGHWAY_STYLE,
  INCIDENT_STYLE,
  Legend,
  PIN_ICON,
  SHIELD_ICON,
} from './corridorMapShared.jsx'

// US-101 Redwood Coastal Corridor: the 7-mile high-impact stretch (Humboldt & Del Norte Counties).
const SITE = [41.30819, -124.04531]
const STRETCH = [[41.24, -124.09], [41.36, -124.0]]

// US-101 centerline traced from OpenStreetMap (Stone Lagoon through Orick to the Prairie Creek south entrance).
const HIGHWAY = [
  [41.24219, -124.08467],
    [41.24265, -124.08480],
    [41.24352, -124.08533],
    [41.24395, -124.08592],
    [41.24429, -124.08689],
    [41.24452, -124.08726],
    [41.24494, -124.08759],
    [41.24593, -124.08810],
    [41.24624, -124.08816],
    [41.24656, -124.08809],
    [41.24884, -124.08714],
    [41.24942, -124.08710],
    [41.24989, -124.08728],
    [41.25074, -124.08804],
    [41.25276, -124.08934],
    [41.25314, -124.08965],
    [41.25359, -124.09018],
    [41.25570, -124.09306],
    [41.25832, -124.09543],
    [41.25880, -124.09579],
    [41.25946, -124.09621],
    [41.26066, -124.09675],
    [41.26154, -124.09701],
    [41.26512, -124.09783],
    [41.26566, -124.09784],
    [41.26615, -124.09772],
    [41.26925, -124.09630],
    [41.27115, -124.09560],
    [41.27349, -124.09494],
    [41.27869, -124.09390],
    [41.28134, -124.09304],
    [41.28202, -124.09266],
    [41.28266, -124.09212],
    [41.28323, -124.09151],
    [41.28394, -124.09046],
    [41.28694, -124.08468],
    [41.28716, -124.08386],
    [41.28723, -124.08331],
    [41.28719, -124.08238],
    [41.28699, -124.08154],
    [41.28684, -124.08114],
    [41.28565, -124.07890],
    [41.28521, -124.07785],
    [41.28481, -124.07615],
    [41.28473, -124.07406],
    [41.28459, -124.06298],
    [41.28473, -124.06208],
    [41.28516, -124.06132],
    [41.28666, -124.05958],
    [41.28730, -124.05908],
    [41.28774, -124.05886],
    [41.28828, -124.05872],
    [41.28974, -124.05857],
    [41.28998, -124.05849],
    [41.29574, -124.05465],
    [41.29718, -124.05357],
    [41.29867, -124.05193],
    [41.29926, -124.05117],
    [41.30011, -124.05053],
    [41.30076, -124.04977],
    [41.30107, -124.04927],
    [41.30175, -124.04780],
    [41.30231, -124.04684],
    [41.30295, -124.04486],
    [41.30339, -124.04438],
    [41.30391, -124.04423],
    [41.30466, -124.04417],
    [41.30493, -124.04421],
    [41.30531, -124.04441],
    [41.30586, -124.04496],
    [41.30635, -124.04519],
    [41.30819, -124.04531],
    [41.31075, -124.04537],
    [41.31273, -124.04444],
    [41.31303, -124.04415],
    [41.31463, -124.04211],
    [41.31536, -124.04159],
    [41.32125, -124.03919],
    [41.32274, -124.03848],
    [41.32310, -124.03803],
    [41.32467, -124.03482],
    [41.32508, -124.03433],
    [41.32597, -124.03348],
    [41.32733, -124.03133],
    [41.32777, -124.03072],
    [41.32809, -124.03037],
    [41.32854, -124.03007],
    [41.32903, -124.02987],
    [41.32939, -124.02983],
    [41.33184, -124.03024],
    [41.33228, -124.03043],
    [41.33304, -124.03099],
    [41.33340, -124.03111],
    [41.33378, -124.03110],
    [41.33569, -124.03059],
    [41.33672, -124.03056],
    [41.33733, -124.03069],
    [41.33794, -124.03118],
    [41.33989, -124.03362],
    [41.34026, -124.03380],
    [41.34053, -124.03384],
    [41.34079, -124.03379],
    [41.34114, -124.03355],
    [41.34269, -124.03183],
    [41.34361, -124.03099],
    [41.34584, -124.02974],
    [41.34700, -124.02888],
    [41.34851, -124.02730],
    [41.34967, -124.02576],
    [41.35258, -124.02069],
    [41.35285, -124.02014],
    [41.35311, -124.01936],
    [41.35374, -124.01670],
    [41.35401, -124.01593],
    [41.35430, -124.01534],
    [41.35473, -124.01473],
    [41.35526, -124.01419],
    [41.35709, -124.01289],
    [41.35757, -124.01226],
    [41.35799, -124.01145],
    [41.35843, -124.00979],
    [41.35965, -124.00377],
    [41.35972, -124.00192],
    [41.35957, -124.00078],
    [41.35924, -123.99916],
]
const HIGHWAY_INFO = {
  overview:
    'US-101 is a primary high-speed arterial highway bisecting coastal meadow and forest ecosystems in Humboldt County. It is designated as a critical wildlife conflict zone because expanding Roosevelt elk herds actively cross this unlit, fog-prone 7-mile stretch between pasturelands and canopy shelter, leading to frequent high-impact vehicle collisions.',
  incident:
    'Most Recent Incident: On October 6, 2026, at 11:55 PM, a vehicle collided with a Roosevelt elk on US-101 near Mile Marker 114.99 (Stone Lagoon area), leaving the vehicle disabled with fluid leaks and requiring emergency towing and wildlife officer response.',
}
const HIGHWAY_MID = [41.30231, -124.04684]

// Hand-drawn, approximate habitat outlines for orientation only.
const HABITATS = [
  {
    // Prairie Creek Redwoods canopy (NE)
    points: [[41.34, -124.02], [41.385, -124.035], [41.395, -124.0], [41.36, -123.975], [41.335, -123.99]],
    zone: 'Prairie Creek Redwood Reserve',
    meta: 'Roosevelt Elk (Cervus canadensis roosevelti) | Est. Population: ~350 – 450 individuals',
    body: 'As a keystone herbivore in the ancient coastal redwood ecosystem, Roosevelt elk maintain open meadow dynamics, promote native flora regeneration, and serve as a vital prey base for apex predators like mountain lions and black bears. However, high-density herds frequently move between dense old-growth canopy shelter and open foraging pastures across US-101. Dense coastal fog combined with high vehicle transit speeds turns these critical habitat crossings into severe collision corridors, threatening localized herd survival and public safety.',
  },
  {
    // Stone Lagoon marsh & pasture (W)
    points: [[41.23, -124.1], [41.268, -124.098], [41.27, -124.08], [41.252, -124.083], [41.232, -124.09]],
    zone: 'Stone Lagoon Coastal Corridor',
    meta: 'Roosevelt Elk (Cervus canadensis roosevelti) | Est. Population: ~150 – 250 individuals',
    body: 'Occupying the narrow coastal strip along Stone Lagoon and Big Lagoon, these specialized coastal herds graze on moisture-rich flora and coastal scrub, bridging land-sea ecosystem interactions. Because their habitat is tightly constricted between marine bluffs and steep forested slopes, US-101 bisects their primary daily route between freshwater drink sites and coastal grazing pastures. This extreme spatial bottleneck leads to frequent highway incursions, making vehicle mortality a leading driver of herd fragmentation along the lagoon corridor.',
  },
  {
    // Redwood Creek watershed (SE), toward the Bald Hills
    points: [[41.265, -124.045], [41.3, -124.035], [41.32, -124.0], [41.29, -123.975], [41.255, -124.0]],
    zone: 'Bald Hills Drainage & Prairie Foothills',
    meta: 'Roosevelt Elk (Cervus canadensis roosevelti) | Est. Population: ~200 – 300 individuals',
    body: 'Inhabiting the transitional oak woodlands and open grassy ridges of the Bald Hills drainage, these elk herds regulate grass-shrub succession and enrich soil nutrient cycling across coastal prairie habitats. Seasonal water availability and forage shifts force herds to migrate downhill toward low-lying stream basins adjacent to the highway. Vehicle collisions along these unlit, winding stretches disrupt seasonal herd migration pathways and disproportionately impact reproductive cows and young calves essential for population stability.',
  },
]

// Low-lying pasture flanking the highway near Orick Valley and Stone Lagoon (approximate outlines).
const GRAZING = [
  [[41.268, -124.08], [41.282, -124.079], [41.2825, -124.064], [41.272, -124.06], [41.265, -124.068]], // Orick Valley
  [[41.236, -124.082], [41.252, -124.078], [41.256, -124.068], [41.24, -124.07]], // Stone Lagoon
]
const GRAZING_INFO =
  'Targeted grazing hotspots are specifically designated agricultural and grassland areas where managed livestock grazing and controlled vegetation management clear dense brush and invasive plant species along the corridor. These buffer zones are vital for local wildlife because they mitigate wildfire risks, preserve open pasture visibility, and establish high-quality foraging habitat away from the roadway—actively incentivizing Roosevelt elk and deer to remain off hazardous pavement zones.'

// CHP-logged elk collisions, snapped onto the highway line. The map segment ends at Prairie Creek, so the
// positions are approximate (the Del Norte, McDonald Creek and Elk Valley sites lie further north).
const INCIDENTS = [
  {
    at: [41.35965, -124.00377],
    when: 'Date & Time: October 7, 2026 | 11:59 PM',
    where: 'US-101 North Corridor (Del Norte / Humboldt County Line)',
    what: 'A Subaru collided with an adult elk on US-101. The vehicle was rendered inoperable in the primary lane and required emergency towing. No human fatalities were reported.',
    log: '261008HM0001',
  },
  {
    at: [41.24352, -124.08533],
    when: 'Date & Time: October 6, 2026 | 11:55 PM',
    where: 'US-101 Northbound @ MM 114.99 (Stone Lagoon Area)',
    what: 'A vehicle struck a Roosevelt elk along the dark curves of US-101. The vehicle sustained heavy fluid leaks and severe front-end damage, requiring tow recovery. State wildlife officials were notified for carcass management.',
    log: '261006HM0234',
  },
  {
    at: [41.28666, -124.05958],
    when: 'Date & Time: September 28, 2026 | 11:36 PM',
    where: 'US-101 & McDonald Creek Road',
    what: 'A southbound vehicle struck an adult elk and swerved off the roadway embankment into an adjacent pond roughly 20 feet off the highway edge. Caltrans and Fish & Wildlife crews responded to clear debris and recover the vehicle.',
    log: '260928HM0222',
  },
  {
    at: [41.33794, -124.03118],
    when: 'Date & Time: September 23, 2026 | 7:38 PM',
    where: 'US-101 & Elk Valley Cross Road',
    what: 'A semi-truck collided with an adult elk on US-101. The commercial vehicle sustained front-end impact damage but no human injuries were reported. CHP and Caltrans crews responded to secure the scene and handle animal carcass removal along the highway shoulder.',
    log: '260924HM0174',
  },
]
const REGION_VIEW = { center: [40.7, -122.4], zoom: 7 } // Northern California, where the fly-in starts
const MIN_ZOOM = 11
const MAX_ZOOM = 16
const LOCK_BOUNDS = L.latLngBounds([40.95, -124.6], [41.65, -123.45])



// Shared wide popup: white card with a colored accent bar on the header.
export function PopupCard({ accent, title, subtitle, children }) {
  return (
    <Popup className="habitat-popup" minWidth={360} maxWidth={480} autoPanPadding={[24, 24]}>
      <div className="max-h-[60vh] overflow-y-auto rounded-lg bg-white p-4 pr-8 text-[#2C2C2C] shadow-md">
        <div className="border-l-4 pl-3" style={{ borderColor: accent }}>
          <h3 className="text-base font-bold leading-snug">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-stone-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </Popup>
  )
}


// Starts at the regional view, flies into the stretch, then locks the zoom range and bounds.
function FlyIn() {
  const map = useMap()
  useEffect(() => {
    const lock = () => {
      map.setMinZoom(MIN_ZOOM)
      map.setMaxZoom(MAX_ZOOM)
      map.setMaxBounds(LOCK_BOUNDS)
    }
    map.invalidateSize() // the container sizes after mount; recompute so tiles render immediately
    map.once('moveend', lock)
    const t = setTimeout(() => map.flyToBounds(STRETCH, { duration: 3, padding: [60, 60], maxZoom: 14 }), 500)
    return () => {
      clearTimeout(t)
      map.off('moveend', lock)
    }
  }, [map])
  return null
}

// Keeps Leaflet's size in step with the container while the diagnostic panel animates open or closed.
export function ResizeOnChange({ watch }) {
  const map = useMap()
  useEffect(() => {
    let frame
    const end = performance.now() + 400
    const tick = () => {
      map.invalidateSize()
      if (performance.now() < end) frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [map, watch])
  return null
}

const DIAGNOSTIC_SECTIONS = [
  {
    heading: '1. Spatial & Ecological Context',
    body: 'The US-101 Redwood Coastal Corridor bisects high-value coastal forest, lagoon, and agricultural meadow ecosystems across Humboldt and Del Norte Counties. Expanding populations of Roosevelt elk (~150–450 individuals) rely heavily on these coastal pastures for daily foraging. As a result, herds frequently cross this 7-mile highway stretch, creating continuous intersection points between high-speed vehicle traffic and large ungulates.',
  },
  {
    heading: '2. Conflict Drivers & Environmental Factors',
    body: 'Wildlife-vehicle collisions along this corridor are exacerbated by three key factors:',
    bullets: [
      ['Microclimate Visibility', 'Frequent dense marine fog, heavy coastal drizzle, and dark, unlit road segments severely restrict driver reaction times.'],
      ['Roadway Geometry & Speed', 'High arterial travel speeds (55+ mph) combined with sweeping unlit curves make braking difficult when herds step onto the pavement.'],
      ['Crepuscular Activity', 'Peak elk herd movement across the highway coincides with twilight and nighttime driving hours.'],
    ],
  },
]

const METRICS = [
  ['Conflict Zone', '7.0 Miles'],
  ['Elk Population', '~150–450'],
  ['Hotspot Corridor', 'US-101 MM 114–132'],
]

const RECENT_INCIDENTS = [
  {
    head: 'Oct 7, 2026 | 11:59 PM — Del Norte Line',
    text: 'Subaru-elk collision; vehicle disabled in lane; emergency tow dispatched. No human fatalities.',
    log: '261008HM0001',
  },
  {
    head: 'Oct 6, 2026 | 11:55 PM — Stone Lagoon (MM 114.99)',
    text: 'Vehicle-elk impact resulting in severe fluid leaks and front-end damage. CDFW notified for carcass recovery.',
    log: '261006HM0234',
  },
  {
    head: 'Sep 28, 2026 | 11:36 PM — McDonald Creek Rd',
    text: 'Southbound vehicle struck elk and swerved off embankment into roadside pond. Caltrans cleared roadway.',
    log: '260928HM0222',
  },
  {
    head: 'Sep 23, 2026 | 7:38 PM — Elk Valley Cross Rd',
    text: 'Semi-truck collision with adult elk. Rig remained operable; CHP and Caltrans handled shoulder cleanup.',
    log: '260924HM0174',
  },
]

// Docked to the right edge of the map; its width animates 0 -> 400px, pushing the map narrower.
function DiagnosticPanel({ open, onClose }) {
  return (
    <aside
      aria-label="Corridor diagnostic"
      aria-hidden={!open}
      className={`shrink-0 overflow-hidden bg-white transition-all duration-300 ease-out ${
        open ? 'my-2 mr-2 rounded-2xl border border-stone-200 opacity-100 shadow-2xl' : 'pointer-events-none opacity-0'
      }`}
      style={{ width: open ? 'min(400px, 90%)' : 0 }}
    >
      <div className="relative h-full w-[400px] overflow-y-auto p-6 text-[#2C2C2C]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close diagnostic"
          tabIndex={open ? 0 : -1}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-[#2C2C2C]"
        >
          ×
        </button>

        <header className="border-b border-stone-200 pb-5 pr-8">
          <h3 className="font-serif text-2xl leading-tight tracking-tight">US-101 Redwood Coastal Corridor Analysis</h3>
          <p className="mt-2 text-sm text-stone-500">Humboldt &amp; Del Norte Counties | Orick Valley to Prairie Creek Sector</p>
          <span className="mt-3 inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-[#8B0000]">
            High-Risk Wildlife Conflict Corridor
          </span>
        </header>

        {DIAGNOSTIC_SECTIONS.map((sec) => (
          <section key={sec.heading} className="border-b border-stone-200 py-5 last:border-b-0">
            <h4 className="font-serif text-lg tracking-tight">{sec.heading}</h4>
            <p className="mt-2 text-sm leading-relaxed">{sec.body}</p>
            {sec.bullets && (
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                {sec.bullets.map(([label, text]) => (
                  <li key={label} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span><strong className="font-semibold">{label}:</strong> {text}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="space-y-5 pt-5">
          <h4 className="font-serif text-lg tracking-tight">3. Diagnostic Findings &amp; Incident Breakdown</h4>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Key Corridor Metrics</h5>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {METRICS.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-stone-500">{label}</p>
                  <p className="mt-1 text-sm font-bold leading-snug">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Recent Documented Incidents</h5>
            <ol className="mt-2 space-y-2">
              {RECENT_INCIDENTS.map((inc) => (
                <li key={inc.log} className="rounded-xl border border-stone-100 border-l-4 border-l-[#8B0000] bg-white p-3 shadow-sm">
                  <p className="text-sm font-semibold leading-snug">{inc.head}</p>
                  <p className="mt-1 text-sm leading-relaxed">{inc.text}</p>
                  <p className="mt-2 font-mono text-xs text-stone-500">CHP #{inc.log}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Mitigation &amp; Buffer Status</h5>
            <p className="mt-2 text-sm leading-relaxed">
              Targeted grazing hot spots and vegetation clearing along pasture margins actively serve to keep foraging herds on safe pastureland, away from hazardous road margins.
            </p>
          </div>
        </section>
      </div>
    </aside>
  )
}

export const BASE_MAPS = {
  standard: {
    label: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  terrain: {
    label: 'Terrain',
    url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  },
}

export default function ConflictMapView() {
  const [baseMap, setBaseMap] = useState('standard') // 'standard' | 'terrain' | 'satellite'
  const [showOverlays, setShowOverlays] = useState(true) // independent of the base map
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false)
  const base = BASE_MAPS[baseMap]

  return (
    <div>
      <h2 className="font-serif text-4xl tracking-tight">US-101 Redwood Coastal Corridor</h2>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <p className="text-sm text-stone-500">Humboldt &amp; Del Norte Counties</p>
        <button
          type="button"
          onClick={() => setIsDiagnosticOpen(true)}
          className="rounded-full bg-[#8B0000] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:scale-105 hover:shadow-md active:scale-100"
        >
          Run Diagnostic
        </button>
      </div>

      <div className="relative isolate mt-6 flex h-[85vh] w-full flex-row overflow-hidden rounded-2xl border border-stone-200">
        <div className="relative h-full min-w-0 flex-1">
        <MapContainer
          center={REGION_VIEW.center}
          zoom={REGION_VIEW.zoom}
          minZoom={5}
          maxZoom={MAX_ZOOM}
          maxBoundsViscosity={1}
          className="h-full w-full"
        >
          <TileLayer key={baseMap} attribution={base.attribution} url={base.url} maxZoom={MAX_ZOOM} />
          {showOverlays && (
            <>
          {HABITATS.map((h) => (
            <Polygon key={h.zone} positions={h.points} pathOptions={HABITAT_STYLE}>
              <PopupCard
                accent="#2E5A36"
                title="Critical Habitat & Foraging Area"
                subtitle="Roosevelt Elk Population (~150–450) | Keystone Coastal Ecosystem"
              >
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#2E5A36]">{h.zone}</p>
                <p className="mt-1 text-xs text-stone-500">{h.meta}</p>
                <p className="mt-2 text-sm leading-relaxed">{h.body}</p>
              </PopupCard>
            </Polygon>
          ))}
          {GRAZING.map((points, i) => (
            <Polygon key={`g${i}`} positions={points} pathOptions={GRAZING_STYLE}>
              <PopupCard accent="#8B5A2B" title="Targeted Grazing Hotspot" subtitle="Managed Ecological Foraging & Buffer Zone">
                <p className="mt-3 text-sm leading-relaxed">{GRAZING_INFO}</p>
              </PopupCard>
            </Polygon>
          ))}
          <Polyline positions={HIGHWAY} pathOptions={HIGHWAY_STYLE} />
          {/* Wider invisible stroke so the thin line is easy to click */}
          <Polyline positions={HIGHWAY} pathOptions={HIGHWAY_HIT_STYLE}>
            <PopupCard accent="#A63A2B" title="US-101 7-Mile High-Risk Conflict Zone" subtitle="Orick Valley to Prairie Creek Corridor">
              <p className="mt-3 text-sm leading-relaxed">{HIGHWAY_INFO.overview}</p>
              <p className="mt-3 text-sm leading-relaxed">{HIGHWAY_INFO.incident}</p>
            </PopupCard>
          </Polyline>
          {INCIDENTS.map((inc) => (
            <CircleMarker key={inc.log} center={inc.at} pathOptions={INCIDENT_STYLE} radius={INCIDENT_STYLE.radius}>
              <PopupCard accent="#8B0000" title="Documented Incident Hotspot">
                <p className="mt-3 text-xs font-semibold text-[#2C2C2C]">{inc.when}</p>
                <p className="mt-1 text-xs text-stone-500">{inc.where}</p>
                <p className="mt-2 text-sm leading-relaxed">{inc.what}</p>
                <p className="mt-3 text-xs italic text-stone-500">Source: California Highway Patrol (CHP Dispatch Log #{inc.log})</p>
              </PopupCard>
            </CircleMarker>
          ))}
          <Marker position={HIGHWAY_MID} icon={SHIELD_ICON} interactive={false} />
            </>
          )}
          <Marker position={SITE} icon={PIN_ICON} interactive={false} />
          <FlyIn />
          <ResizeOnChange watch={isDiagnosticOpen} />
        </MapContainer>

        <div className="absolute right-4 top-4 z-[1000] flex items-center gap-2 rounded-xl border border-[#E6E1DA] bg-[#FBF9F5]/90 p-1.5 text-xs font-medium text-[#5A524C] shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-0.5" role="group" aria-label="Base map">
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
          <span className="h-5 w-px bg-[#E6E1DA]" />
          <button
            type="button"
            onClick={() => setShowOverlays((v) => !v)}
            aria-pressed={showOverlays}
            className="rounded-lg px-3 py-1.5 transition hover:bg-stone-200/60"
          >
            Overlays: {showOverlays ? 'On' : 'Off'}
          </button>
        </div>
        </div>

        <DiagnosticPanel open={isDiagnosticOpen} onClose={() => setIsDiagnosticOpen(false)} />
      </div>
      <Legend dimmed={!showOverlays} />
    </div>
  )
}
