# A04 backup preservation and verification record

**Recorded:** 2026-10-05 UTC
**Application source under test:** `8a8147845d65730deb9d4f59e5e73055e6d65db7`
**Checkout:** `codex/foundry-series-a04-20261005`
**Evidence owner / receiving host:** `/root/a01_requirements`, Codex on Windows PowerShell 7.6.5
**Runtime:** Windows_NT, Node `v24.19.0`, Corepack `0.34.2`, pinned pnpm `10.34.5`

## Preservation inventory before parser and browser tests

The four files below were present as tracked, source-safe workbench examples. Their original bytes are recoverable from the listed base commit. Before testing, PowerShell reported these byte lengths and SHA-256 values. They are sample exports, not owner-provided pre-upgrade backups.

| Tracked fixture | Bytes | SHA-256 before test | Envelope / workspace | Project shape |
|---|---:|---|---|---|
| `examples/workbench/prompt-example/backup.json` | 2010 | `cf13f4270a3b6c85e21bb016e52f3b378516abc4cb268107057454c7736a2ae1` | 1 / 1 | 18 base fields; no conversion fields |
| `examples/workbench/skill-example/backup.json` | 2143 | `e2ebff94a1569bfefd36489d177728c194d4250d23c449b9fb7c609b3b1dc352` | 1 / 1 | 18 base fields; no conversion fields |
| `examples/workbench/software-example/generated/backup.json` | 1640 | `40e0e5f3f372b0eee3f9f69768b251037eec2547c9d07689aa3379c95fc48070` | 1 / 1 | 18 base fields; no conversion fields |
| `examples/workbench/workflow-example/backup.json` | 2139 | `aa893dcb0301d4c0b3799219257597cf5b40ae93fc426b02aa960c98df71f78a` | 1 / 1 | 18 base fields; no conversion fields |

No actual owner pre-upgrade browser backup was supplied in the assigned checkout. Personal browser stores and private files were not inspected. No pinned older application build/runtime was supplied, so old-build compatibility cannot be tested here.

## Version and recovery matrix

| Case | Result at source `8a8147845d65730deb9d4f59e5e73055e6d65db7` | Evidence / boundary |
|---|---|---|
| Four checked-in envelope/workspace version-1 examples, each with 18 base project fields | **Accepted by current parser.** A direct Node probe confirmed that all supplied field values survived and defaults were added for the absent optional conversion fields. | `node --experimental-strip-types --test artifacts/mockup-sandbox/src/lib/capability-workbench.test.ts`: 13 passed, 0 failed. A separate inline probe parsed all four tracked examples and reported `suppliedFieldsPreserved: true` for each. |
| Absent optional conversion fields | **Defaulted by the current parser.** `sourceType="new"`, `delivery="source"`; empty strings for `sourceRef`, `sourceInventory`, `behaviorMap`, `semanticLoss`, `runtimeTargets`, `toolRequirements`, and `compatibilityEvidence`. | Current source `PORTABILITY_DEFAULTS`; passing test `legacy version-1 backups gain defaults without changing project identity or target`. Fixture probe also reported `defaultSourceType="new"` and `defaultDelivery="source"`. |
| Unknown envelope schema/version, malformed JSON, unknown project field, unsupported value or oversized import | **Rejected by the current parser before replacement confirmation.** | Unit test `backup parser rejects malformed, unknown, non-OKH, duplicate, and oversized input` and conversion-field rejection test passed. Browser tests below verified invalid imports were rejected and the stored source remained unchanged. |
| Synthetic storage write denial after a version-1 fixture was loaded | **Old stored bytes remained identical; latest edit stayed in memory and was exportable as a current backup.** | Existing unit test `failed storage writes keep newer memory edits when the workbench remounts` and browser test `storage denial retains edits for a recovery download` passed. An inline synthetic `localStorage` simulation independently compared stored bytes before/after the thrown write and parsed the recovery export. This is current save/recovery behavior, not a transactional migration rollback. |
| Synthetic storage read failure | **Warning returned; no storage write attempted; source bytes remained in the synthetic test adapter.** | Inline disposable-storage simulation counted writes and confirmed no write during the failed read. This tests a read error; current save/import code does not implement a post-write read-back transaction. |
| Post-write read-back failure during a future migration | **Not implemented / unknown.** | Current save code does not read back successful writes. No migration adapter, durable original-copy transaction, or atomic rollback guarantee is implemented. The migration API above remains proposed. |
| A current export opened by a specific older build | **Unknown.** | No exact older source revision/binary/runtime was available. Do not state that older builds reject new fields or promise downgrade compatibility without a pinned old parser and a non-mutating test. |
| Actual owner pre-upgrade backup recovery | **Unavailable in this assignment.** | No owner backup was supplied to the permitted checkout; personal browser stores were not accessed. The four checked-in example files must not be represented as owner originals. |

### Synthetic failure simulation details

The direct Node simulation loaded only `examples/workbench/prompt-example/backup.json` into an in-memory test `localStorage`. It forced the next write to throw and observed `saveResult=false`, identical original stored bytes, and an unsaved draft that could be exported and parsed. It then forced a storage read to throw; the app returned the load warning, the mock recorded no write during that failed read, and its retained raw value remained available to the test harness. The current code has no post-write read-back path, so this does not prove migration rollback after a partial write.

## Windows preview, build, and browser checks

The following PowerShell environment setup and preview command were run from the assigned checkout. Corepack selected the repository pin (`corepack pnpm --version` → `10.34.5`). The local page opened at the exact preview URL.

```powershell
$env:PORT = "20023"
$env:BASE_PATH = "/custom-gpt-creator/"
corepack pnpm --filter @workspace/custom-gpt-creator run dev
```

Observed server: Vite `7.3.6`, `http://localhost:20023/custom-gpt-creator/`. The UI displayed the Capability Workbench. The app server was stopped after checks.

The production build command was run with the same port/base path:

```powershell
$env:PORT = "20023"
$env:BASE_PATH = "/custom-gpt-creator/"
$env:NODE_ENV = "production"
corepack pnpm --filter @workspace/custom-gpt-creator run build
```

Result: exit code 0; Vite transformed 61 modules and wrote `artifacts/custom-gpt-creator/dist/public`. That output directory did not exist before the build. Its `index.html` references assets under `/custom-gpt-creator/`, confirming the selected base path.

Existing Playwright tests ran in their disposable browser contexts against the local preview at source SHA `8a8147845d65730deb9d4f59e5e73055e6d65db7`:

```powershell
$env:PORT = "20023"
$env:BASE_PATH = "/custom-gpt-creator/"
$env:CREATOR_BASE_URL = "http://127.0.0.1:20023/custom-gpt-creator/"
corepack pnpm --filter @workspace/custom-gpt-creator exec playwright test tests/capability-workbench.e2e.ts --grep 'build, persist, inspect, export and restore a capability|reject invalid imports and preserve malformed stored source|failed backup selections clear earlier replacement prompts and reset the input'
corepack pnpm --filter @workspace/custom-gpt-creator exec playwright test tests/capability-workbench.e2e.ts --grep 'storage denial retains edits for a recovery download'
```

Result: four selected browser tests passed. They exercised synthetic capability data, backup download and restore, malformed/invalid/oversized import handling, preserved local data after rejection, and recovery download after storage denial. These are application tests in temporary Playwright browser contexts, not a cross-origin transfer or old-runtime test.

This Codex worker records the Windows/PowerShell receiving-host acknowledgement for the documented preview and build commands. It is not a Mac, Replit, or other-host acknowledgement. The connected Edge extension refused local fixture upload because file-URL access is disabled; that permission was left unchanged. No user browser project data was read or used. The Playwright tests supplied synthetic buffers through their isolated test context instead.

## Runtime/package-manager note

The plain shell `pnpm` command resolved to fallback pnpm `11.25.0`. Its initial `pnpm test:capability` attempt stopped before running tests with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` while trying automatic dependency revalidation; no install or source change followed. Direct Node tests and all subsequent package commands used the provided Node runtime and Corepack's exact project pin (`10.34.5`). The plain-fallback attempt is not counted as a passing check.

## Separately versioned local-storage metadata

The coordinator reports A02 source commit
`10541ff8125928868882678687532e1a0e2b8ab5` in pending protected PR59, reviewed
at head `90a0bc0accee6d8801f64781d5aea8d4e8f165e6`. That candidate adds
`__okhCapabilityRevision` to the local-storage envelope and a local-save
read-back change. The marker is local-only metadata, not a portable backup
field; the coordinator reports that `createCapabilityBackup` strips it and
leaves portable backup schema version 1 unchanged. The A04 source/test base
predates A02. This is coordinator-provided candidate evidence pending
publication, not an A04 runtime test of the metadata or read-back behavior.


## Coordinator pinned-parser addendum - October 5, 2026, 22:56 UTC

After the A04 handback, root located the pre-conversion source in repository history at commit `6d48317fece4769dd8cb5e774779ad646def461b` (September 26). Its unchanged library module has SHA-256 `0d27d3e3de23c2d78ee9d9d8d53463fda301d0b9f064e5e27f5b125793d53ae7`. Root preserved those source bytes in an ignored version-matrix directory and executed only that parser module, alongside current source `e26381266527d70e348cc5fb49e7c0039db4a3c3`, using Node `v24.11.1` on win32. This supplies a bounded parser-pair receipt beyond the worker's earlier unavailable-runtime conclusion; it does not turn that historical conclusion into a claimed test.

All four tracked fixture hashes above match. The pinned older parser accepts each original legacy backup with all supplied values intact. Each current export of the same workspace includes conversion defaults, and that older parser rejects it with `unknown project field "sourceType"`. A disposable storage sentinel remains unchanged, with zero writes during parsing. The current parser's acceptance/defaulting remains covered by the existing 82 core cases and prior fixture probe.

| Legacy fixture | Current export bytes in this probe | Current export SHA-256 | Older-parser outcome |
| --- | ---: | --- | --- |
| prompt-example |2243|e71c51ecd87304474a087d17235eed79dcbab3a206daf835df5689dac16341a6|Reject; zero writes|
| skill-example |2378|1c4a7a17a165536c3d7e0b3c33e0407ddd65fea53d0bc502acfa92aedf2db7ca|Reject; zero writes|
| software-example |1875|14f1ce3c30f21e6edbc0c612f020af2e14d7c297f739b77ad10d4445adc7b072|Reject; zero writes|
| workflow-example |2374|e5fc96e1866e840dd07bb4883fc529966df7de4f0a12cc1338761fc8d8b01f3c|Reject; zero writes|

Export hashes identify these dated probe bytes; exportedAt makes later exports differ. No personal backup, older browser build, application downgrade/rollback, or broad all-older-build claim is established. A03/A02 releases and this source-module probe do not substitute for actual origin transfer or human acceptance. The machine probe result is preserved locally; its public-safe facts are recorded here.
