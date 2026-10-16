import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet'

function Recenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  return null
}

export default function MapView({ region }) {
  return (
    <MapContainer
      center={region.center}
      zoom={region.zoom}
      scrollWheelZoom
      className="h-full w-full rounded-lg border border-blush-200"
    >
      <Recenter center={region.center} zoom={region.zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={region.route} pathOptions={{ color: '#b3402f', weight: 4 }}>
        <Tooltip sticky>{region.highway} (approximate)</Tooltip>
      </Polyline>
      <CircleMarker
        center={region.center}
        radius={7}
        pathOptions={{ color: '#7a2a1f', fillColor: '#b3402f', fillOpacity: 0.9 }}
      >
        <Tooltip>{region.name}</Tooltip>
      </CircleMarker>
    </MapContainer>
  )
}
