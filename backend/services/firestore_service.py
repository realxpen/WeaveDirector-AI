from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from google.cloud import firestore


logger = logging.getLogger(__name__)


class FirestoreService:
    def __init__(self, project_id: str, collection_name: str) -> None:
        self.client = firestore.Client(project=project_id or None)
        self.collection = self.client.collection(collection_name)

    def create_session(self, session_id: str, brief: dict[str, Any]) -> None:
        now = firestore.SERVER_TIMESTAMP
        payload = {
            "createdAt": now,
            "updatedAt": now,
            "status": "generating",
            "brief": brief,
            "sections": {
                "brief_summary": "",
                "strategy": "",
                "copy_pack": "",
                "video_pack": "",
                "social_pack": "",
                "visual_pack": {"concepts": [], "images": []},
            },
            "assets": [],
            "errors": [],
        }
        self.collection.document(session_id).set(payload)

    def get_session(self, session_id: str) -> dict[str, Any] | None:
        snap = self.collection.document(session_id).get()
        if not snap.exists:
            return None
        data = snap.to_dict() or {}
        data["sessionId"] = session_id
        return data

    def list_sessions(self, limit: int = 50) -> list[dict[str, Any]]:
        query = self.collection.order_by("createdAt", direction=firestore.Query.DESCENDING)
        snaps = query.limit(limit).stream()
        rows: list[dict[str, Any]] = []
        for snap in snaps:
            data = snap.to_dict() or {}
            data["sessionId"] = snap.id
            rows.append(data)
        return rows

    def update_section(self, session_id: str, section_key: str, section_value: Any) -> None:
        self.collection.document(session_id).set(
            {
                f"sections.{section_key}": section_value,
                "updatedAt": firestore.SERVER_TIMESTAMP,
            },
            merge=True,
        )

    def set_status(self, session_id: str, status: str) -> None:
        self.collection.document(session_id).set(
            {"status": status, "updatedAt": firestore.SERVER_TIMESTAMP},
            merge=True,
        )

    def add_asset(self, session_id: str, asset: dict[str, Any]) -> None:
        self.collection.document(session_id).set(
            {
                "assets": firestore.ArrayUnion([asset]),
                "updatedAt": firestore.SERVER_TIMESTAMP,
            },
            merge=True,
        )

    def add_error(self, session_id: str, message: str) -> None:
        logger.error("Session %s error: %s", session_id, message)
        self.collection.document(session_id).set(
            {
                "errors": firestore.ArrayUnion([message]),
                "status": "error",
                "updatedAt": firestore.SERVER_TIMESTAMP,
            },
            merge=True,
        )


def to_datetime(value: Any) -> datetime | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value
    return None
