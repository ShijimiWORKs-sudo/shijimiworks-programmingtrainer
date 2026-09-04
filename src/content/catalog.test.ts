import { describe, expect, it } from "vitest";
import { findChallengeById, findCourseByLessonId, findLessonById, findMockExamById, findNextLesson, getAllChallenges, getAllMockExams, languages } from "./catalog";

describe("content catalog", () => {
  it("finds Python grade 3 chapter challenges without affecting lesson lookup", () => {
    expect(findLessonById("lesson_py3_01_print")?.title).toBe("Lesson 01: print / 出力");
    expect(getAllChallenges().map((challenge) => challenge.id)).toContain("challenge_py3_basic_review");
    expect(findChallengeById("challenge_py3_basic_review")).toMatchObject({
      title: "Python 3級 章末課題: 基礎総復習",
      status: "published",
    });
  });

  it("finds Python grade 3 mock exams without affecting lesson lookup", () => {
    expect(getAllMockExams().map((exam) => exam.id)).toContain("mock_exam_py3_trial");
    expect(findMockExamById("mock_exam_py3_trial")).toMatchObject({
      title: "Python 3級 模擬試験",
      status: "published",
    });
    expect(findLessonById("mock_exam_py3_trial")).toBeUndefined();
  });

  it("enables only Python grade 2 as the next routeable skeleton level", () => {
    const python = languages.find((language) => language.slug === "python");
    const grade2 = python?.levels.find((level) => level.code === "grade-2");
    const grade1 = python?.levels.find((level) => level.code === "grade-1");

    expect(grade2).toMatchObject({
      status: "available",
      courses: [{ id: "course_python_grade_2" }],
    });
    expect(grade1).toMatchObject({
      status: "planned",
      courses: [],
    });
    expect(findLessonById("lesson_py3_01_print")?.title).toBe("Lesson 01: print / 出力");
  });

  it("finds Python grade 2 lessons without crossing next-lesson course boundaries", () => {
    expect(findLessonById("lesson_py2_01_function_return")).toMatchObject({
      title: "Lesson 01: 関数の戻り値",
      status: "published",
    });
    expect(findCourseByLessonId("lesson_py2_01_function_return")?.id).toBe("course_python_grade_2");
    expect(findNextLesson("lesson_py2_01_function_return")).toMatchObject({
      id: "lesson_py2_02_classes",
    });
    expect(findNextLesson("lesson_py2_02_classes")).toMatchObject({
      id: "lesson_py2_03_exceptions",
    });
    expect(findNextLesson("lesson_py2_03_exceptions")).toBeUndefined();
    expect(findNextLesson("lesson_py3_10_functions")).toBeUndefined();
  });
});
