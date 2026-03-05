from __future__ import annotations

import logging
from datetime import timedelta

from google.cloud import storage


logger = logging.getLogger(__name__)


class StorageService:
    def __init__(self, project_id: str, bucket_name: str) -> None:
        self.client = storage.Client(project=project_id or None)
        self.bucket = self.client.bucket(bucket_name)
        self.bucket_name = bucket_name

    def upload_text(self, object_name: str, content: str, content_type: str = "text/plain") -> str:
        blob = self.bucket.blob(object_name)
        blob.upload_from_string(content, content_type=content_type)
        return f"https://storage.googleapis.com/{self.bucket_name}/{object_name}"

    def upload_bytes(self, object_name: str, content: bytes, content_type: str) -> str:
        blob = self.bucket.blob(object_name)
        blob.upload_from_string(content, content_type=content_type)
        return f"https://storage.googleapis.com/{self.bucket_name}/{object_name}"

    def upload_placeholder_image_note(self, object_name: str, prompt: str) -> str:
        note = (
            "Image generation placeholder.\n"
            "This object demonstrates Cloud Storage write activity.\n\n"
            f"Prompt:\n{prompt}\n"
        )
        return self.upload_text(object_name, note, content_type="text/plain")

    def signed_url(self, object_name: str) -> str | None:
        blob = self.bucket.blob(object_name)
        try:
            return blob.generate_signed_url(version="v4", expiration=timedelta(days=7))
        except Exception:
            logger.info("Signed URL generation unavailable for %s", object_name)
            return None
