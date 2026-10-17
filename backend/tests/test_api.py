"""API checks. Run from the backend folder with `pytest`; CI runs them on every pull request."""
import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

import corridors
import main

DATA = Path(__file__).resolve().parent.parent / "data"
REGION_IDS = ["sd-i15", "cv-sr152", "nb-sr37"]

client = TestClient(main.app)


def get(path, **params):
    res = client.get(path, params=params)
    assert res.status_code == 200, res.text
    return res.json()


def raw_regions():
    return {r["id"]: r for r in json.loads((DATA / "regions.json").read_text(encoding="utf-8"))["regions"]}


def card(region, title):
    return next(c for c in region["cards"] if c["title"] == title)


def is_point(p):
    return isinstance(p, list) and len(p) == 2 and all(isinstance(v, (int, float)) for v in p)


def meters_from_road(point, road):
    best = float("inf")
    for a, b in zip(road, road[1:]):
        ax, ay = corridors.xy(a, point)
        bx, by = corridors.xy(b, point)
        dx, dy = bx - ax, by - ay
        t = max(0.0, min(1.0, -(ax * dx + ay * dy) / ((dx * dx + dy * dy) or 1)))
        best = min(best, ((ax + t * dx) ** 2 + (ay + t * dy) ** 2) ** 0.5)
    return best


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


@pytest.mark.parametrize("rid", REGION_IDS)
def test_every_region_has_every_field_the_map_and_cards_read(rid):
    """Mirrors what MapView.jsx and Diagnostics.jsx do with each field, so no region can crash the page."""
    r = get(f"/api/regions/{rid}")
    assert is_point(r["center"]) and isinstance(r["zoom"], int)
    assert len(r["route"]) >= 2 and all(map(is_point, r["route"]))
    assert isinstance(r["plateau"]["label"], str) and is_point(r["plateau"]["center"]) and r["plateau"]["radius"] > 0
    assert isinstance(r["obstruction"]["label"], str)
    assert len(r["obstruction"]["positions"]) >= 3 and all(map(is_point, r["obstruction"]["positions"]))
    assert all(len(path) >= 2 and all(map(is_point, path)) for path in r["movement"])
    assert isinstance(r["bridge"]["label"], str) and is_point(r["bridge"]["center"])
    # labels, mortalitySites and cards are React lists keyed by text, label and title.
    assert all(isinstance(l["text"], str) and is_point(l["center"]) for l in r["labels"])
    assert len({l["text"] for l in r["labels"]}) == len(r["labels"])
    assert all(isinstance(s["label"], str) and is_point(s["center"]) for s in r["mortalitySites"])
    assert len({s["label"] for s in r["mortalitySites"]}) == len(r["mortalitySites"])
    assert r["cards"] and len({c["title"] for c in r["cards"]}) == len(r["cards"])
    for c in r["cards"]:
        assert all(isinstance(c[k], str) and c[k] for k in ("title", "subtext", "value")), c
    assert r["segment"].endswith("Segment")


def test_i15_keeps_the_frontend_teams_design_on_the_real_road():
    i15 = get("/api/regions/sd-i15")
    raw = raw_regions()["sd-i15"]
    assert (i15["center"], i15["zoom"]) == (raw["center"], raw["zoom"])
    assert i15["plateau"]["label"] == "Santa Rosa Plateau" and [l["text"] for l in i15["labels"]] == ["Temecula", "Rainbow"]
    assert len(i15["movement"]) == 3
    for path in i15["movement"]:
        assert meters_from_road(path[-1], i15["route"]) < 50, "blocked-movement arrows end at the highway"
    assert meters_from_road(i15["bridge"]["center"], i15["route"]) < 50
    assert i15["mortalitySites"] == [], "no located, verified I-15 roadkill record yet"
    assert [c["title"] for c in i15["cards"]] == [
        "Species of concern", "I-15 barrier effect", "Genetic fragmentation",
        "Collision mortality", "Verified mortality corridor", "Planned crossings",
    ]


def test_i15_cards_match_the_data_and_cite_sources():
    i15 = get("/api/regions/sd-i15")
    c = corridors.load_data()["corridors"]["sd-i15"]
    found = {x["habitat"]: x for x in get("/api/regions/sd-i15/crossings", sensitivity=1)["crossings"]}
    segment = sorted(k["aadt"] for k in c["traffic"]["counts"] if 33.39 <= k["location"][0] <= 33.57)

    traffic = card(i15, "I-15 barrier effect")
    assert traffic["value"] == f"{found['Temecula Creek']['traffic']['aadt']:,}" == "169,000"
    assert f"{found['Rainbow Canyon']['traffic']['aadt']:,} near Rainbow Canyon" in traffic["subtext"]
    assert f"{segment[0]:,} to {segment[-1]:,} across the {len(segment)} count points" in traffic["subtext"]
    assert "8-lane" not in traffic["subtext"] and "10-lane" in traffic["subtext"]
    assert raw_regions()["sd-i15"]["infrastructure"]["lanes"] == 10

    genetics = card(i15, "Genetic fragmentation")
    assert "nearly impermeable barrier" in genetics["subtext"] and "severe genetic restriction" in genetics["subtext"]
    assert "cessation" not in genetics["subtext"]
    assert card(i15, "Verified mortality corridor")["value"] == str(c["mortality"]["total"]) == "6"
    assert "28%" in card(i15, "Verified mortality corridor")["subtext"]
    assert card(i15, "Collision mortality")["value"] == "1-2"

    urls = {s["url"] for s in i15["sources"]}
    for cited in ("10.1371/journal.pone.0131490", "highway-runs-through-it", "mountain-lion-mortality-map", "I-15_Wildlife_Crossing_Design"):
        assert any(cited in u for u in urls), cited


def test_sr152_names_black_bear_but_does_not_analyse_it():
    r = get("/api/regions/cv-sr152")
    species = card(r, "Species of concern")
    assert species["value"] == "4"
    assert "Black Bear" in species["subtext"] and "not recorded" in species["subtext"]
    for fact in ("7,554", "23 culverts and 6 bridges", "42 animals hit", "2022-02-17"):
        assert fact in species["subtext"], fact
    names = {s["name"] for s in get("/api/regions/cv-sr152/corridor")["species"]}
    assert names == {"Tule Elk", "Mule Deer", "Mountain Lion", "Coyote"}


def test_sr152_and_sr37_figures_match_their_sources():
    sr152, sr37 = get("/api/regions/cv-sr152"), get("/api/regions/nb-sr37")
    assert card(sr152, "Daily traffic")["value"] == "37,000"
    assert card(sr152, "Collision mortality")["value"] == "42"
    assert "CEQAnet 2025100438" in card(sr152, "Suggested crossing concepts")["subtext"]
    assert any(s["url"] == "https://ceqanet.lci.ca.gov/2025100438" for s in sr152["sources"])

    assert card(sr37, "Daily traffic")["value"] == "34,500"
    aadt = {x["traffic"]["aadt"] for x in get("/api/regions/nb-sr37/crossings", sensitivity=1)["crossings"]}
    assert (min(aadt), max(aadt)) == (34500, 36500)
    assert card(sr37, "Protected species")["subtext"] == "Salt Marsh Harvest Mouse: Endangered (federal and California)"
    assert "elevated causeway" in card(sr37, "Suggested crossing concepts")["subtext"]


def test_data_brief_figures_match_the_cards_and_sources():
    """regions.json's own figures go out in the downloadable data brief, so they must agree with the cards."""
    raw = raw_regions()
    for r in get("/api/regions"):
        infra, link = raw[r["id"]]["infrastructure"], raw[r["id"]]["connectivity"]
        traffic = next(c for c in r["cards"] if c["title"] in ("Daily traffic", "I-15 barrier effect"))
        assert traffic["value"] == f"{infra['avg_daily_traffic']:,}", r["id"]
        assert link["linkage_source"] in {s["url"] for s in r["sources"]}, r["id"]
        assert infra["existing_crossings"] is not None or infra["existing_crossings_note"], r["id"]
    sr37 = get("/api/regions/nb-sr37")
    assert raw["nb-sr37"]["infrastructure"]["lanes"] == 2, "one lane each way between SR 121 and Mare Island"
    assert any("sears-point-mare-island" in s["url"] for s in sr37["sources"])


def test_no_placeholders_reach_the_dashboard():
    text = client.get("/api/regions").text
    for placeholder in ("[#]", "TODO", "TBD", "lorem"):
        assert placeholder not in text, placeholder


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


def test_mortality_sites_are_verified_and_on_the_map():
    r = get("/api/regions/cv-sr152")
    assert r["mortalitySites"], "SR-152 has a located roadkill record"
    for site in r["mortalitySites"]:
        assert site["source"].startswith("https://") and len(site["center"]) == 2
    card = next(c for c in r["cards"] if c["title"] == "Collision mortality")
    assert card["value"] == "42"
    assert get("/api/regions/nb-sr37")["mortalitySites"] == []


def test_every_region_says_what_is_sourced():
    for r in get("/api/regions"):
        assert "placeholder" in r["data_note"]


@pytest.mark.parametrize("name", ["regions.json", "corridors.json"])
def test_data_files_are_ascii(name):
    """The backend reads them as UTF-8, but keeping them ASCII avoids surprises on any machine (e.g. Chinese Windows)."""
    assert (DATA / name).read_bytes().isascii()


def test_api_responses_are_ascii():
    paths = ["/api/regions"] + [f"/api/regions/{rid}{end}" for rid in REGION_IDS for end in ("", "/corridor", "/crossings?sensitivity=1")]
    for path in paths:
        res = client.get(path)
        assert res.status_code == 200 and res.content.isascii(), path
