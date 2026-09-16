/**
 * THE PAGE MATRIX — the Build Checklist's eight checks, run on every route.
 *
 * "Eight checks per page, in build order: Copy · H1 · Meta · JSON-LD · Alt
 * · Links · CTA · 375px." Copy is check:copy, JSON-LD is check:jsonld,
 * Links is check:links and 375px is a browser pass; this script is the
 * other four plus the sitewide markup rules the sheets repeat on every page:
 *
 *   H1     exactly one <h1>, with words in it and the two lines a space apart
 *   Meta   <title> and description present and within the sheets' limits;
 *          canonical = https://margorubber.in + path; a robots directive
 *   Alt    every <img> carries alt text (decorative ones empty on purpose)
 *   CTA    a way to enquire on the page — a link to /contact or a tel: link
 *   Outline stat values and footer labels are not headings; no heading is empty
 *   Text   nothing that only a template prints: "undefined", "[object Object]",
 *          "NaN", a raw slug in a sentence, a leftover "Contact for number"
 *
 * Run against a dev server:  node scripts/check-matrix.mts [/route …]
 */

import { createClient } from "@sanity/client";
import { readdirSync, readFileSync } from "node:fs";
import { pathFor, NO_ROUTE, PAGE_PATH } from "../src/lib/published-paths.ts";
import { REDIRECTS } from "../src/content/redirects.ts";
import { INDUSTRIES, PRODUCTS } from "../src/content/routes.ts";

/** Registry slugs that would only ever appear in prose by mistake. */
const SLUGS = [...PRODUCTS, ...INDUSTRIES]
  .map((e) => e.slug)
  .filter((s) => !["o-rings", "bellows", "gaskets", "grommets", "bushes", "automotive", "mining", "agriculture", "construction", "transport", "seals", "diaphragms", "extrusion", "hvac"].includes(s));

/**
 * Each sheet's own head tags, by the route its kicker names — a SKU sheet
 * names the part's old URL, mapped through the redirects to where it is.
 * The <title> and description on the page must be the sheet's, exactly.
 */
const SHEET_HEAD = new Map<string, { title?: string; description?: string; sheet: string }>();
for (const f of readdirSync("scripts/sheets/out").filter((f) => f.endsWith(".json"))) {
  const j = JSON.parse(readFileSync(`scripts/sheets/out/${f}`, "utf8")) as { kicker?: string; head: { title?: string; description?: string } };
  const m = j.kicker?.match(/·\s*(\/\S*)/);
  const path = f.startsWith("01_") ? "/" : m?.[1];
  if (!path || path.includes("{")) continue;
  const moved = REDIRECTS.find((r) => r.from === path);
  const at = moved ? moved.to : path;
  // A folded duplicate's sheet (16, 29) maps onto its survivor's route; the survivor's own head is the one that ships.
  if (!SHEET_HEAD.has(at)) SHEET_HEAD.set(at, { ...j.head, sheet: f.replace(/\.json$/, "") });
}

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SITE = "https://margorubber.in";
const client = createClient({ projectId: "jyg2beas", dataset: "production", apiVersion: "2025-01-01", useCdn: false });

const only = process.argv.slice(2).filter((a) => a.startsWith("/"));
const rows = await client.fetch<{ _type: string; slug: string; category?: string }[]>(
  `*[defined(status) && defined(slug.current)]{_type, "slug": slug.current, category}`,
);
const routes = new Set<string>();
for (const r of rows) {
  if (NO_ROUTE.has(r.slug)) continue;
  const p = pathFor(r);
  if (p && !REDIRECTS.some((x) => x.from === p)) routes.add(p);
}
for (const p of Object.values(PAGE_PATH)) if (!NO_ROUTE.has(p.slice(1))) routes.add(p);
const list = (only.length ? only : [...routes]).sort();

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ");
const strip = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const attr = (tag: string, name: string) => decode(tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] ?? "");

let failures = 0;
let pages = 0;
for (const route of list) {
  const res = await fetch(`${BASE}${route}`);
  const html = await res.text();
  const problems: string[] = [];
  if (res.status !== 200) problems.push(`HTTP ${res.status}`);

  // Only the page — the script tags carry JSON-LD and React payloads.
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "");

  /* H1 */
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => strip(m[1]));
  if (h1s.length !== 1) problems.push(`${h1s.length} <h1> elements`);
  else if (h1s[0].length < 4) problems.push(`h1 too short: "${h1s[0]}"`);
  // Two lines run together — the sitewide whitespace bug: a lower-case
  // letter followed directly by an upper-case one inside one word.
  if (h1s[0] && /[a-z][A-Z]/.test(h1s[0].replace(/[A-Z]{2,}/g, ""))) problems.push(`h1 lines run together: "${h1s[0]}"`);

  /* Meta */
  const title = strip(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const description = attr(html.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0] ?? "", "content");
  const canonical = attr(html.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0] ?? "", "href");
  const robots = attr(html.match(/<meta\b[^>]*name="robots"[^>]*>/)?.[0] ?? "", "content");
  if (!title) problems.push("no <title>");
  else if (title.length > 70) problems.push(`title ${title.length} chars: "${title}"`);
  if (!description) problems.push("no meta description");
  else if (description.length > 220) problems.push(`description ${description.length} chars`);
  const expectCanonical = `${SITE}${route === "/" ? "" : route}`;
  if (canonical !== expectCanonical && canonical !== `${expectCanonical}/`) problems.push(`canonical "${canonical}" ≠ ${expectCanonical}`);
  if (!robots) problems.push("no robots directive");
  const sheet = SHEET_HEAD.get(route);
  if (sheet?.title && title !== sheet.title) problems.push(`title is not the sheet's (${sheet.sheet}):\n         page  "${title}"\n         sheet "${sheet.title}"`);
  if (sheet?.description && description !== sheet.description) problems.push(`description is not the sheet's (${sheet.sheet}):\n         page  "${description}"\n         sheet "${sheet.description}"`);

  /* Alt */
  const imgs = [...body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\salt=/.test(t));
  if (noAlt.length) problems.push(`${noAlt.length} <img> without alt`);

  /* CTA */
  if (!/href="\/contact(?:[?"#])|href="tel:/.test(body)) problems.push("no enquiry route (link to /contact or tel:)");

  /* Outline */
  const headings = [...body.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g)];
  const empty = headings.filter((m) => !strip(m[2]));
  if (empty.length) problems.push(`${empty.length} empty heading(s)`);
  const footer = body.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? "";
  if (/<h[1-6]\b/.test(footer)) problems.push("heading inside <footer>");
  // A stat value marked up as a heading: a heading that is only a number/unit.
  const statHeadings = headings.filter((m) => /^[\d.,+%–-]+\s*[A-Za-z%°]{0,6}$/.test(strip(m[2])));
  if (statHeadings.length) problems.push(`stat value as heading: ${statHeadings.map((m) => `"${strip(m[2])}"`).join(", ")}`);

  /* Text */
  const text = strip(body);
  for (const bad of ["undefined", "[object Object]", "NaN", "Contact for number", "Contact for email", "+91 (Nashik)", "Lorem ipsum", "TODO"]) {
    const re = new RegExp(`(^|[^A-Za-z])${bad.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-z]|$)`);
    if (re.test(text)) problems.push(`prints "${bad}"`);
  }
  // A raw slug in prose — "Available to hvac buyers", "oil-seals for": a
  // registry slug, as a lower-case word, in a sentence. Slugs that are also
  // ordinary hyphenated words are left out.
  const leak = SLUGS.find((slug) => new RegExp(`(^|[\\s(])${slug}(?=[\\s.,;)])`).test(text));
  if (leak) problems.push(`slug in prose: "${leak}"`);

  pages++;
  if (problems.length) {
    failures++;
    console.log(`\n  ✗  ${route}`);
    for (const p of problems) console.log(`       ${p}`);
  }
}

console.log(`\n  matrix — ${pages} page(s) checked, ${failures} with problems`);
process.exit(failures ? 1 : 0);
