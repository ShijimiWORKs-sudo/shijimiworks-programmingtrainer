# AGENTS.md — Programming Trainer

## Product
Programming Trainer is a PC Web hands-on programming learning application.

## Current priority
Follow the active Phase instruction document exactly.
Do not implement future phases unless explicitly requested.

## Development rules
- Preserve existing working behavior.
- Make the smallest change that satisfies the active Phase.
- Do not perform unrelated refactors.
- Do not add features outside the active Phase.
- Do not add dependencies without a clear need.
- Keep TypeScript strict and do not leave type errors.
- Do not place curriculum content directly inside UI components.
- UI must not directly access IndexedDB; use repositories.
- Language execution must be behind a LanguageRunner abstraction.
- Python execution must not block the main UI thread.
- User code must have a timeout/cancel recovery path.
- Do not execute user Python through the host OS.
- Do not rely on external network access for lesson correctness.
- Keep Chrome and Edge PC Web behavior as the acceptance target.
- Mobile UI is not a Phase 1 acceptance criterion.

## Git
- Work on the instructed branch.
- Do not merge to main unless explicitly instructed.
- Do not rewrite unrelated history.
- Commit logically grouped changes.
- Push the working branch when requested.
- Create Draft PR when requested.

## Tests
Before completion, run all that apply:
1. lint
2. typecheck
3. unit tests
4. build
5. relevant E2E tests

If any cannot run, report the exact reason.

## Required completion report
1. Summary
2. Changed files
3. Implementation details
4. Tests run and results
5. Manual verification
6. Known limitations / remaining work
7. Dependencies added, if any
8. Commit hash
9. PR URL, if created
