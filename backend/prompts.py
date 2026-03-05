from __future__ import annotations

import re
from typing import Any

from models import SectionEnum


SECTION_TITLES: dict[SectionEnum, str] = {
    SectionEnum.BRIEF_SUMMARY: "Brief Summary",
    SectionEnum.STRATEGY: "Strategy",
    SectionEnum.COPY_PACK: "Copy Pack",
    SectionEnum.VISUAL_PACK: "Visual Pack",
    SectionEnum.VIDEO_PACK: "Video Pack",
    SectionEnum.SOCIAL_PACK: "Social Pack",
}


GLOBAL_RULES = """You are generating a marketing campaign pack.
Hard rules:
1) Never invent statistics, research, or factual claims.
2) If data is missing, make at most one reasonable assumption and label it exactly as: Assumption: ...
3) If the brief references real brands and explicit rights are not provided, use a fictional brand name.
4) Keep output practical, concise, and execution-ready.
"""


def build_section_prompt(
    brief_text: str,
    options: dict[str, Any],
    section: SectionEnum,
    existing_sections: dict[str, Any],
    regenerate: bool = False,
) -> str:
    heading = SECTION_TITLES[section]
    section_name = section.value
    prior = "\n".join(
        [
            f"- {key}: present"
            for key in [
                SectionEnum.BRIEF_SUMMARY.value,
                SectionEnum.STRATEGY.value,
                SectionEnum.COPY_PACK.value,
                SectionEnum.VISUAL_PACK.value,
                SectionEnum.VIDEO_PACK.value,
                SectionEnum.SOCIAL_PACK.value,
            ]
            if key in existing_sections and existing_sections[key]
        ]
    )
    prior = prior or "- none"

    extra = ""
    if section == SectionEnum.VISUAL_PACK:
        extra = """
Visual Pack format requirements:
- Produce 3 to 6 image concepts.
- For each concept include exactly these lines:
  Title: <short title>
  Intent: <one-line intent>
  Image Prompt: <detailed prompt for image generation>
"""

    mode = "Regenerate only this section." if regenerate else "Generate this section."
    return f"""{GLOBAL_RULES}
Task:
- {mode}
- Return markdown for exactly one heading: ## {heading}
- Do not output other headings.

Input Brief:
{brief_text}

Options:
- Tone: {options.get("tone")}
- Platforms: {", ".join(options.get("platforms", []))}
- Duration: {options.get("duration")}
- Audience: {options.get("audience")}

Already generated sections:
{prior}

Target section key: {section_name}
{extra}
"""


def parse_visual_concepts(markdown: str) -> list[dict[str, str]]:
    title_re = re.compile(r"^\s*(?:[-*]\s*)?Title:\s*(.+?)\s*$", re.IGNORECASE)
    intent_re = re.compile(r"^\s*(?:[-*]\s*)?Intent:\s*(.+?)\s*$", re.IGNORECASE)
    prompt_re = re.compile(
        r"^\s*(?:[-*]\s*)?Image\s*Prompt:\s*(.+?)\s*$", re.IGNORECASE
    )

    concepts: list[dict[str, str]] = []
    current: dict[str, str] = {}

    for raw_line in markdown.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        title_match = title_re.match(line)
        if title_match:
            if current.get("title") and current.get("prompt"):
                concepts.append(current)
            current = {"title": title_match.group(1).strip()}
            continue

        intent_match = intent_re.match(line)
        if intent_match and current:
            current["intent"] = intent_match.group(1).strip()
            continue

        prompt_match = prompt_re.match(line)
        if prompt_match and current:
            current["prompt"] = prompt_match.group(1).strip()
            continue

    if current.get("title") and current.get("prompt"):
        concepts.append(current)

    return concepts
