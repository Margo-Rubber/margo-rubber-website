import { defineArrayMember, defineField, defineType } from "sanity";
import {
  BLOCK_GROUPS,
  anchorIdField,
  blockPreview,
  count,
  imageRefField,
  linkObject,
  sectionMetaFields,
  stringListField,
} from "./_shared.ts";

/**
 * INDUSTRY BLOCKS
 *
 * Eight blocks, and none of them reuse the product library. That was not the
 * expectation and it is worth recording why, because the same trap is waiting
 * in every remaining page type.
 *
 * Read as SCHEMAS, several industry sections look like ones that already
 * exist: `applications` has name/body/image, much like the product
 * applications; `conditions` is icon/name/body, much like a card grid. Read as
 * ROUTES, they are different components with different layouts — there are
 * literally two `ApplicationCards` functions in this codebase, taking
 * different props and rendering differently.
 *
 * So the rule the library actually follows is narrower than "similar shapes
 * merge". It is:
 *
 *   Same fields + different presentation  → ONE block with a layout switch.
 *                                           (The product card grid does this.)
 *   Different fields                      → different blocks, however alike
 *                                           they look in the schema.
 *
 * Merging across the second case would mean rewriting components that nine
 * live pages depend on, to save an entry in a menu the editor filters by page
 * type anyway. Not worth it.
 */

/* ── Component tabs ───────────────────────────────────────────────────────── */

/**
 * The products supplied to this sector, as switchable tabs.
 *
 * Order matters: the first tab is the one selected when the page loads, so
 * dragging an item to the top changes what a visitor sees first.
 */
export const componentTabs = defineType({
  name: "block.componentTabs",
  title: "Products for this sector",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "items",
      title: "Products",
      type: "array",
      description: "Each becomes a tab. The first one is open when the page loads.",
      of: [
        defineArrayMember({
          type: "object",
          name: "component",
          fields: [
            defineField({
              name: "key",
              title: "Tab id",
              type: "string",
              description: "Short internal id. Not shown to visitors.",
              validation: (r) => r.required(),
            }),
            defineField({ name: "name", title: "Tab label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", title: "Description", type: "text", rows: 3, validation: (r) => r.required() }),
            stringListField("bullets", "Bullet points", { min: 0, group: null }),
            imageRefField("image", { required: true, group: null }),
            defineField({
              name: "cta",
              title: "Button",
              type: "object",
              fields: [
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
              ],
              validation: (r) => r.required(),
            }),
            defineField({
              name: "group",
              title: "Group heading",
              type: "string",
              description:
                'Optional. Cards with the same heading are listed together under it, e.g. "Fluid path". Leave every card empty for one plain grid.',
            }),
          ],
          preview: { select: { title: "name", subtitle: "group" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    defineField({
      name: "footnote",
      title: "Small print under the cards",
      type: "string",
      description: 'Optional. e.g. "Illustrative product images."',
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Products for this sector", (v) => count(v.items, "tab")),
});

/* ── Applications ─────────────────────────────────────────────────────────── */

/**
 * Where the components end up, as a two-column card grid.
 *
 * Deliberately NOT the product `block.applicationCards`. That one requires a
 * compound tag on every card and renders through a different component. This
 * is the near-identical-looking block the file header warns about.
 */
export const industryApplications = defineType({
  name: "block.industryApplications",
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
            defineField({ name: "name", title: "Application", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", title: "Description", type: "text", rows: 2, validation: (r) => r.required() }),
            imageRefField("image", { group: null }),
          ],
          preview: { select: { title: "name", subtitle: "body" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Applications", (v) => count(v.items, "application")),
});

/* ── Conditions ───────────────────────────────────────────────────────────── */

/**
 * Why generic parts fail in this sector.
 *
 * The icon list is FOUR options, not the site-wide set, because this block
 * draws its own pictograms rather than the shared line icons. Offering the
 * full list here would let an editor pick one that renders as nothing.
 */
export const conditionGrid = defineType({
  name: "block.conditionGrid",
  title: "Operating conditions",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "items",
      title: "Conditions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "condition",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Shield — abrasion, impact", value: "shield" },
                  { title: "Wave — vibration, movement", value: "wave" },
                  { title: "Thermometer — heat, cold", value: "thermo" },
                  { title: "Dust — contamination", value: "dust" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: "name", title: "Condition", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", title: "Why it matters", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "name", subtitle: "body" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    defineField({
      name: "table",
      title: "Table under the cards",
      type: "object",
      description: 'Optional, e.g. "Which compound for which duty". The first cell of each row is its heading.',
      fields: [
        defineField({ name: "caption", title: "Table title", type: "string", validation: (r) => r.required() }),
        stringListField("columns", "Column headings", { min: 2, group: null }),
        defineField({
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "row",
              fields: [stringListField("cells", "Cells, left to right", { min: 2, group: null })],
              preview: { select: { title: "cells.0", subtitle: "cells.1" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Operating conditions", (v) => count(v.items, "condition")),
});

/* ── Custom engineering panel ─────────────────────────────────────────────── */

export const customPanel = defineType({
  name: "block.customPanel",
  title: "Custom engineering",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    stringListField("bullets", "Bullet points", { min: 0 }),
    linkObject("cta", "Button", true),
    imageRefField("image"),
    defineField({
      name: "imageCaption",
      title: "Caption over the image",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
        defineField({ name: "note", type: "string", validation: (r) => r.required() }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "content",
    }),
    defineField({
      name: "steps",
      title: "Numbered process",
      type: "object",
      description: "Optional. Shown in the photo's column when there is no photo, otherwise under the bullets.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "note", title: "Line under the heading", type: "string" }),
        stringListField("items", "Steps, in order", { min: 2, group: null }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Custom engineering"),
});

/* ── Quality cards ────────────────────────────────────────────────────────── */

/**
 * Distinct from the product `block.qualityPanel`, which is a claim, a
 * testimonial and a table of test standards. This is a row of chipped cards
 * plus a list of document links — same subject, different section.
 */
export const qualityCards = defineType({
  name: "block.qualityCards",
  title: "Quality & documentation",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    defineField({
      name: "items",
      title: "Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "qualityCard",
          fields: [
            defineField({
              name: "chip",
              title: "Pill",
              type: "string",
              description: "The small label at the top of the card. Optional — the industry sheets leave it empty.",
            }),
            defineField({ name: "name", title: "Heading", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", title: "Description", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "name", subtitle: "chip" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    defineField({
      name: "links",
      title: "Document links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "docLink",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Quality & documentation", (v) => count(v.items, "card")),
});

/* ── Export lane ──────────────────────────────────────────────────────────── */

export const exportLane = defineType({
  name: "block.exportLane",
  title: "Export lane",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    ...sectionMetaFields(),
    stringListField("paragraphs", "Paragraphs", { min: 0 }),
    defineField({
      name: "rows",
      title: "Facts",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "laneRow",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
      group: "content",
    }),
    defineField({
      name: "card",
      title: "Regions card",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", validation: (r) => r.required() }),
        defineField({ name: "subtitle", type: "string", validation: (r) => r.required() }),
        stringListField("regions", "Regions", { min: 0, group: null }),
        defineField({ name: "footnote", type: "string" }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "content",
    }),
    anchorIdField(),
  ],
  preview: blockPreview("Export lane", (v) => count(v.rows, "fact")),
});

/* ── Industry FAQ ─────────────────────────────────────────────────────────── */

/**
 * The questions themselves live on the DOCUMENT, not on this block, because
 * they also feed the FAQPage structured data whether or not the block is on
 * the page. The block decides where the accordion appears and what heading
 * sits above it; the projection joins the two.
 *
 * Same arrangement as the product parts grid, and for the same reason: one
 * list, used twice, stored once.
 */
export const industryFaq = defineType({
  name: "block.industryFaq",
  title: "Questions & answers",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Label above the heading",
      type: "string",
      description: 'Optional. Defaults to "FREQUENTLY ASKED QUESTIONS".',
      group: "content",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'Optional. Defaults to "Common questions."',
      group: "content",
    }),
    defineField({
      name: "note",
      title: "Where the questions come from",
      type: "string",
      readOnly: true,
      initialValue: "Edit the questions themselves under Search & links.",
      group: "options",
    }),
  ],
  preview: {
    select: { heading: "heading" },
    prepare: ({ heading }) => ({
      title: heading || "Common questions.",
      subtitle: "Questions & answers",
    }),
  },
});

/* ── Closing band ─────────────────────────────────────────────────────────── */

/**
 * Not `block.ctaBand`. This one's heading is a LIST of lines with accent
 * indices rather than a single string, and it carries contact rows the product
 * band has no place for.
 */
export const closingBand = defineType({
  name: "block.closingBand",
  title: "Closing band",
  type: "object",
  groups: BLOCK_GROUPS,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Label above the heading",
      type: "string",
      validation: (r) => r.required(),
      group: "content",
    }),
    stringListField("lines", "Heading lines", {
      min: 1,
      description: "One entry per line of the heading.",
    }),
    defineField({
      name: "accentLines",
      title: "Which lines are in accent colour",
      type: "array",
      of: [defineArrayMember({ type: "number" })],
      description: "Line numbers, counting from 0. Leave empty for none.",
      group: "options",
    }),
    defineField({
      name: "body",
      title: "Paragraph",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({
      name: "actions",
      title: "Buttons",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "action",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Link address", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "variant",
              title: "Button style",
              type: "string",
              options: {
                list: [
                  { title: "Solid", value: "primary" },
                  { title: "Outline", value: "secondary" },
                ],
                layout: "radio",
              },
              initialValue: "primary",
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      validation: (r) => r.required().min(1),
      group: "content",
    }),
    defineField({
      name: "contacts",
      title: "Contact lines",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "contact",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              options: {
                list: [
                  { title: "Phone", value: "phone" },
                  { title: "Email", value: "email" },
                  { title: "Certificate", value: "cert" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: "text", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "text", subtitle: "icon" } },
        }),
      ],
      group: "content",
    }),
  ],
  preview: {
    select: { lines: "lines", actions: "actions" },
    prepare: ({ lines, actions }) => ({
      title: (lines as string[])?.join(" ") || "Closing band",
      subtitle: `Closing band · ${count(actions, "button")}`,
    }),
  },
});

export const INDUSTRY_BLOCKS = [
  componentTabs,
  industryApplications,
  conditionGrid,
  customPanel,
  qualityCards,
  exportLane,
  industryFaq,
  closingBand,
];
