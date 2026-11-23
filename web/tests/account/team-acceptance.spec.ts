import { expect, test } from "@playwright/test";
import { backendUrl, session } from "./mock-backend";

test("accepting the last applicant refreshes counts and removes full team from discovery", async ({ context, page, request }, testInfo) => {
  await request.get(`${backendUrl}/__test/reset`);
  await request.get(`${backendUrl}/__test/mode?value=team-acceptance`);
  await context.addCookies([{ name: "sb-127-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, url: "http://127.0.0.1:3103", sameSite: "Lax" }]);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Terima", exact: true }).click();
  await expect(page.getByRole("button", { name: "Terima", exact: true })).toBeDisabled();
  await expect(page.getByText("Anggota tim", { exact: true })).toBeVisible();
  await expect(page.getByText(/Menunggu pelamar mengonfirmasi/)).toHaveCount(0);
  await expect(page.getByText("2/2 anggota", { exact: true })).toBeVisible();
  await expect(page.getByText("Slot penuh", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tutup pencarian", exact: true })).toHaveCount(0);
  await expect(page.getByText("Kuota penuh. Ubah target anggota untuk membuka lagi.", { exact: true })).toBeVisible();
  const team = await (await request.get(`${backendUrl}/rest/v1/team_posts`)).json();
  expect(team[0].current_members).toBe(2);
  expect(team[0].status).toBe("closed");
  await page.screenshot({ path: testInfo.outputPath("accepted-dashboard.png"), fullPage: true });
  await page.getByRole("link", { name: "Tim Pengujian Mobile Dengan Judul Panjang", exact: true }).first().click();
  await expect(page.getByText("Pencarian ditutup", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Kirim Perkenalan", exact: true })).toHaveCount(0);
  await page.goto("/tim");
  await expect(page.getByRole("heading", { name: "Tim Pengujian Mobile Dengan Judul Panjang", exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
