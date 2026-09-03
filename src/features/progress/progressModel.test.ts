import { describe, expect, it } from "vitest";
import { createInitialProgress, markPassed, touchProgress } from "./progressModel";

describe("progress model", () => {
  it("increments progress and marks passed", () => {
    const initial = createInitialProgress("user", "lesson", "starter");
    const edited = touchProgress(initial, { lastCode: "print('ok')", gradeCount: 1, status: "in_progress" });
    const passed = markPassed(edited);

    expect(passed.status).toBe("passed");
    expect(passed.lastCode).toBe("print('ok')");
    expect(passed.firstPassedAt).toBeDefined();
  });
});
