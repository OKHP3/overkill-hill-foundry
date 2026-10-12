# A08 Firefox and WebKit acceptance evidence

**Result:** The scoped create-to-export/restore/recovery journey passed in Firefox and WebKit on the coordinator-owned local preview. This is desktop Windows evidence for these two engine builds only.

## Tested revision and environment

- Test checkout HEAD before the A08 implementation commit: `d9eae294fea4a5bda947a1ec51683e8bbe9b64e9`, based on the supplied `91925c8d87f0cb5387ff4100e44c41097573fe4f`.
- Application implementation was not changed by A08. The coordinator identified the preview application source as protected main `ded3d5fad6c415ce8894025ca4057be9928f068c`; the assigned test URL was `http://127.0.0.1:20027/custom-gpt-creator/`.
- Test file Git blob before the final receipt commit: `df6157e100b48033f71c98e94b92a608227f3052`.
- OS: Microsoft Windows 11 Home, version `10.0.26300`, build `26300`, 64-bit; PowerShell.
- Node `v24.11.1`; Playwright `1.63.0`.
- Firefox `155.0` (Playwright browser build `1543`); WebKit `26.6` (Playwright browser build `2359`). Runtime versions were printed by each passing test invocation. Browser package builds were the coordinator-installed pinned engines.
- Each engine used fresh Playwright contexts with downloads enabled and synthetic data. No owner browser profile, account, or project was opened.

## Final assertions and results

The opt-in test is `artifacts/custom-gpt-creator/tests/non-chromium.e2e.ts`. It is skipped by default and only targets Firefox or WebKit when `A08_NON_CHROMIUM=1` is set. The journey asserts:

1. The preview renders the capability workbench; a synthetic Unicode project name (`A08 recovery — 日本語 Ω`) and purpose are saved, then still appear after reload.
2. The downloaded JSON backup contains the Unicode name and the expected `okh-capability-workspace-backup` schema.
3. A temporary edit is replaced from the downloaded backup. The test waits for the import confirmation to disappear and for the imported-save status before checking the restored purpose.
4. Studio navigation opens the legacy Custom GPT studio and returns to the workbench with the capability project still selected. The unrelated `cgpt-workspace` sentinel is byte-identical before reload and after workbench reload. The studio initializes normal step-0 fields and an `updatedAt` value when it opens the legacy project, so after that intentional visit the test checks the sentinel project ID and preserved title instead of claiming byte identity.
5. In a second fresh context, a fixture denies writes only to `okh-capability-workspace`. The UI reports unsaved data and warns it may be lost on refresh/closure; the downloaded recovery backup contains the Unicode draft, the capability key remains absent, and the unrelated creator sentinel remains unchanged.

Final invocations, both passing one test:

```powershell
$env:CREATOR_BASE_URL = 'http://127.0.0.1:20027/custom-gpt-creator/'
$env:A08_NON_CHROMIUM = '1'
node node_modules/.pnpm/@playwright+test@1.63.0/node_modules/@playwright/test/cli.js test --config artifacts/custom-gpt-creator/playwright.config.ts tests/non-chromium.e2e.ts --browser=firefox
```

Result: `1 passed`; runtime line reported `firefox`, `155.0`, Node `v24.11.1`, `win32`, and the assigned preview URL.

```powershell
$env:CREATOR_BASE_URL = 'http://127.0.0.1:20027/custom-gpt-creator/'
$env:A08_NON_CHROMIUM = '1'
node node_modules/.pnpm/@playwright+test@1.63.0/node_modules/@playwright/test/cli.js test --config artifacts/custom-gpt-creator/playwright.config.ts tests/non-chromium.e2e.ts --browser=webkit
```

Result: `1 passed`; runtime line reported `webkit`, `26.6`, Node `v24.11.1`, `win32`, and the assigned preview URL. The final runs used the one-time sentinel seeding and post-studio assertions described above.

## Other checks

- Focused core tests: `node --experimental-strip-types --test artifacts/mockup-sandbox/src/lib/capability-workbench.test.ts artifacts/mockup-sandbox/src/lib/capability-concurrency.test.ts artifacts/mockup-sandbox/src/lib/creatorStorage.test.ts` — 25 passed, 0 failed.
- Creator source typecheck: `node node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/bin/tsc -p artifacts/custom-gpt-creator/tsconfig.json --noEmit` — passed.
- New Playwright test strict typecheck: `node node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/bin/tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --typeRoots artifacts/custom-gpt-creator/node_modules/@types --skipLibCheck --strict artifacts/custom-gpt-creator/tests/non-chromium.e2e.ts` — passed.
- Governance: `python3 scripts/governance-check.py` — all checks passed.
- Filename dry run: `python3 scripts/normalize_filenames.py . --recursive --ascii-only --include-dirs` — no changes needed.
- Whitespace: `git diff --check` — passed before final documentation/receipt updates; repeat against the final commit before handback.

## Attempts and limits

- First package-script launch, `pnpm --filter @workspace/custom-gpt-creator exec playwright test tests/non-chromium.e2e.ts --browser=firefox`, aborted before running tests with `[ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY]` while pnpm attempted an install. No install or dependency change was performed; the already-installed pinned Playwright CLI was invoked directly afterward.
- A direct CLI attempt initially pointed at a nonexistent `artifacts/custom-gpt-creator/node_modules/playwright/cli.js` and returned `MODULE_NOT_FOUND`; the corrected command above used the installed pinned `@playwright/test` CLI path.
- The first Firefox journey attempt exposed that opening the legacy studio initializes default fields and updates the synthetic project's timestamp. The fixture was changed to seed once per session; exact sentinel bytes are checked before reload and after workbench reload, while the post-studio check preserves the sentinel project identity and title. Both final engine runs passed against this final fixture/assertion logic.
- No Safari, mobile device/browser, operating-system peer, screen reader, or assistive-technology behavior was tested. Denied storage is a controlled `Storage.prototype.setItem` failure and demonstrates the displayed warning and downloadable recovery path; it does not establish durable recovery after closing the browser.
