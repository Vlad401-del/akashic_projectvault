import { expect, test } from "@playwright/test";

test("permintaan login terputus tidak menuduh sandi salah dan bisa dicoba ulang", async ({ page }) => {
  await page.route("**/login", (route) => route.request().method() === "POST" ? route.abort("failed") : route.continue());
  await page.goto("/login");
  await page.locator("#login-email").fill("uji@example.com");
  await page.locator("#login-password").fill("Only-for-isolated-test-123");
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  const message = page.getByRole("alert").filter({ hasText: "Permintaan login terputus" });
  await expect(message).toBeVisible();
  await expect(message).not.toContainText("sandi salah");
  await expect(page.getByRole("button", { name: "Masuk", exact: true })).toBeEnabled();
  await expect(page.locator("#login-email")).toHaveValue("uji@example.com");
});
