/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Static hosts do not provide the Next.js image optimization server.
  images: { unoptimized: true },
};

export default nextConfig;
