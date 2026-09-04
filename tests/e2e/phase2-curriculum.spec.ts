import { expect, test, type Page } from "@playwright/test";

async function setEditorValue(page: Page, value: string) {
  await page.waitForFunction(
    () =>
      typeof window.__programmingTrainerLoadedLessonId === "string" &&
      typeof window.__programmingTrainerSetEditorValue === "function"
  );
  await page.evaluate((nextValue) => window.__programmingTrainerSetEditorValue?.(nextValue), value);
  await page.waitForFunction((nextValue) => window.__programmingTrainerEditorValue === nextValue, value);
}

test("grades Lesson 4 types and operators", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_04_types_operators");
  await expect(page.getByRole("heading", { name: "Lesson 04: 型と演算子" })).toBeVisible();
  await page.getByLabel("stdin").fill("3\n4\n");
  await setEditorValue(page, "a = int(input())\nb = int(input())\nprint(a + b)\nprint(a * b)\n");

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("7\n12", { timeout: 90000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });
  await expect(page.getByText("Passed")).toBeVisible({ timeout: 30000 });
});
