import { expect, test } from "@playwright/test";

test("opens the Python grade 2 curriculum skeleton from level select", async ({ page }) => {
  await page.goto("/languages/python");

  await page.getByRole("link", { name: /2級/ }).click();

  await expect(page.getByRole("heading", { name: "Python 2級", exact: true })).toBeVisible();
  await expect(page.getByText("Python 2級 Foundation")).toBeVisible();
  await expect(page.getByText("P4-02 Function Deepening")).toBeVisible();
  await expect(page.getByText("Preparing")).toBeVisible();
  await expect(page.getByRole("link", { name: "Level Selectへ戻る" })).toHaveAttribute("href", "/languages/python");
});
