// Hardcoded San Diego I-15 region so the dashboard renders before (or without) the backend.
// Coordinates are approximate; figures are illustrative placeholders for prototyping.
export const FALLBACK_REGIONS = [
  {
    id: 'sd-i15',
    name: 'San Diego (I-15)',
    highway: 'I-15',
    segment: 'Temecula / Rainbow Canyon Segment',
    center: [33.425, -117.145],
    zoom: 12,
    route: [
      [33.57, -117.21],
      [33.53, -117.18],
      [33.49, -117.15],
      [33.465, -117.145],
      [33.43, -117.13],
      [33.39, -117.11],
    ],
    labels: [
      { text: 'Temecula', center: [33.4936, -117.1484] },
      { text: 'Rainbow', center: [33.4175, -117.1536] },
    ],
    plateau: { label: 'Santa Rosa Plateau', center: [33.52, -117.28], radius: 3800 },
    bridge: { label: 'Temecula Creek Bridge', center: [33.465, -117.145] },
    obstruction: {
      label: 'Obstruction Zone',
      positions: [
        [33.49, -117.165],
        [33.49, -117.125],
        [33.44, -117.115],
        [33.44, -117.155],
      ],
    },
    movement: [
      [[33.50, -117.27], [33.48, -117.20], [33.47, -117.15]],
      [[33.45, -117.26], [33.455, -117.20], [33.46, -117.15]],
      [[33.42, -117.25], [33.435, -117.19], [33.445, -117.15]],
    ],
    mortalitySites: [
      { label: 'Temecula Creek Bridge', center: [33.465, -117.145] },
      { label: 'Rainbow Canyon', center: [33.43, -117.13] },
    ],
    cards: [
      {
        title: 'Species of concern',
        subtext: 'Puma concolor, Santa Ana Mountains subpopulation',
        value: '3',
        unit: 'target species',
      },
      {
        title: 'I-15 barrier effect',
        subtext: '8-lane freeway, comprehensive barrier fencing',
        value: '150,000+',
        unit: 'vehicles per day',
      },
      {
        title: 'Genetic fragmentation',
        subtext: 'Complete cessation of east-west gene flow',
        value: 'High severity',
        tone: 'danger',
      },
      {
        title: 'Collision mortality',
        subtext: 'Mountain lion road deaths, statewide baseline (Source: UC Davis)',
        value: '1–2',
        unit: 'fatalities per week',
      },
      {
        title: 'Verified mortality corridor',
        subtext: 'Temecula Creek Bridge segment',
        value: '[#]',
        unit: 'verified fatalities',
      },
    ],
  },
]
