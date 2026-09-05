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

test("opens the Java grade 3 curriculum from language select", async ({ page }) => {
  await page.goto("/languages");

  await page.locator('a[href="/languages/java"]').click();
  await expect(page.getByRole("heading", { name: "Java Level Select" })).toBeVisible();

  await page.getByRole("link", { name: /3級/ }).click();
  await expect(page.getByRole("heading", { name: "Java 3級", exact: true })).toBeVisible();
  await expect(page.getByLabel("Java 3級 chapter progress")).toContainText("0 / 10 Lessons completed");
  await expect(page.getByRole("link", { name: /Lesson 01: println/ })).toHaveAttribute(
    "href",
    "/languages/java/grade-3/lessons/lesson_java3_01_println"
  );
  await expect(page.getByRole("link", { name: /Lesson 10: メソッド/ })).toHaveAttribute(
    "href",
    "/languages/java/grade-3/lessons/lesson_java3_10_methods"
  );
});

test("runs and grades Java Lesson 1 with progress reload", async ({ page }) => {
  await page.goto("/languages/java/grade-3/lessons/lesson_java3_01_println");
  await expect(page.getByRole("heading", { name: "Lesson 01: println / 出力" })).toBeVisible();
  await expect(page.locator(".editor-toolbar").getByText("Java", { exact: true })).toBeVisible();
  await setEditorValue(
    page,
    'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Programming Trainer!");\n  }\n}\n'
  );

  await page.getByRole("button", { name: "実行" }).click();
  await expect(page.getByLabel("stdout")).toContainText("Hello, Programming Trainer!", { timeout: 30000 });

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();

  await page.goto("/languages/java/grade-3");
  await expect(page.getByLabel("Java 3級 chapter progress")).toContainText("1 / 10 Lessons completed");
  await expect(page.getByLabel("Java 3級 chapter progress")).toContainText("10%");
  await page.reload();
  await expect(page.getByLabel("Java 3級 chapter progress")).toContainText("1 / 10 Lessons completed");
});

test("grades Java input lesson without leaking hidden details", async ({ page }) => {
  await page.goto("/languages/java/grade-3/lessons/lesson_java3_03_input");
  await expect(page.getByRole("heading", { name: "Lesson 03: Scanner / 入力" })).toBeVisible();
  await page.getByLabel("stdin").fill("Yosuke\n");
  await setEditorValue(
    page,
    'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    String name = scanner.nextLine();\n    System.out.println("Hello " + name);\n  }\n}\n'
  );

  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("Hidden Test #2: pass")).toBeVisible();
  await expect(page.getByText("Mika")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curriculumへ戻る" })).toHaveAttribute("href", "/languages/java/grade-3");
  await expect(page.getByRole("link", { name: "次Lessonへ進む" })).toHaveAttribute(
    "href",
    "/languages/java/grade-3/lessons/lesson_java3_04_types_operators"
  );
});

test("switches Java Lesson 10 exercises and grades both", async ({ page }) => {
  await page.goto("/languages/java/grade-3/lessons/lesson_java3_10_methods");
  await expect(page.getByRole("button", { name: /Exercise 1/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Exercise 2/ })).toBeVisible();

  await setEditorValue(
    page,
    "import java.util.Scanner;\n\npublic class Main {\n  public static int doubleNumber(int number) {\n    return number * 2;\n  }\n\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    int value = scanner.nextInt();\n    System.out.println(doubleNumber(value));\n  }\n}\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByRole("button", { name: /Exercise 1 Passed/ })).toBeVisible();

  await page.getByRole("button", { name: /Exercise 2/ }).click();
  await expect.poll(() => page.evaluate(() => window.__programmingTrainerEditorValue)).toContain("tripleNumber");
  await setEditorValue(
    page,
    "import java.util.Scanner;\n\npublic class Main {\n  public static int tripleNumber(int number) {\n    return number * 3;\n  }\n\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    int value = scanner.nextInt();\n    System.out.println(tripleNumber(value));\n  }\n}\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByRole("button", { name: /Exercise 2 Passed/ })).toBeVisible();
});

test("opens and grades Java grade 2 and grade 1 lessons", async ({ page }) => {
  await page.goto("/languages/java/grade-2");
  await expect(page.getByRole("heading", { name: "Java 2級", exact: true })).toBeVisible();
  await expect(page.getByLabel("Java 2級 chapter progress")).toContainText("0 / 6 Lessons completed");

  await page.goto("/languages/java/grade-2/lessons/lesson_java2_01_method_return");
  await setEditorValue(
    page,
    "import java.util.Scanner;\n\npublic class Main {\n  public static int discountedPrice(int price, int rate) {\n    return Math.floor(price * (100 - rate) / 100);\n  }\n\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    int price = scanner.nextInt();\n    int rate = scanner.nextInt();\n    System.out.println(discountedPrice(price, rate));\n  }\n}\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByLabel("Grading result")).toContainText("合格", { timeout: 30000 });
  await expect(page.getByText("2500")).toHaveCount(0);

  await page.goto("/languages/java/grade-1");
  await expect(page.getByRole("heading", { name: "Java 1級", exact: true })).toBeVisible();
  await expect(page.getByLabel("Java 1級 chapter progress")).toContainText("0 / 4 Lessons completed");

  await page.goto("/languages/java/grade-1/lessons/lesson_java1_02_specification_change");
  await setEditorValue(
    page,
    "import java.util.Scanner;\n\npublic class Main {\n  public static int shippingFee(int total) {\n    if (total >= 5000) {\n      return 0;\n    }\n    return 500;\n  }\n\n  public static int orderTotal(int total) {\n    return total + shippingFee(total);\n  }\n\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    int total = scanner.nextInt();\n    System.out.println(orderTotal(total));\n  }\n}\n"
  );
  await page.getByRole("button", { name: "採点" }).click();
  await expect(page.getByText("合格 (3/3)")).toBeVisible();
  await expect(page.getByText("5100")).toHaveCount(0);
});

test("shows remaining future languages as planned", async ({ page }) => {
  await page.goto("/languages");

  await expect(page.getByRole("heading", { name: "Language Select" })).toBeVisible();
  await expect(page.getByText("Coming soon")).toHaveCount(4);
  await expect(page.getByRole("link", { name: /C\+\+/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /JavaScript/ })).toHaveAttribute("href", "/languages/javascript");
});
