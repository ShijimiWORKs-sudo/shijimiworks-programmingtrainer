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

test("grades Lesson 5 if", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_05_if");
  await expect(page.getByRole("heading", { name: "Lesson 05: if" })).toBeVisible();
  await page.getByLabel("stdin").fill("72\n");
  await setEditorValue(
    page,
    'score = int(input())\nif score >= 60:\n    print("pass")\nelse:\n    print("retry")\n'
  );

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("pass", { timeout: 90000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });
  await expect(page.getByText("Passed")).toBeVisible({ timeout: 30000 });
});

test("grades Lesson 6 for", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_06_for");
  await expect(page.getByRole("heading", { name: "Lesson 06: for" })).toBeVisible();
  await page.getByLabel("stdin").fill("3\n");
  await setEditorValue(page, "n = int(input())\nfor i in range(1, n + 1):\n    print(i)\n");

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("1\n2\n3", { timeout: 90000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });
  await expect(page.getByText("Passed")).toBeVisible({ timeout: 30000 });
});

test("grades Lesson 7 while", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_07_while");
  await expect(page.getByRole("heading", { name: "Lesson 07: while" })).toBeVisible();
  await page.getByLabel("stdin").fill("3\n");
  await setEditorValue(page, "n = int(input())\nwhile n > 0:\n    print(n)\n    n = n - 1\n");

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("3\n2\n1", { timeout: 90000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });
  await expect(page.getByText("Passed")).toBeVisible({ timeout: 30000 });
});

test("grades Lesson 8 list", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_08_list");
  await expect(page.getByRole("heading", { name: "Lesson 08: list" })).toBeVisible();
  await page.getByLabel("stdin").fill("red\nblue\ngreen\n");
  await setEditorValue(
    page,
    'items = [input(), input(), input()]\nitems[1] = "Python"\nprint(items[0])\nprint(items[1])\nprint(items[2])\n'
  );

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("red\nPython\ngreen", { timeout: 90000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });
  await expect(page.getByText("Passed")).toBeVisible({ timeout: 30000 });
});

test("grades Lesson 9 dict", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_09_dict");
  await expect(page.getByRole("heading", { name: "Lesson 09: dict" })).toBeVisible();
  await page.getByLabel("stdin").fill("apple\n120\n");
  await setEditorValue(
    page,
    'prices = {"apple": 100, "banana": 150}\nitem = input()\nnew_price = int(input())\nprices[item] = new_price\nprint(prices[item])\n'
  );

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("120", { timeout: 90000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });
  await expect(page.getByText("Passed")).toBeVisible({ timeout: 30000 });
});

test("grades Lesson 10 functions", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_10_functions");
  await expect(page.getByRole("heading", { name: "Lesson 10: 関数" })).toBeVisible();
  await page.getByLabel("stdin").fill("6\n");
  await setEditorValue(
    page,
    "def double(number):\n    return number * 2\n\nvalue = int(input())\nprint(double(value))\n"
  );

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("12", { timeout: 90000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });
  await expect(page.getByRole("button", { name: /Exercise 1 Passed/ })).toBeVisible({ timeout: 30000 });
});

test("switches Lesson 10 exercises and persists each editor state", async ({ page }) => {
  await page.goto("/languages/python/grade-3/lessons/lesson_py3_10_functions");
  await expect(page.getByRole("button", { name: /Exercise 1/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Exercise 2/ })).toBeVisible();

  const exerciseOneCode = "# exercise one\ndef double(number):\n    return number * 2\n\nvalue = int(input())\nprint(double(value))\n";
  const exerciseTwoCode = "# exercise two\ndef triple(number):\n    return number * 3\n\nvalue = int(input())\nprint(triple(value))\n";

  await setEditorValue(page, exerciseOneCode);
  await page.getByRole("button", { name: /Exercise 2/ }).click();
  await expect.poll(() => page.evaluate(() => window.__programmingTrainerEditorValue)).toContain("def triple(number):");
  await setEditorValue(page, exerciseTwoCode);
  await page.getByRole("button", { name: /Exercise 1/ }).click();
  await expect.poll(() => page.evaluate(() => window.__programmingTrainerEditorValue)).toBe(exerciseOneCode);
  await page.getByRole("button", { name: /Exercise 2/ }).click();
  await expect.poll(() => page.evaluate(() => window.__programmingTrainerEditorValue)).toBe(exerciseTwoCode);

  await page.getByLabel("stdin").fill("4\n");
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 90000 });
});
