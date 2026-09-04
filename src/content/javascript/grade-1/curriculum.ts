import type { Course } from "../../../domain/curriculum";

const bugFixStarterCode = "function normalizeName(name) {\n  return name;\n}\n\nfunction buildGreeting(name) {\n  const normalized = normalizeName(name);\n  return \"Hello, \" + name;\n}\n\nconst name = readline();\nconsole.log(buildGreeting(name));\n";

const specificationChangeStarterCode = "function shippingFee(total) {\n  return 500;\n}\n\nfunction orderTotal(total) {\n  return total + shippingFee(total);\n}\n\nconst total = Number(readline());\nconsole.log(orderTotal(total));\n";

const testOrientedStarterCode = "function parseScores(line) {\n  return line.split(\",\").map((part) => Number(part));\n}\n\nfunction passedCount(scores) {\n  return scores.length;\n}\n\nconst scores = parseScores(readline());\nconsole.log(passedCount(scores));\n";

const refactoringStarterCode = "const name1 = readline();\nconst score1 = Number(readline());\nconst name2 = readline();\nconst score2 = Number(readline());\n\nif (score1 >= 80) {\n  console.log(name1 + \":A\");\n} else {\n  console.log(name1 + \":B\");\n}\n\nif (score2 >= 80) {\n  console.log(name2 + \":A\");\n} else {\n  console.log(name2 + \":B\");\n}\n";

const courseId = "course_javascript_grade_1";
const chapterId = "chapter_javascript_grade_1_practical";

export const javascriptGrade1Course: Course = {
  id: courseId,
  languageId: "lang_javascript",
  levelId: "level_javascript_1",
  title: "JavaScript 1級",
  description: "既存コード修正、仕様変更、テスト志向、refactoringを扱うJavaScript 1級コースです。",
  curriculumVersion: "0.1.0",
  validFrom: "2026-09-05",
  chapters: [
    {
      id: chapterId,
      courseId,
      title: "JavaScript 1級 Practical Maintenance",
      description: "実務に近い既存コードの修正から始めるChapterです。",
      order: 1,
      lessons: [
        {
          id: "lesson_js1_01_bug_fix",
          chapterId,
          slug: "bug-fix",
          title: "Lesson 01: bug fix",
          objective: "既存コードの意図を読み、入力の空白と表示名のbugを修正する。",
          explanationMd: "1級では、0から書くだけでなく、すでにあるコードを読み、仕様と実装のずれを小さく直します。今回のbugは、名前の前後の空白を取り除いた値を作っているのに、出力では元の値を使ってしまう点です。",
          taskMd: "normalizeName(name) は前後の空白を取り除いた名前を返してください。buildGreeting(name) はnormalize後の名前を使い、`Hello, <name>` を返してください。",
          starterCode: bugFixStarterCode,
          sampleInput: "  Aki  \n",
          sampleOutput: "Hello, Aki\n",
          constraints: ["normalizeName(name) 関数を残してください。", "trim() を使って名前の前後の空白を取り除いてください。", "buildGreeting(name) はnormalizeされた値を使ってください。", "出力は greeting 1行だけにしてください。"],
          difficulty: 4,
          estimatedMinutes: 18,
          order: 1,
          status: "published",
          hints: ["name.trim() は文字列の前後にある空白を取り除きます。", "buildGreeting の中では normalized という変数がすでに作られています。", "return \"Hello, \" + normalized のように、修正済みの値を返しましょう。"],
          exercises: [
            {
              id: "ex_js1_01_01",
              lessonId: "lesson_js1_01_bug_fix",
              type: "code",
              promptMd: "既存コードを読み、名前の正規化結果をgreetingへ反映するbugを修正します。",
              starterCode: bugFixStarterCode,
              project: {
                entryFilePath: "main.js",
                files: [
                  { path: "main.js", language: "javascript", content: bugFixStarterCode, editable: true, purpose: "entry" },
                  { path: "tests/greeting.test.js", language: "javascript", content: "console.assert(normalizeName(\"  Aki  \") === \"Aki\");\nconsole.assert(buildGreeting(\" Mika \") === \"Hello, Mika\");\n", editable: false, purpose: "test" },
                ],
              },
              gradingMode: "stdout",
              timeoutMs: 3000,
              completionCriteria: "前後に空白がある名前でも、空白を取り除いたgreetingを出力する。",
              testCases: [
                { id: "tc_js1_01_public", order: 1, visibility: "public", stdin: "  Aki  \n", expectedStdout: "Hello, Aki\n", comparator: "trimmed_text", weight: 1, required: true },
                { id: "tc_js1_01_hidden", order: 2, visibility: "hidden", stdin: "\tRen \n", expectedStdout: "Hello, Ren\n", comparator: "trimmed_text", weight: 1, required: true },
              ],
            },
          ],
        },
        {
          id: "lesson_js1_02_specification_change",
          chapterId,
          slug: "specification-change",
          title: "Lesson 02: specification change",
          objective: "既存の注文計算へ新しい送料仕様を追加し、古い動作も保つ。",
          explanationMd: "仕様変更では、今ある動きを壊さずに新しい条件を足します。今回は、これまで全注文に送料500円を足していた処理へ、注文金額が5000円以上なら送料を0円にする新仕様を追加します。",
          taskMd: "shippingFee(total) を変更し、total が5000以上なら0、それ以外なら500を返してください。orderTotal(total) は shippingFee(total) を使い、注文金額と送料を足した合計を返してください。",
          starterCode: specificationChangeStarterCode,
          sampleInput: "6000\n",
          sampleOutput: "6000\n",
          constraints: ["shippingFee(total) 関数を残してください。", "total が5000以上の場合は送料0円にしてください。", "total が5000未満の場合はこれまで通り送料500円にしてください。", "orderTotal(total) は shippingFee(total) を呼び出して合計を計算してください。"],
          difficulty: 4,
          estimatedMinutes: 18,
          order: 2,
          status: "published",
          hints: ["条件分岐は if (total >= 5000) の形で書けます。", "送料だけを shippingFee で決めると、orderTotal の役割を小さく保てます。", "古い仕様の500円送料も残すため、最後は return 500 にしましょう。"],
          exercises: [
            {
              id: "ex_js1_02_01",
              lessonId: "lesson_js1_02_specification_change",
              type: "code",
              promptMd: "既存の注文合計計算へ、5000円以上送料無料という仕様変更を追加します。",
              starterCode: specificationChangeStarterCode,
              project: {
                entryFilePath: "main.js",
                files: [
                  { path: "main.js", language: "javascript", content: specificationChangeStarterCode, editable: true, purpose: "entry" },
                  { path: "tests/order-total.test.js", language: "javascript", content: "console.assert(shippingFee(1200) === 500);\nconsole.assert(shippingFee(7000) === 0);\nconsole.assert(orderTotal(7000) === 7000);\n", editable: false, purpose: "test" },
                ],
              },
              gradingMode: "stdout",
              timeoutMs: 3000,
              completionCriteria: "5000円未満と5000円以上の注文で、新しい送料仕様に沿った合計を出力する。",
              testCases: [
                { id: "tc_js1_02_public_free_shipping", order: 1, visibility: "public", stdin: "6000\n", expectedStdout: "6000\n", comparator: "trimmed_text", weight: 1, required: true },
                { id: "tc_js1_02_public_standard_shipping", order: 2, visibility: "public", stdin: "1200\n", expectedStdout: "1700\n", comparator: "trimmed_text", weight: 1, required: true },
                { id: "tc_js1_02_hidden_free_shipping", order: 3, visibility: "hidden", stdin: "5100\n", expectedStdout: "5100\n", comparator: "trimmed_text", weight: 1, required: true },
              ],
            },
          ],
        },
        {
          id: "lesson_js1_03_test_oriented",
          chapterId,
          slug: "test-oriented",
          title: "Lesson 03: test-oriented task",
          objective: "公開されているテストを読み、期待される振る舞いから実装を直す。",
          explanationMd: "テスト志向のtaskでは、説明文だけでなくテストコードも仕様の一部として読みます。テストが示す入力、境界値、期待値を手がかりに、関数の責務を小さく保ちながら実装を直します。",
          taskMd: "tests/scores.test.js の期待を満たすように、parseScores(line) と passedCount(scores) を修正してください。カンマ区切りの点数から数値だけを読み取り、70点以上の点数の個数を出力します。",
          starterCode: testOrientedStarterCode,
          sampleInput: "80,65,90\n",
          sampleOutput: "2\n",
          constraints: ["parseScores(line) 関数を残してください。", "数値へ変換できない値は無視してください。", "passedCount(scores) は70点以上の点数だけを数えてください。", "出力は合格点数の個数を1行にしてください。"],
          difficulty: 4,
          estimatedMinutes: 20,
          order: 3,
          status: "published",
          hints: ["line.split(\",\") でカンマ区切りの値を1つずつ見られます。", "Number(part) の結果が NaN かどうかは Number.isNaN(number) で確認できます。", "passedCount では score >= 70 の値だけを数えましょう。"],
          exercises: [
            {
              id: "ex_js1_03_01",
              lessonId: "lesson_js1_03_test_oriented",
              type: "code",
              promptMd: "表示されているテストを読み、点数集計の期待動作を満たすように既存コードを修正します。",
              starterCode: testOrientedStarterCode,
              project: {
                entryFilePath: "main.js",
                files: [
                  { path: "main.js", language: "javascript", content: testOrientedStarterCode, editable: true, purpose: "entry" },
                  { path: "tests/scores.test.js", language: "javascript", content: "console.assert(JSON.stringify(parseScores(\"80,65,90\")) === JSON.stringify([80, 65, 90]));\nconsole.assert(passedCount([80, 65, 90]) === 2);\nconsole.assert(passedCount([70, 69, 71]) === 2);\n", editable: false, purpose: "test" },
                ],
              },
              gradingMode: "stdout",
              timeoutMs: 3000,
              completionCriteria: "有効な数値だけを点数として扱い、70点以上の件数を正しく出力する。",
              testCases: [
                { id: "tc_js1_03_public_mixed_scores", order: 1, visibility: "public", stdin: "80,65,90\n", expectedStdout: "2\n", comparator: "trimmed_text", weight: 1, required: true },
                { id: "tc_js1_03_public_boundary", order: 2, visibility: "public", stdin: "70,69,71\n", expectedStdout: "2\n", comparator: "trimmed_text", weight: 1, required: true },
                { id: "tc_js1_03_hidden_invalid_values", order: 3, visibility: "hidden", stdin: "100,no,40,75\n", expectedStdout: "2\n", comparator: "trimmed_text", weight: 1, required: true },
              ],
            },
          ],
        },
        {
          id: "lesson_js1_04_refactoring",
          chapterId,
          slug: "refactoring",
          title: "Lesson 04: refactoring",
          objective: "重複した判定処理を関数へ切り出し、外から見える出力を保つ。",
          explanationMd: "refactoring は、動きを変えずにコードの形を良くする作業です。重複している条件分岐を関数へ切り出すと、仕様変更やテスト追加に強いコードになります。",
          taskMd: "2人分の成績ラベル出力を、labelGrade(name, score) 関数へ切り出してください。score が80以上なら `name:A`、それ以外なら `name:B` を返し、最終的な2行の出力は元の仕様と同じにしてください。",
          starterCode: refactoringStarterCode,
          sampleInput: "Aki\n82\nRen\n71\n",
          sampleOutput: "Aki:A\nRen:B\n",
          constraints: ["labelGrade(name, score) 関数を定義してください。", "labelGrade は文字列を return してください。", "80点以上は A、それ以外は B としてください。", "console.log は2人分の結果を1行ずつ出力してください。"],
          difficulty: 4,
          estimatedMinutes: 18,
          order: 4,
          status: "published",
          hints: ["まず score >= 80 の条件分岐を関数の中へ移します。", "関数は console.log ではなく return name + \":A\" のように文字列を返すと使い回しやすくなります。", "最後は console.log(labelGrade(name1, score1)) と console.log(labelGrade(name2, score2)) の2回にできます。"],
          exercises: [
            {
              id: "ex_js1_04_01",
              lessonId: "lesson_js1_04_refactoring",
              type: "code",
              promptMd: "重複した成績ラベル処理を関数へ切り出し、同じ出力を保つようにrefactoringします。",
              starterCode: refactoringStarterCode,
              project: {
                entryFilePath: "main.js",
                files: [
                  { path: "main.js", language: "javascript", content: refactoringStarterCode, editable: true, purpose: "entry" },
                  { path: "tests/label-grade.test.js", language: "javascript", content: "console.assert(labelGrade(\"Aki\", 82) === \"Aki:A\");\nconsole.assert(labelGrade(\"Ren\", 71) === \"Ren:B\");\nconsole.assert(labelGrade(\"Mio\", 80) === \"Mio:A\");\n", editable: false, purpose: "test" },
                ],
              },
              gradingMode: "stdout",
              timeoutMs: 3000,
              completionCriteria: "重複を関数へ切り出した上で、複数の名前と点数に対して同じラベル出力を保つ。",
              testCases: [
                { id: "tc_js1_04_public_basic", order: 1, visibility: "public", stdin: "Aki\n82\nRen\n71\n", expectedStdout: "Aki:A\nRen:B\n", comparator: "trimmed_text", weight: 1, required: true },
                { id: "tc_js1_04_public_boundary", order: 2, visibility: "public", stdin: "Mio\n80\nKen\n79\n", expectedStdout: "Mio:A\nKen:B\n", comparator: "trimmed_text", weight: 1, required: true },
                { id: "tc_js1_04_hidden_names", order: 3, visibility: "hidden", stdin: "Nia\n95\nKai\n60\n", expectedStdout: "Nia:A\nKai:B\n", comparator: "trimmed_text", weight: 1, required: true },
              ],
            },
          ],
        },
      ],
      challenges: [],
    },
  ],
  mockExams: [],
};
