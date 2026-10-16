from flask import Flask, jsonify, request, send_from_directory
from math import cos, radians, sqrt

app = Flask(__name__, static_folder='.')

AREAS = {
 'santa': {'habitats': [[37.17,-122.10,4500],[37.23,-122.02,3000]], 'road': [[37.09,-122.17],[37.14,-122.12],[37.18,-122.08],[37.22,-122.04],[37.28,-121.99]]},
 'yellow': {'habitats': [[44.77,-110.62,8500],[44.68,-110.47,6000]], 'road': [[44.55,-110.85],[44.68,-110.7],[44.77,-110.61],[44.82,-110.5],[44.88,-110.36]]},
 'banff': {'habitats': [[51.19,-115.57,5000],[51.25,-115.48,3800]], 'road': [[51.11,-115.75],[51.16,-115.64],[51.2,-115.55],[51.24,-115.49],[51.3,-115.41]]}
}

def xy(point, origin):
    """Local equirectangular projection in meters, suitable for small demo areas."""
    lat, lon = point
    lat0, lon0 = origin
    return ((lon-lon0)*111320*cos(radians(lat0)), (lat-lat0)*111320)

def intersections(road, habitat):
    """Return entry/exit coordinates and length inside one circular habitat."""
    origin = habitat[:2]
    radius = habitat[2]
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

@app.post('/api/analyze')
def analyze():
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        return jsonify(error='Expected a JSON object'), 400
    region = body.get('region')
    sensitivity = body.get('sensitivity', 2)
    if region not in AREAS or type(sensitivity) is not int or sensitivity not in (1,2,3):
        return jsonify(error='Invalid region or sensitivity (must be 1, 2, or 3)'), 400
    area = AREAS[region]
    results = []
    for index, habitat in enumerate(area['habitats']):
        crossing = intersections(area['road'], habitat)
        if not crossing:
            continue
        # Demonstration priority based on exposure length, NOT wildlife crash risk.
        priority = 'High' if crossing['exposure_m'] >= 3500 else 'Medium'
        if sensitivity == 3 and priority != 'High':
            continue
        results.append({
            'id':f'{region}-{index+1}',
            'title':f'Habitat crossing {index+1}',
            'priority':priority,
            'reason':f"Illustrative highway overlaps a simulated habitat for approximately {crossing['exposure_m']:,} m. Investigate a wildlife crossing with ecological and engineering experts; this is not a verified bridge site.",
            **crossing
        })
    return jsonify(region=region, sensitivity=sensitivity, crossings=results, demo=True)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
