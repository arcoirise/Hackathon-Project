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

function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stone-200 px-4 py-3 text-xs text-stone-600">
      <LegendItem label="Obstruction zone" swatch={<span className="h-3 w-3 rounded-sm border border-brick-600 bg-brick-600/25" />} />
      <LegendItem
        label="Blocked wildlife movement"
        swatch={<span className="w-5 border-t-2 border-dashed border-brick-600" />}
      />
      <LegendItem label="Verified mortality site" swatch={<span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-brick-800 ring-1 ring-brick-800" />} />
      <LegendItem label="Elevation contours" swatch={<span className="w-5 border-t border-[#8a6d3b]" />} />
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
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          <Circle
            center={region.plateau.center}
            radius={region.plateau.radius}
            pathOptions={{ color: SAND, weight: 1.5, dashArray: '2 5', fillColor: SAND, fillOpacity: 0.12 }}
          >
            <Tooltip permanent direction="center" className="map-label">{region.plateau.label.toUpperCase()}</Tooltip>
          </Circle>

          <Polygon
            positions={region.obstruction.positions}
            pathOptions={{ color: OBSTRUCTION, weight: 1.5, dashArray: '5, 5', fillColor: OBSTRUCTION, fillOpacity: 0.15 }}
          >
            <Tooltip sticky>{region.obstruction.label}</Tooltip>
          </Polygon>

          <Polyline positions={region.route} pathOptions={{ color: HIGHWAY, weight: 5, lineCap: 'round' }}>
            <Tooltip sticky>{region.highway}</Tooltip>
          </Polyline>

          {region.movement.map((path, i) => (
            <Polyline
              key={i}
              positions={path}
              pathOptions={{ color: RED, weight: 2.5, dashArray: '8 7' }}
            />
          ))}

          <CircleMarker
            center={region.bridge.center}
            radius={6}
            pathOptions={{ color: '#fff', weight: 2, fillColor: DARK_RED, fillOpacity: 1 }}
          >
            <Tooltip direction="top" offset={[0, -6]}>{region.bridge.label}</Tooltip>
          </CircleMarker>
          {region.labels.map((l) => (
            <CircleMarker key={l.text} center={l.center} radius={0} pathOptions={{ opacity: 0, fillOpacity: 0 }}>
              <Tooltip permanent direction="center" className="map-label">{l.text.toUpperCase()}</Tooltip>
            </CircleMarker>
          ))}
          {region.mortalitySites
            .filter((s) => s.label !== region.bridge.label)
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
      <Legend />
    </div>
  )
}
