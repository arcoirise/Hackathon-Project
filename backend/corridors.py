"""Corridor geometry, habitat-crossing detection, priority and mitigation concepts.

Region ids match data/regions.json. Data lives in data/corridors.json: roads are traced from
OpenStreetMap and habitat zones are illustrative (see its data_notes); traffic counts come from
Caltrans (refresh with scripts/fetch_traffic.py) and species statuses are cited in sources.
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


def species_list(data: dict, ids: list[str], statuses: dict | None = None) -> list[dict]:
    """Species with their protection status in this corridor (status is None when not listed)."""
    statuses = statuses or {}
    return [
        {
            "id": s,
            **data["species"][s],
            "status": statuses.get(s, {}).get("label"),
            "listed": statuses.get(s, {}).get("listed", False),
        }
        for s in ids
    ]


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


def km_between(a: list[float], b: list[float]) -> float:
    dx, dy = xy(a, b)
    return sqrt(dx * dx + dy * dy) / 1000


def nearest_count(counts: list[dict], location: list[float]) -> tuple[dict | None, float]:
    """The Caltrans traffic count point closest to a location, and its distance in km."""
    best, best_d = None, float("inf")
    for count in counts:
        d = km_between(count["location"], location)
        if d < best_d:
            best, best_d = count, d
    return best, best_d


# A verified roadkill record this close to a crossing is listed as evidence for it.
EVIDENCE_KM = 6


# Priority: how much driving passes through the habitat zone each day, plus legal protection.
# High if >= 200,000 vehicle-km/day or a listed (endangered/threatened) species is present,
# Medium if >= 75,000 vehicle-km/day, otherwise Low.
HIGH_VEHICLE_KM = 200_000
MEDIUM_VEHICLE_KM = 75_000
PRIORITY_RANK = {"High": 2, "Medium": 1, "Low": 0}
MIN_RANK_FOR_SENSITIVITY = {1: 0, 2: 1, 3: 2}  # 1 = all, 2 = Medium and High, 3 = High only


def rate(exposure_m: int, aadt: int | None, listed: list[str]) -> tuple[str, int | None, str]:
    """Return (priority, vehicle_km_per_day, one-sentence reason)."""
    km = exposure_m / 1000
    vehicle_km = int(round(km * aadt, -3)) if aadt else None  # nearest 1,000: the inputs aren't more precise
    if (vehicle_km or 0) >= HIGH_VEHICLE_KM or listed:
        priority = "High"
    elif (vehicle_km or 0) >= MEDIUM_VEHICLE_KM:
        priority = "Medium"
    else:
        priority = "Low"
    reasons = []
    if vehicle_km is not None:
        reasons.append(f"{km:.1f} km of road × {aadt:,} vehicles/day ≈ {vehicle_km:,} vehicle-km of driving through the zone daily")
    else:
        reasons.append(f"{km:.1f} km of road inside the zone (no traffic count nearby)")
    if listed:
        reasons.append(f"protected species present: {', '.join(listed)}")
    text = "; ".join(reasons)
    return priority, vehicle_km, text[:1].upper() + text[1:] + "."


@router.get("/{region_id}/corridor")
def corridor(region_id: str):
    """The study corridor: OSM-traced road, illustrative habitat zones and the wildlife in them."""
    data = load_data()
    c = get_corridor(data, region_id)
    statuses = c.get("species_status", {})
    habitats = [
        {
            "id": f"{region_id}-{i + 1}",
            "name": h["name"],
            "center": h["center"],
            "radius_m": h["radius_m"],
            "species": species_list(data, h["species"], statuses),
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
        "species": species_list(data, c["species"], statuses),
        "traffic": c.get("traffic"),
        "sources": c["sources"],
        "data_notes": data["data_notes"],
    }


@router.get("/{region_id}/crossings")
def crossings(region_id: str, sensitivity: int = Query(2, ge=1, le=3)):
    """Where the road passes through a habitat zone, with affected wildlife and crossing concepts.

    sensitivity 1 returns every crossing, 2 Medium and High, 3 High only.
    """
    data = load_data()
    c = get_corridor(data, region_id)
    results = find_crossings(data, region_id, c, sensitivity)
    return {"region": region_id, "sensitivity": sensitivity, "crossings": results, "data_notes": data["data_notes"], "demo": True}


def find_crossings(data: dict, region_id: str, c: dict, sensitivity: int) -> list[dict]:
    statuses = c.get("species_status", {})
    counts = c.get("traffic", {}).get("counts", [])
    results = []
    for i, habitat in enumerate(c["habitats"]):
        crossing = intersections(c["road"], habitat["center"], habitat["radius_m"])
        if not crossing:
            continue
        count, distance_km = nearest_count(counts, crossing["location"])
        aadt = count["aadt"] if count else None
        listed = [data["species"][s]["name"] for s in habitat["species"] if statuses.get(s, {}).get("listed")]
        priority, vehicle_km, why = rate(crossing["exposure_m"], aadt, listed)
        if PRIORITY_RANK[priority] < MIN_RANK_FOR_SENSITIVITY[sensitivity]:
            continue
        animals = ", ".join(data["species"][s]["name"] for s in habitat["species"])
        evidence = [
            f"{site['label']}, {km_between(site['center'], crossing['location']):.1f} km from this crossing"
            for site in c.get("mortality", {}).get("sites", [])
            if km_between(site["center"], crossing["location"]) <= EVIDENCE_KM
        ]
        results.append({
            "id": f"{region_id}-{i + 1}",
            "title": f"{habitat['name']} crossing",
            "priority": priority,
            "priority_reason": why,
            "reason": (
                f"The approximate {c['highway']} alignment passes through an illustrative habitat zone "
                f"({animals}) for about {crossing['exposure_m']:,} m. Investigate a wildlife crossing with "
                "ecological and engineering experts; this is not a verified crossing site."
            ),
            **crossing,
            "traffic": {
                "aadt": aadt,
                "count_point": count["label"] if count else None,
                "distance_km": round(distance_km, 1) if count else None,
            } if count else None,
            "vehicle_km_per_day": vehicle_km,
            "listed_species": listed,
            "evidence": evidence,
            "habitat": habitat["name"],
            "species": species_list(data, habitat["species"], statuses),
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

    Only fields we can derive honestly are filled: there is no movement-tracking data, so movement
    stays empty, and mortalitySites only holds verified, located roadkill records from sources.
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
    top = max(found, key=lambda x: (PRIORITY_RANK[x["priority"]], x["vehicle_km_per_day"] or 0, x["exposure_m"]))
    top_habitat = next(h for h in c["habitats"] if h["name"] == top["habitat"])
    main_habitat = max(c["habitats"], key=lambda h: h["radius_m"])
    pieces = road_pieces(c["road"], top_habitat["center"], top_habitat["radius_m"])
    stretch = [pieces[0][0]] + [p[1] for p in pieces]
    segment = c["name"].split("(")[-1].rstrip(")").removesuffix(" Corridor")
    species = [data["species"][s]["name"] for s in c["species"]]
    measures = [s["name"] for s in top["solutions"]]
    total_km = sum(x["exposure_m"] for x in found) / 1000

    statuses = c.get("species_status", {})
    protected = [f"{data['species'][s]['name']}: {statuses[s]['label']}" for s in c["species"] if statuses.get(s, {}).get("listed")]

    priority_card = {"title": "Highest-priority conflict", "subtext": f"{top['habitat']}. {top['priority_reason']}", "value": top["priority"]}
    if top["priority"] == "High":
        priority_card["tone"] = "danger"
    cards = [{"title": "Species of concern", "subtext": ", ".join(species), "value": str(len(species)), "unit": "target species"}]
    if protected:
        cards.append({"title": "Protected species", "subtext": "; ".join(protected), "value": str(len(protected)), "unit": "listed", "tone": "danger"})
    if top["traffic"]:
        cards.append({
            "title": "Daily traffic",
            "subtext": f"Caltrans count at {top['traffic']['count_point']}, nearest to {top['habitat']}",
            "value": f"{top['traffic']['aadt']:,}",
            "unit": "vehicles per day",
        })
    mortality = c.get("mortality")
    if mortality:
        mortality_card = {"title": "Collision mortality", "subtext": mortality["summary"], "value": str(mortality["total"]), "unit": "animals hit"}
    else:
        mortality_card = {"title": "Collision mortality", "subtext": "No verified roadkill data for this corridor yet", "value": "Pending"}
    cards += [
        {"title": "Habitat conflicts", "subtext": f"Places where {hw} passes through an illustrative habitat zone, {total_km:.1f} km in total", "value": str(len(found)), "unit": "conflict points"},
        priority_card,
        {"title": "Suggested crossing concepts", "subtext": " + ".join(measures), "value": str(len(measures)), "unit": "measures"},
        mortality_card,
    ]

    return {
        **region,
        "route": c["road"],
        "center": c["center"],
        "zoom": c["zoom"],
        "sources": c["sources"],
        "segment": f"{segment} Segment",
        "summary": f"{hw} passes through {len(found)} illustrative habitat zones used by {', '.join(species)} in the {segment} segment.",
        "plateau": {"label": main_habitat["name"], "center": main_habitat["center"], "radius": main_habitat["radius_m"], "kind": "habitat"},
        "obstruction": {
            "label": f"Obstruction zone: {hw} through {top['habitat']}",
            "positions": buffer_line(stretch, top_habitat["center"], OBSTRUCTION_HALF_WIDTH_M),
        },
        "movement": [],
        "bridge": {"label": f"Proposed crossing concept: {top['habitat']}", "center": top["location"], "kind": "proposed"},
        "labels": [{"text": h["name"], "center": h["center"]} for h in c["habitats"] if h is not main_habitat],
        # Only verified, located roadkill records; each carries its source.
        "mortalitySites": (mortality or {}).get("sites", []),
        "cards": cards,
    }
