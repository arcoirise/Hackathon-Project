"""Corridor geometry, habitat-crossing detection and mitigation concepts.

Region ids match data/regions.json. Data lives in data/corridors.json; nothing in it is
verified wildlife or engineering data (see its data_notes).
"""
import json
from math import cos, radians, sqrt
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query

DATA_FILE = Path(__file__).parent / "data" / "corridors.json"

router = APIRouter(prefix="/api/regions")


def load_data() -> dict:
    with DATA_FILE.open(encoding="utf-8") as f:
        return json.load(f)


def get_corridor(data: dict, region_id: str) -> dict:
    corridor = data["corridors"].get(region_id)
    if corridor is None:
        raise HTTPException(status_code=404, detail="Region not found")
    return corridor


def species_list(data: dict, ids: list[str]) -> list[dict]:
    return [{"id": s, **data["species"][s]} for s in ids]


def solutions_for(data: dict, species_ids: list[str], wetland: bool) -> list[dict]:
    """Match crossing-structure concepts to the animal groups at one crossing."""
    species = data["species"]
    plan = {"causeway": list(species_ids)} if wetland else {}
    for s in species_ids:
        for key in data["group_solutions"][species[s]["group"]]:
            plan.setdefault(key, []).append(s)
    # Fencing supports the other structures, so list it last.
    ordered = sorted(plan.items(), key=lambda item: item[0] == "fencing")
    return [
        {"type": key, **data["solutions"][key], "for_species": [species[s]["name"] for s in ids]}
        for key, ids in ordered
    ]


def xy(point: list[float], origin: list[float]) -> tuple[float, float]:
    """Local equirectangular projection in meters, suitable for small areas."""
    lat, lon = point
    lat0, lon0 = origin
    return ((lon - lon0) * 111320 * cos(radians(lat0)), (lat - lat0) * 111320)


def road_pieces(road: list[list[float]], origin: list[float], radius: float) -> list[tuple]:
    """Stretches of the road inside one circular habitat, as (entry, exit, length_m) tuples."""
    pieces = []
    for start, end in zip(road, road[1:]):
        ax, ay = xy(start, origin)
        bx, by = xy(end, origin)
        dx, dy = bx - ax, by - ay
        a = dx * dx + dy * dy
        if a == 0:
            continue
        b = 2 * (ax * dx + ay * dy)
        c = ax * ax + ay * ay - radius * radius
        disc = b * b - 4 * a * c
        ts = [0.0, 1.0]
        if disc >= 0:
            root = sqrt(disc)
            ts.extend([(-b - root) / (2 * a), (-b + root) / (2 * a)])
        ts = sorted(set(max(0.0, min(1.0, t)) for t in ts if 0 <= t <= 1))
        for t0, t1 in zip(ts, ts[1:]):
            mid = (t0 + t1) / 2
            if (ax + mid * dx) ** 2 + (ay + mid * dy) ** 2 < radius**2 and t1 - t0 > 1e-9:
                entry = [start[k] + t0 * (end[k] - start[k]) for k in (0, 1)]
                exit_ = [start[k] + t1 * (end[k] - start[k]) for k in (0, 1)]
                pieces.append((entry, exit_, sqrt(a) * (t1 - t0)))
    return pieces


def intersections(road: list[list[float]], origin: list[float], radius: float) -> dict | None:
    """Return entry/exit coordinates and length of the road inside one circular habitat."""
    pieces = road_pieces(road, origin, radius)
    if not pieces:
        return None
    length = sum(p[2] for p in pieces)
    # Marker goes halfway along the stretch of road inside the habitat.
    target = length / 2
    for entry, exit_, distance in pieces:
        if target <= distance:
            t = target / distance
            location = [entry[k] + t * (exit_[k] - entry[k]) for k in (0, 1)]
            break
        target -= distance
    return {"location": location, "entry": pieces[0][0], "exit": pieces[-1][1], "exposure_m": round(length)}


@router.get("/{region_id}/corridor")
def corridor(region_id: str):
    """The study corridor: OSM-traced road, illustrative habitat zones and the wildlife in them."""
    data = load_data()
    c = get_corridor(data, region_id)
    habitats = [
        {
            "id": f"{region_id}-{i + 1}",
            "name": h["name"],
            "center": h["center"],
            "radius_m": h["radius_m"],
            "species": species_list(data, h["species"]),
        }
        for i, h in enumerate(c["habitats"])
    ]
    return {
        "id": region_id,
        "name": c["name"],
        "highway": c["highway"],
        "center": c["center"],
        "zoom": c["zoom"],
        "wetland": c["wetland"],
        "road": c["road"],
        "habitats": habitats,
        "species": species_list(data, c["species"]),
        "sources": c["sources"],
        "data_notes": data["data_notes"],
    }


@router.get("/{region_id}/crossings")
def crossings(region_id: str, sensitivity: int = Query(2, ge=1, le=3)):
    """Where the road passes through a habitat zone, with affected wildlife and crossing concepts.

    sensitivity 3 keeps only High priority crossings.
    """
    data = load_data()
    c = get_corridor(data, region_id)
    results = find_crossings(data, region_id, c, sensitivity)
    return {"region": region_id, "sensitivity": sensitivity, "crossings": results, "data_notes": data["data_notes"], "demo": True}


def find_crossings(data: dict, region_id: str, c: dict, sensitivity: int) -> list[dict]:
    results = []
    for i, habitat in enumerate(c["habitats"]):
        crossing = intersections(c["road"], habitat["center"], habitat["radius_m"])
        if not crossing:
            continue
        # Demonstration priority from length of road inside the habitat, NOT collision risk.
        priority = "High" if crossing["exposure_m"] >= 3500 else "Medium"
        if sensitivity == 3 and priority != "High":
            continue
        animals = ", ".join(data["species"][s]["name"] for s in habitat["species"])
        results.append({
            "id": f"{region_id}-{i + 1}",
            "title": f"{habitat['name']} crossing",
            "priority": priority,
            "reason": (
                f"The approximate {c['highway']} alignment passes through an illustrative habitat zone "
                f"({animals}) for about {crossing['exposure_m']:,} m. Investigate a wildlife crossing with "
                "ecological and engineering experts; this is not a verified crossing site."
            ),
            **crossing,
            "habitat": habitat["name"],
            "species": species_list(data, habitat["species"]),
            "solutions": solutions_for(data, habitat["species"], c["wetland"]),
        })
    return results


# Dashboard fields. frontend/src/components/MapView.jsx and Diagnostics.jsx read plateau, obstruction,
# movement, bridge, labels, mortalitySites and cards. I-15's are hand-drawn in
# frontend/src/data/fallback.js, so corridors marked "hand_drawn_overlays" are left alone.

OBSTRUCTION_HALF_WIDTH_M = 450


def to_latlon(x: float, y: float, origin: list[float]) -> list[float]:
    lat0, lon0 = origin
    return [round(lat0 + y / 111320, 5), round(lon0 + x / (111320 * cos(radians(lat0))), 5)]


def buffer_line(points: list[list[float]], origin: list[float], half_width: float) -> list[list[float]]:
    """Polygon around a polyline, half_width meters to each side."""
    pts = [xy(p, origin) for p in points]
    left, right = [], []
    for i, (x, y) in enumerate(pts):
        (x0, y0), (x1, y1) = pts[max(i - 1, 0)], pts[min(i + 1, len(pts) - 1)]
        norm = sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2) or 1
        nx, ny = -(y1 - y0) / norm * half_width, (x1 - x0) / norm * half_width
        left.append(to_latlon(x + nx, y + ny, origin))
        right.append(to_latlon(x - nx, y - ny, origin))
    return left + right[::-1]


def with_dashboard(region: dict) -> dict:
    """Add the map overlays and diagnostic cards the dashboard reads, built from the corridor data.

    Only fields we can derive honestly are filled: there is no movement-tracking or verified
    roadkill data, so movement and mortalitySites stay empty.
    """
    data = load_data()
    c = data["corridors"].get(region["id"])
    if c is None:
        return region
    if c.get("hand_drawn_overlays"):
        return {**region, "sources": c["sources"]}
    found = find_crossings(data, region["id"], c, sensitivity=1)
    if not found:
        return {**region, "sources": c["sources"]}

    hw = region.get("highway", c["highway"])
    top = max(found, key=lambda x: x["exposure_m"])
    top_habitat = next(h for h in c["habitats"] if h["name"] == top["habitat"])
    main_habitat = max(c["habitats"], key=lambda h: h["radius_m"])
    pieces = road_pieces(c["road"], top_habitat["center"], top_habitat["radius_m"])
    stretch = [pieces[0][0]] + [p[1] for p in pieces]
    segment = c["name"].split("(")[-1].rstrip(")")
    species = [data["species"][s]["name"] for s in c["species"]]
    measures = [s["name"] for s in top["solutions"]]
    total_km = sum(x["exposure_m"] for x in found) / 1000

    priority_card = {"title": "Highest-priority conflict", "subtext": f"{top['habitat']}: {top['exposure_m'] / 1000:.1f} km of {hw} inside the zone", "value": top["priority"]}
    if top["priority"] == "High":
        priority_card["tone"] = "danger"

    return {
        **region,
        "route": c["road"],
        "center": c["center"],
        "zoom": c["zoom"],
        "sources": c["sources"],
        "segment": f"{segment} Segment",
        "summary": f"{hw} passes through {len(found)} illustrative habitat zones used by {', '.join(species)} in the {segment} segment.",
        "plateau": {"label": main_habitat["name"], "center": main_habitat["center"], "radius": main_habitat["radius_m"]},
        "obstruction": {
            "label": f"Obstruction zone: {hw} through {top['habitat']}",
            "positions": buffer_line(stretch, top_habitat["center"], OBSTRUCTION_HALF_WIDTH_M),
        },
        "movement": [],
        "bridge": {"label": f"Proposed crossing concept: {top['habitat']}", "center": top["location"]},
        "labels": [{"text": h["name"], "center": h["center"]} for h in c["habitats"] if h is not main_habitat],
        "mortalitySites": [],
        "cards": [
            {"title": "Species of concern", "subtext": ", ".join(species), "value": str(len(species)), "unit": "target species"},
            {"title": "Habitat conflicts", "subtext": f"Where {hw} passes through an illustrative habitat zone", "value": str(len(found)), "unit": "conflict points"},
            {"title": "Road inside habitat", "subtext": f"Approximate {hw} length inside habitat zones", "value": f"{total_km:.1f}", "unit": "km"},
            priority_card,
            {"title": "Suggested crossing concepts", "subtext": " + ".join(measures), "value": str(len(measures)), "unit": "measures"},
            {"title": "Collision mortality", "subtext": "No verified roadkill data for this corridor yet", "value": "Pending"},
        ],
    }
