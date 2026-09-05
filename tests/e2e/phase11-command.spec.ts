import { expect, test } from "@playwright/test";

test("keeps Windows Command planned until virtual terminal curriculum routes are added", async ({ page }) => {
  await page.goto("/languages");

  await expect(page.getByRole("heading", { name: "Language Select" })).toBeVisible();
  await expect(page.getByText("Command")).toBeVisible();
  await expect(page.getByText("PowerShell")).toBeVisible();
  await expect(page.getByText("Coming soon")).toHaveCount(2);
  await expect(page.getByRole("link", { name: /Command/ })).toHaveCount(0);
});
