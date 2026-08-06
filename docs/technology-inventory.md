# Technology inventory

Reviewed 2026-08-05.

## Scope

This repository is currently an Agent Skills workspace containing Markdown guidance, JSON and YAML data used by local skills, Python and JavaScript scripts used by local skill tooling, package-local test manifests, evaluation records, and two PNG assets. It has no product application source, root package manifest, product build configuration, product test suite, or deployment configuration.

## Technologies and versions

| Technology or format | Evidence in this repository | Version in use | Latest stable checked 2026-07-20 | Update status |
| --- | --- | --- | --- | --- |
| Python | Seeded `.py` scripts and `python3` shebangs | Not pinned. `gen-skills-readme.py` documents Python 3.9+ | Python 3.14.6 | Dependabot can update PyYAML. Runtime pinning remains an owner decision because the repository has no runtime contract. |
| Node.js | Foundry validation script and package-local JavaScript test/generator scripts | Not pinned by a root manifest | Not declared | Used by local skill tooling and validation, not evidence of a product runtime. |
| PyYAML | `requirements.txt` declares the dependency for selected seeded-tool validation workflows | `6.0.3` | 6.0.3 | Dependabot checks weekly and opens update pull requests. No current product import was found. |
| Claude Code CLI | Historical benchmark references mention Claude-based evaluation scripts, but those scripts are not present in the current checkout | Not pinned. Optional and unverified for the current workspace | No stable version is declared by the repository | Keep this dependency external unless a supported evaluation workflow is reintroduced. |
| Git | Repository metadata and version-control workflow | Not pinned in the repository | Git v2.55.0 | Host/tooling responsibility. Dependabot cannot update a developer's local Git installation. |
| Markdown | `*.md` project and skill documentation | Not pinned. CommonMark is the closest formal dialect reference | CommonMark 0.31.2 | Documentation format, not a package dependency. |
| JSON | Seeded skill data files | Not applicable. JSON has no repository package version | Not applicable | Data format only. |
| PNG | Two 1024 by 1024 RGB identity assets | PNG format; asset files have no software version | Not applicable | Asset format only. |

## Explicitly absent

No evidence was found for TypeScript, JavaScript application source, npm application dependencies, Vite, Tailwind CSS, React, Vue, Svelte, a frontend framework, Docker, or a GitHub Actions workflow. JavaScript and Node.js do exist in local skill tooling and package-local manifests; they are not product-runtime evidence.

Node.js is documented by Anthropic as a prerequisite for the npm installation path of Claude Code, but it is not a technology implemented by this repository.

## Maintenance plan

1. `requirements.txt` records the declared third-party Python library used by selected repository tooling.
2. `.github/dependabot.yml` checks Python dependencies and GitHub Actions weekly and opens pull requests for available updates.
3. Dependabot pull requests should run the repository's future validation commands before merge. No application validation command exists yet.
4. When application code is added, add its native manifest and lockfile, then extend Dependabot with the relevant ecosystem and add CI coverage for supported runtime versions.
5. Review the Python runtime policy when the owner defines a supported deployment or development environment. Until then, the existing Python 3.9+ script claim is retained, even though Python 3.9 is end-of-life.

## Sources

- [Python downloads and active release status](https://www.python.org/downloads/)
- [Python 3.14.6 release notes](https://www.python.org/downloads/release/python-3146/)
- [PyYAML on PyPI](https://pypi.org/project/PyYAML/)
- [Claude Code setup and update documentation](https://docs.anthropic.com/en/docs/claude-code/getting-started)
- [Git v2.55 release notes](https://github.com/git/git/blob/master/Documentation/RelNotes/2.55.0.adoc)
- [CommonMark current specification](https://spec.commonmark.org/current/)
