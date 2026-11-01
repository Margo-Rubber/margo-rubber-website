import { parseFileBlocks, type Block, type BlockType } from "../content/blocks.ts";
import type { Industry } from "../content/schemas/index.ts";

/**
 * .MDX FRONTMATTER → BLOCK LIST, for industry pages.
 *
 * Same job as product-blocks.ts and the same contract: THE ORDER BELOW IS THE
 * ORDER THE ROUTE RENDERED, and nine live pages depend on it.
 *
 * One difference worth noting. The industry route has no alternating band
 * counter — it hard-codes `bg-[#050505]` on specific sections rather than
 * counting. That means banding here is a property of the block type, not of
 * its position, so a reordered page keeps each section's own background. It is
 * a weaker design than the product pages' alternation, but changing it would
 * change how nine pages look, and this migration is not the place.
 */

const ORDER: Array<{ field: keyof Industry; type: BlockType }> = [
  { field: "components", type: "block.componentTabs" },
  { field: "applications", type: "block.industryApplications" },
  { field: "conditions", type: "block.conditionGrid" },
  { field: "custom", type: "block.customPanel" },
  { field: "quality", type: "block.qualityCards" },
  { field: "exportLane", type: "block.exportLane" },
  // The FAQ block is spliced in here — see below.
  { field: "closing", type: "block.closingBand" },
];

/** The FAQ accordion sits between the export lane and the closing band. */
const FAQ_AFTER: keyof Industry = "exportLane";

export function toIndustryBlocks(fm: Industry): Block[] {
  // A page written as a block list renders that list, in its own order.
  if (fm.sections) return parseFileBlocks(fm.sections, `industry "${fm.slug}"`, fm.faqs);

  const blocks: Block[] = [];

  const pushFaq = () => {
    // The route rendered this only when there were questions, regardless of
    // whether `faqSection` existed — so the questions, not the headings, are
    // what decide the section is present.
    if (fm.faqs.length === 0) return;
    blocks.push({
      _type: "block.industryFaq",
      _key: "faqs",
      ...(fm.faqSection?.eyebrow ? { eyebrow: fm.faqSection.eyebrow } : {}),
      ...(fm.faqSection?.heading ? { heading: fm.faqSection.heading } : {}),
      items: fm.faqs,
    });
  };

  for (const { field, type } of ORDER) {
    const value = fm[field];
    if (value) {
      blocks.push({
        ...(value as Record<string, unknown>),
        _type: type,
        _key: field,
      });
    }
    if (field === FAQ_AFTER) pushFaq();
  }

  return blocks;
}
