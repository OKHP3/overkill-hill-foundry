# A07 actual-origin transfer evidence

**Current status:** coordinator-verified complete synthetic actual-origin journey after the handback and test synchronization correction below. The worker partial attempts are retained as dated evidence; they did not establish final restoration or GPT preservation.

## Origins and build observed

- Public origin exercised in a disposable Playwright context: `https://okhp3.github.io/overkill-hill-foundry/`.
- Pages HTML probe: HTTP `200 OK`; response `Last-Modified: Tue, 06 Oct 2026 00:04:14 GMT`; deployed entry asset `/overkill-hill-foundry/assets/index-DtWzygSY.js`. At 2026-10-06T00:07:03Z the response reported `Date: Tue, 06 Oct 2026 00:07:03 GMT`.
- Pages source revision and workflow are coordinator-verified evidence: source `ded3d5fad6c415ce8894025ca4057be9928f068c`, successful Pages run `37391811383`. The worker's prepared source checkout started at this revision; no application files were changed.
- Local origin exercised: `http://127.0.0.1:20026/custom-gpt-creator/`, the coordinator-owned preview. Playwright browser logs showed Vite connecting and connected at that exact URL. The worker neither started nor stopped the server.
- Runtime: Windows PowerShell, Node `v24.11.1`, pnpm `10.34.5`, Playwright package `1.63.0`, Chromium headless shell revision `1243`. Contexts were fresh, disposable, and separate by origin.
- Browser storage is origin-specific. The journey moved JSON only through Playwright's downloaded-file buffer and explicit backup import; no account sync or cross-origin storage was assumed.

## Synthetic inputs and comparison method

The test uses two public-safe synthetic capability projects. The first is a version-1 legacy-format project with the 18 required pre-portability fields and no optional conversion fields. The second has those fields plus all nine portability fields (`sourceType`, `delivery`, `sourceRef`, `sourceInventory`, `behaviorMap`, `semanticLoss`, `runtimeTargets`, `toolRequirements`, `compatibilityEvidence`). No real Custom GPT, owner backup, personal browser profile, or private data was used.

Each project is hashed as SHA-256 over stable JSON of its supplied fields in explicit order. The outer backup `exportedAt` is generated at export and is intentionally outside the project-data comparison. On import, the legacy project receives documented defaults (`sourceType=new`, `delivery=source`, remaining portability values empty); its supplied 18 fields remain in the comparison. A deliberate local edit changes only the legacy project's `purpose`; its `updatedAt` is expected to change with that edit. The other project's nine portability fields remain fully compared. On final restore, every originally supplied field including both original timestamps is compared without normalization.

The separate legacy Creator store `cgpt-workspace` was seeded with the same synthetic valid sentinel in each origin's independent context. The test contains an exact before/after byte-string assertion for both origins, but the final assertion was after the observed rollback mismatch and therefore was **not reached** in the recorded run; unchanged status is not claimed from that test.

## Attempt record

Opt-in command used for the real-origin test:

```powershell
$env:PORT = '20026'
$env:BASE_PATH = '/custom-gpt-creator/'
$env:CREATOR_BASE_URL = 'http://127.0.0.1:20026/custom-gpt-creator/'
$env:A07_ORIGIN_TRANSFER = '1'
corepack pnpm --filter @workspace/custom-gpt-creator exec playwright test tests/origin-transfer.e2e.ts
```

The first attempt reached the Pages workbench and stalled at a custom project-selector call for 120 seconds. Trace `origin-transfer.e2e.ts-tra-51e6e-tore-the-preserved-original/trace.zip`, `test.trace` call `pw:api@142`, points to the attempted `getByLabel("Project").selectOption(...)`; the error snapshot shows two project choices. The second attempt changed that step to inspect options and failed because `getByLabel("Project").locator("option").evaluateAll(...)` returned an empty array, although the imported storage held two projects and the active legacy project was visible. Both failures concerned the selector interaction and were not retried. The coordinator authorized one simplified run that avoids that selector.

The authorized simplified run reached both real origins and passed the following assertions before stopping:

- Pages loaded the capability workbench and exported a version-1 backup from the seeded synthetic legacy and portability projects.
- Every supplied project field matched the fixture on Pages export; the legacy project received the expected defaults and the portable project's values were retained.
- The local origin began without an `okh-capability-workspace` entry. Import displayed both incoming project names and completed with `Saved locally · imported workspace`.
- On local import, both project hashes matched the Pages export and the legacy project's defaults were present.
- Editing the visible legacy project's Purpose field saved locally. The downloaded local backup retained every other legacy supplied field (excluding only Purpose and the resulting `updatedAt`) and all fields of the portability project.
- Pages imported the local backup; the legacy-project change appeared and normalized project hashes matched the local return backup.

The run then imported the preserved original Pages backup to roll back. The comparison of all original supplied fields, including original timestamps, failed for the legacy project while the portability project hash matched. Exact Playwright failure:

```text
at tests/origin-transfer.e2e.ts:263
expect(restoredHashes).toEqual(originalFieldHashes)
expected: [7793ddfa909ea427756e182878581535f72e9f6c2497f5310c29706d5548225e,
           0c6001bcabd2026806fc9365dcdcd67f3c517cbeda6a6f3e0657041c22a011fe]
received: [6b22d6658dc559c38963e5c77017426f96e94b2021539a50816f8cc04cfa9add,
           0c6001bcabd2026806fc9365dcdcd67f3c517cbeda6a6f3e0657041c22a011fe]
```

The failed hash establishes a difference in the deliberately edited legacy project's compared fields; the portability project's hash matched. The subsequent exact Purpose assertion, final backup download/hash comparison, and both `cgpt-workspace` unchanged assertions were not reached. On reviewing the trace, root identified a possible synchronization race: the helper waits for a `Saved locally · imported workspace` status that can already be present from the prior import, so the subsequent storage read may occur before the rollback replacement finishes. This is a diagnosis hypothesis, not verified runtime behavior or a successful rollback result. The test trace is preserved in the prepared checkout's ignored Playwright output directory. Per the retry boundary, the worker did not rerun or change the failing restore behavior; root owns the next bounded diagnosis and validation.

## Evidence boundary and next step

This is synthetic Playwright evidence against the exact Pages and coordinator preview origins, not owner-original recovery, account-level synchronization, Replit authentication, assistive-technology evidence, or broad browser compatibility. The UI's import confirmation exposed the incoming project names and its warning tells users to download the current backup before replacement; the preserved Pages backup bytes remained available to the test for the rollback attempt. No production application source was edited, and no merge, deployment, or publication was performed by this worker.

**Next action:** coordinator inspects the preserved failure trace and owns the one-field rollback mismatch diagnosis. The worker relinquishes the three A07 files; A07 cannot be marked complete until the coordinator supplies verified rollback and `cgpt-workspace` isolation evidence or returns an amended bounded instruction.


## Coordinator completed journey

After worker331032a relinquished scope, root changed only importBackup to await the replacement confirmation disappearing before accepting the repeated import-status text. No application files changed. One actual-origin rerun passed in2.8 seconds: Pages ded3d5f/index-DtWzygSY.js and local http://127.0.0.1:20021/custom-gpt-creator/, Chromium153.0.8010.12, Node24.11.1, pnpm10.34.5, Playwright1.63.0 on Windows. Command: set CREATOR_BASE_URL to that local URL and A07_ORIGIN_TRANSFER=1, then run the pinned Playwright test tests/origin-transfer.e2e.ts --workers=1.

Original Pages export, local import and final restored workspace/backup hashes all matched [7793ddfa909ea427756e182878581535f72e9f6c2497f5310c29706d5548225e, 0c6001bcabd2026806fc9365dcdcd67f3c517cbeda6a6f3e0657041c22a011fe]. Deliberately changed local and returned Pages hashes matched [0183124306bdd86c41793b75a7ebf2aff1de6936a5e31793d5df72165f7a33af, 0c6001bcabd2026806fc9365dcdcd67f3c517cbeda6a6f3e0657041c22a011fe]. Only the intentional Purpose/updatedAt change was excluded in that intermediate comparison; restoration compared all provided fields, including original timestamps. Restored backup schema was okh-capability-workspace-backup. Both independent cgpt-workspace sentinels were unchanged; sentinel SHA256996229f9851c951e2ac575d1f41aa6c121951be0995148b3fd69bb55338e5834.

The new synchronization wait establishes completion for this fixture; it does not turn the earlier failure into evidence of a production data-loss defect. The Project selector was omitted from the simplified duty and is not claimed as covered. Owner-original recovery, real AT, Replit auth and additional browser engines remain separate tasks. CI skips this external-origin case unless opted in; an ordinary successful CI job does not replace this actual Pages receipt. Root owns required integration validation and protected publication after the worker handback.
