import type { Course, ProjectExerciseFile } from "../../../domain/curriculum";
import { rubyLesson } from "../shared";

const courseId = "course_ruby_grade_1";
const chapterId = "chapter_ruby1_maintenance";

function file(path: string, content: string, purpose: ProjectExerciseFile["purpose"] = "support"): ProjectExerciseFile {
  return { path, language: "ruby", content, editable: false, purpose };
}

const bugStarter = 'def build_greeting(name)\n  return "Hello," + name\nend\n\nname = gets.chomp\nputs build_greeting(name)\n';
const specStarter = 'def shipping_fee(total)\n  return 500\nend\n\ndef order_total(total)\n  return total + shipping_fee(total)\nend\n\ntotal = gets.to_i\nputs order_total(total)\n';
const testStarter = 'def passed_count(a, b, c)\n  scores = [a, b, c]\n  count = 0\n  for score in scores\n    if score > 70\n      count = count + 1\n    end\n  end\n  return count\nend\n\na = gets.to_i\nb = gets.to_i\nc = gets.to_i\nputs passed_count(a, b, c)\n';
const refactorStarter = 'def label_grade(name, score)\n  if score >= 80\n    return "#{name}:A"\n  end\n  return "#{name}:B"\nend\n\nname1 = gets.chomp\nscore1 = gets.to_i\nname2 = gets.chomp\nscore2 = gets.to_i\nputs "#{name1}:#{score1}"\nputs "#{name2}:#{score2}"\n';

export const rubyGrade1Course: Course = {
  id: courseId,
  languageId: "lang_ruby",
  levelId: "level_ruby_1",
  title: "Ruby 1級",
  description: "Rubyの既存コード修正、仕様変更、テスト読み取り、リファクタリングを練習します。",
  curriculumVersion: "ruby-grade-1-v0.1.0",
  validFrom: "2026-09-05",
  chapters: [
    {
      id: chapterId,
      courseId,
      title: "Ruby 1級 実務メンテナンス",
      description: "小さな既存コードを読み、壊さず直す実践課題です。",
      order: 1,
      lessons: [
        rubyLesson(chapterId, { id: "lesson_ruby1_01_bug_fix", slug: "bug-fix", title: "Lesson 01: bug fix", objective: "既存コードの文字列バグを修正できる。", explanationMd: "出力形式の小さな違いもテスト失敗につながります。", taskMd: "build_greeting()を直し、名前に Hello, を付けてください。", starterCode: bugStarter, sampleInput: "Aki\n", sampleOutput: "Hello, Aki\n", constraints: ["Hello, の後ろに空白を1つ入れてください。", "build_greeting()の戻り値を直してください。"], difficulty: 3, estimatedMinutes: 20, order: 1, hints: ["\"Hello,\" では空白が足りません。", "\"Hello, \" + name の形にします。"], exercises: [{ id: "ex_ruby1_01_01", promptMd: "既存のあいさつコードを修正します。", starterCode: bugStarter, project: { entryFilePath: "main.rb", files: [file("tests/greeting_test.rb", 'raise unless build_greeting("Aki") == "Hello, Aki"', "test")] }, completionCriteria: "公開/hiddenの名前入力で正しいあいさつになる。", testCases: [{ id: "tc_ruby1_01_public", order: 1, visibility: "public", stdin: "Aki\n", expectedStdout: "Hello, Aki\n" }, { id: "tc_ruby1_01_hidden", order: 2, visibility: "hidden", stdin: "Ren\n", expectedStdout: "Hello, Ren\n" }] }]}),
        rubyLesson(chapterId, { id: "lesson_ruby1_02_specification_change", slug: "specification-change", title: "Lesson 02: specification change", objective: "既存仕様を保ちながら新しい条件を追加できる。", explanationMd: "仕様変更では、古い動作と新しい動作の両方を守る必要があります。", taskMd: "5000以上なら送料0円、それ未満なら500円のままにしてください。", starterCode: specStarter, sampleInput: "5000\n", sampleOutput: "5000\n", constraints: ["shipping_fee()を変更してください。", "5000未満は送料500円のままです。"], difficulty: 3, estimatedMinutes: 20, order: 2, hints: ["if total >= 5000 なら0を返します。", "それ以外は500を返します。"], exercises: [{ id: "ex_ruby1_02_01", promptMd: "送料仕様の変更を反映します。", starterCode: specStarter, project: { entryFilePath: "main.rb", files: [file("tests/order_total_test.rb", "raise unless order_total(4800) == 5300\nraise unless order_total(5000) == 5000", "test")] }, completionCriteria: "旧仕様と新仕様、hidden境界値に合格する。", testCases: [{ id: "tc_ruby1_02_public_old", order: 1, visibility: "public", stdin: "4800\n", expectedStdout: "5300\n" }, { id: "tc_ruby1_02_public_new", order: 2, visibility: "public", stdin: "5000\n", expectedStdout: "5000\n" }, { id: "tc_ruby1_02_hidden", order: 3, visibility: "hidden", stdin: "5100\n", expectedStdout: "5100\n" }] }]}),
        rubyLesson(chapterId, { id: "lesson_ruby1_03_test_oriented", slug: "test-oriented", title: "Lesson 03: test-oriented task", objective: "表示されたテストを読んで条件のズレを修正できる。", explanationMd: "テストは期待される境界値を教えてくれます。", taskMd: "70点以上を合格として数えるようにpassed_count()を修正してください。", starterCode: testStarter, sampleInput: "80\n65\n70\n", sampleOutput: "2\n", constraints: ["70点以上を合格にしてください。", "3つの点数を配列で確認してください。"], difficulty: 3, estimatedMinutes: 20, order: 3, hints: ["条件は score >= 70 です。", "score > 70 では70点ちょうどが漏れます。"], exercises: [{ id: "ex_ruby1_03_01", promptMd: "テストを読んで合格者数の条件を直します。", starterCode: testStarter, project: { entryFilePath: "main.rb", files: [file("tests/scores_test.rb", "raise unless passed_count(80, 65, 90) == 2\nraise unless passed_count(70, 69, 65) == 1", "test")] }, completionCriteria: "公開/hiddenの入力で合格者数が一致する。", testCases: [{ id: "tc_ruby1_03_public_mixed", order: 1, visibility: "public", stdin: "80\n65\n70\n", expectedStdout: "2\n" }, { id: "tc_ruby1_03_public_boundary", order: 2, visibility: "public", stdin: "70\n69\n65\n", expectedStdout: "1\n" }, { id: "tc_ruby1_03_hidden", order: 3, visibility: "hidden", stdin: "100\n40\n75\n", expectedStdout: "2\n" }] }]}),
        rubyLesson(chapterId, { id: "lesson_ruby1_04_refactoring", slug: "refactoring", title: "Lesson 04: refactoring", objective: "重複した出力処理をメソッドへまとめ、同じ動作を保てる。", explanationMd: "同じ判定が複数あると、変更漏れが起きやすくなります。メソッドへまとめると意図がはっきりします。", taskMd: "label_grade(name, score)を使って、2人分の A/B ラベルを出力してください。", starterCode: refactorStarter, sampleInput: "Aki\n82\nYui\n75\n", sampleOutput: "Aki:A\nYui:B\n", constraints: ["label_grade()を使ってください。", "80以上はA、それ未満はBです。"], difficulty: 3, estimatedMinutes: 20, order: 4, hints: ["mainの出力をlabel_grade(name, score)へ置き換えます。", "メソッドの戻り値をputsへ渡します。"], exercises: [{ id: "ex_ruby1_04_01", promptMd: "重複した評価ラベル出力をメソッドで整理します。", starterCode: refactorStarter, project: { entryFilePath: "main.rb", files: [file("tests/label_grade_test.rb", 'raise unless label_grade("Aki", 82) == "Aki:A"\nraise unless label_grade("Yui", 75) == "Yui:B"', "test")] }, completionCriteria: "公開/hiddenの2人分出力が一致する。", testCases: [{ id: "tc_ruby1_04_public", order: 1, visibility: "public", stdin: "Aki\n82\nYui\n75\n", expectedStdout: "Aki:A\nYui:B\n" }, { id: "tc_ruby1_04_hidden", order: 2, visibility: "hidden", stdin: "Nia\n88\nKai\n70\n", expectedStdout: "Nia:A\nKai:B\n" }] }]}),
      ],
      challenges: [],
    },
  ],
  mockExams: [],
};
