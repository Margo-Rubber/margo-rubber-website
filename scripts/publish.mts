/**
 * PUBLISH — flip document statuses, once the site they render on is live.
 *
 *   npm run publish:pages                          what is at which status, by route
 *   npm run publish:pages -- --write               placeholder → published, every routed document
 *   npm run publish:pages -- --write /products/diaphragms /industries/transport
 *
 * `status` is the one switch that decides whether a page is indexable: a
 * published document lifts its `noindex, nofollow`, joins the sitemap and
 * emits its structured data (src/lib/seo.ts, app/sitemap.ts,
 * lib/schema.ts). That is the last step of the copy pass and it belongs to
 * cutover — the canonicals point at https://margorubber.in, so publishing
 * before that domain serves this site would ask search engines to index
 * pages whose canonical is somewhere else. Nothing here runs without
 * --write, and --write backs the dataset up first.
 *
 * Documents with no public route (settings, the footer, the 404, the
 * thank-you page) are left as they are: their status is not a switch.
 * After a write, `npm run revalidate --all` tells the site.
 */

import { backupDataset, client } from "./sheets/lib.mts";
import { NO_ROUTE, pathFor } from "../src/lib/published-paths.ts";
import { REDIRECTS } from "../src/content/redirects.ts";

/**
 * Never published by this script. /why-margo is the page the parked takedown
 * sheet (30) says to unpublish and redirect — it carries certifications not
 * held and a fabricated history — and it stays noindex until Ayaz decides.
 */
const HOLD = new Set(["/why-margo"]);

const WRITE = process.argv.includes("--write");
const only = process.argv.slice(2).filter((a) => a.startsWith("/"));

type Row = { _id: string; _type: string; slug: string; category?: string; status: string };
const rows = (await client.fetch(
  `*[defined(status) && defined(slug.current)]{_id, _type, "slug": slug.current, category, status} | order(_type, slug)`,
)) as Row[];

const routed = rows
  .map((r) => ({ ...r, path: NO_ROUTE.has(r.slug) ? null : pathFor(r) }))
  .filter((r): r is Row & { path: string } => !!r.path && !REDIRECTS.some((x) => x.from === r.path) && !HOLD.has(r.path))
  .filter((r) => !only.length || only.includes(r.path));

const counts = routed.reduce<Record<string, number>>((acc, r) => ((acc[r.status] = (acc[r.status] ?? 0) + 1), acc), {});
console.log(`\n${routed.length} routed document(s): ${Object.entries(counts).map(([s, n]) => `${n} ${s}`).join(" · ")}`);
for (const r of routed) console.log(`  ${r.status.padEnd(11)} ${r.path}`);

const pending = routed.filter((r) => r.status !== "published");
if (!WRITE) {
  console.log(`\n${pending.length} would be published. Run with --write to publish.`);
  process.exit(0);
}
if (!pending.length) {
  console.log("\nnothing to publish.");
  process.exit(0);
}

await backupDataset("publish");
let tx = client.transaction();
for (const r of pending) tx = tx.patch(r._id, { set: { status: "published" } });
await tx.commit();
console.log(`\n✓ ${pending.length} document(s) published. Now: npm run revalidate --all`);
