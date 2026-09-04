import { describe, expect, it } from "vitest";
import { pythonGrade3Course } from "./curriculum";

describe("python grade 3 curriculum seed", () => {
  it("keeps published lessons with staged hints and runnable exercises", () => {
    const lessons = pythonGrade3Course.chapters.flatMap((chapter) => chapter.lessons);

    expect(lessons).toHaveLength(10);
    for (const lesson of lessons) {
      expect(lesson.status).toBe("published");
      expect(lesson.hints.length).toBeGreaterThanOrEqual(2);
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(1);
      for (const exercise of lesson.exercises) {
        expect(exercise.testCases.some((testCase) => testCase.visibility === "public")).toBe(true);
        expect(exercise.testCases.some((testCase) => testCase.visibility === "hidden")).toBe(true);
      }
    }
  });

  it("keeps the Language > Level > Course > Chapter > Lesson > Exercise > TestCase shape", () => {
    const chapter = pythonGrade3Course.chapters[0];
    const lesson = chapter.lessons[0];
    const exercise = lesson.exercises[0];
    const challenge = chapter.challenges[0];
    const challengeExercise = challenge.exercises[0];
    const testCase = exercise.testCases[0];

    expect(pythonGrade3Course.languageId).toBe("lang_python");
    expect(pythonGrade3Course.levelId).toBe("level_python_3");
    expect(chapter.courseId).toBe(pythonGrade3Course.id);
    expect(lesson.chapterId).toBe(chapter.id);
    expect(exercise.lessonId).toBe(lesson.id);
    expect(challenge.chapterId).toBe(chapter.id);
    expect(challengeExercise.challengeId).toBe(challenge.id);
    expect(testCase.visibility).toBe("public");
  });

  it("adds a Python 3 chapter challenge with gradable public and hidden coverage", () => {
    const lessons = pythonGrade3Course.chapters[0].lessons;
    const challenge = pythonGrade3Course.chapters[0].challenges[0];
    const exercise = challenge.exercises[0];
    const lessonIds = new Set(lessons.map((lesson) => lesson.id));

    expect(challenge).toMatchObject({
      id: "challenge_py3_basic_review",
      kind: "chapter_challenge",
      status: "published",
      passingRequiredCount: 2,
    });
    expect(challenge.sourceLessonIds).toHaveLength(10);
    expect(challenge.sourceLessonIds.every((lessonId) => lessonIds.has(lessonId))).toBe(true);
    expect(exercise).toMatchObject({
      id: "ex_challenge_py3_basic_review_01",
      challengeId: challenge.id,
      gradingMode: "stdout",
      timeoutMs: 3000,
    });
    expect(exercise.sourceLessonIds.every((lessonId) => lessonIds.has(lessonId))).toBe(true);
    expect(exercise.testCases.map((testCase) => testCase.visibility)).toEqual(["public", "hidden"]);
  });

  it("adds a Python 3 mock exam shell seed with ordered problems", () => {
    const exam = pythonGrade3Course.mockExams[0];
    const lessonIds = new Set(pythonGrade3Course.chapters.flatMap((chapter) => chapter.lessons).map((lesson) => lesson.id));

    expect(exam).toMatchObject({
      id: "mock_exam_py3_trial",
      title: "Python 3級 模擬試験",
      status: "published",
      timeLimitMinutes: 25,
    });
    expect(exam.problems.map((problem) => problem.order)).toEqual([1, 2]);
    for (const problem of exam.problems) {
      expect(problem.examId).toBe(exam.id);
      expect(problem.sourceLessonIds.every((lessonId) => lessonIds.has(lessonId))).toBe(true);
      expect(problem.testCases.length).toBeGreaterThanOrEqual(1);
    }
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

  it("publishes Lesson 8 with list update test cases", () => {
    const lesson = pythonGrade3Course.chapters[0].lessons.find((candidate) => candidate.id === "lesson_py3_08_list");
    const exercise = lesson?.exercises[0];

    expect(lesson).toMatchObject({
      title: "Lesson 08: list",
      status: "published",
      order: 8,
    });
    expect(exercise).toMatchObject({
      id: "ex_py3_08_01",
      lessonId: "lesson_py3_08_list",
      gradingMode: "stdout",
    });
    expect(exercise?.testCases.map((testCase) => testCase.stdin)).toEqual(["red\nblue\ngreen\n", "cat\ndog\neel\n"]);
    expect(exercise?.testCases.map((testCase) => testCase.expectedStdout)).toEqual(["red\nPython\ngreen\n", "cat\nPython\neel\n"]);
  });

  it("publishes Lesson 9 with dict update test cases", () => {
    const lesson = pythonGrade3Course.chapters[0].lessons.find((candidate) => candidate.id === "lesson_py3_09_dict");
    const exercise = lesson?.exercises[0];

    expect(lesson).toMatchObject({
      title: "Lesson 09: dict",
      status: "published",
      order: 9,
    });
    expect(exercise).toMatchObject({
      id: "ex_py3_09_01",
      lessonId: "lesson_py3_09_dict",
      gradingMode: "stdout",
    });
    expect(exercise?.testCases.map((testCase) => testCase.stdin)).toEqual(["apple\n120\n", "banana\n180\n"]);
    expect(exercise?.testCases.map((testCase) => testCase.expectedStdout)).toEqual(["120\n", "180\n"]);
  });

  it("publishes Lesson 10 with function call test cases", () => {
    const lesson = pythonGrade3Course.chapters[0].lessons.find((candidate) => candidate.id === "lesson_py3_10_functions");
    const exercise = lesson?.exercises[0];

    expect(lesson).toMatchObject({
      title: "Lesson 10: 関数",
      status: "published",
      order: 10,
    });
    expect(exercise).toMatchObject({
      id: "ex_py3_10_01",
      lessonId: "lesson_py3_10_functions",
      gradingMode: "stdout",
    });
    expect(exercise?.testCases.map((testCase) => testCase.stdin)).toEqual(["6\n", "11\n"]);
    expect(exercise?.testCases.map((testCase) => testCase.expectedStdout)).toEqual(["12\n", "22\n"]);
  });

  it("keeps Lesson 10 ready for multiple exercises", () => {
    const lesson = pythonGrade3Course.chapters[0].lessons.find((candidate) => candidate.id === "lesson_py3_10_functions");

    expect(lesson?.exercises.map((exercise) => exercise.id)).toEqual(["ex_py3_10_01", "ex_py3_10_02"]);
    expect(lesson?.exercises[1]).toMatchObject({
      promptMd: "関数で3倍の計算をまとめ、入力値へ適用して出力します。",
      starterCode: "def triple(number):\n    return number\n\nvalue = int(input())\nprint(triple(value))\n",
    });
    expect(lesson?.exercises[1].testCases.map((testCase) => testCase.expectedStdout)).toEqual(["12\n", "21\n"]);
  });
});
