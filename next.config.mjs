import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

// Production is a static export served by Cloudflare. In `next dev`, API calls are proxied to
// the Ghost Process Worker running locally (`npm run dev:api`).
export default function nextConfig(phase) {
  /** @type {import('next').NextConfig} */
  return {
    ...(phase === PHASE_DEVELOPMENT_SERVER
      ? { rewrites: async () => [{ source: "/api/:path*", destination: "http://127.0.0.1:8787/api/:path*" }] }
      : { output: "export" }),
    // Static hosts do not provide the Next.js image optimization server.
    images: { unoptimized: true },
  };
}
