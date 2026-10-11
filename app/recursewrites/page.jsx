import RecurseWrites from "@/components/RecurseWrites";

export const metadata = {
  title: "Recurse Writes — Weekly Articles",
  description:
    "Discover stories, ideas, and insights from the Recurse KMIT community. A new article every week on Medium and Substack.",
  alternates: {
    canonical: "/recursewrites",
  },
  openGraph: {
    type: "website",
    url: "/recursewrites",
    title: "Recurse Writes — Weekly Articles by Recurse KMIT",
    description:
      "Curious about tech? Read weekly articles by the Recurse KMIT community on Medium and Substack.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Recurse Writes — Weekly Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export default function RecurseWritesPage() {
  return <RecurseWrites />;
}
