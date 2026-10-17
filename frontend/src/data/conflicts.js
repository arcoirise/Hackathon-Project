import { FALLBACK_REGIONS } from './fallback.js'

// The four macro regions on the California map selector.
export const CA_REGIONS = [
  { id: 'northern', name: 'Northern California', color: '#9C9078', soft: '#e3efe9' },
  { id: 'bay', name: 'Greater Bay Area', color: '#8E3A2B', soft: '#f8e4de' },
  { id: 'central', name: 'Central California', color: '#B5834F', soft: '#f8edd2' },
  { id: 'southern', name: 'Southern California', color: '#A8705C', soft: '#e1e8f3' },
]

// One entry per active conflict pin. Everything the sidebar, loading overlay and solution view
// need hangs off this object; before/after imagery and the stat grid come from the matching
// dashboard region (`dashboardId`) so the two views can't drift apart.
const PINS = [
  {
    id: 'i15-temecula',
    regionId: 'southern',
    dashboardId: 'sd-i15',
    title: 'I-15 Temecula Bottleneck',
    place: 'Temecula / Rainbow Canyon, Riverside County',
    coords: [33.465, -117.145],
    traffic: '150,000+ vehicles per day, 8 lanes',
    species: [
      { name: 'Mountain lion', icon: 'lion' },
      { name: 'Bobcat', icon: 'bobcat' },
    ],
    metrics: [
      { label: 'Traffic volume', value: '150,000+', unit: 'vehicles / day' },
      { label: 'Vehicle mortality', value: '[#]', unit: 'verified fatalities' },
      { label: 'Genetic isolation', value: 'High severity', tone: 'danger' },
    ],
  },
  {
    id: 'sr37-baylands',
    regionId: 'bay',
    dashboardId: 'nb-sr37',
    title: 'SR-37 Baylands',
    place: 'San Pablo Baylands, Marin to Solano County',
    coords: [38.13, -122.4],
    traffic: 'Severe daily commute congestion, 2-lane bottleneck',
    species: [{ name: 'Tule elk', icon: 'elk' }],
    metrics: [
      { label: 'Corridor length', value: '21', unit: 'miles' },
      { label: 'Flood closures', value: '2017 & 2019', tone: 'danger' },
      { label: 'Habitat fragmentation', value: 'Tidal flow and wildlife cut off', tone: 'danger' },
    ],
  },
  {
    id: 'hwy17-laurel',
    regionId: 'bay',
    dashboardId: 'sc-hwy17',
    title: 'HWY-17 Laurel Curve',
    place: 'Santa Cruz Mountains, Santa Clara / Santa Cruz County',
    coords: [37.1, -121.99],
    traffic: '60,000–65,000 vehicles per day, 4 lanes',
    species: [
      { name: 'Mountain lion', icon: 'lion' },
      { name: 'Bobcat', icon: 'bobcat' },
    ],
    metrics: [
      { label: 'Traffic volume', value: '60–65K', unit: 'vehicles / day' },
      { label: 'Collision hotspot', value: '50%', unit: 'at Laurel Curve', tone: 'danger' },
      { label: 'Genetic isolation', value: 'High severity', tone: 'danger' },
    ],
  },
]

export const CONFLICTS = PINS.map((pin) => {
  const region = FALLBACK_REGIONS.find((r) => r.id === pin.dashboardId)
  return {
    ...pin,
    beforeImage: region.spotlight.before.src,
    afterImage: region.spotlight.after.src,
    solution: region.spotlight,
  }
})
