import { codeFor, json, keyMatches, notifyTelegram, readRequest } from "@/lib/ghostServer";
import { recordFailure, recordSolve } from "@/lib/ghostStore";

export async function POST(request) {
  const { roll, body, error } = await readRequest(request);
  if (error) return error;

  const key = String(body.key ?? "").trim().toUpperCase();
  if (!keyMatches(roll, key)) {
    await recordFailure(roll);
    return json({ ok: false, error: "INVALID RESTORATION KEY" }, 403);
  }

  const code = codeFor(roll);
  const solve = await recordSolve(roll);
  // With storage on, only a roll number's first solve is announced.
  if (!solve || solve.first) {
    const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    await notifyTelegram(
      `👻 GHOST PROCESS CRACKED${solve ? ` — Solver #${solve.rank}` : ""}\n\nRoll no: ${roll}\nKey: ${key}\nCompletion code: ${code}\nTime: ${time} IST`,
    );
  }
  return json({ ok: true, code });
}
