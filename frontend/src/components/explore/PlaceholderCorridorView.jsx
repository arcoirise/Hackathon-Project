import { Fragment, useEffect, useState } from 'react'
import { CircleMarker, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { BASE_MAPS, PopupCard, ResizeOnChange } from './ConflictMapView.jsx'
import GeneratedSolutions from './GeneratedSolutions.jsx'
import ExistingSolutions from './ExistingSolutions.jsx'
import { CORRIDOR_CARDS } from '../../data/solutionData.js'
import { SR46_CHOLAME, US101_ROCKS } from '../../data/centralLines.js'
import { I15_TEMECULA, SR71_CHINO, US101_AGOURA } from '../../data/socalLines.js'
import { I5_SHASTA } from '../../data/northLines.js'

// Placeholder corridor pages (map + sections 02/03 stubs), keyed by the #/corridor/<id> route.
// Highway lines are approximate hand-placed alignments, not traced from OSM.
const MIN_ZOOM = 8
const MAX_ZOOM = 16
const REGION_VIEW = { center: [40.7, -122.4], zoom: 7 }
// Section 02 for I-5 Shasta-Trinity: Caltrans District 2's planned Flume Creek wildlife undercrossing (CEQAnet 2024120559).
const I5_EXISTING = {
  category: 'PLANNED INFRASTRUCTURE | CALTRANS DISTRICT 2',
  title: 'I-5 Flume Creek Wildlife Undercrossing & Exclusion Fencing (Dunsmuir)',
  overview:
    "Part of Caltrans District 2's Flume Creek CAPM project on I-5 in and near Dunsmuir (Shasta County PM 58.0–67.019, Siskiyou County PM 0.0–2.7). Its environmental document (Mitigated Negative Declaration) was released in December 2024. Alongside pavement, guardrail and drainage upgrades, the project adds a wildlife undercrossing with fencing that guides animals beneath the freeway.",
  components: [
    'A 12-ft wide by 12-ft tall reinforced concrete box culvert under I-5 at PM 65.88, built by cut and cover.',
    '8-ft chain-link wildlife fencing guiding animals to the culvert (PM 65.45–66.17 west of the highway, PM 65.45–66.10 east).',
    'Jump-outs or deer gates in the fence and intermittent gaps in the median barrier so animals are not trapped on the freeway.',
  ],
  effectiveness:
    'Planned, not yet built; construction is expected to take three seasons (about 360 working days). The state has announced $76.5 million for a wildlife crossing and fencing along I-5 near Dunsmuir. Effectiveness will be known only after post-construction monitoring.',
  linkLabel: 'View Caltrans Flume Creek CAPM Environmental Document (CEQAnet)',
  href: 'https://ceqanet.lci.ca.gov/2024120559',
}

const CORRIDORS = {
  'i5-shasta-trinity': {
    title: 'I-5 Shasta-Trinity Corridor',
    subtitle: 'Shasta & Siskiyou Counties | Cascade and Trinity ranges, multi-lane mountain freeway',
    site: [40.77188, -122.31242], // on I-5 at Shasta Lake (Turntable Bay)
    siteLabel: 'I-5 at Shasta Lake (Turntable Bay)',
    stretch: [[40.62, -122.45], [41.31, -122.25]],
    lockBounds: [[40.2, -123.2], [41.8, -121.6]],
    maxFlyZoom: 11,
    highway: I5_SHASTA,
    existingSolution: I5_EXISTING,
    legendLine: 'I-5, Redding to Mount Shasta',
    miles: '56.6 mi',
    habitats: [{"name": "Shasta Lake / Shasta-Trinity National Forest", "points": [[40.678, -122.329], [40.69, -122.367], [40.719, -122.382], [40.886, -122.437], [40.913, -122.441], [40.941, -122.425], [40.953, -122.387], [40.941, -122.35], [40.939, -122.348], [40.872, -122.291], [40.843, -122.275], [40.786, -122.255], [40.743, -122.26], [40.741, -122.261], [40.712, -122.276], [40.69, -122.291]], "title": "Shasta Lake & National Forest Habitat Area", "species": "Columbian Black-Tailed Deer, Black Bear & Mountain Lion", "population": "No published estimate for this segment", "importance": "Forest and reservoir shoreline on both sides of I-5 provide forage, cover and water for large mammals.", "obstruction": "I-5 crosses the lake on the Pit River Bridge; animals moving between the east and west shores must cross a four-lane freeway.", "roleLabel": "Ecosystem Role"}, {"name": "Sacramento River Canyon / Castle Crags", "points": [[41.079, -122.327], [41.088, -122.356], [41.111, -122.368], [41.119, -122.37], [41.268, -122.319], [41.29, -122.307], [41.3, -122.277], [41.29, -122.248], [41.273, -122.23], [41.271, -122.228], [41.249, -122.216], [41.246, -122.216], [41.155, -122.253], [41.132, -122.265], [41.088, -122.297]], "title": "Upper Sacramento River Canyon Linkage", "species": "Columbian Black-Tailed Deer, Black Bear & Mountain Lion", "population": "No published estimate for this segment", "importance": "Riparian canyon corridor along the upper Sacramento River between Castle Crags State Park and Dunsmuir.", "obstruction": "In the narrow canyon, I-5, the railroad and the river share the valley floor, leaving few places for animals to cross.", "roleLabel": "Ecosystem Role"}],
    diagnostic: {"title": "I-5 Shasta-Trinity Corridor Analysis", "subtitle": "Shasta & Siskiyou Counties | Redding to Mount Shasta Sector", "sections": [{"heading": "1. Spatial & Ecological Context", "body": "Interstate 5 runs about 56.6 miles from Redding (Jct. Rte. 273) to Mount Shasta, crossing Shasta Lake and climbing the upper Sacramento River canyon past Castle Crags State Park and Dunsmuir. Caltrans counts about 47,500 vehicles a day at Redding and about 18,600 to 20,400 a day north of Shasta Lake."}, {"heading": "2. Conflict Drivers & Environmental Factors", "body": "Wildlife-vehicle conflict along this corridor is driven by three key factors:", "bullets": [["Freeway Barrier", "A divided interstate with steady day-and-night traffic, including long-haul trucks, separates habitat on the east and west sides."], ["Canyon Bottleneck", "In the Sacramento River canyon the freeway, the railroad and the river share a narrow valley, so crossings concentrate at bridges and drainages."], ["Data Gap", "No segment-level wildlife-vehicle collision count has been compiled for this corridor yet; CHP and Caltrans records are needed before ranking hotspots."]]}]},
    cohesion: "I-5 runs the length of the Shasta-Trinity region, splitting forest and lake habitat east and west of the freeway. For wide-ranging deer, black bears and mountain lions, constant traffic and the narrow Sacramento River canyon limit where animals can cross safely.",
    legend: 'I-5 (approximate alignment)',
    popup: 'I-5 Shasta-Trinity Corridor',
    existing: {
      title: 'Existing mitigation data coming soon',
      body: 'Documented I-5 Shasta-Trinity mitigations will appear here.',
    },
  },
  'sr89-mccloud': {
    title: 'SR-89 McCloud Corridor',
    subtitle: 'Siskiyou County | High-density vehicle collision zones across critical elk winter ranges',
    site: [41.26, -122.0],
    stretch: [[41.2, -122.35], [41.34, -121.9]],
    lockBounds: [[40.8, -122.9], [41.7, -121.4]],
    maxFlyZoom: 12,
    highway: [[41.3, -122.29], [41.27, -122.22], [41.256, -122.14], [41.27, -122.05], [41.26, -122.0]],
    legend: 'SR-89 (approximate alignment)',
    popup: 'SR-89 McCloud Corridor',
    existing: {
      title: 'Winter range collisions and habitat fragmentation',
      body: 'Placeholder: SR-89 bisects seasonal winter range, concentrating vehicle collisions where herds descend to lower elevations and fragmenting habitat on either side of the road. Documented collision data and existing mitigations will appear here.',
    },
  },
}
// Corridors with the conflict-analytics template (Bay Area, Central California): overview text, conflict-analytics placeholders, inert Section 03.
const analyticsCorridor = ({ title, subtitle, site, stretch, highway, highways, legend, overview, habitats, incidents, siteLabel, bubble, miles, legendLine, section2Title, section2Blurb, hotspot, solution, solutions, diagnostic, cohesion, metrics, existingSolution }) => ({
  title,
  subtitle,
  site,
  stretch,
  lockBounds: [[site[0] - 0.6, site[1] - 0.7], [site[0] + 0.6, site[1] + 0.7]],
  maxFlyZoom: 12,
  highway,
  highways,
  legend,
  popup: title,
  overview,
  habitats,
  incidents,
  siteLabel,
  bubble,
  miles,
  legendLine,
  section2Title,
  section2Blurb,
  hotspot,
  solution,
  solutions,
  diagnostic,
  cohesion,
  metrics,
  existingSolution,
  analytics: true,
})
// Hotspot nodes snap to the nearest point on the traced line.
const nearestOnLine = (line, [lat, lng]) =>
  line.reduce((best, p) => ((p[0] - lat) ** 2 + (p[1] - lng) ** 2 < (best[0] - lat) ** 2 + (best[1] - lng) ** 2 ? p : best))
const BAY_CORRIDORS = {
  'sr37-baylands': analyticsCorridor({
    title: 'SR-37 San Pablo Baylands Corridor',
    subtitle: 'Solano, Napa, Sonoma & Marin Counties | Tidal baylands along the north edge of San Pablo Bay',
    site: [38.15, -122.35],
    stretch: [[38.08, -122.55], [38.2, -122.2]],
    highway: [[38.113, -122.26], [38.13, -122.3], [38.145, -122.36], [38.13, -122.42], [38.14, -122.47], [38.12, -122.52]],
    legend: 'SR-37 (approximate alignment)',
    overview: 'Placeholder: SR-37 crosses the tidal marsh and baylands of San Pablo Bay, separating wetland habitat from the uplands to the north. Ecological fragmentation findings will appear here.',
  }),
  'hwy17-santacruz': analyticsCorridor({
    title: 'Highway 17 Santa Cruz Mountains Corridor (Laurel Curve)',
    subtitle: 'Santa Clara & Santa Cruz Counties | Mountain freeway through the Santa Cruz Mountains',
    site: [37.1, -121.99],
    stretch: [[37.0, -122.1], [37.28, -121.9]],
    highway: [[37.23, -121.97], [37.17, -121.98], [37.1, -121.99], [37.05, -122.01]],
    legend: 'Highway 17 (approximate alignment)',
    overview: 'Placeholder: Highway 17 divides the Santa Cruz Mountains habitat linkage near Laurel Curve. Ecological fragmentation findings will appear here.',
    section2Title: 'Existing Corridor Solutions',
    section2Blurb: 'Built infrastructure is shown separately from concepts that remain in design and permitting.',
    solutions: [
      {
        category: 'Built | Wildlife undercrossing',
        title: 'Laurel Curve Wildlife Crossing',
        description: 'Completed in January 2023, this dedicated wildlife passage carries animals beneath Highway 17 at Laurel Curve. Directional fencing guides wildlife toward the crossing, which is reserved for animal use.',
        impact: 'Camera monitoring recorded bobcat and mountain lion use during the first year; the Land Trust reports 934 animal passages by six species from 2023 through 2024.',
        source: 'Land Trust of Santa Cruz County — Highway 17 Wildlife Crossing',
        sourceUrl: 'https://landtrustsantacruz.org/',
      },
      {
        category: 'Planned concept | Final design & permitting',
        title: 'Lexington / Trout Creek Wildlife Undercrossing',
        description: 'Midpen, Caltrans and VTA are advancing a new wildlife undercrossing along Trout Creek near Lexington Reservoir, paired with wildlife fencing and escape features. The project is not yet built, and published renderings are illustrative rather than a final design.',
        impact: 'The planned crossing is intended to reduce wildlife-vehicle collisions and reconnect more than 30,000 acres of protected public land for mountain lions, deer and other wildlife.',
        source: 'Midpeninsula Regional Open Space District — Highway 17 Wildlife and Trail Crossings',
        sourceUrl: 'https://www.openspace.org/what-we-do/projects/highway-17-wildlife-and-trail-crossings',
      },
    ],
  }),
  'us101-marin-marsh': analyticsCorridor({
    title: 'US-101 Marin County Marsh Corridor',
    subtitle: 'Marin County | Tidal marsh and shoreline habitat along the US-101 corridor',
    site: [37.92, -122.56],
    stretch: [[37.84, -122.65], [38.14, -122.45]],
    highway: [[38.1, -122.55], [38.03, -122.54], [37.97, -122.52], [37.93, -122.52], [37.88, -122.52]],
    legend: 'US-101 (approximate alignment)',
    overview: 'Placeholder: US-101 runs along Marin County marshlands where wetland habitat meets the freeway. Ecological fragmentation findings will appear here.',
  }),
  'i680-sunol-grade': analyticsCorridor({
    title: 'I-680 Sunol Grade Wildlife Corridor',
    subtitle: 'Alameda County | Freeway grade between the East Bay hills and the Sunol watershed',
    site: [37.52, -121.9],
    stretch: [[37.42, -122.0], [37.64, -121.8]],
    highway: [[37.46, -121.92], [37.5, -121.91], [37.55, -121.88], [37.6, -121.88]],
    legend: 'I-680 (approximate alignment)',
    overview: 'Placeholder: I-680 climbs the Sunol Grade through hill and watershed habitat. Ecological fragmentation findings will appear here.',
  }),
}
// Section 02 for US-101 Rocks Road: an Existing Solutions card in the same layout as US-101 Redwood.
const ROCKS_EXISTING = {
  category: 'ACTIVE INFRASTRUCTURE & RETROFITS | CALTRANS DISTRICT 5',
  title: 'US-101 Rocks Road Culvert Retrofits & Directional Fencing (San Benito)',
  overview:
    'Implemented alongside Caltrans District 5 projects (EA 05-1J840 / 05-1Q260) and Land Trust of Santa Cruz County conservation initiatives at Rocks Ranch (Post Miles 0.0 to 7.55), this baseline intervention utilizes existing drainage infrastructure and exclusionary fencing to funnel Central Coast mountain lions, American badgers, and mule deer safely beneath the highway while the dedicated wildlife overcrossing awaits construction.',
  components: [
    'Two existing drainage culverts (around PM 0.2–0.48 and PM 1.4) utilized as baseline underpasses and targeted for 20-foot by 10-foot bottomless clear-span wildlife retrofits.',
    'Directional wildlife exclusion fencing along the Rocks Ranch perimeter to block at-grade highway access and guide animals toward existing undercrossings.',
    'Continuous remote camera-trap arrays and GPS collar tracking deployed by Pathways for Wildlife and CDFW to monitor crossing bottlenecks.',
  ],
  effectiveness:
    'Moderate / Interim Mitigation; directional fencing successfully reduces immediate roadkill events and guides smaller fauna through existing drainage culverts, though large apex predators (pumas) remain hesitant to use narrow subterranean passages—underscoring the need for the planned EA #05-1Q260 vegetated overcrossing.',
  linkLabel: 'View Official Caltrans District 5 Project Report & Fact Sheet',
  href: 'https://dot.ca.gov/caltrans-near-me/district-5/district-5-current-projects/05-1q260',
}

// Section 02 for HWY 41/46 Cholame: an Existing Solutions card in the same layout as US-101 Redwood.
const CHOLAME_EXISTING = {
  category: 'ACTIVE INFRASTRUCTURE & EXPRESSWAY RETROFITS | CALTRANS DISTRICT 5',
  title: 'SR-46 / SR-41 Cholame Segment Undercrossings & Creek Bridge Spans (Cholame "Y")',
  overview:
    'Integrated into the Caltrans Route 46 Corridor Improvement Project (Cholame & Wye Segments, EA 05-3307A / PPNO 0226J from Post Miles 49.7 to 55.1), these baseline structural mitigations utilize elevated riparian bridge spans and box culverts across the Jack Ranch and Shandon Valley floor to provide subterranean passage beneath the four-lane divided expressway for resident Tule elk and Carrizo Plain pronghorn.',
  components: [
    'Dual parallel Cholame Creek bridges and reinforced concrete box culverts providing riparian underpass clearance beneath the widened 4-lane expressway.',
    'Grade-separated SR-46/SR-41 interchange realignment and wing-fencing directing grassland ungulates away from high-speed merge lanes.',
    'Off-site habitat and wetland mitigation via the Centennial Creek Mitigation Project and Jack Ranch conservation easements.',
  ],
  effectiveness:
    'Low-to-Moderate for Target Ungulates; while riparian bridge undercrossings successfully pass smaller mesopredators and mule deer, Pronghorn antelope and Tule elk herds instinctually avoid dark or confined underpasses and remain blocked by parallel agricultural barbed-wire fencing—requiring wide, open-span vegetated overcrossings and wildlife-friendly fence retrofits.',
  linkLabel: 'View Official Caltrans Route 46 Corridor Improvement Project Overview',
  href: 'https://dot.ca.gov/caltrans-near-me/district-5/district-5-current-projects',
}

const CENTRAL_CORRIDORS = {
  'us101-rocks-road': analyticsCorridor({
    title: 'US-101 Rocks Road Corridor',
    subtitle: 'San Benito County | Puma crossing bottlenecks in the Gabilan and Diablo ranges',
    site: US101_ROCKS[Math.floor(US101_ROCKS.length / 2)],
    stretch: [[36.8, -121.7], [37.0, -121.4]],
    highway: US101_ROCKS,
    miles: '7.55 mi',
    legendLine: 'US-101, San Juan Bautista / Aromas sector',
    habitats: [{"name": "Gabilan Range Linkage", "points": [[36.87, -121.52], [36.86, -121.36], [36.7, -121.32], [36.65, -121.45], [36.74, -121.55]], "title": "Gabilan Range Core Habitat Area", "species": "Central Coast Mountain Lion (Puma concolor) & Black-Tailed Deer", "population": "~30–50 adult mountain lions in Santa Cruz / Gabilan subpopulation", "importance": "Primary breeding sanctuary for apex carnivores; top-down regulation of ungulates prevents oak woodland overgrazing.", "obstruction": "Dispersing young males face fatal vehicle strikes on US-101 or turn back into occupied territories, escalating intraspecific conflict.", "roleLabel": "Ecosystem Role"}, {"name": "Diablo Range / Sargent Linkage", "points": [[37.0, -121.5], [37.0, -121.3], [36.88, -121.25], [36.88, -121.4]], "title": "Diablo Range & Santa Cruz Mountains Ecological Linkage", "species": "Central Coast Mountain Lion (Puma concolor) & American Badger", "population": "~15–25 breeding adult lions in northern Santa Cruz Range network", "importance": "Essential genetic conduit linking coastal mountain ranges to the inland Diablo Range network.", "obstruction": "Severe genetic isolation. Caltrans and Pathways for Wildlife identify this segment as one of California's most urgent puma bottleneck remediation sites.", "roleLabel": "Ecosystem Role"}],
    diagnostic: {"title": "US-101 Rocks Road Wildlife Connectivity Analysis (Caltrans District 5 / EA 05-1Q260)", "subtitle": "San Benito County | San Juan Bautista to Aromas Sector", "sections": [{"heading": "1. Spatial & Ecological Context", "body": "The US-101 Rocks Road Corridor spans post miles 0.0 to 2.8 in San Benito County, severing the Gabilan Range from the Santa Cruz Mountains and Diablo Range. This 7.55-mile high-speed arterial bisects critical movement paths, linking thousands of protected acres north of US-101 to 2,600 continuous acres managed by the Land Trust of Santa Cruz County south of the highway."}, {"heading": "2. Conflict Drivers & Environmental Factors", "body": "Wildlife-vehicle conflict along this corridor is driven by three key factors:", "bullets": [["High-Speed 4-Lane Arterial", "Unlit travel lanes with speeds exceeding 65 MPH create severe collision hazards for dispersing carnivores."], ["Inbreeding Depression Risk", "Genetic sampling reveals dangerously low heterozygosity among Santa Cruz/Gabilan mountain lions due to highway entrapment."], ["Right-of-Way Fencing & Topography", "Agricultural perimeter fencing and steep highway cuts trap wildlife along narrow shoulders."]]}]},
    cohesion: "US-101 functions as a nearly impenetrable ecological barrier cutting directly across the movement bottleneck between the Santa Cruz Mountains and the Gabilan Range. For wide-ranging apex predators like the Central Coast mountain lion, this severance prevents subpopulation dispersal and restricts access to foraging territories. Left unresolved, this habitat fragmentation causes severe inbreeding depression and loss of genetic diversity, threatening long-term subpopulation viability across the entire Central Coast landscape.",
    overview: 'Placeholder: puma movement between the Gabilan and Diablo ranges is funneled through a few crossing bottlenecks near Rocks Road. Ecological fragmentation findings will appear here.',
    existingSolution: ROCKS_EXISTING,
    metrics: [["Existing Underpasses", "2 Culverts", "Existing drainage culverts at PM 0.2 & 1.4 currently targeted for wildlife retrofits."], ["Caltrans Project EA", "#05-1Q260", "$10M+ priority connectivity project scheduled for US-101 Rocks Road sector."], ["Target Species", "30–50 Lions", "Santa Cruz / Gabilan mountain lion subpopulation with critical genetic risk."]],
  }),
  'hwy41-46-cholame': analyticsCorridor({
    title: 'HWY 41/46 Cholame "Y" Corridor',
    subtitle: 'San Luis Obispo County (Paso Robles area) | Tule elk and pronghorn migration paths',
    site: [35.73, -120.29],
    stretch: [[35.55, -120.45], [35.85, -120.05]],
    highway: SR46_CHOLAME,
    miles: '15.5 mi',
    legendLine: 'SR-46 East around the Cholame "Y"',
    habitats: [{"name": "Cholame Hills / Jack Ranch Linkage", "points": [[35.82, -120.4], [35.82, -120.2], [35.77, -120.15], [35.76, -120.35]], "title": "Cholame Hills & Jack Ranch Pasture Linkage", "species": "Tule Elk (Cervus canadensis nannodes) & Mule Deer", "population": "Regional Jack Ranch Tule Elk herd (~150–250 individuals)", "importance": "Native mega-herbivores preventing shrub encroachment and maintaining native perennial grassland health.", "obstruction": "Herds crossing HWY 46 for seasonal forage collide with high-speed freight trucks, causing catastrophic vehicle strikes.", "roleLabel": "Ecosystem Role"}, {"name": "Temblor Range / Carrizo Linkage", "points": [[35.66, -120.1], [35.6, -119.95], [35.5, -120.05], [35.58, -120.2]], "title": "Temblor Range & Carrizo Plain Grassland Corridor", "species": "Pronghorn Antelope (Antilocapra americana) & San Joaquin Kit Fox", "population": "Reintroduced Cholame/Carrizo Pronghorn herd (~80–120 individuals)", "importance": "Specialized cursorial grazers serving as key indicators for connected desert-grassland ecosystems.", "obstruction": "Pronghorn refuse to jump highway barbed-wire fencing, getting trapped on unlit shoulders along high-speed expressways.", "roleLabel": "Ecosystem Role"}],
    diagnostic: {"title": "HWY 41/46 Cholame 'Y' Corridor Analysis (Highway 46 Expressway Corridor)", "subtitle": "San Luis Obispo County | Paso Robles to Cholame Valley Sector", "sections": [{"heading": "1. Spatial & Ecological Context", "body": "Spanning 15.5 miles across San Luis Obispo County around the James Dean Memorial Junction (HWY 41/46), this high-speed expressway cuts through the Cholame Valley floor. It severs historic migration paths between the Cholame Hills and Temblor Range for Tule Elk (~150–250) and Pronghorn Antelope (~80–120)."}, {"heading": "2. Conflict Drivers & Environmental Factors", "body": "Wildlife-vehicle conflict along this corridor is driven by three key factors:", "bullets": [["Heavy Commercial Freight Traffic", "High-volume trucking and commuter traffic (65–75+ MPH) along 'Blood Alley' make surface crossing lethal for ungulates."], ["Barbed-Wire Barrier Effect", "High-density livestock fencing parallel to the highway traps fleeing herds on pavement shoulders."], ["Absence of Grade Separation", "15+ miles of continuous asphalt lack vegetated overpasses or large ungulate-compatible box culverts."]]}]},
    cohesion: "Highway 46 East and the Highway 41 junction sever the historic open grassland migration corridor connecting the Cholame Hills to the Temblor Range. High-speed commercial truck traffic and agricultural fencing create a multi-lane barrier across native pasturelands. This obstruction disrupts seasonal herd movements between calving grounds and summer water sources, forcing large ungulates into high-speed lanes and fragmenting fragile grassland ecosystems.",
    overview: 'Placeholder: SR-41 and SR-46 meet at the Cholame "Y", crossing tule elk and pronghorn movement paths. Ecological fragmentation findings will appear here.',
    existingSolution: CHOLAME_EXISTING,
    metrics: [["Corridor Length", "15.5 Miles", "High-volume expressway expansion sector traversing the Jack Ranch and Temblor foothills."], ["Historic Conflict", "High Severity", "Historically known as 'Blood Alley' due to high-speed vehicle and ungulate collisions."], ["Target Species", "~350 Ungulates", "Jack Ranch Tule Elk herd (~200) and reintroduced Carrizo Pronghorn herd (~100)."]],
  }),
}
const SOUTHERN_CORRIDORS = {
  'i15-temecula': analyticsCorridor({
    title: "I-15 Temecula / Rainbow Canyon Corridor",
    subtitle: "Riverside & San Diego Counties | Mountain lion gene flow between the Santa Ana and Palomar ranges",
    site: [33.465, -117.145],
    stretch: [[33.3, -117.3], [33.62, -117.0]],
    highway: I15_TEMECULA,
    miles: "6.66 mi (11.06 km)",
    legendLine: "I-15 between Temecula Parkway and E Mission Rd",
    habitats: [{"name": "Cleveland National Forest / Santa Ana Mountains", "points": [[33.55, -117.42], [33.56, -117.26], [33.49, -117.23], [33.42, -117.2], [33.36, -117.2], [33.36, -117.38], [33.45, -117.42]], "species": "Mountain Lion / Mule Deer", "population": "~15-30 pumas remain in the Santa Ana subpopulation (approximate published estimate; verify against current CDFW data). No reliable local mule deer count.", "importance": "Pumas are the apex predator and regulate deer numbers, which keeps coastal sage scrub and chaparral from being overbrowsed. Deer disperse native seeds, and a viable puma population needs gene flow to the east."}, {"name": "Agua Tibia Wilderness / Palomar Mountain Range", "points": [[33.52, -117.08], [33.5, -116.95], [33.38, -116.9], [33.34, -117.05], [33.4, -117.1], [33.46, -117.1]], "species": "Mountain Lion / Mule Deer", "population": "Larger, better-connected puma population than the Santa Ana range (no verified local count).", "importance": "This is the source population for genetic rescue of Santa Ana pumas. Its intact chaparral and oak woodland supports deer herds that sustain predators and spread seed."}],
    incidents: [nearestOnLine(I15_TEMECULA, [33.43, -117.15])],
    bubble: {"title": "I-15 Rainbow Canyon Mortality Corridor", "subtitle": "Riverside / San Diego county line | 6.66 mi (11.06 km)", "summary": "Documented mortality nodes concentrated along Postmile 0.0 to 4.5 include verified strikes of radio-collared male mountain lions attempting nocturnal crossings near the Rainbow Valley Boulevard interchange. Mule deer and bobcats experience recurring strikes during seasonal foraging movements between the Santa Margarita Ecological Reserve and Eastern San Diego County foothills.", "target": "Southern California Puma Subpopulation & Mule Deer"},
    section2Title: 'Existing Corridor Solutions',
    hotspot: {"title": "Incident Hotspot: I-15 Rainbow Valley Interchange (PM 2.1)", "count": "2 Puma Fatalities Struck; Only 7 Successful Crossings in 15 Years", "details": "UC Davis / CDFW tracking shows only 7 pumas crossed I-15 from 2001–2016 (with only 1 male reproducing); 2 recorded male puma strikes near Temecula Creek.", "source": "UC Davis Road Ecology Center / CDFW Barrier Study (Barrier W046)"},
    solution: {"category": "Underpass Retrofit | Directional Fencing", "title": "Temecula Creek Bridge Wildlife Undercrossing Retrofit", "description": "Enhancement and bio-monitoring of the existing Temecula Creek bridge structure beneath I-15 south of Temecula Parkway, paired with targeted directional wildlife fencing to direct animals into the underpass.", "impact": "Facilitates documented east-west mountain lion and mule deer movement between the Santa Ana Mountains and Palomar Mountain Range.", "source": "Western Riverside County Regional Conservation Authority (RCA) / Wildlife Crossing Fund"},
    diagnostic: {"title": "I-15 Temecula / Rainbow Canyon Corridor Analysis", "subtitle": "Riverside & San Diego Counties | Rainbow Valley to Temecula Creek Sector", "sections": [{"heading": "1. Spatial & Ecological Context", "body": "Interstate 15 forms a 6.66-mile (11.06 km) barrier across the Riverside / San Diego county line, severing the Santa Ana Mountains from the Agua Tibia Wilderness and Palomar Mountain Range. The Santa Ana mountain lion subpopulation shows very low genetic diversity, and the freeway limits dispersing males from reaching Palomar range populations."}, {"heading": "2. Conflict Drivers & Environmental Factors", "body": "Wildlife-vehicle conflict along this corridor is driven by three key factors:", "bullets": [["Barrier Design", "Continuous concrete median barriers and high-speed grade changes through the Rainbow Canyon cut block large mammal movement."], ["Crossing Scarcity", "Only 7 puma crossings were recorded in 15 years, with 2 male puma strikes near Postmile 2.1 and Temecula Creek."], ["Seasonal Movement", "Mule deer and bobcats are struck during foraging movements between the Santa Margarita Ecological Reserve and eastern San Diego County foothills."]]}]},
  }),
  'us101-agoura-hills': analyticsCorridor({
    title: "US-101 Wallis Annenberg Corridor",
    subtitle: "Los Angeles County (Agoura Hills) | Mountain lion gene flow between the Santa Monica Mountains and northern habitat",
    site: [34.14, -118.76],
    stretch: [[34.05, -118.95], [34.25, -118.55]],
    highway: US101_AGOURA,
    miles: "10.2 mi",
    legendLine: "US-101, Agoura Hills / Liberty Canyon (PM 31.0 - 41.2)",
    siteLabel: "Wallis Annenberg Wildlife Crossing site",
    habitats: [{"name": "Santa Monica Mountains National Recreation Area", "points": [[34.14, -118.9], [34.13, -118.62], [34.07, -118.62], [34.05, -118.9]], "species": "Mountain Lion / Mule Deer / Coyote", "population": "Roughly 10-15 pumas (approximate NPS-reported range; verify against current NPS data).", "importance": "Pumas are the apex predator of this Mediterranean coastal sage scrub landscape. They regulate deer and mesopredators such as coyotes, protecting plant regrowth and smaller wildlife, and their scavenged kills feed many other species."}, {"name": "Simi Hills / Palo Comado Canyon", "points": [[34.24, -118.85], [34.23, -118.6], [34.18, -118.64], [34.19, -118.8]], "species": "Mountain Lion / Mule Deer / Gray Fox", "population": "No verified local count; this is the northern habitat the Santa Monica Mountains pumas cannot currently reach.", "importance": "These open spaces offer unrelated breeding partners and prey. Connecting them restores gene flow, and deer movement helps disperse native seed across the chaparral and oak woodland."}],
    incidents: [nearestOnLine(US101_AGOURA, [34.1445, -118.7505])],
    bubble: {"title": "Agoura Hills / Liberty Canyon Bottleneck", "subtitle": "US-101 PM 31.0 - 41.2 | 10.2 mi", "summary": "High-frequency mortality hotspots span Liberty Canyon Rd to Palo Comado Canyon Rd. Documented vehicle fatalities include mountain lions P-81 and P-90, along with dozens of coyotes, gray foxes, and mule deer attempting to navigate steep freeway embankments and urbanized right-of-way fencing.", "target": "Santa Monica Mountains Puma Population"},
    section2Title: 'Existing Corridor Solutions',
    hotspot: {"title": "Incident Hotspot: Liberty Canyon / Agoura Hills (PM 33.5)", "count": "3 Confirmed Puma Fatalities (2022–2024)", "details": "1 mountain lion struck and killed on June 15, 2024 (<0.5 miles from crossing build site); 2 collared pumas (P-81 & P-90) killed in 2022.", "source": "National Park Service (NPS) Wildlife Study / CDFW Mortality Database"},
    solution: {"category": "Capital Infrastructure | Vegetated Overpass", "title": "Wallis Annenberg Wildlife Crossing (Stage 1 & Stage 2)", "description": "210-foot long by 165-foot wide vegetated overpass spanning 10 lanes of US-101 and Agoura Road at Liberty Canyon. Stage 1 main span structure completed 2025; Stage 2 Agoura Rd span and native habitat planting under construction through 2026.", "impact": "Restores genetic connectivity for Santa Monica Mountains mountain lions (Puma concolor), coyotes, and mule deer across US-101.", "source": "Caltrans District 7 / Save LA Cougars / Annenberg Wildlife Crossing Project"},
    diagnostic: {"title": "US-101 Wallis Annenberg Corridor Analysis", "subtitle": "Los Angeles County | Agoura Hills & Liberty Canyon Sector", "sections": [{"heading": "1. Spatial & Ecological Context", "body": "US-101 in Agoura Hills crosses 10 lanes of traffic carrying nearly 300,000 vehicles per day through Liberty Canyon, separating the Santa Monica Mountains National Recreation Area from open space in the Simi Hills and Santa Susana Mountains. Long-term National Park Service telemetry shows severe genetic isolation among Santa Monica Mountains pumas, with high rates of inbreeding."}, {"heading": "2. Conflict Drivers & Environmental Factors", "body": "Wildlife-vehicle conflict along this corridor is driven by three key factors:", "bullets": [["Barrier Scale", "A 10-lane freeway with steep embankments and urbanized right-of-way fencing is difficult for wildlife to cross."], ["Mortality Hotspot", "Strikes concentrate between Liberty Canyon Rd and Palo Comado Canyon Rd, including pumas P-81 and P-90 (3 confirmed puma fatalities, 2022–2024, near Postmile 33.5)."], ["Genetic Isolation", "Restricted movement across US-101 raises inbreeding risk; the Wallis Annenberg Wildlife Crossing is under construction through 2026."]]}]},
  }),
  'sr71-chino-hills': analyticsCorridor({
    title: "SR-71 Chino Hills Corridor",
    subtitle: "San Bernardino, Los Angeles & Orange Counties | Mountain lion gene flow through the Chino Hills",
    site: [33.95, -117.73],
    stretch: [[33.8, -117.9], [34.1, -117.5]],
    highway: SR71_CHINO,
    miles: "7.8 mi",
    legendLine: "SR-71 from CA-60 (Pomona) southeast",
    habitats: [{"name": "Chino Hills State Park", "points": [[33.965, -117.8], [33.95, -117.72], [33.9, -117.7], [33.86, -117.74], [33.86, -117.82], [33.92, -117.84]], "species": "Mule Deer / Bobcat / Mountain Lion", "population": "No verified local counts; resident carnivores are confined to an urban-edge park.", "importance": "Bobcats and occasional pumas regulate deer and rodents, keeping coastal sage scrub intact. Isolation reduces gene flow and makes the park population vulnerable."}, {"name": "Prado Wetlands", "points": [[33.93, -117.62], [33.91, -117.56], [33.87, -117.57], [33.87, -117.66]], "species": "Mule Deer / Bobcat / Coyote", "population": "No verified local counts.", "importance": "The wetlands are a water source and riparian corridor. Deer visiting them disperse seed, and predators here help balance prey populations across the basin."}, {"name": "Northern Santa Ana Mountains", "points": [[33.86, -117.6], [33.84, -117.5], [33.78, -117.5], [33.78, -117.62]], "species": "Mountain Lion / Mule Deer", "population": "No verified local count; part of the same range as the isolated Santa Ana puma subpopulation.", "importance": "Foothill coastal sage scrub links the park to the larger Santa Ana range, so predator and ungulate balance depends on movement across SR-71."}],
    incidents: [nearestOnLine(SR71_CHINO, [33.97, -117.7])],
    bubble: {"title": "Chino Hills Express Corridor Bottleneck", "subtitle": "SR-71 between CA-60 and CA-91 | 7.8 mi", "summary": "Mortality records concentrate heavily around the Butterfield Ranch Road intersection and the SR-71/CA-91 junction in Corona. Frequent vehicle strikes affect mule deer accessing Prado Basin water sources, alongside documented predator fatalities during low-visibility dawn and dusk migration windows.", "target": "Chino Hills Wildlife Linkage & Mule Deer"},
    section2Title: 'Existing Corridor Solutions',
    hotspot: {"title": "Incident Hotspot: SR-71 / Prado Basin Linkage (PM 4.2)", "count": "26+ Annual Vehicle Collisions (Mule Deer & Bobcats)", "details": "High-density collision node for mule deer accessing Prado Basin wetlands; part of statewide corridor averaging 1–2 mountain lion highway strikes per week.", "source": "UC Davis California Roadkill Observation System (CROS)"},
    solution: {"category": "Transportation Corridor Mitigation | Culvert Retrofit", "title": "SR-71 / CA-91 Interchange Wildlife Passages", "description": "Integration of expanded wildlife box culverts and protective directional barrier fencing during the SR-71 express lane and interchange re-alignment.", "impact": "Preserves the critical Puente-Chino Hills Wildlife Corridor link connecting Chino Hills State Park to the Prado Wetlands and Santa Ana River watershed.", "source": "Riverside County Transportation Commission (RCTC) / Friends of Chino Hills State Park"},
    diagnostic: {"title": "SR-71 Chino Hills Corridor Analysis", "subtitle": "San Bernardino, Los Angeles & Orange Counties | Chino Hills State Park to Prado Wetlands Sector", "sections": [{"heading": "1. Spatial & Ecological Context", "body": "SR-71 is a 7.8-mile express highway between CA-60 in Pomona and the CA-91 interchange in Corona. It separates the eastern foothills of Chino Hills State Park from the Prado Basin wetlands, cutting the linkage between the Puente-Chino Hills ridgeline and the Santa Ana Mountains and restricting movement of mule deer, bobcats and dispersing pumas."}, {"heading": "2. Conflict Drivers & Environmental Factors", "body": "Wildlife-vehicle conflict along this corridor is driven by three key factors:", "bullets": [["Traffic & Barriers", "High traffic densities and elevated median barriers sever the primary ecological linkage."], ["Collision Hotspots", "26+ annual recorded collisions concentrate near Butterfield Ranch Rd (Postmile 4.2) and the SR-71 / CA-91 junction."], ["Water Access & Dawn/Dusk Movement", "Mule deer travel to Prado Basin water sources, with predator fatalities documented in low-visibility dawn and dusk windows."]]}]},
  }),
}
Object.assign(CORRIDORS, BAY_CORRIDORS, CENTRAL_CORRIDORS, SOUTHERN_CORRIDORS)
const HABITAT_STYLE = { fillColor: '#7AA974', fillOpacity: 0.18, color: '#5C8A56', weight: 1.5, dashArray: '3, 3' }
const PULSE_STYLE = { color: '#8B261D', weight: 12, opacity: 0.25, lineCap: 'round', className: 'corridor-pulse', interactive: false }
const INCIDENT_STYLE = { color: '#2C2C2C', fillColor: '#2C2C2C', fillOpacity: 0.4, weight: 1.5, radius: 6 }
const HIGHWAY_STYLE = { color: '#8B261D', weight: 4, opacity: 0.85, lineCap: 'round' }

const PIN_ICON = L.divIcon({
  className: '',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  html: `<svg width="28" height="36" viewBox="-9 -17 18 18" style="overflow:visible;filter:drop-shadow(0 0 10px rgba(162,72,56,0.5))">
    <path d="M0 0C-5-7-7-10-7-14a7 7 0 1 1 14 0c0 4-2 7-7 14z" fill="#A24838" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cy="-14" r="2.6" fill="#fff"/>
  </svg>`,
})

function FlyIn({ stretch, lockBounds, maxFlyZoom }) {
  const map = useMap()
  useEffect(() => {
    const lock = () => {
      map.setMinZoom(MIN_ZOOM)
      map.setMaxZoom(MAX_ZOOM)
      map.setMaxBounds(lockBounds)
    }
    map.invalidateSize()
    map.once('moveend', lock)
    const t = setTimeout(() => map.flyToBounds(stretch, { duration: 3, padding: [40, 40], maxZoom: maxFlyZoom }), 500)
    return () => {
      clearTimeout(t)
      map.off('moveend', lock)
    }
  }, [map, stretch, lockBounds, maxFlyZoom])
  return null
}

// Incident bubble shared by the corridor line and its hotspot nodes.
function IncidentBubble({ bubble }) {
  return (
    <PopupCard accent="#8B0000" title={bubble.title} subtitle={bubble.subtitle}>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#8B0000]">Recent Incidents</p>
      <p className="mt-1 text-sm leading-relaxed">{bubble.summary}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#2E5A36]">Primary Target</p>
      <p className="mt-1 text-sm leading-relaxed">{bubble.target}</p>
      <p className="mt-3 text-xs italic text-stone-500">Summary supplied by the project team; source citations pending.</p>
    </PopupCard>
  )
}

// Popup for a hotspot node: count, details and source as supplied by the project team.
function NodeBubble({ hotspot }) {
  return (
    <PopupCard accent="#8B0000" title={hotspot.title}>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#8B0000]">Verified Incident Count</p>
      <p className="mt-1 text-sm font-semibold leading-relaxed">{hotspot.count}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-stone-500">Incident Details</p>
      <p className="mt-1 text-sm leading-relaxed">{hotspot.details}</p>
      <p className="mt-3 text-xs italic text-stone-500">Source: {hotspot.source}</p>
    </PopupCard>
  )
}

// Side panel opened by Run Diagnostic; same shell as the US-101 Redwood diagnostic.
function DiagnosticPanel({ open, onClose, report }) {
  return (
    <aside
      aria-label="Corridor diagnostic"
      aria-hidden={!open}
      className={`shrink-0 overflow-hidden bg-white transition-all duration-300 ease-out ${
        open ? 'my-2 mr-2 rounded-2xl border border-stone-200 opacity-100 shadow-2xl' : 'pointer-events-none opacity-0'
      }`}
      style={{ width: open ? 'min(400px, 90%)' : 0 }}
    >
      <div className="relative h-full w-[400px] overflow-y-auto p-6 text-[#2C2C2C]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close diagnostic"
          tabIndex={open ? 0 : -1}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-stone-500 transition hover:bg-stone-100 hover:text-[#2C2C2C]"
        >
          ×
        </button>
        <header className="border-b border-stone-200 pb-5 pr-8">
          <h3 className="font-serif text-2xl leading-tight tracking-tight">{report.title}</h3>
          <p className="mt-2 text-sm text-stone-500">{report.subtitle}</p>
          <span className="mt-3 inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-[#8B0000]">
            High-Risk Wildlife Conflict Corridor
          </span>
        </header>
        {report.sections.map((sec) => (
          <section key={sec.heading} className="border-b border-stone-200 py-5 last:border-b-0">
            <h4 className="font-serif text-lg tracking-tight">{sec.heading}</h4>
            <p className="mt-2 text-sm leading-relaxed">{sec.body}</p>
            {sec.bullets && (
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                {sec.bullets.map(([label, text]) => (
                  <li key={label} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span><strong className="font-semibold">{label}:</strong> {text}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </aside>
  )
}

const SectionHeading = ({ num, id, children, blurb }) => (
  <>
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#8B0000]">{num}</span>
      <h2 id={id} className="font-serif text-3xl tracking-tight text-[#2C2C2C]">
        <span aria-hidden="true">— </span>{children}
      </h2>
    </div>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">{blurb}</p>
  </>
)

const CARD = 'relative flex flex-col overflow-hidden rounded-lg border-2 border-t-4 border-slate-200 border-t-emerald-600 bg-white p-6 shadow-sm transition-all hover:shadow-md'

export default function PlaceholderCorridorView({ corridorId }) {
  const c = CORRIDORS[corridorId]
  const [baseMap, setBaseMap] = useState('standard')
  const [showOverlays, setShowOverlays] = useState(true)
  const [diagOpen, setDiagOpen] = useState(false)
  const base = BASE_MAPS[baseMap]
  const rich = !!c?.habitats
  if (!c) return <p className="py-24 text-center text-stone-500">Corridor not found.</p>

  return (
    <div>
      {/* 01: corridor map */}
      <h2 className="font-serif text-4xl tracking-tight">{c.title}</h2>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <p className="text-sm text-stone-500">{c.subtitle}</p>
        {c.diagnostic && (
          <button
            type="button"
            onClick={() => setDiagOpen((v) => !v)}
            aria-pressed={diagOpen}
            className="rounded-full bg-[#7F1D1D] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#991B1B]"
          >
            Run Diagnostic
          </button>
        )}
      </div>

      <div className="relative isolate mt-6 flex h-[85vh] w-full flex-row overflow-hidden rounded-2xl border border-stone-200">
        <div className="relative h-full min-w-0 flex-1">
        <MapContainer key={corridorId} center={REGION_VIEW.center} zoom={REGION_VIEW.zoom} minZoom={5} maxZoom={MAX_ZOOM} maxBoundsViscosity={1} className="h-full w-full">
          <TileLayer key={baseMap} attribution={base.attribution} url={base.url} maxZoom={MAX_ZOOM} />
          {rich && showOverlays && c.habitats.map((h) => (
            <Polygon key={h.name} positions={h.points} pathOptions={HABITAT_STYLE}>
              <PopupCard accent="#2E5A36" title={h.title ?? 'Critical Habitat & Linkage Area'} subtitle={`${h.name} (approximate boundary)`}>
                {h.species ? (
                  <>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#2E5A36]">Target Animal Species</p>
                    <p className="mt-1 text-sm leading-relaxed">{h.species}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#2E5A36]">Estimated Local Population</p>
                    <p className="mt-1 text-sm leading-relaxed">{h.population}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#2E5A36]">{h.roleLabel ?? 'Ecosystem Importance'}</p>
                    <p className="mt-1 text-sm leading-relaxed">{h.importance}</p>
                    {h.obstruction && (
                      <>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#8B0000]">Obstruction Impact</p>
                        <p className="mt-1 text-sm leading-relaxed">{h.obstruction}</p>
                      </>
                    )}
                  </>
                ) : null}
              </PopupCard>
            </Polygon>
          ))}
          {(c.highways ?? (c.highway ? [c.highway] : [])).map((line, i) => !rich || showOverlays ? (
            <Fragment key={i}>
              {rich && <Polyline positions={line} pathOptions={PULSE_STYLE} />}
            <Polyline positions={line} pathOptions={HIGHWAY_STYLE}>
              {c.bubble ? <IncidentBubble bubble={c.bubble} /> : (
                <Popup>
                  <p className="text-sm font-semibold">{c.popup}</p>
                  <p className="mt-1 text-xs text-stone-500">Approximate alignment; detailed overlays are coming soon.</p>
                </Popup>
              )}
            </Polyline>
            </Fragment>
          ) : null)}
          {rich && showOverlays && c.incidents?.map((at) => (
            <CircleMarker key={at.join()} center={at} pathOptions={INCIDENT_STYLE} radius={INCIDENT_STYLE.radius}>
              {c.hotspot ? <NodeBubble hotspot={c.hotspot} /> : <IncidentBubble bubble={c.bubble} />}
            </CircleMarker>
          ))}
          <Marker position={c.site} icon={PIN_ICON} interactive={!!c.siteLabel}>
            {c.siteLabel && (
              <Popup>
                <p className="text-sm font-semibold">{c.siteLabel}</p>
              </Popup>
            )}
          </Marker>
          <ResizeOnChange watch={diagOpen} />
          <FlyIn stretch={c.stretch} lockBounds={c.lockBounds} maxFlyZoom={c.maxFlyZoom} />
        </MapContainer>
        <div className="absolute right-4 top-4 z-[1000] flex items-center gap-2 rounded-xl border border-[#E6E1DA] bg-[#FBF9F5]/90 p-1.5 text-xs font-medium text-[#5A524C] shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-0.5" role="group" aria-label="Base map">
            {Object.entries(BASE_MAPS).map(([id, b]) => (
              <button
                key={id}
                type="button"
                onClick={() => setBaseMap(id)}
                aria-pressed={baseMap === id}
                className={`rounded-lg px-3 py-1.5 transition ${baseMap === id ? 'bg-[#6E231A] text-white' : 'hover:bg-stone-200/60'}`}
              >
                {b.label}
              </button>
            ))}
          </div>
          {rich && (
            <>
              <span className="h-5 w-px bg-[#E6E1DA]" />
              <button
                type="button"
                onClick={() => setShowOverlays((v) => !v)}
                aria-pressed={showOverlays}
                className="rounded-lg px-3 py-1.5 transition hover:bg-stone-200/60"
              >
                Overlays: {showOverlays ? 'On' : 'Off'}
              </button>
            </>
          )}
        </div>
        </div>
        {c.diagnostic && (
          <DiagnosticPanel open={diagOpen} onClose={() => setDiagOpen(false)} report={c.diagnostic} />
        )}
      </div>
      {c.cohesion && (
        <section className="mt-4 rounded-lg border-2 border-t-4 border-slate-200 border-t-emerald-600 bg-white p-6 shadow-sm">
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">Environmental Cohesion Impact</h3>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-stone-700">{c.cohesion}</p>
        </section>
      )}
      {rich && (
        <ul className={`mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 px-2 text-xs font-medium text-[#5A524C] transition-opacity md:text-sm ${showOverlays ? '' : 'opacity-50'}`}>
          <li className="flex items-center gap-2.5"><span className="h-1 w-7 rounded-full bg-[#8B261D]/85" />High-Risk Conflict Zone{c.legendLine ? ` (${c.legendLine}, ${c.miles})` : ''}</li>
          <li className="flex items-center gap-2.5"><span className="h-4 w-4 rounded-sm border border-dashed border-[#5C8A56] bg-[#7AA974]/20" />Critical Habitat &amp; Linkage Area</li>
          {c.incidents?.length > 0 && (
            <li className="flex items-center gap-2.5"><span className="h-3.5 w-3.5 rounded-full border border-[#2C2C2C] bg-[#4A4A4A]/40" />Documented Incident Hotspot</li>
          )}
        </ul>
      )}
      {!rich && c.legend && (
        <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 px-2 text-xs font-medium text-[#5A524C] md:text-sm">
          <li className="flex items-center gap-2.5"><span className="h-1 w-7 rounded-full bg-[#8B261D]/85" />{c.legend}</li>
        </ul>
      )}

      {c.overview && (
        <p className="mt-6 max-w-3xl px-2 text-sm leading-relaxed text-stone-700">{c.overview}</p>
      )}

      {/* 02: existing solutions placeholder, or conflict analytics for the Bay Area corridors */}
      {c.existingSolution ? (
        <ExistingSolutions solution={c.existingSolution} />
      ) : c.analytics ? (
        <section aria-labelledby="i5-existing" className="mt-16 border-t border-stone-200 pt-12">
          <SectionHeading num="02" id="i5-existing" blurb={c.section2Blurb ?? 'Placeholder metrics for collision and mortality analysis along the corridor.'}>
            {c.section2Title ?? 'Conflict Analytics & Mortality Hotspots'}
          </SectionHeading>
          {c.solutions || c.solution ? (
            <div className="mt-8 space-y-6">
              {(c.solutions ?? [c.solution]).map((solution) => (
                <article key={solution.title} className={CARD}>
                  <span className="self-start rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    {solution.category}
                  </span>
                  <h3 className="mt-4 font-serif text-xl font-medium leading-snug text-slate-900 md:text-2xl">{solution.title}</h3>
                  <p className="mt-3 max-w-4xl text-sm leading-relaxed text-stone-700">{solution.description}</p>
                  <div className="mt-5">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">Key Impact</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2C2C2C]">{solution.impact}</p>
                  </div>
                  <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-medium text-emerald-900">
                    Source:{' '}
                    {solution.sourceUrl ? (
                      <a className="underline decoration-emerald-700/40 underline-offset-2 hover:text-emerald-700" href={solution.sourceUrl} target="_blank" rel="noreferrer">
                        {solution.source}
                      </a>
                    ) : solution.source}
                  </p>
                </article>
              ))}
            </div>
          ) : (
          <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {(c.metrics ?? [['Recorded Collisions'], ['Mortality Hotspots'], ['Species Affected']]).map(([label, value, sub]) => (
              <article key={label} className={CARD}>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                <p className={`mt-3 font-serif text-4xl ${value ? 'text-slate-900' : 'text-slate-300'}`}>{value ?? '\u2014'}</p>
                <p className="mt-2 text-sm text-stone-500">{sub ?? 'Data coming soon'}</p>
              </article>
            ))}
            </div>
          )}
        </section>
      ) : (
      <section aria-labelledby="i5-existing" className="mt-16 border-t border-stone-200 pt-12">
        <SectionHeading num="02" id="i5-existing" blurb="A review of baseline mitigations, field interventions, and active protocols currently deployed along the corridor.">
          Existing Solutions
        </SectionHeading>
        <div className="mt-8">
          <article className={CARD}>
            <span className="self-start rounded-full bg-slate-100 px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-500">Placeholder</span>
            <h3 className="mt-4 font-serif text-xl font-medium text-slate-900">{c.existing.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">{c.existing.body}</p>
          </article>
        </div>
      </section>
      )}

      {/* 03: generated solutions; live (5s loader, 3 cards) where cards exist, otherwise an inert placeholder */}
      {CORRIDOR_CARDS[corridorId] ? (
        <GeneratedSolutions
          cards={CORRIDOR_CARDS[corridorId]}
          pick={CORRIDOR_CARDS[corridorId].length}
          loadingMessage={['Analyzing spatial terrain...', 'Evaluating species movement vectors...', 'Synthesizing mitigation strategies...']}
        />
      ) : (
        <section aria-labelledby="i5-generated" className="mt-16 min-h-[70vh] border-t border-stone-200 pb-24 pt-16">
        <SectionHeading num="03" id="i5-generated" blurb="Simulated multi-tier mitigation strategies combining indigenous co-management, capital infrastructure, intelligent transport systems, and real-time telemetry.">
          Generated Corridor Solutions
        </SectionHeading>
        <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {[0, 1].map((i) => (
            <article key={i} className={CARD}>
              <span className="self-start rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">Category | Placeholder</span>
              <div className="mt-4 h-5 w-3/4 rounded bg-slate-100" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-11/12 rounded bg-slate-100" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
              </div>
            </article>
          ))}
        </div>
        <div className="mb-6 mt-10 flex justify-center">
          <button
            type="button"
            aria-disabled="true"
            className="cursor-default rounded-xl bg-emerald-700 px-10 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-emerald-800 md:text-lg"
          >
            Generate Solutions
          </button>
        </div>
        </section>
      )}
    </div>
  )
}
