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

test("opens the Ruby grade 3 curriculum from language select", async ({ page }) => {
  await page.goto("/languages");

  await page.locator('a[href="/languages/ruby"]').click();
  await expect(page.getByRole("heading", { name: "Ruby Level Select" })).toBeVisible();

  await page.getByRole("link", { name: /3級/ }).click();
  await expect(page.getByRole("heading", { name: "Ruby 3級", exact: true })).toBeVisible();
  await expect(page.getByLabel("Ruby 3級 chapter progress")).toContainText("0 / 10 Lessons completed");
  await expect(page.getByRole("link", { name: /Lesson 01: puts/ })).toHaveAttribute(
    "href",
    "/languages/ruby/grade-3/lessons/lesson_ruby3_01_puts"
  );
  await expect(page.getByRole("link", { name: /Lesson 10: メソッド/ })).toHaveAttribute(
    "href",
    "/languages/ruby/grade-3/lessons/lesson_ruby3_10_methods"
  );
});

test("runs and grades Ruby Lesson 1 with progress reload", async ({ page }) => {
  await page.goto("/languages/ruby/grade-3/lessons/lesson_ruby3_01_puts");
  await expect(page.getByRole("heading", { name: "Lesson 01: puts / 出力" })).toBeVisible();
  await expect(page.locator(".editor-toolbar").getByText("Ruby", { exact: true })).toBeVisible();
  await setEditorValue(page, 'puts "Hello, Programming Trainer!"\n');

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("Hello, Programming Trainer!", { timeout: 30000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();

  await page.goto("/languages/ruby/grade-3");
  await expect(page.getByLabel("Ruby 3級 chapter progress")).toContainText("1 / 10 Lessons completed");
  await expect(page.getByLabel("Ruby 3級 chapter progress")).toContainText("10%");
  await page.reload();
  await expect(page.getByLabel("Ruby 3級 chapter progress")).toContainText("1 / 10 Lessons completed");
});

test("grades Ruby input lesson without leaking hidden details", async ({ page }) => {
  await page.goto("/languages/ruby/grade-3/lessons/lesson_ruby3_03_input");
  await expect(page.getByRole("heading", { name: "Lesson 03: gets / 入力" })).toBeVisible();
  await page.getByLabel("stdin").fill("Yosuke\n");
  await setEditorValue(page, 'name = gets.chomp\nputs "Hello #{name}"\n');

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("Mika")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/ruby/grade-3");
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute(
    "href",
    "/languages/ruby/grade-3/lessons/lesson_ruby3_04_types_operators"
  );
});

test("switches Ruby Lesson 10 exercises and grades both", async ({ page }) => {
  await page.goto("/languages/ruby/grade-3/lessons/lesson_ruby3_10_methods");
  await expect(page.getByRole("button", { name: /Exercise 1/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Exercise 2/ })).toBeVisible();

  await setEditorValue(page, "def double_number(number)\n  return number * 2\nend\n\nvalue = gets.to_i\nputs double_number(value)\n");
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByRole("button", { name: /Exercise 1 Passed/ })).toBeVisible();

  await page.getByRole("button", { name: /Exercise 2/ }).click();
  await expect.poll(() => page.evaluate(() => window.__programmingTrainerEditorValue)).toContain("triple_number");
  await setEditorValue(page, "def triple_number(number)\n  return number * 3\nend\n\nvalue = gets.to_i\nputs triple_number(value)\n");
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByRole("button", { name: /Exercise 2 Passed/ })).toBeVisible();
});

test("opens and grades Ruby grade 2 and grade 1 lessons", async ({ page }) => {
  await page.goto("/languages/ruby/grade-2");
  await expect(page.getByRole("heading", { name: "Ruby 2級", exact: true })).toBeVisible();
  await expect(page.getByLabel("Ruby 2級 chapter progress")).toContainText("0 / 6 Lessons completed");

  await page.goto("/languages/ruby/grade-2/lessons/lesson_ruby2_01_method_return");
  await setEditorValue(
    page,
    "def discounted_price(price, rate)\n  return price * (100 - rate) / 100\nend\n\nprice = gets.to_i\nrate = gets.to_i\nputs discounted_price(price, rate)\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("2500")).toHaveCount(0);

  await page.goto("/languages/ruby/grade-1");
  await expect(page.getByRole("heading", { name: "Ruby 1級", exact: true })).toBeVisible();
  await expect(page.getByLabel("Ruby 1級 chapter progress")).toContainText("0 / 4 Lessons completed");

  await page.goto("/languages/ruby/grade-1/lessons/lesson_ruby1_02_specification_change");
  await setEditorValue(
    page,
    "def shipping_fee(total)\n  if total >= 5000\n    return 0\n  end\n  return 500\nend\n\ndef order_total(total)\n  return total + shipping_fee(total)\nend\n\ntotal = gets.to_i\nputs order_total(total)\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByText("合格 (3/3)")).toBeVisible();
  await expect(page.getByText("5100")).toHaveCount(0);
});

test("shows remaining future languages as planned after Ruby is available", async ({ page }) => {
  await page.goto("/languages");

  await expect(page.getByRole("heading", { name: "Language Select" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Ruby/ })).toHaveAttribute("href", "/languages/ruby");
  await expect(page.getByText("Coming soon")).toHaveCount(1);
});
