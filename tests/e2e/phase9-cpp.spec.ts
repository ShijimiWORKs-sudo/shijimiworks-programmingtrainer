import { expect, test } from "@playwright/test";

test("keeps C++ planned until curriculum routes are added", async ({ page }) => {
  await page.goto("/languages");

  await expect(page.getByRole("heading", { name: "Language Select" })).toBeVisible();
  await expect(page.getByText("C++")).toBeVisible();
  await expect(page.getByRole("link", { name: /C\+\+/ })).toHaveCount(0);
  await expect(page.getByText("Coming soon")).toHaveCount(4);
});
