# FND-23 decision: defer merge import

**Decision status:** Defer adoption of a merge-import feature. Preserve the current explicit backup, replace and cancel contract. This closes A18's conditional decision duty; it does not close FND-23 as a product feature or authorize implementation.

**Basis:** The trigger is unmet. The current evidence does not show that a real transfer requires combining the imported workspace with the receiving workspace. A05's protected PR 61 release at this checkout adds review of replacement scope, cancel, stale-state rejection and recovery for the prior and selected imported states. Its six final import cases exercise disposable same-origin state and recovery. A05 explicitly did not test cross-origin transfer, a real owner backup, or representative-user need. A07 is queued to verify transfer and rollback across actual browser origins. Neither a stale replacement nor a planner's existence establishes demand for merging.

The prior F16 handoff and current source show that `planCapabilityWorkspaceImport` is a pure preview over two caller-validated version-1 workspaces. It labels matching IDs `identical` or `conflicting`, labels incoming-only IDs `new`, clones the listed project values, counts resulting projects and reports overflow. It does not parse or validate input, resolve an identity collision, assign a renamed project's identity, select projects, persist changes, provide UI, or make a transaction. The default bound of 20 is a planner parameter, not evidence of an adopted user-facing merge policy. Its unit cases establish classification behavior only.

The maturation proposal places explicit migrations and recovery UX after real outcome evidence. The requirements ledger also records version history and conflict-aware merge as deferred until representative users and recovery/conflict fixtures demonstrate material loss that those features resolve. This decision follows those gates and leaves the present replacement path intact.

## Evidence needed to reconsider

Reopen this decision only after an observed transfer task establishes a concrete need to preserve receiving projects while bringing in selected imported projects. Capture the source and receiving origin, exact application revision, the task and user expectation, project counts and IDs, what replacement would lose, and the outcome using disposable or explicitly authorized data. Record whether the need was successfully handled with the existing export/backup/replacement path. One representative, reproducible case may justify a scoped design review; it does not itself authorize implementation. If actual-origin transfer succeeds and users can safely choose replacement, keep merge deferred. Do not infer demand from synthetic fixtures, a prototype, a queued task, or a hypothetical collision.

## Bounded proposal if that evidence supports adoption

A separately authorized implementation decision should keep replacement as the existing default path and expose merge as an explicit, opt-in action. It should define and test:

- A deterministic preview bound to both the receiving revision and the selected import bytes. Classify identical, conflicting and incoming-only project IDs, show counts and resulting capacity, and require the user to resolve every conflict before commit.
- Explicit choices for a collision: keep the receiving project, replace it with the imported project, or add an imported copy under a new, collision-free ID. A display-name rename must not silently change identity. Show the final identity and content source of each resulting row; an unresolved collision or unspecified new ID blocks commit.
- Capacity against the current canonical workbench limit (the planner currently defaults to 20), with no silent truncation. If the chosen set exceeds the limit, identify the additions that must be removed or have the user cancel; never partially import.
- Preview, cancel and commit as separate actions. Cancel performs no storage write. Commit rechecks both source snapshots/revisions under the established writer coordination, applies the reviewed plan atomically, and preserves a recoverable pre-commit backup. A stale preview must be discarded and rebuilt before another confirmation.
- Acceptance cases for equal IDs with equal and changed content, chosen rename/copy IDs and secondary collisions, duplicate names, capacity exactly at and above the bound, stale local and cross-tab changes, cancel with byte-identical storage, commit/read-back failure, and restoration from the original backup. Verify that the separate `cgpt-workspace` remains unchanged.

The next step is evidence collection in A07 and, if needed, an owner-selected representative task. Root must approve any later design/implementation scope after reviewing that evidence. This document is a decision proposal only; it changes no application behavior.

## Evidence boundary

**Confirmed:** A05 PR 61 is published at the supplied A18 base with protected checks passed, per coordinator confirmation. The final A05 candidate recorded in its receipt includes strengthened coverage for six import cases and has separate central validation evidence. The planner is disconnected from the live import path described by the F16 handoff. Existing same-origin replacement/recovery scenarios are synthetic disposable tests.

**Not established:** Actual cross-origin transfer or rollback, representative-user demand for merge, real identity conflicts in transferred data, historical/personal workspace behavior, or an approved merge policy. No private or personal data was inspected for this decision.

**Sources:** `docs/handoffs/2026-10-05-executable-series/receipts/a05.md`; `docs/handoffs/2026-10-05-executable-series/prompts/a07.md`; `docs/handoffs/coop-pertition-2026-09-07/f16.md`; `artifacts/mockup-sandbox/src/lib/coop-import-plan.ts` and its adjacent tests; `docs/capability-workbench-maturation.md`; `docs/foundry-requirements-ledger.md`.
