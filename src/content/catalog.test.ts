import { describe, expect, it } from "vitest";
import { findChallengeById, findLessonById, findMockExamById, getAllChallenges, getAllMockExams } from "./catalog";

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
});
