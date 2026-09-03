import type { Course } from "../../../domain/curriculum";

export const pythonGrade3Course: Course = {
  id: "course_python_grade_3_foundation",
  languageId: "lang_python",
  levelId: "level_python_3",
  title: "Python 3級",
  description: "Python 3級カリキュラムのPhase 0用構造です。",
  curriculumVersion: "python-grade-3-v0.1.0",
  validFrom: "2026-09-03",
  chapters: [
    {
      id: "chapter_py3_foundation",
      courseId: "course_python_grade_3_foundation",
      title: "Foundation",
      description: "教材追加前の構造確認用チャプターです。",
      order: 1,
      lessons: [
        {
          id: "lesson_py3_foundation_workspace",
          chapterId: "chapter_py3_foundation",
          slug: "foundation-workspace",
          title: "Lesson Workspace",
          objective: "Lesson画面の基盤を確認する",
          explanationMd: "Phase 0では教材本文、実行、採点は実装しません。",
          taskMd: "将来のPython 3級教材を配置できる構造を確認します。",
          starterCode: "# Phase 0 placeholder\n",
          sampleInput: "",
          sampleOutput: "",
          difficulty: 1,
          estimatedMinutes: 5,
          order: 1,
          status: "draft",
          hints: [],
          exercises: [
            {
              id: "ex_py3_foundation_01",
              lessonId: "lesson_py3_foundation_workspace",
              type: "code",
              promptMd: "Phase 0用の構造確認Exerciseです。",
              starterCode: "# Phase 0 placeholder\n",
              gradingMode: "stdout",
              timeoutMs: 3000,
              testCases: [
                {
                  id: "tc_py3_foundation_01",
                  order: 1,
                  visibility: "public",
                  stdin: "",
                  expectedStdout: "",
                  comparator: "exact_text",
                  weight: 1,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
