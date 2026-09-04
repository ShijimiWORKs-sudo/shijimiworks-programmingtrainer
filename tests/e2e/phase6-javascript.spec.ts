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

test("opens the JavaScript grade 2 curriculum from level select", async ({ page }) => {
  await page.goto("/languages/javascript");

  await expect(page.getByRole("heading", { name: "JavaScript Level Select" })).toBeVisible();
  await page.getByRole("link", { name: /2級/ }).click();

  await expect(page.getByRole("heading", { name: "JavaScript 2級", exact: true })).toBeVisible();
  await expect(page.getByLabel("JavaScript 2級 chapter progress")).toContainText("0 / 6 Lessons completed");
  await expect(page.getByRole("link", { name: /Lesson 01: 関数の戻り値/ })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-2/lessons/lesson_js2_01_function_return"
  );
  await expect(page.getByRole("link", { name: /Lesson 06: small project/ })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-2/lessons/lesson_js2_06_small_project"
  );
});

test("grades JavaScript grade 2 function and class lessons", async ({ page }) => {
  await page.goto("/languages/javascript/grade-2/lessons/lesson_js2_01_function_return");
  await expect(page.getByRole("heading", { name: "Lesson 01: 関数の戻り値" })).toBeVisible();
  await setEditorValue(
    page,
    "function discountedPrice(price, rate) {\n  return Math.floor(price * (100 - rate) / 100);\n}\n\nconst price = Number(readline());\nconst rate = Number(readline());\nconsole.log(discountedPrice(price, rate));\n"
  );

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("2500")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-2/lessons/lesson_js2_02_classes"
  );

  await page.goto("/languages/javascript/grade-2/lessons/lesson_js2_02_classes");
  await expect(page.getByRole("heading", { name: "Lesson 02: class" })).toBeVisible();
  await setEditorValue(
    page,
    "class Student {\n  constructor(name, score) {\n    this.name = name;\n    this.score = score;\n  }\n\n  label() {\n    return this.name + \":\" + this.score;\n  }\n}\n\nconst name = readline();\nconst score = Number(readline());\nconst student = new Student(name, score);\nconsole.log(student.label());\n"
  );

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("Ren")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/javascript/grade-2");
});

test("grades JavaScript grade 2 small project and persists progress", async ({ page }) => {
  await page.goto("/languages/javascript/grade-2/lessons/lesson_js2_06_small_project");
  await expect(page.getByRole("heading", { name: "Lesson 06: small project" })).toBeVisible();
  await setEditorValue(
    page,
    "class ScoreBook {\n  constructor(scores) {\n    this.scores = scores;\n  }\n\n  count() {\n    return this.scores.length;\n  }\n\n  maxScore() {\n    let best = this.scores[0];\n    for (const score of this.scores) {\n      if (score > best) {\n        best = score;\n      }\n    }\n    return best;\n  }\n\n  average() {\n    const total = this.scores.reduce((sum, score) => sum + score, 0);\n    return Math.floor(total / this.scores.length);\n  }\n}\n\nfunction parseScores(line) {\n  return line.split(\",\").map((part) => Number(part)).filter((score) => !Number.isNaN(score));\n}\n\nconst scores = parseScores(readline());\nconst book = new ScoreBook(scores);\nconsole.log(\"count:\" + book.count() + \",max:\" + book.maxScore() + \",avg:\" + book.average());\n"
  );

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("100,no,85,95")).toHaveCount(0);

  await page.goto("/languages/javascript/grade-2");
  await expect(page.getByLabel("JavaScript 2級 chapter progress")).toContainText("1 / 6 Lessons completed");
  await page.reload();
  await expect(page.getByLabel("JavaScript 2級 chapter progress")).toContainText("1 / 6 Lessons completed");
});

test("opens the JavaScript grade 1 curriculum from level select", async ({ page }) => {
  await page.goto("/languages/javascript");

  await expect(page.getByRole("heading", { name: "JavaScript Level Select" })).toBeVisible();
  await page.getByRole("link", { name: /1級/ }).click();

  await expect(page.getByRole("heading", { name: "JavaScript 1級", exact: true })).toBeVisible();
  await expect(page.getByLabel("JavaScript 1級 chapter progress")).toContainText("0 / 4 Lessons completed");
  await expect(page.getByRole("link", { name: /Lesson 01: bug fix/ })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-1/lessons/lesson_js1_01_bug_fix"
  );
  await expect(page.getByRole("link", { name: /Lesson 04: refactoring/ })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-1/lessons/lesson_js1_04_refactoring"
  );
});

test("grades JavaScript grade 1 bug fix and specification change lessons", async ({ page }) => {
  await page.goto("/languages/javascript/grade-1/lessons/lesson_js1_01_bug_fix");
  await expect(page.getByRole("heading", { name: "Lesson 01: bug fix" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Project files" })).toBeVisible();
  await expect(page.getByText("tests/greeting.test.js", { exact: true })).toBeVisible();
  await setEditorValue(
    page,
    "function normalizeName(name) {\n  return name.trim();\n}\n\nfunction buildGreeting(name) {\n  const normalized = normalizeName(name);\n  return \"Hello, \" + normalized;\n}\n\nconst name = readline();\nconsole.log(buildGreeting(name));\n"
  );

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByText("合格 (2/2)")).toBeVisible();
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("Ren")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-1/lessons/lesson_js1_02_specification_change"
  );

  await page.goto("/languages/javascript/grade-1/lessons/lesson_js1_02_specification_change");
  await expect(page.getByRole("heading", { name: "Lesson 02: specification change" })).toBeVisible();
  await setEditorValue(
    page,
    "function shippingFee(total) {\n  if (total >= 5000) {\n    return 0;\n  }\n  return 500;\n}\n\nfunction orderTotal(total) {\n  return total + shippingFee(total);\n}\n\nconst total = Number(readline());\nconsole.log(orderTotal(total));\n"
  );

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByText("合格 (3/3)")).toBeVisible();
  await expect(page.getByText("Hidden Test #3: pass")).toBeVisible();
  await expect(page.getByText("5100")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-1/lessons/lesson_js1_03_test_oriented"
  );
});

test("grades JavaScript grade 1 test-oriented lesson", async ({ page }) => {
  await page.goto("/languages/javascript/grade-1/lessons/lesson_js1_03_test_oriented");
  await expect(page.getByRole("heading", { name: "Lesson 03: test-oriented task" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Project files" })).toBeVisible();
  await expect(page.getByText("tests/scores.test.js", { exact: true })).toBeVisible();
  await expect(page.getByText("console.assert(passedCount([80, 65, 90]) === 2);")).toBeVisible();
  await setEditorValue(
    page,
    "function parseScores(line) {\n  return line.split(\",\").map((part) => Number(part)).filter((score) => !Number.isNaN(score));\n}\n\nfunction passedCount(scores) {\n  return scores.filter((score) => score >= 70).length;\n}\n\nconst scores = parseScores(readline());\nconsole.log(passedCount(scores));\n"
  );

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByText("合格 (3/3)")).toBeVisible();
  await expect(page.getByText("Hidden Test #3: pass")).toBeVisible();
  await expect(page.getByText("100,no,40,75")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute(
    "href",
    "/languages/javascript/grade-1/lessons/lesson_js1_04_refactoring"
  );
});

test("grades JavaScript grade 1 refactoring lesson and persists progress", async ({ page }) => {
  await page.goto("/languages/javascript/grade-1/lessons/lesson_js1_04_refactoring");
  await expect(page.getByRole("heading", { name: "Lesson 04: refactoring" })).toBeVisible();
  await expect(page.getByText("tests/label-grade.test.js", { exact: true })).toBeVisible();
  await expect(page.getByText("console.assert(labelGrade(\"Aki\", 82) === \"Aki:A\");")).toBeVisible();
  await setEditorValue(
    page,
    "function labelGrade(name, score) {\n  if (score >= 80) {\n    return name + \":A\";\n  }\n  return name + \":B\";\n}\n\nconst name1 = readline();\nconst score1 = Number(readline());\nconst name2 = readline();\nconst score2 = Number(readline());\n\nconsole.log(labelGrade(name1, score1));\nconsole.log(labelGrade(name2, score2));\n"
  );

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByText("合格 (3/3)")).toBeVisible();
  await expect(page.getByText("Hidden Test #3: pass")).toBeVisible();
  await expect(page.getByText("Nia")).toHaveCount(0);

  await page.goto("/languages/javascript/grade-1");
  await expect(page.getByLabel("JavaScript 1級 chapter progress")).toContainText("1 / 4 Lessons completed");
  await page.reload();
  await expect(page.getByLabel("JavaScript 1級 chapter progress")).toContainText("1 / 4 Lessons completed");
});
