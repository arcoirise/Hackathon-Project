"""Refresh the Caltrans traffic counts stored in data/corridors.json.

Run from the backend folder:  python scripts/fetch_traffic.py

For each corridor it asks Caltrans' public AADT (annual average daily traffic) service for the
count points on that highway inside the corridor's bounding box, and stores them under
corridors.<id>.traffic. Uses only the standard library.
"""
import json
import re
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

SERVICE = "https://caltrans-gis.dot.ca.gov/arcgis/rest/services/CHhighway/Traffic_AADT/FeatureServer/0/query"
ROUTE = {"sd-i15": "015", "cv-sr152": "152", "nb-sr37": "037"}
DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "corridors.json"


def to_int(value) -> int:
    """AADT fields come back as numbers or strings, and are blank where a direction wasn't counted."""
    try:
        return int(float(str(value).strip()))
    except ValueError:
        return 0


def fetch_counts(route: str, road: list[list[float]]) -> list[dict]:
    lats = [p[0] for p in road]
    lons = [p[1] for p in road]
    params = {
        "where": f"RTE='{route}'",
        "geometry": f"{min(lons) - 0.01},{min(lats) - 0.01},{max(lons) + 0.01},{max(lats) + 0.01}",
        "geometryType": "esriGeometryEnvelope",
        "inSR": "4326",
        "spatialRel": "esriSpatialRelIntersects",
        "outFields": "CNTY,PM_PFX,PM,DESCRIPTION,BACK_AADT,AHEAD_AADT",
        "returnGeometry": "true",
        "outSR": "4326",
        "f": "json",
    }
    with urllib.request.urlopen(f"{SERVICE}?{urllib.parse.urlencode(params)}", timeout=60) as res:
        features = json.load(res)["features"]
    counts = {}
    for f in features:
        a, g = f["attributes"], f["geometry"]
        aadt = max(to_int(a["BACK_AADT"]), to_int(a["AHEAD_AADT"]))
        if not aadt:
            continue
        # The service lists each point once per direction; keep one per county + postmile.
        key = (a["CNTY"], a["PM"])
        label = f"{a['DESCRIPTION'].title()} ({a['CNTY']} postmile {a['PM_PFX'] or ''}{a['PM']})"
        if key not in counts or aadt > counts[key]["aadt"]:
            counts[key] = {"label": label, "location": [round(g["y"], 4), round(g["x"], 4)], "aadt": aadt}
    return sorted(counts.values(), key=lambda c: (c["location"][1], c["location"][0]))


def main() -> None:
    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    for region_id, route in ROUTE.items():
        corridor = data["corridors"][region_id]
        corridor["traffic"] = {
            "source": "Caltrans Traffic Volumes (AADT) feature service",
            "url": SERVICE.rsplit("/query", 1)[0],
            "retrieved": date.today().isoformat(),
            "counts": fetch_counts(route, corridor["road"]),
        }
        print(region_id, len(corridor["traffic"]["counts"]), "count points")
    text = json.dumps(data, indent=2, ensure_ascii=False)
    # Keep [lat, lon] pairs and short id lists on one line, like the rest of the file.
    text = re.sub(r'\[\s+(-?[\d.]+),\s+(-?[\d.]+)\s+\]', r'[\1, \2]', text)
    text = re.sub(r'\[\s+("[^"\]]+"(?:,\s+"[^"\]]+")*)\s+\]', lambda m: '[' + re.sub(r',\s+', ', ', m.group(1)) + ']', text)
    text = re.sub(r'\[\s+\]', '[]', text)
    DATA_FILE.write_text(text + "\n", encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
