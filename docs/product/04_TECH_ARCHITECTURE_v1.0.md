# Programming Trainer 技術構成 v1.0

## 1. 正式ターゲット
- Windows 11
- PC Web
- Chrome
- Edge
- 1280×720以上
- 1920×1080推奨

## 2. Frontend
推奨:
- React
- TypeScript
- Vite
- React Router
- CSS Modules または既存方針に沿うCSS
- Monaco Editor

理由:
- IDE型画面と相性が良い
- 型安全
- 今後の複数ランタイムAdapter化が容易

## 3. Python実行
- Pyodide
- Web Worker内で実行
- WorkerとUI間はmessage protocolで通信
- UI threadで直接長時間Pythonを実行しない

### Runner interface
LanguageRunner:
- initialize()
- run(request)
- cancel()
- reset()
- dispose()

RunRequest:
- sourceCode
- stdin
- timeoutMs

RunResult:
- status
- stdout
- stderr
- durationMs
- errorType

PythonRunnerがこのinterfaceを実装。

## 4. Editor
- Monaco Editor
- language=python
- automaticLayout
- font size setting
- tabSize
- minimap optional
- Ctrl+Enter = Run
- Ctrl+Shift+Enter = Grade を候補

## 5. 自動採点
GradingEngineはRunnerから分離する。

flow:
source code
  ↓
test_cases
  ↓
1 caseずつRunnerへ
  ↓
normalize
  ↓
compare
  ↓
TestResult[]
  ↓
GradeResult

Comparator初期:
- exact_text
- trimmed_text
- normalized_lines

将来:
- numeric
- unordered_lines
- structural

## 6. stdin
Pythonコード側のinput()を教材で利用可能にする。
Worker内でstdin供給方式を実装。
複数行入力をサポート。

## 7. 安全性
- browser sandbox内で実行
- 任意OS commandを実行させない
- local filesystemへ直接アクセスさせない
- network accessを教材要件にしない
- timeoutを必須
- infinite loop対策としてWorker terminate/recreate可能にする
- HTML描画にユーザーコードを直接innerHTMLしない

## 8. Persistence
MVP:
- IndexedDB

Repository:
- ProgressRepository
- AttemptRepository
- SettingsRepository

UIからIndexedDBを直接呼ばない。

## 9. 教材
推奨:
src/content/
  python/
    grade-3/
      curriculum.ts
      lessons/
      testcases/

UIコンポーネントに教材本文を直書きしない。

## 10. テスト
- Unit: Vitest
- Component: React Testing Library
- E2E: Playwright

最低限:
- grading comparator
- progress repository
- runner message handling
- curriculum navigation
- lesson completion
- reload persistence

## 11. CI
- npm install
- lint
- typecheck
- unit test
- build
- E2Eは環境が安定次第必須化

## 12. 拡張
将来Runner:
- JavaScriptRunner
- HtmlCssPreviewRunner
- JavaRunner
- CppRunner
- RubyRunner
- CommandSimulatorRunner
- PowerShellSimulatorRunner

UIはRunner実装詳細に依存しない。

## 13. 依存追加方針
Phase単位で必要最小限。
Codexは勝手な大規模ライブラリ追加をしない。
新規依存が必要なら理由を作業報告に記載。
