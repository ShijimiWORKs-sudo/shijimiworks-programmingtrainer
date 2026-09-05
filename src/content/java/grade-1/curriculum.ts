import type { Course, ProjectExerciseFile } from "../../../domain/curriculum";
import { javaLesson } from "../shared";

const courseId = "course_java_grade_1";
const chapterId = "chapter_java1_maintenance";

function file(path: string, content: string, purpose: ProjectExerciseFile["purpose"] = "support"): ProjectExerciseFile {
  return { path, language: "java", content, editable: false, purpose };
}

const bugStarter = "import java.util.Scanner;\n\npublic class Main {\n  public static String buildGreeting(String name) {\n    return \"Hello,\" + name;\n  }\n\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    System.out.println(buildGreeting(scanner.nextLine()));\n  }\n}\n";
const specStarter = "import java.util.Scanner;\n\npublic class Main {\n  public static int shippingFee(int total) {\n    return 500;\n  }\n\n  public static int orderTotal(int total) {\n    return total + shippingFee(total);\n  }\n\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    int total = scanner.nextInt();\n    System.out.println(orderTotal(total));\n  }\n}\n";
const testStarter = "import java.util.Scanner;\n\npublic class Main {\n  public static int passedCount(String line) {\n    String[] parts = line.split(\",\");\n    int count = 0;\n    for (int i = 0; i < parts.length; i++) {\n      int score = Integer.parseInt(parts[i]);\n      if (score > 70) {\n        count = count + 1;\n      }\n    }\n    return count;\n  }\n\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    System.out.println(passedCount(scanner.nextLine()));\n  }\n}\n";
const refactorStarter = "import java.util.Scanner;\n\npublic class Main {\n  public static String labelGrade(String name, int score) {\n    if (score >= 80) {\n      return name + \":A\";\n    }\n    return name + \":B\";\n  }\n\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    String name1 = scanner.nextLine();\n    int score1 = scanner.nextInt();\n    String name2 = scanner.nextLine();\n    int score2 = scanner.nextInt();\n    System.out.println(name1 + \":\" + score1);\n    System.out.println(name2 + \":\" + score2);\n  }\n}\n";

export const javaGrade1Course: Course = {
  id: courseId,
  languageId: "lang_java",
  levelId: "level_java_1",
  title: "Java 1級",
  description: "Javaの既存コード修正、仕様変更、テスト読み取り、リファクタリングを練習します。",
  curriculumVersion: "java-grade-1-v0.1.0",
  validFrom: "2026-09-05",
  chapters: [
    {
      id: chapterId,
      courseId,
      title: "Java 1級 実務メンテナンス",
      description: "小さな既存コードを読み、壊さず直す実践課題です。",
      order: 1,
      lessons: [
        javaLesson(chapterId, {
          id: "lesson_java1_01_bug_fix",
          slug: "bug-fix",
          title: "Lesson 01: bug fix",
          objective: "既存コードの文字列バグを修正できる。",
          explanationMd: "出力形式の小さな違いもテスト失敗につながります。",
          taskMd: "buildGreeting()を直し、前後の空白を除いた名前に Hello, を付けてください。",
          starterCode: bugStarter,
          sampleInput: " Aki \n",
          sampleOutput: "Hello, Aki\n",
          constraints: ["trim()を使って名前の前後の空白を取り除いてください。", "Hello, の後ろに空白を1つ入れてください。"],
          difficulty: 3,
          estimatedMinutes: 20,
          order: 1,
          hints: ["name.trim()で空白を取り除けます。", "\"Hello, \" + name.trim() の形にします。"],
          exercises: [{ id: "ex_java1_01_01", promptMd: "既存のあいさつコードを修正します。", starterCode: bugStarter, project: { entryFilePath: "Main.java", files: [file("tests/GreetingTest.java", "assert buildGreeting(\" Aki \").equals(\"Hello, Aki\");", "test")] }, completionCriteria: "公開/hiddenの名前入力で正しいあいさつになる。", testCases: [{ id: "tc_java1_01_public", order: 1, visibility: "public", stdin: " Aki \n", expectedStdout: "Hello, Aki\n" }, { id: "tc_java1_01_hidden", order: 2, visibility: "hidden", stdin: "\tRen\n", expectedStdout: "Hello, Ren\n" }] }],
        }),
        javaLesson(chapterId, {
          id: "lesson_java1_02_specification_change",
          slug: "specification-change",
          title: "Lesson 02: specification change",
          objective: "既存仕様を保ちながら新しい条件を追加できる。",
          explanationMd: "仕様変更では、古い動作と新しい動作の両方を守る必要があります。",
          taskMd: "5000以上なら送料0円、それ未満なら500円のままにしてください。",
          starterCode: specStarter,
          sampleInput: "5000\n",
          sampleOutput: "5000\n",
          constraints: ["shippingFee()を変更してください。", "5000未満は送料500円のままです。"],
          difficulty: 3,
          estimatedMinutes: 20,
          order: 2,
          hints: ["if (total >= 5000) なら0を返します。", "それ以外は500を返します。"],
          exercises: [{ id: "ex_java1_02_01", promptMd: "送料仕様の変更を反映します。", starterCode: specStarter, project: { entryFilePath: "Main.java", files: [file("tests/OrderTotalTest.java", "assert orderTotal(4800) == 5300;\nassert orderTotal(5000) == 5000;", "test")] }, completionCriteria: "旧仕様と新仕様、hidden境界値に合格する。", testCases: [{ id: "tc_java1_02_public_old", order: 1, visibility: "public", stdin: "4800\n", expectedStdout: "5300\n" }, { id: "tc_java1_02_public_new", order: 2, visibility: "public", stdin: "5000\n", expectedStdout: "5000\n" }, { id: "tc_java1_02_hidden", order: 3, visibility: "hidden", stdin: "5100\n", expectedStdout: "5100\n" }] }],
        }),
        javaLesson(chapterId, {
          id: "lesson_java1_03_test_oriented",
          slug: "test-oriented",
          title: "Lesson 03: test-oriented task",
          objective: "表示されたテストを読んで条件のズレを修正できる。",
          explanationMd: "テストは期待される境界値を教えてくれます。",
          taskMd: "70点以上を合格として数えるようにpassedCount()を修正してください。",
          starterCode: testStarter,
          sampleInput: "80,65,70\n",
          sampleOutput: "2\n",
          constraints: ["70点以上を合格にしてください。", "CSVの各点数をInteger.parseInt()で整数にしてください。"],
          difficulty: 3,
          estimatedMinutes: 20,
          order: 3,
          hints: ["条件は score >= 70 です。", "score > 70 では70点ちょうどが漏れます。"],
          exercises: [{ id: "ex_java1_03_01", promptMd: "テストを読んで合格者数の条件を直します。", starterCode: testStarter, project: { entryFilePath: "Main.java", files: [file("tests/ScoresTest.java", "assert passedCount(\"80,65,90\") == 2;\nassert passedCount(\"70,69\") == 1;", "test")] }, completionCriteria: "公開/hiddenのCSV入力で合格者数が一致する。", testCases: [{ id: "tc_java1_03_public_mixed", order: 1, visibility: "public", stdin: "80,65,70\n", expectedStdout: "2\n" }, { id: "tc_java1_03_public_boundary", order: 2, visibility: "public", stdin: "70,69\n", expectedStdout: "1\n" }, { id: "tc_java1_03_hidden", order: 3, visibility: "hidden", stdin: "100,40,75\n", expectedStdout: "2\n" }] }],
        }),
        javaLesson(chapterId, {
          id: "lesson_java1_04_refactoring",
          slug: "refactoring",
          title: "Lesson 04: refactoring",
          objective: "重複した出力処理をメソッドへまとめ、同じ動作を保てる。",
          explanationMd: "同じ判定が複数あると、変更漏れが起きやすくなります。メソッドへまとめると意図がはっきりします。",
          taskMd: "labelGrade(name, score)を使って、2人分の A/B ラベルを出力してください。",
          starterCode: refactorStarter,
          sampleInput: "Aki\n82\nYui\n75\n",
          sampleOutput: "Aki:A\nYui:B\n",
          constraints: ["labelGrade()を使ってください。", "80以上はA、それ未満はBです。"],
          difficulty: 3,
          estimatedMinutes: 20,
          order: 4,
          hints: ["mainの出力をlabelGrade(name, score)へ置き換えます。", "メソッドの戻り値をSystem.out.println()へ渡します。"],
          exercises: [{ id: "ex_java1_04_01", promptMd: "重複した評価ラベル出力をメソッドで整理します。", starterCode: refactorStarter, project: { entryFilePath: "Main.java", files: [file("tests/LabelGradeTest.java", "assert labelGrade(\"Aki\", 82).equals(\"Aki:A\");\nassert labelGrade(\"Yui\", 75).equals(\"Yui:B\");", "test")] }, completionCriteria: "公開/hiddenの2人分出力が一致する。", testCases: [{ id: "tc_java1_04_public", order: 1, visibility: "public", stdin: "Aki\n82\nYui\n75\n", expectedStdout: "Aki:A\nYui:B\n" }, { id: "tc_java1_04_hidden", order: 2, visibility: "hidden", stdin: "Nia\n88\nKai\n70\n", expectedStdout: "Nia:A\nKai:B\n" }] }],
        }),
      ],
      challenges: [],
    },
  ],
  mockExams: [],
};
