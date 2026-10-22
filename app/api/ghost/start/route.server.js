import { codeFor, json, keyFor, payloadFor, readRequest } from "@/lib/ghostServer";
import { recordStart } from "@/lib/ghostStore";

export async function POST(request) {
  const { roll, error } = await readRequest(request);
  if (error) return error;
  await recordStart(roll, keyFor(roll), codeFor(roll));
  return json({ roll, payload: payloadFor(roll) });
}
