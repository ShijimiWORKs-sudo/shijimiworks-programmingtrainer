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

test("starts, navigates, pauses, and restores the Python grade 3 mock exam shell", async ({ page }) => {
  await page.goto("/languages/python/grade-3");
  await expect(page.getByRole("heading", { name: "Mock Exam" })).toBeVisible();
  await page.getByRole("link", { name: /Python 3級 模擬試験/ }).click();

  await expect(page.getByRole("heading", { name: "Python 3級 模擬試験" })).toBeVisible();
  await expect(page.getByLabel("Remaining time")).toContainText("25:00");
  await page.getByRole("button", { name: "開始" }).click();
  await expect(page.getByText("回答はこのブラウザに保存されます。")).toBeVisible();

  await setEditorValue(page, 'message = "Python"\nprint(message)\n');
  await page.getByRole("button", { name: "次の問題" }).click();
  await expect(page.getByText("2 / 2")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__programmingTrainerEditorValue)).toContain("number = int(input())");
  await setEditorValue(
    page,
    'number = int(input())\nif number % 2 == 0:\n    print("even")\nelse:\n    print("odd")\n'
  );

  await page.getByRole("button", { name: "一時停止" }).click();
  await expect(page.getByText("Paused")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Paused")).toBeVisible();
  await expect(page.getByText("2 / 2")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__programmingTrainerEditorValue)).toContain('print("even")');

  await page.getByRole("button", { name: "再開" }).click();
  await page.getByRole("button", { name: "前の問題" }).click();
  await expect(page.getByText("1 / 2")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__programmingTrainerEditorValue)).toContain('message = "Python"');
});
