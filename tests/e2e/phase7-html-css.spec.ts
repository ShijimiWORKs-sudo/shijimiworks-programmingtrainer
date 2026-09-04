import { expect, test, type Page } from "@playwright/test";

type HtmlCssFilePath = "html" | "css";

async function setHtmlCssFileValue(page: Page, path: HtmlCssFilePath, value: string) {
  await page.waitForFunction(
    () =>
      window.__programmingTrainerLoadedHtmlCssLessonId === "lesson_htmlcss3_01_split_preview" &&
      typeof window.__programmingTrainerSetHtmlCssFileValue === "function"
  );
  await page.evaluate(
    ([filePath, nextValue]) => {
      window.__programmingTrainerSetHtmlCssFileValue?.(filePath as HtmlCssFilePath, nextValue as string);
    },
    [path, value]
  );
  await page.waitForFunction(
    ([filePath, nextValue]) => window.__programmingTrainerHtmlCssFiles?.[filePath as HtmlCssFilePath] === nextValue,
    [path, value]
  );
}

async function getPreviewText(page: Page) {
  return page.frameLocator('iframe[title="HTML/CSS Preview"]').locator("body").textContent();
}

test("opens the HTML/CSS grade 3 curriculum from language select", async ({ page }) => {
  await page.goto("/languages");

  await page.getByRole("link", { name: /HTML\/CSS/ }).click();
  await expect(page.getByRole("heading", { name: "HTML/CSS Level Select" })).toBeVisible();

  await page.getByRole("link", { name: /3級/ }).click();
  await expect(page.getByRole("heading", { name: "HTML/CSS 3級", exact: true })).toBeVisible();
  await expect(page.getByLabel("HTML/CSS 3級 chapter progress")).toContainText("0 / 1 Lessons completed");
  await expect(page.getByRole("link", { name: /Lesson 01: split editor preview/ })).toHaveAttribute(
    "href",
    "/languages/html-css/grade-3/lessons/lesson_htmlcss3_01_split_preview"
  );
});

test("updates the split editor preview with HTML and CSS changes", async ({ page }) => {
  await page.goto("/languages/html-css/grade-3/lessons/lesson_htmlcss3_01_split_preview");

  await expect(page.getByRole("heading", { name: "Lesson 01: split editor preview" })).toBeVisible();
  await expect(page.getByLabel("HTML code editor")).toBeVisible();
  await expect(page.getByLabel("CSS code editor")).toBeVisible();
  await expect(page.getByTitle("HTML/CSS Preview")).toHaveAttribute("sandbox", "");

  await setHtmlCssFileValue(page, "html", "<main><h1>Preview Updated</h1><p>Live split editor</p></main>");
  await setHtmlCssFileValue(
    page,
    "css",
    "body { background: rgb(240, 250, 255); } h1 { color: rgb(23, 107, 135); }"
  );

  await expect.poll(() => getPreviewText(page)).toContain("Preview Updated");
  await expect
    .poll(() =>
      page.frameLocator('iframe[title="HTML/CSS Preview"]').locator("h1").evaluate((heading) => getComputedStyle(heading).color)
    )
    .toBe("rgb(23, 107, 135)");
});

test("keeps preview scripts and inline handlers out of app execution", async ({ page }) => {
  await page.goto("/languages/html-css/grade-3/lessons/lesson_htmlcss3_01_split_preview");

  await setHtmlCssFileValue(
    page,
    "html",
    '<script>window.top.__htmlCssPreviewLeak = "script";</script><h1>Safe Preview</h1><button onclick="window.top.__htmlCssPreviewLeak = \'click\'">Click</button>'
  );

  await expect.poll(() => getPreviewText(page)).toContain("Safe Preview");
  expect(
    await page.evaluate(() => (window as Window & { __htmlCssPreviewLeak?: string }).__htmlCssPreviewLeak)
  ).toBeUndefined();
  await expect(page.getByTitle("HTML/CSS Preview")).not.toHaveAttribute("sandbox", /allow-scripts/);
  expect(
    await page.locator('iframe[title="HTML/CSS Preview"]').evaluate((iframe) => {
      const frame = iframe as HTMLIFrameElement;
      return frame.getAttribute("srcdoc") ?? "";
    })
  ).not.toMatch(/<script|onclick=/i);
});

test("grades HTML DOM requirements and persists completion", async ({ page }) => {
  await page.goto("/languages/html-css/grade-3/lessons/lesson_htmlcss3_01_split_preview");

  await page.getByRole("button", { name: "採点" }).click();

  await expect(page.getByLabel("Grading result")).toContainText("合格 (5/5)");
  await expect(page.getByText("Public Test #1: pass")).toBeVisible();
  await expect(page.getByText("Hidden Test #3: pass")).toBeVisible();
  await expect(page.getByText("Hidden Test #5: pass")).toBeVisible();
  await expect(page.getByLabel("Grading result").getByText("main.profile-card p")).toHaveCount(0);
  await expect(page.getByLabel("Grading result").getByText("(max-width: 700px)")).toHaveCount(0);

  await page.goto("/languages/html-css/grade-3");
  await expect(page.getByLabel("HTML/CSS 3級 chapter progress")).toContainText("1 / 1 Lessons completed");
  await expect(page.getByLabel("HTML/CSS 3級 chapter progress")).toContainText("100%");
  await page.reload();
  await expect(page.getByLabel("HTML/CSS 3級 chapter progress")).toContainText("1 / 1 Lessons completed");
});

test("restores edited HTML and CSS after reload", async ({ page }) => {
  await page.goto("/languages/html-css/grade-3/lessons/lesson_htmlcss3_01_split_preview");

  await setHtmlCssFileValue(page, "html", "<section><h1>Reloaded Preview</h1></section>");
  await setHtmlCssFileValue(page, "css", "h1 { color: rgb(140, 28, 64); }");
  await expect.poll(() => getPreviewText(page)).toContain("Reloaded Preview");

  await page.reload();

  await page.waitForFunction(
    () =>
      window.__programmingTrainerLoadedHtmlCssLessonId === "lesson_htmlcss3_01_split_preview" &&
      typeof window.__programmingTrainerSetHtmlCssFileValue === "function"
  );
  await expect.poll(() => getPreviewText(page)).toContain("Reloaded Preview");
  await expect
    .poll(() =>
      page.frameLocator('iframe[title="HTML/CSS Preview"]').locator("h1").evaluate((heading) => getComputedStyle(heading).color)
    )
    .toBe("rgb(140, 28, 64)");
});
