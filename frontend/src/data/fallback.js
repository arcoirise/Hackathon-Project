// Hardcoded San Diego I-15 region so the dashboard renders before (or without) the backend.
// Coordinates are approximate; figures are illustrative placeholders for prototyping.
const RAW_REGIONS = [
  {
    id: 'sd-i15',
    icon: 'lion',
    name: 'San Diego (I-15 / Temecula / Rainbow Canyon)',
    title: 'San Diego (I-15) Corridor · Temecula / Rainbow Canyon Segment',
    blurb:
      'An 8-lane freeway with barrier fencing splits the Santa Ana Mountains from the Agua Tibia and Palomar ranges.',
    species: 'Mountain lion',
    narrative:
      'Interstate 15 separates the Santa Ana Mountains from the Agua Tibia and Palomar ranges, cutting off east–west movement for mountain lions and other wildlife through the Temecula / Rainbow Canyon segment.',
    bounds: [[33.22, -117.40], [33.63, -116.90]],
    minZoom: 11,
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
    shield: '15',
    spotlight: {
      title: 'Proposed Solution: Vegetated Wildlife Overpass Bridge at Rainbow Canyon',
      before: { src: '/images/i15-rainbow-before.jpg', alt: 'Aerial view of Interstate 15 through the Rainbow Canyon corridor', caption: 'I-15 at Rainbow Canyon today: eight lanes of concrete and fencing between the Santa Ana Mountains and the Palomar / Agua Tibia ranges.' },
      after: { src: '/api/placeholder/800/500', alt: 'Concept rendering of a vegetated wildlife overpass at Rainbow Canyon', caption: 'Concept: a vegetated wildlife overpass spanning the freeway at Rainbow Canyon.' },
      left: {
        heading: 'Historic Dangers & Fragmentation',
        cards: [
            { label: 'High-speed barrier', text: '# vehicles per day on an 8-lane freeway makes crossing almost impossible.' },
            { label: 'Genetic isolation', text: 'Santa Ana mountain lion subpopulation facing near-zero gene flow.' },
            { label: 'Mortality hotspot', text: 'Multiple verified fatalities concentrated near Temecula Creek Bridge and Rainbow Canyon.' },
        ],
      },
      right: {
        heading: 'Ecological Benefits & Future State',
        cards: [
            { label: 'Estimated roadkill reduction', text: '#% predicted reduction in fatalities for mountain lions and mule deer.' },
            { label: 'Gene flow restoration', text: '#% estimated increase in genetic flow with restored connectivity.' },
            { label: 'Dedicated overpass corridor', text: 'A wide, vegetated corridor designed specifically for wildlife, measuring #ft in width.' },
            { label: 'Underpass retrofits', text: 'Proposed modifications to the existing Temecula Creek Bridge with noise barriers and native footing.' },
        ],
      },
    },
    // Hand-approximated boundaries for the three core habitat blocks. Replace with CPAD / TNC GIS
    // layers before publishing: these are for orientation only and are not survey-grade.
    habitat: [
      {
        label: 'Mountain Lion Habitat',
        reserve: 'Santa Rosa Plateau Ecological Reserve',
        positions: [[33.545, -117.29], [33.545, -117.235], [33.5, -117.215], [33.465, -117.235], [33.47, -117.29]],
      },
      {
        label: 'Tule Elk Habitat',
        reserve: 'Santa Margarita Ecological Reserve',
        positions: [[33.43, -117.2], [33.43, -117.15], [33.385, -117.14], [33.37, -117.18], [33.395, -117.215]],
      },
      {
        label: 'Mule Deer & Bobcat Range',
        reserve: 'Palomar / Agua Tibia Wilderness',
        positions: [[33.47, -117.02], [33.46, -116.94], [33.36, -116.93], [33.33, -117.0], [33.4, -117.05]],
      },
    ],
    // Santa Ana–Palomar linkage: the swath animals need to use to get from the west-side reserves
    // across I-15 into the Agua Tibia / Palomar block.
    linkage: {
      label: 'Santa Ana–Palomar linkage',
      positions: [[33.465, -117.2], [33.465, -117.05], [33.4, -117.03], [33.395, -117.19]],
    },
    obstruction: {
      label: 'Fragmentation zone',
      positions: [
        [33.49, -117.165],
        [33.49, -117.125],
        [33.44, -117.115],
        [33.44, -117.155],
      ],
    },
    mortalitySites: [
      { label: 'Temecula Creek Bridge segment', center: [33.478, -117.152] },
      { label: 'Rainbow Canyon', center: [33.435, -117.133] },
    ],
    crossings: [
      { label: 'Temecula Creek Bridge (existing undercrossing)', status: 'existing', center: [33.465, -117.145] },
      { label: 'Rainbow Canyon crossing (proposed concept)', status: 'proposed', center: [33.405, -117.1185] },
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
  {
    id: 'nb-sr37',
    icon: 'elk',
    name: 'North Bay: State Route 37 (San Pablo Baylands Corridor)',
    title: 'North Bay State Route 37 Corridor · US 101 (Novato) to I-80 (Vallejo)',
    blurb: 'A low-lying causeway across the baylands, exposed to traffic and sea-level rise.',
    species: 'Tule elk and baylands wildlife',
    narrative:
      'State Route 37 runs from US 101 in Novato to I-80 in Vallejo across Marin, Sonoma, Napa and Solano counties, cutting across the San Pablo Baylands where it blocks tidal flow and wildlife movement and is highly exposed to sea level rise.',
    center: [38.115, -122.38],
    zoom: 11,
    minZoom: 11,
    bounds: [[37.93, -122.7], [38.31, -122.06]],
    highway: 'SR-37',
    shield: '37',
    spotlight: {
      title: 'Proposed Solution: Pile-Supported Causeway Across the San Pablo Baylands',
      before: {
        src: '/api/placeholder/800/500',
        alt: 'Standard at-grade SR-37 embankment crossing the San Pablo Baylands, blocking tidal flows and vulnerable to storm surge and sea level rise',
        caption:
          'SR 37 today: an at-grade embankment across the San Pablo Baylands that blocks tidal flows and is vulnerable to storm surge and sea level rise.',
      },
      after: {
        src: '/api/placeholder/800/500',
        alt: 'Visualization of a pile-supported causeway elevating SR-37 above the marshes, with uninterrupted tidal flow and wildlife passage underneath',
        caption:
          'Concept: a pile-supported causeway elevating SR 37 above the marshes, allowing uninterrupted tidal hydrology and wildlife passage underneath.',
      },
      left: {
        heading: 'Historic Dangers & Fragmentation',
        cards: [
          { label: 'Tidal blockage', text: 'At-grade roadway embankment restricts hydrologic connectivity and sediment transport across vital tidal marshes.' },
          { label: 'Sea level rise vulnerability', text: 'Frequent flooding events (such as the 2017 and 2019 storm closures) isolate communities and paralyze North Bay transit.' },
          { label: 'Habitat fragmentation', text: 'Separates tidal wetlands and cuts off essential wildlife movement corridors for salt marsh harvest mice, tule elk, and migratory birds.' },
        ],
      },
      right: {
        heading: 'Ecological Benefits & Future State',
        cards: [
          { label: 'Pile-supported causeway', text: 'Recommended by the SR 37 Baylands Group and ESA as having significantly lower environmental impact than hybrid embankments.' },
          { label: 'Hydrologic restoration', text: 'Restores tidal flows and tributary connections (Napa River, Sonoma Creek, Petaluma River) to help marshes keep pace with sea level rise.' },
          { label: 'Climate resilience', text: 'Engineered to withstand extreme storm surges and projected sea level rise through the year 2100.' },
          { label: 'Unrestricted wildlife connectivity', text: 'Provides continuous under-span clearance for terrestrial animals, marine mammals, and restored wetland migration.' },
        ],
      },
    },
    route: [
      [38.105, -122.53],
      [38.125, -122.5],
      [38.15, -122.45],
      [38.14, -122.4],
      [38.125, -122.34],
      [38.12, -122.3],
      [38.105, -122.27],
      [38.1, -122.24],
    ],
    labels: [
      { text: 'Novato', center: [38.1, -122.565] },
      { text: 'San Pablo Baylands', center: [38.095, -122.4] },
      { text: 'Vallejo', center: [38.095, -122.23] },
    ],
    // Hand-approximated habitat blocks, labelled by species. Replace with real GIS layers
    // (e.g. State Coastal Conservancy / baylands habitat mapping) before publishing.
    habitat: [
      {
        label: 'Salt Marsh Harvest Mouse Habitat',
        positions: [[38.115, -122.5], [38.12, -122.34], [38.075, -122.33], [38.06, -122.42], [38.08, -122.5]],
      },
      {
        label: 'Tule Elk & Waterfowl Flyway',
        positions: [[38.2, -122.46], [38.195, -122.32], [38.145, -122.31], [38.155, -122.42]],
      },
    ],
    crossings: [],
    obstruction: {
      label: 'Fragmentation zone',
      positions: [
        [38.155, -122.45],
        [38.155, -122.3],
        [38.105, -122.3],
        [38.105, -122.45],
      ],
    },
    mortalitySites: [],
    cards: [
      {
        title: 'Corridor length',
        subtext: 'SR 37 from US 101 in Novato to I-80 in Vallejo, across Marin, Sonoma, Napa and Solano counties',
        value: '21',
        unit: 'mile critical link',
      },
      {
        title: 'The "Flyway Highway"',
        subtext: 'Crosses marshes and ponds supporting millions of migratory waterfowl along the Pacific Flyway',
        value: 'Millions',
        unit: 'of migratory waterfowl',
      },
      {
        title: 'Vulnerability & flood risk',
        subtext: 'Highly vulnerable to near-term flooding and permanent inundation from sea level rise',
        value: '2017 & 2019',
        unit: 'severe flood closures',
        tone: 'danger',
      },
      {
        title: 'Congestion bottleneck',
        subtext: 'Severe daily commute congestion, particularly along the 2-lane segment from Highway 121 in Sonoma County to Mare Island in Solano County',
        value: '2-lane',
        unit: 'bottleneck segment',
      },
      {
        title: 'Conservation scale',
        subtext: 'Invested across roughly 30,000 acres of restored and protected San Pablo Baylands',
        value: '$600M+',
        unit: 'invested',
      },
    ],
  },
  {
    id: 'sc-hwy17',
    icon: 'bobcat',
    name: 'Santa Cruz (Highway 17 Corridor)',
    title: 'Santa Cruz Highway 17 Corridor · Laurel Curve to Lexington Reservoir',
    blurb: 'A busy mountain route cutting through the Santa Cruz Mountains habitat linkage.',
    species: 'Mountain lion',
    narrative:
      'Highway 17 is a four-lane expressway with high concrete median barriers that bisects roughly 30,000 acres of continuous open space in the Santa Cruz Mountains, isolating pumas and other wildlife.',
    center: [37.13, -121.985],
    zoom: 12,
    minZoom: 11,
    bounds: [[36.93, -122.2], [37.33, -121.77]],
    highway: 'Hwy 17',
    shield: '17',
    spotlight: {
      title: 'Proposed Solution: Wildlife Undercrossings, Funnel Fencing and Escape Ramps on Highway 17',
      before: {
        src: '/api/placeholder/800/500',
        alt: 'High-speed four-lane Highway 17 with rigid concrete median dividers bisecting continuous open space',
        caption:
          'Highway 17 today: a high-speed four-lane expressway bisecting about 30,000 acres of continuous open space, with rigid concrete median dividers acting as impassable walls.',
      },
      after: {
        src: '/api/placeholder/800/500',
        alt: 'Visualization of wildlife undercrossings, funnel fencing and escape ramps along Highway 17',
        caption:
          'Concept: dedicated wildlife undercrossings, such as the Laurel Curve wildlife tunnel and the planned Lexington Reservoir crossing, combined with directional funnel fencing and escape ramps.',
      },
      left: {
        heading: 'Historic Dangers & Fragmentation',
        cards: [
          { label: 'Impassable median', text: 'Rigid concrete median dividers act as walls across a four-lane, high-speed expressway.' },
          { label: 'Fatal collision hotspot', text: 'Before mitigation, 50% of all Highway 17 wildlife collisions occurred at Laurel Curve; over 100 animals were struck near Lexington Reservoir over a multi-year baseline.' },
          { label: 'Genetic fragmentation', text: 'Highway 17 severely isolates Santa Cruz Mountain pumas, reducing gene flow and raising the risk of inbreeding depression.' },
        ],
      },
      right: {
        heading: 'Ecological Benefits & Future State',
        cards: [
          { label: 'Dedicated undercrossings', text: 'The Laurel Curve wildlife tunnel and the planned Lexington Reservoir crossing give animals a safe way under the highway.' },
          { label: 'Directional funnel fencing', text: 'Fencing along the highway funnels animals toward the crossing structures.' },
          { label: 'Escape ramps', text: 'Ramps let animals that get onto the roadway get back out.' },
          { label: 'Regional habitat connectivity', text: 'Restores movement across about 30,000 acres of continuous open space on both sides of the highway.' },
        ],
      },
    },
    route: [
      [37.23, -121.97],
      [37.19, -121.98],
      [37.15, -121.98],
      [37.11, -121.99],
      [37.07, -122.0],
      [37.04, -122.01],
    ],
    labels: [
      { text: 'Lexington Reservoir', center: [37.2, -122.005] },
      { text: 'Laurel Curve', center: [37.108, -122.01] },
      { text: 'Scotts Valley', center: [37.051, -122.015] },
    ],
    habitat: [],
    // Approximate positions for the two named bottlenecks; refine with surveyed post-mile locations.
    crossings: [
      { label: 'Laurel Curve wildlife tunnel (existing undercrossing)', status: 'existing', center: [37.1, -121.995] },
      { label: 'Lexington Reservoir crossing (planned)', status: 'proposed', center: [37.205, -121.977] },
    ],
    obstruction: {
      label: 'Fragmentation zone',
      positions: [
        [37.21, -122.0],
        [37.21, -121.96],
        [37.09, -121.97],
        [37.09, -122.01],
      ],
    },
    mortalitySites: [
      { label: 'Laurel Curve (Post Mile 8.0)', center: [37.123, -121.986] },
      { label: 'Lexington Reservoir (Post Miles 4.1–5.8)', center: [37.18, -121.985] },
    ],
    cards: [
      {
        title: 'Primary bottlenecks',
        subtext: 'Laurel Curve (Post Mile 8.0) and Lexington Reservoir (Post Miles 4.1 to 5.8)',
        value: '2',
        unit: 'bottleneck sites',
      },
      {
        title: 'Traffic impact',
        subtext: 'Over 60,000 to 65,000 vehicles per day through 4 lanes with high concrete median barriers',
        value: '60–65K',
        unit: 'vehicles per day',
      },
      {
        title: 'Mortality hotspot',
        subtext: 'Share of all Highway 17 wildlife collisions that occurred at Laurel Curve before mitigation',
        value: '50%',
        unit: 'at Laurel Curve',
        tone: 'danger',
      },
      {
        title: 'Genetic fragmentation',
        subtext: 'Highway 17 severely isolates Santa Cruz Mountain pumas, reducing gene flow',
        value: 'High severity',
        tone: 'danger',
      },
    ],
  },
]

// Expandable card content. Research summaries are deliberately qualitative: add exact figures and
// full citations (paper, year, page) before this goes in front of anyone outside the team.
const PENDING = {
  findings: ['Detailed research findings for this corridor are pending.'],
  engineering: ['Engineering impact notes to be added.'],
  sources: ['To be added'],
}

const DETAILS = {
  'sc-hwy17': {
    'Primary bottlenecks': {
      findings: [
        'Laurel Curve (Post Mile 8.0) and Lexington Reservoir (Post Miles 4.1 to 5.8) are the two primary bottlenecks on the corridor.',
      ],
      engineering: ['Crossing structures are concentrated at these two sites, where animals are already funnelled toward the highway.'],
      sources: ['UC Santa Cruz Puma Project', 'Midpen (Midpeninsula Regional Open Space District)', 'Land Trust of Santa Cruz County'],
    },
    'Traffic impact': {
      findings: [
        'Over 60,000 to 65,000 vehicles per day pass through four lanes.',
        'High concrete median barriers add a second obstacle for any animal that does reach the road.',
      ],
      engineering: ['Escape ramps matter on a barrier-divided road: an animal trapped between the median and the shoulder has no way out.'],
      sources: ['UC Santa Cruz Puma Project', 'Midpen (Midpeninsula Regional Open Space District)', 'Land Trust of Santa Cruz County'],
    },
    'Mortality hotspot': {
      findings: [
        'Historical camera and roadkill data showed 50% of all Highway 17 wildlife collisions occurred at Laurel Curve before mitigation.',
        'Over 100 animals, including deer, bobcats, coyotes and pumas, were struck near Lexington Reservoir over a multi-year baseline.',
      ],
      engineering: ['Mitigation at Laurel Curve pairs the wildlife tunnel with fencing, so animals are directed to it rather than the road.'],
      sources: ['UC Santa Cruz Puma Project', 'Midpen (Midpeninsula Regional Open Space District)', 'Land Trust of Santa Cruz County'],
    },
    'Genetic fragmentation': {
      findings: [
        'UC Santa Cruz Puma Project research confirms Highway 17 severely isolates Santa Cruz Mountain pumas.',
        'Reduced gene flow raises the risk of inbreeding depression.',
      ],
      engineering: ['The aim is functional connectivity: enough successful crossings that pumas on both sides can breed with each other.'],
      sources: ['UC Santa Cruz Puma Project', 'Midpen (Midpeninsula Regional Open Space District)', 'Land Trust of Santa Cruz County'],
    },
  },
  'nb-sr37': {
    'Corridor length': {
      findings: [
        'SR 37 is a 21-mile critical link along the San Pablo Baylands, running from US 101 in Novato to I-80 in Vallejo.',
        'It passes through four counties: Marin, Sonoma, Napa and Solano.',
      ],
      engineering: ['Any fix has to be planned and funded across four counties and several agencies, not one jurisdiction.'],
      sources: ['Environmental Science Associates (ESA)', 'State Coastal Conservancy (SCC)'],
    },
    'The "Flyway Highway"': {
      findings: [
        'The route crosses marshes and ponds that support millions of migratory waterfowl along the Pacific Flyway.',
      ],
      engineering: ['Work in and over the marshes needs to protect waterfowl habitat during construction and operation.'],
      sources: ['Environmental Science Associates (ESA)', 'State Coastal Conservancy (SCC)'],
    },
    'Vulnerability & flood risk': {
      findings: [
        'The highway is highly vulnerable to near-term flooding and to permanent inundation from sea level rise.',
        'Severe flood closures in 2017 and 2019 isolated communities and disrupted North Bay transit.',
      ],
      engineering: ['The recommended design is engineered to withstand extreme storm surges and projected sea level rise through the year 2100.'],
      sources: ['Environmental Science Associates (ESA)', 'SR 37 Baylands Group'],
    },
    'Congestion bottleneck': {
      findings: [
        'Commute congestion is severe every day, particularly along the 2-lane segment from Highway 121 in Sonoma County to Mare Island in Solano County.',
      ],
      engineering: ['Elevating the road is an opportunity to resolve the 2-lane bottleneck at the same time as flood and habitat problems.'],
      sources: ['SR 37 Baylands Group', 'State Coastal Conservancy (SCC)'],
    },
    'Conservation scale': {
      findings: [
        'More than $600 million has been invested across roughly 30,000 acres of restored and protected San Pablo Baylands.',
        'The highway cuts through this restored land, so the design choice affects that investment.',
      ],
      engineering: ['A pile-supported causeway restores tidal flows and tributary connections so marshes can keep pace with sea level rise.'],
      sources: ['State Coastal Conservancy (SCC)', 'Environmental Science Associates (ESA)'],
    },
  },
  'sd-i15': {
    'Species of concern': {
      findings: [
        'Mountain lions in the Santa Ana Mountains are an isolated subpopulation, largely cut off from lions in the ranges to the east.',
        'The southern California / Central Coast mountain lion population was advanced as a candidate for state listing under the California Endangered Species Act in 2020.',
        'The other two target species in the set of three: [to be confirmed by the project team].',
      ],
      engineering: [
        'Crossings should be sized and sited for lions first: wide, open, quiet spans with natural cover at both approaches.',
      ],
      sources: [
        'UC Davis Wildlife Health Center, southern California mountain lion research',
        'South Coast Missing Linkages: Santa Ana–Palomar Linkage',
      ],
    },
    'I-15 barrier effect': {
      findings: [
        'Eight lanes with continuous barrier fencing leave very few passable gaps; most animals have to use drainage culverts or bridge undercrossings.',
        'Traffic volume (150,000+ vehicles per day) makes at-grade crossing close to impassable for large carnivores.',
      ],
      engineering: [
        'Retrofit candidates: widen creek-bridge spans, add fencing that funnels animals toward crossings, and fit escape ramps where the median barrier traps animals.',
        'Any structure work must coordinate with drainage and flood capacity under the freeway.',
      ],
      sources: ['Caltrans Traffic Census', 'UC Davis Road Ecology Center'],
    },
    'Genetic fragmentation': {
      findings: [
        'Genetic studies of Santa Ana Mountains lions report low diversity and little or no recent immigration across I-15 and the surrounding urban lowlands.',
        'Small isolated populations lose diversity over time and are more exposed to inbreeding.',
      ],
      engineering: [
        'The design target is functional connectivity, not just a physical crossing: even a small number of successful migrants per generation can slow inbreeding.',
      ],
      sources: [
        'UC Davis Wildlife Health Center, southern California mountain lion research',
        'The Nature Conservancy, California connectivity work',
      ],
    },
    'Collision mortality': {
      findings: [
        'UC Davis Road Ecology Center tracks wildlife–vehicle collisions through the California Roadkill Observation System (CROS).',
        'The 1–2 per week figure is a statewide baseline, not a count for this segment.',
      ],
      engineering: [
        'Fencing and crossing structures work together. Fencing alone just moves where animals try to cross.',
        'Fence ends and gaps are where collisions cluster, so treat them as design elements.',
      ],
      sources: ['UC Davis Road Ecology Center, California Roadkill Observation System'],
    },
    'Verified mortality corridor': {
      findings: [
        'Verified count for the Temecula Creek Bridge segment: [#], pending confirmed records.',
        'Verified means a located, confirmed record from agency or CROS data, not an unconfirmed report.',
      ],
      engineering: [
        'Confirmed mortality sites guide where crossings and fence-end treatments should go.',
      ],
      sources: ['UC Davis Road Ecology Center, CROS', 'Caltrans / CDFW records (to be confirmed)'],
    },
  },
}

export const FALLBACK_REGIONS = RAW_REGIONS.map((r) => ({
  ...r,
  cards: r.cards.map((c) => ({ details: DETAILS[r.id]?.[c.title] ?? PENDING, ...c })),
}))
