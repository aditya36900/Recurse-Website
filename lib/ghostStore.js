// Server-only. Records Ghost Process players in Upstash Redis (Vercel Marketplace → Upstash for Redis).
//
//   ghost:player:<ROLL>  hash  roll, key, code, startedAt, solvedAt, failedAttempts
//   ghost:solved         zset  member ROLL, score = first solve time (ms)
//
// Without credentials every call is a no-op, so the puzzle still works in development.

const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL)?.trim();
const token = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)?.trim();

export const storeEnabled = Boolean(url && token);
const playerKey = (roll) => `ghost:player:${roll}`;

// Runs commands atomically and returns their results, or null if storage is off or fails.
async function transaction(commands) {
  if (!storeEnabled) return null;
  try {
    const response = await fetch(`${url}/multi-exec`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
    return (await response.json()).map((entry) => entry.result);
  } catch (error) {
    console.error("[ghost] Redis request failed", error);
    return null;
  }
}

export async function recordStart(roll, key, code) {
  const now = new Date().toISOString();
  await transaction([
    ["HSET", playerKey(roll), "roll", roll, "key", key, "code", code],
    ["HSETNX", playerKey(roll), "startedAt", now],
  ]);
}

export async function recordFailure(roll) {
  await transaction([["HINCRBY", playerKey(roll), "failedAttempts", 1]]);
}

// Returns { first, rank } where rank is the 1-based solve position, or null if storage is off.
export async function recordSolve(roll) {
  const now = Date.now();
  const result = await transaction([
    ["ZADD", "ghost:solved", "NX", now, roll],
    ["HSETNX", playerKey(roll), "solvedAt", new Date(now).toISOString()],
    ["ZRANK", "ghost:solved", roll],
  ]);
  if (!result) return null;
  return { first: result[0] === 1, rank: Number(result[2]) + 1 };
}
