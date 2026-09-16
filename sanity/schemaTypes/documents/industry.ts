import { defineArrayMember, defineField, defineType } from "sanity";
import { imageRefField, stringListField } from "../blocks/_shared.ts";
import { schemaTypesField } from "./_marketing.ts";

/**
 * INDUSTRY — the second page type on the page builder.
 *
 * Same two halves as the product category: a fixed hero, and a body that is a
 * block list.
 *
 * Its hero is NOT the product hero, and that is the point of keeping heroes
 * out of the block library. Here the heading is an array of lines with accent
 * indices rather than a single string with a trailing accent — a different
 * shape for a different design. A shared "hero block" would have had to serve
 * both and would have served neither well.
 */

/**
 * Industry pages get a different menu from product pages.
 *
 * The whole point of the allow-list: an editor on an industry page is offered
 * the eight blocks that belong here, not the thirty in the library. The
 * closing band and the FAQ are here; the compound selector and density scale
 * are not, because no industry page has ever had one.
 */
const ALLOWED_BLOCKS = [
  "block.componentTabs",
  "block.industryApplications",
  "block.conditionGrid",
  "block.customPanel",
  "block.qualityCards",
  "block.exportLane",
  "block.industryFaq",
  "block.closingBand",
  // Added for the two new industry sheets (41–42), which are written against
  // the universal blocks rather than the eight above.
  "block.specTable",
  "block.cardGrid",
  "block.richText",
  "block.accordion",
  "block.certificationStrip",
];

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "body", title: "Sections" },
    { name: "meta", title: "Search & links" },
  ],
  fields: [
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "The last part of the URL: /industries/<this>.",
      options: { source: "navLabel", maxLength: 64 },
      validation: (r) => r.required(),
      group: "hero",
    }),
    defineField({
      name: "status",
      title: "Publication status",
      type: "string",
      options: {
        list: [
          { title: "Placeholder — not real content yet", value: "placeholder" },
          { title: "Draft — being written", value: "draft" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "placeholder",
      validation: (r) => r.required(),
      group: "hero",
    }),
    defineField({
      name: "navLabel",
      title: "Short name",
      type: "string",
      description: "Used in menus, cards and breadcrumbs.",
      validation: (r) => r.required().min(2),
      group: "hero",
    }),
    defineField({
      name: "tier",
      title: "Priority",
      type: "number",
      description:
        "1 is a lead sector, 3 is a long-tail one. Drives how prominently the industry is listed elsewhere.",
      options: {
        list: [
          { title: "1 — lead sector", value: 1 },
          { title: "2 — secondary", value: 2 },
          { title: "3 — long tail", value: 3 },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
      group: "hero",
    }),

    /* ── Hero ─────────────────────────────────────────────────────────────── */
    /**
     * The heading as ONE string, alongside the line-by-line version below.
     *
     * Both are needed and they are not redundant: `h1Lines` is what the hero
     * draws, and this flat one is what goes into the structured data Google
     * reads, which has no concept of line breaks. Omitting it was a real bug —
     * every industry document failed validation and silently fell back to its
     * .mdx file, which looked exactly like success.
     */
    defineField({
      name: "h1",
      title: "Heading as one line",
      type: "string",
      description:
        "The same heading as below, written as a single sentence. Used by Google, not shown on the page — so it should read naturally without the line break.",
      validation: (r) => r.required().min(8),
      group: "hero",
    }),
    defineField({
      name: "heroChips",
      title: "Chips under the subhead",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: 'Three short facts, shown uppercase — "EPDM · OZONE & UV" (content sheets 41–42).',
      options: { layout: "tags" },
      group: "hero",
    }),
    defineField({
      name: "badge",
      title: "Badge above the heading",
      type: "string",
      validation: (r) => r.required(),
      group: "hero",
    }),
    stringListField("h1Lines", "Heading lines", {
      min: 1,
      description: "One entry per line of the main heading.",
      group: "hero",
    }),
    defineField({
      name: "h1AccentLines",
      title: "Which heading lines are in accent colour",
      type: "array",
      of: [defineArrayMember({ type: "number" })],
      description: "Line numbers, counting from 0. Leave empty for none.",
      group: "hero",
    }),
    defineField({
      name: "intro",
      title: "Opening paragraph",
      type: "text",
      rows: 3,
      validation: (r) => r.required().min(40),
      group: "hero",
    }),
    defineField({
      name: "hero",
      title: "Hero image",
      type: "object",
      fields: [
        imageRefField("image", { required: true, group: null }),
        defineField({
          name: "alt",
          title: "Description for screen readers",
          type: "string",
          validation: (r) => r.required().min(10),
        }),
      ],
      group: "hero",
    }),
    defineField({
      name: "heroBoost",
      title: "Darken the hero image",
      type: "boolean",
      description:
        "Only for images already faded to black at the source. A normal photograph must NOT be boosted — it comes out muddy.",
      initialValue: false,
      group: "hero",
    }),
    defineField({
      name: "actions",
      title: "Hero buttons",
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
      group: "hero",
    }),

    /* ── Body ─────────────────────────────────────────────────────────────── */
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      description: "The page, in order. Drag to reorder.",
      of: ALLOWED_BLOCKS.map((type) => defineArrayMember({ type })),
      validation: (r) => r.required().min(1),
      group: "body",
    }),

    /* ── Search and links ─────────────────────────────────────────────────── */
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    defineField({
      name: "faqs",
      title: "Questions & answers",
      type: "array",
      description:
        "Shown on the page wherever the Questions & answers block sits, AND submitted to Google as structured data. 40–60 words per answer.",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({ name: "q", title: "Question", type: "string", validation: (r) => r.required().min(8) }),
            defineField({
              name: "a",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (r) => r.required().min(40).max(700),
            }),
          ],
          preview: { select: { title: "q" } },
        }),
      ],
      group: "meta",
    }),
    defineField({
      name: "nonClaims",
      title: "Mandatory wording",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
      description:
        "Sentences that must appear verbatim — the NORSOK/API disclaimers on oil & gas, for example. Rendered at the foot of the page exactly as written. Do not paraphrase these.",
      group: "meta",
    }),
    defineField({
      name: "schemaService",
      title: "Structured data — Service",
      type: "object",
      group: "meta",
      description: "The Service node's own name and description, where they differ from the heading and the meta description (content sheet 41, page-level).",
      fields: [
        defineField({ name: "name", title: "Service name", type: "string" }),
        defineField({ name: "description", title: "One-line description", type: "text", rows: 2 }),
      ],
    }),
    /**
     * INTERNAL LINKING, as data.
     *
     * Present on every content file and rendered today only by the guides —
     * but it is authored content, and a migration that quietly dropped it
     * would lose work nobody would notice was gone until the .mdx files were
     * deleted. Carried across on every type for that reason.
     */
    defineField({
      name: "related",
      title: "Related pages",
      type: "object",
      description:
        "Web addresses of pages this one should link to. Use the last part of the URL only.",
      fields: [
        defineField({
          name: "products",
          title: "Product categories",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          options: { layout: "tags" },
        }),
        defineField({
          name: "industries",
          title: "Industries",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          options: { layout: "tags" },
        }),
        defineField({
          name: "resources",
          title: "Guides",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          options: { layout: "tags" },
        }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "meta",
    }),
    schemaTypesField,
    defineField({
      name: "confirmWithMargo",
      title: "Figures still to be confirmed",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "meta",
    }),
  ],

  preview: {
    select: { title: "navLabel", slug: "slug.current", status: "status", sections: "sections" },
    prepare: ({ title, slug, status, sections }) => ({
      title: title || slug || "Untitled industry",
      subtitle: `${status ?? "placeholder"} · ${
        (sections as unknown[])?.length ?? 0
      } sections · /industries/${slug ?? "?"}`,
    }),
  },
});
