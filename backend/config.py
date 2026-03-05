import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    google_cloud_project: str
    google_cloud_region: str
    firestore_collection: str
    gcs_bucket: str
    gemini_model: str
    allowed_origins: list[str]


def _parse_allowed_origins(raw: str) -> list[str]:
    return [item.strip() for item in raw.split(",") if item.strip()]


def get_settings() -> Settings:
    return Settings(
        google_cloud_project=os.getenv("GOOGLE_CLOUD_PROJECT", "").strip(),
        google_cloud_region=os.getenv("GOOGLE_CLOUD_REGION", "us-central1").strip(),
        firestore_collection=os.getenv("FIRESTORE_COLLECTION", "sessions").strip(),
        gcs_bucket=os.getenv("GCS_BUCKET", "").strip(),
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-1.5-pro").strip(),
        allowed_origins=_parse_allowed_origins(
            os.getenv(
                "ALLOWED_ORIGINS",
                "http://localhost:3000,http://127.0.0.1:3000",
            )
        ),
    )
