/**
 * VERBATIM COPY GATE
 *
 * Every apply script (scripts/sheets/apply/*) records the strings the page
 * must show, exactly as the sheet wrote them, in scripts/sheets/expect/
 * <document>.json. This fetches each route from a running server and
 * asserts each string is present in the page text — em dashes, curly
 * quotes and non-breaking spaces included. A miss names the page and the
 * string. The copy pass is a diff, not a glance.
 *
 *   node scripts/check-copy.mts             (BASE_URL=http://localhost:3000)
 */

import { readdirSync, readFileSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

/** Document id → route. */
const ROUTE: Record<string, string> = {
  "homePage-home": "/",
  "productsHub-products": "/products",
  "industriesHub-industries": "/industries",
  "resourcesHub-resources": "/resources",
  "contactPage-contact": "/contact",
  "aboutPage-about": "/about",
  "exportPage-export": "/export",
  "certificationsPage-certifications": "/certifications",
  "caseStudiesPage-case-studies": "/case-studies",
  "whyMargoPage-why-margo": "/why-margo",
  "siteFooter-footer": "/",
};
const routeFor = (id: string) => {
  if (ROUTE[id]) return ROUTE[id];
  const m = id.match(/^(productCategory|industry|resource|legal|sku)-(.+)$/);
  if (!m) return null;
  const base = {
    productCategory: "/products",
    industry: "/industries",
    resource: "/resources",
    legal: "/legal",
    sku: "/products",
  }[m[1]];
  return m[1] === "sku"
    ? `/products/${m[2].replace("--", "/")}`
    : `${base}/${m[2]}`;
};

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
const norm = (s: string) => decode(s).replace(/\s+/g, " ").trim();
// Inline tags vanish (a link inside a sentence must not split it); block
// tags become a space so neighbouring elements do not run together.
const INLINE = /<\/?(a|b|strong|em|i|span|u|small|abbr|code|sup|sub)\b[^>]*>/g;
const textOf = (html: string) =>
  norm(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<!-- -->/g, "")
      .replace(INLINE, "")
      .replace(/<[^>]+>/g, " "),
  );

let pages = 0;
let strings = 0;
const misses: string[] = [];
for (const f of readdirSync("scripts/sheets/expect").filter((f) =>
  f.endsWith(".json"),
)) {
  const id = f.replace(/\.json$/, "");
  const route = routeFor(id);
  if (!route) {
    misses.push(`${id}: no route mapping`);
    continue;
  }
  const expect = JSON.parse(
    readFileSync(`scripts/sheets/expect/${f}`, "utf8"),
  ) as string[];
  const res = await fetch(`${BASE}${route}`);
  if (res.status !== 200) {
    misses.push(`${route}: HTTP ${res.status}`);
    continue;
  }
  const text = textOf(await res.text());
  pages++;
  for (const s of expect) {
    strings++;
    if (!text.includes(norm(s)))
      misses.push(`${route}: “${s.length > 90 ? s.slice(0, 87) + "…" : s}”`);
  }
}

console.log(`\n  copy — ${pages} page(s), ${strings} string(s) checked\n`);
if (misses.length) {
  for (const m of misses) console.log(`  ✗  ${m}`);
  console.log(`\n  ${misses.length} miss(es).\n`);
  process.exit(1);
}
console.log("  ✓  Every sheet string is on its page, verbatim.\n");
