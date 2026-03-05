from __future__ import annotations

import json
import logging
import uuid
from typing import Any, AsyncIterator

from models import SECTION_ORDER, SectionEnum
from prompts import build_section_prompt, parse_visual_concepts
from services.firestore_service import FirestoreService
from services.gemini_service import GeminiService
from services.storage_service import StorageService


logger = logging.getLogger(__name__)


def encode_sse(event_type: str, payload: dict[str, Any]) -> str:
    _ = event_type
    return f"data: {json.dumps(payload)}\n\n"


class CampaignGenerator:
    def __init__(
        self,
        firestore_service: FirestoreService,
        gemini_service: GeminiService,
        storage_service: StorageService,
    ) -> None:
        self.firestore_service = firestore_service
        self.gemini_service = gemini_service
        self.storage_service = storage_service

    async def stream_session(
        self, session_id: str, only_section: SectionEnum | None = None
    ) -> AsyncIterator[str]:
        session = self.firestore_service.get_session(session_id)
        if not session:
            yield encode_sse(
                "error", {"type": "error", "message": f"Session {session_id} not found"}
            )
            return

        brief = session.get("brief", {})
        options = brief.get("options", {})
        sections_data = session.get("sections", {})

        targets = [only_section] if only_section else SECTION_ORDER
        self.firestore_service.set_status(session_id, "generating")

        try:
            for section in targets:
                key = section.value
                yield encode_sse("section_start", {"type": "section_start", "section": key})

                prompt = build_section_prompt(
                    brief_text=brief.get("text", ""),
                    options=options,
                    section=section,
                    existing_sections=sections_data,
                    regenerate=only_section is not None,
                )

                chunks: list[str] = []
                for chunk in self.gemini_service.stream_text(prompt):
                    if not chunk:
                        continue
                    chunks.append(chunk)
                    yield encode_sse(
                        "section_chunk",
                        {"type": "section_chunk", "section": key, "chunk": chunk},
                    )

                section_markdown = "".join(chunks).strip()
                if not section_markdown:
                    section_markdown = self._empty_fallback(section)

                if section == SectionEnum.VISUAL_PACK:
                    concepts = parse_visual_concepts(section_markdown)
                    if len(concepts) < 3:
                        concepts = self._fallback_visual_concepts(brief.get("text", ""))
                    concepts = concepts[:6]

                    images: list[dict[str, str]] = []
                    for idx, concept in enumerate(concepts, start=1):
                        title = concept.get("title", f"Concept {idx}")
                        prompt_text = concept.get("prompt", "")
                        object_name = f"sessions/{session_id}/images/{idx}-{uuid.uuid4().hex}.txt"

                        generated = self.gemini_service.generate_image_bytes(prompt_text)
                        if generated:
                            content, mime = generated
                            ext = "png" if "png" in mime else "jpg"
                            object_name = (
                                f"sessions/{session_id}/images/{idx}-{uuid.uuid4().hex}.{ext}"
                            )
                            url = self.storage_service.upload_bytes(object_name, content, mime)
                        else:
                            url = self.storage_service.upload_placeholder_image_note(
                                object_name, prompt_text
                            )

                        image_item = {"title": title, "url": url}
                        images.append(image_item)
                        asset = {"type": "image", "title": title, "url": url}
                        self.firestore_service.add_asset(session_id, asset)
                        yield encode_sse(
                            "image_generated",
                            {
                                "type": "image_generated",
                                "section": "visual_pack",
                                "title": title,
                                "url": url,
                            },
                        )

                    visual_payload = {"concepts": concepts, "images": images}
                    self.firestore_service.update_section(session_id, key, visual_payload)
                    sections_data[key] = visual_payload
                else:
                    self.firestore_service.update_section(session_id, key, section_markdown)
                    sections_data[key] = section_markdown

                yield encode_sse("section_end", {"type": "section_end", "section": key})

            self.firestore_service.set_status(session_id, "complete")
            yield encode_sse("done", {"type": "done", "sessionId": session_id})
        except Exception as exc:
            message = str(exc)
            logger.exception("Stream generation failed for %s: %s", session_id, message)
            self.firestore_service.add_error(session_id, message)
            yield encode_sse("error", {"type": "error", "message": message})

    @staticmethod
    def _empty_fallback(section: SectionEnum) -> str:
        headings = {
            SectionEnum.BRIEF_SUMMARY: "## Brief Summary",
            SectionEnum.STRATEGY: "## Strategy",
            SectionEnum.COPY_PACK: "## Copy Pack",
            SectionEnum.VISUAL_PACK: "## Visual Pack",
            SectionEnum.VIDEO_PACK: "## Video Pack",
            SectionEnum.SOCIAL_PACK: "## Social Pack",
        }
        return f"{headings[section]}\nNo content generated."

    @staticmethod
    def _fallback_visual_concepts(brief_text: str) -> list[dict[str, str]]:
        seed = brief_text[:140].strip() or "campaign brief"
        return [
            {
                "title": "Hero Frame",
                "intent": "Introduce the main campaign idea in one glance.",
                "prompt": f"High-impact hero composition for {seed}, cinematic lighting, editorial ad style.",
            },
            {
                "title": "Product In Use",
                "intent": "Show real-world value in action.",
                "prompt": f"Lifestyle scene showing practical usage for {seed}, natural light, authentic tone.",
            },
            {
                "title": "Conversion Endcard",
                "intent": "Drive a clear call to action.",
                "prompt": f"Minimal branded endcard for {seed} with strong CTA area, clean typography layout.",
            },
        ]
