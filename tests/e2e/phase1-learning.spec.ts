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

test("completes Lesson 1 with run and grade", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Python 3級|言語を選択/ }).first().click();
  if (await page.getByRole("heading", { name: "Language Select" }).isVisible().catch(() => false)) {
    await page.getByRole("link", { name: /Python/ }).click();
    await page.getByRole("link", { name: /3級/ }).click();
  }

  await page.getByRole("link", { name: /Lesson 01/ }).click();
  await setEditorValue(page, 'print("Hello, Programming Trainer!")\n');
  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("Hello, Programming Trainer!", { timeout: 90000 });
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });
  await expect(page.getByText("Passed")).toBeVisible({ timeout: 30000 });

  await page.reload();
  await expect(page.getByText("Passed")).toBeVisible();
  await expect(page.locator(".view-line").filter({ hasText: "Hello, Programming Trainer!" }).first()).toBeVisible({ timeout: 30000 });
});

test("runs input lesson and recovers after timeout", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_03_input");
  await page.getByLabel("stdin").fill("Yosuke\n");
  await setEditorValue(page, 'name = input()\nprint("Hello", name)\n');
  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("Hello Yosuke", { timeout: 90000 });

  await setEditorValue(page, "while True:\n    pass\n");
  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stderr")).toContainText("timed out", { timeout: 15000 });

  await setEditorValue(page, 'print("Recovered")\n');
  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("Recovered", { timeout: 90000 });
});


test("grades Lesson 2 and Lesson 3", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_02_variables");
  await setEditorValue(page, 'language = "Python"\nprint(language)\n');
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });

  await page.goto("/languages/python/grade-3/lessons/lesson_py3_03_input");
  await setEditorValue(page, 'name = input()\nprint("Hello", name)\n');
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });
});

test("hides hidden test details while keeping public details visible", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_03_input");
  await setEditorValue(page, 'name = input()\nif name == "Yosuke":\n    print("Hello Yosuke")\nelse:\n    print("SECRET_HIDDEN_STDOUT")\n');
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("未合格", { timeout: 90000 });

  const publicRow = page.locator(".test-result-row").filter({ hasText: "Public Test #1" });
  await expect(publicRow).toContainText("Yosuke");
  await expect(publicRow).toContainText("Hello Yosuke");

  const hiddenRow = page.locator(".test-result-row").filter({ hasText: "Hidden Test #2" });
  await expect(hiddenRow).toContainText("fail");
  await expect(hiddenRow).toContainText("非公開テストのため詳細は表示されません。");
  await expect(hiddenRow).not.toContainText("Python");
  await expect(hiddenRow).not.toContainText("Hello Python");
  await expect(hiddenRow).not.toContainText("SECRET_HIDDEN_STDOUT");

  await setEditorValue(page, 'name = input()\nif name == "Yosuke":\n    print("Hello Yosuke")\nelse:\n    raise Exception("SECRET_HIDDEN_STDERR")\n');
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("未合格", { timeout: 90000 });
  await expect(page.locator(".test-result-row").filter({ hasText: "Hidden Test #2" })).not.toContainText("SECRET_HIDDEN_STDERR");
});
