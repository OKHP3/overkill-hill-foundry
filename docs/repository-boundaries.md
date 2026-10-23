# Repository Boundaries

This note routes work across the OverKill Hill public site, FoundRy, and
MurderBird Uncaged so each project has a clear source of truth.

| Repository or surface | Owns |
|---|---|
| [`OKHP3/OverKill-Hill`](https://github.com/OKHP3/OverKill-Hill) | OverKill Hill public brand, portfolio, and editorial stories |
| [`OKHP3/OverKill-Hill-FoundRy`](https://github.com/OKHP3/OverKill-Hill-FoundRy) | OverKill-region governance relay and capability workbench |
| [`OKHP3/murderbird-uncaged`](https://github.com/OKHP3/murderbird-uncaged) | MurderBird creative assets and interactive application |

The [OverKill-Hill site](https://github.com/OKHP3/OverKill-Hill) owns the
published story at [`/writings/murderbird/`](https://overkillhill.com/writings/murderbird/),
its site shell, and any copies needed for distribution. Editorial publication
remains owned by the website.

FoundRy builds portable Agent Skills and their plugin/connector adapters, including
conversion of existing GPT methods. Consolidated products use `capabilities/<slug>/`
under the [migration contract](portable-skill-foundry.md). Supporting prompts,
workflows and software starters remain available; the GPT studio is retained as a
legacy workspace. Do not duplicate the MurderBird app or keep its creative source
assets here.

Keep all MurderBird creative assets and app implementation in MurderBird
Uncaged. Its supplied snapshot of the published story provides creative
context; the website remains the editorial source of truth.
