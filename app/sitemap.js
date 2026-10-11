import { siteConfig } from "@/lib/site";

export default function sitemap() {
  const lastModified = new Date("2026-10-11T00:00:00+05:30");

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/opportunities`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/recursewrites`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/team`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
