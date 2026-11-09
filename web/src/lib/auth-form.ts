/**
 * Validasi formulir autentikasi, dipakai bersama di klien dan server.
 *
 * Berkas ini sengaja murni (tanpa node:fs / next/headers) supaya komponen
 * klien dapat mengimpor tanpa menarik kode server ke bundel browser.
 */

export type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirm: string;
  agree: boolean;
};

export type LoginErrors = Partial<Record<"email" | "password", string>>;
export type RegisterErrors = Partial<Record<"name" | "email" | "password" | "confirm" | "agree", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emptyLoginForm(): LoginForm {
  return { email: "", password: "", remember: true };
}

export function emptyRegisterForm(): RegisterForm {
  return { name: "", email: "", password: "", confirm: "", agree: false };
}

export function validateLoginForm(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {};

  if (!form.email.trim()) {
    errors.email = "Isi alamat email Anda.";
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Format email belum benar, misalnya nama@kampus.ac.id.";
  }

  if (!form.password) {
    errors.password = "Isi kata sandi Anda.";
  }

  return errors;
}

export function validateRegisterForm(form: RegisterForm): RegisterErrors {
  const errors: RegisterErrors = {};

  const name = form.name.trim();
  if (name.length < 2) {
    errors.name = "Isi nama atau panggilan Anda (minimal 2 karakter).";
  } else if (name.length > 60) {
    errors.name = "Nama terlalu panjang (maksimal 60 karakter).";
  }

  if (!form.email.trim()) {
    errors.email = "Isi alamat email Anda.";
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Format email belum benar, misalnya nama@kampus.ac.id.";
  }

  if (!form.password) {
    errors.password = "Buat kata sandi untuk akun Anda.";
  } else if (form.password.length < 8) {
    errors.password = "Kata sandi minimal 8 karakter.";
  } else if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
    errors.password = "Kata sandi harus memuat huruf dan angka.";
  }

  if (!form.confirm) {
    errors.confirm = "Ulangi kata sandi Anda.";
  } else if (form.confirm !== form.password) {
    errors.confirm = "Konfirmasi kata sandi belum sama.";
  }

  if (!form.agree) {
    errors.agree = "Setujui ketentuan untuk melanjutkan.";
  }

  return errors;
}

export function hasLoginErrors(errors: LoginErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function hasRegisterErrors(errors: RegisterErrors): boolean {
  return Object.values(errors).some(Boolean);
}

/** Kekatan sandi 0-4 untuk meter kekuatan di formulir daftar. */
export function passwordStrength(password: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!password) return { score: 0, label: "Belum diisi" };

  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/[0-9]/.test(password)) points++;
  if (/[^a-zA-Z0-9]/.test(password)) points++;

  const score = Math.min(4, Math.max(1, points - 1)) as 0 | 1 | 2 | 3 | 4;
  const labels = ["Lemah", "Cukup", "Baik", "Kuat", "Sangat kuat"] as const;
  return { score, label: labels[score] };
}