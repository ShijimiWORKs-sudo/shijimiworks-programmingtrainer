# Programming Trainer 開発ロードマップ v1.0

## Phase 0: Foundation / 設計固定
成果:
- 製品企画
- 機能一覧
- 画面設計
- DB設計
- 技術構成
- AGENTS.md
- repo初期化
- CI
- 基本routing
- layout shell

完了条件:
- main build成功
- Chrome/EdgeでHome表示
- lint/typecheck/test成功

## Phase 1: Python 3級 MVP Core
対象:
- Home
- Python選択
- 3級選択
- Curriculum
- Lesson Workspace
- Monaco
- Pyodide Worker
- Run
- stdin
- stdout/stderr
- Grade
- TestCase
- Hint
- Progress
- IndexedDB
- reload復元

教材:
最低3 Lessonを完全動作
1. print
2. 変数
3. input

データモデルはPython 3級10 Lessonを前提。

完了条件:
- Home→Lesson→実行→採点→合格→次Lesson
- infinite loopからUI復帰可能
- reload後にlast_code/progress復元
- Chrome/Edge確認
- tests green

## Phase 2: Python 3級 Curriculum Complete
- 10 Lesson
- if
- for
- while
- list
- dict
- function
- 各Lesson複数exercise
- hint品質
- error explanation
- chapter progress

## Phase 3: Python 3級 Challenge / Mock Exam
- 章末課題
- 模擬試験
- 制限時間
- 成績
- 苦手分析
- 復習導線

ここでPython 3級版をv1.0候補とする。

## Phase 4: Python 2級
- 関数深化
- class
- exception
- file相当の仮想I/O
- algorithm
- module
- debug task
- small project

## Phase 5: Python 1級
- multi-file project model
- bug fix
- specification change
- tests
- refactoring
- practical modification tasks

## Phase 6: JavaScript
- JS runner
- console
- test grading
- grade 3→2→1

## Phase 7: HTML/CSS
- split editor
- live preview
- DOM/style validator
- responsive課題
- grade 3→2→1

## Phase 8: Java
- runner infrastructure
- compile/run
- grade 3→2→1

## Phase 9: C++
- compile/run infrastructure
- grade 3→2→1

## Phase 10: Ruby
- runner
- grade 3→2→1

## Phase 11: Windows Command
- virtual terminal
- virtual filesystem
- command grading
- grade 3→2→1

## Phase 12: PowerShell
- virtual PowerShell-like training environment
- pipeline exercises
- filesystem exercises
- grade 3→2→1

## Phase 13: Cross-language Learning Analytics
- skill map
- weakness
- recommended next lesson
- streak optional
- learning time

## Phase 14: Account / Cloud Sync
- authentication
- cloud persistence
- multi-device sync
- backup/restore
- curriculum migration

## Phase 15: Release Hardening
- accessibility
- performance
- security review
- browser matrix
- recovery
- content QA
- release documentation

## 完成の定義
- 9対象カテゴリの主要カリキュラム
- 3/2/1級体系
- 実行/プレビュー/仮想terminal
- 自動採点
- 進捗
- 模擬試験
- 分析
- account sync
- PC Web正式リリース
