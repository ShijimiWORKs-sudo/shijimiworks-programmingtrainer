import { expect, test } from "@playwright/test";

test("navigates the Phase 0 learning route", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /言語を選択|Python 3級/ }).first().click();

  if (await page.getByRole("heading", { name: "Language Select" }).isVisible().catch(() => false)) {
    await page.getByRole("link", { name: /Python/ }).click();
    await page.getByRole("link", { name: /3級/ }).click();
  }

  await expect(page.getByRole("heading", { name: "Python 3級", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Lesson 01/ }).click();
  await expect(page.getByLabel("Lesson Workspace")).toBeVisible();
  await expect(page.getByLabel("Python code editor")).toBeVisible();
});
