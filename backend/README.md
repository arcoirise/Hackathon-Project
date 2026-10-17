# WildPass API (FastAPI)

## Run

The easiest way is the start script in the project root, which runs the backend and frontend together: double-click `start-wildpass.bat` on Windows, or run `./start-wildpass.sh` on macOS. To run only the backend:

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

## Tests

```bash
pip install pytest httpx
pytest
```

The tests cover every endpoint, the priority rule, and the fields the dashboard reads. GitHub Actions (`.github/workflows/ci.yml`) runs them, plus the frontend build, on every pull request. A red ✗ on a PR means something broke.

## Refreshing traffic counts

`python scripts/fetch_traffic.py` re-downloads each corridor's Caltrans count points into `data/corridors.json`.

## Endpoints

Region ids: `sd-i15`, `cv-sr152`, `nb-sr37`, `us101-redwood` (the new frontend's US-101 corridor page).

| Endpoint | Returns | Data |
| --- | --- | --- |
| `GET /api/regions` | Every region: map view, `route`, `species`, `mortality`, `infrastructure`, `connectivity` | `data/regions.json` |
| `GET /api/regions/{id}` | One region, same shape | `data/regions.json` |
| `GET /api/regions/{id}/corridor` | The study corridor: OSM-traced `road`, illustrative `habitats` with the wildlife in each, all `species` (with scientific names), `sources` | `data/corridors.json` |
| `GET /api/regions/{id}/crossings?sensitivity=2` | Where the road passes through a habitat zone, with affected wildlife and suggested crossing concepts | `data/corridors.json` |

### Dashboard fields in `/api/regions`

The dashboard's `MapView` and `Diagnostics` read `route`, `plateau`, `obstruction`, `movement`, `bridge`, `labels`, `mortalitySites` and `cards`. Every region gets all of them, so no region depends on the frontend's fallback. For SR-152 and SR-37 the backend builds them from `corridors.json`:

| Field | Built from |
| --- | --- |
| `route`, `center`, `zoom` | The OSM-traced corridor, so the overlays line up with the road |
| `plateau` | The largest habitat zone |
| `labels` | The other habitat zones' names |
| `obstruction` | A 450 m buffer around the stretch of highway inside the highest-priority habitat zone |
| `bridge` | That conflict's location, labeled "Proposed crossing concept" |
| `cards` | Species (with a corridor's `species_note`, e.g. SR-152's black bear), protected species (if any), daily traffic, conflict count and km of road inside habitat, top conflict with its priority reason, suggested measures (with the official plan in `plan_note`), collision data status |
| `segment` | The corridor segment's name |
| `mortalitySites` | Verified, located roadkill records with a `source` (SR-152's tule elk); empty when there are none |
| `movement` | Empty: there is no movement-tracking data |

I-15 keeps the frontend team's hand-drawn design: its plateau, obstruction zone, movement arrows, labels and cards are in the `hand_drawn` block of `corridors.json` (copied from `frontend/src/data/fallback.js`, with the arrow ends moved onto the real road and each card claim sourced). Its `route`, `bridge` and `mortalitySites` are built like the other regions', and it keeps the map view in `regions.json`.

Every region also gets `sources`: `[{title, publisher, date, url, supports}]`. These are studies and agency documents whose links were checked, and `supports` says what each one backs up. `date` is `null` when the page doesn't show one.

### `/corridor`

`{id, name, highway, center, zoom, wetland, road, habitats, species, traffic, sources, data_notes}`

- `road`: `[lat, lon]` points along the highway
- `habitats`: `[{id, name, center, radius_m, species}]`
- `species`: `[{id, name, scientific_name, group, status, listed}]`
  - `group` is `large`, `medium`, `small`, `semi_aquatic` or `bird`.
  - `status` is the legal protection label (or `null`), and `listed` is `true` for endangered or threatened species.
- `traffic`: Caltrans count points along the corridor, `{source, url, retrieved, counts: [{label, location, aadt}]}`

### `/crossings`

`sensitivity` is 1–3 (default 2): 1 returns everything, 2 returns Medium and High, 3 returns High only. Returns `{region, sensitivity, crossings, data_notes, demo}`. Each crossing has:

- `id`, `title`, `habitat`, `reason`
- `location` (marker), `entry`, `exit` (`[lat, lon]`) and `exposure_m` (meters of road inside the zone)
- `traffic`: `{aadt, count_point, distance_km}`, the Caltrans count nearest the crossing
- `vehicle_km_per_day`: `exposure_m / 1000 x aadt`, rounded to 1,000. This is how much driving passes through the habitat zone each day.
- `listed_species`: names of endangered or threatened species in the zone
- `evidence`: verified roadkill records within 6 km of the crossing, e.g. the tule elk hit near San Luis Reservoir in 2022
- `priority` and `priority_reason`, set by the rule below
- `species`: affected animals, with `status` and `listed`
- `solutions`: `[{type, name, description, for_species}]`

**Priority rule:**
- **High:** `vehicle_km_per_day` ≥ 200,000, or a listed species is present.
- **Medium:** ≥ 75,000.
- **Low:** everything else.

It ranks where to look first; it is not a measured collision risk.

| Solution `type` | Suggested for |
| --- | --- |
| `overpass` | Large mammals (vegetated wildlife overpass) |
| `underpass` | Mid-sized mammals (undercrossing or enlarged culvert) |
| `small_culvert` | Small mammals (small dry culverts with cover) |
| `dry_ledge` | Otters (waterway crossing with dry banks or ledges) |
| `fencing` | All ground animals (directional fencing toward the crossing) |
| `causeway` | Everything in a wetland corridor, i.e. SR-37 (elevated road segment) |

## What the data is

- Traffic counts are real: Caltrans annual average daily traffic (AADT), retrieved 2026-10-16. `regions.json`'s `avg_daily_traffic` now uses them too.
- Protection statuses are cited in each corridor's `sources`:
  - salt marsh harvest mouse: federal and California endangered
  - Santa Ana Mountains mountain lions: threatened under CESA, February 2026
- Roadkill is real where it exists:
  - SR-152: 42 animals recorded June 2021 to June 2022, plus a tule elk in February 2022 (Pathways for Wildlife 2023).
  - I-15: at least 6 lions found dead on the freeway, 2001 to 2013 (Vickers et al. 2015).
  - SR-37: no verified data yet.
- `regions.json`'s mortality blocks hold these figures. The SR-152 linkage and existing crossings (29 culverts and bridges) come from the same study.
- The I-15 and SR-37 linkage names come from the 2023 I-15 design report and USGS (`linkage_source`). Lanes: I-15 10 (UC Davis), SR-37 2, i.e. one lane each way between SR 121 and Mare Island (Caltrans). No source counts the existing crossings on I-15 or SR-37, so those are `null` with a note.
- Every region in `/api/regions` carries a `data_note` saying what is sourced. Still placeholders: connectivity score, habitat hectares, barrier type, species habitat descriptions and SR-152 lanes.
- Corridor roads are approximate, traced from OpenStreetMap data (© OpenStreetMap contributors, ODbL) and simplified.
- Habitat zones are illustrative circles placed near known wildlife areas, not mapped habitat.
- Solutions are general structure types matched to animal size, not engineering recommendations. They line up with the agency proposals in `sources`: overcrossings, an undercrossing and fencing on SR-152, and an elevated causeway on SR-37.
