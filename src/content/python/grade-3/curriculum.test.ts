import { describe, expect, it } from "vitest";
import { pythonGrade3Course } from "./curriculum";

describe("python grade 3 curriculum seed", () => {
  it("keeps the Language > Level > Course > Chapter > Lesson > Exercise > TestCase shape", () => {
    const chapter = pythonGrade3Course.chapters[0];
    const lesson = chapter.lessons[0];
    const exercise = lesson.exercises[0];
    const testCase = exercise.testCases[0];

    expect(pythonGrade3Course.languageId).toBe("lang_python");
    expect(pythonGrade3Course.levelId).toBe("level_python_3");
    expect(chapter.courseId).toBe(pythonGrade3Course.id);
    expect(lesson.chapterId).toBe(chapter.id);
    expect(exercise.lessonId).toBe(lesson.id);
    expect(testCase.visibility).toBe("public");
  });

  it("publishes Lesson 4 with public and hidden arithmetic test cases", () => {
    const lesson = pythonGrade3Course.chapters[0].lessons.find((candidate) => candidate.id === "lesson_py3_04_types_operators");
    const exercise = lesson?.exercises[0];

    expect(lesson).toMatchObject({
      title: "Lesson 04: 型と演算子",
      status: "published",
      order: 4,
    });
    expect(exercise).toMatchObject({
      id: "ex_py3_04_01",
      lessonId: "lesson_py3_04_types_operators",
      gradingMode: "stdout",
    });
    expect(exercise?.testCases.map((testCase) => testCase.visibility)).toEqual(["public", "hidden"]);
    expect(exercise?.testCases.map((testCase) => testCase.expectedStdout)).toEqual(["7\n12\n", "13\n40\n"]);
  });

  it("publishes Lesson 5 with if/else pass and retry test cases", () => {
    const lesson = pythonGrade3Course.chapters[0].lessons.find((candidate) => candidate.id === "lesson_py3_05_if");
    const exercise = lesson?.exercises[0];

    expect(lesson).toMatchObject({
      title: "Lesson 05: if",
      status: "published",
      order: 5,
    });
    expect(exercise).toMatchObject({
      id: "ex_py3_05_01",
      lessonId: "lesson_py3_05_if",
      gradingMode: "stdout",
    });
    expect(exercise?.testCases.map((testCase) => testCase.stdin)).toEqual(["72\n", "45\n"]);
    expect(exercise?.testCases.map((testCase) => testCase.expectedStdout)).toEqual(["pass\n", "retry\n"]);
  });

  it("publishes Lesson 6 with for loop range test cases", () => {
    const lesson = pythonGrade3Course.chapters[0].lessons.find((candidate) => candidate.id === "lesson_py3_06_for");
    const exercise = lesson?.exercises[0];

    expect(lesson).toMatchObject({
      title: "Lesson 06: for",
      status: "published",
      order: 6,
    });
    expect(exercise).toMatchObject({
      id: "ex_py3_06_01",
      lessonId: "lesson_py3_06_for",
      gradingMode: "stdout",
    });
    expect(exercise?.testCases.map((testCase) => testCase.stdin)).toEqual(["3\n", "5\n"]);
    expect(exercise?.testCases.map((testCase) => testCase.expectedStdout)).toEqual(["1\n2\n3\n", "1\n2\n3\n4\n5\n"]);
  });

  it("publishes Lesson 7 with while loop countdown test cases", () => {
    const lesson = pythonGrade3Course.chapters[0].lessons.find((candidate) => candidate.id === "lesson_py3_07_while");
    const exercise = lesson?.exercises[0];

    expect(lesson).toMatchObject({
      title: "Lesson 07: while",
      status: "published",
      order: 7,
    });
    expect(exercise).toMatchObject({
      id: "ex_py3_07_01",
      lessonId: "lesson_py3_07_while",
      gradingMode: "stdout",
    });
    expect(exercise?.testCases.map((testCase) => testCase.stdin)).toEqual(["3\n", "5\n"]);
    expect(exercise?.testCases.map((testCase) => testCase.expectedStdout)).toEqual(["3\n2\n1\n", "5\n4\n3\n2\n1\n"]);
  });
});
