# Programming Trainer DB構成 v1.0

## 1. 方針
MVPはローカルファースト。
教材マスタとユーザー学習データを分離する。

教材:
- 静的JSON/TypeScript seedを正本候補
- curriculum_versionを必須

ユーザーデータ:
- IndexedDBを第一候補
- repository層を経由し、将来クラウドDBへ交換可能にする

## 2. 主エンティティ

### languages
- id TEXT PK
- slug TEXT UNIQUE
- name TEXT
- display_order INTEGER
- status TEXT
- created_at TEXT
- updated_at TEXT

### levels
- id TEXT PK
- language_id TEXT
- code TEXT
- name TEXT
- display_order INTEGER
- status TEXT

### courses
- id TEXT PK
- language_id TEXT
- level_id TEXT
- title TEXT
- description TEXT
- curriculum_version TEXT

### chapters
- id TEXT PK
- course_id TEXT
- title TEXT
- description TEXT
- display_order INTEGER

### lessons
- id TEXT PK
- chapter_id TEXT
- slug TEXT
- title TEXT
- objective TEXT
- explanation_md TEXT
- task_md TEXT
- starter_code TEXT
- sample_input TEXT
- sample_output TEXT
- difficulty INTEGER
- estimated_minutes INTEGER
- display_order INTEGER
- status TEXT

### lesson_hints
- id TEXT PK
- lesson_id TEXT
- hint_order INTEGER
- body_md TEXT

### exercises
- id TEXT PK
- lesson_id TEXT
- exercise_type TEXT
- prompt_md TEXT
- starter_code TEXT
- grading_mode TEXT
- timeout_ms INTEGER

### test_cases
- id TEXT PK
- exercise_id TEXT
- test_order INTEGER
- visibility TEXT  # public/hidden
- stdin TEXT
- expected_stdout TEXT
- comparator TEXT
- weight INTEGER

### user_profiles
- id TEXT PK
- display_name TEXT
- created_at TEXT
- updated_at TEXT

### lesson_progress
- id TEXT PK
- user_id TEXT
- lesson_id TEXT
- status TEXT  # not_started/in_progress/passed
- last_code TEXT
- run_count INTEGER
- grade_count INTEGER
- hint_count INTEGER
- first_started_at TEXT
- first_passed_at TEXT
- last_studied_at TEXT
- updated_at TEXT
UNIQUE(user_id, lesson_id)

### attempts
- id TEXT PK
- user_id TEXT
- lesson_id TEXT
- exercise_id TEXT
- source_code TEXT
- stdin TEXT
- execution_status TEXT
- stdout TEXT
- stderr TEXT
- passed INTEGER
- duration_ms INTEGER
- created_at TEXT

### attempt_test_results
- id TEXT PK
- attempt_id TEXT
- test_case_id TEXT
- passed INTEGER
- actual_stdout TEXT
- error_type TEXT
- duration_ms INTEGER

### app_settings
- user_id TEXT PK
- editor_theme TEXT
- editor_font_size INTEGER
- tab_size INTEGER
- updated_at TEXT

## 3. 将来同期に備える共通列
ユーザー生成データには将来:
- sync_status
- client_updated_at
- server_updated_at
- deleted_at
を追加可能なrepository設計にする。

## 4. ID規則
UUIDまたは安定した文字列ID。
教材マスタは人間可読ID推奨:
- lang_python
- level_python_3
- chapter_py3_01
- lesson_py3_01_print
- ex_py3_01_01

## 5. 教材version
最低限:
- curriculum_version
- valid_from
- valid_to(optional)

## 6. 初期seed
Python 3級10 Lesson分をseedする。
最初の実装では最低3 LessonをE2E可能にし、残りseedを順次追加してよい。
ただしデータモデルは10 Lessonを前提にする。
