# Technology inventory and update policy

Original inventory reviewed 2026-09-01. Executable-helper scope and six publisher release baselines checked 2026-10-01.

This repository is documentation-only. It does not contain a TypeScript or JavaScript application, Vite, Tailwind CSS, root application package manifest, application build system, or deployable service. The inventory therefore distinguishes technologies used by checked-in scripts from formats and standards described by the knowledge assets.

## Inventory

| Technology | Repository use | Version in place | Latest stable found | Authority |
| --- | --- | --- | --- | --- |
| Python | Runtime for checked-in utility scripts | Unknown, not pinned | 3.14.8 | [Python downloads](https://www.python.org/downloads/) |
| PyYAML | Referenced validation dependency; no owning manifest | Unknown, not declared | 6.0.3 | [PyPI](https://pypi.org/project/PyYAML/) |
| Mermaid | Documented diagram output | Unknown, no renderer checked in | 12.0.0 | [Mermaid releases](https://github.com/mermaid-js/mermaid/releases) |
| PlantUML | Documented diagram syntax and output | Unknown, no renderer checked in | 1.2026.8 | [PlantUML news](https://plantuml.com/news) |
| BPMN | Documented process-model output | 2.0.2 | 2.0.2 | [OMG BPMN 2.0.2](https://www.omg.org/spec/BPMN/2.0.2/) |
| Markdown/CommonMark | Primary documentation format | Unknown, parser not pinned | 0.31.2 | [CommonMark](https://spec.commonmark.org/current/) |
| YAML | `SKILL.md` front matter | Unknown, parser not pinned | 1.2.2 | [YAML 1.2.2](https://yaml.org/spec/1.2.2/) |
| JSON | Metadata and structured examples | Unknown, implementation not pinned | RFC 8259 / STD 90 | [IETF RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) |
| CSV | Documented structured output | Not versioned here | No single governing version | [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) |
| Git/GitHub | Source control and hosting | Git client not recorded | Not applicable to repository contents | [Git](https://git-scm.com/) |
| Node.js LTS | Bundled helper tests in seven private dependency-free packages | Unknown, no repository runtime pin | 24.21.0 | [Node.js release data](https://nodejs.org/dist/index.json) |
| npm | Bundled helper tests in seven private dependency-free packages | Unknown, no repository runtime pin | 12.2.0 | [npm registry](https://registry.npmjs.org/npm/latest) |

The Python and PyYAML values are release baselines, not claims about the local workstation. The repository currently records no installed runtime versions. Mermaid and PlantUML are referenced knowledge technologies only. They are not dependencies of this repository.

## Explicitly absent

TypeScript, JavaScript application code, Vite, Tailwind CSS, React, and related frontend tooling are not present. Seven bundled helper packages use Node.js and npm for tests, with no third-party dependencies. No version comparison or update automation should be added for them until an implementation is checked in.

## Update plan

1. Keep `docs/maintenance/technology-inventory.json` as the source of truth for the reviewed baseline and the evidence URL.
2. Add a versioned Python dependency file when the repository begins executing the Python tools in CI. At minimum it should pin a supported Python line and `PyYAML`.
3. Use Dependabot for GitHub Actions now and for `pip` or `npm` once those manifests exist. It will open update pull requests rather than silently changing source.
4. Run the scheduled inventory check monthly. It flags stale review baselines so a maintainer can re-check official release pages and update the inventory with an intentional commit.
5. When an application runtime is added, add its lockfile and CI verification before enabling automatic major-version updates. Major upgrades must be reviewed against the documented output contracts.

The automation is deliberately review-oriented. Automatically upgrading diagram languages or documentation parsers can change generated output or interpretation without a test suite, so those updates should arrive as pull requests for review.

## Maintenance reconciliation

The six monitored publisher baselines include Node.js LTS 24.21.0 and npm 12.2.0 for bundled helper tooling. Python 3.14.8 is the current release baseline. These are release observations, not installed versions or application dependencies. The checker returns an incomplete result when a publisher lookup or parser fails. The workflow runs four evidence-boundary regressions before checking live sources. The old local inventory branch is superseded: main already contains its useful fixes and removes root dependency updater jobs that had no manifests.
