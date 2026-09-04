import { describe, expect, it } from "vitest";
import type { MockExam, MockExamProblem } from "../../domain/curriculum";
import type { GradeResult } from "./GradingEngine";
import { buildMockExamResult } from "./mockExamScoring";

function problem(id: string, order: number): MockExamProblem {
  return {
    id,
    examId: "exam",
    order,
    sourceLessonIds: ["lesson"],
    type: "code",
    promptMd: "Solve it.",
    starterCode: "",
    gradingMode: "stdout",
    timeoutMs: 3000,
    completionCriteria: "Pass required tests.",
    testCases: [],
  };
}

const problems = [problem("problem-1", 1), problem("problem-2", 2)];

const exam: MockExam = {
  id: "exam",
  courseId: "course",
  slug: "trial",
  title: "Trial Exam",
  descriptionMd: "Trial",
  status: "published",
  timeLimitMinutes: 25,
  passingScorePercent: 100,
  problems,
};

function grade(passedPublic: boolean, passedHidden: boolean): GradeResult {
  const results = [
    {
      testCaseId: "public",
      order: 1,
      visibility: "public" as const,
      passed: passedPublic,
      required: true,
      stdin: "4\n",
      expectedStdout: "even\n",
      actualStdout: passedPublic ? "even\n" : "4\n",
      stderr: "",
      status: "success" as const,
      errorType: undefined,
      durationMs: 1,
    },
    {
      testCaseId: "hidden",
      order: 2,
      visibility: "hidden" as const,
      passed: passedHidden,
      required: true,
      stdin: undefined,
      expectedStdout: undefined,
      actualStdout: passedHidden ? "odd\n" : "17\n",
      stderr: "",
      status: "success" as const,
      errorType: undefined,
      durationMs: 1,
    },
  ];

  return {
    passed: passedPublic && passedHidden,
    totalRequired: 2,
    passedRequired: results.filter((result) => result.passed).length,
    results,
  };
}

describe("mock exam scoring", () => {
  it("scores and passes only when every required test meets the threshold", () => {
    const result = buildMockExamResult(exam, [
      { problem: problems[0], grade: grade(true, true) },
      { problem: problems[1], grade: grade(true, true) },
    ], "2026-09-04T00:00:00.000Z");

    expect(result).toMatchObject({
      scorePercent: 100,
      passed: true,
      passedProblems: 2,
      totalProblems: 2,
      passedRequiredCount: 4,
      totalRequiredCount: 4,
    });
  });

  it("keeps hidden test details out of persisted result summaries", () => {
    const result = buildMockExamResult(exam, [
      { problem: problems[0], grade: grade(true, false) },
      { problem: problems[1], grade: grade(true, true) },
    ], "2026-09-04T00:00:00.000Z");

    expect(result.scorePercent).toBe(75);
    expect(result.passed).toBe(false);
    expect(result.problemResults[0]).toMatchObject({
      hiddenPassedRequiredCount: 0,
      hiddenRequiredCount: 1,
    });
    expect(result.problemResults[0].publicResults).toHaveLength(1);
    expect(JSON.stringify(result.problemResults[0].publicResults)).not.toContain("17");
    expect(JSON.stringify(result.problemResults[0].publicResults)).not.toContain("hidden");
  });
});
