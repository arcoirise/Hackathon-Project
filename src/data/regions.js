// Illustrative sample data for the prototype — replace with real survey / roadkill datasets.
export const REGIONS = [
  {
    id: 'sd-i15',
    name: 'San Diego I-15',
    center: [33.02, -117.1],
    zoom: 10,
    // Approximate I-15 alignment, San Diego -> Temecula
    highway: [
      [32.72, -117.1],
      [32.83, -117.12],
      [32.95, -117.1],
      [33.05, -117.08],
      [33.2, -117.12],
      [33.35, -117.17],
      [33.49, -117.15],
    ],
    diagnostics: {
      species: 'Puma concolor',
      commonName: 'Mountain lion',
      status: 'Sample data',
      mortality: {
        total: 12,
        period: '2015–2024',
        perYear: [
          { year: 2020, count: 1 },
          { year: 2021, count: 3 },
          { year: 2022, count: 2 },
          { year: 2023, count: 4 },
          { year: 2024, count: 2 },
        ],
        hotspots: [
          { label: 'Escondido segment', count: 5 },
          { label: 'Rainbow / Temecula Gorge', count: 4 },
          { label: 'Miramar corridor', count: 3 },
        ],
      },
      notes: 'I-15 bisects habitat linking the Santa Ana and Palomar–Cuyamaca ranges.',
    },
  },
]
