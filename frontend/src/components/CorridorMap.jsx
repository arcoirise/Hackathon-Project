import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Circle, CircleMarker, Tooltip, ZoomControl, useMap } from 'react-leaflet'

const HIGHWAY = '#1A1A1A'
const SAND = '#8a6d3b'
const PROPOSED = '#2f6b4f'

// Pans to the selected crossing.
function FlyTo({ target }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 13), { duration: 0.6 })
  }, [map, target])
  return null
}

// Map for the backend's study corridor: OSM-traced road, illustrative habitat zones and,
// optionally, the proposed crossing locations from /crossings.
export default function CorridorMap({ corridor, crossings = [], selectedId, onSelect }) {
  const selected = crossings.find((c) => c.id === selectedId)
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="min-h-0 flex-1">
        <MapContainer
          key={corridor.id}
          center={corridor.center}
          zoom={corridor.zoom}
          zoomControl={false}
          scrollWheelZoom
          className="h-full w-full"
        >
          <ZoomControl position="topright" />
          <TileLayer
            className="soft-tiles"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          {corridor.habitats.map((h) => (
            <Circle
              key={h.id}
              center={h.center}
              radius={h.radius_m}
              pathOptions={{ color: SAND, weight: 1.5, dashArray: '2 5', fillColor: SAND, fillOpacity: 0.12 }}
            >
              <Tooltip permanent direction="center" className="map-label">{h.name.toUpperCase()}</Tooltip>
            </Circle>
          ))}
          <Polyline positions={corridor.road} pathOptions={{ color: HIGHWAY, weight: 5, lineCap: 'round' }}>
            <Tooltip sticky>{corridor.highway} (approximate)</Tooltip>
          </Polyline>
          {crossings.map((c) => (
            <CircleMarker
              key={c.id}
              center={c.location}
              radius={c.id === selectedId ? 10 : 7}
              pathOptions={{ color: '#fff', weight: 2, fillColor: PROPOSED, fillOpacity: 1 }}
              eventHandlers={{ click: () => onSelect?.(c.id) }}
            >
              <Tooltip direction="top" offset={[0, -8]}>{c.title}</Tooltip>
            </CircleMarker>
          ))}
          <FlyTo target={selected?.location} />
        </MapContainer>
      </div>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stone-200 px-4 py-3 text-xs text-stone-600">
        <li className="flex items-center gap-2"><span className="w-5 border-t-[3px] border-[#1A1A1A]" />{corridor.highway} (approximate, OpenStreetMap)</li>
        <li className="flex items-center gap-2"><span className="w-5 border-t border-dashed border-[#8a6d3b]" />Habitat zone (illustrative)</li>
        {crossings.length > 0 && (
          <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#2f6b4f] ring-1 ring-[#2f6b4f]" />Proposed crossing concept</li>
        )}
      </ul>
    </div>
  )
}
