import { defineArrayMember, defineField, defineType } from "sanity";
import { imageRefField, linkObject } from "../blocks/_shared.ts";
import { schemaTypesField } from "./_marketing.ts";

/**
 * PRODUCT CATEGORY — the first page type on the page builder.
 *
 * Eleven pages share it, which is why it is first: a block that works here
 * works eleven times over.
 *
 * The document is in two halves, and the split is the whole design.
 *
 *  · The HERO is fixed structure. It is not a block, cannot be reordered and
 *    cannot be removed, because every category page has exactly one and there
 *    is nowhere else it could go. Making it a block would offer the editor a
 *    choice that has only one correct answer.
 *
 *  · The BODY is a block list. Which sections a page has, and in what order,
 *    is the editor's to decide. How each one looks is not — that lives in the
 *    renderer.
 */

/**
 * The blocks a category page may contain.
 *
 * An ALLOW-LIST, not the whole library. The menu an editor opens is this list,
 * so a short relevant one is the difference between choosing and hunting. The
 * density scale and the cell comparison are here because Sponge & Foam needs
 * them; the homepage's blocks are not, and the homepage will not offer these.
 */
const ALLOWED_BLOCKS = [
  "block.cardGrid",
  "block.comparePanels",
  "block.compoundSelector",
  "block.specTable",
  "block.densityScale",
  "block.materialCards",
  "block.partsGrid",
  "block.processTimeline",
  "block.subCategory",
  "block.applicationCards",
  "block.specifyGrid",
  "block.standardsAnswer",
  "block.qualityPanel",
  "block.propertyList",
  "block.ctaBand",
  // Added for the four new category sheets (36–39): prose panels, the
  // "which do you need" router, and free text.
  "block.accordion",
  "block.routerList",
  "block.richText",
  // The shared certification block and the questions block the same sheets
  // end with.
  "block.certificationStrip",
  "block.industryFaq",
];

export const productCategory = defineType({
  name: "productCategory",
  title: "Product category",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "body", title: "Sections" },
    { name: "catalogue", title: "Catalogue" },
    { name: "meta", title: "Search & links" },
  ],
  fields: [
    /* ── Identity ─────────────────────────────────────────────────────────── */
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description:
        "The last part of the URL: /products/<this>. Changing it breaks every existing link to the page.",
      options: { source: "navLabel", maxLength: 64 },
      validation: (r) => r.required(),
      group: "hero",
    }),
    defineField({
      name: "status",
      title: "Publication status",
      type: "string",
      description:
        "Before launch only 'Published' pages reach Google or the sitemap; once the site is live, every page except 'Draft' does. 'Draft' always stays out of Google — use it to hide a page while it is rewritten.",
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
      description: "Used in menus, cards and breadcrumbs. Keep it short.",
      validation: (r) => r.required().min(2),
      group: "hero",
    }),

    /* ── Hero ─────────────────────────────────────────────────────────────── */
    defineField({
      name: "h1",
      title: "Page heading",
      type: "string",
      validation: (r) => r.required().min(8),
      group: "hero",
    }),
    defineField({
      name: "h1Accent",
      title: "Part of the heading in accent colour",
      type: "string",
      description:
        'The heading splits over two lines with the end in blue. Defaults to the last word, which is wrong for headings ending "& Something" — set it here in that case.',
      validation: (r) =>
        r.custom((value, ctx) => {
          const h1 = (ctx.document as { h1?: string })?.h1;
          if (!value || !h1) return true;
          return h1.endsWith(value)
            ? true
            : "This must be the ending of the page heading, exactly as written there.";
        }),
      group: "hero",
    }),
    defineField({
      name: "intro",
      title: "Opening paragraph",
      type: "text",
      rows: 3,
      // The other half of the pair. Stated on both fields rather than one,
      // because whichever the editor opens first is the one that has to warn
      // them.
      description:
        "If you write a number here as a word — “five compounds”, “eight sections” — check it still matches the figures below.",
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
      name: "heroStats",
      title: "Figures under the intro",
      type: "array",
      /**
       * The warning is here because the failure is silent and has already
       * happened once: the figure was changed to 6 while the opening paragraph
       * still read "Five compounds", and the page contradicted itself in two
       * places a reader sees at the same moment.
       *
       * Nothing can prevent this automatically. The paragraph spells the
       * number as a word, and no rule can know that "Five" refers to the same
       * fact as the figure below it without also firing on every other number
       * in the sentence. So it is a note, deliberately, and it names the exact
       * field to check.
       */
      description:
        "⚠️ Several of these numbers are also written out in the opening paragraph above. Change one and check the other — nothing keeps them in step, and a page that says 6 in the figure and “five” in the sentence is worse than either.",
      of: [
        defineArrayMember({
          type: "object",
          name: "heroStat",
          fields: [
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      group: "hero",
    }),
    defineField({
      name: "heroStatsAlign",
      title: "Figures alignment",
      type: "string",
      options: {
        list: [
          { title: "Centred", value: "center" },
          { title: "Left", value: "left" },
        ],
        layout: "radio",
      },
      initialValue: "center",
      group: "hero",
    }),
    defineField({
      name: "heroEyebrow",
      title: "Line above the heading",
      type: "string",
      description: 'Where the sheet writes its own — "01 · DIAPHRAGMS". Empty shows the certification badge.',
      group: "hero",
    }),
    defineField({
      name: "heroChips",
      title: "Chips under the subhead",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: 'Three short facts, shown uppercase — "8 COMPOUNDS IN-HOUSE" (content sheets 36–39).',
      options: { layout: "tags" },
      group: "hero",
    }),
    linkObject("heroLink", "Extra link in the hero", false, "hero"),
    defineField({
      name: "heroActions",
      title: "Hero buttons",
      type: "array",
      description:
        "Adding buttons here switches the page to the newer layout — centred headings and alternating bands. Leave empty for the original treatment.",
      of: [
        defineArrayMember({
          type: "object",
          name: "heroAction",
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
    defineField({
      name: "heroBreadcrumb",
      title: "Show breadcrumb above the heading",
      type: "boolean",
      initialValue: false,
      group: "hero",
    }),

    /* ── Body ─────────────────────────────────────────────────────────────── */
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      description:
        "The page, in order. Drag to reorder; the alternating background colours follow automatically.",
      of: ALLOWED_BLOCKS.map((type) => defineArrayMember({ type })),
      // A category page with no sections is a hero and nothing else. Required
      // rather than merely discouraged, because publishing one is never
      // intended and the editor should be told at the moment they try.
      validation: (r) => r.required().min(1),
      group: "body",
    }),

    /* ── Catalogue ────────────────────────────────────────────────────────── */
    /**
     * This product line's own catalogue PDF (Nov 2026). With a PDF uploaded
     * the page ends with a catalogue section behind a short form (name,
     * email, company), at the address #catalogue; without one the page has
     * no catalogue section. Empty text fields fall back to wording built from
     * the page's short name.
     */
    defineField({
      name: "catalogue",
      title: "Product-line catalogue",
      type: "object",
      group: "catalogue",
      fields: [
        defineField({
          name: "file",
          title: "Catalogue PDF",
          type: "file",
          options: { accept: "application/pdf" },
          description:
            "The PDF visitors download after filling in the form. Keep it under ~10 MB. Leave empty and the page shows no catalogue section.",
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          description: 'Leave empty for "Download the <product> Catalogue". Wrap words in *asterisks* to colour them.',
        }),
        defineField({ name: "body", title: "Paragraph", type: "text", rows: 3 }),
      ],
    }),

    /* ── Search and links ─────────────────────────────────────────────────── */
    defineField({ name: "seo", title: "Search engine listing", type: "seo", group: "meta" }),
    defineField({
      name: "anchors",
      title: "Parts in this category",
      type: "array",
      description:
        "Feeds the parts grid and gives old URLs somewhere to land. Add the parts grid block to show them.",
      of: [
        defineArrayMember({
          type: "object",
          name: "anchor",
          fields: [
            defineField({
              name: "id",
              title: "Anchor",
              type: "string",
              validation: (r) =>
                r.required().regex(/^[a-z0-9-]+$/, { name: "lowercase-with-hyphens" }),
            }),
            defineField({ name: "label", type: "string", validation: (r) => r.required().min(2) }),
            defineField({
              name: "legacyUrl",
              title: "Old URL this replaces",
              type: "string",
              description: "Optional. Used to build the redirect map.",
            }),
          ],
          preview: { select: { title: "label", subtitle: "id" } },
        }),
      ],
      group: "meta",
    }),
    defineField({
      name: "faqs",
      title: "Questions & answers",
      type: "array",
      description:
        "Appear on the page and are submitted to Google as structured data. 40–60 words per answer.",
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
    defineField({
      name: "service",
      title: "What the line covers",
      description: "The service area and what is not supplied (content sheet 38 §07). Nothing shows while empty.",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "area", title: "Covered", type: "array", of: [defineArrayMember({ type: "string" })] }),
        defineField({ name: "exclusionsHeading", title: "Exclusions heading", type: "string" }),
        defineField({ name: "exclusions", title: "Not supplied", type: "array", of: [defineArrayMember({ type: "string" })] }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "meta",
    }),
    schemaTypesField,
    defineField({
      name: "schemaProduct",
      title: "Product record (structured data)",
      description:
        "How the page describes its product to search engines, where that differs from the heading and the meta description. Leave empty to use those.",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Product name", type: "string" }),
        defineField({ name: "description", title: "One-line description", type: "text", rows: 2 }),
        defineField({
          name: "material",
          title: "Materials",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description: "Only when the list is not exactly the eight compounds in Site settings.",
          options: { layout: "tags" },
        }),
        defineField({
          name: "components",
          title: "Catalogue components",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description: "Named catalogue lines, listed to search engines as a numbered list (Pads, Stoppers & Caps).",
          options: { layout: "tags" },
        }),
        defineField({ name: "componentsName", title: "List name", type: "string", description: 'Default "Catalogue components".' }),
        defineField({ name: "componentsAnchor", title: "List points at", type: "string", description: 'Section id, default "specifications".' }),
      ],
      options: { collapsible: true, collapsed: true },
      group: "meta",
    }),
    defineField({
      name: "confirmWithMargo",
      title: "Figures still to be confirmed",
      type: "array",
      description:
        "Anything on this page Margo has not yet signed off. Listed in the build report so it does not get forgotten.",
      of: [defineArrayMember({ type: "string" })],
      group: "meta",
    }),
  ],

  preview: {
    select: { title: "navLabel", slug: "slug.current", status: "status", sections: "sections" },
    prepare: ({ title, slug, status, sections }) => ({
      title: title || slug || "Untitled category",
      subtitle: `${status ?? "placeholder"} · ${
        (sections as unknown[])?.length ?? 0
      } sections · /products/${slug ?? "?"}`,
    }),
  },
});
