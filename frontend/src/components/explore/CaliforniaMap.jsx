import { motion } from 'framer-motion'
import { CA_REGIONS } from '../../data/conflicts.js'
import { MAP_H, MAP_W, OUTLINE_PATH, clipOrder, project, regionLabelPoint, regionOrigin, regionRect, regionViewBox } from '../../data/caMap.js'

const byId = Object.fromEntries(CA_REGIONS.map((r) => [r.id, r]))

const LABEL_LINES = {
  northern: ['Northern', 'California'],
  bay: ['Greater', 'Bay', 'Area'],
  central: ['Central', 'California'],
  southern: ['Southern', 'California'],
}

// Corridor pins per region ([lat, lon]); clicking one currently only shows the loader. `featured` gets the rust glow.
const FEATURED = '#A24838'
const MUTED = '#9B9488'
const PINS_BY_REGION = {
  northern: [
    { id: 'us101-redwood', coords: [41.3, -123.95], featured: true }, // US-101 Redwood Coastal Corridor
    { id: 'i5-shasta-trinity', coords: [40.7, -122.4] }, // I-5 Shasta-Trinity Corridor
  ],
  bay: [
    { id: 'sr37-baylands', coords: [38.15, -122.35], featured: true }, // SR-37 San Pablo Baylands
  ],
  central: [
    { id: 'us101-rocks-road', coords: [36.75, -121.3], featured: true }, // US-101 Rocks Road, San Benito County
    { id: 'hwy41-46-cholame', coords: [35.73, -120.29] }, // HWY 41/46 Cholame "Y" Corridor
  ],
  southern: [
    { id: 'i15-temecula', coords: [33.465, -117.145], featured: true }, // I-15 Temecula / Rainbow Canyon
    { id: 'us101-agoura-hills', coords: [34.14, -118.76] }, // US-101 Wallis Annenberg, Agoura Hills
    { id: 'sr71-chino-hills', coords: [33.95, -117.73] }, // SR-71 Chino Hills Corridor
  ],
}

// Flat teardrop marker, tip at the origin.
const PIN_PATH = 'M0 0C-5 -7 -7 -10 -7 -14a7 7 0 1 1 14 0c0 4 -2 7 -7 14z'

// The Bay Area polygon is narrow, so its label is set smaller to stay inside the land.
const LABEL_SIZE = { bay: 7.5 }

export default function CaliforniaMap({ regionId, conflictId, onRegion, onPin }) {
  const viewBox = regionViewBox(regionId)
  const zoom = MAP_W / Number(viewBox.split(' ')[2]) // > 1 when zoomed; keeps pins a constant on-screen size

  return (
    <motion.svg
      initial={false}
      animate={{ viewBox }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="h-full w-full overflow-visible"
      role="group"
      aria-label="Map of California divided into four regions"
    >
      <defs>
        <clipPath id="ca-outline"><path d={OUTLINE_PATH} /></clipPath>
        {/* Each region's visible land: its box minus the boxes painted over it. */}
        {clipOrder.map((id, i) => (
          <mask key={id} id={`ca-mask-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={MAP_W} height={MAP_H}>
            <rect {...regionRect(id)} fill="#fff" />
            {clipOrder.slice(i + 1).map((later) => <rect key={later} {...regionRect(later)} fill="#000" />)}
          </mask>
        ))}
      </defs>

      {clipOrder.map((id) => {
        const r = byId[id]
        const selected = regionId === id
        const dim = regionId && regionId !== id
        const origin = regionOrigin(id)
        return (
          <motion.g
            key={id}
            clipPath="url(#ca-outline)"
            initial={false}
            // the chosen region puffs out as the loader fades away and the map zooms in
            animate={{ scale: selected ? [1, 1.14, 1] : 1 }}
            transition={{ duration: selected ? 0.8 : 0, ease: 'easeOut' }}
            style={{ originX: origin.x, originY: origin.y }}
          >
            <g mask={`url(#ca-mask-${id})`}>
              <rect
                {...regionRect(id)}
                fill={r.color}
                fillOpacity={dim ? 0.22 : 1}
                stroke="#fff"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                role="button"
                tabIndex={regionId ? -1 : 0}
                aria-label={`Open ${r.name}`}
                className={`outline-none transition-opacity duration-300 ${
                  regionId ? '' : 'cursor-pointer hover:opacity-90 focus-visible:opacity-90'
                }`}
                onClick={regionId ? undefined : () => onRegion(id)} // only the statewide view picks a region
                onKeyDown={regionId ? undefined : (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onRegion(id))}
              />
            </g>
          </motion.g>
        )
      })}
      <motion.g
        initial={false}
        animate={{ opacity: regionId ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        pointerEvents="none"
        textAnchor="middle"
        className="select-none fill-white font-serif font-semibold tracking-wide drop-shadow-sm"
        style={{ fontSize: 11, paintOrder: 'stroke', stroke: 'rgba(60,40,30,0.28)', strokeWidth: 1.5, strokeLinejoin: 'round' }}
      >
        {clipOrder.map((id) => {
          const [x, y] = regionLabelPoint(id)
          return (
            <text key={id} x={x} y={y - 4} fontSize={LABEL_SIZE[id]}>
              {LABEL_LINES[id].map((line, i) => <tspan key={line} x={x} dy={i ? (LABEL_SIZE[id] ?? 11) + 2 : 0}>{line}</tspan>)}
            </text>
          )
        })}
      </motion.g>
      <path
        d={OUTLINE_PATH}
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />

      {regionId &&
        PINS_BY_REGION[regionId].map((p, i) => {
          const [x, y] = project([p.coords[1], p.coords[0]])
          return (
            <motion.g
              key={p.id}
              transform={`translate(${x} ${y})`}
              role="button"
              tabIndex={0}
              aria-label="Load conflict point"
              className="cursor-pointer outline-none"
              onClick={() => onPin(p.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onPin(p.id))}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
              style={p.featured ? { filter: 'drop-shadow(0 0 10px rgba(162,72,56,0.5))' } : undefined}
            >
              {p.featured && (
                <motion.circle
                  r={6 / zoom}
                  fill={p.featured ? FEATURED : MUTED}
                  fillOpacity="0.3"
                  animate={{ r: [6 / zoom, 16 / zoom], fillOpacity: [0.3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <g transform={`scale(${0.9 / zoom})`} className="transition-opacity hover:opacity-80">
                <path d={PIN_PATH} fill={p.featured ? FEATURED : MUTED} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cy="-14" r="2.6" fill="#fff" />
              </g>
            </motion.g>
          )
        })}
    </motion.svg>
  )
}
