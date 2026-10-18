# Recurse Website

A responsive Next.js website for Recurse, KMIT's technical club.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm start
```

The homepage is statically prerendered by the Next.js App Router.

Set `NEXT_PUBLIC_SITE_URL` to the final production origin if it changes from
`https://recursekmit.vercel.app`. Canonical URLs, the sitemap, robots metadata,
and structured data use this value.

## Opportunity board

- The public board is available at `/opportunities`.
- Add approved listings to `components/opportunityListings.js` using the
  exported sample as the field reference.
- Student submissions are validated, saved locally as pending, and opened as a
  prepared email to Recurse for moderation.
- To send submissions directly to an automation or form backend, set
  `NEXT_PUBLIC_OPPORTUNITY_SUBMIT_URL` to an endpoint that accepts JSON POST
  requests. The email workflow remains the fallback.

## Recurse Writes

The weekly newsletter archive lives at `/recursewrites`. To publish a new edition:

1. Save the cover image as `public/images/writes/edition-NN.png` (16:9, e.g.
   1672×941). The Substack post's `og:image` works: open the post, view source,
   search for `og:image`, and download that URL.
2. Add an entry to the **top** of the `articles` array in
   `components/articleData.js` (newest first):

   ```js
   {
   	week: 3,                       // edition number, shown as "EDITION 03"
   	title: "Post title",
   	description: "One or two sentence summary.",
   	thumbnail: "/images/writes/edition-03.png",
   	mediumUrl: "https://medium.com/@recursekmit/...",
   	substackUrl: "https://recursekmit.substack.com/p/...",
   	date: "2026-10-18",            // YYYY-MM-DD
   	author: "Author Name",
   },
   ```

3. Run `npm run dev` and check `/recursewrites`. The edition count updates on its own.

## Before launch

- Replace the gallery placeholders with optimized event photos.
- Add the current recruitment form URL.
- Add profile photos and social links for core members when available.
- Download and self-host the fonts if the site must work without external requests.

## Structure

- `app/layout.jsx` — document metadata and root layout
- `app/page.jsx` — homepage route
- `app/team/page.jsx` — club heads and core members route
- `app/opportunities/page.jsx` — searchable opportunity board route
- `app/robots.js`, `app/sitemap.js`, `app/manifest.js` — search and install metadata
- `app/globals.css` — visual system, responsive layout, and motion
- `components/ClubSite.jsx` — complete homepage structure
- `components/TeamSite.jsx` — leadership and core-member page
- `components/OpportunityBoard.jsx` — filters, saved roles, details, and submission workflow
- `components/opportunityListings.js` — approved public listings and listing schema
- `components/timelineEvents.js` — event history
- `components/useSiteInteractions.js` — navigation, reveals, filters, counters, canvas network, and terminal behavior
- `public/icon.svg` — site icon
