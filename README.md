# WildPass

An interactive planning dashboard for planners, developers and civil engineers. It maps where California highways cut through wildlife habitat and suggests crossing structures to reconnect it, in three corridors:

- **I-15:** Temecula / Rainbow Canyon (San Diego County)
- **SR-152:** Pacheco Pass / San Luis Reservoir (Central Valley / South Bay)
- **SR-37:** San Pablo Baylands (North Bay)

## Run it

You need [Python 3](https://www.python.org/downloads/) and [Node.js](https://nodejs.org/).

- **Windows:** double-click `start-wildpass.bat`.
- **macOS:** run `./start-wildpass.sh` in Terminal.

The script installs anything missing, starts the backend (port 8000) and the frontend (port 5173), and opens http://localhost:5173.

## What's where

| Folder | What it is |
| --- | --- |
| `frontend/` | React + Vite dashboard. In dev it proxies `/api` to the backend. |
| `backend/` | FastAPI backend: corridor data, the conflict and priority analysis, and crossing concepts. See [`backend/README.md`](backend/README.md) for the API, the priority rule and the data sources. |
| `wildbridge/` | The original Flask prototype, kept for reference. |

Every pull request runs the backend tests and the frontend build (`.github/workflows/ci.yml`).
