# Python 3級 v1.0 Candidate

Updated: 2026-09-04 23:04 +09:00

## Scope
- Python 3級 curriculum contains 10 published lessons covering print, variables, input, types/operators, if, for, while, list, dict, and functions.
- Lesson Workspace supports run, grade, staged hints, public/hidden tests, per-exercise progress, last code persistence, and reload recovery.
- Chapter Progress shows completed lesson count, status breakdown, and percent complete on the Curriculum screen.
- Chapter Challenge provides a graded review task with progress persistence and hidden-test-safe feedback.
- Mock Exam provides start, pause, resume, timer display, problem navigation, answer persistence, final scoring, pass/fail, result view, and source-lesson review suggestions.

## Verification Gate
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed.
- `npm run build`: passed.
- `npm run test:e2e -- --project=chrome --project=edge`: passed.
- `npm audit --audit-level=low --fetch-timeout=600000 --fetch-retries=2`: passed with 0 vulnerabilities.

## Security Notes
- Hidden lesson, challenge, and mock exam tests do not display stdin, expected stdout, actual stdout, stderr, or hidden test identifiers in learner-facing UI.
- User Python continues to execute through the browser Pyodide worker behind the `LanguageRunner` abstraction.
- Timeout/cancel recovery remains covered by runner and E2E regression tests.
- Progress and result data stay local-first in IndexedDB.

## Known Limitations
- Python 3級 currently has one chapter challenge and one trial mock exam.
- Mock exam review suggestions use source lesson links rather than a full skill taxonomy; deeper analytics are planned for later phases.
- Python 2級/1級 and non-Python languages remain planned work.
- Cloud sync, account sign-in, backup/restore, favorites, and streak/time analytics remain future phases.
- Vite build still reports large Monaco/Pyodide chunks; this is recorded for release hardening performance review.
