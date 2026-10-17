// Simplified California outline and region geometry for the explore map.
// Everything is hand-approximated from lon/lat and is meant for orientation, not cartography.

const LON_MIN = -124.6
const LAT_MAX = 42.1
const K = 40 // px per degree of latitude
const X_SCALE = Math.cos((37 * Math.PI) / 180) // squeeze longitude at California's mid-latitude

export const MAP_W = Math.round((124.6 - 114.0) * X_SCALE * K) + 20
export const MAP_H = Math.round((LAT_MAX - 32.4) * K) + 20

export const project = ([lon, lat]) => [
  10 + (lon - LON_MIN) * X_SCALE * K,
  10 + (LAT_MAX - lat) * K,
]

// [lon, lat], clockwise from the north-west corner.
const OUTLINE = [
  [-124.21, 42.0], [-120.0, 42.0], [-120.0, 39.0], [-114.63, 35.0], [-114.57, 34.8],
  [-114.13, 34.27], [-114.43, 34.08], [-114.53, 33.93], [-114.72, 33.4], [-114.5, 33.03],
  [-114.72, 32.72], [-117.12, 32.53], [-117.25, 32.85], [-117.4, 33.2], [-117.65, 33.45],
  [-118.1, 33.75], [-118.4, 33.75], [-118.5, 34.03], [-119.2, 34.15], [-119.7, 34.4],
  [-120.45, 34.45], [-120.65, 34.9], [-120.65, 35.15], [-121.0, 35.45], [-121.3, 35.7],
  [-121.9, 36.3], [-121.95, 36.6], [-122.0, 36.95], [-122.4, 37.2], [-122.5, 37.55],
  [-122.5, 37.8], [-123.0, 38.0], [-123.7, 38.9], [-123.8, 39.5], [-124.1, 40.0],
  [-124.4, 40.4], [-124.1, 41.0], [-124.2, 41.8],
]

export const OUTLINE_PATH =
  OUTLINE.map((p, i) => {
    const [x, y] = project(p)
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join('') + 'Z'

// Each region is the outline clipped to a lon/lat box; later boxes paint over earlier ones.
// [west, south, east, north]
const BOXES = {
  central: [-125, 34.9, -114, 38.95],
  southern: [-125, 32, -114, 34.9],
  northern: [-125, 38.95, -119.5, 42.5],
  bay: [-125, 36.85, -121.3, 38.95],
}

export const regionRect = (id) => {
  const [w, s, e, n] = BOXES[id]
  const [x1, y1] = project([w, n])
  const [x2, y2] = project([e, s])
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 }
}

// Tighter lon/lat windows used for the zoom (the land inside each region).
const VIEW = {
  northern: [-124.5, 38.95, -119.9, 42.05],
  bay: [-123.8, 36.85, -121.3, 38.95],
  central: [-122.2, 34.9, -115.5, 38.95],
  southern: [-120.7, 32.5, -114.1, 34.9],
}

export function regionViewBox(id) {
  if (!id) return `0 0 ${MAP_W} ${MAP_H}`
  const [w, s, e, n] = VIEW[id]
  const [x1, y1] = project([w, n])
  const [x2, y2] = project([e, s])
  const pad = 14
  let bw = x2 - x1 + pad * 2
  let bh = y2 - y1 + pad * 2
  // keep the map's aspect ratio so the SVG never letterboxes oddly
  const ratio = MAP_W / MAP_H
  if (bw / bh < ratio) bw = bh * ratio
  else bh = bw / ratio
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2
  return `${(cx - bw / 2).toFixed(1)} ${(cy - bh / 2).toFixed(1)} ${bw.toFixed(1)} ${bh.toFixed(1)}`
}

export const clipOrder = ['central', 'southern', 'northern', 'bay']

// Where each region's name sits on the overview map ([lon, lat] of a spot well inside the visible land).
const LABEL_AT = {
  northern: [-122.0, 40.6],
  bay: [-121.9, 38.15],
  central: [-118.9, 36.6],
  southern: [-116.9, 34.0],
}

export const regionLabelPoint = (id) => project(LABEL_AT[id])

// Fractional position of that label point inside the region's rect, used as the puff-out origin.
export function regionOrigin(id) {
  const { x, y, width, height } = regionRect(id)
  const [px, py] = regionLabelPoint(id)
  return { x: (px - x) / width, y: (py - y) / height }
}
