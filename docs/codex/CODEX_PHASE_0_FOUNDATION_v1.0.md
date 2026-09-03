# Codex Instruction — Programming Trainer Phase 0 Foundation v1.0

## Goal
Create the Programming Trainer repository foundation only.

## Read first
Read completely:
- 00_PRODUCT_PLAN_v1.0.md
- 01_FEATURE_LIST_v1.0.md
- 02_SCREEN_LIST_AND_FLOW_v1.0.md
- 03_DB_DESIGN_v1.0.md
- 04_TECH_ARCHITECTURE_v1.0.md
- 05_DEVELOPMENT_ROADMAP_v1.0.md
- AGENTS.md

## Branch
Create/use:
codex/phase-0-foundation

Do not merge to main.

## In scope
- React + TypeScript + Vite foundation
- React Router
- basic PC layout shell
- Home placeholder
- Language Select placeholder
- Python level page placeholder
- Curriculum placeholder
- Lesson route placeholder
- History placeholder
- Settings placeholder
- test setup
- lint/typecheck
- Playwright setup if practical
- CI
- src domain/module directory structure
- repository interfaces
- LanguageRunner interface
- curriculum type definitions
- seed structure for Python grade 3
- documentation placement

## Out of scope
- Pyodide execution
- Monaco implementation
- IndexedDB implementation
- actual grading
- full Python curriculum
- cloud auth
- other language runners
- responsive mobile optimization

## Required architecture
Prefer:
src/
  app/
  routes/
  features/
    learning/
    editor/
    runner/
    grading/
    progress/
  content/
    python/grade-3/
  repositories/
  domain/
  workers/
  components/
  styles/

Do not force this exact structure if repository conventions strongly justify another, but preserve separation of concerns.

## Acceptance
- npm install succeeds
- npm run lint succeeds
- npm run typecheck succeeds
- npm test succeeds
- npm run build succeeds
- app opens in Chrome
- app opens in Edge
- all MVP routes navigate without runtime error
- no Python execution is implemented yet

## Completion
Push branch and create Draft PR.
Do not merge.
Report per AGENTS.md.
