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

## 2026-09-04: Preserve Pyodide Batched Output Line Breaks
Date: 2026-09-04
Context: P2-01 Lesson 4 introduced a correct solution with two `print` calls. Targeted E2E showed Pyodide's batched stdout callback could deliver each printed line without a trailing newline, producing captured output like `712` instead of `7\n12`.
Decision: Normalize batched stdout and stderr in the Python worker by appending a newline when a batch does not already end with one.
Reason: Lesson comparators and the visible output panel expect normal Python `print` line separation. Keeping the fix in the runner preserves correctness for all lessons without changing lesson-specific expected outputs.
Alternatives: Change Lesson 4 expected output to `712`; use raw callback instead of batched callback; loosen the comparator. These were rejected because they would hide real multi-line output behavior or weaken grading.
Risk: If a future exercise intentionally relies on partial-line output without a newline, batched capture may display it with line separation. Current curriculum and beginner lessons use line-oriented `print` output, so this is acceptable for the MVP.

## 2026-09-04: Exercise Progress Without IndexedDB Migration
Date: 2026-09-04
Context: P2-08 requires multiple exercises per lesson with persistence. Existing IndexedDB version 1 stores lesson-level progress records and attempts already include `exerciseId`.
Decision: Extend `LessonProgress` values with optional `activeExerciseId` and `exerciseProgress` fields, without changing object stores or indexes.
Reason: IndexedDB can store the extended value shape in the existing store, and old records remain readable because the new fields are optional. This avoids a destructive or unnecessary migration while enabling exercise-level code/status/run/grade tracking.
Alternatives: Add a new `exerciseProgress` object store and migrate old progress; keep only one lesson-level `lastCode`; encode exercise state into attempts only. These were rejected because they either increase migration risk or fail the persistence acceptance condition.
Risk: Lesson-level aggregate status and exercise-level status now coexist. The UI and progress helpers must keep them synchronized, especially when a lesson has more than one exercise.

## 2026-09-04: Challenge Progress IndexedDB Store
Date: 2026-09-04
Context: P3-01 requires challenge entities compatible with the existing progress architecture. Lesson progress and attempts already live in IndexedDB version 1, but challenge progress should not be mixed into lesson records because challenges are not lessons.
Decision: Add a non-destructive IndexedDB version 2 migration with a separate `challengeProgress` object store and repository methods for challenge progress.
Reason: A dedicated store keeps challenge state queryable by user/challenge without weakening or overloading lesson progress semantics.
Alternatives: Store challenges as pseudo-lessons; delay persistence until the UI phase; add challenge fields to lesson progress. These were rejected because they either blur domain boundaries or force P3-02 to retrofit persistence.
Risk: Versioned DB migration must preserve existing version 1 lesson progress. Tests now cover saving challenge progress alongside lesson progress.

## 2026-09-04: Mock Exam Session Store Before Scoring
Date: 2026-09-04
Context: P3-03 is scoped to mock exam navigation, timer shell, and pause/save recovery. P3-04 will add final scoring and result presentation.
Decision: Add a non-destructive IndexedDB version 3 migration with a dedicated `mockExamSessions` store and persist answers, active problem, status, and remaining seconds before adding scoring.
Reason: The shell needs reliable recovery across reloads and problem navigation, but scoring state should stay out of scope until the next checkpoint.
Alternatives: Reuse lesson or challenge progress; wait to persist exam sessions until scoring; store the shell only in component state. These were rejected because they either mix separate product concepts or fail pause/reload recovery.
Risk: P3-04 must extend the existing session model carefully so submitted results remain compatible with sessions created by P3-03.

## 2026-09-04: Mock Exam Passing Threshold
Date: 2026-09-04
Context: Product docs require mock exam score and pass/fail, but do not define the initial passing threshold for the Python 3級 trial exam.
Decision: Set `passingScorePercent` to 100 for the current Python 3級 v1.0 candidate mock exam.
Reason: The seeded exam is short and focused on core Grade 3 concepts, so requiring every required test to pass gives beginners a clear completion target and avoids ambiguous partial certification semantics.
Alternatives: Use 70% or 80%; pass by problem count; omit pass/fail until more exams exist. These were rejected because they would introduce an unexplained certification rule or fail the P3-04 acceptance condition.
Risk: Future fuller mock exams may need a lower threshold or grade-specific policy. The threshold is explicit in the exam data so it can be changed per exam without migration.

## 2026-09-04: Mock Exam Review Suggestions From Source Lessons
Date: 2026-09-04
Context: P3-05 requires weakness analysis and review paths, but the product docs do not define a skill taxonomy yet.
Decision: Derive initial review suggestions from failed mock exam problem `sourceLessonIds`, sorted by failed required-test count and lesson order.
Reason: The curriculum already links exam problems to source lessons, so this creates useful review guidance without inventing a separate taxonomy before Phase 13.
Alternatives: Add a new skill map now; recommend all source lessons regardless of pass/fail; wait until cross-language analytics. These were rejected because they either broaden scope or make the review path less precise.
Risk: Source-lesson suggestions are coarse. Future analytics can replace or enrich them with a skill taxonomy while preserving the existing result data.

## 2026-09-05: Virtual File I/O Through Pyodide Worker Files
Date: 2026-09-05
Context: P4-05 requires safe file-like exercises without host filesystem access. The current runner executes Python inside a browser Web Worker with Pyodide, and the grading model is still stdout-based.
Decision: Teach virtual file I/O using relative filenames such as `report.txt` inside the Pyodide worker runtime, without adding host filesystem APIs or broadening the runner contract.
Reason: This satisfies the learner workflow for `open()`, `write()`, and `read()` while preserving the existing security boundary: user Python stays browser-contained and cannot access the local OS filesystem through the app.
Alternatives: Add a custom virtual filesystem grading API now; inspect file contents after execution; expose host files for realistic tasks. These were rejected because they either expand the architecture before needed or weaken the product security model.
Risk: Stdout grading cannot fully prove that a learner used file I/O rather than computing the same output directly. Future advanced tasks can add a dedicated virtual filesystem assertion layer without changing this lesson's safe execution boundary.
