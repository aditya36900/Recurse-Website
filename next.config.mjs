import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

// Vercel (and `next dev`) run a server, so the Ghost Process API routes
// (`route.server.js`) are included. Other builds stay a static export for Cloudflare.
export default function nextConfig(phase) {
  const withServer = Boolean(process.env.VERCEL) || phase === PHASE_DEVELOPMENT_SERVER;

  /** @type {import('next').NextConfig} */
  return {
    ...(withServer ? {} : { output: "export" }),
    pageExtensions: withServer ? ["jsx", "js", "server.js"] : ["jsx", "js"],
    // Static hosts do not provide the Next.js image optimization server.
    images: { unoptimized: true },
  };
}
