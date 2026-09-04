import type { MockExam, MockExamProblem } from "../../domain/curriculum";
import type { MockExamProblemResult, MockExamResult } from "../../domain/progress";
import type { GradeResult } from "./GradingEngine";

interface ProblemGradeInput {
  problem: MockExamProblem;
  grade: GradeResult;
}

export function buildMockExamProblemResult(problem: MockExamProblem, grade: GradeResult): MockExamProblemResult {
  const requiredResults = grade.results.filter((result) => result.required);
  const hiddenRequiredResults = requiredResults.filter((result) => result.visibility === "hidden");

  return {
    problemId: problem.id,
    order: problem.order,
    sourceLessonIds: problem.sourceLessonIds,
    passed: grade.passed,
    passedRequiredCount: grade.passedRequired,
    totalRequiredCount: grade.totalRequired,
    hiddenPassedRequiredCount: hiddenRequiredResults.filter((result) => result.passed).length,
    hiddenRequiredCount: hiddenRequiredResults.length,
    publicResults: grade.results
      .filter((result) => result.visibility === "public")
      .map((result) => ({
        testCaseId: result.testCaseId,
        order: result.order,
        passed: result.passed,
        required: result.required,
        stdin: result.stdin,
        expectedStdout: result.expectedStdout,
        actualStdout: result.actualStdout,
        stderr: result.stderr,
        status: result.status,
        errorType: result.errorType,
        durationMs: result.durationMs,
      })),
  };
}

export function buildMockExamResult(
  exam: MockExam,
  problemGrades: ProblemGradeInput[],
  submittedAt: string
): MockExamResult {
  const problemResults = problemGrades
    .map(({ problem, grade }) => buildMockExamProblemResult(problem, grade))
    .sort((a, b) => a.order - b.order);
  const totalRequiredCount = problemResults.reduce((total, result) => total + result.totalRequiredCount, 0);
  const passedRequiredCount = problemResults.reduce((total, result) => total + result.passedRequiredCount, 0);
  const scorePercent = totalRequiredCount === 0 ? 0 : Math.round((passedRequiredCount / totalRequiredCount) * 100);

  return {
    scorePercent,
    passed: scorePercent >= exam.passingScorePercent,
    passingScorePercent: exam.passingScorePercent,
    passedProblems: problemResults.filter((result) => result.passed).length,
    totalProblems: exam.problems.length,
    passedRequiredCount,
    totalRequiredCount,
    submittedAt,
    problemResults,
  };
}
