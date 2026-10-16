from flask import Flask, jsonify, request, send_from_directory
from math import cos, radians, sqrt

app = Flask(__name__, static_folder='.')

# Where the demo data comes from. None of it is verified wildlife or engineering data.
DATA_NOTES = {
    'roads': 'Approximate highway alignments traced from OpenStreetMap data (© OpenStreetMap contributors, ODbL) via the OSRM routing service on 2026-10-16 and simplified. Not surveyed centerlines.',
    'habitats': 'Illustrative circular habitat zones placed near known wildlife areas for demonstration. Not mapped habitat or corridor boundaries.',
    'solutions': 'General crossing-structure types matched to animal groups. Concepts only; real projects need ecological surveys, collision records and engineering review.',
}

# group decides which crossing structures are suggested (see GROUP_SOLUTIONS).
SPECIES = {
    'mountain_lion': {'name': 'Mountain Lion', 'group': 'large'},
    'mule_deer': {'name': 'Mule Deer', 'group': 'large'},
    'bobcat': {'name': 'Bobcat', 'group': 'medium'},
    'tule_elk': {'name': 'Tule Elk', 'group': 'large'},
    'black_bear': {'name': 'Black Bear', 'group': 'large'},
    'coyote': {'name': 'Coyote', 'group': 'medium'},
    'marsh_hawk': {'name': 'Marsh Hawk (Northern Harrier)', 'group': 'bird'},
    'harvest_mouse': {'name': 'Salt Marsh Harvest Mouse', 'group': 'small'},
    'waterfowl': {'name': 'Waterfowl', 'group': 'bird'},
    'river_otter': {'name': 'River Otter', 'group': 'semi_aquatic'},
}

SOLUTIONS = {
    'causeway': {'name': 'Elevated causeway segment', 'description': 'Raise the road on a causeway over the marsh so tidal flow and wetland habitat reconnect beneath it and wildlife stays off the roadway.'},
    'overpass': {'name': 'Vegetated wildlife overpass', 'description': 'A landscaped bridge over the highway that large mammals can cross on natural ground.'},
    'underpass': {'name': 'Wildlife undercrossing or enlarged culvert', 'description': 'A wide, open passage under the road, such as a bridge span or box culvert, for mid-sized mammals.'},
    'small_culvert': {'name': 'Small-animal culverts with cover', 'description': 'Small, dry culverts with vegetation or cover at the entrances so small mammals can pass under the road.'},
    'dry_ledge': {'name': 'Waterway crossing with dry banks or ledges', 'description': 'Bridges or culverts at creeks and sloughs that keep a dry path under the road, so otters do not climb onto the highway.'},
    'fencing': {'name': 'Directional fencing', 'description': 'Fencing along the highway that keeps animals off the road and guides them toward the crossing structure.'},
}

GROUP_SOLUTIONS = {
    'large': ['overpass', 'fencing'],
    'medium': ['underpass', 'fencing'],
    'small': ['small_culvert', 'fencing'],
    'semi_aquatic': ['dry_ledge', 'fencing'],
    'bird': [],
}

# road: [lat, lon] points. habitats: illustrative zones (center [lat, lon], radius in meters).
REGIONS = {
    'i15': {
        'name': 'San Diego County: Interstate 15 Corridor (Temecula / Rainbow Canyon)',
        'highway': 'Interstate 15',
        'center': [33.445, -117.155], 'zoom': 12, 'wetland': False,
        'species': ['mountain_lion', 'mule_deer', 'bobcat'],
        'road': [[33.5298,-117.1681],[33.5147,-117.1581],[33.4998,-117.151],[33.4922,-117.1451],[33.4688,-117.1368],[33.4517,-117.1355],[33.4423,-117.1379],[33.4364,-117.1407],[33.4328,-117.1435],[33.425,-117.1517],[33.4007,-117.1699],[33.3927,-117.1741],[33.3861,-117.1748],[33.3794,-117.1732],[33.3745,-117.17],[33.3669,-117.1628],[33.36,-117.1596]],
        'habitats': [
            {'name': 'Temecula Creek', 'center': [33.476, -117.132], 'radius_m': 2200, 'species': ['mountain_lion', 'mule_deer', 'bobcat']},
            {'name': 'Rainbow Canyon', 'center': [33.425, -117.155], 'radius_m': 1600, 'species': ['mountain_lion', 'mule_deer', 'bobcat']},
        ],
        'sources': [],
    },
    'hwy152': {
        'name': 'Central Valley / South Bay: Highway 152 (Pacheco Pass / San Luis Reservoir)',
        'highway': 'State Route 152',
        'center': [37.050, -121.190], 'zoom': 11, 'wetland': False,
        'species': ['tule_elk', 'black_bear', 'coyote'],
        'road': [[36.9958,-121.3786],[37.0045,-121.3689],[37.0061,-121.3663],[37.0092,-121.359],[37.014,-121.3403],[37.0228,-121.329],[37.0285,-121.3269],[37.0324,-121.3233],[37.0373,-121.3075],[37.0385,-121.3008],[37.0381,-121.2964],[37.0385,-121.2941],[37.0399,-121.2922],[37.0445,-121.2889],[37.0468,-121.2844],[37.0464,-121.2774],[37.0449,-121.2721],[37.0455,-121.268],[37.0446,-121.2633],[37.045,-121.2613],[37.05,-121.2568],[37.0523,-121.2539],[37.0539,-121.2481],[37.0582,-121.2404],[37.0645,-121.2265],[37.068,-121.2134],[37.0693,-121.212],[37.0761,-121.2082],[37.0771,-121.2058],[37.0778,-121.1986],[37.0841,-121.1916],[37.0847,-121.1893],[37.0847,-121.1825],[37.087,-121.1733],[37.0864,-121.1654],[37.0869,-121.1622],[37.0887,-121.1592],[37.0965,-121.1522],[37.1046,-121.1314],[37.1044,-121.1285],[37.1016,-121.1234],[37.0958,-121.1207],[37.0901,-121.1168],[37.0863,-121.1111],[37.0834,-121.1007],[37.0823,-121.0943],[37.0589,-121.0538],[37.0568,-121.0406],[37.0568,-121.0022]],
        'habitats': [
            {'name': 'Pacheco Pass summit', 'center': [37.066, -121.220], 'radius_m': 3000, 'species': ['tule_elk', 'black_bear', 'coyote']},
            {'name': 'San Luis Reservoir north shore', 'center': [37.097, -121.122], 'radius_m': 1400, 'species': ['tule_elk', 'coyote']},
        ],
        'sources': [],
    },
    'sr37': {
        'name': 'Northern California / North Bay: State Route 37 (San Pablo Baylands Corridor)',
        'highway': 'State Route 37',
        'center': [38.135, -122.396], 'zoom': 12, 'wetland': True,
        'species': ['marsh_hawk', 'harvest_mouse', 'waterfowl', 'river_otter'],
        'road': [[38.1134,-122.5079],[38.1194,-122.5005],[38.1465,-122.4556],[38.1508,-122.4494],[38.1527,-122.4436],[38.1559,-122.4111],[38.1554,-122.403],[38.151,-122.3856],[38.1456,-122.3746],[38.1326,-122.3385],[38.1182,-122.3047],[38.1174,-122.3],[38.1173,-122.2901],[38.1188,-122.2847]],
        'habitats': [
            {'name': 'Petaluma River', 'center': [38.118, -122.497], 'radius_m': 1500, 'species': ['river_otter', 'harvest_mouse', 'waterfowl']},
            {'name': 'Sears Point / Tolay Creek', 'center': [38.146, -122.448], 'radius_m': 2000, 'species': ['harvest_mouse', 'marsh_hawk', 'waterfowl']},
            {'name': 'Napa-Sonoma Marshes', 'center': [38.150, -122.360], 'radius_m': 3000, 'species': ['waterfowl', 'marsh_hawk', 'river_otter', 'harvest_mouse']},
        ],
        'sources': [],
    },
}

def species_list(ids):
    return [{'id': s, **SPECIES[s]} for s in ids]

def solutions_for(species_ids, wetland):
    """Match crossing-structure concepts to the animal groups at one crossing."""
    plan = {'causeway': list(species_ids)} if wetland else {}
    for s in species_ids:
        for key in GROUP_SOLUTIONS[SPECIES[s]['group']]:
            plan.setdefault(key, []).append(s)
    ordered = sorted(plan.items(), key=lambda item: item[0] == 'fencing')  # fencing supports the others, list it last
    return [{'type': key, **SOLUTIONS[key], 'for_species': [SPECIES[s]['name'] for s in ids]} for key, ids in ordered]

def region_info(region_id):
    r = REGIONS[region_id]
    habitats = [{'id': f'{region_id}-{i+1}', 'name': h['name'], 'center': h['center'], 'radius_m': h['radius_m'], 'species': species_list(h['species'])}
                for i, h in enumerate(r['habitats'])]
    return {'id': region_id, 'name': r['name'], 'highway': r['highway'], 'center': r['center'], 'zoom': r['zoom'], 'wetland': r['wetland'],
            'road': r['road'], 'habitats': habitats, 'species': species_list(r['species']), 'sources': r['sources']}

def xy(point, origin):
    """Local equirectangular projection in meters, suitable for small demo areas."""
    lat, lon = point
    lat0, lon0 = origin
    return ((lon-lon0)*111320*cos(radians(lat0)), (lat-lat0)*111320)

def intersections(road, origin, radius):
    """Return entry/exit coordinates and length inside one circular habitat."""
    pieces = []
    for start, end in zip(road, road[1:]):
        ax, ay = xy(start, origin)
        bx, by = xy(end, origin)
        dx, dy = bx-ax, by-ay
        a = dx*dx+dy*dy
        if a == 0:
            continue
        b = 2*(ax*dx+ay*dy)
        c = ax*ax+ay*ay-radius*radius
        disc = b*b-4*a*c
        ts = [0.0, 1.0]
        if disc >= 0:
            root = sqrt(disc)
            ts.extend([(-b-root)/(2*a), (-b+root)/(2*a)])
        ts = sorted(set(max(0.,min(1.,t)) for t in ts if 0 <= t <= 1))
        for t0,t1 in zip(ts,ts[1:]):
            mid = (t0+t1)/2
            if (ax+mid*dx)**2+(ay+mid*dy)**2 < radius**2 and t1-t0 > 1e-9:
                entry = [start[k]+t0*(end[k]-start[k]) for k in (0,1)]
                exit_ = [start[k]+t1*(end[k]-start[k]) for k in (0,1)]
                pieces.append((entry,exit_,sqrt(a)*(t1-t0)))
    if not pieces:
        return None
    length = sum(p[2] for p in pieces)
    # Midpoint by distance along intersecting polyline portions
    target = length/2
    for entry, exit_, distance in pieces:
        if target <= distance:
            t = target/distance
            center = [entry[k]+t*(exit_[k]-entry[k]) for k in (0,1)]
            break
        target -= distance
    return {'location':center,'entry':pieces[0][0],'exit':pieces[-1][1], 'exposure_m':round(length)}

@app.get('/')
def home():
    return send_from_directory('.', 'index.html')

@app.get('/api/health')
def health():
    return jsonify(status='ok', mode='synthetic-demo')

@app.get('/api/regions')
def regions():
    return jsonify(regions=[region_info(r) for r in REGIONS], data_notes=DATA_NOTES, demo=True)

@app.post('/api/analyze')
def analyze():
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        return jsonify(error='Expected a JSON object'), 400
    region = body.get('region')
    sensitivity = body.get('sensitivity', 2)
    if region not in REGIONS or type(sensitivity) is not int or sensitivity not in (1,2,3):
        return jsonify(error='Invalid region (use i15, hwy152 or sr37) or sensitivity (must be 1, 2, or 3)'), 400
    area = REGIONS[region]
    results = []
    for index, habitat in enumerate(area['habitats']):
        crossing = intersections(area['road'], habitat['center'], habitat['radius_m'])
        if not crossing:
            continue
        # Demonstration priority based on exposure length, NOT wildlife crash risk.
        priority = 'High' if crossing['exposure_m'] >= 3500 else 'Medium'
        if sensitivity == 3 and priority != 'High':
            continue
        animals = ', '.join(SPECIES[s]['name'] for s in habitat['species'])
        results.append({
            'id':f'{region}-{index+1}',
            'title':f"{habitat['name']} crossing",
            'priority':priority,
            'reason':f"The approximate {area['highway']} alignment passes through an illustrative habitat zone ({animals}) for about {crossing['exposure_m']:,} m. Investigate a wildlife crossing with ecological and engineering experts; this is not a verified crossing site.",
            **crossing,
            'habitat':habitat['name'],
            'species':species_list(habitat['species']),
            'solutions':solutions_for(habitat['species'], area['wetland']),
        })
    return jsonify(region=region, sensitivity=sensitivity, crossings=results, demo=True, data_notes=DATA_NOTES)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
