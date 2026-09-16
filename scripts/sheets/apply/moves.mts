/**
 * The SKU sheets' category moves and merges → Sanity, the fallbacks and the
 * category anchors.
 *
 *   node scripts/sheets/apply/moves.mts [--write]
 *
 * Six parts move to the category they belong in and take the slug their
 * sheet canonicalises to ("New URL … 301 from …"). A part's document id and
 * slug both carry `category--part`, so a move is a new document with the
 * old one's content and the old one removed — after a dataset backup. Two
 * duplicate pages fold into their survivor: the sheets found them identical
 * in every element, and Phase 6 gave both the survivor's copy, so the
 * duplicate is removed and its URL redirects. Every old path is a 301 in
 * src/content/redirects.ts, and the site's own links point at the new one.
 */

import { existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { REDIRECTS } from "../../../src/content/redirects.ts";
import { backupDataset, client } from "../lib.mts";

const WRITE = process.argv.includes("--write");

/** A flow-style YAML scalar: quoted only where the label needs it. */
const yaml = (v: string) => (/[:#,{}[\]"'&*?|>!%@`]/.test(v) ? JSON.stringify(v) : v);
const skuSlug = (path: string) => path.replace(/^\/products\//, "").replace("/", "--");
const partOf = (slug: string) => slug.slice(slug.indexOf("--") + 2);
const categoryOf = (slug: string) => slug.slice(0, slug.indexOf("--"));

type Doc = Record<string, unknown> & { _id: string; slug?: { current: string }; category?: string; h1?: string; navLabel?: string };

if (WRITE) await backupDataset("moves");

for (const r of REDIRECTS) {
  const from = skuSlug(r.from);
  const to = skuSlug(r.to);
  const old = (await client.fetch(`*[_type == "sku" && slug.current == $slug][0]`, { slug: from })) as Doc | null;
  const survivor = (await client.fetch(`*[_type == "sku" && slug.current == $slug][0]`, { slug: to })) as Doc | null;
  const merge = !!survivor;

  console.log(`\n══ ${r.from}\n   → ${r.to}  ${merge ? "(fold into the existing page)" : "(move)"}`);
  if (!old) {
    console.log("   already done — no document at the old slug");
    continue;
  }
  if (merge && old.h1 !== survivor.h1) throw new Error(`${from}: not a duplicate of ${to} — h1 differs:\n   ${old.h1}\n   ${survivor.h1}`);

  const oldCategory = categoryOf(from);
  const newCategory = categoryOf(to);
  const anchorsOld = (await client.fetch(`*[_id == $id][0].anchors`, { id: `productCategory-${oldCategory}` })) as { id: string; label: string }[] | null;
  const anchorsNew = merge ? null : ((await client.fetch(`*[_id == $id][0].anchors`, { id: `productCategory-${newCategory}` })) as { id: string; label: string }[] | null);
  const label = old.navLabel ?? old.h1 ?? partOf(to);
  console.log(`   category ${oldCategory} → ${newCategory} · anchor "${partOf(from)}" off ${oldCategory}${merge ? "" : ` · anchor "${partOf(to)}" (${label}) on ${newCategory}`}`);

  const mdxOld = `src/content/skus/${from}.mdx`;
  const mdxNew = `src/content/skus/${to}.mdx`;

  if (!WRITE) continue;

  if (!merge) {
    const { _rev, _createdAt, _updatedAt, ...content } = old;
    void _rev; void _createdAt; void _updatedAt;
    await client.createIfNotExists({
      ...content,
      _type: "sku",
      _id: `sku-${to}`,
      slug: { _type: "slug", current: to },
      category: newCategory,
      legacyUrl: r.from,
    });
    if (anchorsNew && !anchorsNew.some((a) => a.id === partOf(to)))
      await client
        .patch(`productCategory-${newCategory}`)
        .set({ anchors: [...anchorsNew, { _key: partOf(to), _type: "anchor", id: partOf(to), label, legacyUrl: r.from }] })
        .commit();
  }
  if (anchorsOld)
    await client
      .patch(`productCategory-${oldCategory}`)
      .set({ anchors: anchorsOld.filter((a) => a.id !== partOf(from)) })
      .commit();
  await client.delete(old._id);

  // The .mdx fallback follows the document.
  if (existsSync(mdxOld)) {
    if (merge) unlinkSync(mdxOld);
    else {
      renameSync(mdxOld, mdxNew);
      const text = readFileSync(mdxNew, "utf8")
        .replace(/^category: .*$/m, `category: ${newCategory}`)
        .replace(/^slug: .*$/m, `slug: ${to}`);
      writeFileSync(mdxNew, text.includes("legacyUrl:") ? text : text.replace(/^category: .*$/m, (m) => `${m}\nlegacyUrl: ${r.from}`));
    }
  }
  console.log("   ✓ done");
}

/* ── Anchor labels: the part's own name, on every category ──────────────
   The anchors were seeded from the old site's part names ("Bumper Stopper
   for Tata"); the parts have since been renamed by their sheets. The label
   a sibling link shows is the part's navLabel, in Sanity and in the
   fallback file alike. */
const cats = (await client.fetch(`*[_type == "productCategory" && defined(anchors)]{_id, "slug": slug.current, anchors}`)) as {
  _id: string;
  slug: string;
  anchors: { _key?: string; _type?: string; id: string; label: string; legacyUrl?: string }[];
}[];
const skus = (await client.fetch(`*[_type == "sku"]{"slug": slug.current, navLabel, category}`)) as { slug: string; navLabel: string; category: string }[];
for (const cat of cats) {
  const next = cat.anchors.map((a) => {
    const sku = skus.find((k) => k.category === cat.slug && partOf(k.slug) === a.id);
    if (!sku) throw new Error(`${cat.slug}: anchor "${a.id}" has no part`);
    return { ...a, label: sku.navLabel };
  });
  const changed = next.filter((a, i) => a.label !== cat.anchors[i].label).map((a) => `${a.id} → ${a.label}`);
  if (changed.length) console.log(`\n══ ${cat.slug} anchor labels\n   ${changed.join("\n   ")}`);
  if (WRITE && changed.length) await client.patch(cat._id).set({ anchors: next }).commit();
  // The fallback file's list follows.
  const mdx = `src/content/products/${cat.slug}.mdx`;
  if (!existsSync(mdx)) continue;
  const text = readFileSync(mdx, "utf8");
  const block = next.length
    ? "anchors:\n" + next.map((a) => `  - { id: ${a.id}, label: ${yaml(a.label)}${a.legacyUrl ? `, legacyUrl: ${a.legacyUrl}` : ""} }`).join("\n") + "\n"
    : "anchors:\n  []\n";
  const updated = text.replace(/^anchors:\n(?:  (?:- \{.*\}|\[\])\n)*/m, block);
  if (updated !== text) {
    console.log(`   fallback ${mdx} follows`);
    if (WRITE) writeFileSync(mdx, updated);
  }
}
