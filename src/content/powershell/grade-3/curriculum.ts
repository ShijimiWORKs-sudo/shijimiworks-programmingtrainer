import type { Course, Exercise, Lesson } from "../../../domain/curriculum";

const chapterId = "chapter_powershell3_pipeline_foundation";

function powershellExercise(seed: {
  id: string;
  lessonId: string;
  promptMd: string;
  starterCode: string;
  testCases: Exercise["testCases"];
}): Exercise {
  return {
    id: seed.id,
    lessonId: seed.lessonId,
    type: "code",
    promptMd: seed.promptMd,
    starterCode: seed.starterCode,
    gradingMode: "stdout",
    timeoutMs: 1000,
    completionCriteria: "PowerShell pipelineの出力が期待値と一致する。",
    testCases: seed.testCases,
  };
}

function powershellLesson(seed: Omit<Lesson, "status" | "exercises"> & { exercises: Exercise[] }): Lesson {
  return {
    ...seed,
    status: "draft",
  };
}

const selectTextFilesLessonId = "lesson_powershell3_01_select_text_files";
const countFilesLessonId = "lesson_powershell3_02_count_files";

export const powershellGrade3Course: Course = {
  id: "course_powershell_grade_3",
  languageId: "lang_powershell",
  levelId: "level_powershell_3",
  title: "PowerShell 3級",
  description: "PowerShell pipelineを仮想環境で安全に練習する。",
  curriculumVersion: "1.0.0",
  validFrom: "2026-09-05",
  chapters: [
    {
      id: chapterId,
      courseId: "course_powershell_grade_3",
      title: "Pipeline Foundation",
      description: "Get-ChildItemからWhere-Object、Select-Object、Measure-Objectへ値を渡す。",
      order: 1,
      lessons: [
        powershellLesson({
          id: selectTextFilesLessonId,
          chapterId,
          slug: "select-text-files",
          title: "Lesson 01: select text files",
          objective: "pipelineでtext fileだけを選び、名前を表示する。",
          explanationMd: "`|` は左のcommand結果を右のcommandへ渡します。仮想PowerShellでは、file一覧をfilterして表示できます。",
          taskMd: "`Get-ChildItem` の結果から、名前が `*.txt` に一致するfileだけを選び、`Name` を表示してください。",
          starterCode: "Get-ChildItem",
          sampleInput: "",
          sampleOutput: "notes.txt\nREADME.txt",
          constraints: ["`Where-Object Name -Like *.txt` を使います。", "`Select-Object Name` で名前だけを表示します。"],
          difficulty: 1,
          estimatedMinutes: 10,
          order: 1,
          hints: ["まず `Get-ChildItem | Where-Object Name -Like *.txt` で絞ります。", "最後に `| Select-Object Name` を足します。"],
          exercises: [
            powershellExercise({
              id: "ex_powershell3_01_select_text_files_01",
              lessonId: selectTextFilesLessonId,
              promptMd: "`*.txt` file名だけをpipelineで出力します。",
              starterCode: "Get-ChildItem",
              testCases: [
                {
                  id: "tc_ps3_select_text_public",
                  order: 1,
                  visibility: "public",
                  stdin: "",
                  expectedStdout: "notes.txt\nREADME.txt\n",
                  comparator: "exact_text",
                  weight: 1,
                  required: true,
                },
                {
                  id: "tc_ps3_select_text_hidden",
                  order: 2,
                  visibility: "hidden",
                  stdin: "",
                  expectedStdout: "notes.txt\nREADME.txt\n",
                  comparator: "exact_text",
                  weight: 1,
                  required: true,
                },
              ],
            }),
          ],
        }),
        powershellLesson({
          id: countFilesLessonId,
          chapterId,
          slug: "count-files",
          title: "Lesson 02: count files",
          objective: "pipelineでfile entriesを数える。",
          explanationMd: "`Measure-Object` はpipelineで受け取ったitem数を数えます。まずfileだけに絞ると、directoryを含めずに数えられます。",
          taskMd: "`Get-ChildItem` の結果からfileだけを選び、`Measure-Object` で数えてください。",
          starterCode: "Get-ChildItem",
          sampleInput: "",
          sampleOutput: "Count: 2",
          constraints: ["`Where-Object Type -eq file` でfileだけを選びます。", "最後に `Measure-Object` へ渡します。"],
          difficulty: 1,
          estimatedMinutes: 10,
          order: 2,
          hints: ["`Get-ChildItem | Where-Object Type -eq file` でfileだけにできます。", "`| Measure-Object` を最後に付けます。"],
          exercises: [
            powershellExercise({
              id: "ex_powershell3_02_count_files_01",
              lessonId: countFilesLessonId,
              promptMd: "仮想directory内のfile数をpipelineで数えます。",
              starterCode: "Get-ChildItem",
              testCases: [
                {
                  id: "tc_ps3_count_files_public",
                  order: 1,
                  visibility: "public",
                  stdin: "",
                  expectedStdout: "Count: 2\n",
                  comparator: "exact_text",
                  weight: 1,
                  required: true,
                },
                {
                  id: "tc_ps3_count_files_hidden",
                  order: 2,
                  visibility: "hidden",
                  stdin: "",
                  expectedStdout: "Count: 2\n",
                  comparator: "exact_text",
                  weight: 1,
                  required: true,
                },
              ],
            }),
          ],
        }),
      ],
      challenges: [],
    },
  ],
  mockExams: [],
};
