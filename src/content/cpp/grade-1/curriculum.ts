import type { Course, ProjectExerciseFile } from "../../../domain/curriculum";
import { cppLesson } from "../shared";

const courseId = "course_cpp_grade_1";
const chapterId = "chapter_cpp1_maintenance";

function file(path: string, content: string, purpose: ProjectExerciseFile["purpose"] = "support"): ProjectExerciseFile {
  return { path, language: "cpp", content, editable: false, purpose };
}

const bugStarter = '#include <iostream>\n#include <string>\n\nstd::string buildGreeting(std::string name) {\n  return "Hello," + name;\n}\n\nint main() {\n  std::string name;\n  std::cin >> name;\n  std::cout << buildGreeting(name) << std::endl;\n  return 0;\n}\n';
const specStarter = '#include <iostream>\n\nint shippingFee(int total) {\n  return 500;\n}\n\nint orderTotal(int total) {\n  return total + shippingFee(total);\n}\n\nint main() {\n  int total;\n  std::cin >> total;\n  std::cout << orderTotal(total) << std::endl;\n  return 0;\n}\n';
const testStarter = '#include <iostream>\n\nint passedCount(int a, int b, int c) {\n  int scores[3] = {a, b, c};\n  int count = 0;\n  for (int i = 0; i < 3; i++) {\n    if (scores[i] > 70) {\n      count = count + 1;\n    }\n  }\n  return count;\n}\n\nint main() {\n  int a;\n  int b;\n  int c;\n  std::cin >> a >> b >> c;\n  std::cout << passedCount(a, b, c) << std::endl;\n  return 0;\n}\n';
const refactorStarter = '#include <iostream>\n#include <string>\n\nstd::string labelGrade(std::string name, int score) {\n  if (score >= 80) {\n    return name + ":A";\n  }\n  return name + ":B";\n}\n\nint main() {\n  std::string name1;\n  int score1;\n  std::string name2;\n  int score2;\n  std::cin >> name1 >> score1 >> name2 >> score2;\n  std::cout << name1 << ":" << score1 << std::endl;\n  std::cout << name2 << ":" << score2 << std::endl;\n  return 0;\n}\n';

export const cppGrade1Course: Course = {
  id: courseId,
  languageId: "lang_cpp",
  levelId: "level_cpp_1",
  title: "C++ 1級",
  description: "C++の既存コード修正、仕様変更、テスト読み取り、リファクタリングを練習します。",
  curriculumVersion: "cpp-grade-1-v0.1.0",
  validFrom: "2026-09-05",
  chapters: [
    {
      id: chapterId,
      courseId,
      title: "C++ 1級 実務メンテナンス",
      description: "小さな既存コードを読み、壊さず直す実践課題です。",
      order: 1,
      lessons: [
        cppLesson(chapterId, { id: "lesson_cpp1_01_bug_fix", slug: "bug-fix", title: "Lesson 01: bug fix", objective: "既存コードの文字列バグを修正できる。", explanationMd: "出力形式の小さな違いもテスト失敗につながります。", taskMd: "buildGreeting()を直し、名前に Hello, を付けてください。", starterCode: bugStarter, sampleInput: "Aki\n", sampleOutput: "Hello, Aki\n", constraints: ["Hello, の後ろに空白を1つ入れてください。", "buildGreeting()の戻り値を直してください。"], difficulty: 3, estimatedMinutes: 20, order: 1, hints: ["\"Hello,\" では空白が足りません。", "\"Hello, \" + name の形にします。"], exercises: [{ id: "ex_cpp1_01_01", promptMd: "既存のあいさつコードを修正します。", starterCode: bugStarter, project: { entryFilePath: "main.cpp", files: [file("tests/GreetingTest.cpp", 'assert(buildGreeting("Aki") == "Hello, Aki");', "test")] }, completionCriteria: "公開/hiddenの名前入力で正しいあいさつになる。", testCases: [{ id: "tc_cpp1_01_public", order: 1, visibility: "public", stdin: "Aki\n", expectedStdout: "Hello, Aki\n" }, { id: "tc_cpp1_01_hidden", order: 2, visibility: "hidden", stdin: "Ren\n", expectedStdout: "Hello, Ren\n" }] }] }),
        cppLesson(chapterId, { id: "lesson_cpp1_02_specification_change", slug: "specification-change", title: "Lesson 02: specification change", objective: "既存仕様を保ちながら新しい条件を追加できる。", explanationMd: "仕様変更では、古い動作と新しい動作の両方を守る必要があります。", taskMd: "5000以上なら送料0円、それ未満なら500円のままにしてください。", starterCode: specStarter, sampleInput: "5000\n", sampleOutput: "5000\n", constraints: ["shippingFee()を変更してください。", "5000未満は送料500円のままです。"], difficulty: 3, estimatedMinutes: 20, order: 2, hints: ["if (total >= 5000) なら0を返します。", "それ以外は500を返します。"], exercises: [{ id: "ex_cpp1_02_01", promptMd: "送料仕様の変更を反映します。", starterCode: specStarter, project: { entryFilePath: "main.cpp", files: [file("tests/OrderTotalTest.cpp", "assert(orderTotal(4800) == 5300);\nassert(orderTotal(5000) == 5000);", "test")] }, completionCriteria: "旧仕様と新仕様、hidden境界値に合格する。", testCases: [{ id: "tc_cpp1_02_public_old", order: 1, visibility: "public", stdin: "4800\n", expectedStdout: "5300\n" }, { id: "tc_cpp1_02_public_new", order: 2, visibility: "public", stdin: "5000\n", expectedStdout: "5000\n" }, { id: "tc_cpp1_02_hidden", order: 3, visibility: "hidden", stdin: "5100\n", expectedStdout: "5100\n" }] }] }),
        cppLesson(chapterId, { id: "lesson_cpp1_03_test_oriented", slug: "test-oriented", title: "Lesson 03: test-oriented task", objective: "表示されたテストを読んで条件のズレを修正できる。", explanationMd: "テストは期待される境界値を教えてくれます。", taskMd: "70点以上を合格として数えるようにpassedCount()を修正してください。", starterCode: testStarter, sampleInput: "80 65 70\n", sampleOutput: "2\n", constraints: ["70点以上を合格にしてください。", "3つの点数を配列で確認してください。"], difficulty: 3, estimatedMinutes: 20, order: 3, hints: ["条件は scores[i] >= 70 です。", "scores[i] > 70 では70点ちょうどが漏れます。"], exercises: [{ id: "ex_cpp1_03_01", promptMd: "テストを読んで合格者数の条件を直します。", starterCode: testStarter, project: { entryFilePath: "main.cpp", files: [file("tests/ScoresTest.cpp", "assert(passedCount(80, 65, 90) == 2);\nassert(passedCount(70, 69, 65) == 1);", "test")] }, completionCriteria: "公開/hiddenの入力で合格者数が一致する。", testCases: [{ id: "tc_cpp1_03_public_mixed", order: 1, visibility: "public", stdin: "80 65 70\n", expectedStdout: "2\n" }, { id: "tc_cpp1_03_public_boundary", order: 2, visibility: "public", stdin: "70 69 65\n", expectedStdout: "1\n" }, { id: "tc_cpp1_03_hidden", order: 3, visibility: "hidden", stdin: "100 40 75\n", expectedStdout: "2\n" }] }] }),
        cppLesson(chapterId, { id: "lesson_cpp1_04_refactoring", slug: "refactoring", title: "Lesson 04: refactoring", objective: "重複した出力処理を関数へまとめ、同じ動作を保てる。", explanationMd: "同じ判定が複数あると、変更漏れが起きやすくなります。関数へまとめると意図がはっきりします。", taskMd: "labelGrade(name, score)を使って、2人分の A/B ラベルを出力してください。", starterCode: refactorStarter, sampleInput: "Aki 82 Yui 75\n", sampleOutput: "Aki:A\nYui:B\n", constraints: ["labelGrade()を使ってください。", "80以上はA、それ未満はBです。"], difficulty: 3, estimatedMinutes: 20, order: 4, hints: ["mainの出力をlabelGrade(name, score)へ置き換えます。", "関数の戻り値をstd::coutへ渡します。"], exercises: [{ id: "ex_cpp1_04_01", promptMd: "重複した評価ラベル出力を関数で整理します。", starterCode: refactorStarter, project: { entryFilePath: "main.cpp", files: [file("tests/LabelGradeTest.cpp", 'assert(labelGrade("Aki", 82) == "Aki:A");\nassert(labelGrade("Yui", 75) == "Yui:B");', "test")] }, completionCriteria: "公開/hiddenの2人分出力が一致する。", testCases: [{ id: "tc_cpp1_04_public", order: 1, visibility: "public", stdin: "Aki 82 Yui 75\n", expectedStdout: "Aki:A\nYui:B\n" }, { id: "tc_cpp1_04_hidden", order: 2, visibility: "hidden", stdin: "Nia 88 Kai 70\n", expectedStdout: "Nia:A\nKai:B\n" }] }] }),
      ],
      challenges: [],
    },
  ],
  mockExams: [],
};
