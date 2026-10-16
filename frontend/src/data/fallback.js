// Hardcoded San Diego I-15 region so the dashboard renders before (or without) the backend.
// Shape mirrors GET /api/regions. Figures are illustrative placeholders.
export const FALLBACK_REGIONS = [
  {
    id: 'sd-i15',
    name: 'San Diego – I-15 Corridor',
    highway: 'I-15',
    center: [33.0, -117.08],
    zoom: 10,
    route: [
      [32.89, -117.14],
      [32.94, -117.12],
      [32.99, -117.08],
      [33.03, -117.07],
      [33.07, -117.07],
      [33.12, -117.09],
    ],
    species: {
      scientific_name: 'Puma concolor',
      common_name: 'Mountain lion',
      habitat: 'Chaparral and coastal sage scrub',
    },
    mortality: {
      period: '2019–2023',
      total: 17,
      per_year: [
        { year: 2019, count: 2 },
        { year: 2020, count: 3 },
        { year: 2021, count: 4 },
        { year: 2022, count: 5 },
        { year: 2023, count: 3 },
      ],
      hotspots: [
        { label: 'Rancho Bernardo', count: 6 },
        { label: 'Lake Hodges', count: 5 },
        { label: 'Escondido', count: 4 },
      ],
    },
    infrastructure: {
      lanes: 8,
      avg_daily_traffic: 245000,
      barrier_type: 'Concrete median barrier',
      existing_crossings: 1,
    },
    connectivity: {
      linkage: 'Santa Ana – Palomar',
      connectivity_score: 0.42,
      habitat_patch_ha: 18500,
    },
  },
]
