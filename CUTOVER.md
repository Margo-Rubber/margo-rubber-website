# Cutover — from the WordPress site to this one

The copy pass is finished: every page is built from its content sheet and
checked both ways (`check:copy`, `check:coverage`), the structured data
resolves (`check:jsonld`), the links hold (`check:links`), the page matrix
passes (`check:matrix`) and every route fits a 375 px screen. What remains is
infrastructure and the switch that makes the pages indexable — in that
order, because the canonicals on every page point at `https://margorubber.in`
and publishing before that domain serves this site tells search engines to
index pages whose canonical is somewhere else.

Everything below is run by the owner of the Vercel project and the domain.
Nothing here needs a code change.

## 1. The Vercel project (buyer build)

Environment variables on the production deployment:

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | The Neon connection string — enquiries are stored here (`src/lib/enquiry/store.ts`). |
| `SANITY_REVALIDATE_SECRET` | Shared with the Sanity webhook (step 2). With it unset the endpoint refuses everything. |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | The enquiries desk at `/margo-desk`. |
| `ENQUIRIES_READ_TOKEN` | Read access to the enquiries API. |
| `RESEND_API_KEY`, `ENQUIRY_TO`, `ENQUIRY_FROM` | Enquiry notification email — after the DNS records in `23_DNS_Setup_For_Website_Email.md` are in place. Optional until then; enquiries are stored either way. |
| `NEXT_PUBLIC_BUILD_MODE` | **Leave unset** on the buyer build. `vision` turns on the concept band, `noindex` on every page and the basic-auth gate (`PREVIEW_USER` / `PREVIEW_PASSWORD`) — that is the separate, password-protected preview the Build Instructions ask for, never the public site. |

Deploys come from merge commits on `main` made by the project owner (Hobby
plan rule). The site's Sanity reads need no token — the dataset is public and
the client reads the published perspective only (`sanity/client.ts`).

## 2. The Sanity webhook

Studio → Manage → API → Webhooks: a POST to `https://margorubber.in/api/revalidate`
on create/update/delete of every document type, with the secret from step 1
and the projection `{ _type, "slug": slug.current }`. Until it is registered,
a publish in the Studio does not reach the site; `npm run revalidate --all`
(with `SITE=https://margorubber.in`) does the same by hand.

## 3. DNS and the edge

- Point `margorubber.in` (and `www`) at Vercel; the old WordPress host goes.
- Cloudflare, if it fronts the domain: allow the AI crawlers the site is
  written for — GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Bingbot —
  which are blocked by default on new zones since 2026-09-15 (Build
  Checklist, Gate 1). `robots.txt` already names them.
- The email records for `send.margorubber.in` — `23_DNS_Setup_For_Website_Email.md`.

## 4. Before the switch — the client's own gates

From the Build Checklist, Gate 2, still open on the client's side:

- Permission letters for the client names and logos on the pages (decision of
  2026-09-03: names stay; letters required before indexing).
- Counsel sign-off on the three legal pages (sheet 08).
- The ISO 9001:2015 certificate scan as a hosted PDF and the quality policy —
  the download buttons render only once the files exist (OPEN-ITEMS 22, 63, 105).
- The remaining OPEN-ITEMS decisions (`scripts/sheets/OPEN-ITEMS.md`,
  1–116) — none blocks the switch, but each is a fact the client owns.

## 5. The switch

Once `https://margorubber.in` serves this site:

```bash
npm run publish:pages              # what is at which status (dry run)
npm run publish:pages -- --write   # placeholder → published, 76 documents, after a dataset backup
SITE=https://margorubber.in npm run revalidate -- --all
```

`/why-margo` is held out (the parked takedown sheet 30); `/thank-you` and the
404 never index. A document can also be published one at a time in the
Studio — the status field is the same switch.

## 6. After the switch — prove it

```bash
BASE_URL=https://margorubber.in npm run check:matrix     # H1 · meta · alt · CTA · outline, every route
BASE_URL=https://margorubber.in npm run check:jsonld     # the entity graph, now emitted for real
BASE_URL=https://margorubber.in npm run check:copy       # every sheet string, on the live domain
curl -s https://margorubber.in/robots.txt
curl -s https://margorubber.in/sitemap.xml | grep -c '<loc>'          # the published pages
curl -s https://margorubber.in/products/sitemap/0.xml | grep -c '<loc>'
curl -sI https://margorubber.in/products/gaskets/foam-gaskets | head -1  # 301 → sponge-foam-rubber
```

Then Search Console: submit both sitemaps, and request indexing of the
homepage, the fifteen category pages and the eleven industry pages.

## 7. Legacy URLs

The old site's 26 WooCommerce product URLs are 301-mapped from a crawl taken
immediately before the switch (Build Checklist B15) into
`src/content/redirects.ts`, next to the eight redirects already there — one
short PR, merged before DNS moves.
