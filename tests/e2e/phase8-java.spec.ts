import { expect, test } from "@playwright/test";

test("keeps Java planned while runner infrastructure is prepared", async ({ page }) => {
  await page.goto("/languages");

  await expect(page.getByRole("heading", { name: "Language Select" })).toBeVisible();
  await expect(page.getByText("Java", { exact: true })).toBeVisible();
  await expect(page.getByText("Coming soon")).toHaveCount(5);
  await expect(page.getByRole("link", { name: /Java\b/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /JavaScript/ })).toHaveAttribute("href", "/languages/javascript");
});
