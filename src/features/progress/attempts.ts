import type { Attempt } from "../../domain/progress";
import type { GradeResult } from "../grading";
import type { RunResult } from "../runner";
import { localUserId } from "../../repositories";

export function createGradeSummaryResult(grade: GradeResult): RunResult {
  const firstExecutionFailure = grade.results.find((result) => result.status !== "success");
  return {
    status: firstExecutionFailure?.status ?? "success",
    stdout: grade.results.map((result) => result.actualStdout).join("\n"),
    stderr: grade.results.map((result) => result.stderr).filter(Boolean).join("\n"),
    durationMs: grade.results.reduce((total, result) => total + result.durationMs, 0),
    errorType: grade.results.find((result) => result.errorType)?.errorType,
  };
}

export function createAttempt(lessonId: string, exerciseId: string, code: string, stdin: string, result: RunResult, passed: boolean, grade?: GradeResult): Attempt {
  const now = new Date().toISOString();
  const attemptId = "attempt:" + crypto.randomUUID();
  return {
    id: attemptId,
    userId: localUserId,
    lessonId,
    exerciseId,
    sourceCode: code,
    stdin,
    executionStatus: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    passed,
    durationMs: result.durationMs,
    createdAt: now,
    testResults: grade?.results.map((testResult) => ({
      id: "attempt-test:" + crypto.randomUUID(),
      attemptId,
      testCaseId: testResult.testCaseId,
      passed: testResult.passed,
      actualStdout: testResult.actualStdout,
      errorType: testResult.errorType,
      durationMs: testResult.durationMs,
    })),
  };
}
