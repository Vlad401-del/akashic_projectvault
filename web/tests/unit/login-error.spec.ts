import { expect, test } from "@playwright/test";
import { AuthApiError, AuthRetryableFetchError } from "@supabase/supabase-js";
import { loginErrorMessage } from "../../src/lib/login-error";

test("hanya invalid_credentials dijelaskan sebagai ketidakcocokan sandi", () => {
  expect(loginErrorMessage(new AuthApiError("Invalid credentials", 400, "invalid_credentials"))).toContain("tidak cocok");
});

test("email belum dikonfirmasi mendapat arahan konfirmasi", () => {
  expect(loginErrorMessage(new AuthApiError("Unconfirmed", 400, "email_not_confirmed"))).toContain("Email belum dikonfirmasi");
});

test("gangguan jaringan, server, dan timeout tidak disebut sandi salah", () => {
  for (const error of [new AuthRetryableFetchError("fetch failed", 0), new AuthApiError("Service down", 503, undefined), new AuthApiError("Timeout", 408, "request_timeout")]) {
    expect(loginErrorMessage(error)).toContain("Layanan login belum dapat dihubungi");
  }
});

test("batas percobaan meminta pengguna menunggu", () => {
  expect(loginErrorMessage(new AuthApiError("Rate limited", 429, "over_request_rate_limit"))).toContain("Terlalu banyak percobaan");
});

test("pesan provider tidak dibocorkan untuk error tidak dikenal", () => {
  const message = loginErrorMessage(new AuthApiError("PRIVATE_PROVIDER_DETAIL", 400, "unexpected_failure"));
  expect(message).toContain("Login belum dapat diproses");
  expect(message).not.toContain("PRIVATE_PROVIDER_DETAIL");
});
