import "fake-indexeddb/auto";
import { deleteDB } from "idb";
import { beforeEach, describe, expect, it } from "vitest";
import { BrowserSettingsRepository } from "./BrowserSettingsRepository";
import { resetDbConnectionForTests } from "./db";

describe("BrowserSettingsRepository", () => {
  beforeEach(async () => {
    resetDbConnectionForTests();
    await deleteDB("programming-trainer");
  });

  it("saves and restores editor settings", async () => {
    const repository = new BrowserSettingsRepository();
    await repository.saveSettings({
      userId: "user",
      editorTheme: "dark",
      editorFontSize: 18,
      tabSize: 2,
      updatedAt: "2026-09-03T00:00:00.000Z",
    });

    await expect(repository.getSettings("user")).resolves.toMatchObject({
      editorFontSize: 18,
      tabSize: 2,
    });
  });
});
