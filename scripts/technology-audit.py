#!/usr/bin/env python3
"""Derive versions from source and compare official stable releases. Never upgrade.

Requires scripts/requirements.txt. Reports are snapshots, not a second pin store.
"""
from __future__ import annotations
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import gzip
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tomllib
from urllib.parse import quote, urlparse
from urllib.request import Request, urlopen
import yaml

ROOT = Path(__file__).resolve().parents[1]
GROUPS = ("dependencies", "devDependencies", "optionalDependencies", "peerDependencies")


def version_key(value):
    match = re.fullmatch(r"v?(\d+(?:\.\d+){0,3})(?:\.windows\.\d+)?", str(value))
    return tuple(map(int, match[1].split("."))) if match else None


def latest_stable(values):
    stable = [v for v in values if version_key(v) is not None]
    if not stable:
        raise ValueError("No stable version in upstream response")
    return max(stable, key=version_key)


def compare(current, latest):
    target, keys = version_key(latest), [version_key(v) for v in current]
    if not target or not keys or any(k is None for k in keys):
        return "manual review"
    if any(k > target[:len(k)] for k in keys):
        return "ahead of upstream; investigate"
    if any(k < target[:len(k)] for k in keys):
        return "update available"
    return "current series" if any(len(k) < len(target) for k in keys) else "current"


def request_data(url, as_json=True):
    headers = {"User-Agent": "foundry-technology-audit", "Accept": "application/json" if as_json else "text/html"}
    if urlparse(url).hostname == "registry.npmjs.org":
        headers.update({"Accept": "application/vnd.npm.install-v1+json", "Accept-Encoding": "gzip"})
    if urlparse(url).hostname == "api.github.com" and os.environ.get("GH_TOKEN"):
        headers["Authorization"] = "Bearer " + os.environ["GH_TOKEN"]
    with urlopen(Request(url, headers=headers), timeout=30) as response:
        raw_bytes = response.read()
        if response.headers.get("Content-Encoding") == "gzip":
            raw_bytes = gzip.decompress(raw_bytes)
        raw = raw_bytes.decode("utf-8")
    return json.loads(raw) if as_json else raw


def yaml_file(path):
    # BaseLoader preserves GitHub's 'on' key and version scalars as strings.
    return yaml.load(path.read_text(encoding="utf-8"), Loader=yaml.BaseLoader)


def inventory(root):
    files = sorted(set(subprocess.check_output(["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"], cwd=root).decode().strip("\0").split("\0")))
    lock, workspace = yaml_file(root / "pnpm-lock.yaml"), yaml_file(root / "pnpm-workspace.yaml")
    if str(lock.get("lockfileVersion")) != "9.0":
        raise ValueError("Unsupported lockfile format; update scanner before claiming coverage")
    inputs = {"pnpm-lock.yaml", "pnpm-workspace.yaml", ".replit", "tsconfig.base.json", "lib/api-spec/openapi.yaml", "docs/technology-policy.json", "scripts/requirements.txt"}
    packages, local_packages = {}, []
    for key in lock["packages"]:
        name, version = key.split("(", 1)[0].rsplit("@", 1)
        row = packages.setdefault(name, {"name": name, "kind": "npm transitive", "current": [], "locked_versions": [], "declarations": [], "lookup": "npm", "source": "https://registry.npmjs.org/" + quote(name, safe="@")})
        row["locked_versions"].append(version)
    for path in (p for p in files if p == "package.json" or p.endswith("/package.json")):
        inputs.add(path)
        data = json.loads((root / path).read_text(encoding="utf-8"))
        local_packages.append({"name": data.get("name", path), "version": data.get("version", "unversioned"), "path": path})
        importer = str(Path(path).parent).replace("\\", "/")
        for group in GROUPS:
            for name, declared in data.get(group, {}).items():
                if declared.startswith(("workspace:", "link:", "file:")):
                    continue
                constraint = declared
                if declared.startswith("catalog:"):
                    catalog = declared.split(":", 1)[1]
                    constraint = (workspace["catalogs"][catalog] if catalog else workspace["catalog"])[name]
                resolved = lock.get("importers", {}).get(importer, {}).get(group, {}).get(name, {}).get("version")
                if not resolved and group != "peerDependencies":
                    raise ValueError(f"Missing lockfile resolution: {path}: {name}")
                if name not in packages:
                    raise ValueError(f"Uninventoried external dependency: {path}: {name}")
                row = packages[name]
                row["kind"] = "npm direct"
                row["declarations"].append({"path": path, "group": group, "declared": declared, "constraint": constraint, "resolved": resolved})
                if resolved:
                    row["current"].append(resolved.split("(", 1)[0])
    for row in packages.values():
        row["locked_versions"] = sorted(set(row["locked_versions"]))
        row["current"] = sorted(set(row["current"] or row["locked_versions"]))
    rows = list(packages.values())
    root_package = json.loads((root / "package.json").read_text(encoding="utf-8"))
    rows.append({"name": "pnpm", "kind": "package manager", "current": [root_package["packageManager"].split("@", 1)[1]], "lookup": "npm", "source": "https://registry.npmjs.org/pnpm", "evidence": ["package.json#packageManager"]})
    manifests = ["scripts/requirements.txt", *(p for p in files if Path(p).match("capabilities/*/requirements*.txt"))]
    python_packages = {}
    for manifest in manifests:
        inputs.add(manifest)
        for line in (root / manifest).read_text(encoding="utf-8").splitlines():
            if not line.strip() or line.startswith("#"):
                continue
            name, version = line.split("==")
            row = python_packages.setdefault(name, {"name": name, "kind": "Python dependency", "current": [], "lookup": "pypi", "source": f"https://pypi.org/pypi/{name}/json", "evidence": []})
            if version not in row["current"]:
                row["current"].append(version)
            row["evidence"].append(manifest)
    rows.extend(python_packages.values())
    replit = tomllib.loads((root / ".replit").read_text(encoding="utf-8"))
    runtime, actions, runners = {"Node.js": [], "Python": []}, {}, set()
    for module in replit["modules"]:
        for name, prefix in (("Node.js", "nodejs-"), ("Python", "python-base-")):
            if module.startswith(prefix):
                runtime[name].append({"path": ".replit", "version": module.removeprefix(prefix)})
    for path in (p for p in files if p.startswith(".github/workflows/") and p.endswith((".yml", ".yaml"))):
        inputs.add(path)
        for job in yaml_file(root / path).get("jobs", {}).values():
            runners.add(str(job.get("runs-on", "unspecified")))
            for step in job.get("steps", []) + ([job] if "uses" in job else []):
                uses = step.get("uses", "")
                if "@" not in uses or uses.startswith(("./", "docker://")):
                    continue
                name, ref = uses.rsplit("@", 1)
                row = actions.setdefault(name, {"name": name, "kind": "GitHub Action", "current": [], "evidence": [], "lookup": "github", "source": f"https://api.github.com/repos/{'/'.join(name.split('/')[:2])}/releases/latest"})
                row["current"].append(ref)
                row["evidence"].append(path)
                for runtime_name, action, key in (("Node.js", "actions/setup-node", "node-version"), ("Python", "actions/setup-python", "python-version")):
                    if name == action:
                        pin = step.get("with", {}).get(key)
                        if pin is None:
                            raise ValueError(f"Unresolved runtime version: {path} {action}")
                        runtime[runtime_name].append({"path": path, "version": str(pin)})
    for row in actions.values():
        row["current"], row["evidence"] = sorted(set(row["current"])), sorted(set(row["evidence"]))
    rows.extend(actions.values())
    for name, lookup_type, source in (("Node.js", "node", "https://nodejs.org/dist/index.json"), ("Python", "python", "https://www.python.org/api/v2/downloads/release/?is_published=true&limit=1000")):
        rows.append({"name": name, "kind": "runtime", "current": sorted({x["version"] for x in runtime[name]}), "declarations": runtime[name], "lookup": lookup_type, "source": source})
    for item in json.loads((root / "docs/technology-policy.json").read_text(encoding="utf-8"))["technologies"]:
        row = dict(item)
        if row["name"] == "JavaScript / ECMAScript":
            row["current"] = [json.loads((root / "tsconfig.base.json").read_text())["compilerOptions"]["target"]]
        elif row["name"] == "OpenAPI":
            row["current"] = [yaml_file(root / "lib/api-spec/openapi.yaml")["openapi"]]
        elif row["name"] == "Replit / Nixpkgs":
            row["current"], row["managed_packages"] = [replit["nix"]["channel"]], replit["nix"]["packages"]
        elif row["name"] == "GitHub hosted runner":
            row["current"] = sorted(runners)
        rows.append(row)
    return {"schema_version": 2, "source_commit": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=root, text=True).strip(), "input_sha256": {p: hashlib.sha256((root / p).read_bytes().replace(b"\r\n", b"\n")).hexdigest() for p in sorted(inputs)}, "local_packages": local_packages, "workspace_importers": sorted(lock["importers"]), "overrides": workspace.get("overrides", {}), "technologies": sorted(rows, key=lambda r: (r["kind"], r["name"].lower()))}


def lookup(row):
    row = dict(row)
    kind = row.get("lookup", "manual")
    if kind == "manual":
        row["status"] = "managed / manual review"
        return row
    try:
        if kind == "html":
            row["latest"] = latest_stable(re.findall(row["pattern"], request_data(row["source"], False)))
        else:
            data = request_data(row["source"])
            if kind == "npm":
                row["latest_tag"] = data.get("dist-tags", {}).get("latest", "absent")
                stable = [v for v in data["versions"] if version_key(v) is not None]
                if not stable:
                    row["latest"] = "No stable release published"
                    row["status"] = "upstream prerelease only"
                    row["retrieved_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
                    return row
                row["latest"] = latest_stable(stable)
                if data["versions"][row["latest"]].get("deprecated"):
                    row["deprecated"] = data["versions"][row["latest"]]["deprecated"]
            elif kind == "pypi":
                row["latest"] = latest_stable(v for v, assets in data["releases"].items() if any(not a.get("yanked") for a in assets))
            elif kind == "github":
                if data.get("draft") or data.get("prerelease"):
                    raise ValueError("Release marked non-stable")
                row["latest"] = data["tag_name"]
            elif kind == "node":
                row["latest"] = latest_stable(d["version"] for d in data)
                row["latest_lts"] = latest_stable(d["version"] for d in data if d.get("lts"))
                row["latest_in_declared_series"] = {v: latest_stable(d["version"] for d in data if d["version"].removeprefix("v").startswith(v + ".")) for v in row["current"]}
            elif kind == "python":
                if isinstance(data, dict):
                    data = data["results"]
                row["latest"] = latest_stable(d["name"].removeprefix("Python ") for d in data if not d.get("pre_release") and d["name"].startswith("Python 3."))
            else:
                raise ValueError(f"Unsupported lookup {kind}")
        if version_key(row["latest"]) is None:
            raise ValueError("Stable channel returned prerelease or unrecognized version")
        row["status"] = compare(row["current"], row["latest"])
        row["retrieved_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    except Exception as error:
        row.pop("latest", None)
        row["status"], row["error"] = "lookup failed", str(error)
    return row


def markdown(report):
    rows = report["technologies"]
    direct = [r for r in rows if r["kind"] == "npm direct"]
    transitive = [r for r in rows if r["kind"] == "npm transitive"]
    lines = ["# Technology inventory", "", f"Generated: {report['generated_at']} (UTC). Base commit: `{report['source_commit']}`.", "", "Source-derived snapshot of the FoundRy workbench, supporting API/database packages, governance tools and delivery workflows. Manifests, lockfile and runtime configuration remain authoritative.", "", f"Coverage: {len(report['local_packages'])} package manifests, {len(report['workspace_importers'])} locked workspaces, {len(direct)} direct npm packages and {len(transitive)} additional transitive package names.", "", "npm current versions are exact lockfile resolutions, not proof of deployed/installed versions. The [JSON inventory](technology-inventory.json) includes every nested version, declaration, override, input hash and upstream source. Optional native packages may not be installed on all hosts. Direct rows compare direct resolutions; nested copies also appear in JSON.", "", "npm compares the highest numbered published non-prerelease version and records the publisher's latest tag separately; these can differ. Node stable Current and LTS are distinct. Partial runtime/action pins float within their series; installed patch versions are unknown. Manual reference dates are preserved, never refreshed merely by running the audit.", "", "See [the update plan](technology-update-plan.md) for migration order, unresolved managed versions and activation requirements.", ""]
    for title, values in (("Runtimes, tools, standards and services", [r for r in rows if not r["kind"].startswith("npm") and r["kind"] != "GitHub Action"]), ("GitHub Actions", [r for r in rows if r["kind"] == "GitHub Action"]), ("Direct application and development dependencies", direct), ("Transitive lockfile dependencies", transitive)):
        lines.extend([f"## {title}", "", "| Technology | In-place version / selector | Latest stable / reference | Status |", "| --- | --- | --- | --- |"])
        for r in values:
            latest = r.get("latest", "unknown") + (f"; LTS {r['latest_lts']}" if r.get("latest_lts") else "")
            if r.get("reference_checked"):
                latest += f" (checked {r['reference_checked']})"
            status = r["status"] + ("; deprecated upstream" if r.get("deprecated") else "")
            cells = [f"[{r['name']}]({r['source']})", ", ".join(r["current"]), latest, status]
            lines.append("| " + " | ".join(str(c).replace("|", "\\|").replace("\n", " ") for c in cells) + " |")
        lines.append("")
    lines.extend(["## Local packages", "", "Local source uses this repository's commit as its release identity.", "", "| Package | Version | Manifest |", "| --- | --- | --- |"])
    lines.extend(f"| {p['name']} | {p['version']} | `{p['path']}` |" for p in report["local_packages"])
    lines.extend(["", "## Managed native dependencies", "", "Declared in `.replit`; exact installed and upstream-by-package versions remain unresolved. The Nix channel is a package-set selector, not an exact lock. Inspect the Replit runtime before migration.", ""])
    for r in rows:
        if r.get("managed_packages"):
            lines.append(", ".join(f"`{p}`" for p in r["managed_packages"]) + ".")
    failures = [r for r in rows if r["status"] == "lookup failed"]
    lines.extend(["", f"Source lookup failures: {len(failures)}."])
    lines.extend(f"- {r['name']}: {r['error']}" for r in failures)
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=ROOT / ".local/technology-audit")
    parser.add_argument("--offline", action="store_true")
    parser.add_argument("--fail-on-updates", action="store_true", help="Scheduled reminder only; never a PR gate")
    args = parser.parse_args()
    report = inventory(ROOT)
    report["generated_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    provisional = {**report, "technologies": [{**row, "status": "not checked (lookup pending)"} for row in report["technologies"]]}
    (args.output_dir / "technology-inventory.json").write_text(json.dumps(provisional, indent=2) + "\n", encoding="utf-8")
    (args.output_dir / "technology-inventory.md").write_text(markdown(provisional), encoding="utf-8")
    if args.offline:
        for row in report["technologies"]:
            row["status"] = "not checked (offline)"
    else:
        with ThreadPoolExecutor(max_workers=8) as pool:
            report["technologies"] = list(pool.map(lookup, report["technologies"]))
    args.output_dir.mkdir(parents=True, exist_ok=True)
    (args.output_dir / "technology-inventory.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    (args.output_dir / "technology-inventory.md").write_text(markdown(report), encoding="utf-8")
    rows = report["technologies"]
    errors = sum(r["status"] == "lookup failed" for r in rows)
    updates = sum(r["status"] in ("update available", "ahead of upstream; investigate") for r in rows)
    summary = (f"Technology audit: {len(rows)} entries; offline source extraction only; upstream releases NOT CHECKED."
               if args.offline else f"Technology audit: {len(rows)} entries; {updates} update/anomaly candidates; {errors} failed lookups.")
    print(summary)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as handle:
            handle.write(summary + "\n\nDownload the technology-inventory artifact for the complete source-linked report.\n")
    return 2 if errors else 1 if args.fail_on_updates and updates else 0


if __name__ == "__main__":
    sys.exit(main())
