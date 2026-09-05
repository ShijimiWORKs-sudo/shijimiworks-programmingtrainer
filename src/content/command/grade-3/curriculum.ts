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
    status: "published",
  };
}

const createFilesLessonId = "lesson_command3_01_create_files";
const moveFilesLessonId = "lesson_command3_02_move_files";
const deleteFilesLessonId = "lesson_command3_03_delete_files";

function commandFileLesson(seed: {
  order: number;
  id: string;
  slug: string;
  title: string;
  objective: string;
  taskMd: string;
  starterCode: string;
  environment?: CommandVirtualEnvironment;
  requirements: Exercise["commandFileRequirements"];
  hints: string[];
}): Lesson {
  return commandLesson({
    id: seed.id,
    chapterId: "chapter_command3_virtual_filesystem",
    slug: seed.slug,
    title: seed.title,
    objective: seed.objective,
    explanationMd: "Commandの基本操作を、Programming Trainerの仮想filesystemだけで練習します。実際のPC上のfileやdirectoryは変更されません。",
    taskMd: seed.taskMd,
    starterCode: seed.starterCode,
    sampleInput: "",
    sampleOutput: "Virtual filesystem updated",
    constraints: [
      "host filesystemではなく仮想filesystemだけを操作します。",
      "指定されたfile名とdirectory名を正確に使ってください。",
      "hidden条件の詳細は採点結果に表示されません。",
    ],
    difficulty: seed.order >= 7 ? 2 : 1,
    estimatedMinutes: seed.order >= 7 ? 12 : 10,
    order: seed.order,
    hints: seed.hints,
    exercises: [
      commandExercise({
        id: `ex_${seed.id.replace("lesson_", "")}_01`,
        lessonId: seed.id,
        promptMd: seed.taskMd,
        starterCode: seed.starterCode,
        completionCriteria: "仮想filesystemの状態が条件を満たす。",
        environment: seed.environment ?? commandBaseEnvironment,
        requirements: seed.requirements,
      }),
    ],
  });
}

const additionalCommandGrade3Lessons: Lesson[] = [
  commandFileLesson({
    order: 4,
    id: "lesson_command3_04_relative_paths",
    slug: "relative-paths",
    title: "Lesson 04: relative paths",
    objective: "相対pathでdirectory内のfileを作成する。",
    taskMd: "`work` directoryを作り、`work\\memo.txt` に `memo ready` と書き込んでください。",
    starterCode: "dir",
    hints: ["先に `mkdir work` を実行します。", "`echo memo ready > work\\memo.txt` でfileを作成できます。"],
    requirements: [
      { id: "work-directory", order: 1, visibility: "public", kind: "directory_exists", path: "work", description: "work directory exists.", required: true },
      { id: "memo-content", order: 2, visibility: "hidden", kind: "file_content_equals", path: "work\\memo.txt", description: "memo.txt has the requested content.", expectedContent: "memo ready\n", required: true },
    ],
  }),
  commandFileLesson({
    order: 5,
    id: "lesson_command3_05_copy_into_directory",
    slug: "copy-into-directory",
    title: "Lesson 05: copy into directory",
    objective: "copyで既存fileを別directoryへ複製する。",
    taskMd: "`source.txt` を `archive` directoryへcopyしてください。",
    starterCode: "dir",
    environment: {
      ...commandBaseEnvironment,
      entries: [
        ...commandBaseEnvironment.entries,
        { path: "C:\\Users\\student\\archive", type: "directory" },
        { path: "C:\\Users\\student\\source.txt", type: "file", content: "source ready\n" },
      ],
    },
    hints: ["`copy source.txt archive` のようにdirectoryを宛先にできます。", "`dir archive` でcopy結果を確認できます。"],
    requirements: [
      { id: "archive-copy", order: 1, visibility: "public", kind: "file_content_equals", path: "archive\\source.txt", description: "source.txt is copied into archive.", expectedContent: "source ready\n", required: true },
      { id: "source-kept", order: 2, visibility: "hidden", kind: "file_content_equals", path: "source.txt", description: "source.txt remains in the original location.", expectedContent: "source ready\n", required: true },
    ],
  }),
  commandFileLesson({
    order: 6,
    id: "lesson_command3_06_quoted_paths",
    slug: "quoted-paths",
    title: "Lesson 06: quoted paths",
    objective: "空白を含むpathを引用符で扱う。",
    taskMd: "`daily logs` directoryを作り、`daily logs\\today.txt` に `log ready` と書き込んでください。",
    starterCode: "dir",
    hints: ["空白を含むpathは引用符で囲みます。", '`mkdir "daily logs"` のように書けます。'],
    requirements: [
      { id: "daily-logs-directory", order: 1, visibility: "public", kind: "directory_exists", path: "daily logs", description: "daily logs directory exists.", required: true },
      { id: "today-log-content", order: 2, visibility: "hidden", kind: "file_content_equals", path: "daily logs\\today.txt", description: "today.txt has the requested content.", expectedContent: "log ready\n", required: true },
    ],
  }),
  commandFileLesson({
    order: 7,
    id: "lesson_command3_07_delete_tmp_file",
    slug: "delete-tmp-file",
    title: "Lesson 07: delete temp file",
    objective: "delで不要な一時fileを削除する。",
    taskMd: "`tmp.txt` を削除してください。`keep.txt` は残してください。",
    starterCode: "dir",
    environment: {
      ...commandBaseEnvironment,
      entries: [
        ...commandBaseEnvironment.entries,
        { path: "C:\\Users\\student\\tmp.txt", type: "file", content: "remove\n" },
        { path: "C:\\Users\\student\\keep.txt", type: "file", content: "keep\n" },
      ],
    },
    hints: ["file削除は `del tmp.txt` です。", "必要なfileまで削除しないようにしましょう。"],
    requirements: [
      { id: "tmp-deleted", order: 1, visibility: "public", kind: "file_not_exists", path: "tmp.txt", description: "tmp.txt has been deleted.", required: true },
      { id: "keep-file-remains", order: 2, visibility: "hidden", kind: "file_content_equals", path: "keep.txt", description: "keep.txt remains.", expectedContent: "keep\n", required: true },
    ],
  }),
  commandFileLesson({
    order: 8,
    id: "lesson_command3_08_remove_empty_directory",
    slug: "remove-empty-directory",
    title: "Lesson 08: remove empty directory",
    objective: "rmdirで空directoryを削除する。",
    taskMd: "空の`scratch` directoryを削除してください。",
    starterCode: "dir",
    environment: {
      ...commandBaseEnvironment,
      entries: [...commandBaseEnvironment.entries, { path: "C:\\Users\\student\\scratch", type: "directory" }],
    },
    hints: ["空directoryは `rmdir scratch` で削除できます。", "`del` はfile用、`rmdir` はdirectory用です。"],
    requirements: [
      { id: "scratch-removed", order: 1, visibility: "public", kind: "file_not_exists", path: "scratch", description: "scratch directory has been removed.", required: true },
    ],
  }),
  commandFileLesson({
    order: 9,
    id: "lesson_command3_09_move_to_archive",
    slug: "move-to-archive",
    title: "Lesson 09: move to archive",
    objective: "moveでfileを整理用directoryへ移動する。",
    taskMd: "`todo.txt` を `archive\\todo.txt` へmoveしてください。",
    starterCode: "dir",
    environment: {
      ...commandBaseEnvironment,
      entries: [
        ...commandBaseEnvironment.entries,
        { path: "C:\\Users\\student\\archive", type: "directory" },
        { path: "C:\\Users\\student\\todo.txt", type: "file", content: "finish\n" },
      ],
    },
    hints: ["`move todo.txt archive\\todo.txt` と書きます。", "move後は元の場所にfileが残りません。"],
    requirements: [
      { id: "todo-moved", order: 1, visibility: "public", kind: "file_content_equals", path: "archive\\todo.txt", description: "todo.txt is moved into archive.", expectedContent: "finish\n", required: true },
      { id: "todo-original-absent", order: 2, visibility: "hidden", kind: "file_not_exists", path: "todo.txt", description: "todo.txt is absent from the original location.", required: true },
    ],
  }),
  commandFileLesson({
    order: 10,
    id: "lesson_command3_10_file_workflow",
    slug: "file-workflow",
    title: "Lesson 10: file workflow",
    objective: "作成、copy、moveを組み合わせた小さなworkflowを完成する。",
    taskMd: "`release` directoryを作り、`release\\status.txt` に `done` と書き込んでください。",
    starterCode: "dir",
    hints: ["まず `mkdir release` です。", "`echo done > release\\status.txt` で完了状態を書き込みます。"],
    requirements: [
      { id: "release-directory", order: 1, visibility: "public", kind: "directory_exists", path: "release", description: "release directory exists.", required: true },
      { id: "status-content", order: 2, visibility: "hidden", kind: "file_content_equals", path: "release\\status.txt", description: "status.txt contains done.", expectedContent: "done\n", required: true },
    ],
  }),
];

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
        ...additionalCommandGrade3Lessons,
      ],
      challenges: [],
    },
  ],
  mockExams: [],
};
