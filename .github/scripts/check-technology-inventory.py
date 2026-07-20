#!/usr/bin/env python3
"""Check whether the recorded technology review is older than the policy window."""

from __future__ import annotations

import argparse
import json
import re
from urllib.request import Request, urlopen
from datetime import date
from pathlib import Path


def latest_release(name: str) -> str | None:
    urls = {
        "Python": "https://www.python.org/downloads/",
        "PyYAML": "https://pypi.org/pypi/PyYAML/json",
        "Mermaid": "https://github.com/mermaid-js/mermaid/releases",
        "PlantUML": "https://plantuml.com/news",
    }
    url = urls.get(name)
    if not url:
        return None
    request = Request(url, headers={"User-Agent": "technology-inventory-check"})
    with urlopen(request, timeout=20) as response:
        body = response.read().decode("utf-8", errors="replace")
    if name == "PyYAML":
        return json.loads(body)["info"]["version"]
    if name == "Python":
        match = re.search(r"Python (3\.\d+\.\d+)", body)
    elif name == "Mermaid":
        match = re.search(r"mermaid@([0-9]+\.[0-9]+\.[0-9]+)", body)
    else:
        match = re.search(r"V(1\.\d{4}\.\d+)", body)
    return match.group(1) if match else None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-age-days", type=int, default=90)
    args = parser.parse_args()

    inventory_path = Path(__file__).parents[2] / "technology-inventory.json"
    inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
    reviewed = date.fromisoformat(inventory["reviewed_on"])
    age = (date.today() - reviewed).days
    problems = []
    if age > args.max_age_days:
        problems.append(f"review is {age} days old")

    for technology in inventory["technologies"]:
        try:
            current = latest_release(technology["name"])
        except Exception as error:  # noqa: BLE001, network failures should be visible in CI
            print(f"Could not check {technology['name']}: {error}")
            continue
        recorded = technology["latest_stable_as_of_review"]
        if current and current != recorded:
            problems.append(
                f"{technology['name']} baseline is {recorded}, "
                f"official source reports {current}"
            )

    if problems:
        print(
            f"Technology inventory needs review: {'; '.join(problems)}. "
            f"Update {inventory_path.name} and TECHNOLOGY.md after checking "
            "the linked authoritative sources."
        )
        return 1
    print(f"Technology inventory is current ({age} days old).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
