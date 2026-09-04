import { describe, expect, it } from "vitest";
import type { GradeResult } from "../features/grading";
import type { RunResult } from "../features/runner";
import { createAttempt, createGradeSummaryResult } from "../features/progress/attempts";

const baseRunResult: RunResult = {
  status: "success",
  stdout: "actual\n",
  stderr: "",
  durationMs: 4,
};

function createGradeResult(overrides?: Partial<GradeResult>): GradeResult {
  return {
    passed: false,
    totalRequired: 2,
    passedRequired: 1,
    results: [
      {
        testCaseId: "public",
        order: 1,
        visibility: "public",
        passed: true,
        required: true,
        stdin: "",
        expectedStdout: "ok\n",
        actualStdout: "ok\n",
        stderr: "",
        status: "success",
        errorType: undefined,
        durationMs: 1,
      },
      {
        testCaseId: "hidden",
        order: 2,
        visibility: "hidden",
        passed: false,
        required: true,
        actualStdout: "wrong\n",
        stderr: "",
        status: "success",
        errorType: undefined,
        durationMs: 1,
      },
    ],
    ...overrides,
  };
}

describe("LessonWorkspacePage attempt helpers", () => {
  it("uses one parent attempt id for nested test results", () => {
    const attempt = createAttempt("lesson", "exercise", "print('ok')", "", baseRunResult, false, createGradeResult());

    expect(attempt.id).toMatch(/^attempt:/);
    expect(attempt.testResults?.map((result) => result.attemptId)).toEqual([attempt.id, attempt.id]);
  });

  it("keeps execution status success when grading only fails by output mismatch", () => {
    const summary = createGradeSummaryResult(createGradeResult());

    expect(summary.status).toBe("success");
    expect(summary.errorType).toBeUndefined();
  });

  it("uses the first real execution failure for the grading summary", () => {
    const summary = createGradeSummaryResult(createGradeResult({
      results: [
        createGradeResult().results[0],
        {
          ...createGradeResult().results[1],
          status: "runtime_error",
          errorType: "runtime_error",
          stderr: "Traceback",
        },
      ],
    }));

    expect(summary.status).toBe("runtime_error");
    expect(summary.errorType).toBe("runtime_error");
  });
});
