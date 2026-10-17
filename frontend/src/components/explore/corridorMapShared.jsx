import L from 'leaflet'

// Map symbols and legend shared by the corridor pages (US-101 Redwood is the reference style).
export const HIGHWAY_STYLE = { color: '#8B261D', weight: 4, opacity: 0.85, lineCap: 'round', interactive: false }
export const HIGHWAY_HIT_STYLE = { color: '#8B261D', weight: 18, opacity: 0, lineCap: 'round' }
export const HABITAT_STYLE = { fillColor: '#7AA974', fillOpacity: 0.18, color: '#5C8A56', weight: 1.5, dashArray: '3, 3' }
export const GRAZING_STYLE = { fillColor: '#8C6D53', fillOpacity: 0.18, color: '#6E523B', weight: 1.5, dashArray: '3, 3' }
export const INCIDENT_STYLE = { color: '#2C2C2C', fillColor: '#2C2C2C', fillOpacity: 0.4, weight: 1.5, radius: 6, bubblingMouseEvents: false }

export const PIN_ICON = L.divIcon({
  className: '',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  html: `<svg width="28" height="36" viewBox="-9 -17 18 18" style="overflow:visible;filter:drop-shadow(0 0 10px rgba(162,72,56,0.5))">
    <path d="M0 0C-5-7-7-10-7-14a7 7 0 1 1 14 0c0 4-2 7-7 14z" fill="#A24838" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cy="-14" r="2.6" fill="#fff"/>
  </svg>`,
})

// Route shield in the site's earth tones, anchored at the middle of the corridor: `top` is the small
// line above the large route number (e.g. "US" / "101" or "CA" / "37").
export const shieldIcon = (top, num, numSize = 13) =>
  L.divIcon({
    className: '',
    iconSize: [30, 34],
    iconAnchor: [15, 17],
    html: `<svg width="30" height="34" viewBox="0 0 30 34">
    <path d="M15 1.5 27.5 5v12.5C27.5 25 22 30 15 32.5 8 30 2.5 25 2.5 17.5V5z" fill="#FBF9F6" stroke="#6E231A" stroke-width="2" stroke-linejoin="round"/>
    <text x="15" y="13" text-anchor="middle" font-family="Georgia,serif" font-size="5.5" font-weight="700" letter-spacing=".4" fill="#6E231A">${top}</text>
    <text x="15" y="25" text-anchor="middle" font-family="Georgia,serif" font-size="${numSize}" font-weight="700" fill="#6E231A">${num}</text>
  </svg>`,
  })

export const SHIELD_ICON = shieldIcon('US', '101')

// Legend swatches mirror the map symbols.
export function Legend({ dimmed }) {
  return (
    <ul className={`mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-0 bg-transparent px-2 text-xs font-medium text-[#5A524C] shadow-none transition-opacity md:text-sm ${dimmed ? 'opacity-50' : ''}`}>
      <li className="flex items-center gap-2.5">
        <span className="h-1 w-7 rounded-full bg-[#8B261D]/85" />
        <svg width="14" height="16" viewBox="0 0 30 34" aria-hidden="true">
          <path d="M15 1.5 27.5 5v12.5C27.5 25 22 30 15 32.5 8 30 2.5 25 2.5 17.5V5z" fill="#FBF9F6" stroke="#6E231A" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        7-Mile High-Risk Conflict Zone (US-101)
      </li>
      <li className="flex items-center gap-2.5">
        <span className="h-4 w-4 rounded-sm border border-dashed border-[#5C8A56] bg-[#7AA974]/20" />
        Critical Habitat &amp; Foraging Area
      </li>
      <li className="flex items-center gap-2.5">
        <span className="h-4 w-4 rounded-sm border border-dashed border-[#6E523B] bg-[#8C6D53]/20" />
        Targeted Grazing Hotspots
      </li>
      <li className="flex items-center gap-2.5">
        <span className="h-3.5 w-3.5 rounded-full border border-[#2C2C2C] bg-[#4A4A4A]/40" />
        Documented Incident Hotspot
      </li>
      <li className="flex items-center gap-2.5">
        <svg width="14" height="18" viewBox="-8 -15 16 16" aria-hidden="true">
          <path d="M0 0C-5-7-7-10-7-14a7 7 0 1 1 14 0c0 4-2 7-7 14z" fill="#8B261D" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cy="-14" r="2.6" fill="#fff" />
        </svg>
        Caltrans Radio Transceiver Station
      </li>
    </ul>
  )
}


const SHIELD_SWATCH = (
  <svg width="14" height="16" viewBox="0 0 30 34" aria-hidden="true">
    <path d="M15 1.5 27.5 5v12.5C27.5 25 22 30 15 32.5 8 30 2.5 25 2.5 17.5V5z" fill="#FBF9F6" stroke="#6E231A" strokeWidth="3" strokeLinejoin="round" />
  </svg>
)
const PIN_SWATCH = (
  <svg width="14" height="18" viewBox="-8 -15 16 16" aria-hidden="true">
    <path d="M0 0C-5-7-7-10-7-14a7 7 0 1 1 14 0c0 4-2 7-7 14z" fill="#8B261D" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cy="-14" r="2.6" fill="#fff" />
  </svg>
)
const SWATCHES = {
  route: (
    <>
      <span className="h-1 w-7 rounded-full bg-[#8B261D]/85" />
      {SHIELD_SWATCH}
    </>
  ),
  habitat: <span className="h-4 w-4 rounded-sm border border-dashed border-[#5C8A56] bg-[#7AA974]/20" />,
  grazing: <span className="h-4 w-4 rounded-sm border border-dashed border-[#6E523B] bg-[#8C6D53]/20" />,
  waypoint: <span className="h-3.5 w-3.5 rounded-full border border-[#2C2C2C] bg-[#4A4A4A]/40" />,
  pin: PIN_SWATCH,
}

// Same format as `Legend`, driven by a list of { kind, label } so each corridor lists only what its map shows.
export function LegendList({ items, dimmed }) {
  return (
    <ul className={`mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-0 bg-transparent px-2 text-xs font-medium text-[#5A524C] shadow-none transition-opacity md:text-sm ${dimmed ? 'opacity-50' : ''}`}>
      {items.map(({ kind, label }) => (
        <li key={label} className="flex items-center gap-2.5">
          {SWATCHES[kind]}
          {label}
        </li>
      ))}
    </ul>
  )
}
