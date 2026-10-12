# Capability workbench backup migration design

Status: proposed migration implementation contract (F17); no migration adapter
or transactional rollback is implemented by the current workbench. The current
release has one supported backup envelope: schema `okh-capability-workspace-backup`,
`schemaVersion: 1`, audience `overkillhill`, and lineage
`parentFoundry: OKHP3/OverKill-Hill-FoundRy` ([`capability-workbench.ts`](../artifacts/mockup-sandbox/src/lib/capability-workbench.ts#L297-L350)). No earlier or additional supported schema is inferred here.

## Current v1 contract

The envelope contains `schema`, `schemaVersion`, `audience`, `lineage`,
`exportedAt`, and `workspace`; the workspace contains `version: 1`,
`activeId`, and a non-empty `projects` array. Each project has the exact fields
`id`, `name`, `kind`, `owner`, `version`, `purpose`, `audience`, `inputs`,
`outputs`, `constraints`, `instructions`, `acceptance`, `components`,
`skillRefs`, `evidence`, `reviewed`, `createdAt`, and `updatedAt`. `kind` is one
of `prompt`, `skill`, `workflow`, or `software`; `reviewed` is boolean; all
other listed project fields are text ([source](../artifacts/mockup-sandbox/src/lib/capability-workbench.ts#L1-L63)).

Validation currently enforces 1–20 projects, unique non-blank IDs, an existing
`activeId`, no unknown project fields, UTF-8 byte limits of 40,000 per text
field, and a 2,000,000-byte import/export boundary ([source](../artifacts/mockup-sandbox/src/lib/capability-workbench.ts#L32-L36), [validation](../artifacts/mockup-sandbox/src/lib/capability-workbench.ts#L114-L159)).

## Proposed migration API

Add a pure migration boundary around the existing parser. It accepts the raw
backup bytes/text and returns either a validated current workspace plus a
report, or a structured failure. Dispatch first on the envelope's
`schema`/`schemaVersion`; v1 is parsed by the current rules. Future adapters
must be explicitly registered. Unknown schema/version fails before any write.

The result should include:

* `status: "unchanged" | "migrated" | "failed"`;
* the source `schema` and `schemaVersion` when readable;
* a human-readable change list and warnings;
* the validated workspace only on success; and
* the original input bytes (or a durable reference to them) for recovery.

`dryRun: true` parses and validates, reports the planned adapter and changes,
and performs no storage write. A real migration must retain the exact original
bytes before replacement, write only after validation succeeds, and read back
the replacement. If validation, adapter execution, write, or read-back fails,
the old workspace remains authoritative and the saved original bytes remain
available for rollback. Import confirmation remains a separate user action;
the current UI already validates before offering replacement ([UI](../artifacts/mockup-sandbox/src/pages/capability-workbench.tsx#L214-L245), [confirmation](../artifacts/mockup-sandbox/src/pages/capability-workbench.tsx#L425-L445)).

Do not silently coerce unknown fields, invent defaults, or reinterpret an
unsupported historical format. A v1 input with no required change is
`unchanged`; a future adapter is `migrated` only when its output passes the
current workspace validator. Preserve source bytes even when the parsed value
is semantically identical.

## Acceptance fixture matrix

| Fixture | Expected result | Required evidence |
|---|---|---|
| Generated v1 backup, Unicode text | `unchanged`, same workspace | byte-preserved source and deep-equal parsed workspace; existing round-trip precedent ([test](../artifacts/mockup-sandbox/src/lib/capability-workbench.test.ts#L41-L47)) |
| v1 envelope with malformed JSON | `failed`, no write | current workspace and source bytes unchanged |
| v1 with wrong audience or lineage | `failed`, no write | explicit boundary error; source retained |
| v1 with duplicate ID or unknown project field | `failed`, no write | validator error; source retained ([tests](../artifacts/mockup-sandbox/src/lib/capability-workbench.test.ts#L49-L80)) |
| v1 over 2,000,000 UTF-8 bytes | `failed`, no write | import bound enforced before storage mutation |
| readable unknown `schemaVersion` | `failed`, no adapter call | exact bytes retained; rollback remains possible |
| readable unknown `schema` | `failed`, no adapter call | exact bytes retained; rollback remains possible |
| registered future fixture (when one exists) | dry-run report, then `migrated` after commit | adapter output validates; pre-migration bytes and post-write read-back match |
| simulated write or read-back failure | `failed`, rollback/authoritative old state | failure is observable; no partial replacement |
| dry run for every successful fixture | report only | storage snapshot and byte source unchanged |

The matrix is a contract for future implementation and fixtures; it does not
claim that migration adapters or rollback machinery exist in the current app.

## Current-code evidence addendum — 2026-10-05 (A04)

This addendum records the source at FoundRy commit
`8a8147845d65730deb9d4f59e5e73055e6d65db7` and tests run against that exact
checkout. It supplements the proposed contract above; it does not mark the
proposed adapter or rollback implementation complete.

The current portable backup envelope remains schema
`okh-capability-workspace-backup`, `schemaVersion: 1`, audience `overkillhill`,
FoundRy lineage, and a version-1 workspace. Its project shape has 18 required
base fields. The current source accepts these additional optional conversion
fields and supplies defaults when they are absent: `sourceType: "new"`,
`delivery: "source"`, and empty strings for `sourceRef`, `sourceInventory`,
`behaviorMap`, `semanticLoss`, `runtimeTargets`, `toolRequirements`, and
`compatibilityEvidence`. The current parser rejects any other envelope schema
or version, wrong audience/lineage, malformed workspace, and unknown project
fields. The import UI parses before displaying the replacement confirmation,
so a rejected file cannot reach the workspace replacement action.

Four checked-in example backups were hashed before exercising the current
parser. All four use envelope and workspace version 1 and contain one project
with the 18 base fields and no conversion fields. The current parser accepted
each, retained every supplied project-field value, and supplied the defaults
above. Their exact paths, byte sizes and SHA-256 hashes, along with the parser
results and post-test byte check, are in
[`evidence/backup-preservation.md`](handoffs/2026-10-05-executable-series/evidence/backup-preservation.md).
They are repository examples, not owner-provided pre-upgrade browser backups.

Current write-failure behavior is narrower than the proposed migration
contract: if saving a workspace fails, the saved store remains unchanged and
the newer draft stays in memory with a warning; the user can export that draft
as a current backup. If storage reads fail, the UI reports that the stored
workspace was left unchanged and opens a temporary workspace. A synthetic
storage simulation confirmed the previous stored bytes remained identical
after a thrown write, the unsaved draft could be exported and parsed, and a
thrown read caused no write. At the tested A04 source revision, save does not
read back a successful write, implement a migration transaction, or retain a
separate original-backup copy for rollback. The coordinator separately reports
a later A02 local-save read-back change in PR59; that review receipt is outside
this A04 source/test base and does not establish migration rollback. Therefore
post-write readback failure during migration, atomic migration rollback, and
recovery from a partially successful migration remain unimplemented and
unverified; the future-adapter behavior above is still a proposal.

Unknown schemas/versions fail in the current parser before import confirmation;
the existing parser test rejects an unknown schema, and the browser test for an
invalid import confirms the existing stored source remains unchanged. Unknown
project fields also fail validation. The tests do not establish that an older
application build accepts or rejects a current export. No exact older build or
runtime was available in this assignment, and no owner-supplied old backup was
provided in the assigned checkout. Older-build compatibility and downgrade
rollback are **unknown**; preserve a user-owned original backup and test exact
source/target versions before relying on downgrade behavior.

**Storage metadata boundary:** coordinator-provided evidence identifies A02
source commit `10541ff8125928868882678687532e1a0e2b8ab5` in pending protected
PR59, reviewed at head `90a0bc0accee6d8801f64781d5aea8d4e8f165e6`. That
candidate adds `__okhCapabilityRevision` to the local-storage envelope. This is
not a portable-backup project field or a backup schema version; its
`createCapabilityBackup` path strips the local-only metadata while building
the version-1 portable envelope. The coordinator also reports a local-save
read-back change in that PR59 candidate. The A04 test base predates these
changes, so this note does not claim that A04 independently ran the concurrency
candidate, tested marker persistence, or validated the newer read-back path.


### Pinned parser-pair follow-up - October 5, 2026

The coordinator subsequently tested pre-conversion parser source `6d48317` against current source `e263812` on Node `24.11.1`. That pinned older parser accepts all four original legacy examples and rejects their current exports containing conversion fields, before any storage write. The [dated preservation receipt](handoffs/2026-10-05-executable-series/evidence/backup-preservation.md) supplies exact hashes and runtime. This is source-module evidence for one parser pair; actual older application-runtime, browser and rollback behavior remain untested. The earlier A04 unavailable-runtime record remains dated evidence.
