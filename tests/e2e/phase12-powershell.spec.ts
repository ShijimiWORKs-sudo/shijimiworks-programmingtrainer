import { expect, test } from "@playwright/test";

test("keeps PowerShell planned until virtual PowerShell curriculum routes are added", async ({ page }) => {
  await page.goto("/languages");

  await expect(page.getByRole("heading", { name: "Language Select" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Command/ })).toHaveAttribute("href", "/languages/command");
  await expect(page.getByText("PowerShell")).toBeVisible();
  await expect(page.getByText("Coming soon")).toHaveCount(1);
  await expect(page.getByRole("link", { name: /PowerShell/ })).toHaveCount(0);
});
