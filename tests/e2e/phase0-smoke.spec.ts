import { expect, test } from "@playwright/test";

test("navigates the Phase 0 learning route", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "言語を選択" }).click();
  await expect(page.getByRole("heading", { name: "Language Select" })).toBeVisible();

  await page.getByRole("link", { name: /Python/ }).click();
  await expect(page.getByRole("heading", { name: "Python Level Select" })).toBeVisible();

  await page.getByRole("link", { name: /3級/ }).click();
  await expect(page.getByRole("heading", { name: "Python 3級" })).toBeVisible();

  await page.getByRole("link", { name: /Lesson Workspace/ }).click();
  await expect(page.getByLabel("Lesson Workspace")).toBeVisible();
  await expect(page.getByLabel("Code editor placeholder")).toBeVisible();
});
