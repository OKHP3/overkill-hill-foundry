# Executable FoundRy series - 2026-10-05

This series converts all 48 findings from the [five-pass review](../../reviews/2026-10-04-equilibrium-review.md) into 28 bounded worker assignments. Four stopped or withdrawn attempts are preserved. Planned reuse is A03 -> A02, A01 -> A04, A05 -> A20, A06 -> A07, and A08 -> A24. Together with the three earlier review agents, this keeps the full plan within the owner's maximum of 30 agents overall. New findings can use a capable thread after its prior duty closes and within its remaining cumulative allocation. The original review remains dated evidence; this [machine ledger](tasks.json) owns current assignment status. The coordinator is thread `01a1096a-9ad8-7011-9cc5-25c41ff67308`, the sole integration owner.

## Current checkpoint

Fifteen overall agent slots are used: eleven new worker threads (including four preserved stopped or withdrawn attempts), three earlier reviewers and one bounded read-only closure reviewer. Ten duties have reviewed deliveries or decisions; no implementation worker is currently active. A01-A06, A18 and A25 have published deliveries or decisions. A07 has a completed actual Pages/local transfer and exact restore receipt, and A08 has final Firefox/WebKit acceptance. Their tests and evidence were published through PR63 at main `b267575f77226abcefc704062d893545da35e432`; PR64 preserved the stopped drafts and published the save receipt. No additional ready duty is silently assumed from an unanswered human or authorization gate. Future A09 reuses the completed A08 worker, keeping the full plan within 30 overall agents. The [closure retry receipt](../2026-10-06-origin-main-reconciliation.md) preserves the remaining acceptance and archive boundaries.

The next series has eighteen duties with their executable prompts below. Its first gates are a named human/assistive-technology tester (A09), independent unseen-task/rubric custody (A16), exact existing-source selection if needed (A10), and Replit connector authentication (A24). After custody freezes, A11-A15 form one source-safe exemplar and observed recipient-use chain; A14 runs only if a tool adapter is needed. A17/A19/A20 make bounded adopt/defer decisions. A21-A23 trial the requested external handoff, prompt/workflow and software outcomes after that exemplar. A26-A28 retain separate protected-fixture, capability-publication and additional-host/sibling authorization gates. A25's dependency report names separate candidate checks; its review does not merge those upgrades. A18's published defer decision does not implement merge import.

Each launch prompt is a complete assignment with scope, exclusions, dependency evidence, model/effort, working target, goal ceiling, retry bound and required handback. Refresh its frozen base only after the coordinator verifies prerequisite publication. Current machine status and usage are in [tasks.json](tasks.json); historical checkpoints below remain dated evidence.

## Budgets and dispatch

The coordinator goal has the requested 20,000,000-token ceiling. Every new worker uses `gpt-6-luna`, effort `low`. Ordinary duties configure 200,000-token goals; A05-A08 configure 500,000 and A02 configures 1,000,000. Smaller working targets guide effort. These are ceilings, not spending targets. The 28 duty budgets total 7,600,000; recorded corrections add 450,000, and three stopped attempts had 100,000 combined configured budgets. A03/corrections/A02 have the largest combined planned allocation, 1,450,000. A06/correction/A07 allocate 1,200,000; every planned worker remains below the owner's cumulative 2,000,000 ceiling. Spawn APIs have no token-quota field: workers record goal configuration and actual usage separately, including unknown usage and tool-boundary overshoot. Goals do not reserve or purchase account capacity. A future amendment must preserve the cumulative owner ceiling.

At most three workers run at once in this series. Dispatch only a ready dependency frontier, publish each claim, and wait for its exact acknowledgement. Independent writers use separate branches/worktrees. Shared application files are sequenced A02 -> A05 -> A06; A17-A20 can propose decisions but have no implementation file ownership. Root alone writes tasks.json, this README and the assignment index. Each worker alone writes its receipt until handback. The current frontier is the shared protected checkpoint for verified A07/A08 runtime evidence; the preceding recovery correction is published. The next eighteen duties retain their documented gates. Unseen-task custody must happen before exemplar optimization; human, authentication and private-fixture gates require actual evidence.

## Assignment index

| Agent task | Review findings | Duty | Current state | Goal ceiling | Launch prompt |
| --- | --- | --- | --- | ---: | --- |
| A01 | FND-01 | Current requirements ledger | verified | 200,000 | [a01](prompts/a01.md) |
| A02 | FND-02, FND-43 | Concurrent saves and immediate memory recovery | integrated; AT pending | 1,000,000 | [a02](prompts/a02.md) |
| A03 | FND-03, FND-21 | Clipboard rejection and controlled copy races | verified source/CI/Pages | 200,000 | [a03](prompts/a03.md) |
| A04 | FND-24, FND-47, FND-48 | Backup contract, original preservation and Windows commands | integrated with version limits | 200,000 | [a04](prompts/a04.md) |
| A05 | FND-22, FND-45 | Stale import confirmation and current backup escape | integrated; AT/owner originals pending | 500,000 | [a05](prompts/a05.md) |
| A06 | FND-44 | Exact malformed-source recovery export | integrated; exact Pages receipt verified | 500,000 | [a06](prompts/a06.md) |
| A07 | FND-25 | Transfer and rollback across actual browser origins | runtime verified; shared checkpoint | 500,000 | [a07](prompts/a07.md) |
| A08 | FND-26 | Firefox and WebKit acceptance | runtime verified; shared checkpoint | 500,000 | [a08](prompts/a08.md) |
| A09 | FND-27 | Keyboard and real assistive technology acceptance | external-gate | 200,000 | [a09](prompts/a09.md) |
| A10 | FND-06, FND-07, FND-08 | Existing-source selection, rights and import parity | external-gate | 200,000 | [a10](prompts/a10.md) |
| A11 | FND-04, FND-09, FND-46 | Build one source-safe intent-to-use exemplar | queued | 200,000 | [a11](prompts/a11.md) |
| A12 | FND-11, FND-32 | Recipient discovery and actual skill outcome | queued | 200,000 | [a12](prompts/a12.md) |
| A13 | FND-10, FND-12, FND-17 | Behavior preservation, hostile source boundary and references | queued | 200,000 | [a13](prompts/a13.md) |
| A14 | FND-14, FND-15, FND-16 | One adapter with least permissions and lifecycle receipts | conditional | 200,000 | [a14](prompts/a14.md) |
| A15 | FND-13, FND-18, FND-19 | Observed results, revision binding and stale invalidation | queued | 200,000 | [a15](prompts/a15.md) |
| A16 | FND-05 | Independent unseen-task custody and user acceptance | external-gate | 200,000 | [a16](prompts/a16.md) |
| A17 | FND-20 | Revision history decision and recoverable diff | conditional | 200,000 | [a17](prompts/a17.md) |
| A18 | FND-23 | Conflict-aware merge import decision | published defer decision | 200,000 | [a18](prompts/a18.md) |
| A19 | FND-28 | Structured contract decision | conditional | 200,000 | [a19](prompts/a19.md) |
| A20 | FND-29 | Canonical Skillz selection decision | conditional | 200,000 | [a20](prompts/a20.md) |
| A21 | FND-30 | Bounded external-agent handoff | queued | 200,000 | [a21](prompts/a21.md) |
| A22 | FND-31, FND-33 | Prompt and controlled workflow outcomes | queued | 200,000 | [a22](prompts/a22.md) |
| A23 | FND-34 | Useful bounded software starter outcome | queued | 200,000 | [a23](prompts/a23.md) |
| A24 | FND-35, FND-36 | Replit authentication and per-release surface receipts | external-gate | 200,000 | [a24](prompts/a24.md) |
| A25 | FND-37 | Separate dependency PR reviews | review published; update gates remain | 200,000 | [a25](prompts/a25.md) |
| A26 | FND-38, FND-39 | Protected ReFolDec evaluation and review-package operation | external-gate | 200,000 | [a26](prompts/a26.md) |
| A27 | FND-40 | ReFolDec release decision and permitted publication | external-gate | 200,000 | [a27](prompts/a27.md) |
| A28 | FND-41, FND-42 | Additional host and sibling adoption decisions | external-gate | 200,000 | [a28](prompts/a28.md) |

## Execution order and closure

Inspect coverage, token ceilings, active file ownership and the next manually approved frontier with:

```powershell
python scripts/agent-series-status.py
```

The command reads the ledger and never spawns agents or assumes a dependency has passed. Dispatch the reported prompt with its recorded model/effort, then record the returned thread ID in tasks.json. Current thread IDs and acknowledgement evidence are in that ledger; initial table gates above remain the dated dispatch plan.

1. Freeze requirements and repair the two reproduced defects. Preserve any pre-upgrade originals before applying app/schema changes to personal data. Synthetic fixtures may verify source behavior without accessing personal browser projects.
2. Freeze the current backup contract and run stale-import/raw-recovery work with one page/library writer at a time. Verify transfer on actual origins, then other browser engines and human assistive technology. An automation accessibility tree does not prove screen-reader speech.
3. Name an independent custodian and freeze unseen task/rubric before optimizing a source-safe exemplar. A11 builds a candidate; A12 discovers/runs it; A13 checks behavior/boundaries; A15 returns results to the saved revision. Those shared receipts close A11, FND-04 and FND-32 once; do not count them as multiple capabilities. A16's execution phase follows the frozen candidate, independent of its earlier custody phase.
4. Build an adapter only when the exemplar demonstrates need. Design permissions first, test denial/absence before side effects, then record install/use/removal. Optional history/merge/contract/catalog designs require adopt/defer decisions and scope amendments before implementation.
5. Trial prompt/workflow/software and external handoff outcomes after the exemplar. Handle dependency PRs separately. Maintain source, CI, Pages, Replit preview/connector and Notion receipts as separate claims for each actual release. Source parity does not prove connector authentication or browser-data transfer.
6. Protected ReFolDec work requires actual authorized fixture custody, exposure history and frozen hashes. Package leak-scan and behavioral evaluation are independent receipts. Capability publication and sibling mutations retain their explicit owner/surface gates.

Each task prompt supplies exact files, branch/base, findings, observable closure, exclusions, retry bound and required return. Status advances only on evidence: ready/queued/conditional/external-gate -> dispatched -> accepted -> in-progress -> ready-for-review -> integrated -> verified. A gate can remain pending without spawning an idle worker. A goal marked complete confirms that thread's duty, not every finding in the series.

## New work and economical escalation

For a discovered issue, root first records exact reproduction, affected acceptance criteria, source/candidate SHA, severity and evidence in tasks.json discoveries. Deduplicate against all 48 findings. Add it to an existing task only before ownership handback and with a published scope amendment; otherwise create a new task with exclusive files and explicit prerequisites and reuse a completed thread within its remaining owner ceiling. Do not exceed 30 overall workers, including the three existing reviewers and preserved stopped attempts. Reuse a completed thread for a follow-up within its duty. After two failed attempts on one cause, return the exact command/error and patch; root selects the smallest model capable of the now-demonstrated problem and records why. No silent model escalation, unlimited retries or new children.

## Evidence and recovery

The frozen production baseline is `74ffadb447f702065e7912ca9fce5c9e8f36a22d`; the source release and five-pass review were delivered before this series. Read [production reconciliation](../2026-10-04-production-reconciliation.md) for dated surface receipts. Root fetches current main before dispatch and supplies the verified base; workers inventory locally and root updates their base when prerequisites merge. Preserve prior recovery refs/bundles and historical handoffs. Final root integration runs governance plus checks invalidated by the change, uses protected PR checks, verifies the exact resulting SHA and records each surface separately. Do not overwrite history to turn pending evidence into completed evidence.

## Setup-control amendment - October 5, 2026

The initial A01 and A03 workers reached their configured small goal ceilings without implementation. Their worktrees and exact stop reports are preserved in the ledger. Replacement workers use coordinator-prepared standalone clones inside the writable project root, the same small model, and 200,000-token goals. A02 published its acceptance before source edits. Goal accounting and account quota remain distinct. Do not recreate an exhausted goal or claim that a follow-up message increases it; the host reports budgetLimited until an authorized control change or replacement task is used.


## Coordinator tasks discovered during dispatch

C01 calibrates goal ceilings from actual setup accounting rather than treating the smaller work target as a viable hard setup budget. C02 centralizes authenticated publication and installed-environment validation where child sandbox settings block network or metadata writes. These are operational tasks owned by this coordinator, with evidence and closure in tasks.json; they do not add product requirements or new worker slots. Do not change host permissions, bypass approval controls, approve an unseen private fixture or pretend a queued follow-up has been received. Pending app approval requests can prevent a worker from processing coordinator messages; exact status remains visible in its thread and the ledger.

A02 transfer amendment: its original worker returned unverified partial changes at 50,653/50,000 and cannot resume that goal. A03 will finish its clipboard duty, then acknowledge an A02 scope transfer and a new 1,000,000 goal on a prepared writable clone. Track cumulative allocations and actual usage per receiving thread; do not exceed 2,000,000 by resetting counters between duties. There are six new spawned threads and three completed earlier review agents, nine in total. Three new attempts stopped at configured ceilings; active status is tracked in tasks.json.


Overall roster amendment: count /root/equilibrium_evidence, /root/equilibrium_outcome and /root/equilibrium_safety as three already existing slots. Reuse A03 for A02 and later A04, A01 for A24, A25 for A20, and A06 for A07 after their gates and prior goals are complete. The plan therefore needs at most 27 new threads plus those three earlier reviewers. Newly discovered duties reuse completed capable threads with explicit scopes and remaining allocation; no total above 30 is allowed.


## First results checkpoint - October 5, 2026

PR56 published the 28-task execution packet at main `aaf41daf882f14907323f34aa9325f05f354285f`. A03 now has three passing focused Chromium cases and source typecheck evidence; publication waits for the protected first-results PR. A25 returned a separate five-PR dependency review, with conditional checks and defer decisions preserved. A03's completed thread has been sent the A02 transfer on a prepared clone at that newer main, with all three prior partial files preserved. Implementation waits for its exact receipt and root publication acknowledgement. A01 is still waiting on its host approval; no ledger or received acknowledgement is claimed.

Later checkpoint: A02 transfer receipt `0e81e8287988dc23ef93c6dad199b3a9f87ce88c` was published and explicitly acknowledged; implementation may resume. A01's unaccepted host-stalled dispatch was withdrawn and a separate in-session agent receives its scope, with both prior checkouts preserved. Seven new workers plus the three earlier reviewers now total ten; the overall plan remains at most 30 through the reuse assignments above. Root reproduced and repaired a delayed clipboard rejection after a project change, extending the final focused suite to four passing cases. The prior full suite passed 55 cases; fresh CI must test the final source.


## Published first results and next frontier

PR57 merged exact head 4dcd46ed08b0d9d418b19bbbc879e1fa7f74c2eb to main 8a8147845d65730deb9d4f59e5e73055e6d65db7 after both browser jobs, both typecheck jobs and filename checks passed. Pages run 37381492327 succeeded at that main. Windows tracked source and Replit source both have equal HEAD/origin/main and 0/0; primary package cache is preserved. Replit preview renders the workbench, while its external connector freshly requires reauthentication. Notion execution receipt was inserted in the existing project anchor and fetched back, preserving the prior 48 findings and child pages. These are separately observed receipts, not one interchangeable proof.

A01 returned its ledger at 29fc526b4f268908df860fa38ffab750824c032a with governance/filename/whitespace checks passed and 51,693/200,000 tokens used. Root reviewed it and prepares a protected checkpoint. A04 now reuses A01 after its completed goal; root supplies a separate clone at 8a81478 and requires exact new acceptance before implementation. This supersedes the earlier A03->A04 plan. A02 remains the sole page/library writer and is implementing a smaller fail-closed stale-save guard. The largest planned combined allocation is now 1,450,000; seven new workers and three existing reviewers total ten. Human acceptance has been requested and remains pending; it is not inferred from agent fixtures.


## Concurrent-save checkpoint and remaining gates

PR58 published the requirements ledger at main `621ea5893420e91712825c53b849c622b0c99173`; exact protected checks and Pages passed. A02 has relinquished its frozen implementation to root. Central Windows validation passes81 core tests, full workspace typecheck/build and 61 Chromium cases, with3 opt-in fixture-refresh skips. The conflict route preserves both snapshots and identifies the authoritative revision, and denied writes retain the newest editable backup. Normal typing does not repeatedly change the recovery live announcement. Publication waits for the final exact-head protected checks; real assistive technology remains A09. A04 is active after published acceptance; A05 remains gated on both prerequisite handbacks and integration. See their dated receipts for source and runtime boundaries.


## Budget-control and contract handback amendment

A04 committed its version matrix, prehashed fixture inventory and Windows commands at 074e758d1c98fc32ffd706ca1a65c1d27e019863; its 200,000-token goal reached its limit before final receipt bookkeeping. Root received explicit handback and finishes that receipt. Actual final usage is unknown. Four tracked examples are preserved; exact older runtimes and owner originals were not supplied.

The current reuse plan is A03->A02, A01->A04, A05->A20, A06->A07 and A08->A24, always after an actually completed prior goal. This supersedes the earlier A25->A20 and A01->A24 plans, avoiding assumed goal resets. Planned distinct workers remain 30 including the three reviewers and four preserved attempts; ten are currently used. A05 receives a 500,000-token ceiling based on the observed bookkeeping limit, with the same 40,000-token working target and smallest model. Task allocations now total 6,700,000; largest planned combined allocation remains 1,450,000. No account capacity is purchased or reserved.


## Published save/contract release and A05 dispatch

PR59 merged final head `e3be322fc66b44bc42e5378f54ce4561db773fe7` to main `e26381266527d70e348cc5fb49e7c0039db4a3c3` after both E2E jobs, both typecheck jobs and filename checks passed. The final E2E run recorded 61 passed cases and 3 opt-in skips; local 82 core and 13 focused cases passed. Pages run 37385218924 succeeded on that main. The live entry asset contains the conflict recovery, revision marker, stable announcement and earlier clipboard repair. Primary Windows source is clean with equal HEAD/origin/main and 0/0. Replit and Notion receipts remain separately recorded; source parity cannot clear connector authentication.

A05 is agent `/root/a05_import_confirmation`, actual thread 01a10e45-a27a-79b0-bb3f-ab412e285b5d. Its receipt-only acceptance ee25b4233891f7f3804ae0c0fc8bcf53fb6012a0 was published and explicitly confirmed before source edits. Root prepared pinned dependencies and updated the clean branch to exact published main. Its 500,000-token goal reported 19,619 tokens at the acceptance checkpoint, not final implementation usage. Eight new workers and three earlier reviewers now use eleven slots; the current reuse plan remains at most 30 overall.

The root-prepared [human accessibility checklist](evidence/accessibility.md) is ready for a named tester and actual technology. It contains no observations or passed human steps. A09/A16 remain gated, and unseen-task custody must precede exemplar optimization. Root separately tested a pinned pre-conversion parser against current exports; [the version receipt](evidence/backup-preservation.md) names exact modules and hashes, and keeps older application-runtime and owner-original recovery unknown.

## Import review and goal lifecycle correction

PR60 merged exact d2ecf39 to main12c07b1ae249860321073150c65042ac61bf89f2 after all protected checks passed. A05 returned source4202a45 and final handback1fb2d80. Root reproduced missing authority bytes/revision and failed-import memory replacement, then corrected both under FND22, with six import and five existing concurrency cases passed. A05 is ready for protected publication; its original tooltip assertion and restore claim were strengthened with an actual replace-then-restore case. Sourcefcd4df2 preserves current, imported and actual saved states separately.

A05 prematurely completed its acceptance-only goal at19,619; later implementation usage is unknown. Future prompts configure the whole duty and retain an active goal at the acceptance pause. The A06/A07/A08 ceilings are calibrated to500,000 each, with the same smaller working targets; A06+A07 allocate1,000,000 combined and A08+A24 allocate700,000. Current duty ceilings total7,600,000; the maximum planned individual remains1,450,000. Eleven overall slots are used. No missing usage is invented and no account capacity is reserved.

## Current released frontier

PR61 is merged at exact main `0df2217f3612324cd8af2d835cfaab1467cddb73` after all required checks passed. Primary Windows source is clean at the same fresh main with zero ahead/behind. Pages and Replit receipts are independent. A06 receipt `b0b69ffa32842392db93af693c9828c59a556372` and A18 receipt `0d3393d63bdad3340fafabe017de7f5d37c1deee` were published and explicitly confirmed before implementation on separate prepared checkouts. Their whole-duty goals remain active at the acknowledgement pause. Ten new workers plus three earlier reviewers now use thirteen overall slots; maximum planned roster and combined budgets remain unchanged.

A06 correction allocation amendment: root reproduced loss of the second malformed source on frozen candidate5d47484 after the first successful repair. The same worker receives a bounded200,000 correction goal after its completed204,006/500,000 first goal. A06/correction/A07 allocate1,200,000 combined, and the maximum individual remains1,450,000. Duty ceilings remain7,600,000; recorded correction allocations add450,000, for8,050,000 across current duties/corrections. No new task or worker slot is created, and raw source preservation does not adopt optional project history. Source publication waits for the regression correction.


## Browser-engine dispatch - October 6, 2026 00:29 UTC

A08 exact receipt-only acknowledgement `d9eae294fea4a5bda947a1ec51683e8bbe9b64e9` was published and explicitly confirmed before implementation. Its whole-duty 500,000-token goal stays active through this pause. The separate checkout is frozen at `91925c8d87f0cb5387ff4100e44c41097573fe4f`; application source equals protected main `ded3d5fad6c415ce8894025ca4057be9928f068c`. Installed Firefox/WebKit engines are preparation evidence only until the actual journeys run. Eleven new threads and three earlier reviewers use fourteen overall slots; the complete plan remains at most thirty. A07 and A08 evidence will share one protected integration checkpoint.


## Completed ready frontier - October 6, 2026

A07 verified actual Pages -> clean local -> Pages transfer, exact supplied-field/timestamp restoration and independent legacy-store sentinels on published application source. Its completed goal used189,417/500,000; A06/correction/A07 configured1,200,000 and known completed usage490,089. A08 final test blob `df6157e100b48033f71c98e94b92a608227f3052` passed one meaningful journey each in Firefox155.0 and WebKit26.6 on Windows11 Home10.0.26300 x64. Persistence/reload, Unicode backup, import restoration, studio navigation and denied-storage download were observed. Legacy-store exact bytes remain checked in the workbench; the deliberate studio visit normally initializes fields/timestamp and is reported separately. A08 completed its same500,000 goal at101,439. No application source changed in these duties.

Ten duties now have reviewed deliveries/decisions; eighteen remain queued, conditional or externally gated. This is not a claim that all48 findings are closed. Remaining human AT, owner-original/old-runtime recovery, independent unseen-task custody, source/right selection, needed adapters, authenticated connector and protected capability/host/sibling release evidence retain their exact prompts. The ledger validator checks48-once coverage,28 duties,14 used slots,30 planned maximum,exclusive active scopes and1,450,000 maximum combined configured worker allocation. No idle gated workers were spawned.
