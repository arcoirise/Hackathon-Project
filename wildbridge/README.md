# WildBridge AI — Hackathon backend

A Flask API computes where **illustrative highway polylines** intersect **simulated circular habitat zones**. This is not verified wildlife data, accident prediction, or engineering design.

## Run on macOS

Open Terminal in this folder, then:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000 in your browser. **Do not open `index.html` directly**: the API only works when served by Flask.

## API

- `GET /api/health` → server status
- `POST /api/analyze` with `{"region":"santa","sensitivity":2}` → computed crossings

Regions: `santa`, `yellow`, `banff`. Sensitivity: 1–3 (3 filters to high-exposure crossings).

The server finds segment–circle intersections in a local meter-based projection. Habitat exposure length is used only for demonstration priority, not wildlife risk. Proposed crossing markers are conceptual locations; the algorithm does not determine actual bridge spans or suitability.

## Next steps

Replace demo highway polylines with verified highway centerlines, replace simulated circles with authoritative habitat/corridor GIS polygons, and validate candidates against species movement, collision history, terrain, land ownership and engineering feasibility. Do not present demo markers as real construction recommendations.
