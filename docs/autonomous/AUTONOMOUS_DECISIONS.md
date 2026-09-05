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

## 2026-09-05: Refactoring Task As Behavior-Preserving Helper Extraction
Date: 2026-09-05
Context: P5-05 requires refactoring practice, but the current grader validates program behavior rather than AST structure.
Decision: Use duplicated grade-label printing as the first refactoring task and validate preserved behavior with public and hidden stdout tests, while visible support tests name the extracted `label_grade` helper.
Reason: This gives learners a concrete refactoring target and keeps the checkpoint inside the stable grading architecture.
Alternatives: Add AST/static checks for function extraction; build a separate refactoring exercise type; accept behavior-only refactoring with no visible helper tests. These were rejected because they either broaden scope or make the refactoring intent too weak.
Risk: The grader cannot yet prove the learner actually removed duplication. Future advanced grading can add structural checks without invalidating the behavioral contract.

## 2026-09-05: JavaScript Runner Worker Sandbox Scope
Date: 2026-09-05
Context: P6-01 requires JavaScript execution behind `LanguageRunner` with stdout capture, timeout recovery, and no new dependency unless clearly needed.
Decision: Execute JavaScript in a dedicated browser Web Worker with a small `new Function` runtime, capture `console.log`, expose `readline()` / `input()`, shadow obvious browser/global/network APIs in the runner function parameters, and terminate/recreate the worker for timeout and cancel recovery.
Reason: This keeps JavaScript execution browser-contained, preserves the existing runner architecture, avoids host OS execution, and provides the smallest useful foundation for the JavaScript curriculum.
Alternatives: Add a hardened SES-style sandbox dependency now; run learner JavaScript on the main UI thread; delay execution until curriculum content exists. These were rejected because they either broaden P6-01, risk UI blocking, or fail the foundation acceptance condition.
Risk: This is not a complete hardened JavaScript security sandbox against every language escape pattern. Before broad untrusted JavaScript project tasks, Release Hardening or a future JavaScript checkpoint should revisit whether a stronger isolation layer is required.

## 2026-09-05: Mock Exam E2E Problem Switch Readiness Wait
Date: 2026-09-05
Context: During the P6-01 full E2E gate, Edge intermittently timed out in the mock exam review-suggestion test after switching from Problem 1 to Problem 2. The page showed Problem 2, but the editor value could still be the old problem value or be overwritten by delayed problem-state recovery.
Decision: Add the same explicit wait already used in the passing mock exam shell test: after clicking `次の問題`, wait until the editor contains Problem 2 starter code before setting the test answer.
Reason: The test should validate mock exam grading and hidden-detail behavior, not race the asynchronous editor/session recovery after problem switching.
Alternatives: Increase global test timeouts; retry the whole test; weaken the result assertions. These were rejected because they do not address the actual readiness condition.
Risk: The helper remains a dev-only test surface. Future editor state changes should keep the readiness hook aligned with visible workspace recovery.

## 2026-09-05: JavaScript Grade 3 Mirrors Python Grade 3 Fundamentals
Date: 2026-09-05
Context: P6-02 requires a JavaScript 3級 curriculum, but product docs do not enumerate JavaScript-specific lesson titles or challenge/mock exam scope.
Decision: Create 10 JavaScript 3級 lessons that mirror the proven Python 3級 fundamentals: output, variables, input, operators, `if`, `for`, `while`, arrays, objects, and functions. Keep challenge and mock exam entities empty for JavaScript in this checkpoint.
Reason: This provides a complete beginner JavaScript run/grade/progress path while staying inside the P6-02 curriculum scope and reusing the existing chapter progress model.
Alternatives: Add only three smoke lessons; add JavaScript challenge/mock exam immediately; invent a different grade structure. These were rejected because they either under-deliver the grade path or expand beyond the active checkpoint.
Risk: The JavaScript 3級 content is intentionally foundational. Future content QA can tune wording and add richer exercises without changing the route/progress contract.

## 2026-09-05: JavaScript Grade 2 Scope Without File I/O
Date: 2026-09-05
Context: P6-03 requires JavaScript 2級 lessons, while the current JavaScript runner provides console/stdin execution but does not include a virtual file model.
Decision: Use JavaScript-native 2級 tasks for functions, classes, `throw`/`try`/`catch`, array methods, algorithm debugging, and a small in-memory project. Keep file I/O out of JavaScript 2級 until a JavaScript virtual file model exists.
Reason: This preserves the current browser-worker runner contract, avoids inventing file APIs mid-checkpoint, and still gives learners a complete Grade 2 progression.
Alternatives: Emulate `localStorage` or virtual files in the JavaScript runner now; copy the Python virtual file lesson directly; omit the practical small project. These were rejected because they either broaden P6-03 or leave the level less useful.
Risk: JavaScript 2級 differs from Python 2級's file I/O checkpoint. A future JavaScript or release-hardening pass can add a dedicated virtual storage exercise if the product wants parity.

## 2026-09-05: JavaScript Grade 1 Mirrors Practical Maintenance Tasks
Date: 2026-09-05
Context: P6-04 requires JavaScript 1級 practical tasks, but the product docs do not define JavaScript-specific 1級 lesson scenarios.
Decision: Mirror the proven Python 1級 practical maintenance structure with JavaScript-specific code: bug fix, specification change, test-oriented repair, and behavior-preserving refactoring. Use visible project support files as learner guidance while grading through the existing stdout runner.
Reason: This creates a complete grade path quickly, reuses established product semantics, and keeps the checkpoint inside the stable single-entry-file Lesson Workspace.
Alternatives: Build a full JavaScript multi-file execution harness now; invent unrelated advanced browser/API tasks; leave JavaScript 1級 as planned. These were rejected because they broaden scope or fail P6-04 acceptance.
Risk: Visible support files are instructional and not executed by the runner yet. Future advanced JavaScript project phases can add multi-file execution without invalidating these stdout-graded tasks.

## 2026-09-05: HTML/CSS Preview Progress Snapshot in LessonProgress.lastCode
Date: 2026-09-05
Context: P7-01 needs two editable files, `index.html` and `styles.css`, while the existing lesson progress model persists one `lastCode` string per lesson and no HTML/CSS grading model exists yet.
Decision: Serialize the HTML/CSS file snapshot into `LessonProgress.lastCode` with a `programming-trainer:html-css:v1` prefix and parse older plain-string values as HTML fallback.
Reason: This keeps P7-01 inside the existing repository contract, avoids a database migration, and gives reload persistence for both editors immediately.
Alternatives: Add a new IndexedDB store for multi-file snapshots; migrate `LessonProgress.lastCode` to structured data; persist only HTML and reset CSS on reload. These were rejected because they add unnecessary migration risk or fail the split-editor persistence expectation.
Risk: Future multi-file languages may need a first-class structured progress model. The prefixed format isolates this HTML/CSS snapshot so it can be migrated later without corrupting older single-file lesson progress.

## 2026-09-05: HTML DOM Validator Uses GradeResult-Compatible Output
Date: 2026-09-05
Context: P7-02 requires HTML structure grading, but the existing grading UI, progress checkpointing, and attempt recording are built around `GradeResult` and stdout-based test case result rows.
Decision: Add `html_dom` grading mode and DOM requirement metadata, then return DOM validation results through the existing `GradeResult` shape with `dom:` test result IDs.
Reason: This keeps lesson progress, hidden-result display rules, and attempt history consistent without forcing a broad grading UI rewrite before CSS validation.
Alternatives: Create a separate HTML/CSS result domain and duplicate result UI; run learner HTML in the preview iframe to inspect DOM; postpone progress/attempt persistence for HTML/CSS. These were rejected because they either broaden scope, weaken the sandbox boundary, or leave grading less resumable.
Risk: `GradeResult` now represents both stdout execution and static DOM validation. Result explanation code checks `dom:` IDs so beginner-facing messages stay accurate, but future validators should avoid overloading stdout terms further.

## 2026-09-05: CSS Style Validator Uses Browser CSSOM
Date: 2026-09-05
Context: P7-03 requires CSS and responsive validation. The app already creates a sandboxed preview iframe, but grading should not depend on executing learner scripts or granting preview script permissions.
Decision: Parse learner CSS through a temporary `style` element and inspect CSSOM rules for selector/property/value requirements, including nested media-query rules.
Reason: CSSOM parsing validates the CSS source with browser semantics, keeps grading independent from preview execution, avoids new dependencies, and preserves the `sandbox=""` preview boundary.
Alternatives: Use a new CSS parser dependency; inspect computed styles inside the preview iframe; validate CSS with string includes only. These were rejected because they add dependency surface, couple grading to iframe access, or make style validation too brittle.
Risk: CSSOM declaration checks validate authored declarations, not every cascade/computed-style outcome. Future responsive tasks may need viewport-specific computed-style assertions, but this checkpoint establishes the safe requirement model.

## 2026-09-05: HTML/CSS Grade 3-1 Uses Static Project Seeds
Date: 2026-09-05
Context: P7-04 requires complete HTML/CSS grade 3, 2, and 1 curricula. The existing HTML/CSS workspace already supports split `index.html` / `styles.css` editing, sandbox preview, DOM validation, style validation, progress persistence, and attempts.
Decision: Add shared static curriculum seed helpers and represent each HTML/CSS lesson as one project-backed split-editor exercise with DOM and style requirements. Grade 3 mirrors beginner fundamentals, Grade 2 focuses on layout/components, and Grade 1 mirrors practical maintenance tasks.
Reason: This completes the learnable HTML/CSS path while preserving the existing safe preview/grading architecture and avoiding a new editor, runner, dependency, or persistence migration during P7-04.
Alternatives: Build a separate HTML/CSS multi-exercise editor now; add screenshot or computed-style grading; leave Grade 2/1 as planned placeholders. These were rejected because they either broaden the checkpoint or fail the Phase 7 curriculum acceptance.
Risk: Current style validation checks authored declarations through CSSOM rather than full visual screenshot equivalence. Future content QA or release hardening can add richer visual assertions without changing these lesson routes.
