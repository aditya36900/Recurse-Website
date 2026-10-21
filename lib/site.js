const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Recurse — The Technical Club of KMIT",
  shortName: "Recurse KMIT",
  description:
    "Recurse is the technical club of Keshav Memorial Institute of Technology (KMIT), Hyderabad—building student communities around technology, programming, workshops, hackathons, and career opportunities.",
  url: (configuredUrl || "https://recursekmit.vercel.app").replace(/\/$/, ""),
  email: "recursekmit@gmail.com",
  instagram: "https://www.instagram.com/recurse.official/",
  linkedin: "https://www.linkedin.com/company/recursekmit",
  collegeName: "Keshav Memorial Institute of Technology",
  collegeUrl: "https://kmit.in/",
};
