#!/usr/bin/env bash
# Run WildPass on macOS/Linux: sets up anything missing, starts the backend (port 8000) and
# frontend (port 5173), and opens the browser. Press Ctrl+C to stop both.
set -e
cd "$(dirname "$0")"

command -v python3 >/dev/null || { echo "Python 3 is not installed: https://www.python.org/downloads/"; exit 1; }
command -v npm >/dev/null || { echo "Node.js is not installed: https://nodejs.org/"; exit 1; }

[ -x backend/.venv/bin/python ] || { echo "Setting up the backend for the first time..."; python3 -m venv backend/.venv; }
backend/.venv/bin/python -m pip install -q -r backend/requirements.txt
(cd frontend && npm install --silent)

(cd backend && exec .venv/bin/python -m uvicorn main:app --port 8000) &
BACKEND=$!
(cd frontend && exec npm run dev -- --port 5173 --strictPort) &
FRONTEND=$!
trap 'kill $BACKEND $FRONTEND 2>/dev/null' EXIT INT TERM

sleep 5
open http://localhost:5173 2>/dev/null || xdg-open http://localhost:5173 2>/dev/null || true
wait
