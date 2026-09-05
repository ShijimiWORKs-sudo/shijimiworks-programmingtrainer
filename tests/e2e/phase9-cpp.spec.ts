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

test("opens the C++ grade 3 curriculum from language select", async ({ page }) => {
  await page.goto("/languages");

  await page.locator('a[href="/languages/cpp"]').click();
  await expect(page.getByRole("heading", { name: "C++ Level Select" })).toBeVisible();

  await page.getByRole("link", { name: /3級/ }).click();
  await expect(page.getByRole("heading", { name: "C++ 3級", exact: true })).toBeVisible();
  await expect(page.getByLabel("C++ 3級 chapter progress")).toContainText("0 / 10 Lessons completed");
  await expect(page.getByRole("link", { name: /Lesson 01: cout/ })).toHaveAttribute(
    "href",
    "/languages/cpp/grade-3/lessons/lesson_cpp3_01_cout"
  );
  await expect(page.getByRole("link", { name: /Lesson 10: 関数/ })).toHaveAttribute(
    "href",
    "/languages/cpp/grade-3/lessons/lesson_cpp3_10_functions"
  );
});

test("runs and grades C++ Lesson 1 with progress reload", async ({ page }) => {
  await page.goto("/languages/cpp/grade-3/lessons/lesson_cpp3_01_cout");
  await expect(page.getByRole("heading", { name: "Lesson 01: cout / 出力" })).toBeVisible();
  await expect(page.locator(".editor-toolbar").getByText("C++", { exact: true })).toBeVisible();
  await setEditorValue(
    page,
    '#include <iostream>\n\nint main() {\n  std::cout << "Hello, Programming Trainer!" << std::endl;\n  return 0;\n}\n'
  );

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("Hello, Programming Trainer!", { timeout: 30000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();

  await page.goto("/languages/cpp/grade-3");
  await expect(page.getByLabel("C++ 3級 chapter progress")).toContainText("1 / 10 Lessons completed");
  await expect(page.getByLabel("C++ 3級 chapter progress")).toContainText("10%");
  await page.reload();
  await expect(page.getByLabel("C++ 3級 chapter progress")).toContainText("1 / 10 Lessons completed");
});

test("grades C++ input lesson without leaking hidden details", async ({ page }) => {
  await page.goto("/languages/cpp/grade-3/lessons/lesson_cpp3_03_input");
  await expect(page.getByRole("heading", { name: "Lesson 03: cin / 入力" })).toBeVisible();
  await page.getByLabel("stdin").fill("Yosuke\n");
  await setEditorValue(
    page,
    '#include <iostream>\n#include <string>\n\nint main() {\n  std::string name;\n  std::cin >> name;\n  std::cout << "Hello " << name << std::endl;\n  return 0;\n}\n'
  );

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("Mika")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/cpp/grade-3");
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute(
    "href",
    "/languages/cpp/grade-3/lessons/lesson_cpp3_04_types_operators"
  );
});

test("switches C++ Lesson 10 exercises and grades both", async ({ page }) => {
  await page.goto("/languages/cpp/grade-3/lessons/lesson_cpp3_10_functions");
  await expect(page.getByRole("button", { name: /Exercise 1/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Exercise 2/ })).toBeVisible();

  await setEditorValue(
    page,
    "#include <iostream>\n\nint doubleNumber(int number) {\n  return number * 2;\n}\n\nint main() {\n  int value;\n  std::cin >> value;\n  std::cout << doubleNumber(value) << std::endl;\n  return 0;\n}\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByRole("button", { name: /Exercise 1 Passed/ })).toBeVisible();

  await page.getByRole("button", { name: /Exercise 2/ }).click();
  await expect.poll(() => page.evaluate(() => window.__programmingTrainerEditorValue)).toContain("tripleNumber");
  await setEditorValue(
    page,
    "#include <iostream>\n\nint tripleNumber(int number) {\n  return number * 3;\n}\n\nint main() {\n  int value;\n  std::cin >> value;\n  std::cout << tripleNumber(value) << std::endl;\n  return 0;\n}\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByRole("button", { name: /Exercise 2 Passed/ })).toBeVisible();
});

test("opens and grades C++ grade 2 and grade 1 lessons", async ({ page }) => {
  await page.goto("/languages/cpp/grade-2");
  await expect(page.getByRole("heading", { name: "C++ 2級", exact: true })).toBeVisible();
  await expect(page.getByLabel("C++ 2級 chapter progress")).toContainText("0 / 6 Lessons completed");

  await page.goto("/languages/cpp/grade-2/lessons/lesson_cpp2_01_function_return");
  await setEditorValue(
    page,
    "#include <iostream>\n\nint discountedPrice(int price, int rate) {\n  return price * (100 - rate) / 100;\n}\n\nint main() {\n  int price;\n  int rate;\n  std::cin >> price >> rate;\n  std::cout << discountedPrice(price, rate) << std::endl;\n  return 0;\n}\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("2500")).toHaveCount(0);

  await page.goto("/languages/cpp/grade-1");
  await expect(page.getByRole("heading", { name: "C++ 1級", exact: true })).toBeVisible();
  await expect(page.getByLabel("C++ 1級 chapter progress")).toContainText("0 / 4 Lessons completed");

  await page.goto("/languages/cpp/grade-1/lessons/lesson_cpp1_02_specification_change");
  await setEditorValue(
    page,
    "#include <iostream>\n\nint shippingFee(int total) {\n  if (total >= 5000) {\n    return 0;\n  }\n  return 500;\n}\n\nint orderTotal(int total) {\n  return total + shippingFee(total);\n}\n\nint main() {\n  int total;\n  std::cin >> total;\n  std::cout << orderTotal(total) << std::endl;\n  return 0;\n}\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByText("合格 (3/3)")).toBeVisible();
  await expect(page.getByText("5100")).toHaveCount(0);
});

test("shows remaining future languages as planned after C++ is available", async ({ page }) => {
  await page.goto("/languages");

  await expect(page.getByRole("heading", { name: "Language Select" })).toBeVisible();
  await expect(page.getByRole("link", { name: /C\+\+/ })).toHaveAttribute("href", "/languages/cpp");
  await expect(page.getByText("Coming soon")).toHaveCount(3);
});
