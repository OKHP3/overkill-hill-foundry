# Technology inventory

Reviewed 2026-07-20.

## Scope

This repository is currently a scaffold containing Markdown guidance, JSON data used by seeded skills, Python scripts used by seeded skills, and two PNG assets. It has no application source, package manifest, build configuration, test suite, or deployment configuration.

## Technologies and versions

| Technology or format | Evidence in this repository | Version in use | Latest stable checked 2026-07-20 | Update status |
| --- | --- | --- | --- | --- |
| Python | Seeded `.py` scripts and `python3` shebangs | Not pinned. `gen-skills-readme.py` documents Python 3.9+ | Python 3.14.6 | Dependabot can update PyYAML. Runtime pinning remains an owner decision because the repository has no runtime contract. |
| PyYAML | `skill-creator/scripts/quick_validate.py` imports `yaml` | Previously untracked; now declared as `6.0.3` in `requirements.txt` | 6.0.3 | Dependabot checks weekly and opens update pull requests. |
| Claude Code CLI | `improve_description.py` and `run_eval.py` invoke `claude -p` | Not pinned. It is an optional external tool used by seeded skill evaluation scripts | No stable version is declared by the repository | Anthropic documents automatic self-updates. Keep this dependency external until the owner defines a supported runtime. |
| Git | Repository metadata and version-control workflow | Not pinned in the repository | Git v2.55.0 | Host/tooling responsibility. Dependabot cannot update a developer's local Git installation. |
| Markdown | `*.md` project and skill documentation | Not pinned. CommonMark is the closest formal dialect reference | CommonMark 0.31.2 | Documentation format, not a package dependency. |
| JSON | Seeded skill data files | Not applicable. JSON has no repository package version | Not applicable | Data format only. |
| PNG | Two 1024 by 1024 RGB identity assets | PNG format; asset files have no software version | Not applicable | Asset format only. |

## Explicitly absent

No evidence was found for TypeScript, JavaScript application source, Node.js project files, npm, Vite, Tailwind CSS, React, Vue, Svelte, a frontend framework, a Python package manager configuration, Docker, or a GitHub Actions workflow.

Node.js is documented by Anthropic as a prerequisite for the npm installation path of Claude Code, but it is not a technology implemented by this repository.

## Maintenance plan

1. `requirements.txt` records the only third-party Python library currently imported by the repository.
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
