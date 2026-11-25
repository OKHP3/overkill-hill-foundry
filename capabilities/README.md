# Capability projects

This is the home for consolidated OverKill FoundRy products. Use one stable
`capabilities/<slug>/` subtree per capability, independent of its GPT, skill,
plugin or connector packaging.

The [FoundRy catalog](../README.md#capability-catalog) links the fourteen legacy GPT
folders. Each external import below includes an exact source-tree revision in
`origin/source.json` and its original license.

| Former repository | Capability | Source material |
| --- | --- | --- |
| foundry-hmt01-homestead-r | [Homestead-R](homesteadr/) | HomeTools visual identity prompts and assets |
| foundry-psr00-pathscrib-r | [PathScrib-R](pathscribr/) | Business process facilitation, casebooks and modeling guidance |
| foundry-unt00-un-nocked-truth | [Un-Nocked Truth](un-nocked-truth/) | Argument-integrity concept, project tooling and identity assets |


Follow the [migration contract](../docs/portable-skill-foundry.md). Track each
approved source and destination in the
[migration registry](../registry/capability-migrations.json), referenced by the
[main registry](../registry/index.yaml).

The browser workbench exports the content of a prospective capability directory.
Review it, supply the missing source/license and evaluation evidence, and place
it under a chosen slug before submitting a repository change. Product skills live
in `skills/<skill-name>/`, while `.agents/skills/` holds repository contributor tools.
