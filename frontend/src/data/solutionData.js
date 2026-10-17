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

// Southern California generated solutions: one entry builds both the modal sheet and the Section 03 card.
const socal = (corridor, id, sheet, category, title, src, specs, impact) => ({
  corridor,
  id,
  detail: {
    category: `Technical Specification Sheet 03-${sheet}`,
    subcategory: category.replace(/\b(\w)(\w*)/g, (_, a, b) => a + b.toLowerCase()).replace(/ \| /g, ' | '),
    title,
    compactImages: true,
    visuals: { render: { src, alt: `Conceptual render: ${title}`, caption: `Conceptual Render: ${title}.` } },
    columns: [
      { heading: 'Technical Specs', items: specs },
      { heading: 'Detailed Impact Analysis', paragraphs: [impact] },
    ],
  },
  card: {
    id,
    category: category.replace(/\b(\w)(\w*)/g, (_, a, b) => a + b.toLowerCase()),
    title,
    overview: specs.map(([k, v]) => `${k}: ${v}.`).join(' '),
    impact,
  },
})

const SOCAL = [
 [
  "us101-agoura-hills",
  "agoura-rd-span",
  "A",
  "CAPITAL INFRASTRUCTURE | AGOURA RD EXTENSION",
  "Agoura Road Secondary Span & Habitat Linkage Extension",
  "/agoura-span-render.png",
  [
   [
    "Structure",
    "71 ft x 175 ft secondary bridge over Agoura Road"
   ],
   [
    "Noise Control",
    "Integrated acoustic noise barrier walls"
   ],
   [
    "Restoration",
    "13 acres of native chaparral and oak savanna"
   ]
  ],
  "Provides continuous ungulate and carnivore movement beyond the primary 10-lane US-101 span into Santa Monica Mountains footpaths."
 ],
 [
  "us101-agoura-hills",
  "mycorrhizal-soil",
  "B",
  "HABITAT MANAGEMENT | NATIVE RE-VEGETATION",
  "Microclimate Seed Bank & Mycorrhizal Soil Restoration",
  "/soil-revegetation-render.png",
  [
   [
    "Soil",
    "Deep 18-inch topsoil layer inoculated with native mycorrhizal fungi"
   ],
   [
    "Seed Bank",
    "Local acorn seed bank collection"
   ],
   [
    "Cover",
    "100% native coast live oak and coastal sage"
   ]
  ],
  "Establishes self-sustaining native flora canopy on the bridge deck, mimicking surrounding wildlands to entice cautious mountain lions and coyotes across."
 ],
 [
  "us101-agoura-hills",
  "acoustic-shielding",
  "C",
  "INTELLIGENT TRANSPORT SYSTEM | NOISE & LIGHT SHIELDING",
  "Multi-Band Acoustic & Light Attenuation Sound Barrier System",
  "/sound-barrier-render.png",
  [
   [
    "Walls",
    "12-foot sound-dampening perimeter walls"
   ],
   [
    "Lighting",
    "Zero-lux directional light deflectors"
   ],
   [
    "Noise",
    "Deck noise attenuation reducing ambient freeway roar below 45 dB"
   ]
  ],
  "Eliminates headlight glare spikes and high-decibel traffic shock, encouraging nocturnal crossing attempts by shy apex predators."
 ],
 [
  "i15-temecula",
  "rainbow-overpass",
  "A",
  "CAPITAL INFRASTRUCTURE | VEGETATED OVERPASS",
  "Rainbow Canyon Vegetated Wildlife Overcrossing Bridge",
  "/rainbow-overpass-render.png",
  [
   [
    "Structure",
    "200-foot wide vegetated arch bridge spanning 8 lanes of I-15 at PM 2.1"
   ],
   [
    "Substrate",
    "Native chaparral soil"
   ],
   [
    "Fencing",
    "10-foot lateral exclusion fencing"
   ]
  ],
  "Restores the primary east-west genetic linkage connecting Santa Ana Mountain pumas directly to the Palomar Mountain Range and Agua Tibia Wilderness."
 ],
 [
  "i15-temecula",
  "temecula-culvert",
  "B",
  "DRAINAGE CONNECTIVITY | CULVERT RETROFIT",
  "Temecula Creek Bridge Dry-Bench & Box Culvert Retrofit",
  "/temecula-underpass-render.png",
  [
   [
    "Bench",
    "Elevated 10-foot dirt/gravel bench above the high-water stream line beneath the Temecula Creek bridge"
   ],
   [
    "Culverts",
    "Dual 12x12 ft pre-cast concrete box culverts"
   ]
  ],
  "Enables year-round safe passage for mule deer, bobcats, and pumas under I-15 even during heavy seasonal storm run-off events."
 ],
 [
  "i15-temecula",
  "jumpout-fencing",
  "C",
  "DIRECTIONAL GUIDANCE | EXCLUSION FENCING",
  "High-Tension Jump-Out Exclusion Fencing & Funnel System",
  "/jumpout-fencing-render.png",
  [
   [
    "Fencing",
    "10-foot woven wire mesh exclusion fencing across 6.66 miles of I-15 right-of-way"
   ],
   [
    "Escape Ramps",
    "8 earthen one-way jump-out ramps"
   ]
  ],
  "Completely prevents animals from stepping onto high-speed lanes while allowing any animals trapped inside the right-of-way to safely jump out."
 ],
 [
  "sr71-chino-hills",
  "prado-box-culvert",
  "A",
  "CAPITAL INFRASTRUCTURE | LARGE BOX CULVERT",
  "Prado Wetlands Large-Format Box Culvert Underpass",
  "/prado-culvert-render.png",
  [
   [
    "Culverts",
    "Dual 18-foot wide x 12-foot high concrete box culverts beneath SR-71 near Butterfield Ranch Rd"
   ],
   [
    "Floor",
    "Natural dirt"
   ],
   [
    "Entrances",
    "Subtle entrance screening"
   ]
  ],
  "Maintains the critical hydrological and ungulate movement corridor linking Chino Hills State Park directly to Prado Wetlands."
 ],
 [
  "sr71-chino-hills",
  "sr71-thermal-radar",
  "B",
  "INTELLIGENT TRANSPORT SYSTEM | THERMAL RADAR",
  "Real-Time Infrared Thermal Radar & VMS Driver Alert Network",
  "/sr71-radar-render.png",
  [
   [
    "Sensors",
    "Dual-axis thermal sensors mounted on transceivers"
   ],
   [
    "Signage",
    "Dynamic LED VMS boards"
   ],
   [
    "Speed Limit",
    "Lowered from 65 to 45 MPH upon animal detection near shoulders"
   ]
  ],
  "Eliminates driver alert fatigue by enforcing dynamic speed reductions only during active nocturnal ungulate crossing events."
 ],
 [
  "sr71-chino-hills",
  "coal-canyon-funnel",
  "C",
  "HABITAT MANAGEMENT | CORRIDOR LINKAGE",
  "Coal Canyon & SR-71/CA-91 Interchange Funnel Linkage",
  "/coal-canyon-link-render.png",
  [
   [
    "Fencing",
    "Continuous 8-foot guide fencing"
   ],
   [
    "Planting",
    "Native riparian brush"
   ],
   [
    "Link",
    "Chino Hills ridgelines to the Coal Canyon freeway underpass"
   ]
  ],
  "Directs dispersing bobcats, coyotes, and mule deer away from high-speed interchange ramps into protected drainage structures."
 ]
].map((a) => socal(...a))

SOCAL.forEach((s) => { SOLUTION_DETAILS[s.id] = s.detail })

// Section 03 cards per corridor page
export const CORRIDOR_CARDS = SOCAL.reduce((acc, s) => ({ ...acc, [s.corridor]: [...(acc[s.corridor] ?? []), s.card] }), {})

// Central California generated solutions: cost, target and summary drive both the Section 03 card and the modal sheet.
const central = (corridor, id, sheet, category, title, src, summary, cost, target, specs) => ({
  corridor,
  id,
  detail: {
    category: `Technical Specification Sheet 03-${sheet}`,
    subcategory: category,
    title,
    compactImages: true,
    visuals: { render: { src, alt: `Conceptual render: ${title}`, caption: `Conceptual Render: ${title}.` } },
    columns: [
      { heading: 'Engineering Specs', items: specs },
      { heading: 'Ecological Objectives', paragraphs: [summary, `Target species: ${target}.`] },
      {
        heading: 'Cost & Timeline',
        items: [['Estimated Cost', cost], ['Estimated Completion', 'To be confirmed; no schedule has been set for this concept']],
      },
    ],
  },
  card: { id, category, title, overview: summary, cost, target, viewLabel: 'View Solution Details' },
})

const CENTRAL = [["us101-rocks-road", "sargent-eco-bridge", "A", "Capital Infrastructure | Overcrossing", "Sargent Ranch Eco-Bridge Wildlife Overpass", "/sargent-eco-bridge-render.png", "A 175-ft wide vegetated green bridge crossing US-101 north of San Juan Bautista, restoring movement between the Santa Cruz Mountains and Gabilan Range.", "$18.5M", "Mountain Lion, Black-Tailed Deer", [["Structure", "175-ft wide vegetated green bridge crossing US-101 north of San Juan Bautista"], ["Connectivity", "Santa Cruz Mountains to Gabilan Range"]]], ["us101-rocks-road", "rocks-culvert-retrofit", "B", "Sub-surface Mitigation | Underpass", "Rocks Road Box Culvert Retrofit & Directional Fencing", "/rocks-culvert-render.png", "Retrofitting two existing drainage culverts at PM 0.2 into double-height dry-footing wildlife underpasses with 8-ft ungulate-proof guide fencing.", "$6.2M", "Mountain Lion, American Badger", [["Retrofit", "Two existing drainage culverts at PM 0.2 converted to double-height dry-footing wildlife underpasses"], ["Fencing", "8-ft ungulate-proof guide fencing"]]], ["us101-rocks-road", "rocks-thermal-detection", "C", "Intelligent Transport Systems | Telemetry", "AI Thermal Wildlife Detection & Variable Speed Warnings", "/rocks-thermal-render.png", "Infrared thermal sensor array along unlit curve sectors triggering dynamic LED speed alerts to motorists when animals approach the right-of-way.", "$1.8M", "All Highway Wildlife", [["Sensors", "Infrared thermal sensor array along unlit curve sectors"], ["Alerts", "Dynamic LED speed alerts when animals approach the right-of-way"]]], ["hwy41-46-cholame", "cholame-elk-overcrossing", "A", "Capital Infrastructure | Ungulate Bridge", "Jack Ranch Tule Elk Overcrossing Arch", "/cholame-overcrossing-render.png", "A wide, low-profile earthen overpass designed specifically for herd ungulate movement (Tule Elk & Pronghorn) across the Highway 46 Expressway.", "$22.0M", "Tule Elk, Pronghorn Antelope", [["Structure", "Wide, low-profile earthen overpass for herd ungulate movement across the Highway 46 Expressway"]]], ["hwy41-46-cholame", "temblor-culverts", "B", "Infrastructure & Access | Underpass System", "Temblor Corridor Box Culverts & Earthen Jump-Outs", "/temblor-culverts-render.png", "Installation of two 14'x12' concrete box culverts coupled with one-way earthen ramp jump-outs allowing animals trapped in right-of-way fencing to escape.", "$8.4M", "Pronghorn, Mule Deer, San Joaquin Kit Fox", [["Culverts", "Two 14'x12' concrete box culverts"], ["Escape", "One-way earthen ramp jump-outs for animals trapped in right-of-way fencing"]]], ["hwy41-46-cholame", "cholame-radar-lighting", "C", "Real-Time Telemetry | Hazard Prevention", "Smart Radar Advisory & Solar Perimeter Lighting", "/cholame-radar-render.png", "Solar-powered radar motion detection nodes coupled with low-intensity cut-off road lighting to reduce night-time strikes along key seasonal crossing paths.", "$2.1M", "Large Ungulates & Freight Traffic", [["Detection", "Solar-powered radar motion detection nodes"], ["Lighting", "Low-intensity cut-off road lighting"]]]].map((a) => central(...a))

CENTRAL.forEach((s) => { SOLUTION_DETAILS[s.id] = s.detail })
Object.assign(CORRIDOR_CARDS, CENTRAL.reduce((acc, s) => ({ ...acc, [s.corridor]: [...(acc[s.corridor] ?? []), s.card] }), {}))

// Northern California generated solutions (I-5 Shasta-Trinity). Same sheet as Central California; costs are planning estimates from published unit costs.
const NORTH = [
  ['i5-shasta-trinity', 'i5-canyon-undercrossings', 'A', 'Sub-surface Mitigation | Underpass', 'Sacramento River Canyon Bridge & Culvert Undercrossings',
    '/i5-canyon-undercrossings-render.png',
    'Widen the dry banks under existing I-5 bridges and enlarge drainage culverts in the canyon so deer, bears and mountain lions can pass beneath the freeway.',
    '~$0.54M per km', 'Black-Tailed Deer, Black Bear, Mountain Lion',
    [['Structures', 'Existing bridges and drainage culverts in the Sacramento River canyon'], ['Retrofit', 'Dry walking path along the bank; enlarged culvert openings'], ['Cost basis', 'Fence, underpass and jump-outs: $538,273 per km (Huijser et al. 2009, Ecology and Society, 75-year present value in 2007 US$ per km of road)']]],
  ['i5-shasta-trinity', 'i5-shasta-lake-fencing', 'B', 'Infrastructure & Access | Fencing', 'Shasta Lake Directional Fencing & Escape Ramps',
    '/i5-shasta-lake-fencing-render.png',
    'Wildlife fencing along I-5 near Shasta Lake that steers animals to safe crossing points, with one-way escape ramps for any that get onto the road side.',
    '~$0.19M per km', 'Black-Tailed Deer, Black Bear',
    [['Fencing', 'Wildlife fencing along both sides of I-5 near Shasta Lake'], ['Escape', 'One-way earthen escape ramps (jump-outs)'], ['Cost basis', 'Wildlife fence: $187,246 per km (Huijser et al. 2009, Ecology and Society, 75-year present value in 2007 US$ per km of road); escape ramps add to this']]],
  ['i5-shasta-trinity', 'i5-animal-detection', 'C', 'Intelligent Transport Systems | Warning', 'Animal Detection & Driver Warning Signs',
    '/i5-animal-detection-render.png',
    'Sensors that detect large animals near the freeway and switch on flashing warning signs, the same approach Caltrans is testing for elk on US-101 at Stone Lagoon.',
    '~$0.9M per site', 'All Large Wildlife',
    [['Detection', 'Roadside sensors at known crossing points'], ['Warning', 'Flashing signs and message boards that turn on only when animals are present'], ['Cost basis', 'Projected cost of the Caltrans elk detection system on US-101 at Stone Lagoon: $900,000 (North Coast Journal, 2023)']]],
].map((a) => central(...a))

// Two pictures each for these solutions, shown side by side in View Solution Details.
const NORTH_PAIRS = {
  'i5-canyon-undercrossings': ['/i5-canyon-undercrossings-1.png', '/i5-canyon-undercrossings-2.png'],
  'i5-animal-detection': ['/i5-animal-detection-1.png', '/i5-animal-detection-2.png'],
  'i5-shasta-lake-fencing': ['/i5-shasta-lake-fencing-1.png', '/i5-shasta-lake-fencing-2.png'],
}
NORTH.forEach((s) => {
  const pair = NORTH_PAIRS[s.id]
  if (pair) {
    const { title } = s.detail
    s.detail.compactImages = false
    s.detail.visuals = {
      blueprint: { src: pair[0], alt: `Conceptual render: ${title}`, caption: `Conceptual Render: ${title} (view 1).` },
      render: { src: pair[1], alt: `Conceptual render: ${title}`, caption: `Conceptual Render: ${title} (view 2).` },
    }
  }
})
NORTH.forEach((s) => { SOLUTION_DETAILS[s.id] = s.detail })
Object.assign(CORRIDOR_CARDS, NORTH.reduce((acc, s) => ({ ...acc, [s.corridor]: [...(acc[s.corridor] ?? []), s.card] }), {}))

// SR-37 San Pablo Baylands generated solutions: one entry builds both the Section 03 card and the modal sheet.
const SR37 = [
 {
  "id": "sr37-tolay-linkage",
  "sheet": "A",
  "tag": "INDIGENOUS CO-MANAGEMENT | BAYLANDS RESTORATION",
  "featured": false,
  "title": "Tolay Valley to Baylands Co-Managed Habitat Linkage",
  "desc": "Extending the existing Tolay Lake Regional Park co-management model between Sonoma County Regional Parks and the Federated Indians of Graton Rancheria (Coast Miwok and Southern Pomo) downstream along Tolay Creek, restoring a continuous upland-to-tidal-marsh corridor that connects through the new, longer Tolay Creek Bridge on SR-37.",
  "impact": "Pairs the bridge replacement's restored tidal flow with managed upland transition habitat, giving marsh wildlife high-tide refuge and a safe passage beneath the highway instead of across it.",
  "backing": "Builds on the 2022 Tolay Lake co-management agreement between the Federated Indians of Graton Rancheria and Sonoma County Regional Parks, with Sonoma Land Trust as a baylands restoration partner.",
  "target": "Salt marsh harvest mouse, Ridgway's rail, California black rail"
 },
 {
  "id": "sr37-causeway",
  "sheet": "B",
  "tag": "CAPITAL INFRASTRUCTURE | HIGH DEMAND & IMPACT",
  "featured": true,
  "title": "Pile-Supported Elevated SR-37 Causeway",
  "desc": "Replacing the at-grade highway embankment between Sears Point and Mare Island with a fully elevated, pile-supported causeway along the current alignment, reopening tidal exchange between San Pablo Bay and the diked baylands north of the road.",
  "scope": "Estimated at roughly $750M+ for the long-term project, requiring state and federal funding, full CEQA/NEPA review, and BCDC permitting. Caltrans' current plan targets the causeway around 2050.",
  "impact": "Removes the highway as a physical barrier across the marsh, restoring hydrological and habitat connectivity along the full corridor while protecting the road from sea-level rise.",
  "backing": "Identified as the preferred long-term alternative by the Resilient SR 37 partnership, and supported by the SR 37-Baylands Group, BCDC, and regional conservation organizations.",
  "target": "All bayland wildlife; tidal marsh and fish species"
 },
 {
  "id": "sr37-mammal-fencing",
  "sheet": "C",
  "tag": "SUB-SURFACE MITIGATION | TELEMETRY",
  "featured": false,
  "title": "Small-Mammal Exclusion Fencing & Monitored Dry-Shelf Culverts",
  "desc": "Installing fine-mesh small-mammal exclusion fencing along marsh-adjacent shoulders and retrofitting existing drainage culverts with elevated dry shelves, monitored by wildlife cameras to track crossing use.",
  "impact": "Targets the endangered salt marsh harvest mouse and other small marsh mammals, steering them away from traffic and into dry under-road passages, with camera data measuring whether the passages work.",
  "backing": "Aligns with U.S. Fish & Wildlife Service management of San Pablo Bay National Wildlife Refuge and CDFW's Napa-Sonoma Marshes Wildlife Area, the two conservation areas SR-37 bisects.",
  "target": "Salt marsh harvest mouse and small marsh mammals"
 }
]

const SR37_SHEETS = {
 "sr37-tolay-linkage": {
  "files": [
   "tolay-linkage-blueprint",
   "tolay-linkage-render"
  ],
  "caps": [
   "Conceptual Habitat Linkage Cross-Section: Tolay Valley to San Pablo Bay.",
   "Post-Implementation Visual: Tolay Creek Tidal Marsh Corridor (SR-37 View)."
  ],
  "alts": [
   "Conceptual cross-section of the Tolay Valley to San Pablo Bay habitat linkage",
   "Render of the Tolay Creek tidal marsh corridor beneath SR-37"
  ],
  "specs": [
   [
    "Bridge Span",
    "375 ft Tolay Creek Bridge (replacing existing 60 ft span)"
   ],
   [
    "Channel",
    "Tolay Creek widened; fill removed from Tolay Lagoon"
   ],
   [
    "Upland Anchor",
    "Tolay Lake Regional Park (~3,400 acres)"
   ],
   [
    "Transition Zone",
    "Managed upland-to-tidal-marsh habitat (conceptual)"
   ]
  ],
  "impact": [
   "Hydrologic connectivity: the longer bridge removes a flow bottleneck, letting tidal water and wildlife move beneath SR-37 instead of across it.",
   "High-tide refuge: upland transition habitat gives salt marsh harvest mice and Ridgway's rails somewhere to retreat during extreme tides and sea-level rise.",
   "Cultural landscape: links restoration to a landscape with deep significance to Coast Miwok and Southern Pomo peoples."
  ],
  "comgmt": [
   "Federated Indians of Graton Rancheria: proposed extension of their existing co-management partnership at Tolay Lake Regional Park, guiding cultural resource protection and native plant selection.",
   "Sonoma County Regional Parks & Sonoma Land Trust: upland land management and baylands restoration partners.",
   "Caltrans District 4 & USFWS: bridge replacement under the Sears Point to Mare Island project, coordinated with San Pablo Bay National Wildlife Refuge."
  ]
 },
 "sr37-causeway": {
  "files": [
   "sr37-causeway-blueprint",
   "sr37-causeway-render"
  ],
  "caps": [
   "Civil Engineering Elevation: Pile-Supported Causeway Over Tidal Marsh.",
   "Post-Implementation Visual: Restored Tidal Baylands Beneath SR-37."
  ],
  "alts": [
   "Engineering elevation of a pile-supported SR-37 causeway over tidal marsh",
   "Render of restored tidal baylands beneath an elevated SR-37"
  ],
  "specs": [
   [
    "Alignment",
    "Current SR-37 alignment, Sears Point to Mare Island (~10 mi)"
   ],
   [
    "Structure",
    "Fully elevated, pile-supported deck"
   ],
   [
    "Estimated Cost",
    "~$750M+ (long-term project)"
   ],
   [
    "Timeline",
    "Permit application due 2045; target ~2050"
   ]
  ],
  "impact": [
   "Barrier removal: replaces the solid road embankment so tides, sediment, and wildlife pass freely under the highway.",
   "Baylands restoration: reconnects San Pablo Bay with the diked baylands to the north, enabling large-scale tidal marsh recovery.",
   "Climate resilience: lifts the road above projected sea-level rise, which is expected to regularly flood the current highway."
  ],
  "comgmt": [
   "Resilient SR 37 Partnership: MTC, Caltrans, CalSTA, BCDC, CDFW, and the California Natural Resources Agency.",
   "SR 37-Baylands Group: wetland land managers and scientists advocating for the pile-supported causeway.",
   "Tribal consultation: government-to-government consultation with affected tribes under CEQA/NEPA cultural resource review."
  ]
 },
 "sr37-mammal-fencing": {
  "files": [
   "smhm-culvert-blueprint",
   "smhm-culvert-render"
  ],
  "caps": [
   "Conceptual Cross-Section: Exclusion Fencing & Dry-Shelf Culvert Retrofit.",
   "Post-Implementation Visual: Monitored Culvert Entrance Along SR-37."
  ],
  "alts": [
   "Conceptual cross-section of exclusion fencing and a dry-shelf culvert retrofit",
   "Render of a monitored culvert entrance along SR-37"
  ],
  "specs": [
   [
    "Fencing",
    "Fine-mesh small-mammal exclusion fencing along marsh-adjacent shoulders"
   ],
   [
    "Culverts",
    "Existing drainage culverts retrofitted with elevated dry shelves"
   ],
   [
    "Monitoring",
    "Motion-triggered wildlife cameras at culvert entrances"
   ],
   [
    "Baseline",
    "291 bird and mammal fatalities recorded in 51 surveys (USGS, Napa River to Tolay Creek)"
   ]
  ],
  "impact": [
   "Collision reduction: fencing steers small mammals away from the travel lanes toward culvert entrances.",
   "Safe passage: dry shelves keep culverts usable at high tide, when marsh mammals are most likely to move.",
   "Measurable results: camera data shows whether animals actually use the passages, so the design can be adjusted."
  ],
  "comgmt": [
   "USFWS: San Pablo Bay National Wildlife Refuge habitat and endangered species oversight.",
   "CDFW: Napa-Sonoma Marshes Wildlife Area management.",
   "Caltrans District 4 & USGS: right-of-way installation and wildlife monitoring research."
  ]
 }
}

SR37.forEach((s) => {
  const x = SR37_SHEETS[s.id]
  SOLUTION_DETAILS[s.id] = {
    category: `Technical Specification Sheet 03-${s.sheet}`,
    subcategory: s.tag,
    title: s.title,
    visuals: {
      blueprint: { src: `/${x.files[0]}.png`, alt: x.alts[0], caption: x.caps[0] },
      render: { src: `/${x.files[1]}.png`, alt: x.alts[1], caption: x.caps[1] },
    },
    columns: [
      { heading: 'Engineering Specs', items: x.specs },
      { heading: 'Detailed Impact Analysis', paragraphs: x.impact },
      { heading: 'Tribal & Multi-Agency Co-Management', paragraphs: x.comgmt },
    ],
  }
})

CORRIDOR_CARDS['sr37-baylands'] = SR37.map((s) => ({
  id: s.id,
  featured: s.featured,
  category: s.tag,
  title: s.title,
  overview: s.desc,
  scope: s.scope,
  impact: s.impact,
  backing: s.backing,
}))
