import type { Course, Exercise, Lesson, PowerShellVirtualEnvironment } from "../../../domain/curriculum";

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

function powershellFileSystemExercise(seed: {
  id: string;
  lessonId: string;
  promptMd: string;
  starterCode: string;
  completionCriteria: string;
  environment: PowerShellVirtualEnvironment;
  requirements: Exercise["powershellFileRequirements"];
}): Exercise {
  return {
    id: seed.id,
    lessonId: seed.lessonId,
    type: "code",
    promptMd: seed.promptMd,
    starterCode: seed.starterCode,
    gradingMode: "powershell_virtual_fs",
    timeoutMs: 1000,
    completionCriteria: seed.completionCriteria,
    testCases: [],
    powershellEnvironment: seed.environment,
    powershellFileRequirements: seed.requirements,
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
const createReportLessonId = "lesson_powershell3_03_create_report";
const organizeDraftLessonId = "lesson_powershell3_04_organize_draft";

const basePowerShellEnvironment: PowerShellVirtualEnvironment = {
  cwd: "C:\\Users\\student",
  entries: [
    { path: "C:\\", type: "directory" },
    { path: "C:\\Users", type: "directory" },
    { path: "C:\\Users\\student", type: "directory" },
    { path: "README.txt", type: "file", content: "Welcome to the Programming Trainer virtual PowerShell.\n" },
    { path: "notes.txt", type: "file", content: "Use Get-ChildItem, Set-Location, Get-Content, Write-Output, Get-Help, and Get-History.\n" },
  ],
};

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
        powershellLesson({
          id: createReportLessonId,
          chapterId,
          slug: "create-report-file",
          title: "Lesson 03: create a report file",
          objective: "仮想filesystemにdirectoryとfileを作成し、内容を書き込む。",
          explanationMd: "`New-Item` はfileやdirectoryを作り、`Set-Content` はfileの内容を書き込みます。Programming Trainerではすべて仮想filesystem内だけで実行されます。",
          taskMd: "`reports` directoryを作り、その中に `summary.txt` を作成して `ready` と書き込んでください。",
          starterCode: "New-Item -ItemType Directory -Path reports",
          sampleInput: "",
          sampleOutput: "Virtual filesystem updated",
          constraints: ["`New-Item -ItemType Directory -Path reports` を使います。", "`Set-Content -Path reports\\summary.txt -Value ready` を使います。"],
          difficulty: 2,
          estimatedMinutes: 12,
          order: 3,
          hints: ["まず `reports` directoryを作ります。", "`Set-Content` の `-Path` に `reports\\summary.txt` を指定します。"],
          exercises: [
            powershellFileSystemExercise({
              id: "ex_powershell3_03_create_report_01",
              lessonId: createReportLessonId,
              promptMd: "`reports\\summary.txt` を仮想filesystem内に作ります。",
              starterCode: "New-Item -ItemType Directory -Path reports",
              completionCriteria: "reports directoryとsummary.txtの内容が条件を満たす。",
              environment: basePowerShellEnvironment,
              requirements: [
                {
                  id: "ps3_reports_dir_public",
                  order: 1,
                  visibility: "public",
                  kind: "directory_exists",
                  path: "reports",
                  description: "reports directory exists",
                  required: true,
                },
                {
                  id: "ps3_summary_content_public",
                  order: 2,
                  visibility: "public",
                  kind: "file_content_equals",
                  path: "reports\\summary.txt",
                  description: "summary.txt contains ready",
                  expectedContent: "ready\n",
                  required: true,
                },
                {
                  id: "ps3_summary_hidden",
                  order: 3,
                  visibility: "hidden",
                  kind: "file_content_equals",
                  path: "reports\\summary.txt",
                  description: "summary.txt exact hidden check",
                  expectedContent: "ready\n",
                  required: true,
                },
              ],
            }),
          ],
        }),
        powershellLesson({
          id: organizeDraftLessonId,
          chapterId,
          slug: "organize-draft-file",
          title: "Lesson 04: organize a draft file",
          objective: "copy、move、removeを使って仮想fileを整理する。",
          explanationMd: "`Copy-Item` は元fileを残して複製し、`Move-Item` は場所や名前を変えます。`Remove-Item` は仮想filesystem内の不要なfileだけを削除します。",
          taskMd: "`draft.txt` を `backup.txt` にcopyし、元の `draft.txt` を `final.txt` にmoveしてから、`old.tmp` を削除してください。",
          starterCode: "Copy-Item draft.txt backup.txt",
          sampleInput: "",
          sampleOutput: "Virtual filesystem updated",
          constraints: ["`Copy-Item`、`Move-Item`、`Remove-Item` を使います。", "host filesystemではなく仮想filesystemだけを操作します。"],
          difficulty: 2,
          estimatedMinutes: 12,
          order: 4,
          hints: ["最初に `Copy-Item draft.txt backup.txt` でbackupを作ります。", "次に `Move-Item draft.txt final.txt`、最後に `Remove-Item old.tmp` です。"],
          exercises: [
            powershellFileSystemExercise({
              id: "ex_powershell3_04_organize_draft_01",
              lessonId: organizeDraftLessonId,
              promptMd: "仮想fileをcopy、move、removeで整理します。",
              starterCode: "Copy-Item draft.txt backup.txt",
              completionCriteria: "backupとfinal fileがあり、draft.txtとold.tmpが残っていない。",
              environment: {
                ...basePowerShellEnvironment,
                entries: [
                  ...basePowerShellEnvironment.entries,
                  { path: "draft.txt", type: "file", content: "draft\n" },
                  { path: "old.tmp", type: "file", content: "remove me\n" },
                ],
              },
              requirements: [
                {
                  id: "ps3_backup_public",
                  order: 1,
                  visibility: "public",
                  kind: "file_content_equals",
                  path: "backup.txt",
                  description: "backup.txt keeps draft content",
                  expectedContent: "draft\n",
                  required: true,
                },
                {
                  id: "ps3_final_public",
                  order: 2,
                  visibility: "public",
                  kind: "file_content_equals",
                  path: "final.txt",
                  description: "final.txt keeps draft content",
                  expectedContent: "draft\n",
                  required: true,
                },
                {
                  id: "ps3_draft_hidden",
                  order: 3,
                  visibility: "hidden",
                  kind: "file_not_exists",
                  path: "draft.txt",
                  description: "draft.txt was moved away",
                  required: true,
                },
                {
                  id: "ps3_old_hidden",
                  order: 4,
                  visibility: "hidden",
                  kind: "file_not_exists",
                  path: "old.tmp",
                  description: "old.tmp was removed",
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
