export const dynamic = "force-static";

export default function manifest() {
  return {
    name: "Recurse — The Technical Club of KMIT",
    short_name: "Recurse KMIT",
    description:
      "KMIT's student technical club for builders, events, communities, and career opportunities.",
    start_url: "/",
    display: "standalone",
    background_color: "#080a09",
    theme_color: "#a8ff35",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
