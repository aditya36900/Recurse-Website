// Prints every Ghost Process player as CSV, first solvers first.
// Usage: node --env-file=.env.local scripts/ghost-export.mjs > ghost-players.csv

const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL)?.trim();
const token = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)?.trim();
if (!url || !token) {
  console.error("Set KV_REST_API_URL and KV_REST_API_TOKEN (e.g. via `vercel env pull .env.local`).");
  process.exit(1);
}

async function redis(command) {
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return (await response.json()).result;
}

const keys = [];
let cursor = "0";
do {
  const [next, batch] = await redis(["SCAN", cursor, "MATCH", "ghost:player:*", "COUNT", 500]);
  keys.push(...batch);
  cursor = next;
} while (cursor !== "0");

const solved = await redis(["ZRANGE", "ghost:solved", 0, -1]);
const rank = new Map(solved.map((roll, i) => [roll, i + 1]));

const players = [];
for (const key of keys) {
  const fields = await redis(["HGETALL", key]);
  const player = {};
  for (let i = 0; i < fields.length; i += 2) player[fields[i]] = fields[i + 1];
  players.push(player);
}
players.sort((a, b) => (rank.get(a.roll) ?? Infinity) - (rank.get(b.roll) ?? Infinity) || a.roll.localeCompare(b.roll));

const columns = ["solver", "roll", "key", "code", "startedAt", "solvedAt", "failedAttempts"];
console.log(columns.join(","));
for (const p of players) {
  console.log([rank.get(p.roll) ?? "", p.roll, p.key, p.code, p.startedAt, p.solvedAt ?? "", p.failedAttempts ?? 0].join(","));
}
console.error(`${players.length} players, ${solved.length} solved.`);
