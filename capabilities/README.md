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

### Recovering source records

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
