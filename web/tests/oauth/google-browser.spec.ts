import { expect, test } from "@playwright/test";

test("Google dimulai di browser dengan PKCE tanpa Server Action", async ({ page, context, isMobile }) => {
  const localPosts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().startsWith("http://127.0.0.1:3102")) localPosts.push(request.url());
  });
  await page.route("https://auth-test.example.com/auth/v1/authorize?**", async (route) => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get("provider")).toBe("google");
    expect(url.searchParams.get("redirect_to")).toBe("http://127.0.0.1:3102/auth/callback");
    expect(url.searchParams.get("code_challenge_method")).toBe("s256");
    expect(url.searchParams.get("code_challenge")).toBeTruthy();
    await route.fulfill({ contentType: "text/html", body: "<h1>Otorisasi uji</h1>" });
  });
  await page.goto("/login");
  const button = page.getByRole("button", { name: "Masuk dengan Google", exact: true });
  await expect(button.locator("svg")).toHaveCount(1);
  if (isMobile) await button.tap(); else await button.click();
  await expect(page.getByRole("heading", { name: "Otorisasi uji" })).toBeVisible();
  expect(localPosts).toEqual([]);
  const cookies = await context.cookies("http://127.0.0.1:3102");
  expect(cookies.some((cookie) => cookie.name.includes("auth-token-code-verifier"))).toBe(true);
});
