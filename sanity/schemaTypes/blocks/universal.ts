import { defineArrayMember, defineField, defineType } from "sanity";
import {
  BLOCK_GROUPS,
  anchorIdField,
  blockPreview,
  count,
  iconField,
  imageRefField,
  labelValue,
  linkFields,
  linkObject,
  sectionMetaFields,
  shapeField,
} from "./_shared.ts";

/**
 * UNIVERSAL BLOCKS
 *
 * The shapes that recur across more than one page type. These are the ones
 * worth being reorderable: a CTA band is a CTA band whether it closes a
 * category page or the About page, and an editor who learns it once has
 * learned it everywhere.
 *
 * Each is derived from a section shape that already exists in
 * src/content/schemas/index.ts — the field names match, so migration is a
 * rename of the wrapper and not a re-modelling of the content.
 */

/* ── 1. Section header ────────────────────────────────────────────────────── */

/**
 * A heading and a paragraph, nothing else. Small enough to look redundant and
 * used constantly: it is how an editor introduces a run of blocks that each
 * carry no heading of their own.
 */
export const sectionHeader = defineType({
  name: "block.sectionHeader",
  title: "Section heading",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [...sectionMetaFields(), anchorIdField()],
  preview: blockPreview("Section heading"),
});

/* ── 2. Rich text ─────────────────────────────────────────────────────────── */

/**
 * Long-form prose, for the resource guides.
 *
 * The style list is deliberately short. H1 is absent because the page owns its
 * H1 and a second one is an SEO fault an editor should not be able to commit;
 * H2 is absent because a block's own heading is the H2. That leaves H3 and H4,
 * which is the real depth the guides use.
 */
export const richText = defineType({
  name: "block.richText",
  title: "Text",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "content",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Subheading", value: "h3" },
            { title: "Small heading", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bulleted", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: linkFields({ requireLabel: false }),
              },
            ],
          },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: {
    select: { heading: "heading", content: "content" },
    prepare: ({ heading, content }) => {
      const first = (content as Array<{ children?: Array<{ text?: string }> }>)?.[0];
      return {
        title: heading || first?.children?.[0]?.text || "Text",
        subtitle: `Text · ${count(content, "paragraph")}`,
      };
    },
  },
});

/* ── 3. Card grid ─────────────────────────────────────────────────────────── */

/**
 * One block, three renderings.
 *
 * The profile library and the sectors grid were separate section shapes in the
 * content schemas because they render differently — one draws cross-sections,
 * the other draws icons. Their FIELDS are identical, so they are one block
 * with a layout switch rather than two blocks an editor has to tell apart.
 * This is the consolidation the whole block library rests on; where two shapes
 * differ only in presentation, they are one block.
 */
export const cardGrid = defineType({
  name: "block.cardGrid",
  title: "Card grid",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "layout",
      title: "Card style",
      type: "string",
      description:
        "Profiles draw a cross-section; sectors and plain use an icon. Same fields either way.",
      options: {
        list: [
          { title: "Profiles — cross-section drawing", value: "profiles" },
          { title: "Sectors — icon tile", value: "sectors" },
          { title: "Plain — no graphic", value: "plain" },
        ],
        layout: "radio",
      },
      initialValue: "sectors",
      validation: (r) => r.required(),
      group: "options",
    }),
    defineField({
      name: "items",
      title: "Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (r) => r.required().min(2),
            }),
            defineField({
              name: "code",
              title: "Code",
              type: "string",
              description: 'Optional part or reference code, e.g. "EXT-004".',
            }),
            defineField({
              name: "body",
              title: "Description",
              type: "text",
              rows: 2,
              validation: (r) => r.required().min(10),
            }),
            iconField(),
            shapeField(),
            defineField({
              name: "href",
              title: "Links to",
              type: "string",
              description: "Where this card's link goes, e.g. /industries/automotive. Needs the grid's link label.",
            }),
            defineField({
              name: "id",
              title: "Anchor",
              type: "string",
              description:
                "Only needed if a menu item links straight to this card. Lowercase and hyphens.",
              validation: (r) => r.regex(/^[a-z0-9-]+$/, { name: "lowercase-with-hyphens" }),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "code" },
          },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    defineField({
      name: "cardCta",
      title: "Link label on every card",
      type: "string",
      description:
        '"Quote this section" on a profile card (goes to the contact form with the code filled in); "Rubber components for {sector}" on a sector card, where {sector} becomes the card name. Empty means no links.',
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Card grid", (v) => count(v.items, "card")),
});

/* ── 4. Stat row ──────────────────────────────────────────────────────────── */

export const statRow = defineType({
  name: "block.statRow",
  title: "Figures",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "items",
      title: "Figures",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({
              name: "value",
              title: "Figure",
              type: "string",
              description: 'The large text — "±0.08 mm", "22", "1987".',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "label",
              title: "What it is",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (r) => r.required().min(2),
      group: "content",
    }),
    defineField({
      name: "align",
      title: "Alignment",
      type: "string",
      options: {
        list: [
          { title: "Centred", value: "center" },
          { title: "Left", value: "left" },
        ],
        layout: "radio",
      },
      initialValue: "center",
      group: "options",
    }),
  ],
  preview: blockPreview("Figures", (v) => count(v.items, "figure")),
});

/* ── 5. CTA band ──────────────────────────────────────────────────────────── */

/**
 * The closing enquiry band. `body` is required because a CTA band with no
 * supporting copy is never correct — that rule is already in the Zod schema
 * and is repeated here so the editor hears it first.
 *
 * The chips are load-bearing rather than decorative: their presence is what
 * switches the render to the centred, corner-bracketed panel from the newer
 * comps. Said so in the field description, because an editor deleting the last
 * chip would otherwise change the layout without knowing they had.
 */
export const ctaBand = defineType({
  name: "block.ctaBand",
  title: "Call to action",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields({ bodyRequired: true }),
    linkObject("primary", "Main button", true),
    linkObject("secondary", "Second button"),
    defineField({
      name: "chips",
      title: "Facts above the buttons",
      type: "array",
      description:
        "MOQ, sample quantity, turnaround. Adding any of these switches the band to the centred panel layout; removing them all switches it back.",
      of: [
        defineArrayMember({
          type: "object",
          name: "chip",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            iconField(),
          ],
          preview: { select: { title: "label" } },
        }),
      ],
      group: "content",
    }),
  ],
  preview: blockPreview("Call to action", (v) =>
    Array.isArray(v.chips) && v.chips.length ? "centred panel" : "plain band",
  ),
});

/* ── 6. FAQ ───────────────────────────────────────────────────────────────── */

/**
 * Feeds both the on-page accordion and the FAQPage JSON-LD, which is why the
 * answer length is bounded rather than free. 40 characters is the floor for
 * something Google will treat as an answer; 700 is the ceiling before it stops
 * being extractable. Both numbers come from the Zod schema.
 */
export const faqList = defineType({
  name: "block.faqList",
  title: "Questions & answers",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({
              name: "q",
              title: "Question",
              type: "string",
              validation: (r) => r.required().min(8),
            }),
            defineField({
              name: "a",
              title: "Answer",
              type: "text",
              rows: 4,
              description:
                "Aim for 40–60 words. Long enough for Google to quote, short enough for it to extract.",
              validation: (r) => r.required().min(40).max(700),
            }),
          ],
          preview: { select: { title: "q", subtitle: "a" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Questions & answers", (v) => count(v.items, "question")),
});

/* ── 7. Specification table ───────────────────────────────────────────────── */

/**
 * The one block with a validation rule worth more than all the others: every
 * row must have exactly as many cells as there are columns.
 *
 * That rule currently fails the BUILD when an .mdx file gets it wrong. Here it
 * becomes a message on the field, naming the offending row and both counts —
 * which is the single clearest example of what moving to a CMS buys.
 *
 * SHAPE DIFFERENCE, deliberate: Zod has `rows: string[][]`, but Sanity cannot
 * put an array directly inside an array, so a row is an object holding
 * `cells`. The GROQ projection flattens it back — `"rows": rows[].cells` — so
 * the rendering components and the Zod schema are untouched. This is the only
 * place in the library where the CMS shape and the content shape differ, and
 * the flattening belongs in the query, never in a component.
 */
export const specTable = defineType({
  name: "block.specTable",
  title: "Specification table",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "columns",
      title: "Column headings",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.required().min(2),
      group: "content",
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "row",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }) => ({
              title: (cells as string[])?.join("  ·  ") || "Empty row",
            }),
          },
        }),
      ],
      validation: (r) =>
        r.required().min(1).custom((rows, ctx) => {
          const columns = (ctx.parent as { columns?: string[] })?.columns ?? [];
          if (columns.length === 0) return true;
          const list = (rows ?? []) as Array<{ cells?: string[] }>;
          for (let i = 0; i < list.length; i++) {
            const n = list[i]?.cells?.length ?? 0;
            if (n !== columns.length) {
              return `Row ${i + 1} has ${n} cell${n === 1 ? "" : "s"} but there are ${columns.length} columns`;
            }
          }
          return true;
        }),
      group: "content",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "footnote",
      title: "Footnote",
      type: "text",
      rows: 2,
      group: "content",
    }),
    defineField({
      name: "controls",
      title: "Show filters and search",
      type: "boolean",
      description: "Turn off for short reference tables where filtering is noise.",
      initialValue: true,
      group: "options",
    }),
    defineField({
      name: "chips",
      title: "Filter chips",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "The standards a chip can select, in order — ASME, EN, JIS. Leave empty to offer the standards found in the table.",
      options: { layout: "tags" },
      group: "options",
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Search box hint",
      type: "string",
      description: "Grey text in the search box: \"Filter by compound or application\".",
      group: "options",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Specification table", (v) => count(v.rows, "row")),
});

/* ── 8. Image and text ────────────────────────────────────────────────────── */

export const imageText = defineType({
  name: "block.imageText",
  title: "Image with text",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields({ bodyRequired: true }),
    imageRefField("image", { required: true }),
    defineField({
      name: "side",
      title: "Image on the",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "right",
      group: "options",
    }),
    defineField({
      name: "points",
      title: "Bullet points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "content",
    }),
    linkObject("action", "Button"),
    anchorIdField(),
  ],
  preview: blockPreview("Image with text"),
});

/* ── 9. Pull quote ────────────────────────────────────────────────────────── */

export const pullQuote = defineType({
  name: "block.pullQuote",
  title: "Quote",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (r) => r.required().min(20),
    }),
    defineField({
      name: "author",
      title: "Who said it",
      type: "string",
      validation: (r) => r.required().min(2),
    }),
    defineField({ name: "org", title: "Their company", type: "string" }),
    defineField({
      name: "initials",
      title: "Initials",
      type: "string",
      description: "Shown in the avatar circle. One to three letters.",
      validation: (r) => r.min(1).max(3),
    }),
  ],
  preview: {
    select: { title: "text", subtitle: "author" },
  },
});

/* ── 10. Logo strip ───────────────────────────────────────────────────────── */

export const logoStrip = defineType({
  name: "block.logoStrip",
  title: "Logo strip",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "items",
      title: "Logos",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "logo",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (r) => r.required(),
            }),
            imageRefField("image", { title: "Logo", group: null }),
          ],
          preview: { select: { title: "name" } },
        }),
      ],
      validation: (r) => r.required().min(2),
      group: "content",
    }),
  ],
  preview: blockPreview("Logo strip", (v) => count(v.items, "logo")),
});

/* ── 11. Property list ────────────────────────────────────────────────────── */

/**
 * Commercial terms, and every other run of label/value rows. Generic on
 * purpose — MOQ and lead time have the same shape as anything else stated as a
 * term, and inventing a `commercialTerms` block would give the editor two
 * indistinguishable menu entries.
 */
export const propertyList = defineType({
  name: "block.propertyList",
  title: "Terms & properties",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [labelValue],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Terms & properties", (v) => count(v.rows, "row")),
});

/* ── Accordion ─────────────────────────────────────────────────────────────
   Prose panels behind a heading each — content sheets 36 §05, 37 §03, 38 §07,
   39 §06. Every panel is in the page at first paint; the reader collapses,
   the crawler reads all of it. */
export const accordion = defineType({
  name: "block.accordion",
  title: "Accordion",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({ name: "intro", title: "Opening paragraph", type: "text", rows: 3, group: "content" }),
    defineField({
      name: "panels",
      title: "Panels",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "panel",
          fields: [
            defineField({ name: "title", title: "Panel title", type: "string", validation: (r) => r.required().min(3) }),
            defineField({ name: "body", title: "Text", type: "text", rows: 6, validation: (r) => r.required().min(20) }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Accordion", (v) => count(v.panels, "panel")),
});

/* ── Router list ───────────────────────────────────────────────────────────
   "If your condition is X, you need Y" — sheet 39 §02. Each row can link to
   the page that supplies Y. Emitted as an ItemList in structured data. */
export const routerList = defineType({
  name: "block.routerList",
  title: "Which do you need?",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({ name: "intro", title: "Opening paragraph", type: "text", rows: 3, group: "content" }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "routerRow",
          fields: [
            defineField({ name: "condition", title: "If…", type: "string", validation: (r) => r.required().min(3) }),
            defineField({ name: "need", title: "…you need", type: "text", rows: 2, validation: (r) => r.required().min(3) }),
            defineField({ name: "href", title: "Link address", type: "string", description: "The page that supplies it, if any." }),
          ],
          preview: { select: { title: "condition", subtitle: "need" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Which do you need?", (v) => count(v.rows, "row")),
});

export const UNIVERSAL_BLOCKS = [
  sectionHeader,
  richText,
  cardGrid,
  statRow,
  ctaBand,
  faqList,
  specTable,
  imageText,
  pullQuote,
  logoStrip,
  propertyList,
  accordion,
  routerList,
];
