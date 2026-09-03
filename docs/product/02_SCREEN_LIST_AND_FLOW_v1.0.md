# Programming Trainer 画面一覧・画面遷移 v1.0

## 1. 画面一覧

### SCR-001 Home
表示:
- 続きから学習
- 言語一覧
- 全体進捗
- 最近の学習

遷移:
- Language Select
- Learning History
- Settings

### SCR-010 Language Select
- Python
- Java
- C++
- Ruby
- JavaScript
- HTML/CSS
- Command
- PowerShell

MVPではPythonのみ有効。
他言語は「準備中」表示可。

### SCR-020 Level Select
- 3級
- 2級
- 1級

MVPではPython 3級のみ有効。

### SCR-030 Curriculum
- Chapter一覧
- Lesson一覧
- status
- progress
- last studied

### SCR-040 Lesson Workspace
PC横長の主画面。

左ペイン:
- Lessonタイトル
- 学習目標
- 説明
- 課題
- 入力例
- 出力例
- 制約
- ヒント

右ペイン:
- Monaco Editor

下部:
- 入力欄
- 実行
- 採点
- リセット
- 実行結果
- 採点結果

### SCR-041 Lesson Complete Dialog
- 合格
- 試行回数
- 次Lesson
- 解説を見る
- Curriculumへ戻る

### SCR-050 Chapter Challenge
章末課題。

### SCR-060 Mock Exam
模擬試験。

### SCR-070 Result
- score
- pass/fail
- 分野別結果
- 復習候補

### SCR-080 Learning History
- 日付
- 言語
- Lesson
- 状態
- 試行回数

### SCR-090 Settings
- Editor font size
- tab size
- theme
- reset local data

## 2. MVP画面遷移

Home
  ↓
Language Select
  ↓ Python
Level Select
  ↓ 3級
Curriculum
  ↓
Lesson Workspace
  ├→ Run
  ├→ Grade
  ├→ Hint
  └→ Lesson Complete
        ├→ Next Lesson
        └→ Curriculum

## 3. URL案
/
 /languages
 /languages/python
 /languages/python/grade-3
 /languages/python/grade-3/lessons/:lessonId
 /history
 /settings

将来:
 /languages/:languageId/:levelId/challenges/:id
 /languages/:languageId/:levelId/mock-exam/:id

## 4. Lesson Workspace レイアウト
1280×720以上:
- Header: 56px
- Main: 2 columns
- Left: 38%
- Right: 62%
- Bottom consoleは右ペイン内または全幅切替

1920×1080:
- 左説明 35%
- 右IDE 65%
- Console高さ30%程度

## 5. UXルール
- 実行と採点を分ける
- 採点前でも自由に何度でも実行可能
- 正解コードは初期状態では表示しない
- Hintは段階表示
- Lesson合格後に解説を明示
- エラー文は消さずに確認できる
- ページ移動時に編集中コードを保存
