from __future__ import annotations

import logging
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from config import get_settings
from models import (
    GenerateRequest,
    GenerateResponse,
    RegenerateRequest,
    RegenerateResponse,
    SectionEnum,
    SessionDetailResponse,
    SessionSummaryResponse,
)
from services.firestore_service import FirestoreService, to_datetime
from services.generator import CampaignGenerator
from services.gemini_service import GeminiService
from services.storage_service import StorageService


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()
app = FastAPI(title="WeaveDirector Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

firestore_service = FirestoreService(
    project_id=settings.google_cloud_project,
    collection_name=settings.firestore_collection,
)
storage_service = StorageService(
    project_id=settings.google_cloud_project,
    bucket_name=settings.gcs_bucket,
)
gemini_service = GeminiService(
    project_id=settings.google_cloud_project,
    region=settings.google_cloud_region,
    model=settings.gemini_model,
)
campaign_generator = CampaignGenerator(firestore_service, gemini_service, storage_service)


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.post("/api/generate", response_model=GenerateResponse)
def generate(payload: GenerateRequest, request: Request) -> dict[str, Any]:
    session_id = str(uuid4())
    firestore_service.create_session(
        session_id,
        {
            "text": payload.brief,
            "options": payload.options.model_dump(),
        },
    )
    base_url = str(request.base_url).rstrip("/")
    return {"sessionId": session_id, "streamUrl": f"{base_url}/api/stream/{session_id}"}


@app.get("/api/stream/{session_id}")
async def stream_session(
    session_id: str,
    section: SectionEnum | None = Query(default=None),
) -> StreamingResponse:
    generator = campaign_generator.stream_session(session_id=session_id, only_section=section)
    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/api/regenerate", response_model=RegenerateResponse)
def regenerate(payload: RegenerateRequest, request: Request) -> dict[str, str]:
    session_id = str(payload.sessionId)
    existing = firestore_service.get_session(session_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Session not found")

    firestore_service.set_status(session_id, "generating")
    base_url = str(request.base_url).rstrip("/")
    return {
        "sessionId": session_id,
        "streamUrl": f"{base_url}/api/stream/{session_id}?section={payload.section.value}",
    }


@app.get("/api/sessions", response_model=list[SessionSummaryResponse])
def list_sessions() -> list[dict[str, Any]]:
    sessions = firestore_service.list_sessions(limit=100)
    rows: list[dict[str, Any]] = []
    for s in sessions:
        brief = s.get("brief", {})
        options = brief.get("options", {})
        text = brief.get("text", "")
        excerpt = (text[:117] + "...") if len(text) > 120 else text
        rows.append(
            {
                "sessionId": s.get("sessionId"),
                "createdAt": to_datetime(s.get("createdAt")),
                "briefExcerpt": excerpt,
                "tone": options.get("tone", ""),
                "platforms": options.get("platforms", []),
                "status": s.get("status", "unknown"),
            }
        )
    return rows


@app.get("/api/sessions/{session_id}", response_model=SessionDetailResponse)
def get_session(session_id: str) -> dict[str, Any]:
    session = firestore_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {
        "sessionId": session_id,
        "createdAt": to_datetime(session.get("createdAt")),
        "updatedAt": to_datetime(session.get("updatedAt")),
        "status": session.get("status", "unknown"),
        "brief": session.get("brief", {}),
        "sections": session.get("sections", {}),
        "assets": session.get("assets", []),
        "errors": session.get("errors", []),
    }
