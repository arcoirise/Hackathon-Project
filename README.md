# WildPass

An interactive planning dashboard for planners, developers and civil engineers that maps wildlife–highway conflicts in three California corridors and suggests crossing concepts:

- **I-15** — San Diego County (Temecula / Rainbow Canyon)
- **Highway 152** — Pacheco Pass / San Luis Reservoir
- **SR-37** — San Pablo Baylands, North Bay

Hackathon prototype. Road lines are approximate and habitat zones are illustrative; see `wildbridge/README.md` for what the data is and isn't.

## Layout

| Folder | What it is |
| --- | --- |
| `src/` | Frontend: React + Vite + Tailwind + Leaflet |
| `src/api.js` | Frontend helpers for calling the backend (`useRegions`, `fetchRegions`, `analyze`) |
| `wildbridge/` | Backend: Flask API (`app.py`). API docs in `wildbridge/README.md` |

## Run it

You need two terminals: one for the backend, one for the frontend. Start the backend first.

**Terminal 1: backend (port 5000)**

Windows (PowerShell):

```powershell
cd wildbridge
python -m venv .venv            # first time only
.venv\Scripts\python -m pip install -r requirements.txt   # first time only
.venv\Scripts\python app.py
```

macOS:

```bash
cd wildbridge
python3 -m venv .venv           # first time only
.venv/bin/pip install -r requirements.txt                  # first time only
.venv/bin/python app.py
```

**Terminal 2: frontend (port 5173)**, from the project root, same on Windows and macOS:

```bash
npm install    # first time, and whenever package.json changes
npm run dev
```

Open http://localhost:5173. While developing, Vite forwards every `/api/...` request to the backend on port 5000 (see `vite.config.js`), so the frontend can just `fetch('/api/regions')`.

If the page says it can't load regions, the backend isn't running: check Terminal 1.
