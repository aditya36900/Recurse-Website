# Recurse Website

A responsive Next.js website for Recurse, KMIT's technical club.

## Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm start
```

The entire site is exported to `out/` by the Next.js App Router. `npm start`
serves that build locally using Cloudflare Workers on port 3000. Use Node.js 22
or newer for the build and Wrangler CLI.

Set `NEXT_PUBLIC_SITE_URL` to the final production origin if it changes from
`https://recursekmit.vercel.app`. Canonical URLs, the sitemap, robots metadata,
and structured data use this value.

## Cloudflare deployment

The same static export supports both Workers Static Assets and Pages. Images
are served directly from `public/` without Next.js server-side image optimization.
Metadata (including the Open Graph image) is generated at build time.
The build compresses exported JPEGs over Cloudflare's 25 MiB asset limit to fit
within 2560×2560 pixels, preserving originals in `public/`, and rejects any remaining
oversized assets. Always use `npm run build` so this preparation step runs.
Interactive features remain client-side; submissions still use the external endpoint or email.
Adding server actions, request-time SSR, or API routes later requires a different
deployment setup.

Set these **build environment variables** in Cloudflare before building:

- `NEXT_PUBLIC_SITE_URL`: your final origin, e.g. `https://recurse.example.com`.
- `NEXT_PUBLIC_OPPORTUNITY_SUBMIT_URL`: optional external JSON submission endpoint;
  it must allow browser requests from your site's origin.
- `NODE_VERSION`: `22` (for Cloudflare Git builds).

For local builds, copy `.env.example` to `.env.local` and fill in your values.
Public environment variables are embedded in the build; changing them requires
a rebuild and deployment.

### Workers

For Git integration, use build command `npm run build` and deploy command
`npx wrangler deploy`. The root `wrangler.jsonc` serves `out/`, resolves clean page
URLs, and returns the exported 404 page for missing routes. Match its `name` to
your Cloudflare Worker name if you choose a different name.

For a manual deployment:

```bash
npx wrangler login
npm run deploy:workers
```

Preview locally with `npm run preview:workers`.

### Pages

For Git integration, select **Next.js (Static HTML Export)**, use build command
`npm run build`, and set the build output directory to `out`. The root directory
is this repository. Pages dashboard settings control Git deployments. The Pages
CLI scripts pass `out` explicitly and ignore the Workers-only `wrangler.jsonc`
(Wrangler may print a warning about the missing `pages_build_output_dir`; this is
expected because that file configures Workers).

For a manual deployment, create the Pages project once (or use an existing project
and update `--project-name` in the `deploy:pages` package script):

```bash
npx wrangler login
npx wrangler pages project create recurse-website
npm run deploy:pages
```

Preview locally with `npm run preview:pages`. Choose Git integration when creating
the Pages project if you want automatic Git deployments; Cloudflare does not allow
switching a Direct Upload project to Git integration later.

Official documentation: [Next.js static exports on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/),
[Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/),
[Pages Wrangler configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/),
and [Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/).

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

## Ghost Process

The puzzle at `/ghost-process` asks for a KMIT roll number first. Each roll number
gets its own restoration key (`ORBIT-XXXX-XXXX`), derived on the server as an HMAC
of the roll number, so a key only works for the roll number it was issued to.
When someone restores the system, the server posts their roll number, key and
completion code to Telegram.

The API lives in `app/api/ghost/*/route.server.js` with helpers in
`lib/ghostServer.js`. These routes are built only on Vercel (where `VERCEL` is set)
and in `npm run dev`. The Cloudflare static export leaves them out, so the puzzle
needs the Vercel deployment.

Set these in **Vercel → Settings → Environment Variables** (server-only, no
`NEXT_PUBLIC_` prefix), then redeploy:

- `GHOST_SECRET`: a long random string, e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
  Keep it fixed for the whole event. Changing it changes every key.
- `TELEGRAM_BOT_TOKEN`: in Telegram, message [@BotFather](https://t.me/BotFather),
  send `/newbot`, and copy the token it returns.
- `TELEGRAM_CHAT_ID`: send your bot any message (or add it to a group and post there),
  then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `message.chat.id`.
  Group IDs are negative.

### Stored keys and solves

Connect **Vercel → Storage → Upstash for Redis** (Marketplace) to the project. It adds
`KV_REST_API_URL` and `KV_REST_API_TOKEN`, which the routes use to record:

- `ghost:player:<ROLL>`: roll number, key, completion code, `startedAt`, `solvedAt`, `failedAttempts`
- `ghost:solved`: solve order (Telegram announces only a roll number's first solve, as "Solver #N")

Browse it in the Upstash console, or export a CSV:

```bash
vercel env pull .env.local
node --env-file=.env.local scripts/ghost-export.mjs > ghost-players.csv
```

In development, a built-in secret is used, and storage and Telegram are skipped
(alerts are printed to the console) when their variables are missing.

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
