import type { Course } from "../../../domain/curriculum";
import { rubyLesson } from "../shared";

const courseId = "course_ruby_grade_2";
const chapterId = "chapter_ruby2_practical";

const discountStarter = 'def discounted_price(price, rate)\n  return price\nend\n\nprice = gets.to_i\nrate = gets.to_i\nputs discounted_price(price, rate)\n';
const labelStarter = 'def score_label(name, score)\n  return "#{name}:"\nend\n\nname = gets.chomp\nscore = gets.to_i\nputs score_label(name, score)\n';
const validationStarter = 'def grade(score)\n  if score >= 80\n    return "A"\n  end\n  return "C"\nend\n\nscore = gets.to_i\nputs grade(score)\n';
const sumStarter = 'def sum_scores(a, b, c)\n  scores = [a, b, c]\n  total = 0\n  for score in scores\n    total = total + score\n  end\n  return total\nend\n\na = gets.to_i\nb = gets.to_i\nc = gets.to_i\nputs sum_scores(a, b, c)\n';
const maxStarter = 'a = gets.to_i\nb = gets.to_i\nc = gets.to_i\nscores = [a, b, c]\nbest = 0\nfor score in scores\n  if score < best\n    best = score\n  end\nend\nputs best\n';
const projectStarter = 'def sum_four(a, b, c, d)\n  return a + b + c + d\nend\n\na = gets.to_i\nb = gets.to_i\nc = gets.to_i\nd = gets.to_i\ntotal = sum_four(a, b, c, d)\ncount = 4\nputs "count:#{count},avg:#{total / count}"\n';

export const rubyGrade2Course: Course = {
  id: courseId,
  languageId: "lang_ruby",
  levelId: "level_ruby_2",
  title: "Ruby 2級",
  description: "Rubyのメソッド分割、配列処理、デバッグ、小さな集計課題を練習します。",
  curriculumVersion: "ruby-grade-2-v0.1.0",
  validFrom: "2026-09-05",
  chapters: [
    {
      id: chapterId,
      courseId,
      title: "Ruby 2級 実践基礎",
      description: "処理をメソッドへ分け、境界値を検証し、配列を使う実践課題です。",
      order: 1,
      lessons: [
        rubyLesson(chapterId, { id: "lesson_ruby2_01_method_return", slug: "method-return", title: "Lesson 01: メソッドの戻り値", objective: "引数を受け取るメソッドで計算結果を返せる。", explanationMd: "戻り値のあるメソッドではreturnで値を呼び出し元へ返します。", taskMd: "priceとrateを受け取り、割引後価格を整数で出力してください。", starterCode: discountStarter, sampleInput: "2000\n10\n", sampleOutput: "1800\n", constraints: ["discounted_price(price, rate)を使ってください。", "式は price * (100 - rate) / 100 です。"], difficulty: 2, estimatedMinutes: 18, order: 1, hints: ["割引後は price * (100 - rate) / 100 です。", "returnで計算結果を返します。"], exercises: [{ id: "ex_ruby2_01_01", promptMd: "割引後価格を計算して返します。", starterCode: discountStarter, completionCriteria: "公開/hidden入力で割引後価格が一致する。", testCases: [{ id: "tc_ruby2_01_public", order: 1, visibility: "public", stdin: "2000\n10\n", expectedStdout: "1800\n" }, { id: "tc_ruby2_01_hidden", order: 2, visibility: "hidden", stdin: "2500\n20\n", expectedStdout: "2000\n" }] }]}),
        rubyLesson(chapterId, { id: "lesson_ruby2_02_method_composition", slug: "method-composition", title: "Lesson 02: method composition", objective: "条件分岐をメソッド内へまとめ、メイン処理を読みやすくできる。", explanationMd: "メソッドに判定を閉じ込めると、メイン処理は入力と出力に集中できます。", taskMd: "score_label(name, score)が80以上なら name:A、それ以外なら name:B を返すようにしてください。", starterCode: labelStarter, sampleInput: "Aki\n82\n", sampleOutput: "Aki:A\n", constraints: ["score_label()の戻り値を直してください。", "メイン処理からscore_label()を呼び出してください。"], difficulty: 2, estimatedMinutes: 18, order: 2, hints: ["if score >= 80 を使います。", "Aのときは return \"#{name}:A\" です。"], exercises: [{ id: "ex_ruby2_02_01", promptMd: "名前と点数から評価ラベルを返します。", starterCode: labelStarter, completionCriteria: "A/B両方のケースに合格する。", testCases: [{ id: "tc_ruby2_02_public", order: 1, visibility: "public", stdin: "Aki\n82\n", expectedStdout: "Aki:A\n" }, { id: "tc_ruby2_02_hidden", order: 2, visibility: "hidden", stdin: "Sora\n70\n", expectedStdout: "Sora:B\n" }] }]}),
        rubyLesson(chapterId, { id: "lesson_ruby2_03_input_validation", slug: "input-validation", title: "Lesson 03: input validation", objective: "境界値を意識して条件分岐を直せる。", explanationMd: "条件の境界値をテストすると、分類の抜けに気づきやすくなります。", taskMd: "grade(score)が80以上でA、60以上でB、それ未満でCを返すようにしてください。", starterCode: validationStarter, sampleInput: "72\n", sampleOutput: "B\n", constraints: ["80以上、60以上、それ未満の順に判定してください。", "出力はA/B/Cのどれか1行です。"], difficulty: 2, estimatedMinutes: 18, order: 3, hints: ["score >= 60 の条件を追加します。", "80以上の判定を先に書きます。"], exercises: [{ id: "ex_ruby2_03_01", promptMd: "点数からA/B/Cを返します。", starterCode: validationStarter, completionCriteria: "境界を含む公開/hiddenケースに合格する。", testCases: [{ id: "tc_ruby2_03_public", order: 1, visibility: "public", stdin: "72\n", expectedStdout: "B\n" }, { id: "tc_ruby2_03_hidden", order: 2, visibility: "hidden", stdin: "59\n", expectedStdout: "C\n" }] }]}),
        rubyLesson(chapterId, { id: "lesson_ruby2_04_array_sum", slug: "array-sum", title: "Lesson 04: array sum", objective: "配列とforを使って合計できる。", explanationMd: "配列に入れた値をforで順番に処理すると、合計や最大値を求められます。", taskMd: "3つの整数を受け取り、配列に入れて合計を出力してください。", starterCode: sumStarter, sampleInput: "10\n20\n30\n", sampleOutput: "60\n", constraints: ["scores配列を使ってください。", "forでscoresを順番に処理してください。"], difficulty: 3, estimatedMinutes: 20, order: 4, hints: ["scoreをtotalへ足します。", "total = total + score の形です。"], exercises: [{ id: "ex_ruby2_04_01", promptMd: "3つの数値を合計します。", starterCode: sumStarter, completionCriteria: "複数の入力で合計が一致する。", testCases: [{ id: "tc_ruby2_04_public", order: 1, visibility: "public", stdin: "10\n20\n30\n", expectedStdout: "60\n" }, { id: "tc_ruby2_04_hidden", order: 2, visibility: "hidden", stdin: "4\n5\n6\n", expectedStdout: "15\n" }] }]}),
        rubyLesson(chapterId, { id: "lesson_ruby2_05_algorithm_debug", slug: "algorithm-debug", title: "Lesson 05: algorithm debug", objective: "最大値探索のバグをテストから見つけて修正できる。", explanationMd: "最大値を探すときは初期値と比較演算子の向きが大切です。", taskMd: "3つの整数を受け取り、最大値を出力するようにバグを直してください。", starterCode: maxStarter, sampleInput: "4\n9\n2\n", sampleOutput: "9\n", constraints: ["scores配列を使ってください。", "bestは配列の値から始めてください。", "大きい値を見つけたときだけbestを更新してください。"], difficulty: 3, estimatedMinutes: 20, order: 5, hints: ["best = scores[0] から始めると負数にも対応できます。", "比較は score > best です。"], exercises: [{ id: "ex_ruby2_05_01", promptMd: "最大値探索のバグを修正します。", starterCode: maxStarter, completionCriteria: "正数とhiddenの負数ケースに合格する。", testCases: [{ id: "tc_ruby2_05_public", order: 1, visibility: "public", stdin: "4\n9\n2\n", expectedStdout: "9\n" }, { id: "tc_ruby2_05_hidden", order: 2, visibility: "hidden", stdin: "-4\n-2\n-9\n", expectedStdout: "-2\n" }] }]}),
        rubyLesson(chapterId, { id: "lesson_ruby2_06_small_project", slug: "small-project", title: "Lesson 06: small project", objective: "複数メソッドを組み合わせて小さな集計プログラムを完成できる。", explanationMd: "入力、合計、件数、平均を小さな処理に分けると、処理を確認しやすくなります。", taskMd: "4つの点数を受け取り、countと平均を count:4,avg:80 の形式で出力してください。", starterCode: projectStarter, sampleInput: "70\n80\n90\n80\n", sampleOutput: "count:4,avg:80\n", constraints: ["sum_four()を使ってください。", "countは4として扱います。"], difficulty: 3, estimatedMinutes: 25, order: 6, hints: ["totalは4つの点数の合計です。", "平均はtotal / countです。"], exercises: [{ id: "ex_ruby2_06_01", promptMd: "4つの点数から件数と平均を出力します。", starterCode: projectStarter, completionCriteria: "公開/hiddenの入力で件数と平均が一致する。", testCases: [{ id: "tc_ruby2_06_public", order: 1, visibility: "public", stdin: "70\n80\n90\n80\n", expectedStdout: "count:4,avg:80\n" }, { id: "tc_ruby2_06_hidden", order: 2, visibility: "hidden", stdin: "60\n90\n100\n70\n", expectedStdout: "count:4,avg:80\n" }] }]}),
      ],
      challenges: [],
    },
  ],
  mockExams: [],
};
