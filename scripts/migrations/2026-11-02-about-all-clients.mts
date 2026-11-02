/**
 * MIGRATION — About › Client list: all twenty-four named accounts (client,
 * 2 Nov 2026).
 *
 *   node --experimental-strip-types --env-file=.env.local scripts/migrations/2026-11-02-about-all-clients.mts [--write]
 *
 * The list's label says "Twenty-four named accounts across seven sectors" but
 * only the eight with logos were entered. The other sixteen come from Site
 * settings → Clients (the full list), with sectors in the About page's short
 * form. They are appended after the eight, grouped by sector; no logos yet —
 * the card shows the name on its white plate until one is uploaded in Studio
 * (About page → Client list).
 *
 * Published AND draft documents. Skips any client already listed (by name).
 * ifRevisionId on every write.
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

const ADD: { name: string; sector: string }[] = [
  { name: "Neo Wheels", sector: "Auto components" },
  { name: "Ukay Metal Industries", sector: "Auto components" },
  { name: "Satish Injecto-Plast", sector: "Auto components" },
  { name: "Abhijeet Plastics (India)", sector: "Auto components" },
  { name: "Abhijeet Techno-Plast", sector: "Auto components" },
  { name: "Mutual Industries", sector: "Auto components" },
  { name: "Amalgamated Industrial Composites", sector: "Industrial machinery" },
  { name: "Boost Electronics", sector: "Electrical" },
  { name: "Rohini Industries", sector: "Electrical" },
  { name: "Talco India", sector: "Tooling" },
  { name: "Almaas Moulding Works", sector: "Tooling" },
  { name: "Press Tool Engineering Works", sector: "Tooling" },
  { name: "Suvidh Engineering Industries", sector: "Tooling" },
  { name: "Samartha Dies", sector: "Tooling" },
  { name: "Vactech Surgical Equipment", sector: "Medical equipment" },
  { name: "Shivi Chemical Technologies", sector: "Chemicals & process" },
];

const norm = (s: string) => s.toLowerCase().replace(/\s*\(.*?\)\s*/g, " ").replace(/[^a-z0-9]+/g, " ").trim();

const docs = await client.fetch<{ _id: string; _rev: string; names: string[] }[]>(
  `*[_type == "aboutPage" && !(_id in path("versions.**"))]{ _id, _rev, "names": clients.items[].name }`,
);
for (const d of docs) {
  const have = new Set((d.names ?? []).map(norm));
  const todo = ADD.filter((c) => !have.has(norm(c.name)));
  if (!todo.length) {
    console.log(`${d._id}: all ${d.names.length} clients already listed`);
    continue;
  }
  console.log(`${d._id}: ${d.names.length} listed, adding ${todo.length}: ${todo.map((c) => c.name).join(", ")}`);
  if (!write) continue;
  const items = todo.map((c) => ({ _key: randomUUID().slice(0, 12), _type: "client", ...c }));
  const r = await client.patch(d._id).ifRevisionId(d._rev).insert("after", "clients.items[-1]", items).commit();
  console.log(`  rev ${r._rev}`);
}
if (!write) console.log("Dry run. Re-run with --write.");
