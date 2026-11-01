import { parseFileBlocks, type Block, type BlockType, type CardLayout } from "../content/blocks.ts";
import type { ProductCategory } from "../content/schemas/index.ts";

/**
 * .MDX FRONTMATTER → BLOCK LIST
 *
 * The adapter that lets one renderer serve both content sources.
 *
 * A category .mdx file has fifteen optional NAMED fields and no notion of
 * order; the route decided that. A CMS document has one ordered LIST and no
 * named fields. Rather than maintain two renderers, the file is converted to
 * the list on read, using the order the route used to hard-code.
 *
 * ORDER IS THE CONTRACT. The sequence below is exactly the sequence of
 * `{fm.xSection && …}` stanzas the route contained, and eleven live pages
 * depend on it — both for what a visitor reads and for the alternating page
 * bands, which are counted over whichever blocks a page actually has. Changing
 * this array changes those pages. It is the one thing in this file that is not
 * free to be tidied.
 *
 * The .mdx files are not being rewritten to hold block arrays. They keep their
 * named fields and are converted on read, so a page can move to the CMS one at
 * a time and the ones that have not moved are untouched.
 */

/** Field on the frontmatter → block type, in render order. */
const ORDER: Array<{
  field: keyof ProductCategory;
  type: BlockType;
  layout?: CardLayout;
}> = [
  // The catalogue of sections comes before the compound table: you pick the
  // shape you need, then the compound it is made in.
  { field: "profileSection", type: "block.cardGrid", layout: "profiles" },
  { field: "compareSection", type: "block.comparePanels" },
  { field: "compoundSection", type: "block.compoundSelector" },
  { field: "specSection", type: "block.specTable" },
  { field: "densitySection", type: "block.densityScale" },
  { field: "materialSection", type: "block.materialCards" },
  // `anchors` is spliced in here — see below.
  { field: "processSection", type: "block.processTimeline" },
  { field: "subCategorySection", type: "block.subCategory" },
  { field: "applicationsSection", type: "block.applicationCards" },
  { field: "specifySection", type: "block.specifyGrid" },
  { field: "standardsSection", type: "block.standardsAnswer" },
  { field: "qualitySection", type: "block.qualityPanel" },
  { field: "sectorsSection", type: "block.cardGrid", layout: "sectors" },
  { field: "commercialSection", type: "block.propertyList" },
  // The compiled .mdx body renders here — passed to the renderer as a slot.
  { field: "cta", type: "block.ctaBand" },
];

/** Where the generated parts grid goes: directly after the material cards. */
const PARTS_AFTER: keyof ProductCategory = "materialSection";

/**
 * Copy that used to live in the route.
 *
 * Left here rather than pushed into the .mdx files because doing the latter
 * would mean editing eleven content files in a change whose whole purpose is
 * to prove that nothing renders differently. It moves into the CMS with the
 * rest of the content during migration.
 */
const PARTS_COPY = {
  eyebrow: "IN THIS CATEGORY",
  body: "Each part below is manufactured to customer drawing or to our standard tooling. Full dimensional and compound data is issued with quotation.",
};

export function toBlocks(fm: ProductCategory, slug: string): Block[] {
  // A page written as a block list renders that list, in its own order.
  if (fm.sections) return parseFileBlocks(fm.sections, `productCategory "${slug}"`, fm.faqs);

  const blocks: Block[] = [];

  const pushParts = () => {
    if (fm.anchors.length === 0) return;
    blocks.push({
      _type: "block.partsGrid",
      _key: "partsGrid",
      eyebrow: PARTS_COPY.eyebrow,
      heading: `${fm.anchors.length} parts we make to order`,
      body: PARTS_COPY.body,
      parts: fm.anchors,
      categoryLabel: fm.navLabel,
      categorySlug: slug,
    });
  };

  for (const { field, type, layout } of ORDER) {
    const value = fm[field];
    if (value) {
      blocks.push({
        ...(value as Record<string, unknown>),
        _type: type,
        // The field name IS the key: stable across renders, unique within a
        // page, and readable in a React warning if one ever appears.
        _key: field,
        ...(layout ? { layout } : {}),
      });
    }
    if (field === PARTS_AFTER) pushParts();
  }

  return blocks;
}
