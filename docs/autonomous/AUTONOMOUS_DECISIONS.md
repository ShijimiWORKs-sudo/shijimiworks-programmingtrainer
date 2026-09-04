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

## 2026-09-05: Debug Tasks As Code Exercises
Date: 2026-09-05
Context: P4-06 requires algorithm and debug tasks, but the domain currently has a single `ExerciseType` of `code` and no separate debug-task type.
Decision: Represent the first debug task as a normal code exercise with intentionally buggy starter code, explicit constraints, and hidden tests that catch the bug.
Reason: This keeps the checkpoint small and preserves existing grading/progress behavior while still giving learners a realistic repair workflow.
Alternatives: Add a new `debug` exercise type and UI affordances now; defer debug practice until a richer domain model exists. These were rejected because they would either broaden P4-06 or leave the roadmap item unimplemented.
Risk: The UI does not yet visually distinguish debug tasks from code-completion tasks. A future curriculum polish pass can add task-kind presentation without invalidating the current lesson.

## 2026-09-05: Optional Multi-file Project Metadata
Date: 2026-09-05
Context: P5-01 requires a multi-file project model, while all existing lessons, challenges, mock exams, progress records, and grading paths still use single `starterCode` strings.
Decision: Add optional project metadata to exercises and helper functions that can create a project file snapshot while keeping `starterCode` as the existing single-file entry source.
Reason: Optional metadata lets future Python 1級 tasks represent entry/support/test files without forcing a migration or breaking current Lesson Workspace, Challenge Workspace, Mock Exam, progress, or grading behavior.
Alternatives: Replace `starterCode` with a files array everywhere; add a separate exercise type immediately; wait until the UI work. These were rejected because they either create broad churn or fail to establish the P5-01 model checkpoint.
Risk: The current editor still renders only the entry source. P5-02/P5-03 must add UI/grading behavior carefully before expecting learners to edit multiple files directly.

## 2026-09-05: First Python 1級 Bug Fix Through Existing Workspace
Date: 2026-09-05
Context: P5-02 requires existing-code repair exercises, and P5-01 has introduced optional project metadata. The product currently has a stable single-editor Lesson Workspace and stdout grading path.
Decision: Enable Python 1級 with one routeable bug fix lesson that attaches project metadata while editing and grading the entry source through the existing Lesson Workspace.
Reason: This delivers a real repair workflow with public/hidden coverage without broadening the editor, persistence, or grading architecture before the next 1級 checkpoints need it.
Alternatives: Build a multi-file editor immediately; keep Python 1級 planned until the full practical UI exists; represent bug fix tasks as a new exercise type. These were rejected because they would either widen P5-02 or leave the checkpoint without a usable learner flow.
Risk: Learners do not yet see the support test file in the UI. Future Python 1級 tasks should expose project files deliberately, while keeping hidden test values outside visible metadata.

## 2026-09-05: Specification Change Task As Shipping Rule Update
Date: 2026-09-05
Context: P5-03 requires change-request exercises, but the product docs do not prescribe the first concrete Python 1級 scenario.
Decision: Use an order-total calculation where the learner adds a new `5000円以上送料無料` rule while preserving the existing 500円 shipping behavior below the threshold.
Reason: The task is small enough for a checkpoint, clearly demonstrates specification change work, and can be validated with stdout grading across old and new behavior.
Alternatives: Add a larger multi-file feature request; require learners to update visible tests; defer specification changes until a richer project UI. These were rejected because they would broaden P5-03 beyond the current stable architecture.
Risk: The exercise still uses a single visible editor even though project metadata includes a support test file. Future P5-04/P5-05 work should expand test/refactoring affordances without exposing hidden cases.

## 2026-09-05: Project Support Tests Display
Date: 2026-09-05
Context: P5-04 requires test-oriented tasks and learner-facing feedback, but the existing Lesson Workspace only displayed the editable starter source and grading results.
Decision: Display project exercise files in the Lesson Workspace, including read-only support test files, while keeping hidden grading cases only in `testCases`.
Reason: This makes test-oriented lessons learnable without changing execution architecture or adding a multi-file editor. Hidden inputs remain private because support files use visible examples only.
Alternatives: Wait for a full multi-file editor; put test snippets only in prose; expose grading hidden cases as test files. These were rejected because they either delay P5-04, reduce the value of test-oriented practice, or weaken hidden-test privacy.
Risk: Future project exercises must keep support files free of hidden values because the UI now renders them.
