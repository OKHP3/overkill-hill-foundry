# Technology inventory

Reviewed 2026-07-20.

This checkout is an early-stage prompt and visual-asset repository. It is not a TypeScript, Vite, Tailwind, React, or Python application. No package manifest, lockfile, build configuration, test configuration, container file, or GitHub Actions workflow was present during the review.

## Technologies found

| Technology | In-place version | Latest stable checked | Evidence and update path |
| --- | --- | --- | --- |
| Git | 2.55.0.windows.2 on the review machine; not pinned by the repository | 2.55.0 | Repository is a Git checkout. The local version was checked with `git --version`; the upstream documentation reports Git 2.55.0. Update the developer machine or hosted runner when needed. |
| Markdown | Unspecified dialect; CommonMark-compatible conventions are used | CommonMark 0.31.2 | Root documentation and prompts are `.md` files. The repository does not declare a Markdown parser or formatter. Review Markdown tooling manually if a parser is introduced. |
| Python | Unspecified; no interpreter was available on the review machine | Python 3.14.6 | Bundled `.agents/skills/` scripts use Python. There is no `.python-version`, `pyproject.toml`, or workflow pin. The Python dependency used by the validator is recorded below. |
| PyYAML | Not pinned in the checkout; imported by `quick_validate.py` | 6.0.3 | PyYAML is the only non-standard Python import found in the bundled validator. `requirements-dev.txt` establishes a reproducible baseline and Dependabot monitors it. |
| JavaScript | Unspecified ECMAScript target; browser scripts only | ECMAScript 2026 | `viewer.html` and `eval_review.html` contain browser JavaScript. There is no JavaScript package or build tool. The current stable language edition is tracked by TC39, but JavaScript source here has no declared target. |
| SheetJS Community Edition | 0.20.3 | 0.20.3 | `viewer.html` loads `xlsx.full.min.js` from the official SheetJS CDN at version 0.20.3. Dependabot does not update arbitrary CDN URLs, so this reference requires a manual review or a future Renovate rule. |
| HTML and CSS | Unspecified browser platform level | Living web standards | The seeded evaluation viewer contains HTML, inline CSS, Google Fonts links, and browser APIs. No browser support matrix or build pipeline is declared. |
| YAML front matter | Unspecified | YAML 1.2 is the current general-purpose standard family | Skill documents use YAML front matter and PyYAML parses it. No YAML schema or version is declared. |
| PNG | PNG format; both tracked assets are 1024 x 1024 | PNG specification is stable | The two tracked visual assets are PNG files. This is an asset format, not a runtime dependency. |

## Explicitly absent

The review found no evidence of TypeScript, Vite, Tailwind CSS, React, Vue, Next.js, Node.js as a repository runtime, npm, pnpm, Yarn, Bun, Deno, Docker, or Python packaging beyond the newly declared development dependency. Node.js was present on the review machine at 24.11.1, but the repository does not use or require it.

The skill tooling also refers to the optional `claude` CLI. Its version is not recorded in this repository and it is not a dependency of the HMT01 asset content.

## Automatic update plan

1. `requirements-dev.txt` records PyYAML explicitly so its security and version updates can be proposed automatically.
2. `.github/dependabot.yml` checks Python dependencies weekly and checks GitHub Actions weekly. The Actions monitor is intentionally present before any workflow is added, so future workflows inherit update coverage.
3. Dependabot pull requests must be reviewed and merged only after the repository's Markdown, skill validation, and asset checks pass.
4. When a runtime or frontend is added, add its manifest and lockfile first. Dependabot can then track npm, pip, Docker, or other declared ecosystems. Do not add TypeScript, Vite, Tailwind, or a runtime merely to make this inventory appear complete.
5. Review the SheetJS CDN URL and browser-platform assumptions monthly. If the viewer becomes operationally important, move SheetJS into a package manifest or add a narrowly scoped Renovate custom manager for the CDN version string.

## Sources checked

- [Python downloads](https://www.python.org/downloads/), latest stable Python 3.14.6 as of the review date.
- [Git documentation](https://git-scm.com/docs/git), reporting Git 2.55.0.
- [ECMAScript 2026 specification](https://tc39.es/ecma262/), the latest stable annual language edition as of the review date.
- [CommonMark current specification](https://spec.commonmark.org/current/), version 0.31.2.
- [PyYAML on PyPI](https://pypi.org/project/PyYAML/), version 6.0.3.
- [SheetJS API documentation](https://docs.sheetjs.com/docs/api/), current version 0.20.3.
- [GitHub guidance for keeping Actions up to date with Dependabot](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/auto-update-actions).
