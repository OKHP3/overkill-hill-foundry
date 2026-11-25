# foundry-unt00-un-nocked-truth

## Current status

This repository is an OKHP3 FoundRy workspace containing local Agent Skills,
skill-evaluation evidence, migration prompts, and supporting identity assets.

The historical project identity is UNT00, Un-Nocked Truth, described in project
metadata as a proposed GPT tool for logical analysis and argument-integrity
checking. This checkout contains no product runtime, application source, API,
build configuration, deployment configuration, or application test suite.

Do not treat the repository as proof that the proposed product is implemented or
production-ready.

## Start here

- [AGENTS.md](AGENTS.md): canonical repository guidance and evidence boundary.
- [.agents/skills/README.md](.agents/skills/README.md): generated catalog of the
  local skill packages.
- [.agents/prompts/](.agents/prompts/): project onboarding and migration prompts.
- [docs/technology-inventory.md](docs/technology-inventory.md): current tooling and
  dependency inventory.

## Repository map

- `.agents/skills/`: incubating and project-local Agent Skills with references,
  assets, scripts, tests, evaluations, and selected benchmark records.
- `.agents/prompts/`: reusable project-context and migration prompts.
- `skills/okhp3-skill-promotion/`: publication mirror for the promotion skill.
- `assets/identity/`: historical identity or reference assets. Their names are
  preserved for provenance.
- `requirements.txt`: Python dependency declaration used by seeded tooling.
- `.github/dependabot.yml`: dependency-maintenance configuration.

## Boundaries

Product audience, runtime, model or API integration, input and output contract,
deployment target, and operational ownership remain `TBD`. Evaluation records
and benchmark files are retained as evidence until their provenance and
replacement status are explicitly reviewed.
