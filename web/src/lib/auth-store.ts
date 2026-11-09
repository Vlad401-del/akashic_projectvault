/**
 * Penyimpanan akun & sesi lokal sementara, sebelum Supabase tersedia.
 *
 * Mengikuti pola `local-store.ts`: berkas JSON di `web/.data/` (tidak masuk
 * Git), dibaca langsung setiap kali diminta, ditulis lewat berkas sementara
 * agar penulisan yang terputus tidak meninggalkan berkas setengah jadi.
 *
 * Kata sandi tidak pernah disimpan polos: hanya hash scrypt beserta garam
 * acak per pengguna. Sesi berupa token acak yang dipetakan ke pengguna di
 * `sessions.json`; cookie browser hanya memegang token tersebut.
 *
 * Saat Supabase dipakai (tahap terakhir), berkas ini dihapus dan lapisan
 * autentikasi diganti Supabase Auth; komponen tampilan tidak berubah.
 */
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  /** Format `salt:hash` keduanya heksadesimal. */
  passwordHash: string;
  createdAt: string;
};

export type StoredSession = {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

const DATA_DIRECTORY = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIRECTORY, "users.json");
const SESSIONS_FILE = path.join(DATA_DIRECTORY, "sessions.json");

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const REMEMBER_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function readJsonArray<T>(file: string, guard: (value: unknown) => value is T): T[] {
  if (!isLocalDemoEditorEnabled() || !existsSync(file)) {
    return [];
  }

  const raw = readFileSync(file, "utf8").trim();
  if (raw.length === 0) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Berkas penyimpanan lokal tidak valid JSON: ${file}. Perbaiki atau hapus berkas itu.`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`Berkas penyimpanan lokal harus berupa daftar: ${file}.`);
  }

  return parsed.filter(guard);
}

function writeJsonArray(file: string, entries: unknown[]): void {
  mkdirSync(DATA_DIRECTORY, { recursive: true });
  const temporary = `${file}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
  renameSync(temporary, file);
}

function isStoredUser(value: unknown): value is StoredUser {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<StoredUser>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.email === "string" &&
    typeof item.passwordHash === "string" &&
    typeof item.createdAt === "string"
  );
}

function isStoredSession(value: unknown): value is StoredSession {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<StoredSession>;
  return (
    typeof item.token === "string" &&
    typeof item.userId === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.expiresAt === "string"
  );
}

export function readStoredUsers(): StoredUser[] {
  return readJsonArray(USERS_FILE, isStoredUser);
}

function readStoredSessions(): StoredSession[] {
  const now = Date.now();
  return readJsonArray(SESSIONS_FILE, isStoredSession).filter(
    (session) => Date.parse(session.expiresAt) > now,
  );
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function findUserByEmail(email: string): StoredUser | null {
  const target = email.trim().toLowerCase();
  return readStoredUsers().find((user) => user.email === target) ?? null;
}

/** Membuat akun baru; mengembalikan null bila email sudah terdaftar. */
export function createStoredUser(input: { name: string; email: string; password: string }): StoredUser | null {
  if (!isLocalDemoEditorEnabled()) {
    throw new Error("Autentikasi demo hanya tersedia saat pengembangan lokal.");
  }

  const email = input.email.trim().toLowerCase();
  if (findUserByEmail(email)) {
    return null;
  }

  const user: StoredUser = {
    id: randomBytes(12).toString("hex"),
    name: input.name.trim(),
    email,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  writeJsonArray(USERS_FILE, [...readStoredUsers(), user]);
  return user;
}

export function createStoredSession(userId: string, remember: boolean): string {
  const token = randomBytes(32).toString("hex");
  const now = Date.now();
  const session: StoredSession = {
    token,
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + (remember ? REMEMBER_TTL_MS : SESSION_TTL_MS)).toISOString(),
  };

  writeJsonArray(SESSIONS_FILE, [...readStoredSessions(), session]);
  return token;
}

export function sessionMaxAgeSeconds(remember: boolean): number {
  return (remember ? REMEMBER_TTL_MS : SESSION_TTL_MS) / 1000;
}

export function getStoredSessionUser(token: string | undefined): StoredUser | null {
  if (!token) return null;
  const session = readStoredSessions().find((item) => item.token === token);
  if (!session) return null;
  return readStoredUsers().find((user) => user.id === session.userId) ?? null;
}

export function deleteStoredSession(token: string | undefined): void {
  if (!token) return;
  writeJsonArray(
    SESSIONS_FILE,
    readStoredSessions().filter((session) => session.token !== token),
  );
}