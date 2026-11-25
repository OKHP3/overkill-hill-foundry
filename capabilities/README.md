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

Un-Nocked Truth also hosts the four [Archery for Anyone components](un-nocked-truth/#archery-for-anyone).

Follow the [migration contract](../docs/portable-skill-foundry.md). Track each
approved source and destination in the
[migration registry](../registry/capability-migrations.json), referenced by the
[main registry](../registry/index.yaml).

## Native ChatGPT plugins

Each project below has a private ChatGPT plugin created from its legacy GPT. Upload counts include repeated filenames from the original editor.

| Capability | Original starters | Original knowledge uploads |
| --- | ---: | ---: |
| [PromptForge](promptforge/) | 12 | 0 |
| [Cage Fight-Rᵧ](cage-fight-ry/) | 7 | 3 |
| [PathScrib-R](pathscribr/) | 12 | 18 |
| [Homestead-R](homesteadr/) | 12 | 15 |
| [HomeEstimate-R](homeestimate-r/) | 12 | 14 |
| [FloorPlan-R](floorplan-r/) | 12 | 11 |
| [HomeVisual-R](homevisual-r/) | 12 | 14 |
| [PhenoMould-R](phenomould-ry/) | 12 | 11 |
| [PromptAscend-R](promptascend-r/) | 0 | 19 |
| [ToneStrik-Rᵧ](tonestrik-ry/) | 12 | 8 |
| [TellEPrompt-Rᵧ](telleprompt-ry/) | 12 | 8 |
| [StructRefino-Rᵧ](structrefino-ry/) | 12 | 9 |

The 12 native archives contain all 130 indexed uploads and all 12 original instruction blocks. ChatGPT kept 33 of the 127 starters as defaults. Each project’s source record preserves its complete starter list. The archives retain the original filenames alongside the readable repository packages.

## Recovering source records

Each imported project's `origin/source.json` identifies its original commit
and the FoundRy import commit containing a byte-identical subtree. Use the
original commit with `git show` in FoundRy to read a file at its original path.
The `originalRefs` field includes PathScrib-R's pull request heads.

The readable GitHub records are in each project's `origin/` directory. The
adjacent `github-native.enc` holds the original API responses and available
Actions log ZIPs, including operational fields omitted from the readable
edition. The owner holds the passphrase separately.

Verify the archive's SHA-256 against `nativeGitHubRecovery.sha256` in
`origin/source.json`. To recover the member files, run the following from a
private empty directory, substituting the paths to the archive and passphrase.
The receipt also lists the SHA-256 of each recovered file.

```sh
openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -md sha256 -pass file:/path/to/passphrase.txt -in /path/to/github-native.enc -out github-native.tar.gz
tar -xzf github-native.tar.gz
```

GitHub had already expired 14 Homestead-R, 14 PathScrib-R and 16 Un-Nocked
Truth log archives when the records were collected. Their run and job records
are preserved.

The browser workbench exports the content of a prospective capability directory.
Review it, supply the missing source/license and evaluation evidence, and place
it under a chosen slug before submitting a repository change. Product skills live
in `skills/<skill-name>/`, while `.agents/skills/` holds repository contributor tools.
