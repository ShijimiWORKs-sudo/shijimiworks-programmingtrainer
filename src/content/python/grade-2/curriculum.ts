import type { Course } from "../../../domain/curriculum";

const courseId = "course_python_grade_2";

export const pythonGrade2Course: Course = {
  id: courseId,
  languageId: "lang_python",
  levelId: "level_python_2",
  title: "Python 2級",
  description: "関数の深掘り、class、例外、仮想ファイルI/O、アルゴリズムへ進むためのPython 2級コースです。",
  curriculumVersion: "0.1.0",
  validFrom: "2026-09-04",
  chapters: [
    {
      id: "chapter_python_grade_2_foundation",
      courseId,
      title: "Python 2級 Foundation",
      description: "P4-02以降でLessonを追加するための準備中Chapterです。",
      order: 1,
      lessons: [],
      challenges: [],
    },
  ],
  mockExams: [],
};
