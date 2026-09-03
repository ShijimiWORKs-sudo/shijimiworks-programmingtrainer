import { describe, expect, it } from "vitest";
import type { Exercise } from "../../domain/curriculum";
import type { LanguageRunner, RunRequest } from "../runner";
import { GradingEngine } from "./GradingEngine";

class FakeRunner implements LanguageRunner {
  requests: RunRequest[] = [];

  async initialize() {}
  async cancel() {}
  async reset() {}
  async dispose() {}

  async run(request: RunRequest) {
    this.requests.push(request);
    return {
      status: "success" as const,
      stdout: request.stdin === "hidden\n" ? "secret\n" : "ok\n",
      stderr: "",
      durationMs: 1,
    };
  }
}

const exercise: Exercise = {
  id: "exercise",
  lessonId: "lesson",
  type: "code",
  promptMd: "prompt",
  starterCode: "",
  gradingMode: "stdout",
  timeoutMs: 3000,
  completionCriteria: "all required tests pass",
  testCases: [
    {
      id: "public",
      order: 1,
      visibility: "public",
      stdin: "",
      expectedStdout: "ok\n",
      comparator: "trimmed_text",
      weight: 1,
      required: true,
    },
    {
      id: "hidden",
      order: 2,
      visibility: "hidden",
      stdin: "hidden\n",
      expectedStdout: "secret\n",
      comparator: "trimmed_text",
      weight: 1,
      required: true,
    },
  ],
};

describe("GradingEngine", () => {
  it("aggregates required test case results without leaking hidden expected output", async () => {
    const result = await new GradingEngine(new FakeRunner()).gradeExercise(exercise, "print('ok')");

    expect(result.passed).toBe(true);
    expect(result.passedRequired).toBe(2);
    expect(result.totalRequired).toBe(2);
    expect(result.results[1].visibility).toBe("hidden");
    expect(result.results[1].expectedStdout).toBeUndefined();
  });
});
