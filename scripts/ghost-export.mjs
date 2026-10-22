// Prints every Ghost Process player as CSV, solvers first in solve order.
// Usage: npm run ghost:export > ghost-players.csv           (live D1 database)
//        npm run ghost:export -- --local > ghost-players.csv (local `wrangler dev` database)
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

// Run Wrangler's own entry with Node (no shell), so the SQL reaches it as one argument on every OS.
const wranglerPackage = createRequire(import.meta.url).resolve("wrangler/package.json");
const wrangler = path.join(path.dirname(wranglerPackage), "bin", "wrangler.js");

const where = process.argv.includes("--local") ? "--local" : "--remote";
const sql =
  "SELECT roll, key, code, stage, started_at, solved_at, failed_attempts FROM ghost_players " +
  "ORDER BY solved_at IS NULL, solved_at, roll";

const output = execFileSync(
  process.execPath,
  [wrangler, "d1", "execute", "recurse-ghost", where, "--json", "--command", sql],
  { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
);
const rows = JSON.parse(output)[0].results;

console.log("solver,roll,key,code,stage,startedAt,solvedAt,failedAttempts");
let solver = 0;
for (const r of rows) {
  const rank = r.solved_at ? ++solver : "";
  console.log([rank, r.roll, r.key, r.code, r.stage, r.started_at, r.solved_at ?? "", r.failed_attempts].join(","));
}
console.error(`${rows.length} players, ${solver} solved.`);
