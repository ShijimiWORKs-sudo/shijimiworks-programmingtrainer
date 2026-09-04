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

test("opens the Python grade 2 curriculum skeleton from level select", async ({ page }) => {
  await page.goto("/languages/python");

  await page.getByRole("link", { name: /2級/ }).click();

  await expect(page.getByRole("heading", { name: "Python 2級", exact: true })).toBeVisible();
  await expect(page.getByText("Python 2級 Foundation")).toBeVisible();
  await expect(page.getByRole("link", { name: /Lesson 01: 関数の戻り値/ })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_01_function_return");
  await expect(page.getByRole("link", { name: /Lesson 02: class/ })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_02_classes");
  await expect(page.getByRole("link", { name: /Lesson 03: exception/ })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_03_exceptions");
  await expect(page.getByText("Preparing")).toBeVisible();
  await expect(page.getByRole("link", { name: "Level Selectへ戻る" })).toHaveAttribute("href", "/languages/python");
});

test("grades the Python grade 2 function return lesson", async ({ page }) => {
  await page.goto("/languages/python/grade-2");
  await page.getByRole("link", { name: /Lesson 01: 関数の戻り値/ }).click();

  await expect(page.getByRole("heading", { name: "Lesson 01: 関数の戻り値" })).toBeVisible();
  await setEditorValue(
    page,
    "def discounted_price(price, rate):\n    return price * (100 - rate) // 100\n\nprice = int(input())\nrate = int(input())\nprint(discounted_price(price, rate))\n"
  );

  await page.getByRole("button", { name: "採点" }).click();

  await expect(page.getByText("合格 (2/2)")).toBeVisible();
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("2500")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/python/grade-2");
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_02_classes");
});

test("grades the Python grade 2 class lesson", async ({ page }) => {
  await page.goto("/languages/python/grade-2/lessons/lesson_py2_02_classes");

  await expect(page.getByRole("heading", { name: "Lesson 02: class" })).toBeVisible();
  await setEditorValue(
    page,
    "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\n    def label(self):\n        return self.name + ':' + str(self.score)\n\nname = input()\nscore = int(input())\nstudent = Student(name, score)\nprint(student.label())\n"
  );

  await page.getByRole("button", { name: "採点" }).click();

  await expect(page.getByText("合格 (2/2)")).toBeVisible();
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("Ren")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/python/grade-2");
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_03_exceptions");
});

test("grades the Python grade 2 exception lesson", async ({ page }) => {
  await page.goto("/languages/python/grade-2/lessons/lesson_py2_03_exceptions");

  await expect(page.getByRole("heading", { name: "Lesson 03: exception" })).toBeVisible();
  await setEditorValue(
    page,
    "value = input()\n\ntry:\n    number = int(value)\n    print('number:' + str(number))\nexcept ValueError:\n    print('invalid')\n"
  );

  await page.getByRole("button", { name: "採点" }).click();

  await expect(page.getByText("合格 (2/2)")).toBeVisible();
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("oops")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/python/grade-2");
});
