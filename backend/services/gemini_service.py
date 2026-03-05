from __future__ import annotations

import logging
from typing import Iterator


logger = logging.getLogger(__name__)

try:
    from google import genai  # type: ignore
except Exception:  # pragma: no cover
    genai = None


class GeminiService:
    def __init__(self, project_id: str, region: str, model: str) -> None:
        self.project_id = project_id
        self.region = region
        self.model = model
        self.client = None

        if genai is None:
            logger.warning("google-genai package unavailable, using fallback mode.")
            return

        try:
            self.client = genai.Client(
                vertexai=True,
                project=project_id or None,
                location=region,
            )
        except Exception as exc:
            logger.warning("Gemini client init failed, using fallback mode: %s", exc)
            self.client = None

    def stream_text(self, prompt: str) -> Iterator[str]:
        if not self.client:
            yield from self._fallback_chunks(prompt)
            return

        try:
            stream = self.client.models.generate_content_stream(
                model=self.model,
                contents=prompt,
            )
            emitted = False
            for chunk in stream:
                text = getattr(chunk, "text", None)
                if text:
                    emitted = True
                    yield text

            if not emitted:
                yield from self._fallback_chunks(prompt)
        except Exception as exc:
            logger.exception("Gemini stream failed. Falling back. Error: %s", exc)
            yield from self._fallback_chunks(prompt)

    def generate_image_bytes(self, prompt: str) -> tuple[bytes, str] | None:
        if not self.client:
            return None
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=f"Create an image for: {prompt}",
            )
            candidates = getattr(response, "candidates", []) or []
            for candidate in candidates:
                content = getattr(candidate, "content", None)
                if not content:
                    continue
                parts = getattr(content, "parts", []) or []
                for part in parts:
                    inline_data = getattr(part, "inline_data", None)
                    if inline_data and getattr(inline_data, "data", None):
                        mime = getattr(inline_data, "mime_type", "image/png")
                        return inline_data.data, mime
        except Exception:
            logger.info("Real image generation unavailable; will use placeholder mode.")
        return None

    @staticmethod
    def _fallback_chunks(prompt: str) -> Iterator[str]:
        if "## Brief Summary" in prompt:
            text = (
                "## Brief Summary\n"
                "Campaign objective and deliverables are defined from the provided brief.\n"
                "Assumption: No external market dataset is available at generation time.\n"
            )
        elif "## Strategy" in prompt:
            text = (
                "## Strategy\n"
                "- Positioning: clear value proposition tied to audience pain points.\n"
                "- Messaging Pillars: trust, utility, and momentum.\n"
                "- Rollout: test one creative angle per platform before scaling.\n"
            )
        elif "## Copy Pack" in prompt:
            text = (
                "## Copy Pack\n"
                "- Headline: Build your next move with confidence.\n"
                "- CTA: Start now and iterate weekly.\n"
                "- Captions: platform-tailored variants with concise hooks.\n"
            )
        elif "## Visual Pack" in prompt:
            text = (
                "## Visual Pack\n"
                "Title: Momentum Grid\n"
                "Intent: Show fast, modular campaign execution.\n"
                "Image Prompt: Editorial product shot with layered campaign cards, warm daylight.\n\n"
                "Title: Proof Wall\n"
                "Intent: Signal credibility through visible outcomes.\n"
                "Image Prompt: Modern dashboard collage with clear KPI widgets, clean neutral background.\n\n"
                "Title: Creator Motion\n"
                "Intent: Emphasize social-native agility.\n"
                "Image Prompt: Dynamic short-video frame sequence with bold typography and motion streaks.\n"
            )
        elif "## Video Pack" in prompt:
            text = (
                "## Video Pack\n"
                "- Hook (0-3s): Direct pain-point opener.\n"
                "- Middle: One proof beat and one product action shot.\n"
                "- End: Single CTA optimized for 15s and 30s cuts.\n"
            )
        else:
            text = (
                "## Social Pack\n"
                "- Instagram: carousel plus reel adaptation.\n"
                "- TikTok: native creator read with clear first-line hook.\n"
                "- LinkedIn: concise authority post with a practical takeaway.\n"
            )

        chunk_size = 160
        for i in range(0, len(text), chunk_size):
            yield text[i : i + chunk_size]
