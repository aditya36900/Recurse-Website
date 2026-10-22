// Ghost Process backend. Runs on Cloudflare (Workers or Pages Functions) with:
//   GHOST_DB            D1 database binding (players and their progress)
//   GHOST_SECRET        secret used to derive each roll number's key and completion code
//   TELEGRAM_BOT_TOKEN  optional; with TELEGRAM_CHAT_ID, posts first solves to Telegram
//   TELEGRAM_CHAT_ID
//
// The puzzle lives here, not in the page: the browser only sends terminal input and renders
// what comes back, so DevTools shows neither the solution path nor a key the player hasn't reached.
import { isValidRoll, normalizeRoll } from "../lib/ghost.js";

// Progress stages, in order. A command can only advance a player one stage at a time.
const IDENTIFIED = 1, TRACED = 2, ENVIRONMENT = 3, DECODED = 4, RESTORED = 5;

// Base32 without I, O, 0 or 1 so keys survive being read aloud or retyped.
const symbols = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const encoder = new TextEncoder();
const hmacKeys = new Map();

async function digest(secret, message) {
  if (!hmacKeys.has(secret)) {
    hmacKeys.set(
      secret,
      crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
    );
  }
  return new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKeys.get(secret), encoder.encode(message)));
}

async function encode(secret, purpose, roll, groups) {
  const bytes = await digest(secret, `${purpose}:${roll}`);
  const chars = Array.from(bytes.subarray(0, groups * 4), (byte) => symbols[byte & 31]);
  return Array.from({ length: groups }, (_, i) => chars.slice(i * 4, i * 4 + 4).join("")).join("-");
}

const keyFor = async (secret, roll) => `ORBIT-${await encode(secret, "key", roll, 2)}`;
const codeFor = async (secret, roll) => `RCS-GHOST-${await encode(secret, "code", roll, 3)}`;
const payloadFor = (key) => btoa(`RESTORE: ${key}`);

const help =
  "AVAILABLE DIAGNOSTIC COMMANDS\n\nhelp       Display this guide\nstatus     Inspect system health\nps         Inspect running processes\ncat        Read a file\nclear      Clear terminal output\n\nSome system functions remain undocumented.\nFollow the evidence to discover them.";
const status = "SYSTEM STATUS: DEGRADED\nINTEGRITY: UNKNOWN\nACTIVE PROCESSES: 4\nUNIDENTIFIED PROCESS: DETECTED";
const ps =
  "PID     PROCESS     STATUS\n101     systemd     RUNNING\n204     web-core    RUNNING\n318     asset-sync  DEGRADED\n1337    ghostd      UNKNOWN  ◀\n\nTRACE DETECTED: /var/log/.ghost_trace";
const trace =
  "GHOST TRACE // LOG 001\n\nSomething is happening inside the user environment.\nTerminal diagnostics cannot reach it.\n\nSYSTEM NOTE: The user environment may need to be opened separately.";
const environmentNames = ["os", "user", "environment", "user environment"];

function environment(payload) {
  return {
    folders: {
      home: ["README.txt", "activity.log"],
      Documents: ["system-note.txt"],
      System: ["integrity.log"],
      Downloads: ["image-cache.log"],
      Archives: ["recovery_payload.txt"],
    },
    contents: {
      "README.txt": "RECURSE OS // USER ENVIRONMENT\nPersonal workspace restored.",
      "activity.log": "No recent user activity.",
      "system-note.txt": "A recovery archive was accessed by an unknown process.\nCheck Archives.",
      "integrity.log": "Integrity monitor offline.",
      "image-cache.log": "Cache clean.",
      "recovery_payload.txt": payload,
    },
    payloadFile: "recovery_payload.txt",
  };
}

const headers = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });

let schemaReady;
function ensureSchema(db) {
  schemaReady ??= db
    .prepare(
      `CREATE TABLE IF NOT EXISTS ghost_players (
        roll TEXT PRIMARY KEY,
        key TEXT NOT NULL,
        code TEXT NOT NULL,
        stage INTEGER NOT NULL DEFAULT 1,
        started_at TEXT NOT NULL,
        solved_at TEXT,
        failed_attempts INTEGER NOT NULL DEFAULT 0
      )`,
    )
    .run()
    .catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  return schemaReady;
}

async function notifyTelegram(env, text) {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.warn("[ghost] Telegram is not configured; skipping notification:\n" + text);
    return;
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    if (!response.ok) console.error("[ghost] Telegram error", response.status, await response.text());
  } catch (error) {
    console.error("[ghost] Telegram request failed", error);
  }
}

async function solve(env, ctx, player) {
  const now = new Date().toISOString();
  const update = await env.GHOST_DB.prepare(
    "UPDATE ghost_players SET stage = ?, solved_at = ? WHERE roll = ? AND solved_at IS NULL",
  )
    .bind(RESTORED, now, player.roll)
    .run();
  if (update.meta.changes !== 1) return; // Already solved: only the first solve is announced.

  const { rank } = await env.GHOST_DB.prepare(
    "SELECT COUNT(*) AS rank FROM ghost_players WHERE solved_at IS NOT NULL AND solved_at <= ?",
  )
    .bind(now)
    .first();
  const time = new Date(now).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const message = `👻 GHOST PROCESS CRACKED — Solver #${rank}\n\nRoll no: ${player.roll}\nKey: ${player.key}\nCompletion code: ${player.code}\nTime: ${time} IST`;
  const sent = notifyTelegram(env, message);
  if (ctx?.waitUntil) ctx.waitUntil(sent);
  else await sent;
}

// Returns the response body for one line of terminal input.
async function command(env, ctx, player, input) {
  const [name = "", ...rest] = input.split(/\s+/);
  const arg = rest.join(" ");
  const cmd = name.toLowerCase();
  const payload = payloadFor(player.key);
  const reach = (stage) =>
    player.stage < stage &&
    env.GHOST_DB.prepare("UPDATE ghost_players SET stage = MAX(stage, ?) WHERE roll = ?").bind(stage, player.roll).run();

  if (cmd === "help") return { output: help };
  if (cmd === "status") return { output: status, warn: true };
  if (cmd === "ps") return { output: ps, warn: true };
  if (cmd === "whoami") return { output: `${player.roll}\nROLE: INVESTIGATOR\nCLEARANCE: GUEST` };
  if (cmd === "cat" && arg === "/var/log/.ghost_trace") {
    await reach(TRACED);
    return { output: trace, stage: Math.max(player.stage, TRACED) };
  }
  if (cmd === "cat") return { output: arg ? `cat: ${arg}: No such file or directory` : "usage: cat <file>" };

  if (cmd === "open" && player.stage >= TRACED && environmentNames.includes(arg.toLowerCase())) {
    await reach(ENVIRONMENT);
    return {
      output: "USER ENVIRONMENT ACCESS GRANTED",
      view: "os",
      environment: environment(payload),
      stage: Math.max(player.stage, ENVIRONMENT),
    };
  }

  if (player.stage >= ENVIRONMENT && input === payload)
    return {
      output: "ENCRYPTED ARCHIVE DETECTED\nThis payload cannot be read directly.\nUse decode followed by the payload to decrypt it.",
    };
  if (cmd === "decode") {
    if (player.stage < ENVIRONMENT || arg !== payload) return { output: "DECODE FAILED\nPAYLOAD NOT RECOGNISED", warn: true };
    await reach(DECODED);
    return { output: "DECRYPTING ARCHIVE...", key: player.key, stage: Math.max(player.stage, DECODED) };
  }

  if (cmd === "restore") {
    if (!arg) return { output: "usage: restore <key>" };
    if (player.stage >= DECODED && arg.toUpperCase() === player.key) {
      await solve(env, ctx, player);
      return { output: "RECOVERY KEY ACCEPTED\nINITIALIZING RESTORATION...", view: "restoring", code: player.code, stage: RESTORED };
    }
    await env.GHOST_DB.prepare("UPDATE ghost_players SET failed_attempts = failed_attempts + 1 WHERE roll = ?")
      .bind(player.roll)
      .run();
    return { output: "RECOVERY FAILED\nINVALID RESTORATION KEY", warn: true };
  }

  return { output: `command not found: ${name}. Type 'help' for diagnostic commands.`, warn: true };
}

export async function handleGhost(request, env, ctx) {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  if (!env.GHOST_DB || !env.GHOST_SECRET) return json({ error: "Ghost Process is not configured yet." }, 503);
  if (Number(request.headers.get("Content-Length") || 0) > 4096) return json({ error: "Request too large." }, 413);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const roll = normalizeRoll(body?.roll);
  if (!isValidRoll(roll)) return json({ error: "Enter a valid KMIT roll number." }, 400);

  await ensureSchema(env.GHOST_DB);
  const action = new URL(request.url).pathname.replace(/^\/api\/ghost\/?/, "");

  if (action === "session") {
    const key = await keyFor(env.GHOST_SECRET, roll);
    const code = await codeFor(env.GHOST_SECRET, roll);
    await env.GHOST_DB.prepare(
      "INSERT INTO ghost_players (roll, key, code, started_at) VALUES (?, ?, ?, ?) ON CONFLICT (roll) DO NOTHING",
    )
      .bind(roll, key, code, new Date().toISOString())
      .run();
    const { stage } = await env.GHOST_DB.prepare("SELECT stage FROM ghost_players WHERE roll = ?").bind(roll).first();
    return json({ roll, stage, ...(stage >= RESTORED ? { code } : {}) });
  }

  if (action === "command") {
    const input = String(body.input ?? "").trim().slice(0, 512);
    if (!input) return json({ output: "" });
    const player = await env.GHOST_DB.prepare("SELECT roll, key, code, stage FROM ghost_players WHERE roll = ?")
      .bind(roll)
      .first();
    if (!player) return json({ error: "Session not found. Reload and enter your roll number again." }, 404);
    return json(await command(env, ctx, player, input));
  }

  return json({ error: "Not found." }, 404);
}
