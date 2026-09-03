# Codex Instruction — Programming Trainer Phase 1 Python Grade 3 MVP v1.0

## Mission
Implement one complete vertical learning slice for Python grade 3.

The user must be able to:
Home
→ Python
→ 3級
→ Curriculum
→ Lesson
→ write code
→ run Python
→ enter stdin
→ see stdout/stderr
→ grade against test cases
→ use hints
→ pass
→ save progress
→ reload
→ continue.

## Read first
Read completely:
- AGENTS.md
- 00_PRODUCT_PLAN_v1.0.md
- 01_FEATURE_LIST_v1.0.md
- 02_SCREEN_LIST_AND_FLOW_v1.0.md
- 03_DB_DESIGN_v1.0.md
- 04_TECH_ARCHITECTURE_v1.0.md
- 05_DEVELOPMENT_ROADMAP_v1.0.md

Also inspect the current repository before modifying it.

## Branch
Create/use:
codex/phase-1-python-grade3-mvp

Do not merge to main.

## Scope

### 1. Navigation
Implement production-quality:
- Home
- Language Select
- Python level selection
- Python 3級 Curriculum
- Lesson Workspace
- History
- Settings basic page

Other languages may appear disabled/準備中.

### 2. Python grade 3 initial lessons
Implement at least these 3 fully:
1. print / output
2. variables
3. input

Each needs:
- objective
- explanation
- task
- starter code
- sample input/output when relevant
- at least 1 hint
- public tests
- at least 1 hidden test where meaningful
- completion criteria

Prepare data structure for remaining 7 lessons but do not invent large unfinished UI.

### 3. Monaco Editor
Implement Monaco for Python.
Requirements:
- Python syntax highlighting
- line numbers
- automatic layout
- configurable font size
- tab size
- reset to starter code
- preserve edited code per lesson

### 4. Pyodide
Implement Python execution with Pyodide inside a Web Worker.

Do not run arbitrary Python on the host OS.
Do not run long Python directly on React main thread.

Required:
- runtime initialization state
- run request
- stdin support for input()
- stdout
- stderr
- syntax/runtime errors
- duration
- timeout
- cancel/recovery
- Worker recreate after forced termination where needed

Use a versioned stable Pyodide dependency/source. Do not use unversioned dev CDN URLs in deployed code.

### 5. Runner abstraction
Keep Python implementation behind LanguageRunner or equivalent.

UI must not import Pyodide APIs directly.

### 6. Grading
Create GradingEngine separate from PythonRunner.

Initial comparator:
- exact_text
- trimmed_text
- normalized_lines

For each case show:
- pass/fail
- input when public
- expected when public
- actual output when appropriate
- error state

Hidden tests must not expose expected answers before/after grading beyond useful pass/fail feedback.

### 7. Persistence
Use IndexedDB through repositories.

Persist:
- lesson status
- last code
- run count
- grade count
- hint count
- timestamps
- attempts/results as reasonable for MVP
- settings

Reload must restore:
- last lesson progress
- last code
- passed status

Do not make React components directly issue IndexedDB calls.

### 8. UX
Run and Grade are separate actions.
Buttons:
- 実行
- 採点
- ヒント
- リセット

Display:
- runtime loading
- running
- timeout
- stdout
- stderr
- grade results

On pass:
- mark Lesson passed
- show completion UI
- allow Next Lesson
- preserve ability to reopen Lesson

### 9. PC Web acceptance
Verify:
- Chrome
- Edge
- 1280×720
- 1920×1080 if available

Keyboard use must be practical.
Do not optimize for phone in this Phase.

### 10. Tests
Add tests for:
- output comparator
- normalized comparator
- lesson progress repository
- grading aggregation
- runner protocol/message handling
- navigation
- pass updates progress
- reload restores last code

E2E happy path:
Home → Python → 3級 → Lesson 1 → edit → Run → Grade → Pass.

Add timeout/recovery test if practical.

## Explicit out of scope
- Python grade 2/1
- complete 10-lesson content production
- mock exam
- chapter challenge
- AI tutor
- cloud account
- sync
- Java
- C++
- Ruby
- JavaScript runner
- HTML/CSS preview
- Command
- PowerShell
- billing
- rankings
- social features

## Do not do
- no unrelated refactor
- no redesign of all routes if existing routing works
- no server-side arbitrary code execution
- no disabling TypeScript checks
- no skipping failing tests by deleting them
- no huge design system addition
- no main merge

## Definition of Done
All must be true:
1. User can complete Lesson 1 end-to-end.
2. Lessons 2 and 3 also run and grade.
3. Python executes in Worker.
4. infinite/long execution can recover without permanent UI freeze.
5. stdin works for input().
6. stdout/stderr work.
7. grading supports multiple tests.
8. last code and progress survive reload.
9. lint passes.
10. typecheck passes.
11. tests pass.
12. build passes.
13. Chrome manual check passes.
14. Edge manual check passes or exact blocker is reported.
15. no future-phase features were implemented unnecessarily.

## Completion procedure
- Commit logically.
- Push codex/phase-1-python-grade3-mvp.
- Create Draft PR.
- Do not merge main.
- Final report:
  1. Summary
  2. Changed files
  3. Architecture
  4. Lesson content implemented
  5. Test results
  6. Manual Chrome/Edge results
  7. Known limitations
  8. Added dependencies
  9. Commit hash
  10. Draft PR URL
