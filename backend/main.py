import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from corridors import router as corridors_router, with_dashboard

DATA_FILE = Path(__file__).parent / "data" / "regions.json"

app = FastAPI(title="WildPass API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)
app.include_router(corridors_router)


def load_regions() -> list[dict]:
    with DATA_FILE.open() as f:
        return json.load(f)["regions"]


@app.get("/api/regions")
def list_regions():
    return [with_dashboard(region) for region in load_regions()]


@app.get("/api/regions/{region_id}")
def get_region(region_id: str):
    for region in load_regions():
        if region["id"] == region_id:
            return with_dashboard(region)
    raise HTTPException(status_code=404, detail="Region not found")
