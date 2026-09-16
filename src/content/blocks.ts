import { z } from "zod";
import {
  anchorSchema,
  faqSchema,
  applicationsSectionSchema,
  commercialSectionSchema,
  compareSectionSchema,
  compoundSectionSchema,
  ctaSchema,
  industryApplicationsSchema,
  industryClosingSchema,
  industryComponentsSchema,
  industryConditionsSchema,
  industryCustomSchema,
  industryExportLaneSchema,
  industryQualitySchema,
  densitySectionSchema,
  materialSectionSchema,
  processSectionSchema,
  profileSectionSchema,
  qualitySectionSchema,
  specSectionSchema,
  specifySectionSchema,
  standardsSectionSchema,
  subCategorySectionSchema,
} from "./schemas/index.ts";

/**
 * BLOCKS
 *
 * The same fifteen section shapes the .mdx files already use, re-presented as
 * an ORDERED LIST rather than fifteen named fields.
 *
 * That difference is the whole page builder. A named field can be filled in or
 * left out; its position on the page is decided by the template. A list member
 * carries its position with it, which is what lets an editor drag the compound
 * table above the specification table without a developer.
 *
 * The schemas themselves are IMPORTED, not redefined. A block is exactly its
 * section plus two pieces of bookkeeping:
 *
 *   _type — which block it is. Sanity sets this; the .mdx adapter sets it too.
 *   _key  — a stable identity for React and for Sanity's array diffing.
 *
 * Because the shapes are shared, a page served from Sanity and the same page
 * served from its .mdx file produce the identical object. There is one
 * renderer, not two, and no way for the two paths to drift apart.
 */

/**
 * The parts grid is the one block with no counterpart in the .mdx frontmatter.
 *
 * It is generated from the `anchors:` list every category file already carries,
 * and its eyebrow and heading were hardcoded in the route. Making it a block
 * moves that copy out of the template — where nobody could edit it — and into
 * the content, where it belongs, without changing a pixel of what renders.
 */
const partsGridSchema = z.object({
  eyebrow: z.string().min(2),
  heading: z.string().min(4),
  body: z.string().optional(),
  parts: z.array(anchorSchema).min(1),
  categoryLabel: z.string().min(2),
  categorySlug: z.string().min(1),
  /** The sheets' static list — 16–24 part NAMES with no links (sheet 09 §04).
      When present it renders instead of the linked cards from `parts`. */
  items: z.array(z.object({ name: z.string().min(2), availability: z.string().optional() })).optional(),
});

/**
 * Block type → the schema for its content.
 *
 * Keyed by the Sanity type name so a document coming out of GROQ can be
 * dispatched without translation. `block.` prefixes keep these from colliding
 * with document type names in the Studio's global registry.
 */
/**
 * The industry FAQ block holds only its heading copy; the questions live on
 * the document and are joined by the projection, exactly as the parts grid
 * does. One list, used twice — on the page and in the FAQPage structured data
 * — stored once.
 */
const industryFaqSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  items: z.array(faqSchema).default([]),
});

/** Prose panels behind headings — sheets 36–39. Every panel is in the DOM. */
const accordionSchema = z.object({
  /** The section id, from the Studio "Anchor" field. */
  id: z.string().regex(/^[a-z0-9-]+$/).optional(),
  eyebrow: z.string().optional(),
  heading: z.string().min(3),
  intro: z.string().optional(),
  panels: z.array(z.object({ title: z.string().min(3), body: z.string().min(20) })).min(1),
});

/** "If your condition is X, you need Y" — sheet 39 §02. Emitted as an ItemList. */
const routerListSchema = z.object({
  /** The section id, from the Studio "Anchor" field. */
  id: z.string().regex(/^[a-z0-9-]+$/).optional(),
  eyebrow: z.string().optional(),
  heading: z.string().min(3),
  intro: z.string().optional(),
  rows: z
    .array(z.object({ condition: z.string().min(3), need: z.string().min(3), href: z.string().optional() }))
    .min(1),
});

/** Free text from the Studio editor. Portable text is validated by Sanity; here it is carried through. */
const richTextSchema = z.object({
  /** The section id, from the Studio "Anchor" field. */
  id: z.string().regex(/^[a-z0-9-]+$/).optional(),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  body: z.string().optional(),
  content: z.array(z.record(z.string(), z.unknown())).min(1),
});

export const BLOCK_SCHEMAS = {
  "block.accordion": accordionSchema,
  "block.routerList": routerListSchema,
  "block.richText": richTextSchema,
  "block.partsGrid": partsGridSchema,
  "block.specTable": specSectionSchema,
  "block.materialCards": materialSectionSchema,
  "block.standardsAnswer": standardsSectionSchema,
  "block.qualityPanel": qualitySectionSchema,
  "block.propertyList": commercialSectionSchema,
  // Both `profileSection` and `sectorsSection` in the .mdx schema, which are
  // the same shape declared twice. One block validates both; `layout` is what
  // tells them apart, and it is bookkeeping rather than content.
  "block.cardGrid": profileSectionSchema,
  "block.processTimeline": processSectionSchema,
  "block.specifyGrid": specifySectionSchema,
  "block.comparePanels": compareSectionSchema,
  "block.compoundSelector": compoundSectionSchema,
  "block.densityScale": densitySectionSchema,
  "block.subCategory": subCategorySectionSchema,
  "block.applicationCards": applicationsSectionSchema,
  "block.ctaBand": ctaSchema,

  /* Industry pages. None of these reuse a product block: several look alike in
   * the schema but render through different components with different props —
   * there are two distinct ApplicationCards in this codebase. Merging on
   * shape-similarity alone would have rewritten nine live pages. */
  "block.componentTabs": industryComponentsSchema,
  "block.industryApplications": industryApplicationsSchema,
  "block.conditionGrid": industryConditionsSchema,
  "block.customPanel": industryCustomSchema,
  "block.qualityCards": industryQualitySchema,
  "block.exportLane": industryExportLaneSchema,
  "block.industryFaq": industryFaqSchema,
  "block.closingBand": industryClosingSchema,
} as const;

export type BlockType = keyof typeof BLOCK_SCHEMAS;

export const BLOCK_TYPES = Object.keys(BLOCK_SCHEMAS) as BlockType[];

export function isBlockType(value: unknown): value is BlockType {
  return typeof value === "string" && value in BLOCK_SCHEMAS;
}

/**
 * `profileSection` and `sectorsSection` are the same shape and became one
 * block with a layout switch. Round-tripping therefore needs to know which
 * layout an .mdx field maps to, because the field name is the only thing that
 * distinguishes them.
 */
export type CardLayout = "profiles" | "sectors" | "plain";

/** A block as it reaches the renderer: bookkeeping plus its section's fields. */
export type Block = {
  _type: BlockType;
  _key: string;
  /** Only on `block.cardGrid`. Selects the card rendering. */
  layout?: CardLayout;
} & Record<string, unknown>;

const bookkeeping = z.object({
  _type: z.string(),
  _key: z.string().min(1),
  layout: z.enum(["profiles", "sectors", "plain"]).optional(),
});

/**
 * GROQ returns `null` for a field with no value; Zod's `.optional()` means
 * `undefined`. Left alone, every unfilled optional field fails validation.
 *
 * Lives here rather than in each source file because there are now three of
 * those and a third copy of the same eight lines is how they start to differ.
 */
export function stripNullsDeep<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripNullsDeep) as unknown as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => [k, stripNullsDeep(v)]),
    ) as T;
  }
  return value;
}

/**
 * Validates one block against the schema for its own `_type`.
 *
 * A discriminated union would be the obvious tool and is the wrong one here:
 * several section schemas carry a `.refine()` (the spec table's row-arity
 * rule), which makes them ZodEffects rather than ZodObject, and
 * `discriminatedUnion` rejects those. Dispatching on `_type` by hand also
 * produces a far better message — "block 3 (block.specTable): rows…" instead
 * of fifteen parallel failures, one per union member.
 */
export function parseBlock(
  input: unknown,
  index: number,
): { ok: true; block: Block } | { ok: false; error: string } {
  const meta = bookkeeping.safeParse(input);
  if (!meta.success) {
    return { ok: false, error: `block ${index}: missing _type or _key` };
  }

  const { _type, _key, layout } = meta.data;
  if (!isBlockType(_type)) {
    return { ok: false, error: `block ${index}: unknown type "${_type}"` };
  }

  const parsed = BLOCK_SCHEMAS[_type].safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    return { ok: false, error: `block ${index} (${_type}): ${issues}` };
  }

  return {
    ok: true,
    block: { ...(parsed.data as Record<string, unknown>), _type, _key, layout },
  };
}

/**
 * Validates a whole list, dropping blocks that fail rather than failing the
 * page.
 *
 * A deliberate difference from the .mdx path, which throws. There, a bad
 * section is a developer's mistake caught before deploy. Here it is an
 * editor's half-finished block on a live page, and taking the entire page down
 * for it would be a worse outcome than rendering the other fourteen sections
 * and logging the one that is wrong.
 */
export function parseBlocks(
  input: unknown,
  context: string,
): { blocks: Block[]; errors: string[] } {
  if (!Array.isArray(input)) return { blocks: [], errors: [] };

  const blocks: Block[] = [];
  const errors: string[] = [];

  input.forEach((raw, i) => {
    const result = parseBlock(raw, i);
    if (result.ok) blocks.push(result.block);
    else errors.push(result.error);
  });

  if (errors.length > 0) {
    console.error(`[blocks] ${context} dropped ${errors.length} block(s):`, errors);
  }

  return { blocks, errors };
}
