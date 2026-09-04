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

test("opens the Python grade 1 curriculum from level select", async ({ page }) => {
  await page.goto("/languages/python");

  await page.getByRole("link", { name: /1級/ }).click();

  await expect(page.getByRole("heading", { name: "Python 1級", exact: true })).toBeVisible();
  await expect(page.getByText("Python 1級 Practical Maintenance")).toBeVisible();
  await expect(page.getByText("2 Lessons ready")).toBeVisible();
  await expect(page.getByRole("link", { name: /Lesson 01: bug fix/ })).toHaveAttribute("href", "/languages/python/grade-1/lessons/lesson_py1_01_bug_fix");
  await expect(page.getByRole("link", { name: /Lesson 02: specification change/ })).toHaveAttribute("href", "/languages/python/grade-1/lessons/lesson_py1_02_specification_change");
  await expect(page.getByRole("link", { name: "Level Selectへ戻る" })).toHaveAttribute("href", "/languages/python");
});

test("grades the Python grade 1 bug fix lesson", async ({ page }) => {
  await page.goto("/languages/python/grade-1/lessons/lesson_py1_01_bug_fix");

  await expect(page.getByRole("heading", { name: "Lesson 01: bug fix" })).toBeVisible();
  await setEditorValue(
    page,
    "def normalize_name(name):\n    return name.strip()\n\n\ndef build_greeting(name):\n    normalized = normalize_name(name)\n    return 'Hello, ' + normalized\n\nname = input()\nprint(build_greeting(name))\n"
  );

  await page.getByRole("button", { name: "採点" }).click();

  await expect(page.getByText("合格 (2/2)")).toBeVisible();
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("Ren")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/python/grade-1");
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute("href", "/languages/python/grade-1/lessons/lesson_py1_02_specification_change");
});

test("grades the Python grade 1 specification change lesson", async ({ page }) => {
  await page.goto("/languages/python/grade-1/lessons/lesson_py1_02_specification_change");

  await expect(page.getByRole("heading", { name: "Lesson 02: specification change" })).toBeVisible();
  await setEditorValue(
    page,
    "def shipping_fee(total):\n    if total >= 5000:\n        return 0\n    return 500\n\n\ndef order_total(total):\n    return total + shipping_fee(total)\n\ntotal = int(input())\nprint(order_total(total))\n"
  );

  await page.getByRole("button", { name: "採点" }).click();

  await expect(page.getByText("合格 (3/3)")).toBeVisible();
  await expect(page.getByText("Hidden Test #3: pass")).toBeVisible();
  await expect(page.getByText("5100")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/python/grade-1");
});
