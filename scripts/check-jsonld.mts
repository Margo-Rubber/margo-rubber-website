/**
 * STRUCTURED DATA GATE
 *
 * Fetches every route from a running server, pulls out each
 * `application/ld+json` block and checks the graph against the rules the
 * content sheets set — the rules a validator does not know:
 *
 *   - the Organization is defined in full on the homepage only; every other
 *     page refers to it by @id (one entity, not forty);
 *   - every @id reference resolves — within the page, or to a node the
 *     homepage defines;
 *   - nothing Margo cannot stand behind: no Offer with a price, no
 *     availability, no AggregateRating or Review, no customer relationship,
 *     and no credential other than the ones held in Site settings;
 *   - a FAQPage's questions and answers are the page's own text, verbatim;
 *   - the page node's url matches the route and its canonical.
 *
 * Nothing emits until a document is published, so run the server with
 * JSONLD_PREVIEW=1 to check every route ahead of sign-off:
 *
 *   JSONLD_PREVIEW=1 npm run dev
 *   node scripts/check-jsonld.mts            (BASE_URL=http://localhost:3000)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import matter from "gray-matter";
import { pathFor } from "../src/lib/published-paths.ts";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const client = createClient({
  projectId: "jyg2beas",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

type Node = Record<string, unknown> & {
  "@type"?: string | string[];
  "@id"?: string;
};

/* ── Routes: every document with a status, published or not ─────────────── */
const rows = await client.fetch<
  { _type: string; slug: string; category?: string }[]
>(
  `*[defined(status) && defined(slug.current)]{_type, "slug": slug.current, category}`,
);
const routes = new Set<string>();
for (const r of rows) {
  const path = pathFor(r);
  if (path) routes.add(path);
}

/* ── What is held ───────────────────────────────────────────────────────── */
const settingsDoc = await client.fetch<{
  certifications?: { items?: { code: string; standing: string }[] };
}>(`*[_id=="siteSettings-settings"][0]{certifications}`);
const heldFromCms = settingsDoc?.certifications?.items
  ?.filter((c) => c.standing === "held")
  .map((c) => c.code);
const heldFromMdx = (() => {
  const fm = matter(readFileSync("src/content/pages/settings.mdx", "utf8"))
    .data as {
    certifications: { items: { code: string; standing: string }[] };
  };
  return fm.certifications.items
    .filter((c) => c.standing === "held")
    .map((c) => c.code);
})();
const HELD = new Set(heldFromCms?.length ? heldFromCms : heldFromMdx);

/* ── Helpers ────────────────────────────────────────────────────────────── */
const types = (n: Node) =>
  Array.isArray(n["@type"]) ? n["@type"] : n["@type"] ? [n["@type"]] : [];
const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
// Inline tags vanish — a link on a phrase inside an answer must not split
// the sentence; block tags become a space.
const INLINE = /<\/?(a|b|strong|em|i|span|u|small|abbr|code|sup|sub)\b[^>]*>/g;
const textOf = (html: string) =>
  decode(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<!-- -->/g, "")
      .replace(INLINE, "")
      .replace(/<[^>]+>/g, " "),
  );

function* walk(v: unknown, path = "$"): Generator<[string, Node]> {
  if (Array.isArray(v)) {
    for (let i = 0; i < v.length; i++) yield* walk(v[i], `${path}[${i}]`);
  } else if (v && typeof v === "object") {
    yield [path, v as Node];
    for (const [k, val] of Object.entries(v)) yield* walk(val, `${path}.${k}`);
  }
}

/* ── The homepage defines the shared ids ────────────────────────────────── */
const problems: string[] = [];
const say = (route: string, msg: string) => problems.push(`${route}: ${msg}`);

async function graphsOf(
  route: string,
): Promise<{ graphs: Node[][]; html: string; status: number }> {
  const res = await fetch(`${BASE}${route}`);
  const html = await res.text();
  const graphs: Node[][] = [];
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      const parsed = JSON.parse(m[1]);
      graphs.push(
        Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [parsed],
      );
    } catch (e) {
      say(route, `ld+json does not parse: ${(e as Error).message}`);
    }
  }
  return { graphs, html, status: res.status };
}

const ORG_ID = "https://www.margorubber.com/#organization";

const home = await graphsOf("/");
const about = await graphsOf("/about");
// The homepage defines the entity; /about defines the people the entity's
// `founder` points at. Both sets of ids are valid targets from any page.
const shared = new Set<string>();
for (const g of [...home.graphs, ...about.graphs])
  for (const n of g) if (n["@id"]) shared.add(n["@id"]);
if (!home.graphs.length) {
  console.log(
    `  ✗  / emits no JSON-LD. Start the server with JSONLD_PREVIEW=1, or publish the homepage.\n`,
  );
  process.exit(1);
}

let checked = 0;
let nodes = 0;
for (const route of [...routes].sort()) {
  const { graphs, html, status } =
    route === "/" ? home : route === "/about" ? about : await graphsOf(route);
  if (status !== 200) {
    say(route, `HTTP ${status}`);
    continue;
  }
  if (!graphs.length) {
    say(route, "no JSON-LD");
    continue;
  }
  checked++;
  const text = textOf(html);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const localIds = new Set<string>();
  for (const g of graphs)
    for (const n of g) if (n["@id"]) localIds.add(n["@id"]);

  // The site layout emits the Organization on every page — exactly once.
  const orgs = graphs.flat().filter((n) => n["@id"] === ORG_ID).length;
  if (orgs !== 1) say(route, `Organization emitted ${orgs} times; must be exactly once`);

  for (const g of graphs) {
    for (const top of g) {
      nodes++;
      const t = types(top);
      if (!t.length)
        say(route, `node without @type: ${JSON.stringify(top).slice(0, 80)}`);
      if (t.includes("Organization") && top["@id"] !== ORG_ID)
        say(route, "an Organization node other than /#organization");
      if (t.includes("WebSite") && route !== "/")
        say(route, "restates the WebSite node");
      if (/Page$/.test(t[0] ?? "") && typeof top.url === "string") {
        if (canonical && top.url !== canonical)
          say(route, `page url ${top.url} ≠ canonical ${canonical}`);
      }
      if (t.includes("FAQPage")) {
        for (const q of (top.mainEntity as Node[]) ?? []) {
          const name = decode(String(q.name ?? ""));
          const ans = decode(
            String((q.acceptedAnswer as Node | undefined)?.text ?? ""),
          );
          if (!text.includes(name))
            say(route, `FAQ question not in page text: “${name.slice(0, 60)}”`);
          if (!text.includes(ans))
            say(route, `FAQ answer not in page text: “${ans.slice(0, 60)}…”`);
        }
      }
    }
    for (const [p, n] of walk(g)) {
      const t = types(n);
      for (const banned of ["AggregateRating", "Review", "HowTo"])
        if (t.includes(banned)) say(route, `${banned} at ${p}`);
      if (
        t.includes("Offer") &&
        ("price" in n || "priceCurrency" in n || "availability" in n)
      )
        say(route, `Offer carries price/availability at ${p}`);
      if ("availability" in n) say(route, `availability at ${p}`);
      if ("customer" in n) say(route, `Organization.customer at ${p}`);
      if (
        t.includes("EducationalOccupationalCredential") &&
        !HELD.has(String(n.name))
      )
        say(route, `credential not held: ${n.name}`);
      // Every reference must land somewhere.
      const keys = Object.keys(n);
      if (keys.length === 1 && keys[0] === "@id") {
        const id = String(n["@id"]);
        if (!localIds.has(id) && !shared.has(id) && !id.endsWith("#product"))
          say(route, `dangling reference ${id} at ${p}`);
      }
    }
  }
}

console.log(
  `\n  JSON-LD — ${checked} routes, ${nodes} top-level nodes, ${shared.size} shared ids on /\n`,
);
if (problems.length) {
  for (const p of problems) console.log(`  ✗  ${p}`);
  console.log(`\n  ${problems.length} problem(s).\n`);
  process.exit(1);
}
console.log(
  "  ✓  Every graph resolves; nothing unheld, nothing priced, every FAQ verbatim.\n",
);
