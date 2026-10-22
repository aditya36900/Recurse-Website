// Cloudflare Workers entry: Ghost Process API, everything else from the static export in out/.
import { handleGhost } from "./ghost.js";

export default {
  fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/api/ghost/")) return handleGhost(request, env, ctx);
    if (pathname.startsWith("/api/")) return new Response("Not found", { status: 404 });
    return env.ASSETS.fetch(request);
  },
};
