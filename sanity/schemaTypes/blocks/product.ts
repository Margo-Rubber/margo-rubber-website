import { defineArrayMember, defineField, defineType } from "sanity";
import {
  BLOCK_GROUPS,
  anchorIdField,
  blockPreview,
  count,
  iconField,
  imageRefField,
  sectionMetaFields,
  stringListField,
} from "./_shared.ts";

/**
 * PRODUCT & TECHNICAL BLOCKS
 *
 * The shapes that carry the engineering content: compounds, processes,
 * tolerances, cell structures. Every one of these is derived from a section in
 * `productCategorySchema`, which is the densest page type on the site — eleven
 * pages share it, so a block here is worth eleven times what a one-page block
 * is worth. That is why this file exists before the one-page specialists.
 *
 * Field names match the Zod schema exactly. Where they could not, it is noted
 * on the field and it is always the same reason: Sanity cannot nest an array
 * directly inside an array, so a row of cells becomes an object holding them.
 */

/* ── Material cards ───────────────────────────────────────────────────────── */

export const materialCards = defineType({
  name: "block.materialCards",
  title: "Material cards",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "items",
      title: "Materials",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "material",
          fields: [
            defineField({
              name: "code",
              title: "Code",
              type: "string",
              description: 'The short designation — "NBR", "EPDM", "FKM".',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "name",
              title: "Full name",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "tempRange",
              title: "Temperature range",
              type: "string",
              description: 'As it should read, e.g. "−30 °C to +120 °C".',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "hardness",
              title: "Hardness",
              type: "string",
              description: 'e.g. "40–90 Shore A".',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "summary",
              title: "When to choose it",
              type: "text",
              rows: 3,
              validation: (r) => r.required().min(20),
            }),
            imageRefField("image", { group: null }),
          ],
          preview: { select: { title: "code", subtitle: "name" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    defineField({
      name: "footnote",
      title: "Trade-mark line",
      type: "text",
      rows: 2,
      description: "Attribution under the cards, e.g. “Viton® is a trade mark of The Chemours Company.”",
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Material cards", (v) => count(v.items, "material")),
});

/* ── Standards answer ─────────────────────────────────────────────────────── */

/**
 * An answer-first block: one direct paragraph, then the standards that support
 * it. The `answer` field is the AEO surface — the passage a search engine
 * lifts — which is why it is required and separate from the section's ordinary
 * intro rather than being the same field wearing two hats.
 */
export const standardsAnswer = defineType({
  name: "block.standardsAnswer",
  title: "Standards",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "answer",
      title: "The direct answer",
      type: "text",
      rows: 4,
      description:
        "40–60 words answering the section's heading as a question. This is the passage search engines quote, so it must stand alone without the rest of the page.",
      validation: (r) => r.required().min(40),
      group: "content",
    }),
    defineField({
      name: "items",
      title: "Standards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "standard",
          fields: [
            defineField({
              name: "code",
              title: "Code",
              type: "string",
              description: 'e.g. "ISO 3601".',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "body",
              title: "What it covers",
              type: "text",
              rows: 2,
              validation: (r) => r.required().min(20),
            }),
          ],
          preview: { select: { title: "code", subtitle: "name" } },
        }),
      ],
      group: "content",
    }),
    defineField({ name: "closing", title: "Closing line", type: "text", rows: 2, group: "content" }),
    defineField({
      name: "closingLink",
      title: "Link after the closing line",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Link text", type: "string" }),
        defineField({ name: "href", title: "Link address", type: "string" }),
      ],
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Standards", (v) => count(v.items, "standard")),
});

/* ── Quality panel ────────────────────────────────────────────────────────── */

export const qualityPanel = defineType({
  name: "block.qualityPanel",
  title: "Quality assurance",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields({ bodyRequired: true }),
    defineField({
      name: "quote",
      title: "Customer quote",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Quote", type: "text", rows: 3, validation: (r) => r.required().min(20) }),
        defineField({ name: "author", title: "Who said it", type: "string", validation: (r) => r.required().min(2) }),
        defineField({ name: "org", title: "Their company", type: "string", validation: (r) => r.required().min(2) }),
        defineField({
          name: "initials",
          title: "Initials",
          type: "string",
          description: "Shown in the avatar circle.",
          validation: (r) => r.required().min(1).max(3),
        }),
      ],
      options: { collapsible: true, collapsed: false },
      group: "content",
    }),
    defineField({
      name: "standards",
      title: "Test standards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "testStandard",
          fields: [
            defineField({ name: "name", title: "Test", type: "string", validation: (r) => r.required().min(3) }),
            defineField({ name: "code", title: "Standard", type: "string", validation: (r) => r.required().min(2) }),
            defineField({
              name: "group",
              title: "Group",
              type: "string",
              description: 'Heading shown above the first test in the group: "Per batch, before despatch".',
            }),
          ],
          preview: { select: { title: "name", subtitle: "code" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "badge",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            iconField(),
          ],
          preview: { select: { title: "label" } },
        }),
      ],
      group: "content",
    }),
    defineField({
      name: "docPackage",
      title: "Documentation package",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required().min(4) }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required().min(20) }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Quality assurance", (v) => count(v.standards, "standard")),
});

/* ── Process timeline ─────────────────────────────────────────────────────── */

/**
 * A real sequence — the steps are numbered in the render, so their order in
 * this list IS the order shown. Said in the description because reordering a
 * card grid is cosmetic and reordering this is not.
 */
export const processTimeline = defineType({
  name: "block.processTimeline",
  title: "Process steps",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      description:
        "Numbered on the page in this order. Dragging a step changes the sequence the customer reads.",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "name", title: "Step", type: "string", validation: (r) => r.required().min(3) }),
            defineField({ name: "body", title: "What happens", type: "text", rows: 3, validation: (r) => r.required().min(20) }),
            iconField(),
          ],
          preview: { select: { title: "name", subtitle: "body" } },
        }),
      ],
      validation: (r) => r.required().min(2),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Process steps", (v) => count(v.steps, "step")),
});

/* ── Specify grid ─────────────────────────────────────────────────────────── */

export const specifyGrid = defineType({
  name: "block.specifyGrid",
  title: "How to specify",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "items",
      title: "Parameters",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "parameter",
          fields: [
            defineField({ name: "label", title: "Parameter", type: "string", validation: (r) => r.required().min(3) }),
            defineField({
              name: "value",
              title: "Example or range",
              type: "string",
              description: "Set beside the label — the format you want quoted back.",
              validation: (r) => r.required(),
            }),
            defineField({ name: "body", title: "Explanation", type: "text", rows: 2, validation: (r) => r.required().min(20) }),
            iconField(),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
      validation: (r) => r.required().min(2),
      group: "content",
    }),
    defineField({
      name: "closing",
      title: "Closing line",
      type: "string",
      description: '"Have all four? Send them with your section drawing."',
      group: "content",
    }),
    defineField({
      name: "closingLink",
      title: "Closing button",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Button text", type: "string" }),
        defineField({ name: "href", title: "Goes to", type: "string" }),
      ],
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("How to specify", (v) => count(v.items, "parameter")),
});

/* ── Compare panels ───────────────────────────────────────────────────────── */

/**
 * Exactly two panels, enforced. Not a minimum and not a maximum — the layout
 * is a head-to-head and a third panel has nowhere to go, so `length(2)` in the
 * Zod schema becomes `min(2).max(2)` here with a message that says why.
 */
export const comparePanels = defineType({
  name: "block.comparePanels",
  title: "Side-by-side comparison",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "panels",
      title: "The two options",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "panel",
          fields: [
            defineField({ name: "label", title: "Name", type: "string", validation: (r) => r.required().min(2) }),
            defineField({ name: "caption", title: "One-line summary", type: "string", validation: (r) => r.required().min(3) }),
            defineField({
              name: "diagram",
              title: "Cell diagram",
              type: "string",
              options: {
                list: [
                  { title: "Closed cell", value: "closed" },
                  { title: "Open cell", value: "open" },
                ],
                layout: "radio",
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "rows",
              title: "Properties",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "property",
                  fields: [
                    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                    defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                  ],
                  preview: { select: { title: "label", subtitle: "value" } },
                }),
              ],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: { select: { title: "label", subtitle: "caption" } },
        }),
      ],
      validation: (r) =>
        r.required().length(2).error("This layout compares exactly two options — add or remove one."),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Side-by-side comparison"),
});

/* ── Compound selector ────────────────────────────────────────────────────── */

/**
 * A tab per elastomer family, a detail panel for the selected one, and the
 * full table beneath. The table repeats the panel content deliberately: the
 * panel is for choosing and the table is for comparing, so one list of items
 * feeds both and there is nothing for an editor to keep in sync.
 */
export const compoundSelector = defineType({
  name: "block.compoundSelector",
  title: "Compound selector",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "items",
      title: "Compounds",
      type: "array",
      description: "Each becomes a tab, a detail panel and a row in the table beneath.",
      of: [
        defineArrayMember({
          type: "object",
          name: "compound",
          fields: [
            defineField({ name: "code", title: "Code", type: "string", validation: (r) => r.required().min(1) }),
            defineField({ name: "fullName", title: "Full name", type: "string", validation: (r) => r.required().min(4) }),
            defineField({ name: "hardness", title: "Hardness", type: "string", validation: (r) => r.required().min(2) }),
            defineField({ name: "tempRange", title: "Temperature range", type: "string", validation: (r) => r.required().min(2) }),
            defineField({
              name: "applications",
              title: "Typical applications",
              type: "text",
              rows: 2,
              validation: (r) => r.required().min(10),
            }),
          ],
          preview: { select: { title: "code", subtitle: "fullName" } },
        }),
      ],
      validation: (r) => r.required().min(2),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Compound selector", (v) => count(v.items, "compound")),
});

/* ── Density scale ────────────────────────────────────────────────────────── */

export const densityScale = defineType({
  name: "block.densityScale",
  title: "Density scale",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "scale",
      title: "The scale",
      type: "object",
      fields: [
        defineField({ name: "min", title: "Lowest value", type: "string", validation: (r) => r.required() }),
        defineField({ name: "max", title: "Highest value", type: "string", validation: (r) => r.required() }),
        defineField({ name: "unit", title: "Unit", type: "string", validation: (r) => r.required() }),
        defineField({ name: "lowLabel", title: "Label at the low end", type: "string", validation: (r) => r.required() }),
        defineField({ name: "lowNote", title: "Note at the low end", type: "string", validation: (r) => r.required() }),
        defineField({ name: "highLabel", title: "Label at the high end", type: "string", validation: (r) => r.required() }),
        defineField({ name: "highNote", title: "Note at the high end", type: "string", validation: (r) => r.required() }),
      ],
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({
      name: "bands",
      title: "Bands",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "band",
          fields: [
            defineField({ name: "range", title: "Range", type: "string", validation: (r) => r.required() }),
            defineField({ name: "note", title: "What it is used for", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "range", subtitle: "note" } },
        }),
      ],
      validation: (r) => r.required().min(2),
      group: "content",
    }),
    defineField({
      name: "quote",
      title: "Quote beside the scale",
      type: "object",
      fields: [
        defineField({ name: "text", type: "text", rows: 3, validation: (r) => r.required().min(20) }),
        defineField({ name: "author", type: "string", validation: (r) => r.required().min(2) }),
        defineField({ name: "org", title: "Their company", type: "string" }),
      ],
      validation: (r) => r.required(),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Density scale", (v) => count(v.bands, "band")),
});

/* ── Application cards ────────────────────────────────────────────────────── */

export const applicationCards = defineType({
  name: "block.applicationCards",
  title: "Applications",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "items",
      title: "Applications",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "application",
          fields: [
            defineField({
              name: "tag",
              title: "Compound used",
              type: "string",
              description: "Shown as a pill on the photograph.",
              validation: (r) => r.required().min(2),
            }),
            defineField({ name: "name", title: "Application", type: "string", validation: (r) => r.required().min(3) }),
            defineField({ name: "body", title: "Description", type: "text", rows: 2, validation: (r) => r.required().min(10) }),
            imageRefField("image", { group: null }),
          ],
          preview: { select: { title: "name", subtitle: "tag" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Applications", (v) => count(v.items, "application")),
});

/* ── Sub-category ─────────────────────────────────────────────────────────── */

/**
 * A product that lives INSIDE a category rather than beside it — the
 * self-adhesive tape under Sponge & Foam. It gets its own heading and its own
 * comparisons but not its own route, which is why it is a block and not a
 * document type.
 *
 * The most complex block in the library at eleven fields across three levels.
 * It is kept as one block rather than split because its parts are meaningless
 * apart: a build-up diagram with no product to belong to renders nothing.
 */
export const subCategory = defineType({
  name: "block.subCategory",
  title: "Product within this category",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "dividerLabel",
      title: "Divider label",
      type: "string",
      description: "The small caption on the rule above this block.",
      group: "options",
    }),
    defineField({
      name: "buildUp",
      title: "Layer build-up",
      type: "object",
      description: "The stack diagram — listed top layer first.",
      fields: [
        defineField({ name: "label", title: "Caption", type: "string", validation: (r) => r.required() }),
        stringListField("layers", "Layers", { min: 2, group: null }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "content",
    }),
    defineField({
      name: "comparisons",
      title: "Comparisons",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "comparison",
          fields: [
            defineField({ name: "label", title: "What is being compared", type: "string", validation: (r) => r.required().min(3) }),
            defineField({
              name: "items",
              title: "Options",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "option",
                  fields: [
                    defineField({ name: "name", type: "string", validation: (r) => r.required().min(3) }),
                    defineField({ name: "tag", title: "Pill beside the name", type: "string" }),
                    defineField({
                      name: "rows",
                      title: "Points",
                      type: "array",
                      of: [
                        defineArrayMember({
                          type: "object",
                          name: "point",
                          fields: [
                            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                            defineField({
                              name: "value",
                              type: "string",
                              description: "Leave empty for a bare point with no value.",
                            }),
                            defineField({
                              name: "caveat",
                              title: "Show as a caveat",
                              type: "boolean",
                              description: "Renders as a limitation rather than a benefit.",
                              initialValue: false,
                            }),
                          ],
                          preview: { select: { title: "label", subtitle: "value" } },
                        }),
                      ],
                      validation: (r) => r.required().min(1),
                    }),
                  ],
                  preview: { select: { title: "name", subtitle: "tag" } },
                }),
              ],
              validation: (r) => r.required().min(2),
            }),
          ],
          preview: {
            select: { title: "label", items: "items" },
            prepare: ({ title, items }) => ({ title, subtitle: count(items, "option") }),
          },
        }),
      ],
      group: "content",
    }),
    defineField({
      name: "note",
      title: "Closing note",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
        defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required().min(20) }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Product within this category"),
});

/* ── Parts grid ───────────────────────────────────────────────────────────── */

/**
 * The parts in this category, as tiles.
 *
 * Carries ONLY its heading copy. The parts themselves come from the document's
 * `anchors` list, filled in by the GROQ projection — because those anchors are
 * also the targets of the 301 redirect map, and an editor maintaining the same
 * list in two places would eventually let the two disagree and silently break
 * old inbound links.
 *
 * So: add this block to decide WHERE the parts appear; edit `anchors` under
 * Search & links to decide WHAT they are.
 */
export const partsGrid = defineType({
  name: "block.partsGrid",
  title: "Parts in this category",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "note",
      title: "Where the parts come from",
      type: "string",
      readOnly: true,
      initialValue: "Linked part cards come from Search & links → Parts in this category. Fill the list below to show plain names instead.",
      group: "options",
    }),
    defineField({
      name: "items",
      title: "Part names",
      description: "The plain list from the content sheet — 16 to 24 names, no links. When filled, it replaces the linked part cards.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "partName",
          fields: [
            defineField({ name: "name", title: "Part", type: "string", validation: (r) => r.required().min(2) }),
            defineField({ name: "availability", title: "Availability", type: "string", description: "e.g. “to drawing” or “standard sizes”." }),
            defineField({ name: "href", title: "Part page", type: "string", description: "The part's own page, e.g. /products/gaskets/epdm — the name becomes the link. Empty for a family with no page." }),
          ],
          preview: { select: { title: "name", subtitle: "availability" } },
        }),
      ],
      group: "content",
    }),
  ],
  preview: blockPreview("Parts in this category", (v) => count(v.items, "part")),
});

export const PRODUCT_BLOCKS = [
  partsGrid,
  materialCards,
  standardsAnswer,
  qualityPanel,
  processTimeline,
  specifyGrid,
  comparePanels,
  compoundSelector,
  densityScale,
  applicationCards,
  subCategory,
];
