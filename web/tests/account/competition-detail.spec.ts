import { expect, test } from "@playwright/test";
import { backendUrl, session } from "./mock-backend";

test("detail kompetisi menerima spasi saat mengetik, ganti kategori, simpan dan buka kembali", async ({ context, page, request }) => {
  await request.get(`${backendUrl}/__test/reset`);
  await context.addCookies([{ name: "sb-127-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, url: "http://127.0.0.1:3103", sameSite: "Lax" }]);
  for (const path of ["/dashboard/tim/baru", "/dashboard/tim/mobile-team/edit"]) {
    await page.goto(path);
    await page.locator("#team-comp-category").selectOption("PKM");
    const detail = page.locator("#team-comp");
    await detail.fill("");
    await detail.pressSequentially("2027 ");
    await expect(detail).toHaveValue("2027 ");
    await detail.pressSequentially("Kategori UX Design");
    await expect(detail).toHaveValue("2027 Kategori UX Design");
    await page.locator("#team-comp-category").selectOption("Lainnya");
    await expect(detail).toHaveValue("2027 Kategori UX Design");
  }
  await page.getByRole("button", { name: "Simpan Perubahan", exact: true }).click();
  await expect(page).toHaveURL(/\/tim\/mobile-team$/);
  await page.goto("/dashboard/tim/mobile-team/edit");
  await expect(page.locator("#team-comp")).toHaveValue("2027 Kategori UX Design");
});
