/**
 * MIGRATION — About › Client list: one entry per client (27 Oct 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-about-client-entries.mts           (dry run)
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-10-27-about-client-entries.mts --write
 *
 * RUN THIS ONLY AFTER THE SITE WITH THE NEW CODE IS DEPLOYED. The new code
 * reads both shapes; the old code reads only plain names, so converting
 * first would break the live About page until the deploy lands.
 *
 * Before: two parallel lists in "Client list" — `items` (names) and
 *         `sectors` (one per name, by position).
 * After:  `items` is a list of entries, each { name, sector, logo }, so a
 *         client's name, sector and logo are edited together in Studio.
 *
 * Any logo uploaded in the short-lived separate "Client logos" list (`logos`,
 * matched by name) is moved onto its client's entry. `sectors` and `logos`
 * are then removed.
 *
 * Works on published AND draft documents. Idempotent: once converted, a
 * second run finds nothing to do. Each write uses ifRevisionId, so a
 * concurrent Studio edit makes it fail rather than be overwritten.
 */
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const write = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error("SANITY_WRITE_TOKEN is not set — run with --env-file=.env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "jyg2beas",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

type Logo = { _key?: string; _type?: string; client?: string; alt?: string; asset?: unknown; hotspot?: unknown; crop?: unknown };
type Entry = { _key: string; _type: "client"; name: string; sector?: string; logo?: Record<string, unknown> };
type Doc = {
  _id: string;
  _rev: string;
  clients?: { items?: (string | Entry)[]; sectors?: string[]; logos?: Logo[] };
};

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

const docs = await client.fetch<Doc[]>(
  `*[_type == "aboutPage" && !(_id in path("versions.**"))]{ _id, _rev, clients }`,
);
console.log(`${docs.length} About document(s) (published and drafts)${write ? "" : " — DRY RUN"}`);

let changed = 0;
for (const doc of docs) {
  const label = doc._id.startsWith("drafts.") ? `${doc._id} [draft]` : doc._id;
  const c = doc.clients;
  const items = c?.items ?? [];
  const needsConvert = items.some((it) => typeof it === "string");
  const hasOld = (c?.sectors?.length ?? 0) > 0 || (c?.logos?.length ?? 0) > 0;

  if (!needsConvert && !hasOld) {
    console.log(`  ✓ ${label} — already converted`);
    continue;
  }

  const logos = new Map((c?.logos ?? []).filter((l) => l.client && l.asset).map((l) => [norm(l.client!), l]));

  const next: Entry[] = items.map((it, i) => {
    const entry: Entry =
      typeof it === "string"
        ? { _key: randomUUID().slice(0, 12), _type: "client", name: it, ...(c?.sectors?.[i] ? { sector: c.sectors[i] } : {}) }
        : { ...it };
    const l = logos.get(norm(entry.name));
    if (l && !entry.logo) {
      entry.logo = {
        _type: "image",
        asset: l.asset,
        ...(l.alt ? { alt: l.alt } : {}),
        ...(l.hotspot ? { hotspot: l.hotspot } : {}),
        ...(l.crop ? { crop: l.crop } : {}),
      };
      logos.delete(norm(entry.name));
    }
    return entry;
  });

  changed++;
  console.log(`\n■ ${label}`);
  for (const e of next) console.log(`    + ${e.name}${e.sector ? ` — ${e.sector}` : ""}${e.logo ? "  [logo]" : ""}`);
  for (const [name] of logos) console.log(`    ! logo for "${name}" matches no client name — not moved; re-upload it on the right entry`);

  if (write) {
    await client
      .patch(doc._id)
      .ifRevisionId(doc._rev)
      .set({ "clients.items": next })
      .unset(["clients.sectors", "clients.logos"])
      .commit();
  }
}

console.log(`\n${write ? "Converted" : "Would convert"} ${changed} document(s).`);
if (!write) console.log("Dry run. Re-run with --write to apply.");
