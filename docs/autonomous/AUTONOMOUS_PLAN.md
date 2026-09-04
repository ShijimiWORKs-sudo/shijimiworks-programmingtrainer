# Programming Trainer Autonomous Plan

Source of truth: `docs/product/05_DEVELOPMENT_ROADMAP_v1.0.md`.

## Current Checkpoint: Phase 1 Final Hardening

### P1H-01 Hidden Test Leakage Prevention
Purpose: Hidden tests must not expose stdin, expected stdout, actual stdout, stderr, or secret values in the grading UI.
Change Targets: `src/features/grading/GradingEngine.ts`, `src/routes/LessonWorkspacePage.tsx`, `tests/e2e/phase1-learning.spec.ts`.
Acceptance: Public tests still show useful details; hidden tests show only pass/fail and a generic private-test message.
Required Tests: Unit/component coverage where practical; Chrome/Edge E2E hidden-test regression.

### P1H-02 Attempt Test Result ID Consistency
Purpose: Every `AttemptTestResult.attemptId` must reference its parent `Attempt.id`.
Change Targets: `src/features/progress/attempts.ts`, `src/routes/LessonWorkspacePage.tsx`, related tests.
Acceptance: Recorded attempt test results all share the generated parent attempt ID.
Required Tests: Unit test for attempt helper.

### P1H-03 Wrong Answer vs Runtime Error Separation
Purpose: Output mismatch must remain a grading failure without being mislabeled as a runtime error.
Change Targets: `src/features/progress/attempts.ts`, grading summary path, related tests.
Acceptance: Wrong answer summaries keep execution status `success`; real execution failures use their actual status and error type.
Required Tests: Unit tests for grading summary helper and existing grading tests.

### P1H-04 Cancel and Timeout Cleanup
Purpose: Timeout/cancel must terminate stale workers, remove listeners, and allow later runs to recover.
Change Targets: `src/features/runner/PythonRunner.ts`, `src/features/runner/PythonRunner.test.ts`.
Acceptance: Timed-out or cancelled runs do not leave stale listeners and the next run executes on a fresh worker.
Required Tests: Runner timeout and cancel recovery unit tests; E2E run/grade regression.

### P1H-05 Last Code Save Race Protection
Purpose: Older async progress saves must not overwrite newer edited code.
Change Targets: `src/repositories/BrowserProgressRepository.ts`, `src/repositories/BrowserProgressRepository.test.ts`.
Acceptance: Per-lesson saves are serialized and newer `lastCode`/timestamps win.
Required Tests: Repository race/regression unit test and reload persistence E2E.

### P1H-06 Full Regression and PR Update
Purpose: Prove Phase 1 remains green and checkpoint the autonomous foundation.
Change Targets: `docs/autonomous/*`, `.codex/skills/programming-trainer-autonomous-dev/SKILL.md`, final commit.
Acceptance: Required commands pass or blocker is recorded with exact reason; PR #2 is updated without force push or main merge.
Required Tests: `npm run lint`; `npm run typecheck`; `npm test`; `npm run build`; `npm run test:e2e -- --project=chrome --project=edge`; `npm audit --audit-level=low`.

## Phase 2: Python 3級 Curriculum Complete

### P2-01 Lesson 4 Types and Operators
Purpose: Add a complete lesson for Python types and operators.
Change Targets: `src/content/python/grade-3/*`, curriculum tests, Lesson Workspace regression as needed.
Acceptance: Lesson 4 has explanation, task, starter code, hints, public/hidden tests, and pass flow.
Required Tests: Curriculum unit tests, grading tests if comparator needs coverage, E2E targeted lesson run/grade.

### P2-02 Lesson 5 if
Purpose: Add branching practice with `if`/`else`.
Change Targets: Python grade-3 content and tests.
Acceptance: Learner can solve conditional branching with meaningful hidden coverage.
Required Tests: Curriculum unit tests and targeted E2E grade.

### P2-03 Lesson 6 for
Purpose: Add `for` loop practice.
Change Targets: Python grade-3 content and tests.
Acceptance: Loop lesson grades multiple inputs without leaking hidden details.
Required Tests: Curriculum unit tests and targeted E2E grade.

### P2-04 Lesson 7 while
Purpose: Add `while` loop practice with timeout-safe examples.
Change Targets: Python grade-3 content and runner/grading tests if needed.
Acceptance: Correct `while` solution passes; incorrect infinite loop recovers.
Required Tests: Curriculum tests, runner regression, targeted E2E.

### P2-05 Lesson 8 list
Purpose: Add list creation/indexing/update practice.
Change Targets: Python grade-3 content and tests.
Acceptance: Multiple list scenarios are graded with public and hidden tests.
Required Tests: Curriculum tests and targeted E2E.

### P2-06 Lesson 9 dict
Purpose: Add dictionary lookup/update practice.
Change Targets: Python grade-3 content and tests.
Acceptance: Learner uses dict operations to satisfy multiple test cases.
Required Tests: Curriculum tests and targeted E2E.

### P2-07 Lesson 10 function
Purpose: Add function definition and call practice.
Change Targets: Python grade-3 content, grading support if function-style execution needs wrapper code.
Acceptance: Function lesson grades reliably without future-phase scope creep.
Required Tests: Curriculum tests, grading tests if wrapper behavior changes, targeted E2E.

### P2-08 Multiple Exercises Per Lesson
Purpose: Expand lesson data/UI to support multiple exercises where required by the roadmap.
Change Targets: curriculum domain/content, Lesson Workspace selection UI, progress/attempt handling.
Acceptance: A lesson can expose multiple exercises and persist/grade each without breaking existing lessons.
Required Tests: Domain/content tests, component tests, E2E for exercise switching and progress.

### P2-09 Hint Quality and Error Explanation
Purpose: Improve learner feedback for all 10 lessons within existing grading boundaries.
Change Targets: content, grading result presentation, tests.
Acceptance: Hints are staged and error feedback remains useful without revealing hidden cases.
Required Tests: Content assertions and UI regression.

### P2-10 Chapter Progress
Purpose: Show reliable chapter-level progress for Python 3級.
Change Targets: curriculum/progress aggregation, curriculum page UI, tests.
Acceptance: Chapter progress reflects lesson statuses after pass/reload.
Required Tests: Repository/unit tests and E2E pass/reload progression.

### P2-11 Phase 2 Regression Checkpoint
Purpose: Verify the complete 10-lesson curriculum.
Change Targets: docs/autonomous status and test log, commit/PR.
Acceptance: Full regression green in Chrome and Edge.
Required Tests: Full checkpoint commands.

## Phase 3: Python 3級 Challenge / Mock Exam

### P3-01 Chapter Challenge Data Model
Purpose: Add challenge entities compatible with existing curriculum/progress architecture.
Change Targets: domain, content, repository interfaces, tests.
Acceptance: Challenge data can be rendered and graded without affecting lessons.
Required Tests: Typecheck, unit tests.

### P3-02 Chapter Challenge UI and Grading
Purpose: Build the chapter challenge workflow.
Change Targets: routes/components/grading/progress.
Acceptance: Learner can complete a challenge and save result.
Required Tests: Component and E2E challenge flow.

### P3-03 Mock Exam Shell
Purpose: Add mock exam navigation, timer shell, and problem movement.
Change Targets: routes/domain/content/UI.
Acceptance: Mock exam can be started, navigated, and paused/saved.
Required Tests: Component and E2E shell flow.

### P3-04 Mock Exam Final Scoring
Purpose: Add final grading, score, pass/fail, and result view.
Change Targets: grading/progress/result route.
Acceptance: Results show total and field-level feedback.
Required Tests: Unit and E2E scoring.

### P3-05 Weakness Analysis and Review Path
Purpose: Connect exam results to weak lesson review suggestions.
Change Targets: analytics/progress UI.
Acceptance: Result page recommends review lessons based on failures.
Required Tests: Analytics unit tests and E2E result assertions.

### P3-06 Python 3級 v1.0 Candidate Checkpoint
Purpose: Stabilize Python 3級 candidate.
Change Targets: docs/autonomous status and test log, release notes as needed.
Acceptance: Full regression green and known limitations recorded.
Required Tests: Full checkpoint commands.

## Phase 4: Python 2級

### P4-01 Python 2級 Course Foundation
Purpose: Add Python 2級 routing and curriculum skeleton.
Change Targets: content/domain/routes.
Acceptance: 2級 appears enabled only where intended and does not break 3級.
Required Tests: Navigation and content tests.

### P4-02 Function Deepening
Purpose: Add deeper function lessons.
Change Targets: content/grading/tests.
Acceptance: Function tasks grade multiple cases.
Required Tests: Unit and targeted E2E.

### P4-03 Classes
Purpose: Add class/object lessons.
Change Targets: content/grading/tests.
Acceptance: Class tasks execute and grade in worker.
Required Tests: Unit and targeted E2E.

### P4-04 Exceptions
Purpose: Add exception handling lessons.
Change Targets: content/grading/tests.
Acceptance: Learner can intentionally catch/report errors.
Required Tests: Unit and targeted E2E.

### P4-05 Virtual File I/O
Purpose: Provide safe file-like exercises without host filesystem access.
Change Targets: runner/grading/content/tests.
Acceptance: File exercises run in browser sandbox only.
Required Tests: Runner/grading unit tests and E2E.

### P4-06 Algorithms and Debug Tasks
Purpose: Add algorithm and debugging practice.
Change Targets: content/grading/UI tests.
Acceptance: Learner can repair or complete small algorithm tasks.
Required Tests: Unit and targeted E2E.

### P4-07 Small Project Checkpoint
Purpose: Complete Python 2級 small project path.
Change Targets: content/progress/grading.
Acceptance: 2級 path is complete and resumable.
Required Tests: Full checkpoint commands.

## Phase 5: Python 1級

### P5-01 Multi-file Project Model
Purpose: Introduce project-style exercise data safely.
Change Targets: domain/editor/grading/tests.
Acceptance: Multi-file tasks are represented without breaking single-file lessons.
Required Tests: Unit/component tests.

### P5-02 Bug Fix Tasks
Purpose: Add existing-code repair exercises.
Change Targets: content/grading/UI.
Acceptance: Learner can modify supplied code and pass tests.
Required Tests: Targeted E2E.

### P5-03 Specification Change Tasks
Purpose: Add change-request exercises.
Change Targets: content/grading/UI.
Acceptance: Tasks validate changed behavior.
Required Tests: Unit and E2E.

### P5-04 Test-Oriented Tasks
Purpose: Add tasks involving tests and expected behavior.
Change Targets: content/grading/result UI.
Acceptance: Learner sees test-oriented feedback appropriate for 1級.
Required Tests: Unit and E2E.

### P5-05 Refactoring Tasks
Purpose: Add refactoring practice while preserving behavior.
Change Targets: content/grading.
Acceptance: Behavioral tests validate refactor tasks.
Required Tests: Unit and targeted E2E.

### P5-06 Python 1級 Checkpoint
Purpose: Complete Python 1級 route.
Change Targets: docs/autonomous status and log.
Acceptance: Full Python path regression is green.
Required Tests: Full checkpoint commands.

## Phase 6: JavaScript

### P6-01 JavaScript Runner Foundation
Purpose: Add JavaScript execution behind `LanguageRunner`.
Change Targets: runner/domain/tests.
Acceptance: JS code runs in browser sandbox with stdout/console capture.
Required Tests: Runner unit tests and E2E smoke.

### P6-02 JavaScript Grade 3 Curriculum
Purpose: Add JS 3級 lessons.
Change Targets: content/routes/grading/tests.
Acceptance: JS 3級 has complete run/grade/progress path.
Required Tests: Content, grading, E2E.

### P6-03 JavaScript Grade 2 Curriculum
Purpose: Add JS 2級 lessons.
Change Targets: content/grading/tests.
Acceptance: 2級 tasks grade and persist progress.
Required Tests: Unit and E2E.

### P6-04 JavaScript Grade 1 Curriculum
Purpose: Add JS 1級 tasks.
Change Targets: content/grading/tests.
Acceptance: 1級 path supports practical modification tasks.
Required Tests: Unit and E2E.

### P6-05 JavaScript Checkpoint
Purpose: Stabilize JS language path.
Change Targets: docs/autonomous status and log.
Acceptance: Full regression green.
Required Tests: Full checkpoint commands.

## Phase 7: HTML/CSS

### P7-01 Split Editor and Preview Foundation
Purpose: Add HTML/CSS editing and iframe preview.
Change Targets: editor/runner-preview/routes/tests.
Acceptance: Preview updates safely without executing untrusted scripts as app code.
Required Tests: Component and E2E.

### P7-02 DOM Validator
Purpose: Grade HTML structure.
Change Targets: grading validators/content/tests.
Acceptance: DOM requirements can be validated.
Required Tests: Unit and targeted E2E.

### P7-03 Style Validator
Purpose: Grade CSS/responsive requirements.
Change Targets: grading validators/content/tests.
Acceptance: CSS tasks validate expected style outcomes.
Required Tests: Unit and targeted E2E.

### P7-04 HTML/CSS Grade 3-1 Curriculum
Purpose: Complete grade 3, 2, and 1 HTML/CSS lessons.
Change Targets: content/routes/progress/tests.
Acceptance: Full HTML/CSS path is learnable and persistent.
Required Tests: Full checkpoint commands plus preview tests.

## Phase 8: Java

### P8-01 Java Runner Infrastructure
Purpose: Add compile/run runner abstraction for Java.
Change Targets: runner infrastructure/tests.
Acceptance: Java execution strategy is sandboxed and swappable.
Required Tests: Runner tests and smoke E2E.

### P8-02 Java Grade 3-1 Curriculum
Purpose: Add Java curriculum across levels.
Change Targets: content/grading/routes/tests.
Acceptance: Java lessons can run, grade, and persist.
Required Tests: Full language path regression.

## Phase 9: C++

### P9-01 C++ Compile/Run Infrastructure
Purpose: Add C++ compile/run runner abstraction.
Change Targets: runner infrastructure/tests.
Acceptance: C++ execution strategy is sandboxed and swappable.
Required Tests: Runner tests and smoke E2E.

### P9-02 C++ Grade 3-1 Curriculum
Purpose: Add C++ curriculum across levels.
Change Targets: content/grading/routes/tests.
Acceptance: C++ lessons can run, grade, and persist.
Required Tests: Full language path regression.

## Phase 10: Ruby

### P10-01 Ruby Runner
Purpose: Add Ruby execution behind `LanguageRunner`.
Change Targets: runner infrastructure/tests.
Acceptance: Ruby lessons can run and grade safely.
Required Tests: Runner tests and smoke E2E.

### P10-02 Ruby Grade 3-1 Curriculum
Purpose: Add Ruby curriculum across levels.
Change Targets: content/grading/routes/tests.
Acceptance: Ruby path is complete.
Required Tests: Full language path regression.

## Phase 11: Windows Command

### P11-01 Virtual Terminal Foundation
Purpose: Add safe command training model.
Change Targets: runner/simulator/domain/tests.
Acceptance: Commands execute only against a virtual environment.
Required Tests: Simulator unit tests and E2E smoke.

### P11-02 Virtual Filesystem Tasks
Purpose: Add file operation exercises.
Change Targets: simulator/content/grading/tests.
Acceptance: Create/move/delete tasks validate virtual filesystem state.
Required Tests: Unit and targeted E2E.

### P11-03 Command Grade 3-1 Curriculum
Purpose: Complete Windows Command curriculum.
Change Targets: content/routes/progress/tests.
Acceptance: Command path is complete and safe.
Required Tests: Full checkpoint commands.

## Phase 12: PowerShell

### P12-01 Virtual PowerShell Foundation
Purpose: Add safe PowerShell-like training environment.
Change Targets: simulator/runner/domain/tests.
Acceptance: Pipeline and filesystem exercises run in virtual state only.
Required Tests: Unit and E2E smoke.

### P12-02 Pipeline Exercises
Purpose: Add pipeline-focused lessons.
Change Targets: content/grading/tests.
Acceptance: Pipeline outputs validate correctly.
Required Tests: Unit and targeted E2E.

### P12-03 Filesystem Exercises
Purpose: Add virtual filesystem lessons.
Change Targets: simulator/content/grading/tests.
Acceptance: File tasks validate virtual state.
Required Tests: Unit and targeted E2E.

### P12-04 PowerShell Grade 3-1 Curriculum
Purpose: Complete PowerShell curriculum.
Change Targets: content/routes/progress/tests.
Acceptance: PowerShell path is complete and safe.
Required Tests: Full checkpoint commands.

## Phase 13: Cross-language Learning Analytics

### P13-01 Skill Map Model
Purpose: Add skill taxonomy and links to lessons/results.
Change Targets: domain/content/progress/tests.
Acceptance: Lessons and attempts map to skills.
Required Tests: Unit tests.

### P13-02 Weakness and Recommended Next Lesson
Purpose: Compute weak areas and next recommendations.
Change Targets: analytics/progress UI/tests.
Acceptance: Recommendations update from learner history.
Required Tests: Unit and E2E.

### P13-03 Learning Time and Streak Optional
Purpose: Add optional engagement analytics if still aligned with product scope.
Change Targets: progress/settings/UI/tests.
Acceptance: Analytics remain local-first and do not distract from training.
Required Tests: Unit and E2E.

### P13-04 Analytics Checkpoint
Purpose: Stabilize cross-language analytics.
Change Targets: docs/autonomous status/log.
Acceptance: Full regression green.
Required Tests: Full checkpoint commands.

## Phase 14: Account / Cloud Sync

### P14-01 Authentication Boundary
Purpose: Add account model without forcing cloud sync into local MVP behavior.
Change Targets: auth/domain/settings/tests.
Acceptance: Local-first data remains usable without account.
Required Tests: Unit and E2E.

### P14-02 Cloud Persistence Adapter
Purpose: Add cloud repository adapter behind existing interfaces.
Change Targets: repositories/sync/tests.
Acceptance: Repository consumers do not depend on storage backend details.
Required Tests: Contract tests.

### P14-03 Multi-device Sync and Conflict Rules
Purpose: Add deterministic sync conflict handling.
Change Targets: sync/repositories/tests.
Acceptance: Concurrent progress updates resolve predictably.
Required Tests: Sync conflict unit tests and E2E smoke.

### P14-04 Backup/Restore and Migration
Purpose: Add data safety tooling for curriculum version changes.
Change Targets: sync/settings/migration/tests.
Acceptance: Users can backup/restore and migrate safely.
Required Tests: Migration and restore tests.

### P14-05 Cloud Sync Checkpoint
Purpose: Stabilize cloud sync phase.
Change Targets: docs/autonomous status/log.
Acceptance: Full regression green.
Required Tests: Full checkpoint commands.

## Phase 15: Release Hardening

### RH-01 Accessibility Review
Purpose: Ensure PC Web workflows are keyboard and screen-reader practical.
Change Targets: UI semantics, focus flow, tests.
Acceptance: Core learning flows meet agreed accessibility baseline.
Required Tests: Accessibility checks and manual keyboard pass.

### RH-02 Performance Review
Purpose: Keep initial load, Pyodide load, editor, and grading performance acceptable.
Change Targets: bundling/worker/loading UI/tests.
Acceptance: Performance risks are measured and mitigated.
Required Tests: Build analysis and targeted manual checks.

### RH-03 Security Review
Purpose: Review sandboxing, storage, hidden tests, and untrusted code boundaries.
Change Targets: runner/grading/storage/docs.
Acceptance: User code stays browser-contained and hidden tests do not leak through UI.
Required Tests: Security regression tests and manual inspection.

### RH-04 Browser Matrix
Purpose: Verify supported Windows PC browsers.
Change Targets: tests/docs as needed.
Acceptance: Chrome and Edge stable are verified.
Required Tests: Full E2E browser matrix.

### RH-05 Recovery and Data Integrity
Purpose: Verify reload, cancellation, timeout, and local data recovery behavior.
Change Targets: progress/runner/tests.
Acceptance: Interrupted sessions resume without data loss.
Required Tests: Recovery E2E and repository tests.

### RH-06 Content QA
Purpose: Validate curriculum wording, examples, hidden tests, and hints.
Change Targets: content/docs/tests.
Acceptance: Lessons are understandable and correct.
Required Tests: Content QA checklist and targeted E2E.

### RH-07 Release Documentation
Purpose: Prepare release notes, known limitations, and operating instructions.
Change Targets: docs/readme/release notes.
Acceptance: Release artifacts reflect actual shipped behavior.
Required Tests: Link/doc review and full checkpoint commands.
