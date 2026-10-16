"""API checks. Run from the backend folder with `pytest`; CI runs them on every pull request."""
import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

import corridors
import main

DATA = Path(__file__).resolve().parent.parent / "data"
REGION_IDS = ["sd-i15", "cv-sr152", "nb-sr37"]
GENERATED = ["cv-sr152", "nb-sr37"]  # I-15's overlays are hand-drawn in the frontend

client = TestClient(main.app)


def get(path, **params):
    res = client.get(path, params=params)
    assert res.status_code == 200, res.text
    return res.json()


def raw_regions():
    return {r["id"]: r for r in json.loads((DATA / "regions.json").read_text(encoding="utf-8"))["regions"]}


# --- data files -----------------------------------------------------------------------------

def test_data_files_agree():
    data = corridors.load_data()
    assert sorted(data["corridors"]) == sorted(raw_regions())
    for rid, c in data["corridors"].items():
        assert set(c["species"]) <= set(data["species"]), rid
        for h in c["habitats"]:
            assert set(h["species"]) <= set(c["species"]), (rid, h["name"])
            assert h["radius_m"] > 0
        assert set(c.get("species_status", {})) <= set(c["species"]), rid
        assert c["traffic"]["counts"], f"{rid} has no traffic counts"
    for group, keys in data["group_solutions"].items():
        assert set(keys) <= set(data["solutions"]), group


# --- /api/regions (what the dashboard reads) --------------------------------------------------

def test_regions_list():
    regions = get("/api/regions")
    assert [r["id"] for r in regions] == REGION_IDS
    for r in regions:
        for key in ("name", "highway", "center", "zoom", "route", "sources"):
            assert key in r, (r["id"], key)


def test_i15_keeps_its_hand_drawn_data():
    i15 = dict(get("/api/regions/sd-i15"))
    assert i15.pop("sources")
    assert i15 == raw_regions()["sd-i15"]


@pytest.mark.parametrize("rid", GENERATED)
def test_generated_regions_have_every_field_the_map_and_cards_read(rid):
    r = get(f"/api/regions/{rid}")
    assert {"center", "radius", "label"} <= r["plateau"].keys() and r["plateau"]["kind"] == "habitat"
    assert {"positions", "label"} <= r["obstruction"].keys() and len(r["obstruction"]["positions"]) >= 4
    assert {"center", "label"} <= r["bridge"].keys() and r["bridge"]["kind"] == "proposed"
    for key in ("movement", "labels", "mortalitySites", "cards"):
        assert isinstance(r[key], list), key
    assert r["segment"] and r["summary"]
    titles = [c["title"] for c in r["cards"]]
    assert len(titles) == len(set(titles)), "card titles are React keys and must be unique"
    for card in r["cards"]:
        assert {"title", "subtext", "value"} <= card.keys()


def test_unknown_region_is_404():
    assert client.get("/api/regions/nope").status_code == 404
    assert client.get("/api/regions/nope/corridor").status_code == 404
    assert client.get("/api/regions/nope/crossings").status_code == 404


# --- /corridor --------------------------------------------------------------------------------

@pytest.mark.parametrize("rid", REGION_IDS)
def test_corridor(rid):
    c = get(f"/api/regions/{rid}/corridor")
    assert len(c["road"]) >= 2
    ids = {s["id"] for s in c["species"]}
    for h in c["habitats"]:
        assert {s["id"] for s in h["species"]} <= ids
    for s in c["species"]:
        assert s["scientific_name"] and isinstance(s["listed"], bool)
    for src in c["sources"]:
        assert src["title"] and src["url"].startswith("https://") and src["supports"]


# --- /crossings -------------------------------------------------------------------------------

@pytest.mark.parametrize("rid", REGION_IDS)
def test_crossings_priority_follows_the_rule(rid):
    found = get(f"/api/regions/{rid}/crossings", sensitivity=1)["crossings"]
    assert found
    for x in found:
        assert x["priority"] in ("High", "Medium", "Low")
        assert x["traffic"]["aadt"] > 0
        assert abs(x["vehicle_km_per_day"] - x["exposure_m"] / 1000 * x["traffic"]["aadt"]) <= 500
        high = x["vehicle_km_per_day"] >= corridors.HIGH_VEHICLE_KM or bool(x["listed_species"])
        medium = x["vehicle_km_per_day"] >= corridors.MEDIUM_VEHICLE_KM
        assert x["priority"] == ("High" if high else "Medium" if medium else "Low"), x["title"]
        assert x["priority_reason"]
        assert x["solutions"] and x["species"]


@pytest.mark.parametrize("rid", REGION_IDS)
def test_sensitivity_narrows_the_list(rid):
    ids = lambda s: [x["id"] for x in get(f"/api/regions/{rid}/crossings", sensitivity=s)["crossings"]]
    all_, medium_up, high_only = ids(1), ids(2), ids(3)
    assert set(high_only) <= set(medium_up) <= set(all_)
    for x in get(f"/api/regions/{rid}/crossings", sensitivity=3)["crossings"]:
        assert x["priority"] == "High"


def test_bad_sensitivity_is_rejected():
    assert client.get("/api/regions/sd-i15/crossings", params={"sensitivity": 9}).status_code == 422


def test_known_conflicts_stay_put():
    """Guards against accidental changes to road or habitat geometry."""
    exposure = {
        x["title"]: x["exposure_m"]
        for rid in REGION_IDS
        for x in get(f"/api/regions/{rid}/crossings", sensitivity=1)["crossings"]
    }
    assert exposure == {
        "Temecula Creek crossing": 4113,
        "Rainbow Canyon crossing": 3129,
        "Pacheco Pass summit crossing": 6257,
        "San Luis Reservoir north shore crossing": 3194,
        "Petaluma River crossing": 2547,
        "Sears Point / Tolay Creek crossing": 4130,
        "Napa-Sonoma Marshes crossing": 5699,
    }


def test_wetland_corridor_leads_with_a_causeway():
    for x in get("/api/regions/nb-sr37/crossings", sensitivity=1)["crossings"]:
        assert x["solutions"][0]["type"] == "causeway"
        assert x["solutions"][-1]["type"] == "fencing"
