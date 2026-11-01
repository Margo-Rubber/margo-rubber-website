import fs from "node:fs";
import { createClient } from "@sanity/client";
import { getAllSlugs, getFrontmatter, getPage } from "../src/lib/content.ts";
import { COLLECTIONS_FOR_PAGES } from "../src/lib/page-types.ts";
import {
  toSanityDocument,
  toIndustryDocument,
  toSkuDocument,
  toResourceDocument,
  toPageDocument,
  toLegalDocument,
} from "../src/lib/product-migrate.ts";

/**
 * MIGRATE PRODUCT CATEGORIES INTO SANITY
 *
 *   node scripts/migrate-products.mts extrusion          → dry run, prints it
 *   node scripts/migrate-products.mts extrusion --write  → writes it
 *   node scripts/migrate-products.mts --all --write      → writes all eleven
 *
 * DRY BY DEFAULT. This writes to the live content lake, and a page that gains
 * a Sanity document immediately starts being served from it rather than from
 * its .mdx file. That is the intended outcome, but it should never be the
 * accidental one, so the flag is required and named for what it does.
 *
 * IDS ARE DETERMINISTIC, so running this twice updates the same document
 * rather than creating a second one. That makes the migration re-runnable:
 * fix a mapping, run it again, and the dataset converges instead of
 * accumulating duplicates.
 *
 * Reversible: deleting the document in Studio returns the page to its .mdx
 * file, because the source seam falls through on a miss. Nothing here is
 * one-way.
 */

/* ── Token ────────────────────────────────────────────────────────────────── */

/**
 * Read straight from .env.local rather than through a dotenv package.
 *
 * Next.js loads that file for the app; a standalone script does not get it for
 * free. Parsing the one line needed keeps the token out of `process.env` for
 * every other script, and out of any dependency's reach.
 */
function readToken(): string | null {
  let text: string;
  try {
    text = fs.readFileSync(".env.local", "utf8");
  } catch {
    return null;
  }
  const line = text.split("\n").find((l) => l.startsWith("SANITY_WRITE_TOKEN="));
  if (!line) return null;
  // Strip surrounding quotes if the value was pasted with them.
  return line.slice("SANITY_WRITE_TOKEN=".length).trim().replace(/^["']|["']$/g, "");
}

/* ── Arguments ────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const write = args.includes("--write");
const all = args.includes("--all");

// Which collection. Defaults to products because that is what this script was
// written for; industries opt in explicitly rather than by guessing from slugs.
const industries = args.includes("--industries");
const skus = args.includes("--skus");
const resources = args.includes("--resources");
// The one-off marketing pages. Each is its own schema, so the slug decides
// which schema and which Sanity type — see page-types.ts.
const pages = args.includes("--pages");
const legal = args.includes("--legal");
const collection = industries
  ? "industries"
  : skus
    ? "skus"
    : resources
      ? "resources"
      : legal
        ? "legal"
        : "products";

const slugs = all
  ? pages
    ? Object.keys(COLLECTIONS_FOR_PAGES)
    : getAllSlugs(collection)
  : args.filter((a) => !a.startsWith("--"));

if (slugs.length === 0) {
  console.error(
    "Usage: node scripts/migrate-products.mts <slug…> [--write]\n" +
      "       node scripts/migrate-products.mts --all [--industries|--skus|--resources|--pages|--legal] [--write]",
  );
  process.exit(1);
}

/* ── Build ────────────────────────────────────────────────────────────────── */

const documents = await Promise.all(slugs.map(async (slug) => {
  if (pages) {
    const entry = COLLECTIONS_FOR_PAGES[slug];
    if (!entry) throw new Error(`No page type registered for "${slug}"`);
    const fm = await getPage(slug, entry.schema);
    return { slug, doc: toPageDocument(fm as Record<string, unknown>, slug, entry.type) };
  }

  const fm = getFrontmatter(collection, slug);
  return {
    slug,
    doc: industries
      ? toIndustryDocument(fm as never, slug)
      : legal
        ? toLegalDocument(fm as never, slug)
        : skus
        ? toSkuDocument(fm as never, slug)
        : resources
          ? toResourceDocument(fm as never, slug)
          : toSanityDocument(fm as never, slug),
  };
}));

for (const { slug, doc } of documents) {
  const sections = (doc.sections as unknown[]) ?? [];
  const types = sections.map((s) => (s as { _type: string })._type.replace("block.", ""));
  console.log(`\n${slug}  →  ${doc._id}`);
  console.log(`  status   ${doc.status}`);
  // Fixed-structure types have no sections; saying "0 sections" would read as
  // a fault rather than as the design.
  console.log(
    sections.length > 0
      ? `  sections ${sections.length}: ${types.join(", ")}`
      : `  fixed structure — no block list`,
  );
  console.log(`  bytes    ${JSON.stringify(doc).length.toLocaleString("en-GB")}`);
}

if (!write) {
  console.log(
    `\nDry run. ${documents.length} document(s) built and not written.` +
      `\nRe-run with --write to publish them to the "production" dataset.`,
  );
  process.exit(0);
}

/* ── Write ────────────────────────────────────────────────────────────────── */

const token = readToken();
if (!token) {
  console.error(
    "\nNo SANITY_WRITE_TOKEN in .env.local. Create a token with Editor " +
      "permission at sanity.io/manage → API → Tokens, then add it there.",
  );
  process.exit(1);
}

const client = createClient({
  projectId: "jyg2beas",
  dataset: "production",
  apiVersion: "2026-08-01",
  useCdn: false,
  token,
});

/* ── Photos ───────────────────────────────────────────────────────────────── */

/**
 * A page held in an .mdx file names its card photos by URL — a Sanity CDN
 * URL, or a file in public/images/ (the Oct 2026 release). Sanity stores an
 * image as a reference to an asset, so each is turned into one here: a CDN
 * URL already names its asset; a local file is uploaded first (Sanity
 * de-duplicates by content, so a re-run does not create copies).
 */
const uploaded = new Map<string, string>();

async function assetRef(url: string): Promise<string> {
  const cdn = url.match(/^https:\/\/cdn\.sanity\.io\/images\/[^/]+\/[^/]+\/([0-9a-f]+-\d+x\d+)\.(\w+)$/);
  if (cdn) return `image-${cdn[1]}-${cdn[2]}`;
  if (!url.startsWith("/images/")) throw new Error(`Cannot resolve image "${url}"`);
  if (!uploaded.has(url)) {
    const asset = await client.assets.upload("image", fs.createReadStream(`public${url}`), {
      filename: url.split("/").pop(),
    });
    uploaded.set(url, asset._id);
  }
  return uploaded.get(url)!;
}

async function resolvePhotos(node: unknown): Promise<unknown> {
  if (Array.isArray(node)) return Promise.all(node.map(resolvePhotos));
  if (!node || typeof node !== "object") return node;
  const o = node as Record<string, unknown>;
  const asset = o.asset as { url?: unknown; _ref?: unknown } | undefined;
  if (asset && typeof asset.url === "string" && !asset._ref) {
    const rest = { ...o };
    delete rest.asset;
    return {
      _type: "image",
      ...rest,
      asset: { _type: "reference", _ref: await assetRef(asset.url) },
    };
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) out[k] = await resolvePhotos(v);
  return out;
}

for (const d of documents) {
  d.doc = (await resolvePhotos(d.doc)) as typeof d.doc;
}
if (uploaded.size) console.log(`\nUploaded ${uploaded.size} photo(s) from public/images/.`);

console.log(`\nWriting ${documents.length} document(s)…`);

let ok = 0;
for (const { slug, doc } of documents) {
  try {
    // createOrReplace, not create: the id is deterministic, so a second run
    // should update the document rather than fail on a collision.
    await client.createOrReplace(doc as never);
    console.log(`  ✓ ${slug}`);
    ok++;
  } catch (err) {
    console.error(`  ✖ ${slug}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

console.log(
  `\n${ok} of ${documents.length} written.` +
    (ok > 0
      ? `\nThose pages now serve from Sanity. Delete a document in Studio to ` +
        `return it to its .mdx file.`
      : ""),
);

process.exit(ok === documents.length ? 0 : 1);
