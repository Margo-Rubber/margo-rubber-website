# margorubber.in

The website of Margo Rubber Products, Nashik — a rubber moulder and exporter.
Next.js 16 on Vercel, content in Sanity, enquiries in Neon, drawings in
Cloudinary. Every page is built from a content sheet in
`Content_Sheets_for_Developer/` and checked against it, both ways, on every
pull request.

| | |
| --- | --- |
| Live | https://margo-rubber-website-ten.vercel.app (→ https://margorubber.in at cutover, see [CUTOVER.md](CUTOVER.md)) |
| Studio | `/studio` on the deployment — Sanity project `jyg2beas`, dataset `production` |
| Enquiries desk | `/margo-desk` — password in `ADMIN_PASSWORD` |
| Open questions | [scripts/sheets/OPEN-ITEMS.md](scripts/sheets/OPEN-ITEMS.md) — what only Margo can answer |
| Editing the site | [docs/EDITOR-GUIDE.md](docs/EDITOR-GUIDE.md) — for whoever runs the Studio |

## Run it

```bash
npm install
cp .env.example .env.local     # then fill in the values below
npm run dev                    # http://localhost:3000
```

`.env.local` (never committed):

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Enquiries (Neon). Without it, development writes `.enquiries.dev.json`; production refuses loudly. |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | The desk at `/margo-desk`. Rotate by changing them in Vercel and redeploying. |
| `ENQUIRIES_READ_TOKEN` | `GET /api/enquiries` (CSV export, automation). |
| `SANITY_REVALIDATE_SECRET` | The Studio's publish webhook → `/api/revalidate`, and `npm run revalidate`. |
| `SANITY_WRITE_TOKEN` | Only the apply scripts (`--write`). The site itself reads the public dataset with no token. |
| `CLOUDINARY_URL` | Enquiry attachments. Margo's account; the secret never reaches the browser. |
| `NEXT_PUBLIC_SITE_LIVE` | The launch switch — `true` on production once the domain serves the site; every non-draft page becomes indexable. Unset everywhere else. |
| `RESEND_API_KEY`, `ENQUIRY_TO`, `ENQUIRY_FROM` | Enquiry notification email — not yet configured (needs the DNS records in `23_DNS_Setup_For_Website_Email.md`). |

Some office and mobile networks' resolvers refuse `*.neon.tech`; the scripts
that talk to the database take `DNS_SERVERS=1.1.1.1` to look it up elsewhere.

## Where things are

```
src/app/(site)/          the public routes — one folder per page type
src/app/margo-desk/      the enquiries desk (light theme, password gate)
src/app/api/             enquiry, enquiry/upload, enquiries (read), revalidate
src/components/          sections/ (page bands), blocks/ (CMS block renderer), forms/, ui/
src/content/             routes.ts (every category & industry), redirects.ts (every 301),
                         images.ts + image-slot-labels.ts (every photograph slot),
                         schemas/ (zod — the shape every document must satisfy),
                         *.mdx (the file fallback for each document; the CMS is the source)
src/lib/                 *-source.ts (CMS reads), schema.ts (JSON-LD), seo.ts, enquiry/, admin/
sanity/                  schemaTypes/ (the Studio), structure/ (its menus), queries.ts
scripts/                 the checks, the apply pipeline (sheets/), migrations/, publish, revalidate
```

Two registries decide more than they look: `src/content/routes.ts` is the
one list of categories and industries (menus, sitemap, forms, breadcrumbs and
the contact dropdowns all read it), and `src/content/images.ts` is the one
list of photograph slots (one slot per placement, so the Studio's
*Photographs* menu can replace any picture on its own).

## Content: sheets → CMS

The copy lives in the CMS, but it was written in the sheets, and the sheets
are the source of truth. Each sheet has an apply script:

```bash
npm run sheets:parse                                   # sheets → scripts/sheets/out/*.json
node scripts/sheets/apply/<page>.mts                   # dry run: what would change
node scripts/sheets/apply/<page>.mts --write           # write it (needs SANITY_WRITE_TOKEN)
node scripts/sheets/apply/skus.mts --write SKU_06      # one part
npm run revalidate -- --all                            # tell the site (or SITE=https://… for a deployment)
```

Rules the pipeline enforces: publish what the sheet says, verbatim; only a
contradiction *inside* the sheets is a question (logged in OPEN-ITEMS); a
blank is filled later in the Studio, never invented. Inline `**bold**` and
`[text](href)` in a CMS string render through `emphasised()`; `*accent*`
marks a heading's coloured words.

## The checks

All run against a server on `:3000` (`BASE_URL=` for another); CI runs the
first five on every PR (`.github/workflows/checks.yml`).

| Command | Proves |
| --- | --- |
| `check:copy` | every string the apply scripts placed is on its page, verbatim |
| `check:links` | no broken internal link |
| `check:matrix` | per page: one H1, sheet's title/description, canonical, robots, alt text, an enquiry route, a sane outline, no template leaks |
| `check:claims` | no forbidden claim (certifications not held, approvals, figures) — `claims-baseline.json` is the known set; `--update-baseline` after a fix |
| `check:techseo` | every "Technical SEO" line in the sheets, by rule or by recorded verdict (`scripts/sheets/techseo-notes.json`) |
| `check:coverage <sheet> <route>` | the other direction: what a sheet says that its page does not |
| `check:cms` | no document is silently falling back to its `.mdx` file |
| `check:jsonld` | the entity graph resolves (set `JSONLD_PREVIEW=1` in `.env.development.local`, restart, delete after) |
| `check:schema` | the Studio schema validates, every field is labelled, no orphan groups |
| `check:enquiry` | every form's fields map onto the enquiry columns |
| `check:blocks` | CMS blocks round-trip |

## Enquiries

Every form posts JSON to `POST /api/enquiry` → validate → spam checks
(honeypot, 2 s minimum, 20/IP/hour) → Neon → email (when Resend is set) →
CRM webhook. Attachments upload from the browser straight to Cloudinary,
signed by `POST /api/enquiry/upload`, as `type: private`; the desk signs a
one-hour download link when someone opens the enquiry. Schema:
`src/lib/enquiry/schema.sql`, applied with `node scripts/enquiry-schema.mts`.

## Shipping

- Work on a branch; the project owner merges to `main` ("Create a merge
  commit" — Vercel's Hobby plan deploys only the owner's commits).
- Commit as the company identity; no AI co-author trailers.
- Don't run `prettier --write` over files you did not change.
- A CMS change reaches the site through the Studio's publish webhook or
  `npm run revalidate -- --all`; a code change through the deploy.
- Indexability (robots, sitemap, structured data) is one gate, `isIndexable`
  in `src/lib/build-mode.ts`: `published` always, `draft` never, `placeholder`
  only once `NEXT_PUBLIC_SITE_LIVE=true` is set on production — the launch
  switch, see [CUTOVER.md](CUTOVER.md) §5. `npm run publish:pages -- --write`
  is the optional per-document route.
