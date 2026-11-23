import { expect, test } from "@playwright/test";
import { AuthApiError, AuthRetryableFetchError, AuthSessionMissingError } from "@supabase/supabase-js";
import { isAuthUnavailable, isMissingSession, sessionFailureMessage } from "../../src/lib/auth-availability";
import { createBoundedFetch } from "../../src/lib/supabase/fetch";

test("gangguan jaringan, batas layanan, dan respons tak dikenal tidak dianggap logout", () => {
  for (const error of [new AuthRetryableFetchError("offline", 0), new AuthApiError("down", 503, undefined), new AuthApiError("slow", 429, "over_request_rate_limit"), new Error("unknown")]) {
    expect(isMissingSession(error)).toBe(false);
  }
  expect(isAuthUnavailable(new AuthRetryableFetchError("offline", 0))).toBe(true);
  expect(isAuthUnavailable({ status: 408 })).toBe(true);
  expect(isAuthUnavailable({ status: 429 })).toBe(true);
  expect(sessionFailureMessage(new AuthRetryableFetchError("offline", 0), "Masuk lagi")).toContain("Layanan akun");
  expect(sessionFailureMessage(new AuthSessionMissingError(), "Masuk lagi")).toBe("Masuk lagi");
});

test("hanya penolakan sesi eksplisit diperlakukan sebagai sesi tidak berlaku", () => {
  expect(isMissingSession(new AuthSessionMissingError())).toBe(true);
  for (const code of ["session_not_found", "refresh_token_not_found", "bad_jwt", "user_banned"]) expect(isMissingSession({ code })).toBe(true);
  expect(isMissingSession({ code: "unexpected_failure", status: 400 })).toBe(false);
});

test("permintaan macet dibatalkan dan tidak diulang otomatis", async () => {
  let calls = 0;
  const stalled: typeof fetch = async (_input, init) => {
    calls++;
    return new Promise((_resolve, reject) => {
      init!.signal!.addEventListener("abort", () => reject(init!.signal!.reason), { once: true });
    });
  };
  await expect(createBoundedFetch(stalled, 30)("https://example.com", { method: "POST", body: "private" })).rejects.toThrow();
  expect(calls).toBe(1);
});

test("pembatalan dari pemanggil tetap berlaku", async () => {
  const controller = new AbortController();
  controller.abort();
  const inspect: typeof fetch = async (_input, init) => {
    expect(init?.signal?.aborted).toBe(true);
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe("payload");
    expect(new Headers(init?.headers).get("X-Test")).toBe("kept");
    return new Response("ok");
  };
  await createBoundedFetch(inspect)("https://example.com", { signal: controller.signal, method: "POST", body: "payload", headers: { "X-Test": "kept" } });
});
