# WildPass API (FastAPI)

## Run

The frontend expects this on port 8000 (`frontend/vite.config.js` proxies `/api` there).

macOS, in this folder:

```bash
python3 -m venv .venv            # first time only
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn main:app --reload
```

Windows (PowerShell), in this folder:

```powershell
python -m venv .venv             # first time only
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m uvicorn main:app --reload
```

Interactive docs: http://127.0.0.1:8000/docs

## Endpoints

Region ids: `sd-i15`, `cv-sr152`, `nb-sr37`.

| Endpoint | Returns | Data |
| --- | --- | --- |
| `GET /api/regions` | Every region: map view, `route`, `species`, `mortality`, `infrastructure`, `connectivity` | `data/regions.json` |
| `GET /api/regions/{id}` | One region, same shape | `data/regions.json` |
| `GET /api/regions/{id}/corridor` | The study corridor: OSM-traced `road`, illustrative `habitats` with the wildlife in each, all `species` (with scientific names), `sources` | `data/corridors.json` |
| `GET /api/regions/{id}/crossings?sensitivity=2` | Where the road passes through a habitat zone, with affected wildlife and suggested crossing concepts | `data/corridors.json` |

### Dashboard fields in `/api/regions`

The dashboard's `MapView` and `Diagnostics` read `plateau`, `obstruction`, `movement`, `bridge`, `labels`, `mortalitySites` and `cards`. For SR-152 and SR-37 the backend builds them from `corridors.json`:

| Field | Built from |
| --- | --- |
| `route`, `center`, `zoom` | The OSM-traced corridor, so the overlays line up with the road |
| `plateau` | The largest habitat zone, with `kind: "habitat"` (I-15's hand-drawn plateau has no `kind`) |
| `labels` | The other habitat zones' names |
| `obstruction` | A 450 m buffer around the stretch of highway inside the highest-priority habitat zone |
| `bridge` | That conflict's location, labeled "Proposed crossing concept", with `kind: "proposed"` so the map can style it apart from verified mortality sites |
| `cards` | Species, conflict count, km of road inside habitat, top conflict, suggested measures, collision data status |
| `segment`, `summary` | Header text for the corridor (not used by the UI yet) |
| `movement`, `mortalitySites` | Empty: there is no movement-tracking or verified roadkill data |

I-15 is marked `hand_drawn_overlays` in `corridors.json`, so its hand-drawn overlays in `frontend/src/data/fallback.js` are left alone.

Every region also gets `sources`: `[{title, publisher, date, url, supports}]`. These are studies and agency documents whose links were checked, and `supports` says what each one backs up. `date` is `null` when the page doesn't show one.

### `/corridor`

`{id, name, highway, center, zoom, wetland, road, habitats, species, sources, data_notes}`

- `road`: `[lat, lon]` points along the highway
- `habitats`: `[{id, name, center, radius_m, species}]`
- `species`: `[{id, name, scientific_name, group}]`, where `group` is `large`, `medium`, `small`, `semi_aquatic` or `bird`

### `/crossings`

`sensitivity` is 1–3 (default 2); 3 keeps only High priority crossings. Returns `{region, sensitivity, crossings, data_notes, demo}`. Each crossing has:

- `id`, `title`, `habitat`, `reason`
- `priority`: `High` when at least 3.5 km of road is inside the habitat zone, otherwise `Medium`. This is a demo ranking, not collision risk.
- `location` (marker), `entry`, `exit` (`[lat, lon]`) and `exposure_m` (meters of road inside the zone)
- `species`: affected animals
- `solutions`: `[{type, name, description, for_species}]`

| Solution `type` | Suggested for |
| --- | --- |
| `overpass` | Large mammals (vegetated wildlife overpass) |
| `underpass` | Mid-sized mammals (undercrossing or enlarged culvert) |
| `small_culvert` | Small mammals (small dry culverts with cover) |
| `dry_ledge` | Otters (waterway crossing with dry banks or ledges) |
| `fencing` | All ground animals (directional fencing toward the crossing) |
| `causeway` | Everything in a wetland corridor, i.e. SR-37 (elevated road segment) |

## What the data is

- `regions.json` metrics (mortality, traffic, connectivity) are illustrative placeholders.
- Corridor roads are approximate, traced from OpenStreetMap data (© OpenStreetMap contributors, ODbL) and simplified.
- Habitat zones are illustrative circles placed near known wildlife areas, not mapped habitat.
- Solutions are general structure types matched to animal size, not engineering recommendations. They line up with the agency proposals in `sources`: overcrossings, an undercrossing and fencing on SR-152, and an elevated causeway on SR-37.
