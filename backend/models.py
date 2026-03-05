from datetime import datetime
from enum import Enum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class ToneEnum(str, Enum):
    PROFESSIONAL = "Professional"
    BOLD = "Bold"
    PLAYFUL = "Playful"
    MINIMAL = "Minimal"


class PlatformEnum(str, Enum):
    INSTAGRAM = "Instagram"
    TIKTOK = "TikTok"
    YOUTUBE = "YouTube"
    LINKEDIN = "LinkedIn"


class DurationEnum(str, Enum):
    D15 = "15s"
    D30 = "30s"


class SectionEnum(str, Enum):
    BRIEF_SUMMARY = "brief_summary"
    STRATEGY = "strategy"
    COPY_PACK = "copy_pack"
    VISUAL_PACK = "visual_pack"
    VIDEO_PACK = "video_pack"
    SOCIAL_PACK = "social_pack"


SECTION_ORDER: list[SectionEnum] = [
    SectionEnum.BRIEF_SUMMARY,
    SectionEnum.STRATEGY,
    SectionEnum.COPY_PACK,
    SectionEnum.VISUAL_PACK,
    SectionEnum.VIDEO_PACK,
    SectionEnum.SOCIAL_PACK,
]


class CampaignOptions(BaseModel):
    tone: ToneEnum
    platforms: list[PlatformEnum]
    duration: DurationEnum
    audience: str = Field(min_length=2, max_length=500)

    @field_validator("platforms")
    @classmethod
    def validate_platforms(cls, value: list[PlatformEnum]) -> list[PlatformEnum]:
        if not value:
            raise ValueError("At least one platform is required.")
        return value


class GenerateRequest(BaseModel):
    brief: str = Field(min_length=20, max_length=5000)
    options: CampaignOptions

    @field_validator("brief")
    @classmethod
    def validate_brief(cls, value: str) -> str:
        normalized = value.strip()
        if len(normalized) < 20:
            raise ValueError("Brief must be at least 20 characters.")
        return normalized


class GenerateResponse(BaseModel):
    sessionId: UUID
    streamUrl: str


class RegenerateRequest(BaseModel):
    sessionId: UUID
    section: SectionEnum


class RegenerateResponse(BaseModel):
    sessionId: UUID
    streamUrl: str


class SessionSummaryResponse(BaseModel):
    sessionId: str
    createdAt: datetime | None
    briefExcerpt: str
    tone: str
    platforms: list[str]
    status: str


class SessionDetailResponse(BaseModel):
    sessionId: str
    createdAt: datetime | None
    updatedAt: datetime | None
    status: str
    brief: dict[str, Any]
    sections: dict[str, Any]
    assets: list[dict[str, Any]]
    errors: list[str]
