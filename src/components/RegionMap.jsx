import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from 'react-leaflet'

export default function RegionMap({ region }) {
  return (
    <MapContainer
      key={region.id}
      center={region.center}
      zoom={region.zoom}
      scrollWheelZoom
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={region.highway} pathOptions={{ color: '#b91c1c', weight: 4 }}>
        <Tooltip sticky>I-15 (approximate)</Tooltip>
      </Polyline>
      <CircleMarker
        center={region.center}
        radius={7}
        pathOptions={{ color: '#065f46', fillColor: '#10b981', fillOpacity: 0.9 }}
      >
        <Tooltip>{region.name} — region center</Tooltip>
      </CircleMarker>
    </MapContainer>
  )
}
