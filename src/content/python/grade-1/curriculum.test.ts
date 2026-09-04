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
});
