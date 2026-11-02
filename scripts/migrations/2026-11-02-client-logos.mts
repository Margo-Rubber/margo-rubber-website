/**
 * MIGRATION — About › Client list: logos for fourteen more clients, and the
 * two Abhijeet entries made one (client, 2 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-client-logos.mts [--write]
 *
 * The files are in scripts/data/client-logos/, cleaned from what Margo sent:
 * each trimmed to its mark with an even 8% white margin, so it fills the
 * card's white plate like the first eight (shown whole, never cropped).
 * Samartha Dies' mark is a vector redraw of a 119 px original; Satish
 * Injecto-Plast's came from a 50 px directory thumbnail, so it is soft;
 * Ukay's grey panel was made white and Almaas' black corners removed.
 *
 * Abhijeet Plastics (India) and Abhijeet Techno-Plast are one company: the
 * Plastics card keeps its place and takes the logo; Techno-Plast is removed.
 *
 * Uploads are deduplicated by Sanity (an asset's id is its content hash), so a
 * re-run reuses them. Published AND draft; ifRevisionId on every write.
 */
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";

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

const DIR = "scripts/data/client-logos";
/** Client name as on the page → logo file. */
const LOGOS: Record<string, string> = {
  "Neo Wheels": "neo-wheels.png",
  "Ukay Metal Industries": "ukay-metal-industries.png",
  "Satish Injecto-Plast": "satish-injecto-plast.png",
  "Abhijeet Plastics (India)": "abhijeet.png",
  "Mutual Industries": "mutual-industries.png",
  "Amalgamated Industrial Composites": "amalgamated-industrial-composites.png",
  "Boost Electronics": "boost-electronics.png",
  "Talco India": "talco-india.png",
  "Almaas Moulding Works": "almaas-moulding-works.png",
  "Press Tool Engineering Works": "press-tool-engineering-works.png",
  "Suvidh Engineering Industries": "suvidh-engineering-industries.png",
  "Samartha Dies": "samartha-dies.png",
  "Vactech Surgical Equipment": "vactech-surgical-equipment.png",
  "Shivi Chemical Technologies": "shivi-chemical-technologies.png",
};
const DROP = "Abhijeet Techno-Plast";

type Item = { _key: string; name: string; logo?: { asset?: { _ref: string } } };
type Doc = { _id: string; _rev: string; clients?: { items?: Item[] } };

const docs = await client.fetch<Doc[]>(`*[_id in ["aboutPage-about", "drafts.aboutPage-about"]]{ _id, _rev, clients }`);
if (!docs.length) throw new Error("No About page document");

const assetIds = new Map<string, string>();
async function asset(file: string): Promise<string> {
  if (!assetIds.has(file)) {
    if (!write) {
      assetIds.set(file, `(upload ${file})`);
    } else {
      const a = await client.assets.upload("image", await readFile(`${DIR}/${file}`), { filename: file });
      assetIds.set(file, a._id);
    }
  }
  return assetIds.get(file)!;
}

for (const doc of docs) {
  const items = doc.clients?.items ?? [];
  const patch = client.patch(doc._id).ifRevisionId(doc._rev);
  const changes: string[] = [];

  for (const [name, file] of Object.entries(LOGOS)) {
    const it = items.find((i) => i.name === name);
    if (!it) throw new Error(`${doc._id}: no client named "${name}"`);
    if (it.logo?.asset) continue;
    patch.set({
      [`clients.items[_key=="${it._key}"].logo`]: {
        _type: "image",
        asset: { _type: "reference", _ref: await asset(file) },
        alt: `${name} logo`,
      },
    });
    changes.push(`logo ${name}`);
  }

  const drop = items.find((i) => i.name === DROP);
  if (drop) {
    patch.unset([`clients.items[_key=="${drop._key}"]`]);
    changes.push(`remove ${DROP}`);
  }

  if (!changes.length) {
    console.log(`${doc._id}: already done — nothing to do.`);
    continue;
  }
  console.log(`${doc._id}:\n  ${changes.join("\n  ")}`);
  if (write) console.log(`  Patched → rev ${(await patch.commit())._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
