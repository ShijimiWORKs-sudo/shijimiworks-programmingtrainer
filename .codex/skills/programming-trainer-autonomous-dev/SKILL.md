---
name: programming-trainer-autonomous-dev
description: Programming Trainer専用に、既存仕様へ従って小単位で復元、実装、テスト、修正、レビュー、checkpointしながら自律開発を継続する。
---

# Programming Trainer Autonomous Development

## Mission
Programming Trainerを既存仕様に従い、小単位で実装、テスト、修正、レビュー、checkpointしながら完成へ進める。

## Source Of Truth Priority
1. `AGENTS.md`
2. `docs/product/*`
3. 現在Phase指示書
4. `tests`
5. implementation
6. `docs/autonomous/AUTONOMOUS_PLAN.md`
7. `docs/autonomous/AUTONOMOUS_STATUS.md`
8. `docs/autonomous/AUTONOMOUS_DECISIONS.md`

この優先順位で矛盾を解決する。下位資料だけを根拠に上位仕様を変更しない。

## Mandatory Loop
Every autonomous session must run this loop:

`RECOVER -> PLAN -> IMPLEMENT -> TEST -> FIX -> RETEST -> REVIEW -> CHECKPOINT -> NEXT`

### RECOVER
- Start by reading `AGENTS.md`, relevant `docs/product/*`, the active phase instruction in `docs/codex/*`, and all files under `docs/autonomous/`.
- Run `pwd`, `git status`, `git branch --show-current`, `git rev-parse HEAD`, `git remote -v`, `git diff`, and `git diff --staged` before edits.
- Identify uncommitted changes and preserve them. Never discard local work.

### PLAN
- Use `docs/autonomous/AUTONOMOUS_PLAN.md` as the working breakdown.
- Select the smallest next checkpoint that matches the current phase.
- Confirm purpose, target files, acceptance conditions, and required tests before implementation.

### IMPLEMENT
- Keep changes narrow and aligned with the current phase.
- Do not implement future-phase features unless explicitly instructed.
- Preserve repository architecture: UI must use repositories for persistence, execution must stay behind `LanguageRunner`, and Python must run in a Web Worker.

### TEST
- Run the smallest relevant tests first, then the full required regression for the checkpoint.
- For Phase 1 hardening checkpoints, include `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e -- --project=chrome --project=edge`, and `npm audit --audit-level=low` unless a concrete blocker prevents it.

### FIX
- When tests fail, identify the root cause before editing.
- Make the smallest fix that restores the intended behavior.
- Do not skip, delete, or weaken tests to create a green result.

### RETEST
- Re-run the failing test or command after each fix.
- After targeted tests pass, re-run the full checkpoint regression.

### REVIEW
- Run `git status` and inspect `git diff` before committing.
- Check for hidden test leakage, attempt/result ID consistency, timeout/cancel cleanup, progress race behavior, type safety, and accidental future-phase scope.

### CHECKPOINT
- Update `docs/autonomous/AUTONOMOUS_STATUS.md` and append to `docs/autonomous/AUTONOMOUS_TEST_LOG.md`.
- Record any non-obvious decision in `docs/autonomous/AUTONOMOUS_DECISIONS.md`.
- Commit logically, push the instructed branch, and update the active PR only when the checkpoint is green and the user requested it.

### NEXT
- Leave the repo resumable: status file must name the current phase, completed work, in-progress item, next item, tests, blockers, branch, and commit.
- The next Codex session should be able to continue from `RECOVER` without relying on chat history.
