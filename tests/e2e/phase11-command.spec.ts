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

test("opens the Command grade 3 curriculum from language select", async ({ page }) => {
  await page.goto("/languages");

  await page.locator('a[href="/languages/command"]').click();
  await expect(page.getByRole("heading", { name: "Command Level Select" })).toBeVisible();

  await page.getByRole("link", { name: /3級/ }).click();
  await expect(page.getByRole("heading", { name: "Command 3級", exact: true })).toBeVisible();
  await expect(page.getByLabel("Command 3級 chapter progress")).toContainText("0 / 10 Lessons completed");
  await expect(page.getByRole("link", { name: /Lesson 01: create files/ })).toHaveAttribute(
    "href",
    "/languages/command/grade-3/lessons/lesson_command3_01_create_files"
  );
  await expect(page.getByRole("link", { name: /Lesson 10: file workflow/ })).toHaveAttribute(
    "href",
    "/languages/command/grade-3/lessons/lesson_command3_10_file_workflow"
  );
});

test("runs and grades Command Lesson 1 with progress reload", async ({ page }) => {
  await page.goto("/languages/command/grade-3/lessons/lesson_command3_01_create_files");
  await expect(page.getByRole("heading", { name: "Lesson 01: create files" })).toBeVisible();
  await expect(page.locator(".editor-toolbar").getByText("Command", { exact: true })).toBeVisible();
  await setEditorValue(page, "mkdir reports\necho daily summary > reports\\summary.txt\ndir reports");

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("Directory of C:\\Users\\student\\reports", { timeout: 30000 });
  await expect(page.getByLabel("stdout")).toContainText("summary.txt");

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByLabel("Grading result")).not.toContainText("summary.txt has the requested content.");

  await page.goto("/languages/command/grade-3");
  await expect(page.getByLabel("Command 3級 chapter progress")).toContainText("1 / 10 Lessons completed");
  await expect(page.getByLabel("Command 3級 chapter progress")).toContainText("10%");
  await page.reload();
  await expect(page.getByLabel("Command 3級 chapter progress")).toContainText("1 / 10 Lessons completed");
});

test("grades Command file workflow without leaking hidden details", async ({ page }) => {
  await page.goto("/languages/command/grade-3/lessons/lesson_command3_09_move_to_archive");
  await expect(page.getByRole("heading", { name: "Lesson 09: move to archive" })).toBeVisible();
  await setEditorValue(page, "move todo.txt archive\\todo.txt");

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByLabel("Grading result")).not.toContainText("todo.txt is absent from the original location.");
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/command/grade-3");
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute(
    "href",
    "/languages/command/grade-3/lessons/lesson_command3_10_file_workflow"
  );
});

test("opens and grades Command grade 2 and grade 1 lessons", async ({ page }) => {
  await page.goto("/languages/command/grade-2");
  await expect(page.getByRole("heading", { name: "Command 2級", exact: true })).toBeVisible();
  await expect(page.getByLabel("Command 2級 chapter progress")).toContainText("0 / 6 Lessons completed");

  await page.goto("/languages/command/grade-2/lessons/lesson_command2_01_backup_workflow");
  await setEditorValue(page, "mkdir backup\ncopy plan.txt backup\\plan.txt");
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByLabel("Grading result")).not.toContainText("plan.txt remains.");

  await page.goto("/languages/command/grade-1");
  await expect(page.getByRole("heading", { name: "Command 1級", exact: true })).toBeVisible();
  await expect(page.getByLabel("Command 1級 chapter progress")).toContainText("0 / 4 Lessons completed");

  await page.goto("/languages/command/grade-1/lessons/lesson_command1_01_bug_fix_cleanup");
  await setEditorValue(page, "move summery.txt summary.txt");
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByText("合格 (2/2)")).toBeVisible();
  await expect(page.getByLabel("Grading result")).not.toContainText("summery.txt is gone.");
});

test("shows only PowerShell as planned after Command is available", async ({ page }) => {
  await page.goto("/languages");

  await expect(page.getByRole("heading", { name: "Language Select" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Command/ })).toHaveAttribute("href", "/languages/command");
  await expect(page.getByText("PowerShell")).toBeVisible();
  await expect(page.getByText("Coming soon")).toHaveCount(1);
});
