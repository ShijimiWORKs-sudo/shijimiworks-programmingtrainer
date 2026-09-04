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
  await expect(page.getByRole("link", { name: /Lesson 04: virtual file I\/O/ })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_04_virtual_file_io");
  await expect(page.getByRole("link", { name: /Lesson 05: algorithm debug/ })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_05_algorithm_debug");
  await expect(page.getByRole("link", { name: /Lesson 06: small project/ })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_06_small_project");
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
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_04_virtual_file_io");
});

test("grades the Python grade 2 virtual file I/O lesson", async ({ page }) => {
  await page.goto("/languages/python/grade-2/lessons/lesson_py2_04_virtual_file_io");

  await expect(page.getByRole("heading", { name: "Lesson 04: virtual file I/O" })).toBeVisible();
  await setEditorValue(
    page,
    "name = input()\nscore = input()\n\nwith open('report.txt', 'w', encoding='utf-8') as file:\n    file.write(name + ',' + score)\n\nwith open('report.txt', 'r', encoding='utf-8') as file:\n    line = file.read()\n\nprint('saved:' + line)\n"
  );

  await page.getByRole("button", { name: "採点" }).click();

  await expect(page.getByText("合格 (2/2)")).toBeVisible();
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("Mina")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/python/grade-2");
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_05_algorithm_debug");
});

test("grades the Python grade 2 algorithm debug lesson", async ({ page }) => {
  await page.goto("/languages/python/grade-2/lessons/lesson_py2_05_algorithm_debug");

  await expect(page.getByRole("heading", { name: "Lesson 05: algorithm debug" })).toBeVisible();
  await setEditorValue(
    page,
    "scores = [int(value) for value in input().split()]\n\ndef highest_score(scores):\n    best = scores[0]\n    for score in scores:\n        if score > best:\n            best = score\n    return best\n\nprint(highest_score(scores))\n"
  );

  await page.getByRole("button", { name: "採点" }).click();

  await expect(page.getByText("合格 (2/2)")).toBeVisible();
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("-4 -2 -9")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/python/grade-2");
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute("href", "/languages/python/grade-2/lessons/lesson_py2_06_small_project");
});

test("grades the Python grade 2 small project lesson", async ({ page }) => {
  await page.goto("/languages/python/grade-2/lessons/lesson_py2_06_small_project");

  await expect(page.getByRole("heading", { name: "Lesson 06: small project" })).toBeVisible();
  await setEditorValue(
    page,
    "class ScoreBook:\n    def __init__(self, scores):\n        self.scores = scores\n\n    def count(self):\n        return len(self.scores)\n\n    def max_score(self):\n        best = self.scores[0]\n        for score in self.scores:\n            if score > best:\n                best = score\n        return best\n\n    def average(self):\n        return sum(self.scores) // len(self.scores)\n\n\ndef parse_scores(line):\n    scores = []\n    for part in line.split(','):\n        try:\n            scores.append(int(part))\n        except ValueError:\n            pass\n    return scores\n\nline = input()\nscores = parse_scores(line)\nbook = ScoreBook(scores)\nsummary = 'count:' + str(book.count()) + ',max:' + str(book.max_score()) + ',avg:' + str(book.average())\n\nwith open('summary.txt', 'w', encoding='utf-8') as file:\n    file.write(summary)\n\nwith open('summary.txt', 'r', encoding='utf-8') as file:\n    print(file.read())\n"
  );

  await page.getByRole("button", { name: "採点" }).click();

  await expect(page.getByText("合格 (2/2)")).toBeVisible();
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("100,no,85,95")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/python/grade-2");
});
