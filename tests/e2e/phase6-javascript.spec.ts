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

test("opens the JavaScript grade 3 curriculum from language select", async ({ page }) => {
  await page.goto("/languages");

  await page.getByRole("link", { name: /JavaScript/ }).click();
  await expect(page.getByRole("heading", { name: "JavaScript Level Select" })).toBeVisible();

  await page.getByRole("link", { name: /3級/ }).click();
  await expect(page.getByRole("heading", { name: "JavaScript 3級", exact: true })).toBeVisible();
  await expect(page.getByLabel("JavaScript 3級 chapter progress")).toContainText("0 / 10 Lessons completed");
  await expect(page.getByRole("link", { name: /Lesson 01: console.log/ })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-3/lessons/lesson_js3_01_console_log"
  );
  await expect(page.getByRole("link", { name: /Lesson 10: 関数/ })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-3/lessons/lesson_js3_10_functions"
  );
});

test("runs and grades JavaScript Lesson 1 with progress reload", async ({ page }) => {
  await page.goto("/languages/javascript/grade-3/lessons/lesson_js3_01_console_log");
  await expect(page.getByRole("heading", { name: "Lesson 01: console.log / 出力" })).toBeVisible();
  await expect(page.locator(".editor-toolbar").getByText("JavaScript", { exact: true })).toBeVisible();
  await setEditorValue(page, 'console.log("Hello, Programming Trainer!");\n');

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("Hello, Programming Trainer!", { timeout: 30000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();

  await page.goto("/languages/javascript/grade-3");
  await expect(page.getByLabel("JavaScript 3級 chapter progress")).toContainText("1 / 10 Lessons completed");
  await expect(page.getByLabel("JavaScript 3級 chapter progress")).toContainText("10%");

  await page.reload();
  await expect(page.getByLabel("JavaScript 3級 chapter progress")).toContainText("1 / 10 Lessons completed");
});

test("grades JavaScript input lesson without leaking hidden details", async ({ page }) => {
  await page.goto("/languages/javascript/grade-3/lessons/lesson_js3_03_input");
  await expect(page.getByRole("heading", { name: "Lesson 03: input / 入力" })).toBeVisible();
  await page.getByLabel("stdin").fill("Yosuke\n");
  await setEditorValue(page, 'const name = readline();\nconsole.log("Hello " + name);\n');

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("Nia")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/javascript/grade-3");
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-3/lessons/lesson_js3_04_types_operators"
  );
});

test("switches JavaScript Lesson 10 exercises and grades both", async ({ page }) => {
  await page.goto("/languages/javascript/grade-3/lessons/lesson_js3_10_functions");
  await expect(page.getByRole("button", { name: /Exercise 1/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Exercise 2/ })).toBeVisible();

  await setEditorValue(
    page,
    "function double(number) {\n  return number * 2;\n}\n\nconst value = Number(readline());\nconsole.log(double(value));\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByRole("button", { name: /Exercise 1 Passed/ })).toBeVisible();

  await page.getByRole("button", { name: /Exercise 2/ }).click();
  await expect.poll(() => page.evaluate(() => window.__programmingTrainerEditorValue)).toContain("function triple(number)");
  await setEditorValue(
    page,
    "function triple(number) {\n  return number * 3;\n}\n\nconst value = Number(readline());\nconsole.log(triple(value));\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByRole("button", { name: /Exercise 2 Passed/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/javascript/grade-3");
});
