/**
 * THE OLD SITE'S URLS — what the redirect map still misses.
 *
 *   node scripts/legacy-urls.mts [https://margorubber.in]
 *
 * Reads the WordPress site's sitemap index and every sitemap it lists, and
 * prints each path that neither has a redirect in src/content/redirects.ts
 * nor is a path this site serves unchanged. Run it the day DNS moves
 * (CUTOVER.md §7): anything WordPress has published since the map was made
 * (2026-09-18) shows up here and gets a line in the map before the switch.
 */

import { LEGACY_PATHS, REDIRECTS } from "../src/content/redirects.ts";

const origin = process.argv[2] ?? "https://margorubber.in";

const locs = (xml: string) =>
  [...xml.matchAll(/<loc>(?:<!\[CDATA\[)?\s*([^<\]\s]+)\s*(?:\]\]>)?<\/loc>/g)].map((m) => m[1]);

const index = await (await fetch(`${origin}/sitemap.xml`)).text();
const sitemaps = locs(index).filter((u) => u.endsWith(".xml"));
const urls = new Set<string>();
for (const sm of sitemaps) {
  const xml = await (await fetch(sm)).text();
  for (const u of locs(xml)) if (!u.endsWith(".xml")) urls.add(u);
}

const mapped = new Set(REDIRECTS.map((r) => r.from));
const missing: string[] = [];
for (const u of [...urls].sort()) {
  const path = new URL(u).pathname.replace(/\/$/, "") || "/";
  if (mapped.has(path) || LEGACY_PATHS.has(path)) continue;
  missing.push(path);
}

console.log(`${urls.size} URL(s) in ${sitemaps.length} sitemap(s) at ${origin}`);
if (missing.length) {
  console.log(`\n${missing.length} without a redirect — add each to src/content/redirects.ts:`);
  for (const m of missing) console.log(`  ${m}`);
  process.exit(1);
}
console.log("every path is mapped or unchanged.");
