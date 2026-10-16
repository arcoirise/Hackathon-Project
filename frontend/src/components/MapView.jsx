import { useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Polyline,
  Polygon,
  Circle,
  CircleMarker,
  Tooltip,
  ZoomControl,
  useMap,
} from 'react-leaflet'

const RED = '#b3402f'
const OBSTRUCTION = '#A53838'
const DARK_RED = '#7a2a1f'
const HIGHWAY = '#1A1A1A'
const SAND = '#8a6d3b'
const PROPOSED = '#2f6b4f'

function Recenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  return null
}

function LegendItem({ swatch, label }) {
  return (
    <li className="flex items-center gap-2">
      {swatch}
      <span>{label}</span>
    </li>
  )
}

// Only list what this region actually draws. Backend-generated regions (SR-152, SR-37) mark their
// circle as kind "habitat" and their marker as kind "proposed"; I-15's hand-drawn overlays have no kind.
function Legend({ region }) {
  const proposed = region.bridge?.kind === 'proposed'
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stone-200 px-4 py-3 text-xs text-stone-600">
      {region.obstruction && (
        <LegendItem label="Obstruction zone" swatch={<span className="h-3 w-3 rounded-sm border border-brick-600 bg-brick-600/25" />} />
      )}
      {region.movement?.length > 0 && (
        <LegendItem
          label="Blocked wildlife movement"
          swatch={<span className="w-5 border-t-2 border-dashed border-brick-600" />}
        />
      )}
      {(region.mortalitySites?.length > 0 || (region.bridge && !proposed)) && (
        <LegendItem label="Verified mortality site" swatch={<span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-brick-800 ring-1 ring-brick-800" />} />
      )}
      {proposed && (
        <LegendItem label="Proposed crossing concept" swatch={<span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-[#2f6b4f] ring-1 ring-[#2f6b4f]" />} />
      )}
      {region.plateau && (
        <LegendItem
          label={region.plateau.kind === 'habitat' ? 'Habitat zone (illustrative)' : 'Elevation contours'}
          swatch={<span className="w-5 border-t border-[#8a6d3b]" />}
        />
      )}
    </ul>
  )
}

export default function MapView({ region }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="min-h-0 flex-1">
        <MapContainer
          center={region.center}
          zoom={region.zoom}
          zoomControl={false}
          scrollWheelZoom
          className="h-full w-full"
        >
          <Recenter center={region.center} zoom={region.zoom} />
          <ZoomControl position="topright" />
          <TileLayer
            className="soft-tiles"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* Overlays are optional: a region without one simply doesn't draw it, instead of crashing the page. */}
          {region.plateau && (
            <Circle
              center={region.plateau.center}
              radius={region.plateau.radius}
              pathOptions={{ color: SAND, weight: 1.5, dashArray: '2 5', fillColor: SAND, fillOpacity: 0.12 }}
            >
              <Tooltip permanent direction="center" className="map-label">{region.plateau.label.toUpperCase()}</Tooltip>
            </Circle>
          )}

          {region.obstruction && (
            <Polygon
              positions={region.obstruction.positions}
              pathOptions={{ color: OBSTRUCTION, weight: 1.5, dashArray: '5, 5', fillColor: OBSTRUCTION, fillOpacity: 0.15 }}
            >
              <Tooltip sticky>{region.obstruction.label}</Tooltip>
            </Polygon>
          )}

          {region.route && (
            <Polyline positions={region.route} pathOptions={{ color: HIGHWAY, weight: 5, lineCap: 'round' }}>
              <Tooltip sticky>{region.highway}</Tooltip>
            </Polyline>
          )}

          {(region.movement ?? []).map((path, i) => (
            <Polyline
              key={i}
              positions={path}
              pathOptions={{ color: RED, weight: 2.5, dashArray: '8 7' }}
            />
          ))}

          {region.bridge && (
            <CircleMarker
              center={region.bridge.center}
              radius={6}
              pathOptions={{ color: '#fff', weight: 2, fillColor: region.bridge.kind === 'proposed' ? PROPOSED : DARK_RED, fillOpacity: 1 }}
            >
              <Tooltip direction="top" offset={[0, -6]}>{region.bridge.label}</Tooltip>
            </CircleMarker>
          )}
          {(region.labels ?? []).map((l) => (
            <CircleMarker key={l.text} center={l.center} radius={0} pathOptions={{ opacity: 0, fillOpacity: 0 }}>
              <Tooltip permanent direction="center" className="map-label">{l.text.toUpperCase()}</Tooltip>
            </CircleMarker>
          ))}
          {(region.mortalitySites ?? [])
            .filter((s) => s.label !== region.bridge?.label)
            .map((s) => (
              <CircleMarker
                key={s.label}
                center={s.center}
                radius={5}
                pathOptions={{ color: '#fff', weight: 2, fillColor: DARK_RED, fillOpacity: 1 }}
              >
                <Tooltip>{s.label}</Tooltip>
              </CircleMarker>
            ))}
        </MapContainer>
      </div>
      <Legend region={region} />
    </div>
  )
}
