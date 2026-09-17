// Owner dashboard auth: one shared password from the ADMIN_PASSWORD env var,
// exchanged for an HMAC-signed, HttpOnly session cookie.
import { cookies } from "next/headers";

const COOKIE = "pb_admin";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function adminSecret(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

async function sign(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(adminSecret() || "dev-only-insecure"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function checkAdminPassword(password: string): Promise<boolean> {
  const secret = adminSecret();
  if (!secret) return false;
  return safeEqual(await sign(`password:${password}`), await sign(`password:${secret}`));
}

export async function issueAdminSession(): Promise<void> {
  const expires = Date.now() + SESSION_MS;
  const jar = await cookies();
  jar.set(COOKIE, `${expires}.${await sign(`session:${expires}`)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });
}

export async function isAdminRequest(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token || !adminSecret()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, await sign(`session:${expires}`));
}

export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
