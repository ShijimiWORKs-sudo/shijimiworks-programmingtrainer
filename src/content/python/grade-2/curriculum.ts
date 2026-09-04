import type { Course } from "../../../domain/curriculum";

const courseId = "course_python_grade_2";

export const pythonGrade2Course: Course = {
  id: courseId,
  languageId: "lang_python",
  levelId: "level_python_2",
  title: "Python 2級",
  description: "関数の深掘り、class、例外、仮想ファイルI/O、アルゴリズムへ進むためのPython 2級コースです。",
  curriculumVersion: "0.1.0",
  validFrom: "2026-09-04",
  chapters: [
    {
      id: "chapter_python_grade_2_foundation",
      courseId,
      title: "Python 2級 Foundation",
      description: "関数の戻り値、引数、責務分割を深掘りするChapterです。",
      order: 1,
      lessons: [
        {
          id: "lesson_py2_01_function_return",
          chapterId: "chapter_python_grade_2_foundation",
          slug: "function-return",
          title: "Lesson 01: 関数の戻り値",
          objective: "計算を関数へ切り出し、戻り値を使って結果を出力する。",
          explanationMd: "2級では、処理をただ順番に書くのではなく、名前を付けた関数へ分けて再利用できる形にします。return は関数の計算結果を呼び出し元へ返すために使います。",
          taskMd: "価格 price と割引率 rate を整数で受け取り、discounted_price(price, rate) 関数で割引後の価格を計算して出力してください。",
          starterCode: "def discounted_price(price, rate):\n    return price\n\nprice = int(input())\nrate = int(input())\nprint(discounted_price(price, rate))\n",
          sampleInput: "1000\n10\n",
          sampleOutput: "900\n",
          constraints: [
            "discounted_price(price, rate) 関数を定義してください。",
            "関数の中で return を使って計算結果を返してください。",
            "割引後の価格は price * (100 - rate) // 100 で整数として計算してください。",
            "出力は割引後の価格を1行にしてください。",
          ],
          difficulty: 2,
          estimatedMinutes: 12,
          order: 1,
          status: "published",
          hints: [
            "rate は割引率なので、支払う割合は 100 - rate です。",
            "関数の return に price * (100 - rate) // 100 を書くと整数の価格を返せます。",
            "入力を受け取る部分と、計算する関数を分けて考えましょう。",
          ],
          exercises: [
            {
              id: "ex_py2_01_01",
              lessonId: "lesson_py2_01_function_return",
              type: "code",
              promptMd: "discounted_price 関数の戻り値で割引後の価格を出力します。",
              starterCode: "def discounted_price(price, rate):\n    return price\n\nprice = int(input())\nrate = int(input())\nprint(discounted_price(price, rate))\n",
              gradingMode: "stdout",
              timeoutMs: 3000,
              completionCriteria: "複数の価格と割引率で、整数の割引後価格を正しく出力する。",
              testCases: [
                {
                  id: "tc_py2_01_public",
                  order: 1,
                  visibility: "public",
                  stdin: "1000\n10\n",
                  expectedStdout: "900\n",
                  comparator: "trimmed_text",
                  weight: 1,
                  required: true,
                },
                {
                  id: "tc_py2_01_hidden",
                  order: 2,
                  visibility: "hidden",
                  stdin: "2500\n20\n",
                  expectedStdout: "2000\n",
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
