// Cloudflare Pages entry for the Ghost Process API (the Workers deployment uses worker/index.js).
import { handleGhost } from "../../../worker/ghost.js";

export const onRequest = (context) => handleGhost(context.request, context.env, context);
