import "fake-indexeddb/auto";
import { deleteDB } from "idb";
import { beforeEach, describe, expect, it } from "vitest";
import { createInitialProgress, markPassed, touchProgress } from "../features/progress/progressModel";
import { BrowserProgressRepository } from "./BrowserProgressRepository";
import { resetDbConnectionForTests } from "./db";

describe("BrowserProgressRepository", () => {
  beforeEach(async () => {
    resetDbConnectionForTests();
    await deleteDB("programming-trainer");
  });

  it("saves last code and restores passed progress", async () => {
    const repository = new BrowserProgressRepository();
    const initial = createInitialProgress("user", "lesson_py3_01_print", "starter");
    const edited = touchProgress(initial, { lastCode: "print('done')", runCount: 1, status: "in_progress" });
    await repository.saveLessonProgress(edited);
    await repository.saveLessonProgress(markPassed(edited));

    const restored = await repository.getLessonProgress("user", "lesson_py3_01_print");

    expect(restored?.lastCode).toBe("print('done')");
    expect(restored?.status).toBe("passed");
  });

  it("returns the most recently studied lesson", async () => {
    const repository = new BrowserProgressRepository();
    await repository.saveLessonProgress({
      ...createInitialProgress("user", "old", ""),
      updatedAt: "2026-01-01T00:00:00.000Z",
      lastStudiedAt: "2026-01-01T00:00:00.000Z",
    });
    await repository.saveLessonProgress({
      ...createInitialProgress("user", "new", ""),
      updatedAt: "2026-01-02T00:00:00.000Z",
      lastStudiedAt: "2026-01-02T00:00:00.000Z",
    });

    await expect(repository.getLastLessonProgress("user")).resolves.toMatchObject({ lessonId: "new" });
  });
});
