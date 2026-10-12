# A09 human acceptance checklist

Status: prepared by the coordinator; not executed. No screen-reader, zoom or
representative-user acceptance is claimed. The named tester is still pending.
This checklist is a bounded execution aid for FND-27 and FND-43.

Use synthetic projects in a disposable browser profile. Before the session,
record the exact application/source revision and served URL. Record the actual
OS, browser, screen reader and their versions. Confirm the tester agrees to the
session and to the permitted public receipt; keep any private raw recording
outside this public repository. Do not use personal workspace projects.

## Journey and observations

| Step | Action | Record the actual observation |
| --- | --- | --- |
| 1 | Open the workbench. Reach the project selector, edit the name and purpose, change stage and return using the keyboard. | Focus order, labels, selected value, stage change, and ability to recover focus. |
| 2 | Download the current backup. Select an invalid test backup, then a valid test backup. | Selected filename, import error, spoken feedback, current project state, and whether the failed selection leaves an old confirmation visible. |
| 3 | Review the replacement prompt. Download the current backup from it, cancel, then reopen it. | Overwrite scope, current/imported project counts and names when available, keyboard access to recovery/cancel/confirm, and unchanged data on cancel. |
| 4 | Change the workspace after a replacement prompt is open, in the same tab and in another tab, then attempt confirmation. | Stale-state feedback, focus recovery, retained drafts and readable recovery instructions. Execute against the A05 candidate once published. |
| 5 | In an approved disposable failure harness, deny a capability storage write and edit again. Download the newest backup; restore normal writes and edit once. | First spoken unsaved notice, refresh/closure consequence, actionable recovery, no repeated speech for every later keystroke, latest backup content, and successful-save announcement. The harness does not establish native quota behavior. |
| 6 | Use two disposable tabs to create a save conflict. Download both snapshots. | Discovery of the conflict, the authoritative revision and both drafts, keyboard access, focus and actual spoken message. |
| 7 | Open the retained creator, select an export and trigger denied/unavailable clipboard behavior in the approved harness. | Failure announcement, manual/download recovery, retry behavior and preservation of the chosen content/format. Native clipboard behavior is a separate observation. |
| 8 | At actual browser zoom of 200% and 400%, repeat project selection, recovery download and replacement cancellation. | Readability, scrolling, obscured controls and loss of focus. A smaller viewport alone does not count as browser zoom. |

Use **pass**, **fail**, **not run**, or **unsupported** per step. Record expected
and observed behavior separately, assistance given, exact source/runtime, date,
tester identity or permitted pseudonym, and an evidence location. Preserve every
failure and give it a reproduction; an accessibility tree or automated locator
result cannot substitute for what the tester heard and did.

## Receipt fields

```text
Consent and permitted public/private evidence boundary:
Tester and actual assistive technology:
Application source / served artifact / URL:
OS / browser / screen-reader versions:
Date / actual browser zoom:
Step / expected / observed / status:
Speech and focus observation / help provided:
Reproduction and evidence location for failures:
Recovery bytes or non-private content check:
Checks not run and why:
Next owner and exact next action:
```

The A09 worker may organize this evidence after a tester and actual technology
are available. It must not run a simulated human, mark pending steps passed, or
close FND-43's speech evidence from the existing DOM mutation test.
