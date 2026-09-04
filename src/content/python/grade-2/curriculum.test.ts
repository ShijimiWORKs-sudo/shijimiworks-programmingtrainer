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
      "lesson_py2_03_exceptions",
      "lesson_py2_04_virtual_file_io",
      "lesson_py2_05_algorithm_debug",
      "lesson_py2_06_small_project",
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
    expect(pythonGrade2Course.chapters[0].lessons[2]).toMatchObject({
      id: "lesson_py2_03_exceptions",
      title: "Lesson 03: exception",
      status: "published",
      order: 3,
    });
    expect(pythonGrade2Course.chapters[0].lessons[2].exercises[0].testCases.map((testCase) => testCase.visibility)).toEqual([
      "public",
      "hidden",
    ]);
    expect(pythonGrade2Course.chapters[0].lessons[3]).toMatchObject({
      id: "lesson_py2_04_virtual_file_io",
      title: "Lesson 04: virtual file I/O",
      status: "published",
      order: 4,
    });
    expect(pythonGrade2Course.chapters[0].lessons[3].starterCode).toContain("open(\"report.txt\"");
    expect(pythonGrade2Course.chapters[0].lessons[3].starterCode).not.toContain("C:\\");
    expect(pythonGrade2Course.chapters[0].lessons[3].starterCode).not.toContain("/");
    expect(pythonGrade2Course.chapters[0].lessons[3].exercises[0].testCases.map((testCase) => testCase.visibility)).toEqual([
      "public",
      "hidden",
    ]);
    expect(pythonGrade2Course.chapters[0].lessons[4]).toMatchObject({
      id: "lesson_py2_05_algorithm_debug",
      title: "Lesson 05: algorithm debug",
      status: "published",
      order: 5,
    });
    expect(pythonGrade2Course.chapters[0].lessons[4].starterCode).toContain("best = 0");
    expect(pythonGrade2Course.chapters[0].lessons[4].starterCode).toContain("if score < best");
    expect(pythonGrade2Course.chapters[0].lessons[4].exercises[0].testCases.map((testCase) => testCase.visibility)).toEqual([
      "public",
      "hidden",
    ]);
    expect(pythonGrade2Course.chapters[0].lessons[5]).toMatchObject({
      id: "lesson_py2_06_small_project",
      title: "Lesson 06: small project",
      status: "published",
      order: 6,
    });
    expect(pythonGrade2Course.chapters[0].lessons[5].starterCode).toContain("class ScoreBook");
    expect(pythonGrade2Course.chapters[0].lessons[5].starterCode).toContain("open(\"summary.txt\"");
    expect(pythonGrade2Course.chapters[0].lessons[5].exercises[0].testCases.map((testCase) => testCase.visibility)).toEqual([
      "public",
      "hidden",
    ]);
    expect(pythonGrade2Course.mockExams).toEqual([]);
  });
});
