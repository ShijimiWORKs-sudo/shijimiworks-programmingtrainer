# Programming Trainer — Codex Start Here

## 推奨手順
1. 新規リポジトリを用意
2. このdocs一式をリポジトリへ配置
3. AGENTS.mdはリポジトリrootへ配置
4. Phase 0を実行
5. Phase 0を人間が確認
6. mainへマージ
7. Phase 1を実行
8. Python 3級MVPを実機確認

## 配置例
ProgrammingTrainer/
  AGENTS.md
  docs/
    product/
      00_PRODUCT_PLAN_v1.0.md
      01_FEATURE_LIST_v1.0.md
      02_SCREEN_LIST_AND_FLOW_v1.0.md
      03_DB_DESIGN_v1.0.md
      04_TECH_ARCHITECTURE_v1.0.md
      05_DEVELOPMENT_ROADMAP_v1.0.md
    codex/
      CODEX_PHASE_0_FOUNDATION_v1.0.md
      CODEX_PHASE_1_PYTHON_GRADE3_MVP_v1.0.md

## Codexへ最初に送る文
Programming Trainerの新規開発を開始します。

リポジトリ内のAGENTS.mdとdocs/product配下の設計書をすべて読み、
docs/codex/CODEX_PHASE_0_FOUNDATION_v1.0.md
に記載されたPhase 0だけを実行してください。

作業ブランチは:
codex/phase-0-foundation

今回はPhase 1以降の機能を実装しないでください。
完了後はmainへマージせず、branchへpushしDraft PRを作成して、
AGENTS.mdの形式で結果を報告してください。

## Phase 1で送る文
Phase 0がmainへ取り込まれた最新状態から作業してください。

AGENTS.mdとdocs/product配下の設計書を再確認し、
docs/codex/CODEX_PHASE_1_PYTHON_GRADE3_MVP_v1.0.md
に記載されたPhase 1だけを実装してください。

作業ブランチは:
codex/phase-1-python-grade3-mvp

今回はPython 3級MVP以外に範囲を広げないでください。
完了後はmainへマージせず、branchへpushしてDraft PRを作成し、
テスト結果とChrome/Edge確認結果を報告してください。
