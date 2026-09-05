import type { CommandVirtualEnvironment, Course, Exercise, Lesson } from "../../../domain/curriculum";

const commandBaseEnvironment: CommandVirtualEnvironment = {
  cwd: "C:\\Users\\student",
  entries: [
    { path: "C:\\", type: "directory" },
    { path: "C:\\Users", type: "directory" },
    { path: "C:\\Users\\student", type: "directory" },
  ],
};

function commandExercise(seed: {
  id: string;
  lessonId: string;
  promptMd: string;
  starterCode: string;
  completionCriteria: string;
  environment: CommandVirtualEnvironment;
  requirements: Exercise["commandFileRequirements"];
}): Exercise {
  return {
    id: seed.id,
    lessonId: seed.lessonId,
    type: "code",
    promptMd: seed.promptMd,
    starterCode: seed.starterCode,
    gradingMode: "command_virtual_fs",
    timeoutMs: 1000,
    completionCriteria: seed.completionCriteria,
    testCases: [],
    commandEnvironment: seed.environment,
    commandFileRequirements: seed.requirements,
  };
}

function commandLesson(seed: Omit<Lesson, "status" | "exercises"> & { exercises: Exercise[] }): Lesson {
  return {
    ...seed,
    status: "draft",
  };
}

const createFilesLessonId = "lesson_command3_01_create_files";
const moveFilesLessonId = "lesson_command3_02_move_files";
const deleteFilesLessonId = "lesson_command3_03_delete_files";

export const commandGrade3Course: Course = {
  id: "course_command_grade_3",
  languageId: "lang_command",
  levelId: "level_command_3",
  title: "Command 3級",
  description: "Windows Commandの基本操作を、仮想ターミナルと仮想ファイルシステムで安全に練習する。",
  curriculumVersion: "0.1.0",
  validFrom: "2026-09-05",
  chapters: [
    {
      id: "chapter_command3_virtual_filesystem",
      courseId: "course_command_grade_3",
      title: "Virtual Filesystem",
      description: "ファイル作成、移動、削除をすべて仮想環境内で練習する。",
      order: 1,
      lessons: [
        commandLesson({
          id: createFilesLessonId,
          chapterId: "chapter_command3_virtual_filesystem",
          slug: "create-files",
          title: "Lesson 01: create files",
          objective: "mkdir と echo redirectionで仮想directoryとfileを作る。",
          explanationMd: "Commandでは、directoryを作ってからfileへ文字を書き出す流れをよく使います。このLessonでは、仮想filesystemだけを使って安全に作成操作を練習します。",
          taskMd: "`reports` directoryを作り、その中に `summary.txt` を作成して `daily summary` と書き込んでください。",
          starterCode: "echo TODO > summary.txt",
          sampleInput: "",
          sampleOutput: "reports\\summary.txt",
          constraints: [
            "host filesystemではなく仮想filesystemだけを操作します。",
            "`mkdir reports` でdirectoryを作成してください。",
            "`echo daily summary > reports\\summary.txt` でfile内容を書き込んでください。",
          ],
          difficulty: 1,
          estimatedMinutes: 10,
          order: 1,
          hints: [
            "`mkdir reports` で `reports` directoryを作れます。",
            "`>` はechoの出力をfileに保存します。",
            "pathは `reports\\summary.txt` のようにdirectory名から書けます。",
          ],
          exercises: [
            commandExercise({
              id: "ex_command3_01_create_files_01",
              lessonId: createFilesLessonId,
              promptMd: "仮想filesystemにdirectoryとfileを作成してください。",
              starterCode: "echo TODO > summary.txt",
              completionCriteria: "reports directoryとsummary.txtの内容が条件を満たす。",
              environment: commandBaseEnvironment,
              requirements: [
                {
                  id: "reports-directory",
                  order: 1,
                  visibility: "public",
                  kind: "directory_exists",
                  path: "reports",
                  description: "reports directory exists.",
                  required: true,
                },
                {
                  id: "summary-content",
                  order: 2,
                  visibility: "hidden",
                  kind: "file_content_equals",
                  path: "reports\\summary.txt",
                  description: "summary.txt has the requested content.",
                  expectedContent: "daily summary\n",
                  required: true,
                },
              ],
            }),
          ],
        }),
        commandLesson({
          id: moveFilesLessonId,
          chapterId: "chapter_command3_virtual_filesystem",
          slug: "move-files",
          title: "Lesson 02: move files",
          objective: "copy と moveで仮想fileを複製・移動する。",
          explanationMd: "file整理では、元fileを残すcopyと、場所や名前を変えるmoveを使い分けます。ここでも操作対象は仮想filesystemだけです。",
          taskMd: "`draft.txt` を `archive\\draft-backup.txt` にcopyし、その後 `draft.txt` を `final.txt` にmoveしてください。",
          starterCode: "dir",
          sampleInput: "",
          sampleOutput: "archive\\draft-backup.txt\nfinal.txt",
          constraints: [
            "`copy` と `move` の両方を使ってください。",
            "`draft.txt` は最後に元の場所からなくなっている必要があります。",
            "hidden条件の詳細は採点結果に表示されません。",
          ],
          difficulty: 2,
          estimatedMinutes: 12,
          order: 2,
          hints: [
            "`copy draft.txt archive\\draft-backup.txt` でbackupを作れます。",
            "`move draft.txt final.txt` で元fileを移動できます。",
            "`dir archive` でarchive内を確認できます。",
          ],
          exercises: [
            commandExercise({
              id: "ex_command3_02_move_files_01",
              lessonId: moveFilesLessonId,
              promptMd: "仮想fileをbackupしてからrenameしてください。",
              starterCode: "dir",
              completionCriteria: "backupとfinal fileがあり、draft.txtが残っていない。",
              environment: {
                ...commandBaseEnvironment,
                entries: [
                  ...commandBaseEnvironment.entries,
                  { path: "C:\\Users\\student\\archive", type: "directory" },
                  { path: "C:\\Users\\student\\draft.txt", type: "file", content: "ready\n" },
                ],
              },
              requirements: [
                {
                  id: "backup-created",
                  order: 1,
                  visibility: "public",
                  kind: "file_content_equals",
                  path: "archive\\draft-backup.txt",
                  description: "archive\\draft-backup.txt exists with the copied content.",
                  expectedContent: "ready\n",
                  required: true,
                },
                {
                  id: "draft-removed",
                  order: 2,
                  visibility: "hidden",
                  kind: "file_not_exists",
                  path: "draft.txt",
                  description: "draft.txt is no longer in the original location.",
                  required: true,
                },
                {
                  id: "final-created",
                  order: 3,
                  visibility: "hidden",
                  kind: "file_content_equals",
                  path: "final.txt",
                  description: "final.txt keeps the moved content.",
                  expectedContent: "ready\n",
                  required: true,
                },
              ],
            }),
          ],
        }),
        commandLesson({
          id: deleteFilesLessonId,
          chapterId: "chapter_command3_virtual_filesystem",
          slug: "delete-files",
          title: "Lesson 03: delete files",
          objective: "del と rmdirで不要な仮想file/directoryを削除する。",
          explanationMd: "削除操作は元に戻しにくいため、Programming Trainerでは必ず仮想filesystemだけで練習します。このLessonではfile削除と空directory削除を区別します。",
          taskMd: "`old.tmp` を削除し、空の `scratch` directoryも削除してください。`logs\\today.log` は残してください。",
          starterCode: "dir",
          sampleInput: "",
          sampleOutput: "old.tmp removed\nscratch removed",
          constraints: [
            "`del old.tmp` でfileを削除してください。",
            "`rmdir scratch` で空directoryを削除してください。",
            "`logs\\today.log` は削除しないでください。",
          ],
          difficulty: 2,
          estimatedMinutes: 12,
          order: 3,
          hints: [
            "`del` はfile削除に使います。",
            "`rmdir` は空directory削除に使います。",
            "消してよいものと残すものを `dir` で確認しましょう。",
          ],
          exercises: [
            commandExercise({
              id: "ex_command3_03_delete_files_01",
              lessonId: deleteFilesLessonId,
              promptMd: "不要な仮想fileと空directoryだけを削除してください。",
              starterCode: "dir",
              completionCriteria: "old.tmpとscratchがなくなり、logs\\today.logは残る。",
              environment: {
                ...commandBaseEnvironment,
                entries: [
                  ...commandBaseEnvironment.entries,
                  { path: "C:\\Users\\student\\logs", type: "directory" },
                  { path: "C:\\Users\\student\\logs\\today.log", type: "file", content: "keep\n" },
                  { path: "C:\\Users\\student\\scratch", type: "directory" },
                  { path: "C:\\Users\\student\\old.tmp", type: "file", content: "remove\n" },
                ],
              },
              requirements: [
                {
                  id: "old-file-deleted",
                  order: 1,
                  visibility: "public",
                  kind: "file_not_exists",
                  path: "old.tmp",
                  description: "old.tmp has been deleted.",
                  required: true,
                },
                {
                  id: "scratch-removed",
                  order: 2,
                  visibility: "hidden",
                  kind: "file_not_exists",
                  path: "scratch",
                  description: "scratch directory has been removed.",
                  required: true,
                },
                {
                  id: "log-kept",
                  order: 3,
                  visibility: "hidden",
                  kind: "file_content_equals",
                  path: "logs\\today.log",
                  description: "logs\\today.log is still present.",
                  expectedContent: "keep\n",
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
