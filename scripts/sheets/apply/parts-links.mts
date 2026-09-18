/**
 * A parts grid for the categories whose sheets have none but whose parts
 * moved in under the SKU sheets — Extrusion (SKU 02) and Sponge & Foam
 * (SKUs 07, 09).
 *
 *   node scripts/sheets/apply/parts-links.mts [--write]
 *
 * The seven category sheets with a grid link their parts through
 * applyStandardCategory (category.mts, PART_CARDS). Sheets 18 and 19 wrote
 * no grid — their parts did not exist under them yet — so the block here
 * takes the eyebrow the other sheets share ("IN THIS CATEGORY"), a heading
 * in their pattern ("Bushes We Make to Order") and their shared body
 * sentence. It is the one place on the site with composed copy; OPEN-ITEMS
 * 119 records it for 3rd Shade to replace if they want their own words.
 * Reciprocating Seals needs no grid: its plunger cups card links the part.
 */

import { applyDocument, client } from "../lib.mts";
import { categorySchema, linkParts } from "../category.mts";

const GRIDS: { id: string; slug: string; heading: string }[] = [
  { id: "productCategory-extrusion", slug: "extrusion", heading: "Profiles We Make to Order" },
  { id: "productCategory-sponge-foam-rubber", slug: "sponge-foam-rubber", heading: "Sponge & Foam Parts We Make to Order" },
];
const BODY =
  "Each part below is manufactured to customer drawing or to our standard tooling. Full dimensional data is issued with the quotation.";

for (const g of GRIDS) {
  const doc = (await client.fetch(`*[_id == $id][0]{sections[]{_key, _type}}`, { id: g.id })) as { sections: { _key: string; _type: string }[] };
  const items = await linkParts(g.slug, []);
  const block = {
    _type: "block.partsGrid",
    _key: "partsGrid",
    eyebrow: "IN THIS CATEGORY",
    heading: g.heading,
    body: BODY,
    // `_key` and `_type` by hand: the insert below bypasses applyDocument's
    // keyed() pass, and an item without them is the Studio's "Missing keys".
    items: items.map((it, i) => ({
      _key: it.href?.split("/").pop() || `item-${i}`,
      _type: "partName",
      name: it.name,
      availability: "Made to order",
      href: it.href,
    })),
  };
  const has = doc.sections.some((s) => s._key === "partsGrid");
  if (!has) {
    // Insert with the client's array API rather than rewriting the list.
    const at = doc.sections.findIndex((s) => s._type === "block.ctaBand");
    const before = at >= 0 ? doc.sections[at]._key : null;
    console.log(`\n══ ${g.id}: add parts grid (${items.map((i) => i.name).join(", ")})${before ? ` before ${before}` : ""}`);
    if (process.argv.includes("--write")) {
      await client
        .patch(g.id)
        .insert("before", before ? `sections[_key=="${before}"]` : "sections[-1]", [block])
        .commit();
      console.log("  ✓ written");
    }
    continue;
  }
  await applyDocument({
    id: g.id,
    type: "productCategory",
    schema: categorySchema,
    patch: { 'sections[_key=="partsGrid"].items': block.items, 'sections[_key=="partsGrid"].heading': block.heading, 'sections[_key=="partsGrid"].body': BODY },
  });
}
