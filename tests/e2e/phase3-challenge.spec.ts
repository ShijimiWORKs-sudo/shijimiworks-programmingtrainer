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

test("completes the Python grade 3 chapter challenge", async ({ page }) => {
  await page.goto("/languages/python/grade-3");
  await expect(page.getByRole("heading", { name: "Chapter Challenge" })).toBeVisible();
  await page.getByRole("link", { name: /Python 3級 章末課題: 基礎総復習/ }).click();

  await expect(page.getByRole("heading", { name: "Python 3級 章末課題: 基礎総復習" })).toBeVisible();
  await page.getByLabel("stdin").fill("apple\n2\n");
  await setEditorValue(
    page,
    'prices = {"apple": 120, "banana": 80}\n\n\ndef total_price(item, count):\n    return prices[item] * count\n\nitem = input()\ncount = int(input())\nprint(total_price(item, count))\nif count >= 3:\n    print("discount")\n'
  );

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("240", { timeout: 90000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("Challenge Passed", { timeout: 90000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();

  await page.getByRole("link", { name: "Curriculumへ戻る" }).click();
  await expect(page.getByRole("link", { name: /Python 3級 章末課題: 基礎総復習/ })).toContainText("Passed");
});
