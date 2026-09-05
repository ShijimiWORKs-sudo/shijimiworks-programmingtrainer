import { expect, test } from "@playwright/test";

test("keeps Ruby planned until curriculum routes are added", async ({ page }) => {
  await page.goto("/languages");

  await expect(page.getByRole("heading", { name: "Language Select" })).toBeVisible();
  await expect(page.getByText("Ruby")).toBeVisible();
  await expect(page.getByRole("link", { name: /Ruby/ })).toHaveCount(0);
  await expect(page.getByText("Coming soon")).toHaveCount(3);
});
