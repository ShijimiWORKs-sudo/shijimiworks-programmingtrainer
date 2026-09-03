import type { Exercise, TestCase } from "../../domain/curriculum";
import type { LanguageRunner, RunResult } from "../runner";
import { compareOutput } from "./compare";

export interface TestCaseGradeResult {
  testCaseId: string;
  order: number;
  visibility: TestCase["visibility"];
  passed: boolean;
  required: boolean;
  stdin?: string;
  expectedStdout?: string;
  actualStdout: string;
  stderr: string;
  status: RunResult["status"];
  errorType: RunResult["errorType"];
  durationMs: number;
}

export interface GradeResult {
  passed: boolean;
  totalRequired: number;
  passedRequired: number;
  results: TestCaseGradeResult[];
}

export class GradingEngine {
  constructor(private readonly runner: LanguageRunner) {}

  async gradeExercise(exercise: Exercise, sourceCode: string): Promise<GradeResult> {
    const results: TestCaseGradeResult[] = [];

    for (const testCase of [...exercise.testCases].sort((a, b) => a.order - b.order)) {
      const runResult = await this.runner.run({
        sourceCode,
        stdin: testCase.stdin,
        timeoutMs: exercise.timeoutMs,
      });
      const passed =
        runResult.status === "success" &&
        compareOutput(runResult.stdout, testCase.expectedStdout, testCase.comparator);

      results.push({
        testCaseId: testCase.id,
        order: testCase.order,
        visibility: testCase.visibility,
        passed,
        required: testCase.required,
        stdin: testCase.visibility === "public" ? testCase.stdin : undefined,
        expectedStdout: testCase.visibility === "public" ? testCase.expectedStdout : undefined,
        actualStdout: runResult.stdout,
        stderr: runResult.stderr,
        status: runResult.status,
        errorType: runResult.errorType,
        durationMs: runResult.durationMs,
      });
    }

    const requiredResults = results.filter((result) => result.required);
    const passedRequired = requiredResults.filter((result) => result.passed).length;

    return {
      passed: requiredResults.length > 0 && passedRequired === requiredResults.length,
      totalRequired: requiredResults.length,
      passedRequired,
      results,
    };
  }
}
