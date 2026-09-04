import { describe, expect, it } from "vitest";
import { pythonGrade3Course } from "../../content/python/grade-3";
import type { MockExamResult } from "../../domain/progress";
import { buildMockExamReviewSuggestions } from "./mockExamReview";

const lessons = pythonGrade3Course.chapters.flatMap((chapter) => chapter.lessons);

function result(passed: boolean): MockExamResult {
  return {
    scorePercent: passed ? 100 : 75,
    passed,
    passingScorePercent: 100,
    passedProblems: passed ? 2 : 1,
    totalProblems: 2,
    passedRequiredCount: passed ? 4 : 3,
    totalRequiredCount: 4,
    submittedAt: "2026-09-04T00:00:00.000Z",
    problemResults: [
      {
        problemId: "problem-1",
        order: 1,
        sourceLessonIds: ["lesson_py3_01_print"],
        passed: true,
        passedRequiredCount: 2,
        totalRequiredCount: 2,
        hiddenPassedRequiredCount: 1,
        hiddenRequiredCount: 1,
        publicResults: [],
      },
      {
        problemId: "problem-2",
        order: 2,
        sourceLessonIds: ["lesson_py3_03_input", "lesson_py3_05_if"],
        passed,
        passedRequiredCount: passed ? 2 : 1,
        totalRequiredCount: 2,
        hiddenPassedRequiredCount: passed ? 1 : 0,
        hiddenRequiredCount: 1,
        publicResults: [],
      },
    ],
  };
}

describe("mock exam review suggestions", () => {
  it("returns no suggestions when all mock exam problems pass", () => {
    expect(buildMockExamReviewSuggestions(result(true), lessons)).toEqual([]);
  });

  it("maps failed problem source lessons into ordered review suggestions", () => {
    const suggestions = buildMockExamReviewSuggestions(result(false), lessons);

    expect(suggestions.map((suggestion) => suggestion.lessonId)).toEqual([
      "lesson_py3_03_input",
      "lesson_py3_05_if",
    ]);
    expect(suggestions[0]).toMatchObject({
      title: "Lesson 03: input / 入力",
      failedProblemCount: 1,
      failedRequiredCount: 1,
    });
  });
});
