import type { Course } from "../../../domain/curriculum";

const starterCode = "def normalize_name(name):\n    return name\n\n\ndef build_greeting(name):\n    normalized = normalize_name(name)\n    return \"Hello, \" + name\n\nname = input()\nprint(build_greeting(name))\n";

const courseId = "course_python_grade_1";

export const pythonGrade1Course: Course = {
  id: courseId,
  languageId: "lang_python",
  levelId: "level_python_1",
  title: "Python 1級",
  description: "既存コード修正、仕様変更、テスト志向、refactoringを扱うPython 1級コースです。",
  curriculumVersion: "0.1.0",
  validFrom: "2026-09-05",
  chapters: [
    {
      id: "chapter_python_grade_1_practical",
      courseId,
      title: "Python 1級 Practical Maintenance",
      description: "実務に近い既存コードの修正から始めるChapterです。",
      order: 1,
      lessons: [
        {
          id: "lesson_py1_01_bug_fix",
          chapterId: "chapter_python_grade_1_practical",
          slug: "bug-fix",
          title: "Lesson 01: bug fix",
          objective: "既存コードの意図を読み、入力の空白と表示名のbugを修正する。",
          explanationMd: "1級では、0から書くだけでなく、すでにあるコードを読み、仕様と実装のずれを小さく直します。今回のbugは、名前の前後の空白を取り除いた値を作っているのに、出力では元の値を使ってしまう点です。",
          taskMd: "normalize_name(name) は前後の空白を取り除いた名前を返してください。build_greeting(name) はnormalize後の名前を使い、`Hello, <name>` を返してください。",
          starterCode,
          sampleInput: "  Aki  \n",
          sampleOutput: "Hello, Aki\n",
          constraints: [
            "normalize_name(name) 関数を残してください。",
            "strip() を使って名前の前後の空白を取り除いてください。",
            "build_greeting(name) はnormalizeされた値を使ってください。",
            "出力は greeting 1行だけにしてください。",
          ],
          difficulty: 4,
          estimatedMinutes: 18,
          order: 1,
          status: "published",
          hints: [
            "name.strip() は文字列の前後にある空白を取り除きます。",
            "build_greeting の中では normalized という変数がすでに作られています。",
            "return \"Hello, \" + normalized のように、修正済みの値を返しましょう。",
          ],
          exercises: [
            {
              id: "ex_py1_01_01",
              lessonId: "lesson_py1_01_bug_fix",
              type: "code",
              promptMd: "既存コードを読み、名前の正規化結果をgreetingへ反映するbugを修正します。",
              starterCode,
              project: {
                entryFilePath: "main.py",
                files: [
                  {
                    path: "main.py",
                    language: "python",
                    content: starterCode,
                    editable: true,
                    purpose: "entry",
                  },
                  {
                    path: "tests/test_greeting.py",
                    language: "python",
                    content: "assert normalize_name('  Aki  ') == 'Aki'\nassert build_greeting(' Mika ') == 'Hello, Mika'\n",
                    editable: false,
                    purpose: "test",
                  },
                ],
              },
              gradingMode: "stdout",
              timeoutMs: 3000,
              completionCriteria: "前後に空白がある名前でも、空白を取り除いたgreetingを出力する。",
              testCases: [
                {
                  id: "tc_py1_01_public",
                  order: 1,
                  visibility: "public",
                  stdin: "  Aki  \n",
                  expectedStdout: "Hello, Aki\n",
                  comparator: "trimmed_text",
                  weight: 1,
                  required: true,
                },
                {
                  id: "tc_py1_01_hidden",
                  order: 2,
                  visibility: "hidden",
                  stdin: "\tRen \n",
                  expectedStdout: "Hello, Ren\n",
                  comparator: "trimmed_text",
                  weight: 1,
                  required: true,
                },
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
