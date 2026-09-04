import { describe, expect, it } from "vitest";
import { validateProjectExercise } from "../../../features/project/projectExercise";
import { pythonGrade1Course } from "./curriculum";

describe("python grade 1 curriculum seed", () => {
  it("adds a routeable bug fix lesson with project metadata", () => {
    const lesson = pythonGrade1Course.chapters[0].lessons[0];
    const exercise = lesson.exercises[0];

    expect(pythonGrade1Course).toMatchObject({
      id: "course_python_grade_1",
      languageId: "lang_python",
      levelId: "level_python_1",
      title: "Python 1級",
    });
    expect(lesson).toMatchObject({
      id: "lesson_py1_01_bug_fix",
      title: "Lesson 01: bug fix",
      status: "published",
      order: 1,
    });
    expect(exercise.project).toMatchObject({
      entryFilePath: "main.py",
      files: [
        { path: "main.py", editable: true, purpose: "entry" },
        { path: "tests/test_greeting.py", editable: false, purpose: "test" },
      ],
    });
    expect(exercise.project ? validateProjectExercise(exercise.project) : ["missing project"]).toEqual([]);
    expect(exercise.testCases.map((testCase) => testCase.visibility)).toEqual(["public", "hidden"]);
  });

  it("adds a routeable specification change lesson with public and hidden coverage", () => {
    const lesson = pythonGrade1Course.chapters[0].lessons[1];
    const exercise = lesson.exercises[0];

    expect(lesson).toMatchObject({
      id: "lesson_py1_02_specification_change",
      title: "Lesson 02: specification change",
      status: "published",
      order: 2,
    });
    expect(exercise.project).toMatchObject({
      entryFilePath: "main.py",
      files: [
        { path: "main.py", editable: true, purpose: "entry" },
        { path: "tests/test_order_total.py", editable: false, purpose: "test" },
      ],
    });
    expect(exercise.project ? validateProjectExercise(exercise.project) : ["missing project"]).toEqual([]);
    expect(exercise.testCases.map((testCase) => testCase.visibility)).toEqual(["public", "public", "hidden"]);
    expect(exercise.project?.files.map((file) => file.content).join("\n")).not.toContain("5100");
  });

  it("adds a routeable test-oriented lesson with visible support tests", () => {
    const lesson = pythonGrade1Course.chapters[0].lessons[2];
    const exercise = lesson.exercises[0];

    expect(lesson).toMatchObject({
      id: "lesson_py1_03_test_oriented",
      title: "Lesson 03: test-oriented task",
      status: "published",
      order: 3,
    });
    expect(exercise.project).toMatchObject({
      entryFilePath: "main.py",
      files: [
        { path: "main.py", editable: true, purpose: "entry" },
        { path: "tests/test_scores.py", editable: false, purpose: "test" },
      ],
    });
    expect(exercise.project ? validateProjectExercise(exercise.project) : ["missing project"]).toEqual([]);
    expect(exercise.testCases.map((testCase) => testCase.visibility)).toEqual(["public", "public", "hidden"]);
    expect(exercise.project?.files.map((file) => file.content).join("\n")).not.toContain("100,no,40,75");
  });

  it("adds a routeable refactoring lesson with behavior-preserving tests", () => {
    const lesson = pythonGrade1Course.chapters[0].lessons[3];
    const exercise = lesson.exercises[0];

    expect(lesson).toMatchObject({
      id: "lesson_py1_04_refactoring",
      title: "Lesson 04: refactoring",
      status: "published",
      order: 4,
    });
    expect(exercise.project).toMatchObject({
      entryFilePath: "main.py",
      files: [
        { path: "main.py", editable: true, purpose: "entry" },
        { path: "tests/test_label_grade.py", editable: false, purpose: "test" },
      ],
    });
    expect(exercise.project ? validateProjectExercise(exercise.project) : ["missing project"]).toEqual([]);
    expect(exercise.testCases.map((testCase) => testCase.visibility)).toEqual(["public", "public", "hidden"]);
    expect(exercise.project?.files.map((file) => file.content).join("\n")).not.toContain("Nia");
  });
});
