import { describe, expect, it } from "vitest";
import { pythonGrade2Course } from "./curriculum";

describe("python grade 2 curriculum seed", () => {
  it("adds a routeable course skeleton with function deepening as the first lesson", () => {
    expect(pythonGrade2Course).toMatchObject({
      id: "course_python_grade_2",
      languageId: "lang_python",
      levelId: "level_python_2",
      title: "Python 2級",
      curriculumVersion: "0.1.0",
    });
    expect(pythonGrade2Course.chapters).toHaveLength(1);
    expect(pythonGrade2Course.chapters[0]).toMatchObject({
      id: "chapter_python_grade_2_foundation",
      order: 1,
      challenges: [],
    });
    expect(pythonGrade2Course.chapters[0].lessons.map((lesson) => lesson.id)).toEqual([
      "lesson_py2_01_function_return",
      "lesson_py2_02_classes",
    ]);
    expect(pythonGrade2Course.chapters[0].lessons[0]).toMatchObject({
      id: "lesson_py2_01_function_return",
      title: "Lesson 01: 関数の戻り値",
      status: "published",
      order: 1,
    });
    expect(pythonGrade2Course.chapters[0].lessons[0].exercises[0].testCases.map((testCase) => testCase.visibility)).toEqual([
      "public",
      "hidden",
    ]);
    expect(pythonGrade2Course.chapters[0].lessons[1]).toMatchObject({
      id: "lesson_py2_02_classes",
      title: "Lesson 02: class",
      status: "published",
      order: 2,
    });
    expect(pythonGrade2Course.chapters[0].lessons[1].exercises[0].testCases.map((testCase) => testCase.visibility)).toEqual([
      "public",
      "hidden",
    ]);
    expect(pythonGrade2Course.mockExams).toEqual([]);
  });
});
