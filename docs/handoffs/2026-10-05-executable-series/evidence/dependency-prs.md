# A25 — dependency PR review

Review date: 2026-10-05. Coordinator is the sole integration owner. This is a review of the coordinator's refreshed open-PR capture in `.local/dependency-input/pr-{42,50,51,54,55}.json`; checks below are the actual GitHub check rollups in those captures, not checks rerun locally. The reviewed candidate heads are pinned explicitly so later PR updates require a new review.

## Scope and evidence boundary

The refreshed candidate set supplied for this assignment contains PRs 42, 50, 51, 54 and 55. PRs 48 and 49 are absent from that set; their terminal state is not present in these inputs, so this report does not claim they merged or closed. The prepared snapshots cover metadata, changed paths, PR bodies and check rollups. They do not include a fresh state query by this worker.

The current source baseline is `74ffadb447f702065e7912ca9fce5c9e8f36a22d`. PRs 42, 50 and 51 report older base SHAs (`37cb2ea…`, `23b961f…`, and `23b961f…` respectively). Even a successful check on those heads is not evidence against the current baseline. PRs 54 and 55 report the current baseline SHA.

## Per-PR decisions

### PR 42 — `@vitejs/plugin-react` 5.2.0 → 6.1.1

- Exact head: `027881927d63eb721757aa6ec7a1d5208c480297`; captured base: `37cb2ea40deffc751926e27208b17eef139b9f95`.
- **Decision: defer.** The current workspace catalog pins Vite `^7.3.6`; the exact 6.1.1 package declares Vite `^8.0.0` as a peer. Its 6.0.0 release also drops Vite 7 and earlier and removes the plugin's Babel-related options. This is a coordinated Vite-major migration, not a standalone plugin refresh. [Version-pinned 6.1.1 package metadata](https://github.com/vitejs/vite-plugin-react/blob/plugin-react%406.1.1/packages/plugin-react/package.json), [plugin React changelog](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/CHANGELOG.md).
- Captured CI: two `e2e` failures ([run 35572671708](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/35572671708), [run 35572668304](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/35572668304)); typecheck and audit checks passed in both matrices; filename check passed. The Mermaid sync check was skipped. Failure cause is not included in the capture and remains unknown.
- Next evidence: only reconsider as part of an explicitly scoped Vite 8 migration. Rebase/update to the current main SHA, resolve the Vite/plugin peer range, review config for removed Babel APIs, then require fresh build, typecheck, audit and browser checks. Do not merge this head as-is.

### PR 50 — `react-day-picker` 9.14.0 → 10.0.1

- Exact head: `b3b8ed5da5d57eb2e9825ce776b406eb7096f32d`; captured base: `23b961f456324d7281ea8912eec983341882b3d0`.
- **Decision: defer.** This is a major API/style migration. The official v10 guide removes deprecated v9 compatibility keys; specifically `table` becomes `month_grid`. The repository has five copied Calendar wrappers that still set `table`, including the custom GPT Creator wrapper. The old `react-day-picker` package name remains available for compatibility, but the guide recommends `@daypicker/react` for upgraded code. [DayPicker v10 migration](https://daypicker.dev/upgrading).
- Captured CI: both `e2e` and both `typecheck` checks failed; both audit checks and the filename check passed. ([e2e run 1](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/36391186274), [e2e run 2](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/36391182826); [typecheck run 1](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/36391186374), [typecheck run 2](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/36391182779)). Failure causes are not in the capture. The base is also older than the current main SHA.
- Next evidence: migrate every affected wrapper/API/style key in a scoped change, then run install with the frozen lockfile, typecheck, Calendar-focused browser coverage and the full relevant e2e matrix on current main. Current failed checks already block acceptance.

### PR 51 — `marked` 15.0.12 → 18.0.14

- Exact head: `33e8ecb3040419913a1aefad626bee189172c89e`; captured base: `23b961f456324d7281ea8912eec983341882b3d0`.
- **Decision: conditionally accept the update for integration after rebasing and refreshing required checks.** It crosses three majors, but local source search found only the `marked.parse(...)` call in the custom GPT Creator's GitHub-Markdown export e2e test; Marked's current API documentation still documents that import/call shape. This narrows the migration surface but does not replace the fixture regression. [Marked parse API](https://marked.js.org/using_advanced#the-parse-function).
- Captured CI on the old base: both e2e, both typecheck, both audit and filename checks succeeded. ([e2e run 1](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/36391213147), [e2e run 2](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/36391208198); [typecheck run 1](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/36391213136), [typecheck run 2](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/36391208005)). The Mermaid sync check was skipped. Refresh the head against current main and rerun before treating these as acceptance evidence.
- Security note: the upstream high-severity tokenizer OOM advisory affects Marked 18.0.0 and 18.0.1 and lists 18.0.2 as patched. Candidate 18.0.14 is beyond the affected range; the captured audit jobs also passed. [Upstream GHSA-6v9c-7cg6-27q7](https://github.com/markedjs/marked/security/advisories/GHSA-6v9c-7cg6-27q7). Marked does not sanitize generated HTML; preserve an explicit sanitizer boundary anywhere parsed output can reach a browser sink. [Marked security guidance](https://marked.js.org/#security).
- Focused evidence: after rebase, rerun the GitHub-Markdown fixture/browser regression and typecheck. Confirm the generated HTML contract (links, GFM tables/task lists, code blocks and raw HTML behavior) against the test fixture. No local candidate tests were run in this review.

### PR 54 — grouped npm minor updates (4 packages)

- Exact head: `024f82f9d7b2ae225a06be1c4e9921a122809bfe`; captured base: `74ffadb447f702065e7912ca9fce5c9e8f36a22d`.
- Updates: `react-hook-form` 7.88.0→7.89.0, `wouter` 3.11.0→3.13.0, `orval` 8.33.0→8.39.0, and `@tanstack/react-query` 5.102.8→5.104.0. These stay within their current major lines. Upstream notes for React Hook Form 7.89.0 list a peer-type addition and validation/state fixes; Orval 8.39.0 contains generator features and fixes; TanStack Query's 5.104.0 core entry is a minor change. [React Hook Form changelog](https://github.com/react-hook-form/react-hook-form/blob/master/CHANGELOG.md), [Orval 8.39.0 release](https://github.com/orval-labs/orval/releases), [TanStack Query changelog](https://github.com/TanStack/query/blob/main/packages/query-core/CHANGELOG.md).
- **Decision: defer the grouped PR pending an Orval output check.** `lib/api-spec` exposes a `codegen` script that runs Orval and then library typecheck. The captured PR changes the generator version but has no generated-code paths, and its successful generic checks do not establish whether output remains stable or needs regeneration.
- Captured CI at the then-current base: both e2e, both typecheck, both audit and filename checks succeeded ([e2e run 37277456820](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/37277456820), [e2e run 37277448804](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/37277448804); [typecheck run 37277456863](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/37277456863), [typecheck run 37277448699](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/37277448699)). The Mermaid sync check was skipped. The earlier package-age conclusion was inferred from release notes and is withdrawn: this review does not independently establish registry publication times or satisfaction of every cooldown/exclusion gate. Preserve the configured policies and verify them during any candidate integration.
- Next evidence: in an isolated candidate checkout, run `pnpm --filter @workspace/api-spec run codegen`; inspect and explain any generated diff, then require library typecheck and fresh e2e/audit checks. Preserve the frozen lockfile and release-age policy.

### PR 55 — grouped npm patch updates (6 packages)

- Exact head: `330c7fd0e9f11a30e1225624fe954142ee0cb94a`; captured base: `74ffadb447f702065e7912ca9fce5c9e8f36a22d`.
- Updates: `prettier` 3.9.6→3.9.9, `pg` 8.23.0→8.23.1, `drizzle-kit` 0.31.10→0.31.11, `@types/node` 26.6.2→26.6.4, `drizzle-orm` 0.45.2→0.45.3, and `tsx` 4.23.13→4.23.15. All are patch-level within the existing major/minor lines. Drizzle Kit's release adds CLI/SDK capabilities; this workspace's existing database scripts remain the key behavior to protect. [Drizzle release notes](https://github.com/drizzle-team/drizzle-orm/releases), [tsx 4.23.15 release](https://github.com/privatenumber/tsx/releases).
- **Decision: acceptable candidate for coordinator integration, subject to a fresh exact-head check and focused database smoke.** Captured CI at the current base reports both e2e, both typecheck, both audit and filename checks successful ([e2e run 37277469129](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/37277469129), [e2e run 37277464498](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/37277464498)). The Mermaid sync check was skipped. The lockfile and all changed manifests are included; e2e/typecheck workflows install with `pnpm install --frozen-lockfile`, so those green runs provide lockfile consistency evidence. The one-day pnpm minimum-release-age policy remains configured and was not edited.
- Focused evidence before merge: run the non-database `drizzle-kit check` against the repository's migration history and a database package test/typecheck using a disposable test database or mock. Do not use `push`, `migrate`, or production credentials as a dependency smoke test. The upstream docs define `drizzle-kit check` as checking consistency of generated migration history. [Drizzle Kit check](https://orm.drizzle.team/docs/drizzle-kit-check).

## Checks and limitations

- No dependencies were installed and no local test/build command was run. This review checkout is a prepared metadata snapshot and must not be used for package or lockfile mutation.
- Required evidence to refresh before integration: current open/merged state, exact PR head, fresh required CI checks on current main, and then the focused checks named above. Captured CI result links are historical evidence for the listed SHA/base only.
- The candidate set is not a blanket latest-version upgrade. PRs 42 and 50 remain deferred for concrete incompatibility and failed CI; PR 54 is deferred for an unverified code-generation boundary; PR 51 is conditionally acceptable after a fresh current-base run; PR 55 is acceptable for coordinator review with the database smoke noted above.

## Coordinator verification addendum - October 5, 2026

Root refreshed all seven PR states after receiving this draft. PRs 42, 50, 51,
54 and 55 remain open at the exact heads above. PR 48 closed without merge at
2026-10-05T07:23:09Z; PR 49 closed without merge at 2026-10-05T07:22:56Z. This
resolves the earlier capture's unknown terminal states without claiming this
worker queried them.

The original plugin metadata link follows moving upstream main, which now shows
6.1.2. Root separately fetched the [immutable npm registry metadata for
6.1.1](https://registry.npmjs.org/@vitejs%2fplugin-react/6.1.1), confirming its
`vite: ^8.0.0` peer range. That version-specific observation supports the deferral;
the moving main link alone does not pin the candidate version. Root also checked
the linked DayPicker v10 migration and Marked advisory directly.

The database smoke is conditional on real migration history being present. If
this scaffold has no generated migrations, record that limitation and use an
appropriate config/typecheck/disposable-database check. Do not invent migration
history or use production credentials. These remain proposed focused checks;
no dependency update has been merged by this task.

## A25 recovery closeout refresh - October 11, 2026

Codex accepted the owner's closeout handoff in a fresh thread without a goal or
token ceiling. The fetched publication baseline is
`6a502342ec30418277e78600f6cee9b3ce8d40c7`. The recovery commit
`7daaa97f6cca9e6a32429203a79330f38902d9ef` and its branch are preserved. Comparing
content, rather than requiring recovery-commit ancestry, confirms that both draft
files were already incorporated through [PR 57](https://github.com/OKHP3/overkill-hill-foundry/pull/57)
at `8a8147845d65730deb9d4f59e5e73055e6d65db7`; current main adds the coordinator
verification. This amendment corrects evidence and records the closeout; it does
not remerge the stopped draft or update dependencies.

### Fresh PR state and tested-commit association

Authenticated GitHub PR and workflow API queries on October 11 confirm that all
five candidates remain open and unmerged at the exact heads above. PRs 48 and 49
remain closed without merge. Every candidate base is now older than fetched main.
The connector's commit-filtered workflow results were cross-checked with the
authenticated workflow API and checkout logs. The following representative E2E
runs identify their triggering candidate via `head_sha` and the PR head/base;
their checkout logs identify the actual synthetic merge commit used by CI.

| PR | Historical E2E run | Result | Checkout SHA actually tested |
| --- | --- | --- | --- |
| 42 | [35572671708](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/35572671708) | failure | `a2e7e8af7944be1a558b6d3bec3f93f502dd71f8` |
| 50 | [36391186274](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/36391186274) | failure | `5d89c3c2bbde7b24c1f881607805e7263903b785` |
| 51 | [36391213147](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/36391213147) | success | `a3bd76f969d445b4836bf62bcdce87d1be3d2f7f` |
| 54 | [37277456820](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/37277456820) | success | `258d2ff9e16c71ea5742aff07880096c819fcb91` |
| 55 | [37277469129](https://github.com/OKHP3/overkill-hill-foundry/actions/runs/37277469129) | success | `f5d32e81c5e2204233d754672706a3712183d009` |

These are freshly retrieved historical results, not newly executed tests of the
candidate alone or its integration with October 11 main. The original rollups
did not prove that association by themselves. A passing result from these old
bases cannot satisfy the remaining current-main merge gates. No candidate CI was
rerun and no candidate dependencies were installed during this closeout.

### Decisions and corrected findings

- **42: defer.** Version-pinned upstream 6.1.1 metadata still requires Vite
  `^8.0.0`; this repository still declares `^7.3.6`. The retrieved failing E2E
  log now establishes the build failure: plugin React imports `vite/internal`,
  which Vite 7 does not export (`ERR_PACKAGE_PATH_NOT_EXPORTED`). The broader
  migration remains separately scoped.
- **50: defer.** All five Calendar wrappers still supply `classNames.table`.
  The [upstream migration guide](https://daypicker.dev/upgrading) removes that
  key in favor of `month_grid`. The retrieved E2E log fails during typecheck
  with TS2353 on `artifacts/okh-capabilities/src/components/ui/calendar.tsx:86`.
  The separate typecheck run 36391186374 also records failure associated with
  the candidate head. A wrapper migration and current-base tests remain needed.
- **51: conditional candidate only.** Current source still has one
  `marked.parse(...)` call, in `artifacts/custom-gpt-creator/tests/export-package.e2e.ts`.
  The [upstream advisory](https://github.com/markedjs/marked/security/advisories/GHSA-6v9c-7cg6-27q7)
  lists 18.0.0/18.0.1 as affected and 18.0.2 as patched; 18.0.14 is outside that
  advisory's listed range. That is not a blanket security clearance. Retain the
  sanitizer boundary documented by [Marked](https://marked.js.org/#security),
  then update the base and run the export fixture/browser regression.
- **54: defer.** `lib/api-spec/package.json` still runs Orval followed by library
  typecheck. This PR contains manifests/lockfile changes without generated client
  output evidence. Run its codegen in an isolated candidate checkout, review the
  output diff, and refresh current-base checks before integration. The package-age
  inference above has been removed; no cooldown claim is substituted.
- **55: conditional candidate only.** The workspace database scaffold contains
  no tracked migration history and no dedicated database test script, so
  `drizzle-kit check` cannot prove this repository's migration behavior. Its
  config requires `DATABASE_URL`, and its available scripts perform database
  writes. Require a scoped config/library typecheck and appropriate disposable
  database or mock smoke before merge. Use migration-history checking only if
  actual history is supplied; [Drizzle's check documentation](https://orm.drizzle.team/docs/drizzle-kit-check)
  describes that narrower purpose. No `push`, `push-force`, `migrate`, production
  credentials, or database write was used here.

The review duty is satisfied by these bounded decisions and explicit follow-up
gates. No dependency PR is accepted for immediate merge by this report. The
one-day `minimumReleaseAge: 1440`, its existing exclusions, Dependabot policy,
and frozen-lockfile workflows remain unchanged. Documentation validation and
surface closeout evidence are recorded in the [A25 receipt](../receipts/a25.md).
