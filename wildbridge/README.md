# WildBridge AI — Hackathon backend

A Flask API computes where **approximate highway alignments** intersect **illustrative circular habitat zones** in three California corridors, and suggests general wildlife-crossing concepts for the animals in each zone. This is not verified wildlife data, accident prediction, or engineering design.

## Run

macOS, in this folder:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Windows (PowerShell), in this folder:

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python app.py
```

The API is then on http://127.0.0.1:5000. The WildPass dashboard (the React app in the project root) reaches it through the Vite proxy; see the root `README.md`. The `index.html` in this folder is the original single-page prototype, served at http://127.0.0.1:5000. Don't open it directly from disk, because the API only works when Flask serves it.

## API

- `GET /api/health` → server status
- `GET /api/regions` → every study region, for drawing the map
- `POST /api/analyze` with `{"region":"i15","sensitivity":2}` → computed crossings

Regions:

| id | Corridor | Primary wildlife |
| --- | --- | --- |
| `i15` | San Diego County: Interstate 15 (Temecula / Rainbow Canyon) | Mountain Lion, Mule Deer, Bobcat |
| `hwy152` | Central Valley / South Bay: Highway 152 (Pacheco Pass / San Luis Reservoir) | Tule Elk, Black Bear, Coyote |
| `sr37` | North Bay: State Route 37 (San Pablo Baylands Corridor) | Marsh Hawk, Salt Marsh Harvest Mouse, Waterfowl, River Otter |

Sensitivity: 1–3 (3 filters to high-exposure crossings).

### `GET /api/regions`

Returns `{"regions": [...], "data_notes": {...}, "demo": true}`. Each region has:

- `id`, `name`, `highway`
- `center` (`[lat, lon]`) and `zoom` for the map view
- `road`: list of `[lat, lon]` points along the highway
- `habitats`: list of `{id, name, center, radius_m, species}`
- `species`: list of `{id, name, scientific_name, group}`, where `group` is `large`, `medium`, `small`, `semi_aquatic` or `bird`
- `wetland`: `true` for SR-37
- `sources`: reference links (empty until the team adds them)
- `mortality`: recorded roadkill for the corridor, `{total, period, per_year: [{year, count}], hotspots: [{label, count}], source}`. It is `null` until real data with a citable source is added; don't fill it with made-up numbers.

### `POST /api/analyze`

Returns `{"region", "sensitivity", "crossings": [...], "demo": true, "data_notes"}`. Each crossing has `id`, `title`, `priority`, `reason`, `location`, `entry`, `exit` and `exposure_m`, plus:

- `habitat`: name of the habitat zone
- `species`: affected animals, `{id, name, scientific_name, group}`
- `solutions`: suggested concepts, `{type, name, description, for_species}`

| Solution `type` | Suggested for |
| --- | --- |
| `overpass` | Large mammals (vegetated wildlife overpass) |
| `underpass` | Mid-sized mammals (undercrossing or enlarged culvert) |
| `small_culvert` | Small mammals (small dry culverts with cover) |
| `dry_ledge` | Otters (waterway crossing with dry banks or ledges) |
| `fencing` | All ground animals (directional fencing that guides them to the crossing) |
| `causeway` | Everything in a wetland region (elevated road segment over the marsh) |

### Data

Road alignments are approximate, traced from OpenStreetMap data (© OpenStreetMap contributors, ODbL) via the OSRM routing service and simplified. Habitat zones are illustrative circles placed near known wildlife areas, not mapped habitat boundaries. The server finds segment–circle intersections in a local meter-based projection. Habitat exposure length is used only for demonstration priority, not wildlife risk. Proposed crossing markers are conceptual locations, and solutions are general structure types matched to animal groups; the algorithm does not determine actual bridge spans or suitability.

## Next steps

Replace demo highway polylines with verified highway centerlines, replace simulated circles with authoritative habitat/corridor GIS polygons, and validate candidates against species movement, collision history, terrain, land ownership and engineering feasibility. Do not present demo markers as real construction recommendations.
