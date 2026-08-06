# foundry-hmt01-homestead-r

Canonical agent guidance for the FoundRy HMT01 Homestead-R repository.

## Project identity

- **Suite:** FoundRy
- **Repository:** `foundry-hmt01-homestead-r`
- **Remote:** `https://github.com/OKHP3/foundry-hmt01-homestead-r`
- **Declared type:** GPT tool
- **Declared purpose:** Homestead and property management
- **License:** MIT, as recorded in `LICENSE`
- **Current repository state:** Early-stage prompt and image-asset repository with a repository-local Agent Skills library. Recent commits show active maintenance, but no runnable GPT tool implementation is present in this checkout.

The project name and declared purpose are confirmed by the existing project metadata. The early-stage assessment is an evidence-based inference from the tracked files, which currently contain prompts, images, seeded skills, and no application runtime.

## Mission, vision, and scope

- **Mission:** Not documented in the repository.
- **Vision:** Not documented in the repository.
- **Current scope:** Preserve and develop the creative prompt and visual identity assets associated with HMT01 Homestead-R.
- **Current non-goals:** Do not infer or implement property-management workflows, data models, integrations, APIs, or a production deployment until the repository gains an explicit specification and implementation evidence.

Treat the project as a creative asset and prompt source unless new repository evidence establishes a runtime or product boundary.

## Repository layout

- `README.md`: Repository landing page with current status, content map, start-here links, and implementation boundaries.
- `docs/TECHNOLOGY-INVENTORY.md`: Evidence-based technology inventory, checked stable versions, and update policy.
- `requirements-dev.txt`: Explicit PyYAML development dependency for the seeded skill validator.
- `.github/dependabot.yml`: Weekly Dependabot monitoring for Python dependencies and future GitHub Actions.
- `assets/hometools/`: Paired HomeTools prompts and 1024 x 1024 visual assets.
- `.agents/skills/`: 35 repository-local Agent Skill packages, their references, fixtures, tests, and generated catalog. These are repository tooling and guidance, not evidence of the HMT01 product runtime.
- `LICENSE`: MIT license.
- `CLAUDE.md`: Compatibility pointer to this file via `@AGENTS.md`.

There are no nested Git repositories or clearly independent application projects in the current tree.

The prior project metadata identifies these related FoundRy repositories:

- `foundry-unt00-un-nocked-truth`: https://github.com/OKHP3/foundry-unt00-un-nocked-truth
- `foundry-psr00-pathscrib-r`: https://github.com/OKHP3/foundry-psr00-pathscrib-r
- `foundry-are00-abrahamic-reference-engine`: https://github.com/OKHP3/foundry-are00-abrahamic-reference-engine

Do not assume shared code, interfaces, or release dependencies without checking the related repository directly.

## Technology and runtime

The confirmed technology surface is Markdown, PNG assets, Git, the seeded `.agents/skills/` guidance, and a pinned PyYAML development dependency used by the validator. No `package.json`, Python application manifest, container file, build configuration, test configuration, deployment configuration, or CI workflow is present. There is no application entry point or tests directory in this checkout. Dependabot configuration exists for dependency monitoring, but there is no verified local run, build, test, lint, or deployment command.

Do not describe this checkout as a working application. If implementation files are added later, update this section with the verified runtime, entry points, environments, and commands.

## Safe change conventions

- Keep `AGENTS.md` as the canonical project guide. Keep `CLAUDE.md` as a short compatibility pointer unless Claude-specific instructions are genuinely needed.
- Preserve existing user changes and inspect `git status` before editing.
- Keep prompt documents and their corresponding visual assets synchronized when changing the intended image identity. Do not regenerate or replace binary assets casually.
- Preserve the OverKill Hill P3 visual language: blueprint grid, industrial or steampunk treatment, distressed materials, and orange fire accents where the asset or prompt calls for them.
- Generated content must contain no em dashes.
- Preserve standalone punchy lines. Do not combine them into paragraphs when editing project-facing content.
- Follow the ROY principle: explanation and verbosity should earn their space.
- AutoCAD R10 is an organization-level locked rule, but no CAD files or CAD workflow are present in this repository. Do not add CAD assumptions to HMT01 without evidence.
- Do not add credentials, secrets, private workspace links, or unsupported claims about product behavior.

## Validation

For guidance or prompt changes, use checks appropriate to the changed files:

```text
git status --short
git diff --check
rg --files -g '!node_modules' -g '!vendor'
file assets/hometools/overkill-hill-p³-square-icon-hometools.png assets/hometools/overkill-hill-p³-square-icon-hometools-alt-.png
```

Review changed Markdown for factual alignment and inspect changed images at their native dimensions when visual identity is affected. No automated test suite exists at present.

## Known gaps and open questions

- The implementation status of the GPT tool is not documented beyond the repository label and declared purpose.
- The product mission, target users, vision, workflows, data flows, integrations, and deployment model are unknown.
- The intended relationship between HMT01 and the repository-local Agent Skills is not documented.

Do not resolve these gaps by invention. Update this guide when repository evidence or owner direction answers them.

## Keeping this guide current

When the repository gains an implementation, specification, workflow, or deployment surface, update this guide in the same change or in a focused follow-up. Recheck paths and commands before documenting them. Keep confirmed facts, inferences, and unknowns clearly separated.

Updated from local repository evidence on 2026-08-05.
