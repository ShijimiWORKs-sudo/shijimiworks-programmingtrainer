# Programming Trainer Autonomous Decisions

## 2026-09-04: Resolve Work Root Path
Date: 2026-09-04
Context: The requested path was written as `C:\制作データ\10\_App\ProgrammingTrainer\`, but `C:\制作データ\10` did not exist. The existing application repository was found at `C:\制作データ\10_App\ProgrammingTrainer`.
Decision: Use `C:\制作データ\10_App\ProgrammingTrainer` as the working root.
Reason: Markdown escaping likely split `10_App` into `10\_App`; the resolved path contains the expected branch, baseline HEAD, and GitHub remote.
Alternatives: Stop and ask for clarification; use the unrelated empty repository at `C:\Users\user\Documents\ChatGPT\Programmingtrainer`.
Risk: If the user intended a different clone, changes will land in the matched local clone instead. This is mitigated by branch, HEAD, and remote all matching the request.

## 2026-09-04: DOMPurify Override for Audit Green
Date: 2026-09-04
Context: `npm audit --audit-level=low` reported low/moderate DOMPurify advisories through `monaco-editor@0.56.0 -> dompurify@3.4.8`. `npm audit fix --force` proposed a breaking Monaco downgrade to `monaco-editor@0.53.0`.
Decision: Add npm `overrides.dompurify = 3.4.14` and refresh `package-lock.json` with `npm install`.
Reason: This fixes the vulnerable transitive package while preserving the existing Monaco version and application behavior.
Alternatives: Accept the breaking downgrade; wait for a Monaco release with updated dependency; ignore audit. These were rejected because the checkpoint requires audit green without broad behavior changes.
Risk: npm override may need revisiting when Monaco updates its own DOMPurify dependency. Keep the override until a non-vulnerable Monaco release makes it unnecessary.

## 2026-09-04: Dev-only E2E Editor Hook
Date: 2026-09-04
Context: During PR #2 self-review, Chrome/Edge E2E showed Monaco keyboard replacement could race with lesson state recovery or fail to select all existing code, causing tests to run starter or duplicated code.
Decision: Add a development-only Lesson Workspace hook that lets E2E set the React editor state after lesson recovery completes, then wait until the state reflects the requested code.
Reason: This keeps production behavior unchanged while making E2E assertions validate runner/grading behavior instead of Monaco keyboard timing.
Alternatives: Keep retrying the flaky keyboard helper; expose Monaco internals from `CodeEditor`; weaken or skip E2E. These were rejected because the checkpoint requires reliable Chrome/Edge coverage without weakening tests.
Risk: The dev-only window hook is test support surface. It must remain guarded by `import.meta.env.DEV` and should not be used as product functionality.
