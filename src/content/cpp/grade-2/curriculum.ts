import type { Course } from "../../../domain/curriculum";
import { cppLesson } from "../shared";

const courseId = "course_cpp_grade_2";
const chapterId = "chapter_cpp2_practical";

const discountStarter = '#include <iostream>\n\nint discountedPrice(int price, int rate) {\n  return price;\n}\n\nint main() {\n  int price;\n  int rate;\n  std::cin >> price >> rate;\n  std::cout << discountedPrice(price, rate) << std::endl;\n  return 0;\n}\n';
const labelStarter = '#include <iostream>\n#include <string>\n\nstd::string scoreLabel(std::string name, int score) {\n  return name + ":";\n}\n\nint main() {\n  std::string name;\n  int score;\n  std::cin >> name >> score;\n  std::cout << scoreLabel(name, score) << std::endl;\n  return 0;\n}\n';
const validationStarter = '#include <iostream>\n#include <string>\n\nstd::string grade(int score) {\n  if (score >= 80) {\n    return "A";\n  }\n  return "C";\n}\n\nint main() {\n  int score;\n  std::cin >> score;\n  std::cout << grade(score) << std::endl;\n  return 0;\n}\n';
const sumStarter = '#include <iostream>\n\nint sumScores(int a, int b, int c) {\n  int scores[3] = {a, b, c};\n  int total = 0;\n  for (int i = 0; i < 3; i++) {\n    total = total + scores[i];\n  }\n  return total;\n}\n\nint main() {\n  int a;\n  int b;\n  int c;\n  std::cin >> a >> b >> c;\n  std::cout << sumScores(a, b, c) << std::endl;\n  return 0;\n}\n';
const maxStarter = '#include <iostream>\n\nint main() {\n  int a;\n  int b;\n  int c;\n  std::cin >> a >> b >> c;\n  int scores[3] = {a, b, c};\n  int best = 0;\n  for (int i = 0; i < 3; i++) {\n    if (scores[i] < best) {\n      best = scores[i];\n    }\n  }\n  std::cout << best << std::endl;\n  return 0;\n}\n';
const projectStarter = '#include <iostream>\n\nint sumFour(int a, int b, int c, int d) {\n  return a + b + c + d;\n}\n\nint main() {\n  int a;\n  int b;\n  int c;\n  int d;\n  std::cin >> a >> b >> c >> d;\n  int total = sumFour(a, b, c, d);\n  int count = 4;\n  std::cout << "count:" << count << ",avg:" << total / count << std::endl;\n  return 0;\n}\n';

export const cppGrade2Course: Course = {
  id: courseId,
  languageId: "lang_cpp",
  levelId: "level_cpp_2",
  title: "C++ 2級",
  description: "C++の関数分割、配列処理、デバッグ、小さな集計課題を練習します。",
  curriculumVersion: "cpp-grade-2-v0.1.0",
  validFrom: "2026-09-05",
  chapters: [
    {
      id: chapterId,
      courseId,
      title: "C++ 2級 実践基礎",
      description: "処理を関数へ分け、境界値を検証し、配列を使う実践課題です。",
      order: 1,
      lessons: [
        cppLesson(chapterId, { id: "lesson_cpp2_01_function_return", slug: "function-return", title: "Lesson 01: 関数の戻り値", objective: "引数を受け取る関数で計算結果を返せる。", explanationMd: "戻り値のある関数ではreturnで値を呼び出し元へ返します。", taskMd: "priceとrateを受け取り、割引後価格を整数で出力してください。", starterCode: discountStarter, sampleInput: "2000 10\n", sampleOutput: "1800\n", constraints: ["discountedPrice(price, rate)を使ってください。", "式は price * (100 - rate) / 100 です。"], difficulty: 2, estimatedMinutes: 18, order: 1, hints: ["割引後は price * (100 - rate) / 100 です。", "returnで計算結果を返します。"], exercises: [{ id: "ex_cpp2_01_01", promptMd: "割引後価格を計算して返します。", starterCode: discountStarter, completionCriteria: "公開/hidden入力で割引後価格が一致する。", testCases: [{ id: "tc_cpp2_01_public", order: 1, visibility: "public", stdin: "2000 10\n", expectedStdout: "1800\n" }, { id: "tc_cpp2_01_hidden", order: 2, visibility: "hidden", stdin: "2500 20\n", expectedStdout: "2000\n" }] }] }),
        cppLesson(chapterId, { id: "lesson_cpp2_02_function_composition", slug: "function-composition", title: "Lesson 02: function composition", objective: "条件分岐を関数内へまとめ、mainを読みやすくできる。", explanationMd: "関数に判定を閉じ込めると、mainは入力と出力に集中できます。", taskMd: "scoreLabel(name, score)が80以上なら name + \":A\"、それ以外なら name + \":B\" を返すようにしてください。", starterCode: labelStarter, sampleInput: "Aki 82\n", sampleOutput: "Aki:A\n", constraints: ["scoreLabel()の戻り値を直してください。", "mainからscoreLabel()を呼び出してください。"], difficulty: 2, estimatedMinutes: 18, order: 2, hints: ["if (score >= 80) を使います。", "Aのときは return name + \":A\"; です。"], exercises: [{ id: "ex_cpp2_02_01", promptMd: "名前と点数から評価ラベルを返します。", starterCode: labelStarter, completionCriteria: "A/B両方のケースに合格する。", testCases: [{ id: "tc_cpp2_02_public", order: 1, visibility: "public", stdin: "Aki 82\n", expectedStdout: "Aki:A\n" }, { id: "tc_cpp2_02_hidden", order: 2, visibility: "hidden", stdin: "Sora 70\n", expectedStdout: "Sora:B\n" }] }] }),
        cppLesson(chapterId, { id: "lesson_cpp2_03_input_validation", slug: "input-validation", title: "Lesson 03: input validation", objective: "境界値を意識して条件分岐を直せる。", explanationMd: "条件の境界値をテストすると、分類の抜けに気づきやすくなります。", taskMd: "grade(score)が80以上でA、60以上でB、それ未満でCを返すようにしてください。", starterCode: validationStarter, sampleInput: "72\n", sampleOutput: "B\n", constraints: ["80以上、60以上、それ未満の順に判定してください。", "出力はA/B/Cのどれか1行です。"], difficulty: 2, estimatedMinutes: 18, order: 3, hints: ["score >= 60 の条件を追加します。", "80以上の判定を先に書きます。"], exercises: [{ id: "ex_cpp2_03_01", promptMd: "点数からA/B/Cを返します。", starterCode: validationStarter, completionCriteria: "境界を含む公開/hiddenケースに合格する。", testCases: [{ id: "tc_cpp2_03_public", order: 1, visibility: "public", stdin: "72\n", expectedStdout: "B\n" }, { id: "tc_cpp2_03_hidden", order: 2, visibility: "hidden", stdin: "59\n", expectedStdout: "C\n" }] }] }),
        cppLesson(chapterId, { id: "lesson_cpp2_04_array_sum", slug: "array-sum", title: "Lesson 04: array sum", objective: "配列とforを使って合計できる。", explanationMd: "配列に入れた値をforで順番に処理すると、合計や最大値を求められます。", taskMd: "3つの整数を受け取り、配列に入れて合計を出力してください。", starterCode: sumStarter, sampleInput: "10 20 30\n", sampleOutput: "60\n", constraints: ["scores配列を使ってください。", "forでscoresを順番に処理してください。"], difficulty: 3, estimatedMinutes: 20, order: 4, hints: ["scores[i]をtotalへ足します。", "total = total + scores[i]; の形です。"], exercises: [{ id: "ex_cpp2_04_01", promptMd: "3つの数値を合計します。", starterCode: sumStarter, completionCriteria: "複数の入力で合計が一致する。", testCases: [{ id: "tc_cpp2_04_public", order: 1, visibility: "public", stdin: "10 20 30\n", expectedStdout: "60\n" }, { id: "tc_cpp2_04_hidden", order: 2, visibility: "hidden", stdin: "4 5 6\n", expectedStdout: "15\n" }] }] }),
        cppLesson(chapterId, { id: "lesson_cpp2_05_algorithm_debug", slug: "algorithm-debug", title: "Lesson 05: algorithm debug", objective: "最大値探索のバグをテストから見つけて修正できる。", explanationMd: "最大値を探すときは初期値と比較演算子の向きが大切です。", taskMd: "3つの整数を受け取り、最大値を出力するようにバグを直してください。", starterCode: maxStarter, sampleInput: "4 9 2\n", sampleOutput: "9\n", constraints: ["scores配列を使ってください。", "bestは配列の値から始めてください。", "大きい値を見つけたときだけbestを更新してください。"], difficulty: 3, estimatedMinutes: 20, order: 5, hints: ["best = scores[0] から始めると負数にも対応できます。", "比較は scores[i] > best です。"], exercises: [{ id: "ex_cpp2_05_01", promptMd: "最大値探索のバグを修正します。", starterCode: maxStarter, completionCriteria: "正数とhiddenの負数ケースに合格する。", testCases: [{ id: "tc_cpp2_05_public", order: 1, visibility: "public", stdin: "4 9 2\n", expectedStdout: "9\n" }, { id: "tc_cpp2_05_hidden", order: 2, visibility: "hidden", stdin: "-4 -2 -9\n", expectedStdout: "-2\n" }] }] }),
        cppLesson(chapterId, { id: "lesson_cpp2_06_small_project", slug: "small-project", title: "Lesson 06: small project", objective: "複数関数を組み合わせて小さな集計プログラムを完成できる。", explanationMd: "入力、合計、件数、平均を小さな処理に分けると、処理を確認しやすくなります。", taskMd: "4つの点数を受け取り、countと平均を count:4,avg:80 の形式で出力してください。", starterCode: projectStarter, sampleInput: "70 80 90 80\n", sampleOutput: "count:4,avg:80\n", constraints: ["sumFour()を使ってください。", "countは4として扱います。"], difficulty: 3, estimatedMinutes: 25, order: 6, hints: ["totalは4つの点数の合計です。", "平均はtotal / countです。"], exercises: [{ id: "ex_cpp2_06_01", promptMd: "4つの点数から件数と平均を出力します。", starterCode: projectStarter, completionCriteria: "公開/hiddenの入力で件数と平均が一致する。", testCases: [{ id: "tc_cpp2_06_public", order: 1, visibility: "public", stdin: "70 80 90 80\n", expectedStdout: "count:4,avg:80\n" }, { id: "tc_cpp2_06_hidden", order: 2, visibility: "hidden", stdin: "60 90 100 70\n", expectedStdout: "count:4,avg:80\n" }] }] }),
      ],
      challenges: [],
    },
  ],
  mockExams: [],
};
