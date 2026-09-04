import { describe, expect, it } from "vitest";
import {
  allExercisesPassed,
  createInitialChallengeProgress,
  createInitialMockExamSession,
  createInitialProgress,
  getMockExamAnswer,
  markPassed,
  saveMockExamAnswer,
  touchChallengeProgress,
  touchExerciseProgress,
  touchMockExamSession,
  touchProgress,
} from "./progressModel";

describe("progress model", () => {
  it("increments progress and marks passed", () => {
    const initial = createInitialProgress("user", "lesson", "starter");
    const edited = touchProgress(initial, { lastCode: "print('ok')", gradeCount: 1, status: "in_progress" });
    const passed = markPassed(edited);

    expect(passed.status).toBe("passed");
    expect(passed.lastCode).toBe("print('ok')");
    expect(passed.firstPassedAt).toBeDefined();
  });

  it("tracks last code and status per exercise", () => {
    const initial = createInitialProgress("user", "lesson", "starter one");
    const first = touchExerciseProgress(initial, "exercise-1", "starter one", {
      lastCode: "print('one')",
      status: "in_progress",
      runCount: 1,
    });
    const second = touchExerciseProgress(first, "exercise-2", "starter two", {
      lastCode: "print('two')",
      status: "passed",
      gradeCount: 1,
    });

    expect(second.activeExerciseId).toBe("exercise-2");
    expect(second.exerciseProgress?.["exercise-1"]).toMatchObject({ lastCode: "print('one')", runCount: 1 });
    expect(second.exerciseProgress?.["exercise-2"]).toMatchObject({ lastCode: "print('two')", status: "passed", gradeCount: 1 });
  });

  it("reports all exercises passed only after every exercise passes", () => {
    const initial = createInitialProgress("user", "lesson", "");
    const firstPassed = touchExerciseProgress(initial, "exercise-1", "", { status: "passed" });

    expect(allExercisesPassed(firstPassed, ["exercise-1", "exercise-2"])).toBe(false);

    const allPassed = touchExerciseProgress(firstPassed, "exercise-2", "", { status: "passed" });

    expect(allExercisesPassed(allPassed, ["exercise-1", "exercise-2"])).toBe(true);
  });

  it("tracks chapter challenge progress without dropping passed state", () => {
    const initial = createInitialChallengeProgress("user", "challenge");
    const passed = touchChallengeProgress(initial, {
      status: "passed",
      gradeCount: 1,
      passedRequiredCount: 2,
      totalRequiredCount: 2,
    });
    const reviewed = touchChallengeProgress(passed, {
      status: "in_progress",
      runCount: 2,
    });

    expect(reviewed.status).toBe("passed");
    expect(reviewed.firstStartedAt).toBeDefined();
    expect(reviewed.firstPassedAt).toBeDefined();
    expect(reviewed.runCount).toBe(2);
    expect(reviewed.gradeCount).toBe(1);
  });

  it("creates and updates mock exam sessions for shell navigation", () => {
    const initial = createInitialMockExamSession("user", "exam", "problem-1", "starter", 25);
    const started = touchMockExamSession(initial, { status: "in_progress", startedAt: "2026-09-04T00:00:00.000Z" });
    const answered = saveMockExamAnswer(started, "problem-1", "print('answer')");
    const moved = touchMockExamSession(answered, { activeProblemId: "problem-2", status: "paused", remainingSeconds: 1200 });

    expect(initial.remainingSeconds).toBe(1500);
    expect(getMockExamAnswer(answered, "problem-1", "starter").sourceCode).toBe("print('answer')");
    expect(getMockExamAnswer(answered, "problem-2", "starter two").sourceCode).toBe("starter two");
    expect(moved).toMatchObject({
      status: "paused",
      activeProblemId: "problem-2",
      remainingSeconds: 1200,
    });
  });
});
