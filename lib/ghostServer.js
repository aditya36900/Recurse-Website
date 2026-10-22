// Server-only helpers for the Ghost Process API routes. Never import from client components.
import { createHmac, timingSafeEqual } from "node:crypto";
import { isValidRoll, normalizeRoll } from "./ghost";

// Base32 without I, O, 0 or 1 so keys survive being read aloud or retyped.
const symbols = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const devSecret = "recurse-ghost-dev-secret";

function secret() {
  const value = process.env.GHOST_SECRET?.trim();
  if (value) return value;
  if (process.env.NODE_ENV !== "production") return devSecret;
  return null;
}

function encode(purpose, roll, groups) {
  const digest = createHmac("sha256", secret()).update(`${purpose}:${roll}`).digest();
  const chars = Array.from(digest.subarray(0, groups * 4), (byte) => symbols[byte & 31]);
  return Array.from({ length: groups }, (_, i) => chars.slice(i * 4, i * 4 + 4).join("")).join("-");
}

export const keyFor = (roll) => `ORBIT-${encode("key", roll, 2)}`;
export const codeFor = (roll) => `RCS-GHOST-${encode("code", roll, 3)}`;
export const payloadFor = (roll) => Buffer.from(`RESTORE: ${keyFor(roll)}`).toString("base64");

export function keyMatches(roll, key) {
  const expected = Buffer.from(keyFor(roll));
  const given = Buffer.from(String(key ?? "").trim().toUpperCase());
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function json(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

// Parses the request and returns { roll, body } or a ready-made error Response.
export async function readRequest(request) {
  if (!secret()) return { error: json({ error: "Ghost Process is not configured yet." }, 503) };
  let body;
  try {
    body = await request.json();
  } catch {
    return { error: json({ error: "Invalid request." }, 400) };
  }
  const roll = normalizeRoll(body?.roll);
  if (!isValidRoll(roll)) return { error: json({ error: "Enter a valid KMIT roll number." }, 400) };
  return { roll, body };
}

export async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.warn("[ghost] Telegram is not configured; skipping notification:\n" + text);
    return false;
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) console.error("[ghost] Telegram error", response.status, await response.text());
    return response.ok;
  } catch (error) {
    console.error("[ghost] Telegram request failed", error);
    return false;
  }
}
