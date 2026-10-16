// Talks to the Flask backend (wildbridge/app.py). In development, Vite proxies /api to port 5000.
import { useEffect, useState } from 'react'

async function getJson(url, options) {
  const response = await fetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || `${url} failed (${response.status})`)
  return data
}

// Reshape a backend region into what the dashboard components already read:
// `highway` is the map polyline (the backend calls it `road`), and `diagnostics` feeds DiagnosticsCard.
export function toDashboardRegion(region) {
  const primary = region.species[0]
  const mortality = region.mortality
  return {
    ...region,
    highway: region.road,
    highwayName: region.highway,
    diagnostics: {
      species: primary.scientific_name,
      commonName: primary.name,
      status: 'Illustrative data',
      // No roadkill numbers until the backend has a real, cited source.
      mortality: mortality
        ? { ...mortality, perYear: mortality.per_year }
        : { total: 'No data yet', period: '—', perYear: [], hotspots: [] },
      notes: `${region.highway} crosses ${region.habitats.length} illustrative habitat zones: ${region.habitats.map((h) => h.name).join(', ')}.`,
    },
  }
}

export async function fetchRegions() {
  const data = await getJson('/api/regions')
  return data.regions.map(toDashboardRegion)
}

// Returns { region, sensitivity, crossings, data_notes, demo }. sensitivity is 1, 2 or 3.
export function analyze(region, sensitivity = 2) {
  return getJson('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ region, sensitivity }),
  })
}

export function useRegions() {
  const [state, setState] = useState({ regions: [], loading: true, error: null })
  useEffect(() => {
    let cancelled = false
    fetchRegions()
      .then((regions) => !cancelled && setState({ regions, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ regions: [], loading: false, error }))
    return () => {
      cancelled = true
    }
  }, [])
  return state
}
