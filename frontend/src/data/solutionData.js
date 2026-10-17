// Detail sheets for the generated solutions, keyed by solution id (US-101 North Coast).
export const SOLUTION_DETAILS = {
  'overpass-fencing': {
    category: 'Technical Specification Sheet 03-A',
    title: 'US-101 Dedicated Wildlife Overpass (PM 114–115.5)',
    visuals: {
      blueprint: {
        src: '/overpass-blueprint.png',
        alt: 'Engineering cross-section of the vegetated wildlife overpass',
        caption: 'Civil Engineering Elevation & Soil/Foliage Specification Schematic.',
      },
      render: {
        src: '/overpass-render.png',
        alt: 'Conceptual render of the overpass with Roosevelt elk crossing',
        caption: 'Post-Implementation Visual: Roosevelt Elk Crossing Zone (US-101 View).',
      },
    },
    columns: [
      {
        heading: 'Engineering Specs',
        items: [
          ['Span', '180 ft vegetated arch'],
          ['Clearance', '24 ft over travel lanes'],
          ['Landscaping', '4 ft native soil and flora overlay'],
          ['Fencing', '10 ft continuous mesh funnel fencing'],
        ],
      },
      {
        heading: 'Detailed Impact Analysis',
        paragraphs: [
          'Collision reduction: a 100% reduction in animal-vehicle collisions is projected within the fenced zone, including nocturnal and dusk/dawn periods when visibility is lowest.',
          'Genetic connectivity: restores movement vectors for puma and Roosevelt elk between the coastal lagoon wetlands and inland redwood habitat.',
          'Driver behavior: studies of comparable structures show fewer sudden braking events and swerving incidents once wildlife is routed away from the roadway.',
        ],
      },
      {
        heading: 'Tribal & Multi-Agency Co-Management',
        paragraphs: [
          'Yurok Tribe: government-to-government consultation on siting, cultural resource protection, and native plant selection for the overlay.',
          'Caltrans: aligns with the Wildlife Connectivity priorities for the North Coast and the district capital program.',
          'Environmental review: CEQA and NEPA frameworks govern the impact studies, coastal wetland permitting, and public comment.',
        ],
      },
    ],
  },
  'tribal-prairie': {
    category: 'Technical Specification Sheet 03-B',
    title: 'Yurok Tribal Prairie Co-Management & Forage Restoration',
    visuals: {
      render: {
        src: '/yurok-prairie-burn.png',
        alt: 'Managed prairie burn mosaic east of US-101',
        caption: 'Managed Prairie Mosaic: Cultural Burn and Native Forage Restoration East of US-101.',
      },
    },
    columns: [
      {
        heading: 'Technical Specs',
        items: [
          ['Burn Cycle', '3-5 years managed mosaic'],
          ['Native Species', 'Purple needlegrass restoration'],
          ['Target Grazing', '150 Roosevelt Elk herd'],
        ],
      },
      {
        heading: 'Detailed Impact Analysis',
        paragraphs: [
          'Native forage restoration creates a high-protein alternative to roadside grass, enticing herds away from the asphalt and into safe meadow zones.',
          'Cultural co-management aligns with Save the Redwoods League conservation goals.',
        ],
      },
    ],
  },
  'culvert-retrofit': {
    category: 'Technical Specification Sheet 03-C',
    title: 'Coastal Wetland Culvert Expansion & Underpass Retrofitting',
    visuals: {
      render: {
        src: '/culvert-bench-retrofit.png',
        alt: 'Retrofitted box culvert with an elevated wildlife bench',
        caption: 'Retrofitted Box Culvert with Elevated Wildlife Bench and Drift Fencing.',
      },
    },
    columns: [
      {
        heading: 'Technical Specs',
        items: [
          ['Box Culvert Span', '20 ft wide'],
          ['Clearance', '12 ft'],
          ['Wildlife Bench', 'Elevated natural dirt/gravel bench'],
          ['Fencing', '8 ft mesh drift funneling'],
        ],
      },
      {
        heading: 'Detailed Impact Analysis',
        paragraphs: [
          'Enables elk cows, calves, and smaller wildlife to safely navigate beneath highway bridges along natural watercourses without constructing full-scale overpasses.',
        ],
      },
    ],
  },
  'smart-radar': {
    category: 'Technical Specification Sheet 03-D',
    subcategory: 'Intelligent Transport System | Dynamic Warning',
    title: 'Smart Radar Detection & Real-Time Driver Speed Management',
    visuals: {
      render: {
        src: '/smart-radar-night-VMS.png',
        alt: 'Variable message sign warning of elk at night on US-101',
        caption: 'Night-Time Variable Message Sign Activated by Radar Detection.',
      },
    },
    columns: [
      {
        heading: 'Technical Specs',
        items: [
          ['Sensors', 'Thermal imaging + 77GHz radar'],
          ['Signage', 'PM 112 & 116 VMS boards'],
          ['Speed Limit', '65 MPH reduced to 45 MPH during active crossings'],
        ],
      },
      {
        heading: 'Detailed Impact Analysis',
        paragraphs: [
          'Eliminates warning fatigue by activating signage only when animals are physically detected near the right-of-way.',
        ],
      },
    ],
  },
  'gps-tracking': {
    category: 'Technical Specification Sheet 03-E',
    subcategory: 'Data & Mobile Integration | Commuter Alert',
    title: 'Multi-Agency GPS Herd Tracking & Dynamic Hotspot Alerts',
    visuals: {
      render: {
        src: '/gps-telemetry-interface.png',
        alt: 'GPS telemetry interface showing herd positions and alert buffer',
        caption: 'Herd Telemetry Interface with Dynamic Hotspot Alert Buffer.',
      },
    },
    columns: [
      {
        heading: 'Technical Specs',
        items: [
          ['Telemetry', 'Real-time GPS collar telemetry API'],
          ['Integrations', 'Apple Maps, Waze, Caltrans QuickMap'],
          ['Alert Buffer', '5-mile dynamic buffer alerts'],
        ],
      },
      {
        heading: 'Detailed Impact Analysis',
        paragraphs: [
          'Pre-route situational awareness for commuters and park visitors before entering high-density migration bottlenecks.',
        ],
      },
    ],
  },
}
